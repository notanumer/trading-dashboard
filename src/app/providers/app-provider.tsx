import type { FC, ReactNode } from 'react';
import { ChakraProvider } from './chakra';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  );
};