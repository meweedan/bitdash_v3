// components/shop/owner/ThemeEditor.js
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Switch,
  FormControl,
  FormLabel,
  Select,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  Checkbox,
  useToast,
} from '@chakra-ui/react';
import { ChromePicker } from 'react-color';

/**
 * Updated ThemeEditor that sends color/theme updates to Strapi 
 * on save.
 *
 * Props:
 * - isOpen: boolean => controls modal visibility
 * - onClose: function => closes the modal
 * - theme: object => the existing theme to edit
 * - onSave: function => callback if you want to do something else after
 * - ownerId: string => the ID of the owner in Strapi
 * - token: string => optional JWT for authentication to Strapi
 */
const ThemeEditor = ({
  isOpen,
  onClose,
  theme,
  onSave,
  ownerId,
  token,
}) => {
  const toast = useToast();
  // Make a local copy so user can cancel without changing the actual theme
  const [localTheme, setLocalTheme] = useState(theme);
  const [colorPickerOpen, setColorPickerOpen] = useState({
    primary: false,
    secondary: false,
    text: false,
    accent: false,
  });

  const handleColorChange = (colorKey, color) => {
    setLocalTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: color.hex,
      },
    }));
  };

  const toggleColorPicker = (colorKey) => {
    setColorPickerOpen((prev) => ({
      ...prev,
      [colorKey]: !prev[colorKey],
    }));
  };

  /**
   * Persists the updated theme to Strapi:
   *  PUT /api/owners/:ownerId
   *   { data: { theme: localTheme } }
   */
  const handleSave = async () => {
    try {
      // Optional: If you need authentication, pass the JWT in `token` prop
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners/${ownerId}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            data: {
              theme: localTheme,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update theme (HTTP ${response.status})`);
      }

      const updated = await response.json();
      toast({
        title: 'Theme updated!',
        description: 'Your storefront theme has been saved.',
        status: 'success',
        duration: 3000,
      });

      // Call parent onSave callback if needed
      if (onSave) {
        onSave(localTheme, updated);
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Customize Your Shop Theme</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList mb={4}>
              <Tab>Colors</Tab>
              <Tab>Layout</Tab>
              <Tab>Features</Tab>
              <Tab>Advanced</Tab>
            </TabList>
            <TabPanels>
              {/* Colors Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  {Object.keys(localTheme.colors).map((colorKey) => (
                    <FormControl key={colorKey} position="relative">
                      <FormLabel textTransform="capitalize">
                        {colorKey
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())}{' '}
                        Color
                      </FormLabel>
                      <HStack>
                        <Input
                          value={localTheme.colors[colorKey]}
                          onClick={() => toggleColorPicker(colorKey)}
                          readOnly
                          flex={1}
                        />
                        <Box
                          w="50px"
                          h="50px"
                          bg={localTheme.colors[colorKey]}
                          borderRadius="md"
                          onClick={() => toggleColorPicker(colorKey)}
                          cursor="pointer"
                        />
                      </HStack>
                      {colorPickerOpen[colorKey] && (
                        <Box
                          mt={2}
                          position="absolute"
                          zIndex={10}
                          bg="white"
                          boxShadow="lg"
                        >
                          <ChromePicker
                            color={localTheme.colors[colorKey]}
                            onChange={(color) =>
                              handleColorChange(colorKey, color)
                            }
                          />
                        </Box>
                      )}
                    </FormControl>
                  ))}
                </VStack>
              </TabPanel>

              {/* Layout Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Layout Style</FormLabel>
                    <Select
                      value={localTheme.layout}
                      onChange={(e) =>
                        setLocalTheme((prev) => ({
                          ...prev,
                          layout: e.target.value,
                        }))
                      }
                    >
                      <option value="grid">Grid</option>
                      <option value="list">List</option>
                      <option value="masonry">Masonry</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Cover Image Height</FormLabel>
                    <Slider
                      defaultValue={parseInt(localTheme.coverHeight) || 315}
                      min={100}
                      max={500}
                      onChange={(val) =>
                        setLocalTheme((prev) => ({
                          ...prev,
                          coverHeight: `${val}px`,
                        }))
                      }
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <Tooltip
                        hasArrow
                        placement="top"
                        label={localTheme.coverHeight}
                      >
                        <SliderThumb />
                      </Tooltip>
                    </Slider>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Logo Size</FormLabel>
                    <Slider
                      defaultValue={parseInt(localTheme.logoSize) || 160}
                      min={50}
                      max={250}
                      onChange={(val) =>
                        setLocalTheme((prev) => ({
                          ...prev,
                          logoSize: `${val}px`,
                        }))
                      }
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <Tooltip
                        hasArrow
                        placement="top"
                        label={localTheme.logoSize}
                      >
                        <SliderThumb />
                      </Tooltip>
                    </Slider>
                  </FormControl>
                </VStack>
              </TabPanel>

              {/* Features Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel flex="1" htmlFor="show-location">
                      Show Location
                    </FormLabel>
                    <Switch
                      id="show-location"
                      isChecked={localTheme.showLocation}
                      onChange={(e) =>
                        setLocalTheme((prev) => ({
                          ...prev,
                          showLocation: e.target.checked,
                        }))
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Additional Features</FormLabel>
                    <VStack align="stretch">
                      <Checkbox
                        isChecked={localTheme.showRatings}
                        onChange={(e) =>
                          setLocalTheme((prev) => ({
                            ...prev,
                            showRatings: e.target.checked,
                          }))
                        }
                      >
                        Show Ratings
                      </Checkbox>
                      <Checkbox
                        isChecked={localTheme.enableSearch}
                        onChange={(e) =>
                          setLocalTheme((prev) => ({
                            ...prev,
                            enableSearch: e.target.checked,
                          }))
                        }
                      >
                        Enable Search
                      </Checkbox>
                    </VStack>
                  </FormControl>
                </VStack>
              </TabPanel>

              {/* Advanced Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Custom CSS</FormLabel>
                    <Box as="textarea"
                         minH="200px"
                         value={localTheme.customCss || ''}
                         onChange={(e) =>
                           setLocalTheme((prev) => ({
                             ...prev,
                             customCss: e.target.value,
                           }))
                         }
                         placeholder="Add custom CSS here..."
                    />
                  </FormControl>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <HStack>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSave}>
              Save Changes
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ThemeEditor;