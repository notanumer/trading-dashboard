import type { ThemeConfig } from '@chakra-ui/theme';
import { extendTheme } from '@chakra-ui/theme-utils';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const styles = {
  global: {
    body: {
      bg: '#1E1E1E',
      color: 'white',
    },
  },
};

const components = {
  Button: {
    baseStyle: {
      borderRadius: 'md',
    },
    variants: {
      solid: {
        bg: 'blue.500',
        color: 'white',
        _hover: {
          bg: 'blue.600',
        },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        bg: 'gray.800',
        borderRadius: 'lg',
        p: 4,
      },
    },
  },
};

export const theme = extendTheme({
  config,
  styles,
  components,
});