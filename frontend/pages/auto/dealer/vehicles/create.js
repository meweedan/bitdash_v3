// pages/auto/dealer/vehicles/create.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Layout from '@/components/Layout';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  IconButton,
  Image,
  useToast,
  Progress,
  Fade,
  SlideFade,
  SimpleGrid,
  Input,
  Select,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Textarea,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  AspectRatio,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useDisclosure
} from '@chakra-ui/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Camera, 
  Plus, 
  CheckCircle,
  Upload,
  X,
  RotateCcw,
  Zap,
  Fuel,
  Car,
  DollarSign,
  Image as ImageIcon,
  Info
} from 'lucide-react';

const CreateVehicle = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    marketPrice: '',
    dealRating: 'good',
    mileage: '',
    vin: '',
    fuelType: 'petrol',
    transmission: 'automatic',
    bodyType: 'sedan',
    engineSize: '',
    enginePower: '',
    acceleration: '',
    topSpeed: '',
    exteriorColor: '',
    interiorColor: '',
    numberOfOwners: '1',
    features: [],
    status: 'available',
    featured: false,
    description: ''
  });

  const [images, setImages] = useState({
    mainImage: null,
    galleryImages: [],
    interiorImages: [],
    exteriorImages: [],
    damageImages: [],
    serviceHistoryImages: []
  });

  const [previews, setPreviews] = useState({
    mainImage: null,
    galleryImages: [],
    interiorImages: [],
    exteriorImages: [],
    damageImages: [],
    serviceHistoryImages: []
  });

  const steps = [
    {
      id: 1,
      title: "Vehicle Basics",
      description: "Let's start with the essentials",
      icon: Car
    },
    {
      id: 2,
      title: "Images & Gallery",
      description: "Show off your vehicle",
      icon: ImageIcon
    },
    {
      id: 3,
      title: "Performance Details",
      description: "Tell us about the power",
      icon: Zap
    },
    {
      id: 4,
      title: "Final Details",
      description: "Almost there!",
      icon: Info
    }
  ];

  const YEARS = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, 
  (_, i) => new Date().getFullYear() - i);

 const MAKES = [
  'BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Toyota', 'Honda', 'Hongqi',
  'Ford', 'Chevrolet', 'Volkswagen', 'Porsche', 'Ferrari', 'SsangYong',
  'Lamborghini', 'Tesla', 'Nissan', 'Kia', 'Hyundai', 'Samsung', 'Range Rover',
  'Volvo', 'Land Rover', 'Jaguar', 'Maserati', 'Geely', 'Jetour'
];

const ENGINE_SIZES = [
  '1.0', '1.2', '1.4', '1.6', '1.8', '2.0', '2.2', '2.4', '2.5', 
  '2.7', '3.0', '3.2', '3.5', '4.0', '4.4', '5.0', '5.5', '6.0', '6.2', '6.3', '6.5', '6.6'
];

const ENGINE_POWERS = [
  '100', '120', '150', '180', '200', '250', '300', '350', 
  '400', '450', '500', '550', '600', '650', '700', '750', 
  '800', '850', '900', '950', '1000', '1050', '1100'
];

const PRICES = [
  '10000', '15000', '20000', '25000', '30000', '35000', '40000', 
  '50000', '60000', '70000', '80000', '90000', '100000', '150000', '200000',
  '225000', '260000', '270000', '280000', '290000', '300000', '350000', '375000'
];
  const handleImageChange = (type, e) => {
    const files = Array.from(e.target.files);
    if (type === 'mainImage') {
      if (files[0]) {
        setImages({ ...images, [type]: files[0] });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews({ ...previews, [type]: reader.result });
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      const newFiles = [...(images[type] || []), ...files];
      setImages({ ...images, [type]: newFiles });
      
      Promise.all(
        files.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        })
      ).then(newPreviews => {
        setPreviews({
          ...previews,
          [type]: [...(previews[type] || []), ...newPreviews]
        });
      });
    }
  };

  const removeImage = (type, index) => {
    if (type === 'mainImage') {
      setImages({ ...images, mainImage: null });
      setPreviews({ ...previews, mainImage: null });
    } else {
      const newImages = images[type].filter((_, i) => i !== index);
      const newPreviews = previews[type].filter((_, i) => i !== index);
      setImages({ ...images, [type]: newImages });
      setPreviews({ ...previews, [type]: newPreviews });
    }
  };

  const handleSubmit = async () => {
    // More comprehensive validation
    const requiredFields = ['make', 'model', 'price', 'year', 'engineSize', 'enginePower', 'vin'];
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].length < 2);

    if (missingFields.length > 0) {
      toast({
        title: 'Validation Error',
        description: `Please fill in these fields correctly: ${missingFields.join(', ')}`,
        status: 'error',
        duration: 5000
      });
      return;
    }

    if (!images.mainImage) {
      toast({
        title: 'Error',
        description: 'Please add a main image',
        status: 'error',
        duration: 5000
      });
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const token = localStorage.getItem('token');
      const userId = JSON.parse(localStorage.getItem('user')).id;

      // Upload images
      setProgress(20);
      const mainImageRes = await uploadImage(images.mainImage, token);
      setProgress(40);

      const [
        galleryImageIds,
        interiorImageIds,
        exteriorImageIds,
        damageImageIds,
        serviceHistoryImageIds
      ] = await Promise.all([
        uploadMultipleImages(images.galleryImages, token),
        uploadMultipleImages(images.interiorImages, token),
        uploadMultipleImages(images.exteriorImages, token),
        uploadMultipleImages(images.damageImages, token),
        uploadMultipleImages(images.serviceHistoryImages, token)
      ]);

      setProgress(60);

      // Removed nested data structure
      const payload = {
        ...formData,
        mainImage: mainImageRes.id,
        galleryImages: galleryImageIds,
        interiorImages: interiorImageIds,
        exteriorImages: exteriorImageIds,
        damageImages: damageImageIds,
        serviceHistoryImages: serviceHistoryImageIds,
        publishedAt: new Date().toISOString(),
        userId: userId  // Explicitly add user ID
      };

      // Log payload for debugging
      console.log('Vehicle Listing Payload:', payload);

      // Create vehicle listing
      const vehicleRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      // More detailed error handling
      if (!vehicleRes.ok) {
        const errorBody = await vehicleRes.text();
        console.error('Backend Error Response:', errorBody);
        throw new Error(`Failed to create vehicle listing: ${errorBody}`);
      }

      setProgress(100);
      toast({
        title: 'Success',
        description: 'Your vehicle has been listed successfully',
        status: 'success',
        duration: 5000
      });

      router.push('/auto/dealer/vehicles');

    } catch (error) {
      console.error('Full Error Creating Vehicle:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create listing',
        status: 'error',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file, token) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('files', file);
    const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    if (!uploadRes.ok) throw new Error('Failed to upload image');
    const uploadedFiles = await uploadRes.json();
    return uploadedFiles[0];
  };

  const uploadMultipleImages = async (files, token) => {
    if (!files?.length) return [];
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    if (!uploadRes.ok) throw new Error('Failed to upload images');
    const uploadedFiles = await uploadRes.json();
    return uploadedFiles.map(file => file.id);
  };
  // Step Components
  const BasicInfo = () => (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <FormControl isRequired>
          <FormLabel>Make</FormLabel>
          <Select
            value={formData.make}
            onChange={e => setFormData(prev => ({ ...prev, make: e.target.value }))}
            placeholder="Select make"
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.200"
            _hover={{ borderColor: "whiteAlpha.300" }}
          >
            {MAKES.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Model</FormLabel>
          <Input
            value={formData.model}
            onChange={e => {
              const newValue = e.target.value;
              setFormData(prev => ({ ...prev, model: newValue }));
            }}
            placeholder="Enter model"
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.200"
            _hover={{ borderColor: "whiteAlpha.300" }}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Year</FormLabel>
          <Select
            value={formData.year}
            onChange={e => setFormData(prev => ({ ...prev, year: e.target.value }))}
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            {YEARS.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Price (LYD)</FormLabel>
          <Select
            value={formData.price}
            onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            {PRICES.map(price => (
              <option key={price} value={price}>{Number(price).toLocaleString()} LYD</option>
            ))}
          </Select>
        </FormControl>
      </SimpleGrid>
    </Box>
  );

  const ImageUpload = () => (
    <Box>
      <VStack spacing={8}>
        <Box w="full">
          <Text mb={4} fontWeight="medium">Main Image</Text>
          <Box
            border="2px dashed"
            borderColor="whiteAlpha.300"
            borderRadius="xl"
            p={8}
            textAlign="center"
            position="relative"
            bg="whiteAlpha.50"
            transition="all 0.2s"
            _hover={{ borderColor: "blue.400", bg: "whiteAlpha.100" }}
          >
            {previews.mainImage ? (
              <Box position="relative">
                <AspectRatio ratio={16/9} maxH="400px">
                  <Image
                    src={previews.mainImage}
                    alt="Main vehicle image preview"
                    objectFit="cover"
                    borderRadius="lg"
                  />
                </AspectRatio>
                <IconButton
                  icon={<X />}
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={() => removeImage('mainImage')}
                />
              </Box>
            ) : (
              <>
                <VStack spacing={2}>
                  <Camera size={32} />
                  <Text>Drop your main image here or click to browse</Text>
                </VStack>
                <Input
                  type="file"
                  height="100%"
                  width="100%"
                  position="absolute"
                  top="0"
                  left="0"
                  opacity="0"
                  cursor="pointer"
                  accept="image/*"
                  onChange={(e) => handleImageChange('mainImage', e)}
                />
              </>
            )}
          </Box>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
          <Box>
            <Text mb={4} fontWeight="medium">Gallery Images</Text>
            <ImageGrid
              images={previews.galleryImages}
              onUpload={(e) => handleImageChange('galleryImages', e)}
              onRemove={(index) => removeImage('galleryImages', index)}
            />
          </Box>

          <Box>
            <Text mb={4} fontWeight="medium">Interior Images</Text>
            <ImageGrid
              images={previews.interiorImages}
              onUpload={(e) => handleImageChange('interiorImages', e)}
              onRemove={(index) => removeImage('interiorImages', index)}
            />
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );

  const PerformanceDetails = () => (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <FormControl isRequired>
          <FormLabel>Engine Size (L)</FormLabel>
          <Select
            value={formData.engineSize}
            onChange={e => setFormData(prev => ({ ...prev, engineSize: e.target.value }))}
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            {ENGINE_SIZES.map(size => (
              <option key={size} value={size}>{size}L</option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Engine Power (HP)</FormLabel>
          <Select
            value={formData.enginePower}
            onChange={e => setFormData(prev => ({ ...prev, enginePower: e.target.value }))}
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            {ENGINE_POWERS.map(power => (
              <option key={power} value={power}>{power} HP</option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Mileage (km)</FormLabel>
          <Box>
            <Text mb={2}>{Number(formData.mileage).toLocaleString()} km</Text>
            <Slider
              min={0}
              max={300000}
              step={1000}
              value={formData.mileage}
              onChange={(value) => setFormData(prev => ({ ...prev, mileage: value }))}
            >
              <SliderTrack bg="whiteAlpha.200">
                <SliderFilledTrack bg="blue.500" />
              </SliderTrack>
              <SliderThumb boxSize={6} />
            </Slider>
          </Box>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>VIN</FormLabel>
          <Input
            value={formData.vin}
            onChange={e => setFormData(prev => ({ ...prev, vin: e.target.value }))}
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.200"
            placeholder="Enter VIN"
          />
        </FormControl>
      </SimpleGrid>
    </Box>
  );

  const FinalDetails = () => (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <FormControl>
          <FormLabel>Deal Rating</FormLabel>
          <Select
            value={formData.dealRating}
            onChange={(e) => setFormData({ ...formData, dealRating: e.target.value })}
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Status</FormLabel>
          <Select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </Select>
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">Feature this listing?</FormLabel>
          <Switch
            isChecked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          />
        </FormControl>
      </SimpleGrid>
    </Box>
  );

  const ImageGrid = ({ images = [], onUpload, onRemove }) => (
    <SimpleGrid columns={3} spacing={2}>
      {images.map((image, index) => (
        <Box key={index} position="relative">
          <AspectRatio ratio={1}>
            <Box
              position="relative"
              overflow="hidden"
              borderRadius="md"
            >
              <Image
                src={image}
                alt={`Vehicle image ${index + 1}`}
                objectFit="cover"
              />
            </Box>
          </AspectRatio>
          <IconButton
            icon={<X size={16} />}
            size="sm"
            position="absolute"
            top={1}
            right={1}
            onClick={() => onRemove(index)}
          />
        </Box>
      ))}
      <AspectRatio ratio={1}>
        <Box
          border="2px dashed"
          borderColor="whiteAlpha.300"
          borderRadius="md"
          position="relative"
          bg="whiteAlpha.50"
          transition="all 0.2s"
          _hover={{ borderColor: "blue.400", bg: "whiteAlpha.100" }}
        >
          <VStack spacing={2} justify="center">
            <Plus size={20} />
            <Input
              type="file"
              height="100%"
              width="100%"
              position="absolute"
              top="0"
              left="0"
              opacity="0"
              cursor="pointer"
              accept="image/*"
              multiple
              onChange={onUpload}
            />
          </VStack>
        </Box>
      </AspectRatio>
    </SimpleGrid>
  );

  // Render
  return (
    <Layout>
      <Head>
        <title>Create Vehicle Listing | BitAuto</title>
      </Head>

      {/* Background Elements */}
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="800px"
        height="800px"
        borderRadius="full"
        bgGradient="radial(circle, blue.400 0%, blue.500 35%, transparent 70%)"
        opacity="0.1"
        filter="blur(70px)"
        zIndex={-1}
      />

      <Container maxW="6xl" py={8}>
        {/* Progress Indicator */}
        <Progress
          value={(currentStep / steps.length) * 100}
          size="sm"
          colorScheme="blue"
          mb={8}
          borderRadius="full"
        />

        <VStack spacing={8} align="stretch">
          {/* Step Header */}
          <Box textAlign="center">
            <Heading size="lg" mb={2}>{steps[currentStep - 1].title}</Heading>
            <Text color="whiteAlpha.800">{steps[currentStep - 1].description}</Text>
          </Box>

          {/* Step Content */}
          <Box
            p={8}
            borderRadius="xl"
            bg="whiteAlpha.100"
            backdropFilter="blur(8px)"
            borderWidth="1px"
            borderColor="whiteAlpha.200"
            boxShadow="xl"
          >
            {currentStep === 1 && <BasicInfo />}
            {currentStep === 2 && <ImageUpload />}
            {currentStep === 3 && <PerformanceDetails />}
            {currentStep === 4 && <FinalDetails />}
          </Box>

          {/* Navigation */}
          <HStack justify="space-between" pt={4}>
            <Button
              leftIcon={<ChevronLeft />}
              variant="ghost"
              onClick={() => setCurrentStep(prev => prev - 1)}
              isDisabled={currentStep === 1}
            >
              Back
            </Button>
            
            <Button
              rightIcon={currentStep === steps.length ? <CheckCircle /> : <ChevronRight />}
              colorScheme="blue"
              onClick={() => {
                if (currentStep === steps.length) {
                  handleSubmit();
                } else {
                  setCurrentStep(prev => prev + 1);
                }
              }}
              isLoading={loading}
            >
              {currentStep === steps.length ? 'Create Listing' : 'Continue'}
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default CreateVehicle;