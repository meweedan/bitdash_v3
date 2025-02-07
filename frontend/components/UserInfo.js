// components/UserInfo.js
import {
  Box,
  HStack,
  Avatar,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { useTranslation } from 'next-i18next';

const UserInfo = ({ onLogout, showDetails = false }) => {
  const { t } = useTranslation('common');
  const customerProfileStr = localStorage.getItem('customerProfile');
  const customerProfile = customerProfileStr ? JSON.parse(customerProfileStr) : null;
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user && !customerProfile) {
    return null;
  }

  return (
    <Box p={2}>
      <Menu>
        <MenuButton as={Button} variant="ghost" size="sm" width="100%">
          <HStack spacing={2}>
            <Avatar 
              size="sm" 
              name={customerProfile?.fullName || user?.email} 
            />
            <VStack spacing={0} align="start">
              <Text fontSize="sm" fontWeight="bold">
                {customerProfile?.fullName || user?.email}
              </Text>
              {showDetails && customerProfile?.phone && (
                <Text fontSize="xs" color="gray.500">
                  {customerProfile.phone}
                </Text>
              )}
            </VStack>
          </HStack>
        </MenuButton>
        <MenuList>
          {showDetails && (
            <>
              {customerProfile?.allergies?.length > 0 && (
                <MenuItem isDisabled>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" fontWeight="bold">{t('allergies')}</Text>
                    <Text fontSize="xs">{customerProfile.allergies.join(', ')}</Text>
                  </VStack>
                </MenuItem>
              )}
              {customerProfile?.dietary_preferences?.length > 0 && (
                <MenuItem isDisabled>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" fontWeight="bold">{t('dietaryPreferences')}</Text>
                    <Text fontSize="xs">{customerProfile.dietary_preferences.join(', ')}</Text>
                  </VStack>
                </MenuItem>
              )}
              <MenuDivider />
            </>
          )}
          <MenuItem onClick={onLogout} icon={<FiLogOut />}>
            {t('logout')}
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default UserInfo;