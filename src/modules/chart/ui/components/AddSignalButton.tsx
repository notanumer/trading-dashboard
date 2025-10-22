import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Radio,
    RadioGroup,
    Stack,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { memo, useState } from 'react';

interface AddSignalButtonProps {
  symbol: string;
  onAddSignal: (
    signal: 'LONG' | 'SHORT',
    entry: string,
    sl: string,
    tp1: string
  ) => void;
}

/**
 * Button to manually add trading signals
 */
export const AddSignalButton = memo<AddSignalButtonProps>(
  ({ symbol, onAddSignal }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [signalType, setSignalType] = useState<'LONG' | 'SHORT'>('LONG');
    const [entry, setEntry] = useState('');
    const [sl, setSl] = useState('');
    const [tp1, setTp1] = useState('');

    const handleSubmit = () => {
      if (entry && sl && tp1) {
        onAddSignal(signalType, entry, sl, tp1);
        // Reset form
        setEntry('');
        setSl('');
        setTp1('');
        onClose();
      }
    };

    return (
      <>
        <Button
          position="absolute"
          top={2}
          left={2}
          zIndex={1000}
          colorScheme="teal"
          size="sm"
          onClick={onOpen}
        >
          ➕ Add Signal
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Trading Signal</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel fontSize="sm">Symbol: {symbol}</FormLabel>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm">Signal Type</FormLabel>
                  <RadioGroup
                    value={signalType}
                    onChange={(value) => setSignalType(value as 'LONG' | 'SHORT')}
                  >
                    <Stack direction="row" spacing={4}>
                      <Radio value="LONG" colorScheme="green">
                        LONG
                      </Radio>
                      <Radio value="SHORT" colorScheme="red">
                        SHORT
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm">Entry Price</FormLabel>
                  <Input
                    type="number"
                    step="any"
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    placeholder="e.g. 108265.81"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm">Stop Loss (SL)</FormLabel>
                  <Input
                    type="number"
                    step="any"
                    value={sl}
                    onChange={(e) => setSl(e.target.value)}
                    placeholder="e.g. 106708.18"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm">Take Profit 1 (TP1)</FormLabel>
                  <Input
                    type="number"
                    step="any"
                    value={tp1}
                    onChange={(e) => setTp1(e.target.value)}
                    placeholder="e.g. 109449.46"
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isDisabled={!entry || !sl || !tp1}
              >
                Add Signal
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
);

AddSignalButton.displayName = 'AddSignalButton';

