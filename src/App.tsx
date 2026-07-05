/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import KeyboardTester from './components/KeyboardTester';
import AboutPage from './components/AboutPage';
import FAQPage from './components/FAQPage';
import { ThemeType, SoundType } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'test' | 'about' | 'faq'>('home');
  const [theme, setTheme] = useState<ThemeType>('DARK'); // Default to Dark as mechanical keyboards have a dark aesthetic
  const [sound, setSound] = useState<SoundType>('CLICK');
  const [user, setUser] = useState<User | null>(null);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Synchronize Dark Mode Class on Document root
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'DARK') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'LIGHT' ? 'DARK' : 'LIGHT'));
  };

  const handleStartTesting = () => {
    setActiveTab('test');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200 font-sans">
      
      {/* Universal header navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        sound={sound}
        setSound={setSound}
        user={user}
      />

      {/* Main Container with smooth fading layout transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === 'home' && (
              <LandingPage 
                onStartTesting={handleStartTesting} 
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'test' && (
              <KeyboardTester 
                sound={sound}
                user={user}
              />
            )}
            {activeTab === 'about' && (
              <AboutPage 
                onStartTesting={handleStartTesting}
              />
            )}
            {activeTab === 'faq' && (
              <FAQPage />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

