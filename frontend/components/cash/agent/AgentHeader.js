// components/pay/agent/AgentHeader.js
import {
  Flex,
  HStack,
  VStack,
  Avatar,
  Text,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Switch,
  useColorModeValue,
  Heading,
} from '@chakra-ui/react';
import { FiSettings, FiLogOut, FiBell } from 'react-icons/fi';
import { useRouter } from 'next/router';

const AgentHeader = ({ 
  agentData,  // Renamed from agent to match dashboard structure
  onStatusChange, 
  onLogout,
  notifications = []
}) => {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Get values from agentData structure
  const status = agentData?.status || 'inactive';
  const businessName = agentData?.businessName || 'Agent';

  const handleStatusToggle = () => {
    onStatusChange(status === 'active' ? 'inactive' : 'active');
  };

  return (
    <Flex
      w="full"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      p={4}
      justify="space-between"
      align="center"
      boxShadow="sm"
    >
      {/* Left section - Agent Info */}
      <HStack spacing={4}>
        <Avatar 
          size="md" 
          name={businessName}
          src={agentData?.avatar?.data?.attributes?.url}
        />
        <VStack align="start" spacing={0}>
          <Heading size="sm">
            {agentData.name || 'Agent'}  
          </Heading>          
          <HStack>
            <Badge 
              colorScheme={status === 'active' ? 'green' : 'red'}
              variant="subtle"
            >
              {status.toUpperCase()}
            </Badge>
            <Switch
              size="sm"
              isChecked={status === 'active'}
              onChange={handleStatusToggle}
              colorScheme="green"
            />
          </HStack>
        </VStack>
      </HStack>

      {/* Right section - Actions */}
      <HStack spacing={2}>
        {/* Notifications */}
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FiBell />}
            variant="ghost"
            position="relative"
          >
            {notifications.length > 0 && (
              <Badge
                colorScheme="red"
                position="absolute"
                top="-1"
                right="-1"
                borderRadius="full"
                size="sm"
              >
                {notifications.length}
              </Badge>
            )}
          </MenuButton>
          <MenuList>
            {notifications.length === 0 ? (
              <MenuItem>No new notifications</MenuItem>
            ) : (
              notifications.map((notification, index) => (
                <MenuItem key={index}>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">{notification.title}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {notification.message}
                    </Text>
                  </VStack>
                </MenuItem>
              ))
            )}
          </MenuList>
        </Menu>

        {/* Logout */}
        <IconButton
          icon={<FiLogOut />}
          variant="ghost"
          onClick={onLogout}
        />
      </HStack>
    </Flex>
  );
};

export default AgentHeader;