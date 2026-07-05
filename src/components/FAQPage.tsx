/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Search, Keyboard, Volume2, ShieldAlert } from 'lucide-react';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqList = [
    {
      q: "Why isn't my key being detected in KeysPulse?",
      a: "If a key doesn't highlight when pressed, it could be due to: 1) Hardware failure (broken switch, dirt under keycap, or torn membrane); 2) Operating System interception (such as Fn keys or media keys); 3) The key is disabled in custom keyboard software (e.g., Logitech G HUB, Razer Synapse). Try testing the same key on a different computer to see if it registers.",
      category: "Hardware / Troubleshooting",
    },
    {
      q: "Does this app work on laptop keyboards?",
      a: "Yes! KeysPulse fully supports laptop keyboards. We even provide a specialized 'Laptop' layout configuration that mirrors standard notebook keyboards (such as MacBooks, Lenovo ThinkPads, and Dell XPS) to make testing compact layouts easy and natural.",
      category: "Layouts",
    },
    {
      q: "Does it support high-end gaming keyboards?",
      a: "Absolutely. KeysPulse handles high polling rate mechanical gaming keyboards (1000Hz, 4000Hz, or 8000Hz) with extreme ease, registering simultaneous key presses so you can test key rollover (NKRO) without lagging.",
      category: "Hardware / Troubleshooting",
    },
    {
      q: "Is there any software, plugin, or driver installed?",
      a: "No! KeysPulse is a 100% web-based tool. There is nothing to download or install. It operates entirely on-the-fly inside your browser's sandboxed environment, keeping your system completely clean.",
      category: "General",
    },
    {
      q: "What is Keyboard 'Ghosting' and 'Key Rollover' (NKRO)?",
      a: "Ghosting is when a keyboard fails to register a keypress because other surrounding keys are being held down. Key Rollover (specifically N-Key Rollover or NKRO) is a feature on gaming and mechanical keyboards allowing you to press an unlimited number of keys simultaneously. You can test this by holding down 6 or more keys at once on KeysPulse to see if they all highlight simultaneously.",
      category: "Hardware / Troubleshooting",
    },
    {
      q: "Why can't I capture keys like Alt+Tab, Ctrl+W, or Cmd+Q?",
      a: "These key combinations are intercepted directly by your Operating System or Web Browser at a kernel level before they ever reach the webpage's DOM. Allowing web pages to block keys like Alt+Tab or Ctrl+W would be a major security hazard, so browsers prevent blocking them.",
      category: "General",
    },
    {
      q: "How does the keyboard heatmap work?",
      a: "The heatmap logs the frequency of keystrokes. When you toggle the heatmap option on the tester, keys change colors dynamically based on how many times they have been pressed during your testing session. This helps you identify sticky switches or keys that may be firing multiple times (double-clicking).",
      category: "Features",
    },
    {
      q: "Is my typing data secure and private?",
      a: "Absolutely. We do not store, track, or transmit any of your keystrokes. All key detection runs locally in your device's browser memory (using local React state). Once you close the tab, refresh, or hit 'Reset', all data is permanently deleted.",
      category: "General",
    },
  ];

  const filteredFaqs = faqList.filter(
    faq =>
      faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        
        {/* FAQ Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl mb-4"
          >
            <HelpCircle className="h-8 w-8" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-sans tracking-tight">
            Knowledge Base & FAQ
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-sans">
            Find answers to common technical queries, browser restrictions, and hardware diagnostics.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-10" id="faq-search-box">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input
            id="faq-search-input"
            type="text"
            placeholder="Search FAQs (e.g. ghosting, laptop, Mac...)"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white shadow-sm transition-all"
          />
        </div>

        {/* FAQ list */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition-all"
                >
                  <button
                    id={`faq-page-btn-${idx}`}
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div>
                      <span className="inline-block px-2.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-semibold rounded-md mb-2 font-mono">
                        {faq.category}
                      </span>
                      <h3 className="font-bold text-gray-900 dark:text-white leading-snug font-sans">
                        {faq.q}
                      </h3>
                    </div>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400 ml-4">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div 
                      id={`faq-page-ans-${idx}`}
                      className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-sans"
                    >
                      {faq.a}
                    </div>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl">
              <ShieldAlert className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-white">No results found</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Try searching for general keywords like "key", "layout", or "rollover".
              </p>
            </div>
          )}
        </div>

        {/* Troubleshooter box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 rounded-3xl p-6 md:p-8 text-center"
        >
          <h2 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2 font-sans flex items-center justify-center space-x-2">
            <Keyboard className="h-5 w-5" />
            <span>Still having keyboard issues?</span>
          </h2>
          <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed max-w-2xl mx-auto font-sans">
            If multiple keys fail to register, you may have a hardware trace failure (common in spilled keyboards where whole rows or columns stop working). If the keyboard is custom-built, ensure switches are properly seated in their hotswap sockets and the pins are not bent.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
