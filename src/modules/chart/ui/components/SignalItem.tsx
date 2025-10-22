import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import type { TradingSignal } from '@shared/types';
import { formatSignalTime } from '@shared/utils';
import { memo } from 'react';

interface SignalItemProps {
  signal: TradingSignal;
}

/**
 * Individual signal item display
 */
export const SignalItem = memo<SignalItemProps>(({ signal }) => {
  const isLong = signal.signal === 'LONG';
  const borderColor = isLong ? 'green.400' : 'red.400';
  const bgColor = isLong ? 'green.50' : 'red.50';
  const textColor = isLong ? 'green.800' : 'red.800';

  return (
    <Box
      borderLeft="4px solid"
      borderLeftColor={borderColor}
      bg={bgColor}
      borderRadius="md"
      p={3}
      mb={2}
      transition="all 0.2s"
      _hover={{
        boxShadow: 'md',
        transform: 'translateY(-2px)',
      }}
    >
      <HStack justify="space-between" mb={2}>
        <Text
          fontWeight="bold"
          fontSize="sm"
          color={textColor}
          px={3}
          py={1}
          borderRadius="md"
          bg={isLong ? 'green.100' : 'red.100'}
        >
          {signal.signal}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {formatSignalTime(signal.timestamp)}
        </Text>
      </HStack>

      <VStack align="stretch" spacing={1} fontSize="sm">
        <HStack>
          <Text fontWeight="semibold">Symbol:</Text>
          <Text>{signal.symbol}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="semibold">Entry:</Text>
          <Text>{signal.entry}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="semibold">Stop Loss:</Text>
          <Text>{signal.sl}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="semibold">Take Profit:</Text>
          <Text>{signal.tp1}</Text>
        </HStack>
        <Box
          mt={2}
          pt={2}
          borderTop="1px solid"
          borderTopColor="gray.200"
          fontSize="xs"
          color="gray.600"
        >
          {signal.strategy}
        </Box>
      </VStack>
    </Box>
  );
});

SignalItem.displayName = 'SignalItem';

