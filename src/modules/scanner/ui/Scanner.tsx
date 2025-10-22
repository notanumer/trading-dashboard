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
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { FaBitcoin, FaChartLine, FaEuroSign, FaOilCan } from "react-icons/fa";

// === Types ===
export type Strategy = {
  title: string;
  value: string[];
};

export type SymbolItem = {
  symbol: string;
  title: string;
};

export type Category = {
  value: "Forex" | "Commodities" | "Crypto" | "Indices";
  icon: React.ElementType;
};

export interface ScannerProps {
  onSymbolSelect: (symbol: string) => void;
  onStrategyChange: (strategy: Strategy) => void;
}

// === Constants ===
const CATEGORIES: Category[] = [
  { value: "Forex", icon: FaEuroSign },
  { value: "Commodities", icon: FaOilCan },
  { value: "Crypto", icon: FaBitcoin },
  { value: "Indices", icon: FaChartLine },
];

const STRATEGIES: Strategy[] = [
  { title: "Golden Era", value: ["PUB;0b373fb0e6634a73bc8b838cf0690725"] },
  {
    title: "Trend Wave",
    value: [
      "PUB;00ec48baf0ee43f0a43e1658bb54cdab",
      "PUB;38080827cf244587b5e7dbb9f272db0a",
    ],
  },
  {
    title: "Smartmonics",
    value: [
      "PUB;ec7a7c1c91c645519b35b9505b4169a9",
      "PUB;5bdd7bb857ba48d68bf573c3fe0a08c3",
    ],
  },
  {
    title: "Liquidity Flow",
    value: [
      "PUB;cfb67dca49e94b5ca341ab4c1bcf4d37",
      "PUB;b7b3fe63710742cb9f7db5bfa9695e5a",
    ],
  },
  { title: "Sniper", value: ["PUB;717dd00ad9c1445b84b39adfb5ed5f3d"] },
  { title: "Price Hunter", value: ["PUB;ba1af294fd5047fbbf5cfd0f66697725"] },
];

const FOREX_SYMBOLS: SymbolItem[] = [
  { symbol: "FX:EURUSD", title: "EUR/USD" },
  { symbol: "FX:GBPUSD", title: "GBP/USD" },
  { symbol: "FX:USDJPY", title: "USD/JPY" },
];

const COMMODITIES_SYMBOLS: SymbolItem[] = [
  { symbol: "TVC:USOIL", title: "Crude Oil" },
  { symbol: "TVC:GOLD", title: "Gold" },
  { symbol: "TVC:SILVER", title: "Silver" },
];

const CRYPTO_SYMBOLS: SymbolItem[] = [
  { symbol: "BINANCE:BTCUSDT", title: "BTC/USDT" },
  { symbol: "BINANCE:ETHUSDT", title: "ETH/USDT" },
  { symbol: "BINANCE:XRPUSDT", title: "XRP/USDT" },
  { symbol: "BINANCE:SOLUSDT", title: "SOL/USDT" },
];

const INDICES_SYMBOLS: SymbolItem[] = [
  { symbol: "BLACKBULL:US30", title: "US30" },
  { symbol: "BLACKBULL:NAS100", title: "NAS100" },
  { symbol: "VANTAGE:SP500", title: "SP500" },
];

// === Component ===
const Scanner: React.FC<ScannerProps> = ({
  onSymbolSelect,
  onStrategyChange,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<Category["value"]>("Forex");
  const [cryptoSearch, setCryptoSearch] = useState<string>("");

  // --- Local storage (only category persistence now)
  useEffect(() => {
    const storedCategory = localStorage.getItem("scanner:selectedCategory");
    if (storedCategory && CATEGORIES.find((c) => c.value === storedCategory)) {
      setSelectedCategory(storedCategory as Category["value"]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("scanner:selectedCategory", selectedCategory);
  }, [selectedCategory]);

  // --- Filtered symbol list ---
  const filteredSymbols = useMemo(() => {
    if (selectedCategory === "Crypto") {
      const query = cryptoSearch.trim().toLowerCase();
      if (!query) return CRYPTO_SYMBOLS;
      return CRYPTO_SYMBOLS.filter(
        (item) =>
          item.symbol.toLowerCase().includes(query) ||
          item.title.toLowerCase().includes(query)
      );
    }
    switch (selectedCategory) {
      case "Forex":
        return FOREX_SYMBOLS;
      case "Commodities":
        return COMMODITIES_SYMBOLS;
      case "Indices":
        return INDICES_SYMBOLS;
      default:
        return [];
    }
  }, [selectedCategory, cryptoSearch]);

  // --- Render ---
  return (
    <Box w="100%" h="100%" p={4}>
      <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4} h="full">
        {/* Controls */}
        <VStack spacing={4} align="stretch" h="full">
          {/* Strategy */}
          <Card p={3}>
            <Text mb={2} fontWeight="bold">
              Strategy
            </Text>
            <Select
              onChange={(e) => {
                const found = STRATEGIES.find(
                  (s) => s.title === e.target.value
                );
                if (found) onStrategyChange(found);
              }}
            >
              {STRATEGIES.map((s) => (
                <option key={s.title} value={s.title}>
                  {s.title}
                </option>
              ))}
            </Select>
          </Card>

          {/* Categories */}
          <Card p={3}>
            <Text mb={2} fontWeight="bold">
              Category
            </Text>
            <HStack wrap="wrap" spacing={2}>
              {CATEGORIES.map((cat) => (
                <Box
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  cursor="pointer"
                  bg={
                    selectedCategory === cat.value ? "blue.500" : "gray.700"
                  }
                  color="white"
                  px={3}
                  py={2}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Icon as={cat.icon} />
                  <Text>{cat.value}</Text>
                </Box>
              ))}
            </HStack>
          </Card>

          {/* Search */}
          {selectedCategory === "Crypto" && (
            <Card p={3}>
              <Input
                placeholder="Search Crypto"
                value={cryptoSearch}
                onChange={(e) => setCryptoSearch(e.target.value)}
              />
            </Card>
          )}

          {/* Symbols */}
          <Card p={3} flex="1" overflowY="auto">
            <Text mb={2} fontWeight="bold">
              Symbols
            </Text>
            <List spacing={1}>
              {filteredSymbols.map((sym) => (
                <ListItem
                  key={sym.symbol}
                  onClick={() => onSymbolSelect(sym.symbol)}
                  cursor="pointer"
                  _hover={{ bg: "gray.700" }}
                  borderRadius="md"
                  px={3}
                  py={2}
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
};

export default Scanner;
