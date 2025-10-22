import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and handle React errors
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.50"
          p={4}
        >
          <VStack
            spacing={4}
            maxW="md"
            w="full"
            bg="white"
            p={8}
            borderRadius="lg"
            boxShadow="xl"
          >
            <Heading size="lg" color="red.500">
              Oops! Something went wrong
            </Heading>
            <Text color="gray.600" textAlign="center">
              An unexpected error occurred. Please try refreshing the page.
            </Text>
            {this.state.error && (
              <Box
                w="full"
                p={4}
                bg="red.50"
                borderRadius="md"
                borderLeft="4px solid"
                borderLeftColor="red.500"
              >
                <Text fontSize="sm" color="red.700" fontFamily="mono">
                  {this.state.error.message}
                </Text>
              </Box>
            )}
            <Button colorScheme="blue" onClick={this.handleReset}>
              Try Again
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

