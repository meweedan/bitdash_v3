import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Flex,
  Icon,
  useColorModeValue,
  Badge,
  Divider,
  useBreakpointValue,
  Tag,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';
import {
  FaTrophy,
  FaChartLine,
  FaShieldAlt,
  FaBalanceScale,
  FaArrowRight,
  FaInfoCircle,
  FaCheckCircle,
  FaTimes
} from 'react-icons/fa';
import Layout from '@/components/Layout';

// Challenge data
const challengeTypes = [
  {
    id: 'standard-challenge',
    title: 'Standard Challenge',
    amount: '$10,000',
    fee: '$99',
    duration: '30 days',
    profitTarget: '8%',
    maxLoss: '5%',
    color: 'brand.bitfund.400',
    tag: 'Most Popular',
    feature: 'Low Barrier to Entry',
    suitableFor: 'Beginners and new traders'
  },
  {
    id: 'professional-challenge',
    title: 'Professional Challenge',
    amount: '$50,000',
    fee: '$249',
    duration: '60 days',
    profitTarget: '10%',
    maxLoss: '8%',
    color: 'brand.bitfund.500',
    feature: 'Balanced Risk-Reward',
    suitableFor: 'Intermediate traders with experience'
  },
  {
    id: 'elite-challenge',
    title: 'Elite Challenge',
    amount: '$100,000',
    fee: '$499',
    duration: '60 days',
    profitTarget: '12%',
    maxLoss: '10%',
    color: 'brand.bitfund.600',
    feature: 'Significant Capital',
    suitableFor: 'Experienced traders looking to scale'
  },
  {
    id: 'institutional-challenge',
    title: 'Institutional Challenge',
    amount: '$200,000',
    fee: '$999',
    duration: '90 days',
    profitTarget: '15%',
    maxLoss: '12%',
    color: 'brand.bitfund.700',
    tag: 'Professional',
    feature: 'Maximum Opportunity',
    suitableFor: 'Professional and institutional traders'
  }
];

const tradingRules = [
  {
    title: 'Maximum Daily Loss',
    rule: 'Cannot exceed 2% of initial account balance',
    description: 'If your daily loss exceeds 2% of your initial account balance, your challenge will be terminated.'
  },
  {
    title: 'Maximum Total Loss',
    rule: 'Varies by challenge type (5-12%)',
    description: 'Your account will be terminated if your total loss exceeds the maximum allowed percentage.'
  },
  {
    title: 'Holding Positions',
    rule: 'No overnight holding on Fridays',
    description: 'All positions must be closed before the market closes on Friday to avoid weekend gap risk.'
  },
  {
    title: 'Trading Hours',
    rule: 'Trading allowed during market hours only',
    description: 'Trading is only permitted during official market hours of the respective exchanges.'
  },
  {
    title: 'News Trading',
    rule: 'No trading during major economic announcements',
    description: 'Trading is not allowed 10 minutes before and after major economic announcements.'
  },
  {
    title: 'Profit Split',
    rule: '80/20 in favor of the trader',
    description: 'After passing the challenge, you receive 80% of profits while BitFund retains 20%.'
  }
];

const compareFeatures = [
  {
    feature: 'Account Size',
    standard: '$10,000',
    professional: '$50,000',
    elite: '$100,000',
    institutional: '$200,000'
  },
  {
    feature: 'Evaluation Fee',
    standard: '$99',
    professional: '$249',
    elite: '$499',
    institutional: '$999'
  },
  {
    feature: 'Evaluation Period',
    standard: '30 days',
    professional: '60 days',
    elite: '60 days',
    institutional: '90 days'
  },
  {
    feature: 'Profit Target',
    standard: '8%',
    professional: '10%',
    elite: '12%',
    institutional: '15%'
  },
  {
    feature: 'Maximum Drawdown',
    standard: '5%',
    professional: '8%',
    elite: '10%',
    institutional: '12%'
  },
  {
    feature: 'Daily Drawdown Limit',
    standard: '2%',
    professional: '3%',
    elite: '4%',
    institutional: '5%'
  },
  {
    feature: 'Minimum Trading Days',
    standard: '10 days',
    professional: '15 days',
    elite: '15 days',
    institutional: '20 days'
  },
  {
    feature: 'Profit Split',
    standard: '80/20',
    professional: '80/20',
    elite: '80/20',
    institutional: '80/20'
  },
  {
    feature: 'Islamic Account Available',
    standard: true,
    professional: true,
    elite: true,
    institutional: true
  }
];

const faqItems = [
  {
    question: "What is a prop firm challenge?",
    answer: "A prop firm challenge is an evaluation process designed to identify skilled traders. Traders demonstrate their ability to generate profits while managing risk, and upon successful completion, they receive funded accounts to trade with the firm's capital."
  },
  {
    question: "How does the BitFund challenge process work?",
    answer: "The process consists of two phases: the Challenge Phase and the Verification Phase. In the Challenge Phase, you need to reach a specified profit target while following our trading rules. Once successful, you move to the Verification Phase with similar but slightly more relaxed targets to verify consistency. After passing both phases, you receive a funded account."
  },
  {
    question: "What are the benefits of Islamic trading accounts?",
    answer: "Our Islamic trading accounts are fully Sharia-compliant, featuring no overnight swap charges, no interest (riba), immediate trade execution, and transparent fee structures. These accounts allow Muslim traders to participate in financial markets while adhering to Islamic finance principles."
  },
  {
    question: "What happens if I fail the challenge?",
    answer: "If you fail to meet the profit target or violate any of the trading rules, your challenge will be terminated. You can purchase a new challenge if you wish to try again. We provide detailed statistics and analytics to help you understand what went wrong and improve your strategy."
  },
  {
    question: "Can I trade any instruments during the challenge?",
    answer: "You can trade all available instruments on our platform, including Forex pairs, indices, commodities, and cryptocurrencies. For Islamic accounts, certain instruments may be restricted to ensure Sharia compliance."
  },
  {
    question: "When do I get paid after becoming a funded trader?",
    answer: "Profit payouts are processed monthly. Once you become a funded trader, you'll receive 80% of the profits generated, which will be processed within the first week of each month for the previous month's trading."
  }
];