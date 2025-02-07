// pages/auto/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';
import MessageSystem from '@/components/MessageSystem';
import {
  Box, Container, VStack, HStack, Text, Button, SimpleGrid,
  Image, Badge, Divider, Icon, Heading, useColorMode, useToast,
  Tabs, TabList, Tab, TabPanels, TabPanel, Drawer, DrawerBody,
  DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  useDisclosure, FormControl, FormLabel, Input, Textarea, Spinner,
  IconButton, Grid, Flex
} from '@chakra-ui/react';
import {
  Calendar, Clock, MapPin, Phone, Mail, User, MessageCircle,
  Heart, Share2, Info, GitFork, Fuel, Zap
} from 'lucide-react';
import { PiEngine } from "react-icons/pi";
import Head from 'next/head';

const VehicleDetails = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [vehicle, setVehicle] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inquiry, setInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    if (id) {
      fetchVehicle();
    }
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicles/${id}?populate=*`
      );
      const data = await response.json();
      setVehicle(data.data);
      if (data.data?.attributes?.mainImage?.data) {
        setSelectedImage(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}${data.data.attributes.mainImage.data.attributes.url}`
        );
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      toast({
        title: t('error'),
        description: t('failedToLoadVehicle'),
        status: 'error',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          data: {
            content: inquiry.message,
            sender_type: 'customer',
            vehicle: id,
            operator: vehicle.attributes.operator?.data?.id
          }
        })
      });

      if (!response.ok) throw new Error('Failed to send inquiry');

      toast({
        title: t('success'),
        description: t('inquirySent'),
        status: 'success',
        duration: 3000
      });
      onClose();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToSendInquiry'),
        status: 'error',
        duration: 3000
      });
    }
  };

  if (loading) return <Layout><Container centerContent><Spinner size="xl" /></Container></Layout>;
  if (!vehicle?.attributes) return <Layout><Container>Vehicle not found</Container></Layout>;

  const v = vehicle.attributes;

  // Get all available images
  const allImages = [
    v.mainImage?.data,
...(v.galleryImages?.data || []),
    ...(v.interiorImages?.data || []),
    ...(v.exteriorImages?.data || [])
  ].filter(Boolean);

  return (
    <>
    <Head>
        <title>{v.name}</title>
    </Head>
    <Layout>
      <Container maxW="7xl" py={8}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {/* Left Column - Images */}
          <VStack spacing={4}>
            <Box 
              borderRadius="lg" 
              overflow="hidden"
              position="relative"
              h="400px"
            >
              <Image
                src={selectedImage}
                alt={`${v.make} ${v.model}`}
                w="full"
                h="full"
                objectFit="cover"
                fallback={<Box w="full" h="full" bg="gray.200" />}
              />
              <HStack 
                position="absolute" 
                top={4} 
                right={4}
                spacing={2}
              >
                <IconButton
                  icon={<Heart />}
                  aria-label="Save"
                  rounded="full"
                  colorScheme="red"
                  variant="solid"
                  bg="white"
                />
                <IconButton
                  icon={<Share2 />}
                  aria-label="Share"
                  rounded="full"
                  variant="solid"
                  bg="white"
                />
              </HStack>
              <Badge
                position="absolute"
                top={4}
                left={4}
                colorScheme={v.dealRating === 'excellent' ? 'green' : 
                           v.dealRating === 'good' ? 'blue' : 'yellow'}
                fontSize="sm"
                px={3}
                py={1}
                rounded="full"
              >
                {v.dealRating?.toUpperCase()} Deal
              </Badge>
            </Box>
            
            {/* Image Gallery */}
            {allImages.length > 0 && (
              <SimpleGrid columns={4} spacing={2}>
                {allImages.map((image, index) => (
                  <Image
                    key={index}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image.attributes.url}`}
                    alt={`Gallery image ${index + 1}`}
                    w="full"
                    h="100px"
                    objectFit="cover"
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => setSelectedImage(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}${image.attributes.url}`
                    )}
                    fallback={<Box w="full" h="100px" bg="gray.200" borderRadius="md" />}
                  />
                ))}
              </SimpleGrid>
            )}
          </VStack>

          {/* Right Column - Details */}
          <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
              <Flex justify="space-between" align="center">
                <Heading size="lg">{v.make} {v.model}</Heading>
                <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                  {v.status}
                </Badge>
              </Flex>
              <HStack justify="space-between" align="baseline">
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  {new Intl.NumberFormat('en-US').format(v.price)} LYD
                </Text>
                {v.marketPrice > v.price && (
                  <Text fontSize="md" color="green.500">
                    Save {new Intl.NumberFormat('en-US').format(v.marketPrice - v.price)} LYD
                  </Text>
                )}
              </HStack>
            </VStack>

            <SimpleGrid columns={2} spacing={4}>
              <HStack>
                <Icon as={Calendar} />
                <Text>{v.year}</Text>
              </HStack>
              <HStack>
                <Icon as={Clock} />
                <Text>{v.mileage?.toLocaleString()} km</Text>
              </HStack>
              <HStack>
                <Icon as={GitFork} />
                <Text>{v.transmission}</Text>
              </HStack>
              <HStack>
                <Icon as={Fuel} />
                <Text>{v.fuelType}</Text>
              </HStack>
              <HStack>
                <Icon as={PiEngine} />
                <Text>{v.engineSize}L</Text>
              </HStack>
              <HStack>
                <Icon as={Zap} />
                <Text>{v.enginePower} HP</Text>
              </HStack>
            </SimpleGrid>

            <Divider />

            <Tabs>
              <TabList>
                <Tab>Overview</Tab>
                <Tab>Features</Tab>
                <Tab>Service History</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <VStack align="stretch" spacing={4}>
                    <Text>{v.description}</Text>
                    <SimpleGrid columns={2} spacing={4}>
                      <HStack>
                        <Text fontWeight="semibold">Exterior Color:</Text>
                        <Text>{v.exteriorColor}</Text>
                      </HStack>
                      <HStack>
                        <Text fontWeight="semibold">Interior Color:</Text>
                        <Text>{v.interiorColor}</Text>
                      </HStack>
                      <HStack>
                        <Text fontWeight="semibold">VIN:</Text>
                        <Text>{v.vin}</Text>
                      </HStack>
                      <HStack>
                        <Text fontWeight="semibold">Previous Owners:</Text>
                        <Text>{v.numberOfOwners}</Text>
                      </HStack>
                    </SimpleGrid>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <SimpleGrid columns={2} spacing={4}>
                    {v.features?.map((feature, index) => (
                      <HStack key={index}>
                        <Icon as={Info} />
                        <Text>{feature}</Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </TabPanel>
                <TabPanel>
                  <VStack align="stretch" spacing={4}>
                    {v.serviceHistory?.map((service, index) => (
                      <Box key={index} p={4} bg={isDark ? 'gray.700' : 'gray.50'} rounded="md">
                        <Text fontWeight="bold">{service.date}</Text>
                        <Text>{service.description}</Text>
                        <Text color="gray.500">{service.mileage} km</Text>
                      </Box>
                    ))}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <Box bg={isDark ? 'gray.700' : 'gray.50'} p={4} rounded="lg">
              <VStack align="stretch" spacing={4}>
                <HStack>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${v.operator?.data?.attributes?.profileImage?.data?.attributes?.url}`}
                    alt={v.operator?.data?.attributes?.fullName}
                    boxSize="48px"
                    rounded="full"
                    fallback={<Box boxSize="48px" bg="gray.200" rounded="full" />}
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">
                      {v.operator?.data?.attributes?.fullName}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Verified Dealer
                    </Text>
                  </VStack>
                </HStack>
                <Button
                  leftIcon={<MessageCircle />}
                  colorScheme="blue"
                  onClick={onOpen}
                >
                  Contact Dealer
                </Button>
              </VStack>
            </Box>
          </VStack>
        </SimpleGrid>

        {/* Inquiry Drawer */}
        <Drawer isOpen={isOpen} onClose={onClose} size="md">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Contact Dealer</DrawerHeader>
            <DrawerBody>
              <form onSubmit={handleInquiry}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      value={inquiry.name}
                      onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={inquiry.email}
                      onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Phone</FormLabel>
                    <Input
                      value={inquiry.phone}
                      onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Message</FormLabel>
                    <Textarea
                      value={inquiry.message}
                      onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                    />
                  </FormControl>
                  <Button type="submit" colorScheme="blue" w="full">
                    Send Inquiry
                  </Button>
                </VStack>
              </form>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Container>
    </Layout>
    </>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default VehicleDetails;        