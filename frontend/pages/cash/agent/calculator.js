import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Chakra UI
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Alert,
  AlertIcon,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  SlideFade,
} from '@chakra-ui/react';

// Layout component
import Layout from '@/components/Layout';

function Calculator() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  // State for form values
  const [agentType, setAgentType] = useState('business');
  const [dailyDeposits, setDailyDeposits] = useState(5);
  const [avgDepositAmount, setAvgDepositAmount] = useState(100);
  const [dailyWithdrawals, setDailyWithdrawals] = useState(3);
  const [avgWithdrawalAmount, setAvgWithdrawalAmount] = useState(80);
  const [merchantSettlements, setMerchantSettlements] = useState(1);
  const [avgSettlementAmount, setAvgSettlementAmount] = useState(200);
  const [newCustomers, setNewCustomers] = useState(3);

  // Calculated earnings
  const calculateEarnings = () => {
    // Commission rates
    const depositRate = 0.012; // 1.2%
    const withdrawalRate = 0.008; // 0.8%
    const settlementRate = 0.005; // 0.5%
    const newCustomerBonus = 2.5; // $2.50 per new customer

    // Calculate commission for each type of transaction
    const depositCommission = dailyDeposits * avgDepositAmount * depositRate;
    const withdrawalCommission = dailyWithdrawals * avgWithdrawalAmount * withdrawalRate;
    const settlementCommission = merchantSettlements * avgSettlementAmount * settlementRate;
    const referralBonus = newCustomers * newCustomerBonus;

    // Calculate totals
    const dailyEarnings = depositCommission + withdrawalCommission + settlementCommission + referralBonus;
    const weeklyEarnings = dailyEarnings * 7;
    const monthlyEarnings = dailyEarnings * 30;
    const yearlyEarnings = dailyEarnings * 365;

    return {
      depositCommission,
      withdrawalCommission,
      settlementCommission,
      referralBonus,
      dailyEarnings,
      weeklyEarnings,
      monthlyEarnings,
      yearlyEarnings
    };
  };

  const earnings = calculateEarnings();

  // Colors & UI
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue('brand.bitcash.600', 'brand.bitcash.400');
  const accentBg = useColorModeValue('brand.bitcash.50', 'brand.bitcash.900');
  const softShadow = useColorModeValue('lg', 'dark-lg');

  return (
    <Layout>
      <Box 
        minH="100vh" 
        py={16}
      >
        <Container maxW="7xl">
          <SlideFade in offsetY="20px">
            <VStack spacing={4} textAlign="center" mb={10}>
              <Heading 
                fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                color={accentColor}
              >
                {t('calculator.heading', 'BitCash Agent Earnings Calculator')}
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} maxW="800px">
                {t('calculator.subheading', 'Estimate your potential income as a BitCash agent based on transaction volume and type')}
              </Text>
            </VStack>
          </SlideFade>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Input Section */}
            <SlideFade in offsetY="30px">
              <Box 
                bg={cardBg} 
                p={{ base: 6, md: 8 }} 
                borderRadius="xl" 
                boxShadow={softShadow}
              >
                <Heading size="lg" mb={6} color={accentColor}>
                  {t('calculator.inputSection.heading', 'Transaction Activity')}
                </Heading>

                <VStack spacing={6} align="stretch">
                  <FormControl>
                    <FormLabel>{t('calculator.inputSection.agentType', 'Agent Type')}</FormLabel>
                    <Select 
                      value={agentType} 
                      onChange={(e) => setAgentType(e.target.value)}
                    >
                      <option value="business">{t('calculator.inputSection.businessType', 'Business Location')}</option>
                      <option value="individual">{t('calculator.inputSection.individualType', 'Individual Agent')}</option>
                    </Select>
                  </FormControl>

                  <Divider />
                  
                  <FormControl>
                    <FormLabel>{t('calculator.inputSection.dailyDeposits', 'Average Daily Deposits')}</FormLabel>
                    <HStack>
                      <NumberInput 
                        value={dailyDeposits} 
                        onChange={(valueString) => setDailyDeposits(parseInt(valueString))}
                        min={0} max={100}
                        w="100px"
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Slider 
                        value={dailyDeposits} 
                        onChange={setDailyDeposits}
                        min={0} max={50} 
                        flex="1"
                      >
                        <SliderTrack>
                          <SliderFilledTrack bg="brand.bitcash.400" />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </HStack>
                  </FormControl>

                  <FormControl>
                    <FormLabel>{t('calculator.inputSection.avgDepositAmount', 'Average Deposit Amount ($)')}</FormLabel>
                    <HStack>
                      <NumberInput 
                        value={avgDepositAmount} 
                        onChange={(valueString) => setAvgDepositAmount(parseInt(valueString))}
                        min={10} max={1000}
                        w="100px"
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Slider 
                        value={avgDepositAmount} 
                        onChange={setAvgDepositAmount}
                        min={10} max={500} 
                        flex="1"
                      >
                        <SliderTrack>
                          <SliderFilledTrack bg="brand.bitcash.400" />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </HStack>
                  </FormControl>

                  <Divider />

                  <FormControl>
                    <FormLabel>{t('calculator.inputSection.dailyWithdrawals', 'Average Daily Withdrawals')}</FormLabel>
                    <HStack>
                      <NumberInput 
                        value={dailyWithdrawals} 
                        onChange={(valueString) => setDailyWithdrawals(parseInt(valueString))}
                        min={0} max={100}
                        w="100px"
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Slider 
                        value={dailyWithdrawals} 
                        onChange={setDailyWithdrawals}
                        min={0} max={30} 
                        flex="1"
                      >
                        <SliderTrack>
                          <SliderFilledTrack bg="brand.bitcash.400" />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </HStack>
                  </FormControl>

                  <FormControl>
                    <FormLabel>{t('calculator.inputSection.avgWithdrawalAmount', 'Average Withdrawal Amount ($)')}</FormLabel>
                    <HStack>
                      <NumberInput 
                        value={avgWithdrawalAmount} 
                        onChange={(valueString) => setAvgWithdrawalAmount(parseInt(valueString))}
                        min={10} max={1000}
                        w="100px"
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Slider 
                        value={avgWithdrawalAmount} 
                        onChange={setAvgWithdrawalAmount}
                        min={10} max={500} 
                        flex="1"
                      >
                        <SliderTrack>
                          <SliderFilledTrack bg="brand.bitcash.400" />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </HStack>
                  </FormControl>

                  <Divider />

                  <FormControl>
                    <FormLabel>{t('calculator.inputSection.merchantSettlements', 'Daily Merchant Settlements')}</FormLabel>
                    <HStack>
                      <NumberInput 
                        value={merchantSettlements} 
                        onChange={(valueString) => setMerchantSettlements(parseInt(valueString))}
                        min={0} max={20}
                        w="100px"
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Slider 
                        value={merchantSettlements} 
                        onChange={setMerchantSettlements}
                        min={0} max={10} 
                        flex="1"
                      >
                        <SliderTrack>
                          <SliderFilledTrack bg="brand.bitcash.400" />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </HStack>
                  </FormControl>

                  <FormControl>
                    <FormLabel>{t('calculator.inputSection.avgSettlementAmount', 'Average Settlement Amount ($)')}</FormLabel>
                    <HStack>
                      <NumberInput 
                        value={avgSettlementAmount} 
                        onChange={(valueString) => setAvgSettlementAmount(parseInt(valueString))}
                        min={10} max={2000}
                        w="100px"
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Slider 
                        value={avgSettlementAmount} 
                        onChange={setAvgSettlementAmount}
                        min={50} max={1000} 
                        flex="1"
                      >
                        <SliderTrack>
                          <SliderFilledTrack bg="brand.bitcash.400" />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </HStack>
                  </FormControl>

                  <Divider />

                  <FormControl>
                    <FormLabel>{t('calculator.inputSection.newCustomers', 'New Customers (Monthly)')}</FormLabel>
                    <HStack>
                      <NumberInput 
                        value={newCustomers} 
                        onChange={(valueString) => setNewCustomers(parseInt(valueString))}
                        min={0} max={100}
                        w="100px"
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Slider 
                        value={newCustomers} 
                        onChange={setNewCustomers}
                        min={0} max={50} 
                        flex="1"
                      >
                        <SliderTrack>
                          <SliderFilledTrack bg="brand.bitcash.400" />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </HStack>
                  </FormControl>
                </VStack>
              </Box>
            </SlideFade>

            {/* Results Section */}
            <SlideFade in offsetY="30px" delay={0.1}>
              <Box 
                bg={cardBg} 
                p={{ base: 6, md: 8 }} 
                borderRadius="xl" 
                boxShadow={softShadow}
              >
                <Heading size="lg" mb={6} color={accentColor}>
                  {t('calculator.resultsSection.heading', 'Potential Earnings')}
                </Heading>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                  <Stat 
                    p={4} 
                    bg={accentBg} 
                    borderRadius="lg" 
                    boxShadow="md"
                    borderLeft="4px solid"
                    borderColor={accentColor}
                  >
                    <StatLabel>{t('calculator.resultsSection.monthly', 'Monthly Earnings')}</StatLabel>
                    <StatNumber fontSize="3xl" color="green.600">
                      ${earnings.monthlyEarnings.toFixed(2)}
                    </StatNumber>
                    <StatHelpText>
                      {t('calculator.resultsSection.fromTransactions', 'From all transactions')}
                    </StatHelpText>
                  </Stat>
                  
                  <Stat 
                    p={4} 
                    bg={accentBg} 
                    borderRadius="lg" 
                    boxShadow="md"
                    borderLeft="4px solid"
                    borderColor={accentColor}
                  >
                    <StatLabel>{t('calculator.resultsSection.yearly', 'Yearly Potential')}</StatLabel>
                    <StatNumber fontSize="3xl" color="green.600">
                      ${earnings.yearlyEarnings.toFixed(2)}
                    </StatNumber>
                    <StatHelpText>
                      {t('calculator.resultsSection.annualEstimate', 'Annual estimate')}
                    </StatHelpText>
                  </Stat>
                </SimpleGrid>
                
                <Box mb={8}>
                  <Heading size="md" mb={4}>
                    {t('calculator.resultsSection.breakdown', 'Earnings Breakdown')}
                  </Heading>
                  
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>{t('calculator.resultsSection.transactionType', 'Transaction Type')}</Th>
                        <Th isNumeric>{t('calculator.resultsSection.commission', 'Commission')}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>{t('calculator.resultsSection.deposits', 'Cash Deposits')}</Td>
                        <Td isNumeric>${earnings.depositCommission.toFixed(2)}/day</Td>
                      </Tr>
                      <Tr>
                        <Td>{t('calculator.resultsSection.withdrawals', 'Cash Withdrawals')}</Td>
                        <Td isNumeric>${earnings.withdrawalCommission.toFixed(2)}/day</Td>
                      </Tr>
                      <Tr>
                        <Td>{t('calculator.resultsSection.settlements', 'Merchant Settlements')}</Td>
                        <Td isNumeric>${earnings.settlementCommission.toFixed(2)}/day</Td>
                      </Tr>
                      <Tr>
                        <Td>{t('calculator.resultsSection.newCustomers', 'New Customer Bonuses')}</Td>
                        <Td isNumeric>${earnings.referralBonus.toFixed(2)}/month</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
                
                <Alert status="info" borderRadius="md" mb={6}>
                  <AlertIcon />
                  {t('calculator.resultsSection.disclaimer', 'This calculator provides estimates only. Actual earnings may vary based on your location, customer activity, and performance.')}
                </Alert>
                
                <Button 
                  variant="bitcash-solid" 
                  width="full"
                  onClick={() => router.push('/signup/agent')}
                >
                  {t('calculator.resultsSection.applyButton', 'Apply to Become an Agent')}
                </Button>
              </Box>
            </SlideFade>
          </SimpleGrid>
          
          <SlideFade in offsetY="30px">
            <Box 
              mt={10} 
              p={6} 
              bg={cardBg} 
              borderRadius="xl" 
              boxShadow={softShadow}
            >
              <Heading size="md" mb={4} color={accentColor}>
                {t('calculator.additionalInfo.heading', 'Additional Earning Opportunities')}
              </Heading>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <Box p={4} bg={accentBg} borderRadius="md">
                  <Text fontWeight="bold" mb={2}>
                    {t('calculator.additionalInfo.tierUpgrades.title', 'Agent Tier Upgrades')}
                  </Text>
                  <Text fontSize="sm">
                    {t('calculator.additionalInfo.tierUpgrades.description', 'Premium and Super Agent tiers provide higher commission rates after qualifying period.')}
                  </Text>
                </Box>
                
                <Box p={4} bg={accentBg} borderRadius="md">
                  <Text fontWeight="bold" mb={2}>
                    {t('calculator.additionalInfo.volumeBonuses.title', 'Volume Bonuses')}
                  </Text>
                  <Text fontSize="sm">
                    {t('calculator.additionalInfo.volumeBonuses.description', 'Additional rewards for reaching monthly transaction targets and milestones.')}
                  </Text>
                </Box>
                
                <Box p={4} bg={accentBg} borderRadius="md">
                  <Text fontWeight="bold" mb={2}>
                    {t('calculator.additionalInfo.subAgents.title', 'Sub-Agent Network')}
                  </Text>
                  <Text fontSize="sm">
                    {t('calculator.additionalInfo.subAgents.description', 'Super Agents earn passive income from transactions processed by their sub-agents.')}
                  </Text>
                </Box>
              </SimpleGrid>
              
              <Text mt={6} fontSize="sm" color="gray.500" textAlign="center">
                {t('calculator.additionalInfo.updateNote', 'Commission rates and bonus structures are current as of February 2025 and subject to change.')}
              </Text>
            </Box>
          </SlideFade>
          
          <Flex justifyContent="center" mt={10}>
            <Button 
              variant="link" 
              color={accentColor}
              onClick={() => router.push('/agents')}
            >
              {t('calculator.backButton', 'Back to Agent Information')}
            </Button>
          </Flex>
        </Container>
      </Box>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default Calculator;