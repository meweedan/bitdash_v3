import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowUp, ArrowDown } from "lucide-react";

const profitMargin = 0.02; // 2% profit margin

const fetchRates = async (baseCurrency, isCrypto = false) => {
  let API_URL;
  if (isCrypto) {
    API_URL = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${process.env.NEXT_PUBLIC_CURRENCYFREAKS_API}&symbols=BTC,ETH,USDT`;
  } else {
    API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exchange-rates/latest?base=${baseCurrency}`;
  }

  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  const data = await response.json();
  if (isCrypto) {
    return Object.keys(data.rates).map((symbol) => ({
      from: baseCurrency,
      to: symbol,
      rate: parseFloat(data.rates[symbol]),
      buy: parseFloat(data.rates[symbol]) * (1 + profitMargin),
      sell: parseFloat(data.rates[symbol]) * (1 - profitMargin),
    }));
  } else {
    return data.data.attributes.results.map((item) => ({
      from: item.from_currency,
      to: item.to_currency,
      rate: parseFloat(item.rate),
      buy: parseFloat(item.buy_price),
      sell: parseFloat(item.sell_price),
    }));
  }
};

const ForexCryptoTicker = () => {
  const [activeBase, setActiveBase] = useState("LYD");
  const { data: forexRates, isLoading: forexLoading, error: forexError } = useQuery(
    ["forex-rates", activeBase],
    () => fetchRates(activeBase, false),
    { refetchInterval: 60000 }
  );

  const { data: cryptoRates, isLoading: cryptoLoading, error: cryptoError } = useQuery(
    ["crypto-rates"],
    () => fetchRates("USDT", true),
    { refetchInterval: 60000 }
  );

  const bgColor = useColorModeValue("gray.900", "black");
  const textColor = useColorModeValue("white", "gray.200");

  return (
    <Box bg={bgColor} color={textColor} borderRadius="md" p={6} boxShadow="xl">
      <Tabs variant="solid-rounded" isFitted>
        <TabList>
          <Tab onClick={() => setActiveBase("LYD")}>Forex (LYD Base)</Tab>
          <Tab onClick={() => setActiveBase("EGP")}>Forex (EGP Base)</Tab>
          <Tab>Crypto</Tab>
        </TabList>

        <TabPanels>
          {/* Forex Panel */}
          <TabPanel>
            {forexLoading ? (
              <Spinner />
            ) : forexError ? (
              <Alert status="error">
                <AlertIcon />
                {forexError.message}
              </Alert>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Currency</Th>
                    <Th isNumeric>Rate</Th>
                    <Th isNumeric>Buy</Th>
                    <Th isNumeric>Sell</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {forexRates.map((rate) => (
                    <Tr key={`${rate.from}-${rate.to}`}>
                      <Td>{rate.from} → {rate.to}</Td>
                      <Td isNumeric>{rate.rate.toFixed(4)}</Td>
                      <Td isNumeric>{rate.buy.toFixed(4)}</Td>
                      <Td isNumeric>{rate.sell.toFixed(4)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </TabPanel>

          {/* Crypto Panel */}
          <TabPanel>
            {cryptoLoading ? (
              <Spinner />
            ) : cryptoError ? (
              <Alert status="error">
                <AlertIcon />
                {cryptoError.message}
              </Alert>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Crypto</Th>
                    <Th isNumeric>Rate (USDT)</Th>
                    <Th isNumeric>Buy</Th>
                    <Th isNumeric>Sell</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {cryptoRates.map((rate) => (
                    <Tr key={`${rate.from}-${rate.to}`}>
                      <Td>{rate.from} → {rate.to}</Td>
                      <Td isNumeric>{rate.rate.toFixed(4)}</Td>
                      <Td isNumeric>{rate.buy.toFixed(4)}</Td>
                      <Td isNumeric>{rate.sell.toFixed(4)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ForexCryptoTicker;