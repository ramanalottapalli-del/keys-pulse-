/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KeyDefinition } from '../types';

// Standard 1u spacer representation
export const createSpacer = (width: number): KeyDefinition => ({
  code: `Spacer_${Math.random().toString(36).substr(2, 5)}`,
  label: '',
  width,
  isSpacing: true,
});

// Row 0 - Function keys
const getFRow = (isLaptop: boolean = false): KeyDefinition[] => [
  { code: 'Escape', label: 'Esc', width: 1 },
  ...(isLaptop ? [] : [createSpacer(0.5)]),
  { code: 'F1', label: 'F1', width: 1 },
  { code: 'F2', label: 'F2', width: 1 },
  { code: 'F3', label: 'F3', width: 1 },
  { code: 'F4', label: 'F4', width: 1 },
  ...(isLaptop ? [] : [createSpacer(0.5)]),
  { code: 'F5', label: 'F5', width: 1 },
  { code: 'F6', label: 'F6', width: 1 },
  { code: 'F7', label: 'F7', width: 1 },
  { code: 'F8', label: 'F8', width: 1 },
  ...(isLaptop ? [] : [createSpacer(0.5)]),
  { code: 'F9', label: 'F9', width: 1 },
  { code: 'F10', label: 'F10', width: 1 },
  { code: 'F11', label: 'F11', width: 1 },
  { code: 'F12', label: 'F12', width: 1 },
];

// Row 1 - Number Row
const getNumberRow = (): KeyDefinition[] => [
  { code: 'Backquote', label: '`', subLabel: '~', width: 1 },
  { code: 'Digit1', label: '1', subLabel: '!', width: 1 },
  { code: 'Digit2', label: '2', subLabel: '@', width: 1 },
  { code: 'Digit3', label: '3', subLabel: '#', width: 1 },
  { code: 'Digit4', label: '4', subLabel: '$', width: 1 },
  { code: 'Digit5', label: '5', subLabel: '%', width: 1 },
  { code: 'Digit6', label: '6', subLabel: '^', width: 1 },
  { code: 'Digit7', label: '7', subLabel: '&', width: 1 },
  { code: 'Digit8', label: '8', subLabel: '*', width: 1 },
  { code: 'Digit9', label: '9', subLabel: '(', width: 1 },
  { code: 'Digit0', label: '0', subLabel: ')', width: 1 },
  { code: 'Minus', label: '-', subLabel: '_', width: 1 },
  { code: 'Equal', label: '=', subLabel: '+', width: 1 },
  { code: 'Backspace', label: 'Backspace', width: 2 },
];

// Row 2 - QWERTY Row
const getQwertyRow = (): KeyDefinition[] => [
  { code: 'Tab', label: 'Tab', width: 1.5 },
  { code: 'KeyQ', label: 'Q', width: 1 },
  { code: 'KeyW', label: 'W', width: 1 },
  { code: 'KeyE', label: 'E', width: 1 },
  { code: 'KeyR', label: 'R', width: 1 },
  { code: 'KeyT', label: 'T', width: 1 },
  { code: 'KeyY', label: 'Y', width: 1 },
  { code: 'KeyU', label: 'U', width: 1 },
  { code: 'KeyI', label: 'I', width: 1 },
  { code: 'KeyO', label: 'O', width: 1 },
  { code: 'KeyP', label: 'P', width: 1 },
  { code: 'BracketLeft', label: '[', subLabel: '{', width: 1 },
  { code: 'BracketRight', label: ']', subLabel: '}', width: 1 },
  { code: 'Backslash', label: '\\', subLabel: '|', width: 1.5 },
];

// Row 3 - ASDF Row
const getAsdfRow = (): KeyDefinition[] => [
  { code: 'CapsLock', label: 'Caps Lock', width: 1.75 },
  { code: 'KeyA', label: 'A', width: 1 },
  { code: 'KeyS', label: 'S', width: 1 },
  { code: 'KeyD', label: 'D', width: 1 },
  { code: 'KeyF', label: 'F', width: 1 },
  { code: 'KeyG', label: 'G', width: 1 },
  { code: 'KeyH', label: 'H', width: 1 },
  { code: 'KeyJ', label: 'J', width: 1 },
  { code: 'KeyK', label: 'K', width: 1 },
  { code: 'KeyL', label: 'L', width: 1 },
  { code: 'Semicolon', label: ';', subLabel: ':', width: 1 },
  { code: 'Quote', label: "'", subLabel: '"', width: 1 },
  { code: 'Enter', label: 'Enter', width: 2.25 },
];

// Row 4 - ZXCV Row
const getZxcvRow = (rightShiftWidth: number = 2.75): KeyDefinition[] => [
  { code: 'ShiftLeft', label: 'Shift', width: 2.25 },
  { code: 'KeyZ', label: 'Z', width: 1 },
  { code: 'KeyX', label: 'X', width: 1 },
  { code: 'KeyC', label: 'C', width: 1 },
  { code: 'KeyV', label: 'V', width: 1 },
  { code: 'KeyB', label: 'B', width: 1 },
  { code: 'KeyN', label: 'N', width: 1 },
  { code: 'KeyM', label: 'M', width: 1 },
  { code: 'Comma', label: ',', subLabel: '<', width: 1 },
  { code: 'Period', label: '.', subLabel: '>', width: 1 },
  { code: 'Slash', label: '/', subLabel: '?', width: 1 },
  { code: 'ShiftRight', label: 'Shift', width: rightShiftWidth },
];

// Row 5 - Modifier Row (Bottom)
const getBottomRow = (spaceWidth: number = 6.25): KeyDefinition[] => [
  { code: 'ControlLeft', label: 'Ctrl', width: 1.25 },
  { code: 'MetaLeft', label: 'Win', width: 1.25 },
  { code: 'AltLeft', label: 'Alt', width: 1.25 },
  { code: 'Space', label: 'Space', width: spaceWidth },
  { code: 'AltRight', label: 'Alt', width: 1.25 },
  { code: 'MetaRight', label: 'Win', width: 1.25 },
  { code: 'ContextMenu', label: 'Menu', width: 1.25 },
  { code: 'ControlRight', label: 'Ctrl', width: 1.25 },
];

// Navigation cluster
const getNavClusterRows = (): KeyDefinition[][] => [
  [
    { code: 'PrintScreen', label: 'PrtSc', width: 1 },
    { code: 'ScrollLock', label: 'ScrLk', width: 1 },
    { code: 'Pause', label: 'Pause', width: 1 },
  ],
  [
    { code: 'Insert', label: 'Ins', width: 1 },
    { code: 'Home', label: 'Home', width: 1 },
    { code: 'PageUp', label: 'PgUp', width: 1 },
  ],
  [
    { code: 'Delete', label: 'Del', width: 1 },
    { code: 'End', label: 'End', width: 1 },
    { code: 'PageDown', label: 'PgDn', width: 1 },
  ],
  [
    createSpacer(1),
    createSpacer(1),
    createSpacer(1),
  ],
  [
    createSpacer(1),
    { code: 'ArrowUp', label: '▲', width: 1 },
    createSpacer(1),
  ],
  [
    { code: 'ArrowLeft', label: '◄', width: 1 },
    { code: 'ArrowDown', label: '▼', width: 1 },
    { code: 'ArrowRight', label: '►', width: 1 },
  ],
];

// Numpad cluster
const getNumpadRows = (): KeyDefinition[][] => [
  [
    createSpacer(1),
    createSpacer(1),
    createSpacer(1),
    createSpacer(1),
  ],
  [
    { code: 'NumLock', label: 'Num', width: 1 },
    { code: 'NumpadDivide', label: '/', width: 1 },
    { code: 'NumpadMultiply', label: '*', width: 1 },
    { code: 'NumpadSubtract', label: '-', width: 1 },
  ],
  [
    { code: 'Numpad7', label: '7', subLabel: 'Home', width: 1 },
    { code: 'Numpad8', label: '8', subLabel: '▲', width: 1 },
    { code: 'Numpad9', label: '9', subLabel: 'PgUp', width: 1 },
    { code: 'NumpadAdd', label: '+', width: 1 },
  ],
  [
    { code: 'Numpad4', label: '4', subLabel: '◄', width: 1 },
    { code: 'Numpad5', label: '5', width: 1 },
    { code: 'Numpad6', label: '6', subLabel: '►', width: 1 },
    { code: 'NumpadEqual', label: '=', width: 1 },
  ],
  [
    { code: 'Numpad1', label: '1', subLabel: 'End', width: 1 },
    { code: 'Numpad2', label: '2', subLabel: '▼', width: 1 },
    { code: 'Numpad3', label: '3', subLabel: 'PgDn', width: 1 },
    { code: 'NumpadEnter', label: 'Enter', width: 1 },
  ],
  [
    { code: 'Numpad0', label: '0', subLabel: 'Ins', width: 2 },
    createSpacer(0), // consumed by double width
    { code: 'NumpadDecimal', label: '.', subLabel: 'Del', width: 1 },
    createSpacer(0), // spacer placeholder
  ],
];

// 1. 60% KEYBOARD LAYOUT
export const SIXTY_LAYOUT: KeyDefinition[][] = [
  [
    { code: 'Escape', label: 'Esc', width: 1 },
    ...getNumberRow().slice(1), // Backquote to Backspace
  ],
  getQwertyRow(),
  getAsdfRow(),
  getZxcvRow(),
  [
    { code: 'ControlLeft', label: 'Ctrl', width: 1.25 },
    { code: 'MetaLeft', label: 'Win', width: 1.25 },
    { code: 'AltLeft', label: 'Alt', width: 1.25 },
    { code: 'Space', label: 'Space', width: 6.25 },
    { code: 'AltRight', label: 'Alt', width: 1.25 },
    { code: 'MetaRight', label: 'Win', width: 1.25 },
    { code: 'ContextMenu', label: 'Menu', width: 1.25 },
    { code: 'ControlRight', label: 'Ctrl', width: 1.25 },
  ],
];

// 2. TKL LAYOUT (Main section + Navigation section)
// We represent TKL by combining rows from Main section and Navigation block
export const TKL_LAYOUT: KeyDefinition[][] = [
  // Row 0
  [
    ...getFRow(),
    createSpacer(0.25),
    ...getNavClusterRows()[0],
  ],
  // Row 1
  [
    ...getNumberRow(),
    createSpacer(0.25),
    ...getNavClusterRows()[1],
  ],
  // Row 2
  [
    ...getQwertyRow(),
    createSpacer(0.25),
    ...getNavClusterRows()[2],
  ],
  // Row 3
  [
    ...getAsdfRow(),
    createSpacer(0.25),
    createSpacer(3), // empty navigation space in Row 3
  ],
  // Row 4
  [
    ...getZxcvRow(),
    createSpacer(0.25),
    ...getNavClusterRows()[4],
  ],
  // Row 5
  [
    ...getBottomRow(),
    createSpacer(0.25),
    ...getNavClusterRows()[5],
  ],
];

// 3. FULL LAYOUT (TKL + Numpad section)
export const FULL_LAYOUT: KeyDefinition[][] = [
  // Row 0
  [
    ...getFRow(),
    createSpacer(0.25),
    ...getNavClusterRows()[0],
    createSpacer(0.25),
    ...getNumpadRows()[0],
  ],
  // Row 1
  [
    ...getNumberRow(),
    createSpacer(0.25),
    ...getNavClusterRows()[1],
    createSpacer(0.25),
    ...getNumpadRows()[1],
  ],
  // Row 2
  [
    ...getQwertyRow(),
    createSpacer(0.25),
    ...getNavClusterRows()[2],
    createSpacer(0.25),
    ...getNumpadRows()[2],
  ],
  // Row 3
  [
    ...getAsdfRow(),
    createSpacer(0.25),
    createSpacer(3),
    createSpacer(0.25),
    ...getNumpadRows()[3],
  ],
  // Row 4
  [
    ...getZxcvRow(),
    createSpacer(0.25),
    ...getNavClusterRows()[4],
    createSpacer(0.25),
    ...getNumpadRows()[4],
  ],
  // Row 5
  [
    ...getBottomRow(),
    createSpacer(0.25),
    ...getNavClusterRows()[5],
    createSpacer(0.25),
    ...getNumpadRows()[5].filter(k => k.width > 0), // filter spacers
  ],
];

// 4. LAPTOP LAYOUT (Compact with navigation on the right)
export const LAPTOP_LAYOUT: KeyDefinition[][] = [
  // Row 0
  [
    ...getFRow(true), // compact F keys
    { code: 'Delete', label: 'Del', width: 1 },
    { code: 'Home', label: 'Home', width: 1 },
  ],
  // Row 1
  [
    ...getNumberRow(),
    { code: 'End', label: 'End', width: 1 },
  ],
  // Row 2
  [
    ...getQwertyRow(),
    { code: 'PageUp', label: 'PgUp', width: 1 },
  ],
  // Row 3
  [
    ...getAsdfRow(),
    { code: 'PageDown', label: 'PgDn', width: 1 },
  ],
  // Row 4
  [
    ...getZxcvRow(1.75), // smaller shift key
    { code: 'ArrowUp', label: '▲', width: 1 },
    createSpacer(1), // spacer to align with the navigation keys above
  ],
  // Row 5
  [
    { code: 'ControlLeft', label: 'Ctrl', width: 1.25 },
    { code: 'Fn', label: 'Fn', width: 1 },
    { code: 'MetaLeft', label: 'Win', width: 1 },
    { code: 'AltLeft', label: 'Alt', width: 1 },
    { code: 'Space', label: 'Space', width: 5.5 },
    { code: 'AltRight', label: 'Alt', width: 1 },
    { code: 'ControlRight', label: 'Ctrl', width: 1 },
    { code: 'ArrowLeft', label: '◄', width: 1 },
    { code: 'ArrowDown', label: '▼', width: 1 },
    { code: 'ArrowRight', label: '►', width: 1 },
  ],
];

// Utility to get all physical (non-spacing) keys in a layout
export function getAllPhysicalKeys(layout: KeyDefinition[][]): KeyDefinition[] {
  const keys: KeyDefinition[] = [];
  layout.forEach(row => {
    row.forEach(key => {
      if (!key.isSpacing) {
        keys.push(key);
      }
    });
  });
  return keys;
}

// Get layout by type
export function getLayout(type: '60' | 'TKL' | 'FULL' | 'LAPTOP'): KeyDefinition[][] {
  switch (type) {
    case '60':
      return SIXTY_LAYOUT;
    case 'TKL':
      return TKL_LAYOUT;
    case 'FULL':
      return FULL_LAYOUT;
    case 'LAPTOP':
      return LAPTOP_LAYOUT;
    default:
      return TKL_LAYOUT;
  }
}
