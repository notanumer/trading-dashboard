import type { ReactNode } from 'react';
import { ChakraProvider } from './chakra';
import { ErrorBoundary } from './error-boundary';

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Root application provider combining all context providers
 */
export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ErrorBoundary>
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </ErrorBoundary>
  );
};