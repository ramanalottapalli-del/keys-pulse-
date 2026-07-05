/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { KeyDefinition } from '../types';

interface KeyboardLayoutProps {
  layout: KeyDefinition[][];
  activeKeys: Set<string>;
  testedKeys: Set<string>;
  heatmapCount: Record<string, number>;
  showHeatmap: boolean;
  onKeyMouseDown?: (code: string) => void;
  onKeyMouseUp?: (code: string) => void;
}

export default function KeyboardLayout({
  layout,
  activeKeys,
  testedKeys,
  heatmapCount,
  showHeatmap,
  onKeyMouseDown,
  onKeyMouseUp,
}: KeyboardLayoutProps) {
  
  // Find maximum keypress count to scale heatmap colors
  const maxPressCount = Math.max(1, ...Object.values(heatmapCount));

  // Determine key styling class names based on states
  const getKeyClasses = (key: KeyDefinition) => {
    const isPressed = activeKeys.has(key.code);
    const isTested = testedKeys.has(key.code);
    const pressCount = heatmapCount[key.code] || 0;

    // Base layout styles
    let classes = 'h-11 sm:h-12 md:h-14 rounded-lg flex flex-col items-center justify-between py-1 sm:py-1.5 px-1.5 select-none transition-all cursor-pointer border-b-2 md:border-b-[4px] relative overflow-hidden ';

    if (isPressed) {
      // Currently pressed down state (squeezes down)
      classes += 'scale-[0.96] translate-y-[2px] md:translate-y-[4px] border-b-0 bg-blue-600 dark:bg-blue-500 text-white shadow-inner shadow-blue-800/40 ';
    } else if (showHeatmap && isTested && pressCount > 0) {
      // Heatmap mode color spectrum (Light Green -> Yellow -> Orange -> Deep Red)
      const ratio = pressCount / maxPressCount;
      if (ratio <= 0.25) {
        classes += 'bg-emerald-100 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 ';
      } else if (ratio <= 0.5) {
        classes += 'bg-yellow-100 border-yellow-300 dark:bg-yellow-950/40 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300 ';
      } else if (ratio <= 0.75) {
        classes += 'bg-orange-100 border-orange-300 dark:bg-orange-950/40 dark:border-orange-800 text-orange-800 dark:text-orange-300 ';
      } else {
        classes += 'bg-red-100 border-red-300 dark:bg-red-950/40 dark:border-red-800 text-red-800 dark:text-red-300 ';
      }
    } else if (isTested) {
      // Tested (glowy green success state)
      classes += 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white border-emerald-700 dark:border-emerald-800 shadow-sm shadow-emerald-500/20 ';
    } else {
      // Untested default keycap styles
      classes += 'bg-white hover:bg-gray-50 border-gray-300 dark:border-gray-900 text-gray-800 dark:text-gray-200 bg-gray-50/50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800/60 ';
    }

    return classes;
  };

  // Check if a key label is extremely compact (like function keys or letters) or word-length
  const getLabelClasses = (label: string) => {
    if (label.length > 3) {
      return 'text-[9px] sm:text-xs font-semibold leading-none self-start mt-0.5 uppercase tracking-tight';
    }
    return 'text-xs sm:text-sm md:text-base font-bold leading-tight align-middle';
  };

  return (
    <div className="w-full flex flex-col gap-1 sm:gap-1.5 select-none" id="keyboard-visual-grid">
      {layout.map((row, rowIdx) => (
        <div key={rowIdx} className="flex flex-row gap-1 sm:gap-1.5 w-full justify-center">
          {row.map((key, keyIdx) => {
            // Handle spacing placeholders
            if (key.isSpacing) {
              return (
                <div
                  key={`space-${rowIdx}-${keyIdx}`}
                  style={{
                    flexGrow: key.width,
                    flexShrink: 0,
                    flexBasis: 0,
                  }}
                  className="pointer-events-none opacity-0"
                />
              );
            }

            const pressCount = heatmapCount[key.code] || 0;

            return (
              <div
                key={key.code}
                id={`vkey-${key.code}`}
                style={{
                  flexGrow: key.width,
                  flexShrink: 0,
                  flexBasis: 0,
                }}
                onMouseDown={() => onKeyMouseDown && onKeyMouseDown(key.code)}
                onMouseUp={() => onKeyMouseUp && onKeyMouseUp(key.code)}
                onMouseLeave={() => onKeyMouseUp && onKeyMouseUp(key.code)}
                className={getKeyClasses(key)}
                title={`Key: ${key.label} (${key.code}) Pressed: ${pressCount} times`}
              >
                {/* Secondary/Sub character label on top (e.g. symbols like ! on 1) */}
                <div className="w-full flex justify-between items-center text-[9px] sm:text-[10px] md:text-xs font-medium font-mono text-gray-400 dark:text-gray-500">
                  <span>{key.subLabel || ''}</span>
                  {showHeatmap && pressCount > 0 && (
                    <span className="bg-gray-100 dark:bg-gray-800 text-[8px] px-1 rounded text-gray-500 font-bold">
                      {pressCount}
                    </span>
                  )}
                </div>

                {/* Primary label centered/bottom */}
                <span className={`${getLabelClasses(key.label)}`}>
                  {key.label}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
