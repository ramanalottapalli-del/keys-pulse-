/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LayoutType = 'FULL' | 'TKL' | '60' | 'LAPTOP';

export interface KeyDefinition {
  code: string;       // KeyboardEvent.code (e.g. "KeyQ")
  label: string;      // Label displayed (e.g. "Q")
  subLabel?: string;  // Secondary symbol (e.g. "!")
  width: number;      // Width multiplier (1 = standard square key)
  isSpacing?: boolean;// If true, this represents empty space rather than a physical key
}

export type KeyboardRow = (KeyDefinition | { isSpacer: true; width: number })[];

export interface TestedKeyStats {
  total: number;
  tested: number;
  remaining: number;
  percentage: number;
}

export interface KeyPressLog {
  id: string;
  code: string;
  key: string;
  timestamp: string;
  status: 'down' | 'up';
  modifiers: {
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
    meta: boolean;
  };
}

export type SoundType = 'MUTE' | 'CLICK' | 'MUSIC';
export type ThemeType = 'LIGHT' | 'DARK';
