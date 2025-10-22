import {
    Box,
    Card,
    HStack,
    Icon,
    Input,
    List,
    ListItem,
    Select,
    SimpleGrid,
    Text,
    VStack,
} from '@chakra-ui/react';
import {
    CATEGORIES,
    COMMODITIES_SYMBOLS,
    CRYPTO_SYMBOLS,
    FOREX_SYMBOLS,
    INDICES_SYMBOLS,
    SCANNER_STORAGE_KEYS,
    STRATEGIES,
} from '@shared/constants';
import type { Category, CategoryType, Strategy, SymbolItem } from '@shared/types';
import { StorageService } from '@shared/utils';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

export interface ScannerProps {
  onSymbolSelect: (symbol: string) => void;
  onStrategyChange: (strategy: Strategy) => void;
}

/**
 * Trading scanner component for selecting symbols and strategies
 */
export const Scanner = memo<ScannerProps>(
  ({ onSymbolSelect, onStrategyChange }) => {
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>(() => {
      // Load category from localStorage on mount
      const storedCategory = StorageService.getItem<CategoryType>(
        SCANNER_STORAGE_KEYS.CATEGORY,
        'Forex'
      );
      if (CATEGORIES.find((c) => c.value === storedCategory)) {
        return storedCategory;
      }
      return 'Forex';
    });
    const [cryptoSearch, setCryptoSearch] = useState('');

    // Save category to localStorage
    useEffect(() => {
      StorageService.setItem(SCANNER_STORAGE_KEYS.CATEGORY, selectedCategory);
    }, [selectedCategory]);

    // Get symbols for selected category
    const getSymbolsForCategory = useCallback((category: CategoryType): readonly SymbolItem[] => {
      switch (category) {
        case 'Forex':
          return FOREX_SYMBOLS;
        case 'Commodities':
          return COMMODITIES_SYMBOLS;
        case 'Crypto':
          return CRYPTO_SYMBOLS;
        case 'Indices':
          return INDICES_SYMBOLS;
        default:
          return [];
      }
    }, []);

    // Filtered symbols based on search query
    const filteredSymbols = useMemo(() => {
      const symbols = getSymbolsForCategory(selectedCategory);

      if (selectedCategory === 'Crypto') {
        const query = cryptoSearch.trim().toLowerCase();
        if (!query) return symbols;

        return symbols.filter(
          (item) =>
            item.symbol.toLowerCase().includes(query) ||
            item.title.toLowerCase().includes(query)
        );
      }

      return symbols;
    }, [selectedCategory, cryptoSearch, getSymbolsForCategory]);

    const handleCategoryChange = useCallback((category: CategoryType) => {
      setSelectedCategory(category);
      setCryptoSearch('');
    }, []);

    const handleStrategyChange = useCallback(
      (title: string) => {
        const strategy = STRATEGIES.find((s) => s.title === title);
        if (strategy) {
          onStrategyChange(strategy);
        }
      },
      [onStrategyChange]
    );

    return (
      <Box w="100%" h="100%" p={4}>
        <SimpleGrid columns={1} spacing={4} h="full">
          <VStack spacing={4} align="stretch" h="full">
            {/* Strategy Selection */}
            <Card p={3}>
              <Text mb={2} fontWeight="bold" fontSize="sm">
                Strategy
              </Text>
              <Select
                onChange={(e) => handleStrategyChange(e.target.value)}
                defaultValue={STRATEGIES[0].title}
                size="sm"
              >
                {STRATEGIES.map((strategy) => (
                  <option key={strategy.title} value={strategy.title}>
                    {strategy.title}
                  </option>
                ))}
              </Select>
            </Card>

            {/* Category Selection */}
            <Card p={3}>
              <Text mb={2} fontWeight="bold" fontSize="sm">
                Category
              </Text>
              <HStack wrap="wrap" spacing={2}>
                {CATEGORIES.map((cat: Category) => (
                  <Box
                    key={cat.value}
                    onClick={() => handleCategoryChange(cat.value)}
                    cursor="pointer"
                    bg={selectedCategory === cat.value ? 'blue.500' : 'gray.700'}
                    color="white"
                    px={3}
                    py={2}
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    transition="all 0.2s"
                    _hover={{
                      bg: selectedCategory === cat.value ? 'blue.600' : 'gray.600',
                      transform: 'translateY(-2px)',
                    }}
                  >
                    <Icon as={cat.icon} />
                    <Text fontSize="sm">{cat.value}</Text>
                  </Box>
                ))}
              </HStack>
            </Card>

            {/* Crypto Search */}
            {selectedCategory === 'Crypto' && (
              <Card p={3}>
                <Input
                  placeholder="Search cryptocurrency..."
                  value={cryptoSearch}
                  onChange={(e) => setCryptoSearch(e.target.value)}
                  size="sm"
                />
              </Card>
            )}

            {/* Symbols List */}
            <Card p={3} flex="1" overflowY="auto">
              <Text mb={2} fontWeight="bold" fontSize="sm">
                Symbols
              </Text>
              <List spacing={1}>
                {filteredSymbols.map((sym) => (
                  <ListItem
                    key={sym.symbol}
                    onClick={() => onSymbolSelect(sym.symbol)}
                    cursor="pointer"
                    _hover={{ bg: 'gray.700' }}
                    borderRadius="md"
                    px={3}
                    py={2}
                    fontSize="sm"
                    transition="all 0.2s"
                  >
                    {sym.title}
                  </ListItem>
                ))}
              </List>
            </Card>
          </VStack>
        </SimpleGrid>
      </Box>
    );
  }
);

Scanner.displayName = 'Scanner';
