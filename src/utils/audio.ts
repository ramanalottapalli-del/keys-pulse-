/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SoundType } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    } catch (e) {
      console.warn('Web Audio API is not supported in this browser:', e);
    }
  }
  return audioCtx;
}

// Generate sound based on type and key info
export function playKeySound(soundType: SoundType, rowIdx: number, keyCode: string) {
  if (soundType === 'MUTE') return;

  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if suspended (common browser security for autoplay)
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  try {
    const time = ctx.currentTime;

    if (soundType === 'CLICK') {
      // 1. MECHANICAL SWITCH CLICK SYNTHESIZER
      // Create metallic friction click (noise + highpass)
      const bufferSize = ctx.sampleRate * 0.005; // 5ms noise
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 5000;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.004);

      // Connect noise
      noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      // Create low-pitch mechanical bottom-out (clack)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      // Randomize slightly for realistic mechanical variation
      const pitchOffset = Math.random() * 80 - 40;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220 + pitchOffset, time);
      // Fast drop in pitch as it bottom outs
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.025);

      oscGain.gain.setValueAtTime(0.12, time);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      // Play
      noiseNode.start(time);
      osc.start(time);
      osc.stop(time + 0.04);
    } else if (soundType === 'MUSIC') {
      // 2. MUSICAL PENTATONIC SINE WAVE SYNTESIZER
      // Map rows (0 to 5) to pentatonic scales (C major pentatonic)
      // Row 0 is highest, Row 5 is lowest
      const scales = [
        [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50], // C5 - C6 Pentatonic
        [392.00, 440.00, 523.25, 587.33, 659.25, 783.99], // G4 - G5 Pentatonic
        [293.66, 329.63, 392.00, 440.00, 523.25, 587.33], // D4 - D5 Pentatonic
        [220.00, 261.63, 293.66, 329.63, 392.00, 440.00], // A3 - A4 Pentatonic
        [146.83, 164.81, 196.00, 220.00, 261.63, 293.66], // D3 - D4 Pentatonic
        [98.00,  110.00, 130.81, 146.83, 164.81, 196.00], // G2 - G3 Pentatonic
      ];

      const rowScale = scales[Math.max(0, Math.min(rowIdx, scales.length - 1))];
      // Select note based on code character code, so keys in the same column have different notes!
      const charCodeSum = keyCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const noteIdx = charCodeSum % rowScale.length;
      const frequency = rowScale[noteIdx];

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, time);

      gainNode.gain.setValueAtTime(0.15, time);
      // Smooth bell-like decay
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.45);
    }
  } catch (error) {
    console.error('Failed to play key sound:', error);
  }
}
