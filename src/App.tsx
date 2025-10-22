import { Box, Container, Grid, GridItem } from '@chakra-ui/react';
import { TradingViewChart } from '@modules/chart';
import Scanner from '@modules/scanner/ui/Scanner';
import { useState } from 'react';

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [selectedStudies, setSelectedStudies] = useState<string[]>([]);

  return (
    <Box minH="100vh" bg="gray.900">
      <Container maxW="container.xl" py={4}>
        <Box display="flex" flexDirection="column" gap={4}>
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
            <GridItem bg="gray.800" p={4} borderRadius="md">
              <Scanner
                onSymbolSelect={setSelectedSymbol}
                onStrategyChange={(strategy) => setSelectedStudies(strategy.value)}
              />
            </GridItem>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default App
