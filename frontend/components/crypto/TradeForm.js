// components/TradeForm.js

import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Text
} from '@chakra-ui/react';

const TradeForm = ({ selectedCoin, initialTradePrice, onSubmit }) => {
  const [orderSide, setOrderSide] = useState('buy');
  const [orderType, setOrderType] = useState('limit');
  const [tradePrice, setTradePrice] = useState(initialTradePrice || 0);
  const [tradeAmount, setTradeAmount] = useState(0);
  const [leverage, setLeverage] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ orderSide, orderType, tradePrice, tradeAmount, leverage });
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4} borderWidth="1px" borderRadius="md">
      <HStack mb={4}>
        <Button
          flex={1}
          variant="crypto-solid"
          colorScheme="crypto-solid"
          onClick={() => setOrderSide('buy')}
          isActive={orderSide === 'buy'}
        >
          Buy
        </Button>
        <Button
          flex={1}
          variant="crypto-solid"
          colorScheme="crypto-solid"
          onClick={() => setOrderSide('sell')}
          isActive={orderSide === 'sell'}
        >
          Sell
        </Button>
      </HStack>

      <Tabs mb={4}>
        <TabList>
          <Tab onClick={() => setOrderType('limit')} isActive={orderType === 'limit'}>
            Limit
          </Tab>
          <Tab onClick={() => setOrderType('market')} isActive={orderType === 'market'}>
            Market
          </Tab>
          <Tab onClick={() => setOrderType('stop-limit')} isActive={orderType === 'stop-limit'}>
            Stop Limit
          </Tab>
        </TabList>
        <TabPanels mt={2}>
          <TabPanel p={0}>
            {orderType === 'limit' && (
              <FormControl mb={3}>
                <FormLabel>Price (USDT)</FormLabel>
                <NumberInput
                  value={tradePrice}
                  onChange={(val) => setTradePrice(Number(val))}
                  precision={2}
                  min={0}
                  size="sm"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            )}
          </TabPanel>
          <TabPanel p={0}>
            {orderType === 'market' && (
              <Text fontSize="sm" mb={3}>Market orders execute at the current price.</Text>
            )}
          </TabPanel>
          <TabPanel p={0}>
            {orderType === 'stop-limit' && (
              <FormControl mb={3}>
                <FormLabel>Stop Price (USDT)</FormLabel>
                <NumberInput
                  value={tradePrice}
                  onChange={(val) => setTradePrice(Number(val))}
                  precision={2}
                  min={0}
                  size="sm"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      <FormControl mb={3}>
        <FormLabel>
          Amount ({selectedCoin ? selectedCoin.symbol.toUpperCase() : 'Asset'})
        </FormLabel>
        <NumberInput
          value={tradeAmount}
          onChange={(val) => setTradeAmount(Number(val))}
          precision={6}
          min={0}
          size="sm"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <Box mb={3}>
        <FormLabel>Trade Size</FormLabel>
        <Slider defaultValue={0} min={0} max={100} step={25} colorScheme={orderSide === 'buy' ? 'green' : 'red'}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={4} />
        </Slider>
        <HStack justify="space-between">
          <Text fontSize="xs">0%</Text>
          <Text fontSize="xs">25%</Text>
          <Text fontSize="xs">50%</Text>
          <Text fontSize="xs">75%</Text>
          <Text fontSize="xs">100%</Text>
        </HStack>
      </Box>

      <FormControl mb={3}>
        <FormLabel>Total (USDT)</FormLabel>
        <NumberInput value={tradePrice * tradeAmount} precision={2} min={0} isReadOnly size="sm">
          <NumberInputField />
        </NumberInput>
      </FormControl>

      <HStack spacing={3}>
        <Button type="submit" w="full" colorScheme={orderSide === 'buy' ? 'green' : 'red'} size="lg">
          {orderSide === 'buy'
            ? `Buy ${selectedCoin ? selectedCoin.symbol.toUpperCase() : ''}`
            : `Sell ${selectedCoin ? selectedCoin.symbol.toUpperCase() : ''}`}
        </Button>
      </HStack>
    </Box>
  );
};

export default TradeForm;
