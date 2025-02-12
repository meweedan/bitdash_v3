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
  Checkbox
} from '@chakra-ui/react';
import { ChromePicker } from 'react-color';

const ThemeEditor = ({ 
  isOpen, 
  onClose, 
  theme, 
  onSave 
}) => {
  const [localTheme, setLocalTheme] = useState(theme);
  const [colorPickerOpen, setColorPickerOpen] = useState({
    primary: false,
    secondary: false,
    text: false
  });

  const handleColorChange = (colorKey, color) => {
    setLocalTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: color.hex
      }
    }));
  };

  const toggleColorPicker = (colorKey) => {
    setColorPickerOpen(prev => ({
      ...prev,
      [colorKey]: !prev[colorKey]
    }));
  };

  const handleSave = () => {
    onSave(localTheme);
    onClose();
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
                    <FormControl key={colorKey}>
                      <FormLabel textTransform="capitalize">
                        {colorKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Color
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
                        />
                      </HStack>
                      {colorPickerOpen[colorKey] && (
                        <Box mt={2} position="absolute" zIndex={10}>
                          <ChromePicker
                            color={localTheme.colors[colorKey]}
                            onChange={(color) => handleColorChange(colorKey, color)}
                            onClose={() => toggleColorPicker(colorKey)}
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
                      onChange={(e) => setLocalTheme(prev => ({
                        ...prev,
                        layout: e.target.value
                      }))}
                    >
                      <option value="grid">Grid</option>
                      <option value="list">List</option>
                      <option value="masonry">Masonry</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Cover Image Height</FormLabel>
                    <Slider
                      defaultValue={parseInt(localTheme.coverHeight)}
                      min={100}
                      max={500}
                      onChange={(val) => setLocalTheme(prev => ({
                        ...prev,
                        coverHeight: `${val}px`
                      }))}
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
                      defaultValue={parseInt(localTheme.logoSize)}
                      min={50}
                      max={250}
                      onChange={(val) => setLocalTheme(prev => ({
                        ...prev,
                        logoSize: `${val}px`
                      }))}
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
                      onChange={(e) => setLocalTheme(prev => ({
                        ...prev,
                        showLocation: e.target.checked
                      }))}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Additional Features</FormLabel>
                    <VStack align="stretch">
                      <Checkbox
                        isChecked={localTheme.showRatings}
                        onChange={(e) => setLocalTheme(prev => ({
                          ...prev,
                          showRatings: e.target.checked
                        }))}
                      >
                        Show Ratings
                      </Checkbox>
                      <Checkbox
                        isChecked={localTheme.enableSearch}
                        onChange={(e) => setLocalTheme(prev => ({
                          ...prev,
                          enableSearch: e.target.checked
                        }))}
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
                    <Input
                      as="textarea"
                      minH="200px"
                      value={localTheme.customCss || ''}
                      onChange={(e) => setLocalTheme(prev => ({
                        ...prev,
                        customCss: e.target.value
                      }))}
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