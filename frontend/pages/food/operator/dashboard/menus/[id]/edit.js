// pages/food/operator/dashboard/menus/[id]/edit.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  Select,
  useToast,
  useDisclosure,
  Flex,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Image,
  Spinner
} from '@chakra-ui/react';
import { 
  EditIcon, 
  DeleteIcon, 
  AddIcon
} from '@chakra-ui/icons';

export default function MenuEditPage() {
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://bitdash-backend.onrender.com';

  // State Management
  const [menu, setMenu] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal Controls
  const {
    isOpen: isMenuItemModalOpen, 
    onOpen: onMenuItemModalOpen, 
    onClose: onMenuItemModalClose
  } = useDisclosure();

  // Categories
  const CATEGORIES = [
    'Breakfast', 'Lunch', 'Dinner', 
    'Appetizer', 'Main Course', 
    'Dessert', 'Beverage'
  ];

  // Fetch Menu Details
  useEffect(() => {
  async function fetchMenuDetails() {
    if (!id) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(
        `${BASE_URL}/api/menus/${id}?populate[menu_items][populate][*]=*`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch error response:', errorText);
        throw new Error(errorText || 'Failed to fetch menu details');
      }

      const responseData = await response.json();
      console.log('Full response data:', responseData);

      // Add comprehensive null checks
      const menuAttributes = responseData?.data?.attributes;
      if (!menuAttributes) {
        throw new Error('Invalid menu data structure');
      }

      // Safely handle menu items
      const menuItemsData = menuAttributes.menu_items?.data || [];

      setMenu({
        id: responseData.data.id,
        name: menuAttributes.name || '',
        description: menuAttributes.description || ''
      });
      
      setMenuItems(menuItemsData);
    } catch (err) {
      console.error('Detailed fetch error:', err);
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000
      });
      router.push('/food/operator/dashboard');
    } finally {
      setLoading(false);
    }
  }

  fetchMenuDetails();
}, [id, BASE_URL, router, toast]);

  // Handle Menu Update
  const handleUpdateMenu = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/api/menus/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        data: {
          name: menu.name,
          description: menu.description || ''
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update error response:', errorText);
      throw new Error(errorText || 'Failed to update menu');
    }

    const updatedData = await response.json();
    console.log('Updated menu data:', updatedData);

    // Update local state with safe access
    setMenu(prev => ({
      ...prev,
      name: updatedData.data.attributes.name || prev.name,
      description: updatedData.data.attributes.description || prev.description
    }));

    toast({
      title: 'Success',
      description: 'Menu updated successfully',
      status: 'success',
      duration: 3000
    });
  } catch (err) {
    console.error('Menu update error:', err);
    toast({
      title: 'Error',
      description: err.message,
      status: 'error',
      duration: 5000
    });
  }
};

  // Handle Menu Item Create/Update
  const handleMenuItemSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = selectedMenuItem.id
        ? `${BASE_URL}/api/menu-items/${selectedMenuItem.id}`
        : `${BASE_URL}/api/menu-items`;
      
      const method = selectedMenuItem.id ? 'PUT' : 'POST';
      
      const payload = {
        data: {
          name: selectedMenuItem.name,
          description: selectedMenuItem.description || '',
          price: parseFloat(selectedMenuItem.price || 0),
          category: selectedMenuItem.category,
          menus: id
        }
      };

      // Handle image upload if a new file is present
      if (selectedMenuItem.imageFile) {
        const formData = new FormData();
        formData.append('files', selectedMenuItem.imageFile);
        formData.append('ref', 'api::menu-item.menu-item');
        
        const uploadResponse = await fetch(`${BASE_URL}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadedFiles = await uploadResponse.json();
        payload.data.image = uploadedFiles[0].id;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${method === 'POST' ? 'create' : 'update'} menu item`);
      }

      // Refresh menu items
      const updatedResponse = await fetch(
        `${BASE_URL}/api/menus/${id}?populate[menu_items][populate]=*`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const updatedData = await updatedResponse.json();
      setMenuItems(updatedData.data.attributes.menu_items.data);

      onMenuItemModalClose();
      toast({
        title: 'Success',
        description: `Menu item ${method === 'POST' ? 'created' : 'updated'} successfully`,
        status: 'success',
        duration: 3000
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000
      });
    }
  };

  // Handle Menu Item Deletion
  const handleDeleteMenuItem = async (menuItemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/menu-items/${menuItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }

      // Refresh menu items
      const updatedResponse = await fetch(
        `${BASE_URL}/api/menus/${id}?populate[menu_items][populate]=*`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const updatedData = await updatedResponse.json();
      setMenuItems(updatedData.data.attributes.menu_items.data);

      toast({
        title: 'Success',
        description: 'Menu item deleted successfully',
        status: 'success',
        duration: 3000
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000
      });
    }
  };

  // Render loading state
  if (loading) {
    return (
      <Layout>
        <Flex justify="center" align="center" minH="100vh">
          <Spinner size="xl" />
        </Flex>
      </Layout>
    );
  }

  // Ensure menu exists before rendering
  if (!menu) {
    return (
      <Layout>
        <Flex justify="center" align="center" minH="100vh">
          <Text>Menu not found</Text>
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box maxW="1200px" mx="auto" p={8}>
        {/* Menu Details */}
        <VStack spacing={6} align="stretch">
          <Heading>Edit Menu: {menu.name}</Heading>
          
          {/* Menu Details Form */}
          <Box>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Menu Name</FormLabel>
                <Input
                  value={menu.name || ''}
                  onChange={(e) => setMenu(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  placeholder="Enter menu name"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={menu.description || ''}
                  onChange={(e) => setMenu(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  placeholder="Enter menu description"
                />
              </FormControl>
              
              <Button 
                colorScheme="blue" 
                onClick={handleUpdateMenu}
              >
                Update Menu Details
              </Button>
            </VStack>
          </Box>

          {/* Menu Items Section */}
          <Box>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">Menu Items</Heading>
              <Button 
                leftIcon={<AddIcon />} 
                colorScheme="green"
                onClick={() => {
                  setSelectedMenuItem({
                    name: '',
                    description: '',
                    price: '',
                    category: '',
                  });
                  onMenuItemModalOpen();
                }}
              >
                Add Menu Item
              </Button>
            </Flex>

            {menuItems.length === 0 ? (
              <Text color="gray.500" textAlign="center">
                No menu items yet. Add your first item!
              </Text>
            ) : (
              <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                {menuItems.map((item) => (
                  <Card key={item.id} borderWidth="1px">
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <Heading size="sm">{item.attributes.name}</Heading>
                        <HStack>
                          <IconButton
                            icon={<EditIcon />}
                            aria-label="Edit item"
                            size="sm"
                            onClick={() => {
                              setSelectedMenuItem({
                                id: item.id,
                                name: item.attributes.name,
                                description: item.attributes.description,
                                price: item.attributes.price.toString(),
                                category: item.attributes.category,
                              });
                              onMenuItemModalOpen();
                            }}
                          />
                          <IconButton
                            icon={<DeleteIcon />}
                            aria-label="Delete item"
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleDeleteMenuItem(item.id)}
                          />
                        </HStack>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      {item.attributes.image?.data && (
                        <Image 
                          src={`${BASE_URL}${item.attributes.image.data.attributes.url}`} 
                          alt={item.attributes.name}
                          mb={4}
                          borderRadius="md"
                          maxH="200px"
                          objectFit="cover"
                        />
                      )}
                      <Text mb={2}>{item.attributes.description}</Text>
                      <HStack>
                        <Text fontWeight="bold">${item.attributes.price.toFixed(2)}</Text>
                        {item.attributes.category && (
                          <Text color="gray.500">
                            ({item.attributes.category})
                          </Text>
                        )}
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </Box>
        </VStack>

        {/* Menu Item Modal */}
        <Modal 
          isOpen={isMenuItemModalOpen} 
          onClose={onMenuItemModalClose}
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedMenuItem?.id ? 'Edit Menu Item' : 'Add Menu Item'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Item Name</FormLabel>
                  <Input
                    value={selectedMenuItem?.name || ''}
                    onChange={(e) => setSelectedMenuItem(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    placeholder="Enter item name"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={selectedMenuItem?.description || ''}
                    onChange={(e) => setSelectedMenuItem(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    placeholder="Enter item description"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Price</FormLabel>
                  <NumberInput
                    value={selectedMenuItem?.price || ''}
                    onChange={(valueString) => setSelectedMenuItem(prev => ({
                      ...prev,
                      price: valueString
                    }))}
                  >
                    <NumberInputField placeholder="Enter price" />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={selectedMenuItem?.category || ''}
                    onChange={(e) => setSelectedMenuItem(prev => ({
                      ...prev,
                      category: e.target.value
                    }))}
                    placeholder="Select category"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Item Image</FormLabel>
                  <Input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setSelectedMenuItem(prev => ({
                        ...prev,
                        imageFile: file
                      }));
                    }}
                  />
                  </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button 
                variant="ghost" 
                mr={3} 
                onClick={onMenuItemModalClose}
              >
                Cancel
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={handleMenuItemSubmit}
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])), 
    },
  };
}