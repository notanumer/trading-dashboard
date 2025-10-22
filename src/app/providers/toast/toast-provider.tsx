import { createStandaloneToast } from '@chakra-ui/toast';
import type { FC, ReactNode } from 'react';

const { ToastContainer } = createStandaloneToast();

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};