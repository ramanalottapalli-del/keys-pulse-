/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  RotateCcw, 
  Activity, 
  Layout, 
  Terminal, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Sparkles,
  RefreshCw,
  Keyboard,
  Cloud,
  Lock
} from 'lucide-react';
import { LayoutType, KeyDefinition, TestedKeyStats, KeyPressLog, SoundType } from '../types';
import { getLayout, getAllPhysicalKeys } from '../utils/layouts';
import { playKeySound } from '../utils/audio';
import KeyboardLayout from './KeyboardLayout';
import { User } from 'firebase/auth';
import { saveTestSession, getTestSessions, deleteTestSession, TestSessionData } from '../lib/firebase';

interface KeyboardTesterProps {
  sound: SoundType;
  user: User | null;
}

const TYPING_PRINTS = [
  "The quick brown fox jumps over the lazy dog.",
  "Linear red switches offer smooth actuation, while tactile brown switches offer a subtle bump.",
  "Keycaps are manufactured using double-shot injection molding with either ABS or PBT plastic.",
  "Tenkeyless keyboards save valuable desk space by removing the right-hand numeric pad."
];

export default function KeyboardTester({ sound, user }: KeyboardTesterProps) {
  // Config States
  const [layoutType, setLayoutType] = useState<LayoutType>('TKL');
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Firebase Cloud States
  const [sessions, setSessions] = useState<TestSessionData[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Testing States
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [testedKeys, setTestedKeys] = useState<Set<string>>(new Set());
  const [heatmapCount, setHeatmapCount] = useState<Record<string, number>>({});
  const [lastPressedKey, setLastPressedKey] = useState<{ code: string; key: string; time: string } | null>(null);
  const [pressLogs, setPressLogs] = useState<KeyPressLog[]>([]);

  // Typing Test States
  const [enableTypingTest, setEnableTypingTest] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [typingStats, setTypingStats] = useState({ wpm: 0, accuracy: 100, correct: 0, total: 0 });
  const typingStartTime = useRef<number | null>(null);

  // Get current physical keys
  const layout = useMemo(() => getLayout(layoutType), [layoutType]);
  
  const physicalKeys = useMemo(() => getAllPhysicalKeys(layout), [layout]);
  
  const allPhysicalKeyCodes = useMemo(() => {
    return new Set(physicalKeys.map(k => k.code));
  }, [physicalKeys]);

  // Create lookup map of code -> row index for row-based sound frequency map
  const keyRowMap = useMemo(() => {
    const map: Record<string, number> = {};
    layout.forEach((row, rowIdx) => {
      row.forEach(key => {
        if (!key.isSpacing) {
          map[key.code] = rowIdx;
        }
      });
    });
    return map;
  }, [layout]);

  // Derive Stats
  const stats: TestedKeyStats = useMemo(() => {
    const total = physicalKeys.length;
    // Count how many keys in the layout have been registered in testedKeys
    const tested = physicalKeys.filter(k => testedKeys.has(k.code)).length;
    const remaining = total - tested;
    const percentage = total > 0 ? Math.round((tested / total) * 100) : 0;
    return { total, tested, remaining, percentage };
  }, [physicalKeys, testedKeys]);

  // Antistick safety when window loses focus
  useEffect(() => {
    const handleBlur = () => {
      setActiveKeys(new Set());
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  // Main Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Direct typing bypass check
      const activeEl = document.activeElement;
      const isTypingInput = activeEl?.id === 'typing-input';
      const isOtherInput = activeEl && 
        (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA') && 
        activeEl.id !== 'typing-input';

      if (isOtherInput) {
        // If focused in some external dropdown or unrelated text field, let it work normally
        return;
      }

      // Intercept browser hotkeys (such as F1, F3, F5, Tab, Backspace, Space, Arrow keys, etc.) to test them safely
      if (!isTypingInput) {
        // Exempt critical development tool keys
        if (e.code !== 'F12' && !(e.ctrlKey && e.code === 'KeyR') && !(e.metaKey && e.code === 'KeyR')) {
          e.preventDefault();
        }
      } else {
        // Inside our typing speed input, let basic typing through, but block page scrolling Space or Tab
        if (e.code === 'Tab' || e.code === 'Space' && activeEl?.id === 'typing-input') {
          // Block focus switching or jump-scrolling inside input
        }
      }

      const code = e.code;

      // Update currently pressing
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.add(code);
        return next;
      });

      // Update Heatmap increment
      setHeatmapCount(prev => ({
        ...prev,
        [code]: (prev[code] || 0) + 1
      }));

      // Update verified tested keys
      setTestedKeys(prev => {
        const next = new Set(prev);
        if (allPhysicalKeyCodes.has(code)) {
          next.add(code);
        }
        return next;
      });

      // Play Sound
      const rowIdx = keyRowMap[code] ?? 2;
      playKeySound(sound, rowIdx, code);

      // Log display stats
      setLastPressedKey({
        code: e.code,
        key: e.key,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      });

      // Push event row into log feed
      setPressLogs(prev => {
        const newLog: KeyPressLog = {
          id: Math.random().toString(),
          code: e.code,
          key: e.key,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
          status: 'down',
          modifiers: {
            ctrl: e.ctrlKey,
            alt: e.altKey,
            shift: e.shiftKey,
            meta: e.metaKey
          }
        };
        return [newLog, ...prev.slice(0, 14)]; // Cap log at 15 entries
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code;
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [layout, keyRowMap, sound, allPhysicalKeyCodes]);

  // Reset Test Button handler
  const resetTester = () => {
    setActiveKeys(new Set());
    setTestedKeys(new Set());
    setHeatmapCount({});
    setLastPressedKey(null);
    setPressLogs([]);
    resetTypingTest();
  };

  // Virtual Key simulation for mouse testing
  const handleVirtualMouseDown = (code: string) => {
    setActiveKeys(prev => {
      const next = new Set(prev);
      next.add(code);
      return next;
    });

    setHeatmapCount(prev => ({
      ...prev,
      [code]: (prev[code] || 0) + 1
    }));

    setTestedKeys(prev => {
      const next = new Set(prev);
      next.add(code);
      return next;
    });

    const rowIdx = keyRowMap[code] ?? 2;
    playKeySound(sound, rowIdx, code);

    setLastPressedKey({
      code,
      key: code.replace('Key', '').replace('Digit', ''),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
    });
  };

  const handleVirtualMouseUp = (code: string) => {
    setActiveKeys(prev => {
      const next = new Set(prev);
      next.delete(code);
      return next;
    });
  };

  // WPM Typing Speed Engine Handlers
  const handleTypingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const targetQuote = TYPING_PRINTS[quoteIdx];
    
    // Start timing on first keystroke
    if (!typingStartTime.current && val.length > 0) {
      typingStartTime.current = Date.now();
    }

    setTypedText(val);

    // Calculate accuracy and WPM
    let correctChars = 0;
    const totalTyped = val.length;

    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetQuote[i]) {
        correctChars++;
      }
    }

    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;
    
    // Calculate Speed WPM: 1 word = 5 characters
    let wpm = 0;
    if (typingStartTime.current && totalTyped > 0) {
      const elapsedMinutes = (Date.now() - typingStartTime.current) / 60000;
      if (elapsedMinutes > 0) {
        wpm = Math.round((correctChars / 5) / elapsedMinutes);
      }
    }

    setTypingStats({
      wpm,
      accuracy,
      correct: correctChars,
      total: totalTyped
    });
  };

  const nextQuote = () => {
    setQuoteIdx(prev => (prev + 1) % TYPING_PRINTS.length);
    resetTypingTest();
  };

  const resetTypingTest = () => {
    setTypedText('');
    typingStartTime.current = null;
    setTypingStats({ wpm: 0, accuracy: 100, correct: 0, total: 0 });
  };

  // Load saved sessions from cloud (Firestore)
  const loadSessions = async () => {
    if (!user) return;
    setIsLoadingSessions(true);
    try {
      const data = await getTestSessions();
      setSessions(data || []);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Sync sessions when user changes
  useEffect(() => {
    if (user) {
      loadSessions();
    } else {
      setSessions([]);
    }
  }, [user]);

  // Save diagnostic report
  const handleSaveSession = async () => {
    if (!user) {
      setSaveMessage('Please login with Google first!');
      setTimeout(() => setSaveMessage(null), 4000);
      return;
    }
    if (stats.tested === 0) {
      setSaveMessage('Please test some keys first!');
      setTimeout(() => setSaveMessage(null), 4000);
      return;
    }
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
      await saveTestSession({
        id: sessionId,
        layout: layoutType,
        totalKeys: stats.total,
        testedKeysCount: stats.tested,
        percentage: stats.percentage,
        wpm: enableTypingTest ? typingStats.wpm : undefined,
        accuracy: enableTypingTest ? typingStats.accuracy : undefined,
      });
      setSaveMessage('Report successfully saved to cloud!');
      loadSessions();
      setTimeout(() => setSaveMessage(null), 4000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveMessage('Failed to save session.');
      setTimeout(() => setSaveMessage(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete saved session
  const handleDeleteSession = async (id: string) => {
    try {
      await deleteTestSession(id);
      loadSessions();
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-200">
      
      {/* 1. Header Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <Layout className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white font-sans">
              Hardware Diagnostic Panel
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-sans mt-0.5">
              Press any key on your physical keyboard to start verification.
            </p>
          </div>
        </div>

        {/* Configurations controllers */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Layout Selector */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-sans">Layout:</span>
            <select
              id="layout-selector"
              value={layoutType}
              onChange={e => {
                setLayoutType(e.target.value as LayoutType);
                resetTester();
              }}
              className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-white text-xs font-bold py-2 px-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="FULL">Full Size (100%)</option>
              <option value="TKL">Tenkeyless (TKL 80%)</option>
              <option value="60">Compact (60%)</option>
              <option value="LAPTOP">Laptop (75%)</option>
            </select>
          </div>

          {/* Heatmap overlay switch */}
          <button
            id="heatmap-toggle"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 border transition-all ${
              showHeatmap
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            title="Toggle heatmap color spectrum based on press volume"
          >
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            <span>Heatmap Overlay</span>
          </button>

          {/* Save Session button */}
          <button
            id="save-session-btn"
            onClick={handleSaveSession}
            disabled={isSaving}
            className={`px-3 py-2 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all ${
              isSaving
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10 hover:-translate-y-0.5 cursor-pointer'
            }`}
            title={user ? "Save current test results to your cloud account" : "Connect Google to save report"}
          >
            {isSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Cloud className="h-3.5 w-3.5" />}
            <span>Save Report</span>
          </button>

          {/* Reset button */}
          <button
            id="reset-tester-btn"
            onClick={resetTester}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-red-500/10 hover:-translate-y-0.5 transition-all cursor-pointer"
            title="Reset testing logs and stats"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Test</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-3 rounded-xl text-xs font-bold text-center border ${
            saveMessage.includes('successfully') || saveMessage.includes('logged')
              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30 text-blue-600 dark:text-blue-400'
          }`}
        >
          {saveMessage}
        </motion.div>
      )}

      {/* 2. Diagnostic Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Stat 1: Completion */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block font-mono">
              Completion Progress
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1 block">
              {stats.percentage}%
            </span>
          </div>
          {/* Small gauge */}
          <div className="relative h-14 w-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                className="stroke-gray-100 dark:stroke-gray-800 fill-none"
                strokeWidth="4"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                className="stroke-blue-600 dark:stroke-blue-400 fill-none transition-all duration-300"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - stats.percentage / 100)}`}
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-blue-600 dark:text-blue-400 font-sans">
              {stats.percentage}%
            </span>
          </div>
        </div>

        {/* Stat 2: Keys Tested */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block font-mono">
            Keys Verified
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {stats.tested}
            </span>
            <span className="text-xs text-gray-400">
              of {stats.total} total
            </span>
          </div>
          {/* Progress bar line */}
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              style={{ width: `${stats.percentage}%` }}
              className="bg-emerald-500 h-full rounded-full transition-all duration-300" 
            />
          </div>
        </div>

        {/* Stat 3: Keys Remaining */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block font-mono">
            Remaining Keys
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {stats.remaining}
            </span>
            <span className="text-xs text-gray-400">
              keys left
            </span>
          </div>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 block mt-3 flex items-center space-x-1 font-sans">
            <AlertCircle className="h-3 w-3 text-blue-500" />
            <span>Target every key cap to finish</span>
          </span>
        </div>

        {/* Stat 4: Last pressed key */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block font-mono">
            Live Keystroke
          </span>
          {lastPressedKey ? (
            <div className="flex items-center justify-between mt-1">
              <div>
                <span className="text-lg font-bold text-gray-900 dark:text-white block font-sans truncate max-w-[140px]">
                  {lastPressedKey.key === " " ? "Space" : lastPressedKey.key}
                </span>
                <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 block">
                  code: {lastPressedKey.code}
                </span>
              </div>
              <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-lg font-mono">
                {lastPressedKey.time}
              </span>
            </div>
          ) : (
            <span className="text-sm font-semibold text-gray-400 dark:text-gray-600 block mt-2 font-sans italic">
              Waiting for press...
            </span>
          )}
        </div>

      </div>

      {/* 3. Keyboard Container Card (Scroll locked for narrow screens) */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-4 md:p-6 shadow-sm mb-8 relative">
        
        {/* Horizontal scroll support indicator on mobile */}
        <div className="xl:hidden flex items-center justify-center space-x-2 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 p-2.5 rounded-xl text-xs font-semibold mb-4 border border-blue-100 dark:border-blue-900/40">
          <Keyboard className="h-4 w-4 animate-bounce" />
          <span>Layout is scrollable sideways. Rotate device to Landscape for best desktop size mapping.</span>
        </div>

        {/* Scroll wrapping element */}
        <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          <div className="min-w-[900px] xl:min-w-0">
            <KeyboardLayout
              layout={layout}
              activeKeys={activeKeys}
              testedKeys={testedKeys}
              heatmapCount={heatmapCount}
              showHeatmap={showHeatmap}
              onKeyMouseDown={handleVirtualMouseDown}
              onKeyMouseUp={handleVirtualMouseUp}
            />
          </div>
        </div>

        {/* Finished layout prompt overlay */}
        {stats.percentage === 100 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              <div>
                <h3 className="font-bold text-emerald-900 dark:text-emerald-300">100% Keys Verified!</h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">All registered physical layout keys are fully functional. No dead zones detected.</p>
              </div>
            </div>
            <button
              id="alert-reset-btn"
              onClick={resetTester}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Verify Again</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* 4. Split Screen features: Playground Typing Test & Debug Event Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Grid Column 1: WPM Typing Test (Monkeytype inspired) */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-extrabold text-gray-900 dark:text-white font-sans">
                  Keystroke Speed & WPM Tester
                </h2>
              </div>
              <button
                id="wpm-toggle-btn"
                onClick={() => setEnableTypingTest(!enableTypingTest)}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                  enableTypingTest
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                }`}
              >
                {enableTypingTest ? 'Disable Test' : 'Enable WPM Test'}
              </button>
            </div>

            {enableTypingTest ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Type the quote below to record speeds:</span>
                  <button
                    id="next-quote-btn"
                    onClick={nextQuote}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 font-bold"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Change Quote</span>
                  </button>
                </div>

                {/* Simulated Monkeytype quote preview */}
                <div className="p-4 bg-gray-50 dark:bg-gray-950/50 rounded-xl font-mono text-base md:text-lg leading-relaxed select-none border border-gray-100 dark:border-gray-900/40 relative">
                  {TYPING_PRINTS[quoteIdx].split('').map((char, index) => {
                    let colorClass = 'text-gray-400 dark:text-gray-600'; // Untyped
                    if (index < typedText.length) {
                      colorClass = typedText[index] === char 
                        ? 'text-emerald-500 font-bold' // Correct
                        : 'text-red-500 font-bold underline decoration-red-500'; // Incorrect
                    }
                    return (
                      <span key={index} className={`${colorClass}`}>
                        {char}
                      </span>
                    );
                  })}
                </div>

                {/* Input box */}
                <div className="relative">
                  <input
                    id="typing-input"
                    type="text"
                    value={typedText}
                    onChange={handleTypingInput}
                    placeholder="Click here and start typing quote..."
                    className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white font-mono shadow-inner"
                  />
                  {typedText.length > 0 && (
                    <button
                      id="reset-wpm-btn"
                      onClick={resetTypingTest}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400 dark:text-gray-600 font-sans flex flex-col items-center justify-center">
                <Keyboard className="h-10 w-10 text-gray-300 dark:text-gray-700 mb-2" />
                <p className="text-sm">Typing speed tests are disabled by default.</p>
                <button
                  id="wpm-enable-placeholder"
                  onClick={() => setEnableTypingTest(true)}
                  className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Enable and start Typing Speed Test (WPM) →
                </button>
              </div>
            )}
          </div>

          {/* Speed stats box */}
          {enableTypingTest && (
            <div className="grid grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-800 pt-5 mt-6 text-center">
              <div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block font-mono">
                  Speed (WPM)
                </span>
                <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block font-mono">
                  {typingStats.wpm}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block font-mono">
                  Accuracy %
                </span>
                <span className={`text-xl sm:text-2xl font-black mt-1 block font-mono ${
                  typingStats.accuracy >= 95 ? 'text-emerald-500' : 'text-amber-500'
                }`}>
                  {typingStats.accuracy}%
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block font-mono">
                  Progress
                </span>
                <span className="text-xl sm:text-2xl font-black text-gray-700 dark:text-gray-300 mt-1 block font-mono">
                  {typingStats.total}/{TYPING_PRINTS[quoteIdx].length}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Grid Column 2: Event Feed Debug Console */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
              <Terminal className="h-5 w-5 text-gray-500" />
              <h2 className="text-base font-extrabold text-gray-900 dark:text-white font-sans">
                Keystroke Event Feed
              </h2>
            </div>

            {/* Event rows list */}
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin font-mono text-[10px] md:text-xs">
              {pressLogs.length > 0 ? (
                pressLogs.map(log => (
                  <div 
                    key={log.id} 
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-900/20"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">KEY_DN</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        {log.key === ' ' ? 'Space' : log.key}
                      </span>
                      <span className="text-gray-400">({log.code})</span>
                    </div>

                    {/* Active modifier badges */}
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      {log.modifiers.ctrl && <span className="bg-gray-200 dark:bg-gray-800 text-[8px] px-1 rounded">Ctrl</span>}
                      {log.modifiers.alt && <span className="bg-gray-200 dark:bg-gray-800 text-[8px] px-1 rounded">Alt</span>}
                      {log.modifiers.shift && <span className="bg-gray-200 dark:bg-gray-800 text-[8px] px-1 rounded">Shift</span>}
                      {log.modifiers.meta && <span className="bg-gray-200 dark:bg-gray-800 text-[8px] px-1 rounded">Win</span>}
                      <span className="text-[9px] text-gray-400 ml-1 font-mono">{log.timestamp}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-gray-400 dark:text-gray-600 italic font-sans text-xs">
                  No key events registered yet.
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4 flex items-center justify-between text-[10px] text-gray-400 font-sans">
            <span>Buffer limit: 15 rows</span>
            <button
              id="clear-logs-btn"
              onClick={() => setPressLogs([])}
              className="hover:underline font-bold text-gray-500"
            >
              Clear Log Console
            </button>
          </div>
        </div>

      </div>

      {/* 5. Cloud Saved Sessions & Diagnostics History */}
      <div className="mt-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900 dark:text-white font-sans">
                Cloud Diagnostics History
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Saved verification reports, accuracy stats, and device diagnostic stamps.
              </p>
            </div>
          </div>
          {!user && (
            <span className="text-xs text-gray-400 dark:text-gray-500 italic bg-gray-50 dark:bg-gray-950 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-900/40 font-sans">
              Connect Google above to synchronize logs.
            </span>
          )}
        </div>

        {user ? (
          isLoadingSessions ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mb-2" />
              <p className="text-sm font-sans">Syncing cloud reports...</p>
            </div>
          ) : sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((sess) => (
                <div 
                  key={sess.id}
                  className="bg-gray-50 dark:bg-gray-950/40 border border-gray-200/50 dark:border-gray-800/40 p-4 rounded-2xl flex flex-col justify-between hover:border-blue-500/20 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded border border-blue-100/50 dark:border-blue-900/40 font-mono">
                        {sess.layout} Layout
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {sess.createdAt?.seconds 
                          ? new Date(sess.createdAt.seconds * 1000).toLocaleDateString()
                          : new Date().toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                      <div className="bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Verified</span>
                        <span className="text-base font-extrabold text-gray-900 dark:text-white font-sans">{sess.testedKeysCount} / {sess.totalKeys}</span>
                        <span className="text-[9px] text-emerald-500 block">({sess.percentage}%)</span>
                      </div>
                      <div className="bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Speed (WPM)</span>
                        <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                          {sess.wpm !== undefined ? sess.wpm : 'N/A'}
                        </span>
                        {sess.accuracy !== undefined && (
                          <span className="text-[9px] text-gray-400 block">({sess.accuracy}% Acc)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-[9px] text-gray-400 font-mono truncate max-w-[150px]">ID: {sess.id}</span>
                    <button
                      onClick={() => handleDeleteSession(sess.id)}
                      className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400 dark:text-gray-600 font-sans flex flex-col items-center justify-center">
              <Cloud className="h-10 w-10 text-gray-300 dark:text-gray-800 mb-2" />
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No diagnostic reports logged yet.</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm">
                Complete a key sweep or type in the WPM tester above, then click <strong>"Save Report"</strong> to record your keyboard's health in the cloud.
              </p>
            </div>
          )
        ) : (
          <div className="py-8 text-center text-gray-400 dark:text-gray-600 font-sans flex flex-col items-center justify-center">
            <Lock className="h-10 w-10 text-gray-300 dark:text-gray-800 mb-2" />
            <p className="text-sm font-semibold">Diagnostics Log is Locked</p>
            <p className="text-xs text-gray-400 mt-1 max-w-md">
              Please connect your Google account using the button in the top navigation bar to save your hardware performance reports and keep track of keys tested.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
