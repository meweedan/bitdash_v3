// components/shop/owner/ThemeEditor.js
import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Switch,
  ColorPicker,
  FormControl,
  FormLabel,
  Select,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue
} from '@chakra-ui/react';

const ThemeEditor = ({ theme, onChange }) => {
  return (
    <Tabs>
      <TabList>
        <Tab>Colors</Tab>
        <Tab>Layout</Tab>
        <Tab>Features</Tab>
        <Tab>Advanced</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Primary Color</FormLabel>
              <ColorPicker
                value={theme.colors.primary}
                onChange={(color) => 
                  onChange({
                    ...theme,
                    colors: { ...theme.colors, primary: color }
                  })
                }
              />
            </FormControl>
            {/* Add other color pickers */}
          </VStack>
        </TabPanel>

        <TabPanel>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Layout Style</FormLabel>
              <Select
                value={theme.layout}
                onChange={(e) => 
                  onChange({ ...theme, layout: e.target.value })
                }
              >
                <option value="grid">Grid</option>
                <option value="list">List</option>
                <option value="masonry">Masonry</option>
              </Select>
            </FormControl>
          </VStack>
        </TabPanel>

        <TabPanel>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Show Location</FormLabel>
              <Switch
                isChecked={theme.showLocation}
                onChange={(e) => 
                  onChange({ ...theme, showLocation: e.target.checked })
                }
              />
            </FormControl>
            {/* Add other feature toggles */}
          </VStack>
        </TabPanel>

        <TabPanel>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Custom CSS</FormLabel>
              <Textarea
                value={theme.customCss}
                onChange={(e) => 
                  onChange({ ...theme, customCss: e.target.value })
                }
                placeholder="Add custom CSS here..."
                minH="200px"
              />
            </FormControl>
          </VStack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default ThemeEditor;