import { Badge, Button } from '@chakra-ui/react';
import { memo } from 'react';

interface SignalsButtonProps {
  signalsCount: number;
  hasNewSignals: boolean;
  onClick: () => void;
  isVisible?: boolean;
}

/**
 * Button to show/hide signals panel
 */
export const SignalsButton = memo<SignalsButtonProps>(
  ({ signalsCount, hasNewSignals, onClick, isVisible = true }) => {
    if (!isVisible) return null;

    return (
      <Button
        position="absolute"
        top={2}
        right={2}
        zIndex={1000}
        colorScheme={hasNewSignals ? 'red' : 'blue'}
        size="sm"
        onClick={onClick}
        rightIcon={
          <Badge colorScheme={hasNewSignals ? 'red' : 'gray'} ml={1}>
            {signalsCount}
          </Badge>
        }
      >
        📊 Signals
      </Button>
    );
  }
);

SignalsButton.displayName = 'SignalsButton';

