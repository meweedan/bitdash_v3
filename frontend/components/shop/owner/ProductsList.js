import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  IconButton,
  HStack,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Select,
  Box,
  Text,
  VStack,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import {
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiArchive,
} from 'react-icons/fi';

const ProductsList = ({ products = [], onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const tableBg = useColorModeValue('white', 'gray.800');
  
  // Get unique categories from products
  const categories = [...new Set(products
    .filter(product => product?.attributes?.category)
    .map(product => product.attributes.category)
  )];

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    if (!product?.attributes) return false;
    
    const matchesSearch = (product.attributes.name || '').toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || 
      product.attributes.category === categoryFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      product.attributes.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Stock badge logic
  const getStockBadge = (stock) => {
    const stockNum = parseInt(stock);
    if (isNaN(stockNum) || stockNum <= 0) return <Badge colorScheme="red">Out of Stock</Badge>;
    if (stockNum < 10) return <Badge colorScheme="yellow">Low Stock ({stockNum})</Badge>;
    return <Badge colorScheme="green">In Stock ({stockNum})</Badge>;
  };

  // Format price
  const formatPrice = (price) => {
    const num = parseFloat(price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  // Handle image URL
  const getImageUrl = (product) => {
    try {
      return product.attributes.images?.data?.[0]?.attributes?.url
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.attributes.images.data[0].attributes.url}`
        : '/placeholder-product.jpg';
    } catch (error) {
      return '/placeholder-product.jpg';
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      {/* Filters */}
      <Flex 
        gap={4} 
        direction={{ base: 'column', md: 'row' }}
        bg={tableBg}
        p={4}
        borderRadius="lg"
        boxShadow="sm"
      >
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxW={{ base: 'full', md: '300px' }}
        />
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          maxW={{ base: 'full', md: '200px' }}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          maxW={{ base: 'full', md: '200px' }}
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="hidden">Hidden</option>
        </Select>
      </Flex>

      {/* Products Table */}
      <Box
        bg={tableBg}
        borderRadius="lg"
        boxShadow="sm"
        overflowX="auto"
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th width="40%">Product</Th>
              <Th>Category</Th>
              <Th isNumeric>Price</Th>
              <Th isNumeric>Stock</Th>
              <Th>Status</Th>
              <Th>Rating</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredProducts.map((product) => (
              <Tr key={product.id}>
                <Td>
                  <HStack spacing={3}>
                    <Box
                      width="50px"
                      height="50px"
                      position="relative"
                      overflow="hidden"
                      borderRadius="md"
                    >
                      <Image
                        src={getImageUrl(product)}
                        alt={product.attributes.name}
                        objectFit="cover"
                        w="full"
                        h="full"
                      />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">
                        {product.attributes.name || 'Unnamed Product'}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        ID: {product.id}
                      </Text>
                    </VStack>
                  </HStack>
                </Td>
                <Td>
                  <Badge>
                    {product.attributes.category || 'Uncategorized'}
                  </Badge>
                </Td>
                <Td isNumeric fontWeight="medium">
                  {formatPrice(product.attributes.price)} LYD
                </Td>
                <Td isNumeric>
                  {getStockBadge(product.attributes.stock)}
                </Td>
                <Td>
                  <Badge
                    colorScheme={
                      product.attributes.status === 'available' ? 'green' :
                      product.attributes.status === 'hidden' ? 'gray' : 'red'
                    }
                  >
                    {product.attributes.status || 'Unknown'}
                  </Badge>
                </Td>
                <Td>
                  <HStack>
                    <Text>{(product.attributes.rating || 0).toFixed(1)}</Text>
                    <Text color="gray.500" fontSize="sm">
                      ({product.attributes.reviews?.data?.length || 0})
                    </Text>
                  </HStack>
                </Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem
                        icon={<FiEdit2 />}
                        onClick={() => onEdit(product)}
                      >
                        Edit Product
                      </MenuItem>
                      <MenuItem
                        icon={<FiArchive />}
                        onClick={() => onDelete(product.id, product.attributes.status === 'hidden' ? 'available' : 'hidden')}
                      >
                        {product.attributes.status === 'hidden' ? 'Show' : 'Hide'} Product
                      </MenuItem>
                      <MenuItem
                        icon={<FiTrash2 />}
                        onClick={() => onDelete(product.id, 'delete')}
                        color="red.500"
                      >
                        Delete Product
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {filteredProducts.length === 0 && (
          <Box p={8} textAlign="center">
            <Text color="gray.500">No products found</Text>
          </Box>
        )}
      </Box>
    </VStack>
  );
};

export default ProductsList;