import { Box, Container, Grid, GridItem } from '@chakra-ui/react';
import { TradingViewChart } from '@modules/chart';
import { Scanner } from '@modules/scanner';
import type { Strategy } from '@shared/types';
import { memo, useCallback, useState } from 'react';

/**
 * Main application component
 */
const App = memo(() => {
  const [selectedSymbol, setSelectedSymbol] = useState('BINANCE:BTCUSDT');
  const [selectedStudies, setSelectedStudies] = useState<string[]>([]);

  const handleStrategyChange = useCallback((strategy: Strategy) => {
    setSelectedStudies(strategy.value);
  }, []);

  return (
    <Box minH="100vh" bg="gray.900">
      <Container maxW="container.xl" py={4}>
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 300px' }}
          gap={4}
        >
          <GridItem>
            <TradingViewChart
              symbol={selectedSymbol}
              studies={selectedStudies}
            />
          </GridItem>
          <GridItem bg="gray.800" borderRadius="md">
            <Scanner
              onSymbolSelect={setSelectedSymbol}
              onStrategyChange={handleStrategyChange}
            />
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
});

App.displayName = 'App';

export default App;
