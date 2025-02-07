// pages/pay/settings.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Switch,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  useColorMode,
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure
} from '@chakra-ui/react';
import { 
  ArrowLeft,
  Bell,
  Shield,
  CreditCard,
  Users,
  Settings,
  ChevronRight,
  Lock,
  Map,
  Smartphone,
  Edit,
  Trash,
  MoreVertical
} from 'lucide-react';

import Layout from '@/components/Layout';

const SettingsSection = ({ title, children }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <Box
      p={6}
      bg={isDark ? 'gray.800' : 'white'}
      rounded="xl"
      shadow="lg"
    >
      <VStack align="stretch" spacing={4}>
        <Heading size="md">{title}</Heading>
        {children}
      </VStack>
    </Box>
  );
};

const LinkedAccount = ({ account, onDelete }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <HStack justify="space-between" w="full" p={3} bg={isDark ? 'gray.700' : 'gray.50'} rounded="lg">
      <HStack>
        <CreditCard size={20} />
        <VStack align="start" spacing={0}>
          <Text fontWeight="medium">{account.bank}</Text>
          <Text fontSize="sm" color="gray.500">•••• {account.lastFour}</Text>
        </VStack>
      </HStack>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<MoreVertical size={16} />}
          variant="ghost"
          size="sm"
        />
        <MenuList>
          <MenuItem icon={<Edit size={16} />}>Edit</MenuItem>
          <MenuItem icon={<Trash size={16} />} onClick={() => onDelete(account.id)}>Remove</MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
};

const PaymentSettings = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: true,
      marketing: false
    },
    security: {
      twoFactor: true,
      biometric: true,
      transactionLimit: 5000
    },
    linkedAccounts: [
      { id: 1, bank: 'CIB Bank', lastFour: '4532', type: 'debit' },
      { id: 2, bank: 'QNB', lastFour: '8901', type: 'credit' }
    ]
  });

  const handleDeleteAccount = (accountId) => {
    setSettings(prev => ({
      ...prev,
      linkedAccounts: prev.linkedAccounts.filter(acc => acc.id !== accountId)
    }));
    toast({
      title: 'Account Removed',
      status: 'success',
      duration: 3000
    });
  };

  return (
    <Layout>
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack>
            <Button
              variant="ghost"
              leftIcon={<ArrowLeft />}
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Heading size="lg">Settings</Heading>
          </HStack>

          {/* Account Settings */}
          <SettingsSection title="Account Settings">
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between" py={2}>
                <HStack>
                  <Avatar size="sm" name="User Name" />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">User Name</Text>
                    <Text fontSize="sm" color="gray.500">user@email.com</Text>
                  </VStack>
                </HStack>
                <Button variant="ghost" rightIcon={<ChevronRight />}>
                  Edit Profile
                </Button>
              </HStack>
            </VStack>
          </SettingsSection>

          {/* Payment Methods */}
          <SettingsSection title="Payment Methods">
            <VStack align="stretch" spacing={4}>
              {settings.linkedAccounts.map(account => (
                <LinkedAccount
                  key={account.id}
                  account={account}
                  onDelete={handleDeleteAccount}
                />
              ))}
              <Button leftIcon={<CreditCard />} onClick={() => router.push('/pay/link-account')}>
                Add Payment Method
              </Button>
            </VStack>
          </SettingsSection>

          {/* Security Settings */}
          <SettingsSection title="Security">
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <HStack>
                  <Shield size={20} />
                  <Text>Two-Factor Authentication</Text>
                </HStack>
                <Switch
                  isChecked={settings.security.twoFactor}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, twoFactor: e.target.checked }
                  }))}
                />
              </HStack>

              <HStack justify="space-between">
                <HStack>
                  <Smartphone size={20} />
                  <Text>Biometric Login</Text>
                </HStack>
                <Switch
                  isChecked={settings.security.biometric}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, biometric: e.target.checked }
                  }))}
                />
              </HStack>

              <FormControl>
                <FormLabel>Transaction Limit (LYD)</FormLabel>
                <Input
                  type="number"
                  value={settings.security.transactionLimit}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, transactionLimit: e.target.value }
                  }))}
                />
                <FormHelperText>Maximum amount per transaction</FormHelperText>
              </FormControl>
            </VStack>
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection title="Notifications">
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <HStack>
                  <Bell size={20} />
                  <Text>Push Notifications</Text>
                </HStack>
                <Switch
                  isChecked={settings.notifications.push}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, push: e.target.checked }
                  }))}
                />
              </HStack>

              <HStack justify="space-between">
                <Text>Email Notifications</Text>
                <Switch
                  isChecked={settings.notifications.email}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, email: e.target.checked }
                  }))}
                />
              </HStack>

              <HStack justify="space-between">
                <Text>Marketing Communications</Text>
                <Switch
                  isChecked={settings.notifications.marketing}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, marketing: e.target.checked }
                  }))}
                />
              </HStack>
            </VStack>
          </SettingsSection>

          {/* Danger Zone */}
          <Box
            p={6}
            bg={isDark ? 'red.900' : 'red.50'}
            rounded="xl"
            border="1px"
            borderColor="red.500"
          >
            <VStack align="stretch" spacing={4}>
              <Heading size="md" color="red.500">Danger Zone</Heading>
              <Text>Be careful with these actions - they cannot be undone.</Text>
              <Button
                colorScheme="red"
                variant="outline"
                onClick={onOpen}
              >
                Delete Account
              </Button>
            </VStack>
          </Box>
        </VStack>

        {/* Delete Account Dialog */}
        <AlertDialog
          isOpen={isOpen}
          onClose={onClose}
          leastDestructiveRef={undefined}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>Delete Account</AlertDialogHeader>
              <AlertDialogBody>
                Are you sure? This action cannot be undone. All your data will be permanently deleted.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button onClick={onClose}>Cancel</Button>
                <Button colorScheme="red" ml={3}>Delete</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default PaymentSettings;