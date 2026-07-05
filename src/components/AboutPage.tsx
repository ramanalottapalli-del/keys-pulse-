/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Info, Cpu, Check, Sliders, ShieldCheck } from 'lucide-react';

interface AboutPageProps {
  onStartTesting: () => void;
}

export default function AboutPage({ onStartTesting }: AboutPageProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        
        {/* Header card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm mb-10"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <Info className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-sans">
              About KeysPulse Diagnostics
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 font-sans">
            KeysPulse was built to provide computer technicians, mechanical keyboard enthusiasts, gamers, and casual office workers with a flawless, zero-configuration diagnostic tool. It runs entirely inside the client browser, safeguarding your security without tracking a single keystroke.
          </p>
          <button
            id="about-start-btn"
            onClick={onStartTesting}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/10 hover:-translate-y-0.5 transition-all duration-200 text-sm"
          >
            Launch Diagnostics Panel
          </button>
        </motion.div>

        {/* Technical section: Code vs Key */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center space-x-2.5 mb-4 text-indigo-600 dark:text-indigo-400">
              <Cpu className="h-5 w-5" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                How Key Detection Works
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Browsers handle keyboard keypresses using two distinct attributes inside the Javascript <code>KeyboardEvent</code> engine:
            </p>
            <ul className="space-y-3.5 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <span className="p-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded mt-0.5 font-semibold text-xs">code</span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Physical Location:</strong> Refers to the physical key position on a standard US QWERTY board (e.g. <code>KeyQ</code> is always top-left row 2). KeysPulse uses this code so keyboard layout structures align exactly.
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <span className="p-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded mt-0.5 font-semibold text-xs">key</span>
                <div>
                  <strong className="text-gray-900 dark:text-white">Logical Value:</strong> Refers to the symbol generated (e.g., <code>q</code> or <code>Q</code>, or <code>@</code> when holding Shift+2). This adjusts depending on your system's language keyboard layouts.
                </div>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center space-x-2.5 mb-4 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Privacy-First Guarantee
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Your security and trust are our absolute top priority. KeysPulse is fully open, static, and client-side:
            </p>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center space-x-2.5">
                <Check className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                <span><strong className="text-gray-800 dark:text-gray-200">No Servers:</strong> No network requests are made when keys are pressed.</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                <span><strong className="text-gray-800 dark:text-gray-200">No Keylogging:</strong> Keystrokes are evaluated inside temporary local React states and destroyed instantly upon refresh or click on "Reset".</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                <span><strong className="text-gray-800 dark:text-gray-200">Zero Cookies:</strong> No active sessions or trackers are persistent.</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Layout details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm mb-10"
        >
          <div className="flex items-center space-x-2.5 mb-5 text-blue-600 dark:text-blue-400">
            <Sliders className="h-5 w-5" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Supported Form Factors
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1.5">100% Full Size</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Standard full layout with all 104/105 keys. Features the functional row, navigation cluster, full arrow configuration, and the numeric numpad on the far right.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1.5">80% Tenkeyless (TKL)</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Most popular layout for gamers. It has the standard alphanumeric keys, function row, and arrows, but removes the right-side numeric numpad block entirely to save desk space.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1.5">60% Ultra-Compact</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Stripped-down mechanical board. Omits F-row, navigation pads, and arrow keys. Arrow navigation and F-actions are triggered via secondary Fn modifiers.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1.5">Laptop Layout</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Designed to mimic typical notebooks (MacBook Pro, Dell XPS, Lenovo ThinkPad). Condenses navigation clusters and uses half-height arrows to conserve chassis space.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Operating System Overrides explanation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 rounded-3xl p-6 md:p-8"
        >
          <h2 className="text-lg font-bold text-amber-900 dark:text-amber-300 mb-2 font-sans">
            Browser Security & OS Overrides
          </h2>
          <p className="text-sm text-amber-800 dark:text-amber-400/90 leading-relaxed font-sans mb-3">
            Please be aware that some keys <strong>cannot</strong> be fully captured by web pages. This is a deliberate, un-bypassable security design of modern web browsers and Operating Systems to prevent malicious sites from capturing system-critical actions.
          </p>
          <p className="text-xs text-amber-700/80 dark:text-amber-400/70 leading-relaxed font-mono">
            Uncapturable keys include: Fn keys (handled purely inside hardware), Power/Sleep buttons, Ctrl+Alt+Del (Windows), Cmd+Tab (MacOS), Ctrl+W (closes browser tab), Ctrl+T (opens new tab), Ctrl+N (opens new window), and some laptop-specific screen brightness or volume keys that do not expose events to browser DOM layers.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
