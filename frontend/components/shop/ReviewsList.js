// components/shop/ReviewsList.js
import React from 'react';
import {
  VStack,
  HStack,
  Text,
  Icon,
  Image,
  Button,
  Box,
  useColorModeValue,
  Skeleton,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Wrap,
  WrapItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { FiStar, FiClock, FiCheck, FiMessageCircle } from 'react-icons/fi';
import { useRouter } from 'next/router';

const ReviewsList = ({ reviews = [], isLoading }) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = React.useState(null);
  const cardBg = useColorModeValue('white', 'gray.800');

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    onOpen();
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Icon
        key={index}
        as={FiStar}
        color={index < rating ? "yellow.400" : "gray.300"}
        fill={index < rating ? "yellow.400" : "none"}
      />
    ));
  };

  if (isLoading) {
    return (
      <VStack spacing={4}>
        {[1, 2, 3].map((index) => (
          <Skeleton key={index} height="200px" w="full" borderRadius="lg" />
        ))}
      </VStack>
    );
  }

  return (
    <>
      <VStack spacing={4} align="stretch">
        {reviews.map((review) => (
          <Card key={review.id} bg={cardBg}>
            <CardBody>
              <VStack align="stretch" spacing={3}>
                <HStack justify="space-between">
                  <Box>
                    <HStack mb={2}>
                      {renderStars(review.attributes.rating)}
                      <Text ml={2} fontWeight="bold">
                        {review.attributes.rating.toFixed(1)}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      Reviewed on {new Date(review.attributes.createdAt).toLocaleDateString()}
                    </Text>
                  </Box>
                  <Badge
                    colorScheme={
                      review.attributes.status === 'approved' ? 'green' :
                      review.attributes.status === 'pending' ? 'yellow' : 'red'
                    }
                  >
                    {review.attributes.status}
                  </Badge>
                </HStack>

                <Box>
                  <Text fontWeight="bold" mb={1}>
                    {review.attributes.shop_item?.data?.attributes?.name}
                  </Text>
                  <Text>{review.attributes.comment}</Text>
                </Box>

                {review.attributes.images?.data?.length > 0 && (
                  <Wrap spacing={2}>
                    {review.attributes.images.data.map((image, index) => (
                      <WrapItem key={index}>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image.attributes.url}`}
                          alt={`Review image ${index + 1}`}
                          boxSize="100px"
                          objectFit="cover"
                          borderRadius="md"
                          cursor="pointer"
                          onClick={() => handleImageClick(`${process.env.NEXT_PUBLIC_BACKEND_URL}${image.attributes.url}`)}
                        />
                      </WrapItem>
                    ))}
                  </Wrap>
                )}

                {review.attributes.reply && (
                  <Box
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    p={4}
                    borderRadius="md"
                  >
                    <HStack mb={2}>
                      <Icon as={FiMessageCircle} />
                      <Text fontWeight="bold">Seller Response</Text>
                    </HStack>
                    <Text>{review.attributes.reply}</Text>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Replied on {new Date(review.attributes.reply_at).toLocaleDateString()}
                    </Text>
                  </Box>
                )}

                <HStack justify="flex-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => router.push(`/products/${review.attributes.shop_item?.data?.id}`)}
                  >
                    View Product
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      {/* Image Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={0}>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Review image"
                w="full"
                h="auto"
                maxH="80vh"
                objectFit="contain"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReviewsList;