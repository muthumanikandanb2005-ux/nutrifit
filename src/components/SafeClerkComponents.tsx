import React from 'react';
import { 
  SignedIn as ClerkSignedIn, 
  SignedOut as ClerkSignedOut, 
  UserButton as ClerkUserButton
} from '@clerk/clerk-react';
import { useClerkAuth } from './ClerkAuthProvider';
import { Lock } from 'lucide-react';
import { haptic } from '../utils/haptics';

/**
 * Safe SignedIn: Only renders children when authenticated with Clerk
 */
export const SafeSignedIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isClerkConfigured } = useClerkAuth();
  if (!isClerkConfigured) {
    return null;
  }
  return <ClerkSignedIn>{children}</ClerkSignedIn>;
};

/**
 * Safe SignedOut: Renders children when signed out or when Clerk key is awaiting setup
 */
export const SafeSignedOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isClerkConfigured } = useClerkAuth();
  if (!isClerkConfigured) {
    return <>{children}</>;
  }
  return <ClerkSignedOut>{children}</ClerkSignedOut>;
};

/**
 * Safe UserButton: Displays Clerk UserButton if configured and signed in,
 * or an interactive Sign In / Sign Up badge
 */
export const SafeUserButton: React.FC<{
  userAvatar?: string;
  userName?: string;
}> = () => {
  const { isClerkConfigured, openAuthModal } = useClerkAuth();

  if (isClerkConfigured) {
    return (
      <div className="flex items-center space-x-2">
        <ClerkSignedIn>
          <ClerkUserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'w-10 h-10 border-2 border-white dark:border-[#2d5a43] shadow-xs'
              }
            }}
          />
        </ClerkSignedIn>
        <ClerkSignedOut>
          <button
            onClick={() => {
              haptic.selection();
              openAuthModal();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#006d41] hover:bg-[#005a35] text-white text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer"
            title="Sign in with Clerk"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </ClerkSignedOut>
      </div>
    );
  }

  // Not configured yet - show one-click Clerk connect button
  return (
    <button
      onClick={() => {
        haptic.selection();
        openAuthModal();
      }}
      className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#ebf7ed] dark:bg-[#1f2923] border border-[#bceecf] dark:border-[#2d5a43] text-[#006d41] dark:text-[#5be196] text-[11px] font-bold hover:bg-[#dae5dc] transition cursor-pointer"
      title="Connect Clerk Authentication"
    >
      <Lock className="w-3 h-3 text-[#006d41] dark:text-[#5be196]" />
      <span>Clerk Auth</span>
    </button>
  );
};
