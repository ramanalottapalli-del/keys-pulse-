/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Keyboard, 
  CheckCircle, 
  Activity, 
  Volume2, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  Zap, 
  Tv, 
  Sliders, 
  RotateCcw,
  Maximize2
} from 'lucide-react';

interface LandingPageProps {
  onStartTesting: () => void;
  setActiveTab: (tab: 'home' | 'test' | 'about' | 'faq') => void;
}

export default function LandingPage({ onStartTesting, setActiveTab }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: 'Zero Latency Key Detection',
      description: 'Extremely fast event detection ensures key highlights activate within 5ms of physically pressing down.',
    },
    {
      icon: <Sliders className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: 'Multiple Keyboard Formats',
      description: 'Support for full-size 100%, TKL 80%, ultra-compact 60%, and typical laptop layouts.',
    },
    {
      icon: <Volume2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: 'Acoustic & Audio Feedback',
      description: 'Simulates high-fidelity mechanical click sounds or plays customized harmonic scale chords as you type.',
    },
    {
      icon: <Activity className="h-6 w-6 text-rose-600 dark:text-rose-400" />,
      title: 'Real-Time Logging & Heatmap',
      description: 'Drives deep analytics on typing logs and keys heatmap density overlays to verify double-clicking keys.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      title: '100% Client-Side & Private',
      description: 'Every input event is evaluated strictly in-browser. Zero data is ever sent to servers, ensuring ultimate privacy.',
    },
    {
      icon: <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
      title: 'WPM Typing Test Integration',
      description: 'Includes a testing playground area where you can type sentences to calculate live typing speed (WPM).',
    },
  ];

  const steps = [
    {
      stepNum: '01',
      title: 'Select Layout',
      description: 'Choose from Full-Size, TKL, 60%, or Laptop layouts to match your physical device.',
    },
    {
      stepNum: '02',
      title: 'Press Keys',
      description: 'Type freely. Any key you press highlights instantly and remains memorized in the grid.',
    },
    {
      stepNum: '03',
      title: 'Verify Functionality',
      description: 'Untested keys remain neutral, pressed keys glow green, and dead keys are easily isolated.',
    },
    {
      stepNum: '04',
      title: 'Reset and Re-test',
      description: 'Instantly clear tested memory to verify ghosting (multiple keys pressed simultaneously).',
    },
  ];

  const faqs = [
    {
      q: 'Why does pressing some keys (like F5 or Windows/Command key) open browser menus or OS shortcuts?',
      a: 'This is due to high-priority browser security or operating system-level overrides. To capture as many keys as possible, we block default actions when you are focused on the testing dashboard. However, browser safety policies prevent blocking specific hotkeys like Ctrl+W, Ctrl+T, or Command+Tab.',
    },
    {
      q: 'Does this app support Bluetooth, wireless, and custom mechanical keyboards?',
      a: 'Yes! It supports all USB-wired, Bluetooth wireless, and standard integrated laptop keyboards. As long as your system registers it as a keyboard device, KeysPulse will read and test it.',
    },
    {
      q: 'Do I need to install any drivers, plugins, or software?',
      a: 'No software or browser extensions are required. KeysPulse works entirely inside your modern web browser using standardized Web API key event handlers.',
    },
    {
      q: 'What is keyboard "Ghosting" and how do I test it?',
      a: 'Ghosting is a limitation where some keyboards cannot register multiple keys pressed simultaneously (usually above 3 to 6 keys). You can test this by pressing and holding several keys at once on KeysPulse to see if they all light up.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28" id="hero-section">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.25),rgba(0,0,0,0))] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Tagline */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 border border-blue-200/50 dark:border-blue-800/40"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>High-Fidelity Keyboard Testing</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6"
          >
            The Ultimate Online <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 dark:from-blue-400 dark:via-indigo-400 dark:to-emerald-400">
              Keyboard Keys Tester
            </span>
          </motion.h1>

          {/* Paragraph */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed font-sans"
          >
            Verify every key, check rollover limitations, view heatmaps, and test mechanical switches instantly. Fast, private, responsive, and completely free.
          </motion.p>

          {/* Call to Action */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <button
              id="hero-start-btn"
              onClick={onStartTesting}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base font-bold shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto flex items-center justify-center space-x-2"
            >
              <Keyboard className="h-5 w-5" />
              <span>Start Testing Keyboard</span>
            </button>
            <button
              id="hero-learn-more-btn"
              onClick={() => setActiveTab('about')}
              className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-base font-bold border border-gray-200 dark:border-gray-800 transition-colors w-full sm:w-auto"
            >
              Learn More
            </button>
          </motion.div>

          {/* Decorative mini keycap display */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mx-auto max-w-4xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-4 text-xs font-mono text-gray-400 dark:text-gray-500">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                <span>layout_preview_ok.json</span>
              </div>
            </div>
            {/* Minimal mockup keyboard */}
            <div className="grid grid-cols-12 gap-1.5 md:gap-2 opacity-80 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-8 sm:h-10 rounded-md border border-gray-200 dark:border-gray-800 ${
                    i === 2 || i === 5 || i === 8 
                      ? 'bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400 font-bold' 
                      : 'bg-gray-50 dark:bg-gray-950 text-gray-400 dark:text-gray-600'
                  } flex items-center justify-center text-xs font-semibold`}
                >
                  {i === 2 ? 'Q' : i === 5 ? 'W' : i === 8 ? 'E' : ''}
                </div>
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i + 12} 
                  className={`h-8 sm:h-10 rounded-md border border-gray-200 dark:border-gray-800 ${
                    i === 3 || i === 4 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold' 
                      : 'bg-gray-50 dark:bg-gray-950 text-gray-400 dark:text-gray-600'
                  } flex items-center justify-center text-xs font-semibold`}
                >
                  {i === 3 ? 'A' : i === 4 ? 'S' : ''}
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 transition-colors duration-200" id="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-sans">
              Designed For Perfectionists
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 font-sans">
              Whether you are checking a brand-new mechanical gaming keyboard or verifying your laptop after a water spill, KeysPulse provides all the diagnostics you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div 
                key={i}
                className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 hover:border-blue-500/30 dark:hover:border-blue-500/20 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="p-3 bg-white dark:bg-gray-900 rounded-xl w-fit shadow-sm border border-gray-100 dark:border-gray-800 mb-5 group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-sans">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20" id="how-it-works-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-sans">
              Simple 4-Step Verification
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 font-sans">
              Get diagnostic reports on your physical hardware in under a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-start p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <span className="text-4xl font-extrabold text-blue-600/10 dark:text-blue-400/10 font-mono mb-4 block">
                  {step.stepNum}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-sans">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="py-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-200" id="faq-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-sans flex items-center justify-center space-x-2">
              <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span>Frequently Asked Questions</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 font-sans">
              Everything you need to know about key code testing and browser limitations.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-950/20 transition-all duration-200"
                >
                  <button
                    id={`faq-btn-${idx}`}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900/40 transition-colors"
                  >
                    <span className="pr-4">{faq.q}</span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div 
                      id={`faq-ans-${idx}`}
                      className="p-5 pt-0 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-sans bg-white dark:bg-gray-950"
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <button
              id="view-all-faq-btn"
              onClick={() => setActiveTab('faq')}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center justify-center space-x-1.5 mx-auto"
            >
              <span>View all advanced questions</span>
              <span>→</span>
            </button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400 font-sans">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Keyboard className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-gray-900 dark:text-white">KeysPulse</span>
            <span>| Free Keyboard Test Tool</span>
          </div>
          <div className="flex space-x-6 mb-4 md:mb-0">
            <button id="foot-test" onClick={() => setActiveTab('test')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tester</button>
            <button id="foot-about" onClick={() => setActiveTab('about')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Layouts</button>
            <button id="foot-faq" onClick={() => setActiveTab('faq')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</button>
          </div>
          <div>
            &copy; 2026 keyspulse.com. Completely offline and private. No installation required.
          </div>
        </div>
      </footer>

    </div>
  );
}
