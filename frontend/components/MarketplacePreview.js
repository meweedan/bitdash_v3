import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import {
 Box,
 Container,
 VStack,
 HStack,
 Grid,
 Heading,
 Text,
 Button,
 IconButton,
 Image,
 Badge,
 Input,
 InputGroup,
 InputLeftElement,
 Select,
 Spinner,
 useColorModeValue,
 useToast,
 Card,
 CardBody,
 SimpleGrid,
 Skeleton
} from '@chakra-ui/react';
import { Search, ShoppingBag, Heart, Star } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const ProductCard = ({ product }) => {
 const router = useRouter();
 const toast = useToast();
 const [isFavorited, setIsFavorited] = useState(false);
 const cardBg = useColorModeValue('white', 'gray.800');

 // Handle image URL from Strapi
 const imageUrl = product?.attributes?.images?.data?.[0]?.attributes?.url 
   ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.attributes.images.data[0].attributes.url}`
   : '/placeholder-product.jpg';

 return (
   <Card bg={cardBg} overflow="hidden">
     <CardBody p={0}>
       <Box position="relative" h="260px">
         <Image
           src={imageUrl}
           alt={product.attributes.name}
           objectFit="cover"
           w="full"
           h="full"
         />
         <IconButton
           icon={<Heart fill={isFavorited ? 'red' : 'none'} />}
           position="absolute"
           top={4}
           right={4}
           rounded="full"
           onClick={() => {
             setIsFavorited(!isFavorited);
             toast({
               title: isFavorited ? 'Removed from favorites' : 'Added to favorites',
               status: isFavorited ? 'info' : 'success',
               duration: 2000,
             });
           }}
         />
       </Box>

       <VStack p={4} spacing={3} align="stretch">
         <HStack justify="space-between">
           <Heading size="md" noOfLines={1}>
             {product.attributes.name}
           </Heading>
           <Badge colorScheme={product.attributes.status === 'available' ? 'green' : 'red'}>
             {product.attributes.status === 'available' ? 'In Stock' : 'Out of Stock'}
           </Badge>
         </HStack>

         <Text noOfLines={2} color="gray.600">
           {product.attributes.description}
         </Text>

         <HStack justify="space-between">
           <Text fontWeight="bold" fontSize="xl" color="blue.500">
             {product.attributes.price} LYD
           </Text>
           <HStack>
             <Star size={16} fill="#F6E05E" />
             <Text>
               {product.attributes.rating?.toFixed(1) || '0.0'}
               <Text as="span" color="gray.500" ml={1}>
                 ({product.attributes.reviews?.data?.length || 0})
               </Text>
             </Text>
           </HStack>
         </HStack>

         {product.attributes.category && (
           <HStack spacing={2}>
             <Badge colorScheme="purple">
               {product.attributes.category}
             </Badge>
             {product.attributes.subcategory && (
               <Badge colorScheme="purple" variant="outline">
                 {product.attributes.subcategory}
               </Badge>
             )}
           </HStack>
         )}

         <Button
           colorScheme="blue"
           leftIcon={<ShoppingBag size={18} />}
           onClick={() => router.push(`/shop-items/${product.id}/public`)}
           isDisabled={product.attributes.status !== 'available' || product.attributes.stock <= 0}
         >
           View Details
         </Button>
       </VStack>
     </CardBody>
   </Card>
 );
};

const MarketplacePreview = () => {
 const router = useRouter();
 const toast = useToast();
 const [searchTerm, setSearchTerm] = useState('');
 const [selectedCategory, setSelectedCategory] = useState('');
 const [page, setPage] = useState(1);
 const bgColor = useColorModeValue('gray.50', 'gray.900');

 const { data, isLoading, error } = useQuery({
   queryKey: ['products', searchTerm, selectedCategory, page],
   queryFn: async () => {
     try {
       const params = new URLSearchParams({
         'filters[status][$eq]': 'available',
         'pagination[page]': page.toString(),
         'pagination[pageSize]': ITEMS_PER_PAGE.toString(),
         'populate[images]': '*',
         'populate[owner]': '*',
         'populate[reviews]': '*'
       });

       if (searchTerm) {
         params.append('filters[$or][0][name][$containsi]', searchTerm);
         params.append('filters[$or][1][description][$containsi]', searchTerm);
       }

       if (selectedCategory) {
         params.append('filters[category][$eq]', selectedCategory);
       }

       const response = await fetch(
         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items/search?${params}`
       );

       if (!response.ok) throw new Error('Failed to fetch products');
       
       return response.json();
     } catch (error) {
       console.error('Error fetching products:', error);
       throw error;
     }
   }
 });

 // Get unique categories from products
 const categories = useMemo(() => {
   if (!data?.data) return [];
   return [...new Set(data.data.map(product => product.attributes.category))];
 }, [data]);

 if (error) {
   return (
     <Container maxW="7xl" py={8}>
       <Alert status="error">
         <AlertIcon />
         Error loading products: {error.message}
       </Alert>
     </Container>
   );
 }

 return (
   <Box minH="100vh" bg={bgColor}>
     <Container maxW="7xl" py={8}>
       <VStack spacing={8}>
         <Heading 
           size="2xl" 
           bgGradient="linear(to-r, blue.400, purple.500)"
           bgClip="text"
         >
           Marketplace
         </Heading>

         <HStack w="full" spacing={4}>
           <InputGroup>
             <InputLeftElement>
               <Search />
             </InputLeftElement>
             <Input
               placeholder="Search products..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </InputGroup>

           <Select 
             placeholder="All Categories"
             value={selectedCategory}
             onChange={(e) => setSelectedCategory(e.target.value)}
             w="200px"
           >
             {categories.map(category => (
               <option key={category} value={category}>
                 {category}
               </option>
             ))}
           </Select>
         </HStack>

         {isLoading ? (
           <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
             {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
               <Skeleton key={i} height="400px" />
             ))}
           </SimpleGrid>
         ) : (
           <>
             <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
               {data?.data?.map((product) => (
                 <ProductCard key={product.id} product={product} />
               ))}
             </SimpleGrid>

             {data?.meta?.pagination && (
               <HStack justify="center" mt={8}>
                 <Button
                   isDisabled={page <= 1}
                   onClick={() => setPage(p => p - 1)}
                 >
                   Previous
                 </Button>
                 <Text>
                   Page {page} of {data.meta.pagination.pageCount}
                 </Text>
                 <Button
                   isDisabled={page >= data.meta.pagination.pageCount}
                   onClick={() => setPage(p => p + 1)}
                 >
                   Next
                 </Button>
               </HStack>
             )}
           </>
         )}
       </VStack>
     </Container>
   </Box>
 );
};

export default MarketplacePreview;