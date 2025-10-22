import { Box, Grid, GridItem } from '@chakra-ui/react';
import { TradingViewChart } from '@modules/chart';
import { Scanner } from '@modules/scanner';
import { SCANNER_STORAGE_KEYS, STRATEGIES } from '@shared/constants';
import type { Strategy } from '@shared/types';
import { StorageService } from '@shared/utils';
import { memo, useCallback, useState } from 'react';

/**
 * Main application component
 */
const App = memo(() => {
  const [selectedSymbol, setSelectedSymbol] = useState('BINANCE:BTCUSDT');
  
  // Initialize studies from localStorage to avoid multiple rerenders
  const [selectedStudies, setSelectedStudies] = useState<string[]>(() => {
    const storedStrategy = StorageService.getItem<string>(
      SCANNER_STORAGE_KEYS.STRATEGY,
      STRATEGIES[0].title
    );
    const strategy = STRATEGIES.find((s) => s.title === storedStrategy);
    return strategy ? strategy.value : [];
  });

  const handleStrategyChange = useCallback((strategy: Strategy) => {
    setSelectedStudies(strategy.value);
  }, []);

  return (
    <Box minH="100vh" bg="gray.900" p={2}>
      <Grid
        templateColumns={{ base: '1fr', lg: '1fr 280px' }}
        gap={2}
        h="calc(100vh - 16px)"
      >
        <GridItem h="100%">
          <TradingViewChart
            symbol={selectedSymbol}
            studies={selectedStudies}
          />
        </GridItem>
        <GridItem bg="gray.800" borderRadius="md" h="100%" overflowY="auto">
          <Scanner
            onSymbolSelect={setSelectedSymbol}
            onStrategyChange={handleStrategyChange}
          />
        </GridItem>
      </Grid>
    </Box>
  );
});

App.displayName = 'App';

export default App;
