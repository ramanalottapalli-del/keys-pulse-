/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Keyboard, Sun, Moon, Volume2, VolumeX, Info, HelpCircle, Activity, LogIn, LogOut } from 'lucide-react';
import { ThemeType, SoundType } from '../types';
import { signInWithGoogle, signOutUser } from '../lib/firebase';
import { User } from 'firebase/auth';

interface NavbarProps {
  activeTab: 'home' | 'test' | 'about' | 'faq';
  setActiveTab: (tab: 'home' | 'test' | 'about' | 'faq') => void;
  theme: ThemeType;
  toggleTheme: () => void;
  sound: SoundType;
  setSound: (sound: SoundType) => void;
  user: User | null;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  sound,
  setSound,
  user,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => setActiveTab('home')}
            id="nav-logo"
          >
            <div className="p-2 bg-blue-600 rounded-lg text-white group-hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
              <Keyboard className="h-6 w-6" />
            </div>
            <span className="font-sans font-bold text-lg sm:text-xl tracking-tight text-gray-900 dark:text-white transition-colors">
              Keys<span className="text-blue-600 dark:text-blue-400">Pulse</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1" id="nav-menu">
            <button
              id="tab-home"
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                activeTab === 'home'
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              Home
            </button>
            <button
              id="tab-test"
              onClick={() => setActiveTab('test')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center space-x-1.5 ${
                activeTab === 'test'
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Keyboard Tester</span>
            </button>
            <button
              id="tab-about"
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center space-x-1.5 ${
                activeTab === 'about'
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </button>
            <button
              id="tab-faq"
              onClick={() => setActiveTab('faq')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center space-x-1.5 ${
                activeTab === 'faq'
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>FAQs</span>
            </button>
          </nav>

          {/* Quick Actions / Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3" id="nav-controls">
            {/* Audio Selector */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-lg p-0.5 border border-gray-200 dark:border-gray-800">
              <button
                id="audio-mute-btn"
                onClick={() => setSound('MUTE')}
                title="Mute sounds"
                className={`p-1.5 rounded-md transition-colors ${
                  sound === 'MUTE'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <VolumeX className="h-4 w-4" />
              </button>
              <button
                id="audio-click-btn"
                onClick={() => setSound('CLICK')}
                title="Mechanical Switch click"
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors flex items-center space-x-1 ${
                  sound === 'CLICK'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Click</span>
              </button>
              <button
                id="audio-music-btn"
                onClick={() => setSound('MUSIC')}
                title="Musical keys sound"
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors flex items-center space-x-1 ${
                  sound === 'MUSIC'
                    ? 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <span className="hidden sm:inline">♫ Music</span>
                <span className="sm:hidden text-xs">♫</span>
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'LIGHT' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* Firebase Auth Trigger */}
            {user ? (
              <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-gray-800 pl-2.5 sm:pl-3">
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'}
                  alt={user.displayName || 'User Profile'}
                  className="h-8 w-8 rounded-full border border-blue-500/30 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[100px] leading-tight">
                    {user.displayName || 'Tester'}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate max-w-[100px] leading-none">
                    Signed In
                  </p>
                </div>
                <button
                  id="auth-logout-btn"
                  onClick={signOutUser}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <button
                id="auth-login-btn"
                onClick={signInWithGoogle}
                className="flex items-center space-x-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Connect Google</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}

            {/* Mobile Menu Action - fallback to testing tab for smaller devices */}
            <button
              id="mobile-tester-shortcut"
              onClick={() => setActiveTab(activeTab === 'test' ? 'home' : 'test')}
              className="md:hidden p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
              title="Toggle Tester"
            >
              <Keyboard className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

