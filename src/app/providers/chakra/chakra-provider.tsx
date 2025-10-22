import { ChakraProvider as ChakraUIProvider } from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';
import { theme } from '../../../shared/config/theme';

interface ChakraProviderProps {
  children: ReactNode;
}

export const ChakraProvider: FC<ChakraProviderProps> = ({ children }) => {
  return (
    <ChakraUIProvider theme={theme}>
      {children}
    </ChakraUIProvider>
  );
};