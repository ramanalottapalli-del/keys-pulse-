/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Keyboard, Mail, Heart, Sparkles, ExternalLink } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'home' | 'test' | 'about' | 'faq') => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
      
      {/* 1. Developer Spotlight Banner Section */}
      <div className="bg-gradient-to-r from-blue-50/50 via-orange-50/30 to-indigo-50/50 dark:from-gray-900/40 dark:via-orange-950/5 dark:to-gray-900/40 border-b border-gray-100 dark:border-gray-900/40 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Developer Card Info */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full font-mono">
                    Lead Developer
                  </span>
                  <span className="inline-flex items-center text-xs text-blue-600 dark:text-blue-400 font-bold">
                    <Sparkles className="h-3 w-3 mr-1" /> Core Creator
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1.5 tracking-tight font-sans">
                  M. Ugender Naik
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-md font-sans">
                  Full Stack Engineer & Hardware Enthusiast. Built KeysPulse with high-fidelity sound, cloud diagnostic syncing, and pixel-perfect keyboard layouts.
                </p>
              </div>
            </div>

            {/* Developer Contact/Links */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=techbyyuvan@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold transition-all shadow-sm"
                title="Contact M. Ugender Naik via Gmail"
              >
                <Mail className="h-3.5 w-3.5 text-blue-500" />
                <span>Email Creator</span>
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          
          {/* Brand block */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-600 text-white rounded-lg">
                <Keyboard className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-lg text-gray-900 dark:text-white tracking-tight font-sans">
                KeysPulse
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
              Professional-grade online keyboard diagnostics. Instant response latency, premium soundscapes, and secure cloud diagnostic synchronization.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center gap-3">
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono">
              Diagnostics Menu
            </h4>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <button
                id="footer-nav-test"
                onClick={() => setActiveTab('test')}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                Launch Tester
              </button>
              <button
                id="footer-nav-about"
                onClick={() => setActiveTab('about')}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                About Layouts
              </button>
              <button
                id="footer-nav-faq"
                onClick={() => setActiveTab('faq')}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                Help & FAQ
              </button>
            </div>
          </div>

          {/* Meta/Copyright */}
          <div className="flex flex-col items-center md:items-end gap-1 text-xs text-gray-400 dark:text-gray-500 font-mono">
            <span>&copy; 2026 keyspulse.com</span>
            <span>Completely Private &amp; Secure</span>
            <span className="flex items-center gap-1 mt-1 text-[10px]">
              Crafted with <Heart className="h-3 w-3 text-red-500 fill-current" /> by M. Ugender Naik
            </span>
          </div>

        </div>
      </div>

    </footer>
  );
}
