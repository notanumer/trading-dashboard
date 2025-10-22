import { type ReactNode } from 'react';
import { ChakraProvider } from './chakra';
import { ToastProvider } from './toast';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ChakraProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </ChakraProvider>
  );
};