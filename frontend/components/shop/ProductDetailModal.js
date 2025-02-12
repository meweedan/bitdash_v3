// components/shop/ProductDetailModal.js
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Box,
  Image,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  IconButton,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiArrowLeft, FiArrowRight, FiShoppingBag, FiExternalLink } from 'react-icons/fi';
import NextLink from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductDetailModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onAddToCart,
  shopName 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product?.attributes?.images?.data || [];
  const bgColor = useColorModeValue('white', 'gray.800');

  const productUrl = `/${shopName}/${product?.attributes?.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalCloseButton zIndex="popover" />
        <ModalBody p={0}>
          <Box display="flex" flexDir={{ base: 'column', md: 'row' }} gap={6} p={6}>
            {/* Image Gallery */}
            <Box flex="1" position="relative">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                loop={images.length > 1}
                onSlideChange={(swiper) => setCurrentImageIndex(swiper.realIndex)}
                style={{
                  '--swiper-navigation-color': '#fff',
                  '--swiper-pagination-color': '#fff',
                }}
              >
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <Box
                        position="relative"
                        height="400px"
                        borderRadius="lg"
                        overflow="hidden"
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image.attributes.url}`}
                          alt={`${product.attributes.name} - Image ${index + 1}`}
                          objectFit="cover"
                          w="full"
                          h="full"
                        />
                      </Box>
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <Box
                      position="relative"
                      height="400px"
                      borderRadius="lg"
                      overflow="hidden"
                    >
                      <Image
                        src="/placeholder-product.jpg"
                        alt={product.attributes.name}
                        objectFit="cover"
                        w="full"
                        h="full"
                      />
                    </Box>
                  </SwiperSlide>
                )}
              </Swiper>
            </Box>

            {/* Product Info */}
            <VStack flex="1" align="start" spacing={4}>
              <VStack align="start" spacing={2} w="full">
                <Text fontSize="2xl" fontWeight="bold">
                  {product.attributes.name}
                </Text>
                <Text color="gray.600">
                  {product.attributes.description}
                </Text>
              </VStack>

              <HStack justify="space-between" w="full">
                <Text 
                  fontSize="2xl" 
                  fontWeight="bold" 
                  color="blue.500"
                >
                  {product.attributes.price} LYD
                </Text>
                {product.attributes.stock <= 10 && product.attributes.stock > 0 && (
                  <Badge colorScheme="yellow">
                    Only {product.attributes.stock} left
                  </Badge>
                )}
              </HStack>

              {/* Specifications */}
              {product.attributes.specifications && (
                <VStack align="start" w="full" spacing={2}>
                  <Text fontWeight="semibold">Specifications:</Text>
                  {Object.entries(product.attributes.specifications).map(([key, value]) => (
                    <HStack key={key} w="full" justify="space-between">
                      <Text color="gray.600" textTransform="capitalize">
                        {key.replace(/_/g, ' ')}
                      </Text>
                      <Text>{value}</Text>
                    </HStack>
                  ))}
                </VStack>
              )}

              <HStack w="full" spacing={4}>
                <Button
                  leftIcon={<FiShoppingBag />}
                  colorScheme="blue"
                  size="lg"
                  flex={1}
                  isDisabled={
                    product.attributes.stock <= 0 || 
                    product.attributes.status !== 'available'
                  }
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                >
                  {product.attributes.stock > 0 && product.attributes.status === 'available' 
                    ? 'Add to Cart' 
                    : 'Out of Stock'
                  }
                </Button>

                <NextLink href={productUrl} passHref legacyBehavior>
                  <Link>
                    <IconButton
                      icon={<FiExternalLink />}
                      variant="outline"
                      aria-label="View full details"
                    />
                  </Link>
                </NextLink>
              </HStack>
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProductDetailModal;