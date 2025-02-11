// components/shop/owner/ReviewsList.js
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Image,
  Textarea,
  IconButton,
  Badge,
  Avatar,
  useColorModeValue,
  Flex,
  Spinner,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Card,
  CardBody,
  Grid,
  GridItem,
  Icon,
  Divider,
  useToast
} from '@chakra-ui/react';
import {
  FiStar,
  FiMessageSquare,
  FiFlag,
  FiImage,
  FiFilter
} from 'react-icons/fi';

const ReviewsList = ({ shopId, onReply }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);
  const [filterRating, setFilterRating] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const bgColor = useColorModeValue('white', 'gray.800');

  // Fetch reviews
  const {
    data: reviewsData,
    isLoading,
    refetch: refetchReviews
  } = useQuery({
    queryKey: ['shopReviews', shopId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews?` +
        `filters[shop_item][shop_owner][id][$eq]=${shopId}` +
        `&populate=*` +
        `&sort[0]=createdAt:desc`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    },
    enabled: !!shopId
  });

  const filteredReviews = useMemo(() => {
    if (!reviewsData?.data) return [];
    return reviewsData.data.filter(review => 
      filterRating === 'all' || review.attributes.rating === parseInt(filterRating)
    );
  }, [reviewsData, filterRating]);

  const handleReplySubmit = async (reviewId) => {
    if (!replyText.trim()) return;
    
    await onReply(reviewId, replyText);
    setReplyText('');
    setSelectedReviewId(null);
    refetchReviews();
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
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {/* Filters */}
      <HStack spacing={4} bg={bgColor} p={4} borderRadius="lg">
        <Select
          icon={<FiFilter />}
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          maxW="200px"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </Select>
      </HStack>

      {/* Reviews Grid */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
        {filteredReviews.map((review) => (
          <GridItem key={review.id}>
            <Card bg={bgColor}>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <HStack>
                      <Avatar
                        size="sm"
                        name={review.attributes.customer_profile?.data?.attributes?.fullName}
                        src={review.attributes.customer_profile?.data?.attributes?.avatar?.data?.attributes?.url}
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">
                          {review.attributes.customer_profile?.data?.attributes?.fullName || 'Anonymous'}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {new Date(review.attributes.createdAt).toLocaleDateString()}
                        </Text>
                      </VStack>
                    </HStack>
                    <Badge colorScheme={review.attributes.status === 'approved' ? 'green' : 'yellow'}>
                      {review.attributes.status}
                    </Badge>
                  </HStack>

                  <HStack>
                    {renderStars(review.attributes.rating)}
                    <Text fontSize="sm" color="gray.500">
                      for {review.attributes.shop_item?.data?.attributes?.name}
                    </Text>
                  </HStack>

                  <Text>{review.attributes.comment}</Text>

                  {review.attributes.images?.data?.length > 0 && (
                    <HStack spacing={2} overflowX="auto" py={2}>
                      {review.attributes.images.data.map((image, index) => (
                        <Image
                          key={index}
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image.attributes.url}`}
                          alt={`Review image ${index + 1}`}
                          boxSize="100px"
                          objectFit="cover"
                          borderRadius="md"
                          cursor="pointer"
                          onClick={() => {
                            setSelectedImage(`${process.env.NEXT_PUBLIC_BACKEND_URL}${image.attributes.url}`);
                            onOpen();
                          }}
                        />
                      ))}
                    </HStack>
                  )}

                  {review.attributes.reply ? (
                    <Box bg={useColorModeValue('gray.50', 'gray.700')} p={4} borderRadius="md">
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        Your Reply
                      </Text>
                      <Text fontSize="sm">{review.attributes.reply}</Text>
                      <Text fontSize="xs" color="gray.500" mt={2}>
                        Replied on {new Date(review.attributes.reply_at).toLocaleDateString()}
                      </Text>
                    </Box>
                  ) : (
                    <>
                      {selectedReviewId === review.id ? (
                        <VStack align="stretch" spacing={2}>
                          <Textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your reply..."
                            rows={3}
                          />
                          <HStack justify="flex-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedReviewId(null);
                                setReplyText('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              onClick={() => handleReplySubmit(review.id)}
                            >
                              Send Reply
                            </Button>
                          </HStack>
                        </VStack>
                      ) : (
                        <Button
                          leftIcon={<FiMessageSquare />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedReviewId(review.id)}
                        >
                          Reply to Review
                        </Button>
                      )}
                    </>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </Grid>

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
    </VStack>
  );
};

export default ReviewsList;