// components/merchants/BusinessDetailsCard.js
import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  IconButton,
  Button,
  useColorModeValue,
  Tooltip,
  AspectRatio,
  useBreakpointValue,
  SimpleGrid,
  Collapse
} from '@chakra-ui/react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import {
  MapPin,
  Phone,
  Mail,
  Building2,
  FileText,
  QrCode,
  Plus,
  ChevronDown,
  ChevronUp,
  Users,
  Calendar,
  BarChart4,
  PieChart,
  Check,
  AlertTriangle
} from 'lucide-react';

const BusinessDetailsCard = ({ merchant, onQROpen, onCreateLink }) => {
  const [showExtra, setShowExtra] = useState(false);
  
  // Theme colors
  const bgGradient = useColorModeValue(
    'linear(to-r, bitcash.400, bitcash.700)',
    'linear(to-r, bitcash.600, bitcash.800)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Status badges
  const getStatusConfig = (status, type) => {
    const configs = {
      verification: {
        verified: { colorScheme: 'green', icon: Check },
        pending: { colorScheme: 'yellow', icon: AlertTriangle },
        rejected: { colorScheme: 'red', icon: AlertTriangle }
      },
      activity: {
        active: { colorScheme: 'blue', icon: Check },
        suspended: { colorScheme: 'orange', icon: AlertTriangle },
        inactive: { colorScheme: 'gray', icon: AlertTriangle }
      }
    };
    return configs[type]?.[status] || { colorScheme: 'gray', icon: AlertTriangle };
  };

  const renderBusinessLogo = () => (
    <AspectRatio ratio={1} width={{ base: "80px", md: "120px" }} minWidth={{ base: "80px", md: "120px" }}>
      <Box
        position="relative"
        borderRadius="xl"
        overflow="hidden"
        borderWidth={2}
        borderColor="bitcash.500"
      >
        {merchant.logo?.data ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${merchant.logo.data.attributes.url}`}
            alt={merchant.businessName}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <Box
            bg="bitcash.50"
            _dark={{ bg: 'bitcash.900' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Building2 
              size={useBreakpointValue({ base: 32, md: 48 })}
              className="text-bitcash-500"
            />
          </Box>
        )}
      </Box>
    </AspectRatio>
  );

  const renderContactInfo = () => (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} width="full">
      <HStack spacing={3}>
        <IconButton
          icon={<MapPin size={18} />}
          aria-label="Location"
          variant="ghost"
          colorScheme="bitcash"
          size="sm"
        />
        <Text fontSize="sm" noOfLines={1}>
          {merchant.location?.address || 'Address not provided'}
        </Text>
      </HStack>
      <HStack spacing={3}>
        <IconButton
          icon={<Phone size={18} />}
          aria-label="Phone"
          variant="ghost"
          colorScheme="bitcash"
          size="sm"
        />
        <Text fontSize="sm">
          {merchant.contact?.phone || 'Phone not provided'}
        </Text>
      </HStack>
      <HStack spacing={3}>
        <IconButton
          icon={<FileText size={18} />}
          aria-label="Registration"
          variant="ghost"
          colorScheme="bitcash"
          size="sm"
        />
        <Text fontSize="sm">
          Reg: {merchant.registrationNumber || 'Not available'}
        </Text>
      </HStack>
    </SimpleGrid>
  );

  const renderStatusBadges = () => (
    <HStack spacing={2} flexWrap="wrap">
      <Badge
        colorScheme={getStatusConfig(merchant.verificationStatus, 'verification').colorScheme}
        display="flex"
        alignItems="center"
        px={2}
        py={1}
        borderRadius="full"
      >
        <Box as={getStatusConfig(merchant.verificationStatus, 'verification').icon} size={12} mr={1} />
        {merchant.verificationStatus?.toUpperCase()}
      </Badge>
      <Badge
        colorScheme={getStatusConfig(merchant.status, 'activity').colorScheme}
        display="flex"
        alignItems="center"
        px={2}
        py={1}
        borderRadius="full"
      >
        <Box as={getStatusConfig(merchant.status, 'activity').icon} size={12} mr={1} />
        {merchant.status?.toUpperCase()}
      </Badge>
      <Badge
        colorScheme="purple"
        px={2}
        py={1}
        borderRadius="full"
      >
        {merchant.currency}
      </Badge>
    </HStack>
  );

  const renderMetrics = () => (
    <SimpleGrid columns={{ base: 2, lg: 4 }} gap={4} width="full">
      <MetricBox
        icon={Users}
        label="Total Customers"
        value={merchant.metadata?.totalCustomers || 0}
      />
      <MetricBox
        icon={Calendar}
        label="Member Since"
        value={format(parseISO(merchant.createdAt), 'MMM yyyy')}
      />
      <MetricBox
        icon={BarChart4}
        label="Growth Rate"
        value={`${merchant.metadata?.growthRate || 0}%`}
        trend="up"
      />
      <MetricBox
        icon={PieChart}
        label="Market Share"
        value={`${merchant.metadata?.marketShare || 0}%`}
      />
    </SimpleGrid>
  );

  return (
    <Box
      bg={cardBg}
      borderRadius="xl"
      borderWidth={1}
      borderColor={borderColor}
      overflow="hidden"
      position="relative"
    >
      <Box
        position="absolute"
        inset={0}
        bgGradient={bgGradient}
        opacity={0.05}
        pointerEvents="none"
      />

      <Box p={6}>
        <VStack spacing={6} align="stretch">
          <HStack spacing={6} align="start">
            {renderBusinessLogo()}

            <VStack align="stretch" spacing={4} flex={1}>
              <VStack align="stretch" spacing={1}>
                <Heading size="lg" color="bitcash.500">
                  {merchant.businessName}
                </Heading>
                <Text color="gray.500">
                  {merchant.businessType}
                </Text>
              </VStack>

              {renderContactInfo()}
              {renderStatusBadges()}
            </VStack>

            <HStack spacing={2}>
              <Tooltip label="View QR Code" placement="top">
                <IconButton
                  icon={<QrCode size={20} />}
                  colorScheme="bitcash"
                  variant="outline"
                  size="lg"
                  onClick={onQROpen}
                />
              </Tooltip>
              <Button
                leftIcon={<Plus size={20} />}
                colorScheme="bitcash"
                onClick={onCreateLink}
                size="lg"
              >
                Create Link
              </Button>
            </HStack>
          </HStack>

          <Collapse in={showExtra}>
            <Box pt={4} borderTopWidth={1} borderColor={borderColor}>
              {renderMetrics()}
            </Box>
          </Collapse>

          <IconButton
            icon={showExtra ? <ChevronUp /> : <ChevronDown />}
            variant="ghost"
            size="sm"
            position="absolute"
            bottom={2}
            right={2}
            onClick={() => setShowExtra(!showExtra)}
          />
        </VStack>
      </Box>
    </Box>
  );
};

const MetricBox = ({ icon: Icon, label, value, trend }) => {
  const bgHover = useColorModeValue('gray.50', 'gray.700');
  
  return (
    <Box
      p={4}
      borderRadius="lg"
      borderWidth={1}
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      _hover={{ bg: bgHover }}
      transition="all 0.2s"
    >
      <HStack spacing={3}>
        <IconButton
          icon={<Icon size={18} />}
          variant="ghost"
          colorScheme="bitcash"
          size="sm"
        />
        <VStack align="start" spacing={0}>
          <Text fontSize="sm" color="gray.500">{label}</Text>
          <Text fontSize="lg" fontWeight="bold">{value}</Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default BusinessDetailsCard;