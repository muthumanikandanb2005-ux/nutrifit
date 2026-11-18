import React, { createContext, useContext, useState } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { ClerkAuthModal } from './ClerkAuthModal';

interface ClerkAuthContextType {
  publishableKey: string | null;
  setPublishableKey: (key: string) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  isClerkConfigured: boolean;
}

const ClerkAuthContext = createContext<ClerkAuthContextType>({
  publishableKey: null,
  setPublishableKey: () => {},
  openAuthModal: () => {},
  closeAuthModal: () => {},
  isAuthModalOpen: false,
  isClerkConfigured: false,
});

export const useClerkAuth = () => useContext(ClerkAuthContext);

interface ClerkAuthProviderProps {
  children: React.ReactNode;
  theme?: 'light' | 'dark';
}

export const AppClerkProvider: React.FC<ClerkAuthProviderProps> = ({ children, theme = 'light' }) => {
  const [publishableKey, setPublishableKey] = useState<string | null>(() => {
    // 1. Check environment variable (Vite client-side)
    const envKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    if (envKey && typeof envKey === 'string' && (envKey.startsWith('pk_test_') || envKey.startsWith('pk_live_'))) {
      return envKey;
    }
    // 2. Check localStorage
    const saved = localStorage.getItem('clerk_publishable_key');
    if (saved && (saved.startsWith('pk_test_') || saved.startsWith('pk_live_'))) {
      return saved;
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSaveKey = (key: string) => {
    const cleanKey = key.trim();
    if (cleanKey) {
      localStorage.setItem('clerk_publishable_key', cleanKey);
      setPublishableKey(cleanKey);
    } else {
      localStorage.removeItem('clerk_publishable_key');
      setPublishableKey(null);
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const contextValue: ClerkAuthContextType = {
    publishableKey,
    setPublishableKey: handleSaveKey,
    openAuthModal,
    closeAuthModal,
    isAuthModalOpen,
    isClerkConfigured: Boolean(publishableKey),
  };

  return (
    <ClerkAuthContext.Provider value={contextValue}>
      {publishableKey ? (
        <ClerkProvider publishableKey={publishableKey}>
          {children}
          <ClerkAuthModal
            isOpen={isAuthModalOpen}
            onClose={closeAuthModal}
            isDarkTheme={theme === 'dark'}
            publishableKey={publishableKey}
            onSavePublishableKey={handleSaveKey}
          />
        </ClerkProvider>
      ) : (
        <>
          {children}
          <ClerkAuthModal
            isOpen={isAuthModalOpen}
            onClose={closeAuthModal}
            isDarkTheme={theme === 'dark'}
            publishableKey={publishableKey}
            onSavePublishableKey={handleSaveKey}
          />
        </>
      )}
    </ClerkAuthContext.Provider>
  );
};
