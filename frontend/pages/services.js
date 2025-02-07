import React, { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import {
 Box, VStack, Heading, Text, Button, useColorMode,
 Container, SimpleGrid, Icon, useBreakpointValue,
 HStack, Badge, useDisclosure, Modal, ModalOverlay,
 ModalContent, ModalHeader, ModalBody, ModalCloseButton,
 Divider
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { 
 UtensilsCrossed, Car, PackageSearch, BrainCircuit,
 ArrowRight, ChevronRight, ShoppingBag, Check,
 BarChart3, Wallet, Users, Globe
} from 'lucide-react';

const MotionBox = motion(Box);

const Services = () => {
 const { t } = useTranslation('common');
 const router = useRouter();
 const { colorMode } = useColorMode();
 const { isOpen, onOpen, onClose } = useDisclosure();
 const [selectedService, setSelectedService] = useState(null);

 const colors = {
   primary: '#0066CC',
   secondary: '#67bdfd', 
   glass: colorMode === 'dark' ? 'rgba(0, 102, 204, 0.1)' : 'rgba(0, 102, 204, 0.05)',
   text: colorMode === 'dark' ? '#67bdfd' : '#1A365D',
   subtext: colorMode === 'dark' ? '#A0AEC0' : '#4A5568',
 };

 const currentServices = [
   {
     icon: UtensilsCrossed,
     title: 'BitMenus',
     description: t('bitMenusDescription'),
     features: [
       t('qrOrderingSystem'),
       t('menuManagement'),
       t('inventoryControl'),
       t('paymentProcessing'),
       t('analytics'),
       t('customerEngagement')
     ],
     metrics: [
       { icon: Users, value: '1,000+', label: t('activeRestaurants') },
       { icon: BarChart3, value: '50K+', label: t('ordersProcessed') },
       { icon: Wallet, value: '$2M+', label: t('processedValue') }
     ]
   },
   {
     icon: Car,
     title: 'BitAuto',
     description: t('bitAutoDescription'),
     features: [
       t('dealerDashboard'),
       t('vehicleListings'),
       t('qrVehicleInfo'),
       t('inquiryManagement'),
       t('marketAnalytics'),
       t('b2bTrading')
     ],
     metrics: [
       { icon: Car, value: '2,000+', label: t('listedVehicles') },
       { icon: Users, value: '200+', label: t('activeDealers') },
       { icon: Globe, value: '5+', label: t('citiesCovered') }
     ]
   },
   {
     icon: PackageSearch,
     title: 'BitTrade',
     description: t('bitTradeDescription'),
     features: [
       t('inventoryListing'),
       t('b2bMarketplace'),
       t('expiryTracking'),
       t('supplyChain'),
       t('bulkTrading'),
       t('logisticsIntegration')
     ],
     metrics: [
       { icon: PackageSearch, value: '5,000+', label: t('inventoryItems') },
       { icon: Users, value: '300+', label: t('activeBusinesses') },
       { icon: BarChart3, value: '$500K+', label: t('tradingVolume') }
     ]
   }
 ];

 const upcomingFeatures = [
   {
     icon: BrainCircuit,
     title: 'BitBI',
     badge: t('coming2024Q2'),
     description: t('bitBIDescription'),
     features: [
       t('crossPlatformAnalytics'),
       t('predictiveModeling'),
       t('marketInsights'),
       t('automatedReporting')
     ]
   },
   {
     icon: ShoppingBag,
     title: 'BitShop',
     badge: t('coming2024Q3'), 
     description: t('bitShopDescription'),
     features: [
       t('multiVendorPlatform'),
       t('deliveryIntegration'),
       t('loyaltyProgram'),
       t('omniChannel')
     ]
   }
 ];

 return (
   <Layout>
     <Container maxW="8xl">
       <VStack spacing={20}>
         <VStack spacing={4} textAlign="center">
           <Heading
             fontSize={{ base: '4xl', md: '6xl' }}
             bgGradient={`linear(to-r, ${colors.primary}, ${colors.secondary})`}
             bgClip="text"
           >
             {t('bitDashPlatforms')}
           </Heading>
           <Text
             fontSize={{ base: 'lg', md: 'xl' }}
             color={colors.subtext}
             maxW="3xl"
           >
             {t('platformsDescription')}
           </Text>
         </VStack>

         <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
           {currentServices.map((service, index) => (
             <ServiceCard 
               key={index}
               service={service} 
               colors={colors}
               onLearnMore={() => {
                 setSelectedService(service);
                 onOpen();
               }}
             />
           ))}
         </SimpleGrid>

         <VStack spacing={10} w="full">
           <Heading size="xl" color={colors.text}>
             {t('upcomingFeatures')}
           </Heading>
           <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
             {upcomingFeatures.map((service, index) => (
               <FutureServiceCard 
                 key={index}
                 service={service}
                 colors={colors}
               />
             ))}
           </SimpleGrid>
         </VStack>

         <Button
           size="lg"
           bg={colors.primary}
           color="white"
           px={12}
           py={7}
           fontSize="xl"
           rightIcon={<ArrowRight />}
           onClick={() => router.push('/signup')}
           _hover={{
             transform: 'translateY(-2px)',
             boxShadow: 'lg'
           }}
         >
           {t('getStarted')}
         </Button>
       </VStack>

       <ServiceModal
         isOpen={isOpen}
         onClose={onClose}
         service={selectedService}
         colors={colors}
       />
     </Container>
   </Layout>
 );
};

const ServiceCard = ({ service, colors, onLearnMore }) => {
  const { t } = useTranslation('common'); // Add this line
  
  return (
    <MotionBox
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        bg={colors.glass}
        borderRadius="xl"
        p={8}
        h="full"
        position="relative"
        boxShadow="xl"
      >
        <VStack align="flex-start" spacing={6}>
          <Icon as={service.icon} boxSize={10} color={colors.primary} />
          <Heading size="lg" color={colors.text}>{service.title}</Heading>
          <Text color={colors.subtext}>{service.description}</Text>
          
          <SimpleGrid columns={3} w="full" gap={4}>
            {service.metrics.map((metric, index) => (
              <VStack key={index} align="center">
                <Icon as={metric.icon} color={colors.primary} />
                <Text fontWeight="bold" fontSize="lg">{metric.value}</Text>
                <Text fontSize="sm" color={colors.subtext}>{metric.label}</Text>
              </VStack>
            ))}
          </SimpleGrid>

          <Divider />

          <VStack align="start" spacing={3}>
            {service.features.map((feature, index) => (
              <HStack key={index}>
                <Icon as={Check} color={colors.primary} />
                <Text color={colors.text}>{feature}</Text>
              </HStack>
            ))}
          </VStack>

          <Button
            variant="ghost"
            color={colors.primary}
            rightIcon={<ArrowRight />}
            onClick={onLearnMore}
          >
            {t('learnMore')}
          </Button>
        </VStack>
      </Box>
    </MotionBox>
  );
};

const FutureServiceCard = ({ service, colors }) => (
 <Box
   bg={colors.glass}
   borderRadius="xl"
   p={6}
   position="relative"
 >
   <Badge
     bg={`${colors.primary}15`}
     color={colors.primary}
     position="absolute"
     top={4}
     right={4}
   >
     {service.badge}
   </Badge>

   <VStack align="flex-start" spacing={4}>
     <Icon as={service.icon} boxSize={8} color={colors.primary} />
     <Heading size="lg" color={colors.text}>{service.title}</Heading>
     <Text color={colors.subtext}>{service.description}</Text>
     <VStack align="start" spacing={3}>
       {service.features.map((feature, index) => (
         <HStack key={index}>
           <Icon as={ChevronRight} color={colors.primary} />
           <Text color={colors.text}>{feature}</Text>
         </HStack>
       ))}
     </VStack>
   </VStack>
 </Box>
);

const ServiceModal = ({ isOpen, onClose, service, colors }) => {
  const { t } = useTranslation('common'); // Add this line
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent bg={colors.glass}>
        <ModalHeader>
          <HStack>
            {service && (
              <>
                <Icon as={service.icon} boxSize={6} color={colors.primary} />
                <Text color={colors.text}>{service?.title}</Text>
              </>
            )}
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {service && (
            <VStack align="stretch" spacing={6}>
              <Text color={colors.text}>{service.description}</Text>
              <SimpleGrid columns={3} gap={4}>
                {service.metrics.map((metric, index) => (
                  <VStack key={index}>
                    <Icon as={metric.icon} color={colors.primary} />
                    <Text fontWeight="bold">{metric.value}</Text>
                    <Text fontSize="sm" color={colors.subtext}>{metric.label}</Text>
                  </VStack>
                ))}
              </SimpleGrid>
              <Divider />
              <VStack align="stretch" spacing={3}>
                <Text fontWeight="bold" color={colors.text}>{t('keyFeatures')}</Text>
                {service.features.map((feature, index) => (
                  <HStack key={index}>
                    <Icon as={Check} color={colors.primary} />
                    <Text color={colors.text}>{feature}</Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export async function getStaticProps({ locale }) {
 return {
   props: {
     ...(await serverSideTranslations(locale, ['common'])),
   },
 };
}

export default Services;