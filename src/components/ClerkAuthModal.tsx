import React, { useState } from 'react';
import { 
  SignIn, 
  SignUp 
} from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { X, Lock, Key, Sparkles, CheckCircle2, ExternalLink } from 'lucide-react';
import { haptic } from '../utils/haptics';

interface ClerkAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkTheme?: boolean;
  publishableKey: string | null;
  onSavePublishableKey: (key: string) => void;
}

export const ClerkAuthModal: React.FC<ClerkAuthModalProps> = ({
  isOpen,
  onClose,
  isDarkTheme = false,
  publishableKey,
  onSavePublishableKey,
}) => {
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [inputKey, setInputKey] = useState('');
  const [setupError, setSetupError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = inputKey.trim();
    if (!cleanKey.startsWith('pk_test_') && !cleanKey.startsWith('pk_live_')) {
      setSetupError('Publishable Key must start with pk_test_ or pk_live_');
      return;
    }
    setSetupError(null);
    haptic.success();
    onSavePublishableKey(cleanKey);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#15100E]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div 
        className="relative card-surface card-border rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4 max-h-[92vh] overflow-y-auto"
        style={{
          border: '1px solid var(--line, #EEDEC1)'
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EEDEC1] dark:border-[#29332c]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EA580C] text-white flex items-center justify-center font-black text-sm shadow-xs">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-1.5">
                <span>Clerk Authentication</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#EA580C] dark:bg-[#251C17] dark:text-[#FB923C]">
                  Verified
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Secure access to your Indian fitness & meal plans
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              haptic.light();
              onClose();
            }}
            className="w-8 h-8 rounded-full card-surface card-border text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* If publishableKey is configured, render official Clerk components */}
        {publishableKey ? (
          <div className="space-y-4">
            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-[#FEF3C7] dark:bg-[#1a241d] rounded-2xl">
              <button
                onClick={() => {
                  setAuthMode('sign-in');
                  haptic.selection();
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                  authMode === 'sign-in'
                    ? 'bg-white dark:bg-[#253228] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('sign-up');
                  haptic.selection();
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                  authMode === 'sign-up'
                    ? 'bg-white dark:bg-[#253228] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Clerk Components Render Container */}
            <div className="flex justify-center py-2">
              {authMode === 'sign-in' ? (
                <SignIn 
                  routing="virtual"
                  appearance={{
                    baseTheme: isDarkTheme ? dark : undefined,
                    elements: {
                      card: 'shadow-none border-0 bg-transparent w-full',
                      headerTitle: 'text-slate-900 dark:text-white font-black',
                      formButtonPrimary: 'bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-xl',
                    }
                  }}
                />
              ) : (
                <SignUp 
                  routing="virtual"
                  appearance={{
                    baseTheme: isDarkTheme ? dark : undefined,
                    elements: {
                      card: 'shadow-none border-0 bg-transparent w-full',
                      headerTitle: 'text-slate-900 dark:text-white font-black',
                      formButtonPrimary: 'bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-xl',
                    }
                  }}
                />
              )}
            </div>

            {/* Key change option */}
            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  onSavePublishableKey('');
                  haptic.selection();
                }}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline cursor-pointer"
              >
                Change Clerk Publishable Key
              </button>
            </div>
          </div>
        ) : (
          /* Clerk Setup / Key Configuration Prompt */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#FFFBF5] dark:bg-[#231811] border border-[#FED7AA] dark:border-[#2d4a36] space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#EA580C] dark:text-[#FB923C]">
                <Key className="w-4 h-4" />
                <span>Connect your Clerk Instance</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                To enable live sign-in and sign-up with email, Google, or phone OTP, enter your Clerk Publishable Key from your Clerk dashboard.
              </p>
              <a
                href="https://dashboard.clerk.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#EA580C] dark:text-[#FB923C] hover:underline pt-1"
              >
                <span>Open Clerk Dashboard (API Keys)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <form onSubmit={handleKeySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Clerk Publishable Key
                </label>
                <input
                  type="text"
                  placeholder="pk_test_... or pk_live_..."
                  value={inputKey}
                  onChange={(e) => {
                    setInputKey(e.target.value);
                    setSetupError(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEDEC1] dark:border-[#29332c] bg-white dark:bg-[#251C17] text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
                {setupError && (
                  <p className="text-xs text-red-500 font-semibold mt-1">{setupError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!inputKey.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] disabled:opacity-50 text-white font-bold text-xs shadow-md transition active:scale-98 cursor-pointer flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Connect & Start Clerk Auth</span>
              </button>
            </form>

            <div className="relative py-2 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EEDEC1] dark:border-[#29332c]" />
              </div>
              <span className="relative px-3 bg-white dark:bg-[#251C17] text-[11px] font-medium text-slate-400">
                Or Continue Directly
              </span>
            </div>

            <button
              onClick={() => {
                haptic.medium();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-[#EEDEC1] dark:border-[#29332c] card-surface text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-[#FEF3C7] dark:hover:bg-[#253228] transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />
              <span>Continue as Sajibur Rahman (Local Profile)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
