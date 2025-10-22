import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    Heading,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import type { TradingSignal } from '@shared/types';
import { memo, useCallback, useMemo } from 'react';
import { SignalItem } from './SignalItem';

interface LogsPanelProps {
  signals: TradingSignal[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  onExport: () => void;
}

/**
 * Panel displaying trading signals log
 */
export const LogsPanel = memo<LogsPanelProps>(
  ({ signals, isOpen, onClose, onClear, onExport }) => {
    const { isOpen: isClearConfirmOpen, onOpen: onClearConfirmOpen, onClose: onClearConfirmClose } = useDisclosure();

    const longCount = useMemo(
      () => signals.filter((s) => s.signal === 'LONG').length,
      [signals]
    );

    const shortCount = useMemo(
      () => signals.filter((s) => s.signal === 'SHORT').length,
      [signals]
    );

    const handleClear = useCallback(() => {
      onClear();
      onClearConfirmClose();
    }, [onClear, onClearConfirmClose]);

    const handleClearConfirm = useCallback(() => {
      onClearConfirmOpen();
    }, [onClearConfirmOpen]);

    return (
      <>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="xl"
          scrollBehavior="inside"
        >
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
          <ModalContent maxH="80vh">
            <ModalHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">📊 Trading Signals Log</Heading>
                <ButtonGroup size="sm" spacing={2}>
                  <Button colorScheme="red" onClick={handleClearConfirm}>
                    Clear All
                  </Button>
                  <Button colorScheme="green" onClick={onExport}>
                    Export JSON
                  </Button>
                </ButtonGroup>
              </Flex>
            </ModalHeader>
            <ModalCloseButton />

            <Box
              bg="gray.50"
              py={3}
              px={6}
              borderY="1px solid"
              borderColor="gray.200"
            >
              <HStack spacing={6} fontSize="sm" fontWeight="semibold">
                <Text>Total: {signals.length}</Text>
                <Text color="green.600">LONG: {longCount}</Text>
                <Text color="red.600">SHORT: {shortCount}</Text>
              </HStack>
            </Box>

            <ModalBody>
              <VStack align="stretch" spacing={2} py={2}>
                {signals.length === 0 ? (
                  <Box
                    textAlign="center"
                    py={10}
                    color="gray.400"
                    fontSize="sm"
                  >
                    No signals detected yet
                  </Box>
                ) : (
                  signals.map((signal) => (
                    <SignalItem key={signal.id} signal={signal} />
                  ))
                )}
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Confirmation Modal */}
        <Modal isOpen={isClearConfirmOpen} onClose={onClearConfirmClose} size="sm">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Clear</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Text mb={4}>Are you sure you want to clear all signals?</Text>
              <ButtonGroup spacing={3} width="100%">
                <Button flex={1} onClick={onClearConfirmClose}>
                  Cancel
                </Button>
                <Button flex={1} colorScheme="red" onClick={handleClear}>
                  Clear All
                </Button>
              </ButtonGroup>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }
);

LogsPanel.displayName = 'LogsPanel';

