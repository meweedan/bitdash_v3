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
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputLeftAddon,
  Select,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Textarea,
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SlideFade,
  Tooltip,
  useClipboard,
} from '@chakra-ui/react';

// Chakra UI Icons
import {
  ArrowForwardIcon,
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  EmailIcon,
  LinkIcon,
  QuestionIcon,
  RepeatIcon,
  ViewIcon,
} from '@chakra-ui/icons';

// Framer Motion
import { motion } from 'framer-motion';

// Layout component
import Layout from '@/components/Layout';

// Mock Portfolio Preview component (in a real app this might show a dynamic chart or portfolio summary)
const PortfolioPreview = ({ value, size = 200 }) => (
  <Box
    width={`${size}px`}
    height={`${size}px`}
    borderRadius="md"
    p={4}
    position="relative"
    overflow="hidden"
  >
    <Box 
      position="absolute" 
      top="10%" 
      left="10%" 
      right="10%" 
      bottom="10%" 
      borderRadius="md"
      bg="gray.200"
      backgroundImage="repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)"
    />
    <Image
      src="/images/portfolio-preview.png"
      alt="Portfolio Preview"
      fallback={
        <Box 
          width="100%" 
          height="100%" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          borderWidth={1}
          borderColor="gray.300"
          borderRadius="md"
        >
          <Text fontSize="sm" color="gray.500">Portfolio Preview</Text>
        </Box>
      }
      objectFit="contain"
      width="100%"
      height="100%"
    />
    <Box
      position="absolute"
      bottom="15%"
      left="50%"
      transform="translateX(-50%)"
      bg="brand.bitstock.500"
      fontSize="xs"
      fontWeight="bold"
      px={2}
      py={1}
      borderRadius="full"
    >
      BitStock
    </Box>
  </Box>
);

// Demo steps for BitStock
const steps = [
  { title: 'Sign Up', description: 'Create your investment account' },
  { title: 'Preferences', description: 'Set your Islamic investment preferences' },
  { title: 'Portfolio', description: 'Build your diversified portfolio' },
  { title: 'Invest', description: 'Start investing in stocks, commodities, and indices' },
];

function BitStockDemo() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;
  const { isOpen, onOpen, onClose } = useDisclosure();

  // For stepper navigation
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  // Demo state
  const [investorName, setInvestorName] = useState('');
  const [initialInvestment, setInitialInvestment] = useState(1000);
  const [assetPreference, setAssetPreference] = useState('us_stocks');
  const [riskProfile, setRiskProfile] = useState('moderate');
  const [investmentGoal, setInvestmentGoal] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLinkGenerated, setIsLinkGenerated] = useState(false);

  // For copy functionality
  const { hasCopied, onCopy } = useClipboard(portfolioLink);

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  // Function to simulate portfolio generation
  const generatePortfolioLink = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const mockId = Math.random().toString(36).substring(2, 10);
      const link = `https://invest.bitdash.app/${mockId}`;
      setPortfolioLink(link);
      setIsLinkGenerated(true);
      setIsGenerating(false);
      onOpen(); // Open the success modal
    }, 1500);
  };

  // Reset demo state
  const resetDemo = () => {
    setInvestorName('');
    setInitialInvestment(1000);
    setAssetPreference('us_stocks');
    setRiskProfile('moderate');
    setInvestmentGoal('');
    setPortfolioLink('');
    setIsLinkGenerated(false);
    setActiveStep(0);
  };

  // Colors & UI values
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue('brand.bitstock.600', 'brand.bitstock.400');
  const accentBg = useColorModeValue('brand.bitstock.400', 'brand.bitstock.700');
  const softShadow = useColorModeValue('lg', 'dark-lg');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Layout>
      <Box minH="80vh" display="flex" py={6}>
        <Container maxW="7xl">
          <SlideFade in offsetY="20px">
            <VStack spacing={4} textAlign="center" mb={10}>
              <Heading 
                fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                color={accentColor}
              >
                {t('bitstockDemo.heading', 'Discover BitStock for Islamic Investing')}
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} maxW="800px">
                {t('bitstockDemo.subheading', 'Experience a seamless platform for investing in US/EU stocks, gold, oil, and indices – all in line with Islamic principles.')}
              </Text>
            </VStack>
          </SlideFade>

          {/* Stepper */}
          <SlideFade in offsetY="30px">
            <Box bg={cardBg} p={{ base: 4, md: 6 }} borderRadius="xl" boxShadow={softShadow} mb={8}>
            <Stepper
            index={activeStep}
            mb={8}
            sx={{
                '.chakra-step__indicator': {
                color: 'brand.bitstock.400',
                },
                '.chakra-step__separator': {
                bg: 'brand.bitstock.400',
                },
                '.chakra-step__number': {
                color: 'brand.bitstock.400',
                },
            }}
            >
            {steps.map((step, index) => (
                <Step key={index} onClick={() => setActiveStep(index)} cursor="pointer" >
                <StepIndicator >
                    <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                    />
                </StepIndicator>
                <Box display={{ base: 'none', md: 'block' }}>
                    <StepTitle>{step.title}</StepTitle>
                </Box>
                <StepSeparator />
                </Step>
            ))}
            </Stepper>


              {/* Step Content */}
              <Box p={{ base: 2, md: 4 }}>
                {activeStep === 0 && (
                  <SlideFade in offsetY="20px">
                    <VStack spacing={6} align="stretch">
                      <Heading size="md" color={accentColor}>
                        {t('bitstockDemo.step1.heading', 'Create Your Investment Account')}
                      </Heading>
                      <Text>
                        {t('bitstockDemo.step1.description', 'Begin by setting up your account. Your details will help us tailor your investment experience.')}
                      </Text>
                      
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <VStack align="stretch" spacing={4}>
                          <FormControl>
                            <FormLabel>{t('bitstockDemo.step1.form.name', 'Full Name')}</FormLabel>
                            <Input 
                              value={investorName}
                              onChange={(e) => setInvestorName(e.target.value)}
                              placeholder="Your Full Name"
                            />
                            <FormHelperText>
                              {t('bitstockDemo.step1.form.nameHelp', 'This name will appear on your investment profile')}
                            </FormHelperText>
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>{t('bitstockDemo.step1.form.email', 'Email Address')}</FormLabel>
                            <Input 
                              placeholder="yourname@example.com"
                              defaultValue="demo@example.com"
                              isReadOnly
                            />
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>{t('bitstockDemo.step1.form.phone', 'Contact Number')}</FormLabel>
                            <Input 
                              placeholder="+1 (555) 123-4567"
                              defaultValue="+1 (555) 123-4567"
                              isReadOnly
                            />
                          </FormControl>
                        </VStack>
                        
                        <Box
                          p={5}
                          bg={accentBg}
                          borderRadius="md"
                          borderLeft="4px solid"
                          borderColor={accentColor}
                        >
                          <Heading size="sm" mb={4}>
                            {t('bitstockDemo.step1.benefits.heading', 'Investment Benefits')}
                          </Heading>
                          <VStack align="start" spacing={3}>
                            <HStack>
                              <CheckCircleIcon color="brand.bitstock.500" />
                              <Text fontSize="sm">
                                {t('bitstockDemo.step1.benefits.benefit1', 'Access global markets')}
                              </Text>
                            </HStack>
                            <HStack>
                              <CheckCircleIcon color="brand.bitstock.500" />
                              <Text fontSize="sm">
                                {t('bitstockDemo.step1.benefits.benefit2', 'Invest Shariah-compliantly')}
                              </Text>
                            </HStack>
                            <HStack>
                              <CheckCircleIcon color="brand.bitstock.500" />
                              <Text fontSize="sm">
                                {t('bitstockDemo.step1.benefits.benefit3', 'Low fees, competitive returns')}
                              </Text>
                            </HStack>
                            <HStack>
                              <CheckCircleIcon color="brand.bitstock.500" />
                              <Text fontSize="sm">
                                {t('bitstockDemo.step1.benefits.benefit4', 'Real-time portfolio tracking')}
                              </Text>
                            </HStack>
                          </VStack>
                        </Box>
                      </SimpleGrid>
                      
                      <Flex justify="flex-end" mt={4}>
                        <Button
                          rightIcon={<ArrowForwardIcon />}
                          variant="bitstock-solid"
                          onClick={() => setActiveStep(1)}
                          isDisabled={!investorName.trim()}
                        >
                          {t('bitstockDemo.common.nextButton', 'Next Step')}
                        </Button>
                      </Flex>
                    </VStack>
                  </SlideFade>
                )}

                {activeStep === 1 && (
                  <SlideFade in offsetY="20px">
                    <VStack spacing={6} align="stretch">
                      <Heading size="md" color={accentColor}>
                        {t('bitstockDemo.step2.heading', 'Set Your Investment Preferences')}
                      </Heading>
                      <Text>
                        {t('bitstockDemo.step2.description', 'Customize your approach by selecting your preferred asset and risk level.')}
                      </Text>
                      
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <VStack align="stretch" spacing={4}>
                          <FormControl>
                            <FormLabel>{t('bitstockDemo.step2.form.investmentAmount', 'Initial Investment Amount')}</FormLabel>
                            <InputGroup>
                              <InputLeftAddon>$</InputLeftAddon>
                              <NumberInput
                                value={initialInvestment}
                                onChange={(valueString) => setInitialInvestment(parseFloat(valueString))}
                                min={100}
                                max={100000}
                                precision={2}
                                width="100%"
                              >
                                <NumberInputField borderLeftRadius={0} />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </InputGroup>
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>{t('bitstockDemo.step2.form.assetPreference', 'Preferred Asset')}</FormLabel>
                            <Select 
                              value={assetPreference}
                              onChange={(e) => setAssetPreference(e.target.value)}
                            >
                              <option value="us_stocks">{t('bitstockDemo.step2.form.assetUS', 'US Stocks')}</option>
                              <option value="eu_stocks">{t('bitstockDemo.step2.form.assetEU', 'EU Stocks')}</option>
                              <option value="gold">{t('bitstockDemo.step2.form.assetGold', 'Gold')}</option>
                              <option value="oil">{t('bitstockDemo.step2.form.assetOil', 'Oil')}</option>
                              <option value="indices">{t('bitstockDemo.step2.form.assetIndices', 'Indices')}</option>
                            </Select>
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>{t('bitstockDemo.step2.form.riskProfile', 'Risk Profile')}</FormLabel>
                            <Select 
                              value={riskProfile}
                              onChange={(e) => setRiskProfile(e.target.value)}
                            >
                              <option value="conservative">{t('bitstockDemo.step2.form.riskConservative', 'Conservative')}</option>
                              <option value="moderate">{t('bitstockDemo.step2.form.riskModerate', 'Moderate')}</option>
                              <option value="aggressive">{t('bitstockDemo.step2.form.riskAggressive', 'Aggressive')}</option>
                            </Select>
                          </FormControl>
                        </VStack>
                        
                        <Box p={5} borderRadius="md" borderWidth={1} borderColor={borderColor}>
                          <Heading size="sm" mb={4}>
                            {t('bitstockDemo.step2.preview.heading', 'Investment Profile Preview')}
                          </Heading>
                          <Box borderRadius="md" overflow="hidden" boxShadow="sm">
                            <Box p={3} borderBottomWidth={1} borderColor={borderColor}>
                              <Text fontWeight="bold">{investorName || 'Your Name'}'s Profile</Text>
                            </Box>
                            <SimpleGrid columns={2} spacing={4} p={4}>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="xs">Investment</Text>
                                <Text fontWeight="bold">${initialInvestment.toFixed(2)}</Text>
                              </VStack>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="xs">Asset</Text>
                                <Text fontWeight="bold">{assetPreference.replace('_', ' ').toUpperCase()}</Text>
                              </VStack>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="xs">Risk</Text>
                                <Text fontWeight="bold">{riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)}</Text>
                              </VStack>
                            </SimpleGrid>
                          </Box>
                        </Box>
                      </SimpleGrid>
                      
                      <Flex justify="space-between" mt={4}>
                        <Button
                          leftIcon={<ArrowForwardIcon transform="rotate(180deg)" />}
                          variant="bitstock-outline"
                          onClick={() => setActiveStep(0)}
                        >
                          {t('bitstockDemo.common.backButton', 'Back')}
                        </Button>
                        <Button
                          rightIcon={<ArrowForwardIcon />}
                          variant="bitstock-solid"
                          onClick={() => setActiveStep(2)}
                        >
                          {t('bitstockDemo.common.nextButton', 'Next Step')}
                        </Button>
                      </Flex>
                    </VStack>
                  </SlideFade>
                )}

                {activeStep === 2 && (
                  <SlideFade in offsetY="20px">
                    <VStack spacing={6} align="stretch">
                      <Heading size="md" color={accentColor}>
                        {t('bitstockDemo.step3.heading', 'Build Your Investment Portfolio')}
                      </Heading>
                      <Text>
                        {t('bitstockDemo.step3.description', 'Generate your personalized portfolio based on your preferences.')}
                      </Text>
                      
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <VStack align="stretch" spacing={4}>
                          <FormControl>
                            <FormLabel>{t('bitstockDemo.step3.form.goal', 'Investment Goal')}</FormLabel>
                            <Textarea
                              value={investmentGoal}
                              onChange={(e) => setInvestmentGoal(e.target.value)}
                              placeholder="e.g. Retirement savings, wealth growth, etc."
                              rows={3}
                            />
                            <FormHelperText>
                              {t('bitstockDemo.step3.form.goalHelp', 'Describe your main investment objective')}
                            </FormHelperText>
                          </FormControl>
                          
                          <Button
                            mt={2}
                            variant="bitstock-solid"
                            width="full"
                            onClick={generatePortfolioLink}
                            isLoading={isGenerating}
                            loadingText={t('bitstockDemo.step3.form.generating', 'Generating...')}
                            isDisabled={isLinkGenerated}
                          >
                            {t('bitstockDemo.step3.form.generateButton', 'Generate Investment Portfolio')}
                          </Button>
                        </VStack>
                        
                        <VStack
                          spacing={4}
                          p={5}
                          borderRadius="md"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {isLinkGenerated ? (
                            <PortfolioPreview value={portfolioLink} size={200} />
                          ) : (
                            <Box
                              width="200px"
                              height="200px"
                              borderWidth={2}
                              borderStyle="dashed"
                              borderColor="gray.300"
                              borderRadius="md"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <VStack>
                                <QuestionIcon boxSize={10} color="gray.400" />
                                <Text textAlign="center" fontSize="sm" color="gray.500" px={4}>
                                  {t('bitstockDemo.step3.preview.placeholder', 'Your portfolio preview will appear here')}
                                </Text>
                              </VStack>
                            </Box>
                          )}
                          
                          {isLinkGenerated && (
                            <VStack spacing={2} width="100%">
                              <Text fontWeight="bold">{t('bitstockDemo.step3.preview.link', 'Portfolio Link:')}</Text>
                              <HStack
                                p={2}
                                borderRadius="md"
                                borderWidth={1}
                                borderColor={borderColor}
                                width="100%"
                                justifyContent="space-between"
                              >
                                <Text fontSize="sm" isTruncated maxW="70%">
                                  {portfolioLink}
                                </Text>
                                <Tooltip
                                  label={hasCopied ? t('bitstockDemo.step3.preview.copied', 'Copied!') : t('bitstockDemo.step3.preview.copy', 'Copy')}
                                  closeOnClick={false}
                                >
                                  <Button size="sm" onClick={onCopy} variant="bitstock-outline">
                                    <CopyIcon />
                                  </Button>
                                </Tooltip>
                              </HStack>
                            </VStack>
                          )}
                        </VStack>
                      </SimpleGrid>
                      
                      <Flex justify="space-between" mt={4}>
                        <Button
                          leftIcon={<ArrowForwardIcon transform="rotate(180deg)" />}
                          variant="bitstock-outline"
                          onClick={() => setActiveStep(1)}
                        >
                          {t('bitstockDemo.common.backButton', 'Back')}
                        </Button>
                        <Button
                          rightIcon={<ArrowForwardIcon />}
                          variant="bitstock-solid"
                          onClick={() => setActiveStep(3)}
                          isDisabled={!isLinkGenerated}
                        >
                          {t('bitstockDemo.common.nextButton', 'Next Step')}
                        </Button>
                      </Flex>
                    </VStack>
                  </SlideFade>
                )}

                {activeStep === 3 && (
                  <SlideFade in offsetY="20px">
                    <VStack spacing={6} align="stretch">
                      <Heading size="md" color={accentColor}>
                        {t('bitstockDemo.step4.heading', 'Start Investing')}
                      </Heading>
                      <Text>
                        {t('bitstockDemo.step4.description', 'Your investment portfolio is ready. Share your portfolio link or explore detailed insights on your dashboard.')}
                      </Text>
                      
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <VStack spacing={4} align="stretch">
                          <Heading size="sm" mb={2}>
                            {t('bitstockDemo.step4.sharing.heading', 'Sharing Options')}
                          </Heading>
                          
                          <Button
                            leftIcon={<EmailIcon />}
                            colorScheme="blue"
                            width="full"
                            variant="bitstock-outline"
                          >
                            {t('bitstockDemo.step4.sharing.email', 'Share via Email')}
                          </Button>
                          
                          <Button
                            leftIcon={<DownloadIcon />}
                            colorScheme="purple"
                            width="full"
                            variant="bitstock-outline"
                          >
                            {t('bitstockDemo.step4.sharing.download', 'Download Portfolio')}
                          </Button>
                          
                          <Button
                            leftIcon={<LinkIcon />}
                            colorScheme="orange"
                            width="full"
                            variant="bitstock-outline"
                            onClick={onCopy}
                          >
                            {hasCopied ? t('bitstockDemo.step4.sharing.copied', 'Link Copied!') : t('bitstockDemo.step4.sharing.copy', 'Copy Portfolio Link')}
                          </Button>
                          
                          <Box
                            p={4}
                            bg={accentBg}
                            borderRadius="md"
                            borderLeft="4px solid"
                            borderColor={accentColor}
                            mt={4}
                          >
                            <Heading size="sm" mb={3}>
                              {t('bitstockDemo.step4.tips.heading', 'Tips for Smart Investing')}
                            </Heading>
                            <VStack align="start" spacing={2}>
                              <HStack>
                                <CheckCircleIcon color="brand.bitstock.500" />
                                <Text fontSize="sm">{t('bitstockDemo.step4.tips.tip1', 'Diversify your investments')}</Text>
                              </HStack>
                              <HStack>
                                <CheckCircleIcon color="brand.bitstock.500" />
                                <Text fontSize="sm">{t('bitstockDemo.step4.tips.tip2', 'Stay informed on market trends')}</Text>
                              </HStack>
                              <HStack>
                                <CheckCircleIcon color="brand.bitstock.500" />
                                <Text fontSize="sm">{t('bitstockDemo.step4.tips.tip3', 'Invest for the long term')}</Text>
                              </HStack>
                              <HStack>
                                <CheckCircleIcon color="brand.bitstock.500" />
                                <Text fontSize="sm">{t('bitstockDemo.step4.tips.tip4', 'Review your portfolio regularly')}</Text>
                              </HStack>
                            </VStack>
                          </Box>
                        </VStack>
                        
                        <VStack spacing={4} align="center">
                          <Heading size="sm" mb={2}>
                            {t('bitstockDemo.step4.preview.heading', 'Your Investment Snapshot')}
                          </Heading>
                          
                          <Box
                            width="100%"
                            maxW="300px"
                            borderRadius="lg"
                            overflow="hidden"
                            boxShadow="md"
                            borderWidth={1}
                            borderColor={borderColor}
                          >
                            <Box bg="brand.bitstock.500" p={3}>
                              <Text fontWeight="bold" textAlign="center">BitStock Portfolio</Text>
                            </Box>
                            <VStack p={4} spacing={4}>
                              <Text fontWeight="bold" textAlign="center">{investorName || 'Investor'}</Text>
                              <Text fontSize="lg" fontWeight="bold" color="brand.bitstock.500">
                                ${initialInvestment.toFixed(2)}
                              </Text>
                              {investmentGoal && (
                                <Text fontSize="sm" textAlign="center">{investmentGoal}</Text>
                              )}
                              <Button color="brand.bitcash.400" width="full">
                                {t('bitstockDemo.step4.preview.investButton', 'Invest Now')}
                              </Button>
                              <Text fontSize="xs" color="gray.500" textAlign="center">
                                {t('bitstockDemo.step4.preview.secureNote', 'Secure & Shariah-compliant investments')}
                              </Text>
                            </VStack>
                          </Box>
                          
                          <Text fontSize="sm" fontStyle="italic" textAlign="center" mt={4}>
                            {t('bitstockDemo.step4.preview.message', 'This is a preview of your investment dashboard.')}
                          </Text>
                        </VStack>
                      </SimpleGrid>
                      
                      <Flex justify="space-between" mt={4}>
                        <Button
                          leftIcon={<ArrowForwardIcon transform="rotate(180deg)" />}
                          variant="bitstock-outline"
                          onClick={() => setActiveStep(2)}
                        >
                          {t('bitstockDemo.common.backButton', 'Back')}
                        </Button>
                        <Button
                          leftIcon={<RepeatIcon />}
                          color="brand.bitstock.400"
                          onClick={resetDemo}
                        >
                          {t('bitstockDemo.step4.restartButton', 'Restart Demo')}
                        </Button>
                      </Flex>
                    </VStack>
                  </SlideFade>
                )}
              </Box>
            </Box>
          </SlideFade>

          {/* Additional Information */}
          <SlideFade in offsetY="30px">
            <Box bg={cardBg} p={{ base: 6, md: 8 }} borderRadius="xl" boxShadow={softShadow} mb={8}>
              <Tabs isFitted variant="bitstock-outline">
                <TabList>
                  <Tab>{t('bitstockDemo.info.tabs.benefits', 'Benefits')}</Tab>
                  <Tab>{t('bitstockDemo.info.tabs.features', 'Features')}</Tab>
                  <Tab>{t('bitstockDemo.info.tabs.faq', 'FAQ')}</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      <Box p={5} bg={accentBg} borderRadius="lg" borderLeft="4px solid" borderColor={accentColor}>
                        <Heading size="md" mb={3}>
                          {t('bitstockDemo.info.benefits.benefit1.title', 'Global Access')}
                        </Heading>
                        <Text fontSize="sm">
                          {t('bitstockDemo.info.benefits.benefit1.description', 'Invest in top US/EU stocks along with commodities like gold and oil.')}
                        </Text>
                      </Box>
                      
                      <Box p={5} bg={accentBg} borderRadius="lg" borderLeft="4px solid" borderColor={accentColor}>
                        <Heading size="md" mb={3}>
                          {t('bitstockDemo.info.benefits.benefit2.title', 'Shariah-Compliant')}
                        </Heading>
                        <Text fontSize="sm">
                          {t('bitstockDemo.info.benefits.benefit2.description', 'All investment options adhere to strict Islamic guidelines.')}
                        </Text>
                      </Box>
                      
                      <Box p={5} bg={accentBg} borderRadius="lg" borderLeft="4px solid" borderColor={accentColor}>
                        <Heading size="md" mb={3}>
                          {t('bitstockDemo.info.benefits.benefit3.title', 'Diversification')}
                        </Heading>
                        <Text fontSize="sm">
                          {t('bitstockDemo.info.benefits.benefit3.description', 'Build a diversified portfolio to balance risk and reward.')}
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </TabPanel>
                  
                  <TabPanel>
                    <VStack spacing={6} align="stretch">
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <HStack align="start" spacing={4}>
                          <Box p={2} bg="brand.bitstock.700" color="white" borderRadius="md">
                            <LinkIcon boxSize={5} />
                          </Box>
                          <Box>
                            <Heading size="sm" mb={1}>
                              {t('bitstockDemo.info.features.feature1.title', 'Tailored Options')}
                            </Heading>
                            <Text fontSize="sm">
                              {t('bitstockDemo.info.features.feature1.description', 'Customize your portfolio to suit your financial goals and risk appetite.')}
                            </Text>
                          </Box>
                        </HStack>
                        
                        <HStack align="start" spacing={4}>
                          <Box p={2} bg="brand.bitstock.700" color="white" borderRadius="md">
                            <ViewIcon boxSize={5} />
                          </Box>
                          <Box>
                            <Heading size="sm" mb={1}>
                              {t('bitstockDemo.info.features.feature2.title', 'Real-Time Tracking')}
                            </Heading>
                            <Text fontSize="sm">
                              {t('bitstockDemo.info.features.feature2.description', 'Monitor your investments and market trends in real time.')}
                            </Text>
                          </Box>
                        </HStack>
                        
                        <HStack align="start" spacing={4}>
                          <Box p={2} bg="brand.bitstock.700" color="white" borderRadius="md">
                            <EmailIcon boxSize={5} />
                          </Box>
                          <Box>
                            <Heading size="sm" mb={1}>
                              {t('bitstockDemo.info.features.feature3.title', 'Automated Reports')}
                            </Heading>
                            <Text fontSize="sm">
                              {t('bitstockDemo.info.features.feature3.description', 'Receive detailed investment reports directly to your inbox.')}
                            </Text>
                          </Box>
                        </HStack>
                        
                        <HStack align="start" spacing={4}>
                          <Box p={2} bg="brand.bitstock.700" color="white" borderRadius="md">
                            <CheckCircleIcon boxSize={5} />
                          </Box>
                          <Box>
                            <Heading size="sm" mb={1}>
                              {t('bitstockDemo.info.features.feature4.title', 'Secure & Compliant')}
                            </Heading>
                            <Text fontSize="sm">
                              {t('bitstockDemo.info.features.feature4.description', 'Experience state-of-the-art security with full compliance to Islamic investing standards.')}
                            </Text>
                          </Box>
                        </HStack>
                      </SimpleGrid>
                    </VStack>
                  </TabPanel>
                  
                  <TabPanel>
                    <Accordion allowToggle>
                      <AccordionItem mb={3} border="none" borderRadius="md" overflow="hidden" boxShadow="sm">
                        <h2>
                          <AccordionButton bg={accentBg} _expanded={{ bg: accentColor, color: 'white' }}>
                            <Box flex="1" textAlign="left" py={1}>
                              {t('bitstockDemo.info.faq.q1', 'How do I get started with BitStock?')}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel>
                          {t('bitstockDemo.info.faq.a1', 'Simply sign up, set your investment preferences, and our platform will create a personalized portfolio for you.')}
                        </AccordionPanel>
                      </AccordionItem>
                      
                      <AccordionItem mb={3} border="none" borderRadius="md" overflow="hidden" boxShadow="sm">
                        <h2>
                          <AccordionButton bg={accentBg} _expanded={{ bg: accentColor, color: 'white' }}>
                            <Box flex="1" textAlign="left" py={1}>
                              {t('bitstockDemo.info.faq.q2', 'Are all investments Shariah-compliant?')}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel>
                          {t('bitstockDemo.info.faq.a2', 'Yes, every investment option is carefully selected to adhere to Islamic principles.')}
                        </AccordionPanel>
                      </AccordionItem>
                      
                      <AccordionItem mb={3} border="none" borderRadius="md" overflow="hidden" boxShadow="sm">
                        <h2>
                          <AccordionButton bg={accentBg} _expanded={{ bg: accentColor, color: 'white' }}>
                            <Box flex="1" textAlign="left" py={1}>
                              {t('bitstockDemo.info.faq.q3', 'What is the minimum investment amount?')}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel>
                          {t('bitstockDemo.info.faq.a3', 'You can begin investing with as little as $100.')}
                        </AccordionPanel>
                      </AccordionItem>
                      
                      <AccordionItem mb={3} border="none" borderRadius="md" overflow="hidden" boxShadow="sm">
                        <h2>
                          <AccordionButton bg={accentBg} _expanded={{ bg: accentColor, color: 'white' }}>
                            <Box flex="1" textAlign="left" py={1}>
                              {t('bitstockDemo.info.faq.q4', 'Can I update my investment preferences later?')}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel>
                          {t('bitstockDemo.info.faq.a4', 'Absolutely—you can adjust your preferences and rebalance your portfolio at any time.')}
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </SlideFade>

          {/* CTA Section */}
          <SlideFade in offsetY="30px">
            <Box bg="brand.bitstock.400" p={{ base: 6, md: 10 }} borderRadius="xl" boxShadow={softShadow} mb={8} textAlign="center">
              <Heading size="lg" mb={4}>
                {t('bitstockDemo.cta.heading', 'Ready to Transform Your Investments?')}
              </Heading>
              <Text maxW="2xl" mx="auto" mb={6}>
                {t('bitstockDemo.cta.description', 'Join thousands of investors who trust BitStock for secure, Shariah-compliant, and diversified global investment opportunities.')}
              </Text>
              
              <HStack spacing={4} justifyContent="center">
                <Button 
                  variant="bitstock-solid" 
                  onClick={() => router.push('/signup/investor')}
                  rightIcon={<ArrowForwardIcon />}
                >
                  {t('bitstockDemo.cta.signupButton', 'Sign Up as Investor')}
                </Button>
                
                <Button 
                  variant="bitstock-solid" 
                  size="lg"
                  onClick={() => router.push('/investors')}
                >
                  {t('bitstockDemo.cta.learnButton', 'Learn More')}
                </Button>
              </HStack>
            </Box>
          </SlideFade>
          
          <Flex justifyContent="center">
            <Button variant="bitstock-outline" color={accentColor} onClick={() => router.push('/investors')}>
              {t('bitstockDemo.backButton', 'Back to Investment Information')}
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Success Modal for portfolio generation */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderTopRadius="md">
            {t('bitstockDemo.modal.heading', 'Investment Portfolio Created!')}
          </ModalHeader>
          <ModalCloseButton/>
          <ModalBody py={6}>
            <VStack spacing={4}>
              <CheckCircleIcon boxSize={12} color="brand.bitstock.500" />
              <Text fontWeight="bold">
                {t('bitstockDemo.modal.success', 'Your customized portfolio has been generated successfully.')}
              </Text>
              <Text>
                {t('bitstockDemo.modal.description', 'You can now share your portfolio link or review your investment insights on the dashboard.')}
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button color="brand.bitstock.500" mr={3} onClick={onClose}>
              {t('bitstockDemo.modal.continueButton', 'Continue')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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

export default BitStockDemo;
