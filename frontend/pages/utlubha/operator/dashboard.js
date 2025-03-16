import React, { useState, useEffect, useCallback, useRef, useMemo, useReducer } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js'; 
import Layout from '@/components/Layout';
import OperatorMessages from '@/components/OperatorMessages';
import SubscriptionInfo from '@/components/SubscriptionInfo';
import AnalyticsTab from '@/components/utlubha/operator/AnalyticsTab';
import Head from 'next/head';
import { QRCodeCanvas } from 'qrcode.react';

import {
  Box, Container, VStack, Heading, Text, Flex, Switch, 
  SimpleGrid, Button, FormControl, FormLabel, Input, Spinner,
  useToast, Tabs, TabList, TabPanels, Tab, TabPanel, Badge,
  Icon, Divider, HStack, Avatar, IconButton, Modal, ModalOverlay,
  DrawerContent, DrawerOverlay, Drawer, ModalContent, ModalHeader,
  ModalFooter, Image, ModalBody, ModalCloseButton, DrawerHeader,
  DrawerBody, DrawerCloseButton, Textarea, Select, NumberInput,
  NumberInputField, NumberInputStepper, NumberIncrementStepper,
  NumberDecrementStepper, useColorModeValue, useDisclosure
} from '@chakra-ui/react';

import { mdiCheckCircle } from '@mdi/js';
import { IoIosColorFill } from "react-icons/io";

import {
  FiLogOut, FiPlus, FiEdit, FiTrash, FiMenu, FiGrid, FiList,
  FiCheck, FiPackage, FiArrowRight, FiSettings, FiDownload,
  FiSun, FiClock, FiX, FiCreditCard, FiTrendingUp, FiMoon,
  FiUser
} from 'react-icons/fi';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// API constants
const API_ENDPOINTS = {
  USERS_ME: '/api/users/me',
  OPERATORS: '/api/operators',
  RESTAURANTS: '/api/restaurants',
  TABLES: '/api/tables',
  MENUS: '/api/menus',
  MENU_ITEMS: '/api/menu-items',
  ORDERS: '/api/orders',
  SUBSCRIPTIONS: '/api/subscriptions',
  STRIPE_CHECKOUT: '/api/stripe/create-checkout-session',
};

// Common response handler
const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API Error: ${response.status}`);
  }
  return response.json();
};

// State action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER_DATA: 'SET_USER_DATA',
  SET_OPERATOR_DATA: 'SET_OPERATOR_DATA',
  SET_ORDERS: 'SET_ORDERS',
  SET_MESSAGES: 'SET_MESSAGES',
  SET_SELECTED_ORDER: 'SET_SELECTED_ORDER',
  SET_QR_DARK_MODE: 'SET_QR_DARK_MODE',
  SET_COLORS: 'SET_COLORS',
  SET_QR_SETTINGS: 'SET_QR_SETTINGS',
  RESET_STATE: 'RESET_STATE',
};

// Main reducer to centralize state management
const dashboardReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTIONS.SET_USER_DATA:
      return { ...state, userData: action.payload };
    case ACTIONS.SET_OPERATOR_DATA:
      return { ...state, operatorData: action.payload };
    case ACTIONS.SET_ORDERS:
      return { ...state, orders: action.payload };
    case ACTIONS.SET_MESSAGES:
      return { ...state, messages: action.payload };
    case ACTIONS.SET_SELECTED_ORDER:
      return { ...state, selectedOrder: action.payload };
    case ACTIONS.SET_QR_DARK_MODE:
      return { ...state, qrDarkMode: action.payload };
    case ACTIONS.SET_COLORS:
      return { ...state, selectedColors: { ...state.selectedColors, ...action.payload } };
    case ACTIONS.SET_QR_SETTINGS:
      return { ...state, qrSettings: { ...state.qrSettings, ...action.payload } };
    case ACTIONS.RESET_STATE:
      return { ...action.payload };
    default:
      return state;
  }
};

// Initial form state for modals
const initialFormState = {
  menuForm: { name: '', description: '' },
  menuItemForm: { name: '', description: '', price: 0, category: '', menuId: null },
  currentMenu: null,
  currentMenuItem: null,
};

// Form reducer
const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MENU_FORM':
      return { ...state, menuForm: { ...state.menuForm, ...action.payload } };
    case 'SET_MENU_ITEM_FORM':
      return { ...state, menuItemForm: { ...state.menuItemForm, ...action.payload } };
    case 'SET_CURRENT_MENU':
      return { ...state, currentMenu: action.payload };
    case 'SET_CURRENT_MENU_ITEM':
      return { ...state, currentMenuItem: action.payload };
    case 'RESET_MENU_FORM':
      return { ...state, menuForm: { name: '', description: '' }, currentMenu: null };
    case 'RESET_MENU_ITEM_FORM':
      return { 
        ...state, 
        menuItemForm: { 
          name: '', 
          description: '', 
          price: 0, 
          category: '', 
          menuId: action.payload || null 
        }, 
        currentMenuItem: null 
      };
    default:
      return state;
  }
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      initialUserData: {
        restaurant: {
          id: null,
          name: '',
          description: '',
          tables: [],
          menus: [],
          subscription: {
            tier: 'standard',
            status: 'active'
          }
        }
      }
    },
  };
}

const Dashboard = ({ initialUserData }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const toast = useToast();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  // Use a ref to store the auth token to avoid re-renders
  const tokenRef = useRef(null);
  
  // Track if component is mounted
  const isMounted = useRef(true);
  
  // Track active tab to prevent unnecessary renders
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  
  // Use reducers for centralized state management
  const [state, dispatch] = useReducer(dashboardReducer, {
    isLoading: true,
    userData: initialUserData,
    operatorData: null,
    orders: [],
    messages: [],
    selectedOrder: null,
    qrDarkMode: false,
    selectedColors: {
      primary: initialUserData?.restaurant?.custom_colors?.primary || '#3182CE',
      secondary: initialUserData?.restaurant?.custom_colors?.secondary || '#48BB78',
      accent: initialUserData?.restaurant?.custom_colors?.accent || '#ED64A6',
      qrBackground: initialUserData?.restaurant?.custom_colors?.qrBackground || '#FFFFFF',
      qrForeground: initialUserData?.restaurant?.custom_colors?.qrForeground || '#000000'
    },
    qrSettings: {
      showLogo: initialUserData?.restaurant?.qr_settings?.showLogo ?? true,
      showName: initialUserData?.restaurant?.qr_settings?.showName ?? true
    }
  });
  
  const [formState, formDispatch] = useReducer(formReducer, initialFormState);
  
  // Modal disclosures
  const {
    isOpen: isMenuModalOpen,
    onOpen: openMenuModal,
    onClose: closeMenuModal
  } = useDisclosure();
  
  const {
    isOpen: isMenuItemModalOpen,
    onOpen: openMenuItemModal,
    onClose: closeMenuItemModal
  } = useDisclosure();
  
  const {
    isOpen: isColorModalOpen,
    onOpen: openColorModal,
    onClose: closeColorModal
  } = useDisclosure();
  
  const {
    isOpen: isOrderDetailsOpen,
    onOpen: openOrderDetails,
    onClose: closeOrderDetails
  } = useDisclosure();

  // Helper to safely access token
  const getToken = useCallback(() => {
    if (!tokenRef.current) {
      tokenRef.current = localStorage.getItem('token');
    }
    return tokenRef.current;
  }, []);

  // Generic API request function
  const apiRequest = useCallback(async (endpoint, options = {}) => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication token missing');
    }
    
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    return handleApiResponse(response);
  }, [BASE_URL, getToken]);

  // Fetch user and operator data
  const fetchUserData = useCallback(async () => {
    if (!isMounted.current) return null;
    
    try {
      const userData = await apiRequest(API_ENDPOINTS.USERS_ME);
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }, [apiRequest]);

  // Fetch operator data with all related entities
  const fetchOperatorData = useCallback(async (userId) => {
    if (!isMounted.current || !userId) return null;
    
    try {
      const endpoint = `${API_ENDPOINTS.OPERATORS}?filters[users_permissions_user][id]=${userId}&populate[restaurant][populate][]=logo&populate[restaurant][populate][]=tables&populate[restaurant][populate][]=menus&populate[restaurant][populate][]=menus.menu_items&populate[subscription][fields][]=tier&populate[subscription][fields][]=status&populate[subscription][fields][]=commission_rate&populate[subscription][fields][]=monthly_fee&populate[subscription][fields][]=start_date&populate[subscription][fields][]=end_date&populate[restaurant][populate][]=custom_colors&populate[restaurant][populate][]=qr_settings`;
      
      const operatorData = await apiRequest(endpoint);
      return operatorData;
    } catch (error) {
      console.error('Error fetching operator data:', error);
      throw error;
    }
  }, [apiRequest]);

  // Process operator data to get restaurant, subscription, etc.
  const processOperatorData = useCallback((operatorData) => {
    if (!operatorData?.data || operatorData.data.length === 0) {
      return {
        operator: null,
        restaurant: null,
        subscription: null
      };
    }
    
    const operator = operatorData.data[0];
    const restaurant = operator.attributes?.restaurant?.data;
    const subscription = operator.attributes?.subscription?.data;
    
    let processedRestaurant = null;
    
    if (restaurant) {
      processedRestaurant = {
        id: restaurant.id,
        name: restaurant.attributes?.name || '',
        description: restaurant.attributes?.description || '',
        custom_colors: restaurant.attributes?.custom_colors || null,
        qr_settings: restaurant.attributes?.qr_settings || null,
        logo: restaurant.attributes?.logo?.data || null,
        tables: restaurant.attributes?.tables?.data || [],
        menus: restaurant.attributes?.menus?.data || []
      };
      
      if (subscription) {
        processedRestaurant.subscription = {
          id: subscription.id,
          tier: subscription.attributes?.tier || 'standard',
          status: subscription.attributes?.status || 'active',
          commission_rate: subscription.attributes?.commission_rate || 0,
          monthly_fee: subscription.attributes?.monthly_fee || 0,
          start_date: subscription.attributes?.start_date,
          end_date: subscription.attributes?.end_date
        };
      } else {
        processedRestaurant.subscription = {
          tier: 'standard',
          status: 'active',
          commission_rate: 0,
          monthly_fee: 0
        };
      }
    }
    
    return {
      operator,
      restaurant: processedRestaurant,
      subscription: restaurant?.subscription
    };
  }, []);

  // Fetch orders for a restaurant
  const fetchOrders = useCallback(async (restaurantId) => {
    if (!isMounted.current || !restaurantId) return [];
    
    try {
      const endpoint = `${API_ENDPOINTS.ORDERS}?filters[restaurant][id]=${restaurantId}&populate=*`;
      const ordersData = await apiRequest(endpoint);
      return ordersData.data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }, [apiRequest]);

  // Main authentication check and data loading function
  const checkAuth = useCallback(async () => {
    if (!isMounted.current) return;
    
    // Prevent concurrent auth checks
    if (state.isLoading) return;
    
    // Set loading state
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    
    try {
      const token = getToken();
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Fetch user data
      const userData = await fetchUserData();
      
      // Fetch operator data with all necessary relationships
      const operatorData = await fetchOperatorData(userData.id);
      
      // Process the operator data
      const { operator, restaurant } = processOperatorData(operatorData);
      
      // Update state with operator data
      dispatch({ type: ACTIONS.SET_OPERATOR_DATA, payload: operator });
      
      // Update state with restaurant data
      if (restaurant) {
        dispatch({ type: ACTIONS.SET_USER_DATA, payload: { restaurant } });
        
        // Set colors and QR settings based on restaurant data
        if (restaurant.custom_colors) {
          dispatch({ type: ACTIONS.SET_COLORS, payload: restaurant.custom_colors });
        }
        
        if (restaurant.qr_settings) {
          dispatch({ type: ACTIONS.SET_QR_SETTINGS, payload: restaurant.qr_settings });
        }
        
        // Fetch orders if restaurant exists
        if (restaurant.id) {
          const orders = await fetchOrders(restaurant.id);
          dispatch({ type: ACTIONS.SET_ORDERS, payload: orders });
        }
      } else {
        dispatch({ 
          type: ACTIONS.SET_USER_DATA, 
          payload: { ...initialUserData, noRestaurant: true } 
        });
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      
      toast({
        title: t('error'),
        description: error.message || 'Failed to load dashboard',
        status: 'error',
        duration: 5000
      });
      
      dispatch({ type: ACTIONS.SET_USER_DATA, payload: initialUserData });
    } finally {
      if (isMounted.current) {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    }
  }, [
    fetchUserData, 
    fetchOperatorData, 
    processOperatorData, 
    fetchOrders, 
    state.isLoading,
    getToken, 
    router, 
    toast, 
    t, 
    initialUserData
  ]);

  // Handle table actions (create, edit, delete)
  const handleTableAction = useCallback(async (action, tableId, tableName) => {
    if (!isMounted.current) return;
    
    try {
      const token = getToken();
      
      if (action === 'delete') {
        if (!confirm(`Delete table "${tableName}"?`)) {
          return;
        }
        
        await apiRequest(`${API_ENDPOINTS.TABLES}/${tableId}`, {
          method: 'DELETE'
        });
        
        toast({
          title: 'Success',
          description: 'Table deleted successfully',
          status: 'success',
          duration: 2000
        });
      }
      
      if (action === 'edit') {
        const newName = prompt('Enter new table name:', tableName);
        
        if (!newName || newName === tableName) {
          return;
        }
        
        await apiRequest(`${API_ENDPOINTS.TABLES}/${tableId}`, {
          method: 'PUT',
          body: JSON.stringify({
            data: {
              name: newName
            }
          })
        });
        
        toast({
          title: 'Success',
          description: 'Table updated successfully',
          status: 'success',
          duration: 2000
        });
      }
      
      // Refresh data
      await checkAuth();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  }, [apiRequest, checkAuth, getToken, toast]);

  // Handle creating a table
  const handleAddTable = useCallback(async () => {
    if (!isMounted.current) return;
    
    // Check subscription tier
    const subscriptionTier = state.userData?.restaurant?.subscription?.tier || 'standard';
    
    // Count existing tables
    const existingTableCount = state.userData?.restaurant?.tables?.length || 0;

    // Restrict table creation based on subscription
    if (subscriptionTier === 'standard' && existingTableCount >= 5) {
      toast({
        title: 'Upgrade Required',
        description: 'You have reached the maximum number of tables for the standard subscription.',
        status: 'warning',
        duration: 5000,
        render: () => (
          <Box p={3} borderRadius="md">
            <Flex align="center" justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">Upgrade to Premium</Text>
                <Text fontSize="sm">Unlock unlimited table creation</Text>
              </VStack>
              <Button 
                size="sm" 
                onClick={() => handleUpgradeSubscription('premium')}
              >
                Upgrade
              </Button>
            </Flex>
          </Box>
        )
      });
      return;
    }

    const tableName = prompt(t('enterTableName'));
    if (!tableName) return;

    try {
      await apiRequest(`${API_ENDPOINTS.TABLES}`, {
        method: 'POST',
        body: JSON.stringify({
          data: {
            name: tableName,
            restaurant: state.userData?.restaurant?.id,
            status: 'Available',
            color: subscriptionTier === 'premium' 
              ? getRandomTableColor() 
              : '#3182CE' // Default blue for standard
          }
        })
      });

      // Refresh data
      await checkAuth();
      
      toast({
        title: t('tableCreated'),
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  }, [apiRequest, checkAuth, getToken, state.userData, t, toast]);

  // Handle upgrading subscription
  const handleUpgradeSubscription = useCallback(async (newTier) => {
    if (!isMounted.current) return;
    
    try {
      console.log('Upgrading subscription to:', newTier);
      
      const response = await apiRequest(API_ENDPOINTS.STRIPE_CHECKOUT, {
        method: 'POST',
        body: JSON.stringify({ 
          planId: newTier,
          restaurantId: state.userData.restaurant.id
        })
      });
      
      if (!response.sessionId) {
        throw new Error('No session ID returned from Stripe');
      }

      // Initialize Stripe and redirect to checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ 
        sessionId: response.sessionId 
      });
      
      if (error) {
        console.error('Stripe redirect error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Subscription upgrade error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to process subscription upgrade',
        status: 'error',
        duration: 3000
      });
    }
  }, [apiRequest, state.userData, toast]);

  // Handle canceling subscription
  const handleCancelSubscription = useCallback(async () => {
    if (!isMounted.current) return;
    
    if (!window.confirm(t('confirmCancelSubscription'))) return;

    try {
      await apiRequest(`${API_ENDPOINTS.SUBSCRIPTIONS}/${state.userData.restaurant.subscription.id}/cancel`, {
        method: 'POST'
      });

      toast({
        title: t('success'),
        description: t('subscriptionCancelled'),
        status: 'success',
        duration: 3000
      });

      // Refresh data
      await checkAuth();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: t('error'),
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  }, [apiRequest, checkAuth, state.userData, t, toast]);

  // Handle updating order status
  const handleUpdateOrderStatus = useCallback(async (orderId, newStatus) => {
    if (!isMounted.current) return;
    
    try {
      const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
      const statusToSet = newStatus.toLowerCase();
      
      if (!validStatuses.includes(statusToSet)) {
        throw new Error(`Invalid status: ${newStatus}`);
      }
      
      await apiRequest(`${API_ENDPOINTS.ORDERS}/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            status: statusToSet
          }
        })
      });

      // If restaurant exists, refresh orders
      if (state.userData?.restaurant?.id) {
        const orders = await fetchOrders(state.userData.restaurant.id);
        dispatch({ type: ACTIONS.SET_ORDERS, payload: orders });
      }
      
      toast({
        title: t('success'),
        description: t('orderUpdated'),
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: t('error'),
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  }, [apiRequest, fetchOrders, state.userData, t, toast]);

  // Handle menu operations
  const handleMenuSubmit = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      if (!state.userData.restaurant?.id) {
        toast({
          title: 'Error',
          description: 'Restaurant ID is missing',
          status: 'error',
          duration: 3000
        });
        return;
      }
      
      const body = {
        data: {
          name: formState.menuForm.name,
          description: formState.menuForm.description,
          restaurant: state.userData.restaurant.id
        }
      };
      
      // For new menu
      await apiRequest(API_ENDPOINTS.MENUS, {
        method: 'POST',
        body: JSON.stringify(body)
      });
      
      toast({
        title: 'Success',
        description: 'Menu created successfully',
        status: 'success',
        duration: 2000
      });
      
      // Reset form state
      formDispatch({ type: 'RESET_MENU_FORM' });
      
      // Close modal
      closeMenuModal();
      
      // Refresh data
      await checkAuth();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  }, [apiRequest, checkAuth, closeMenuModal, formState.menuForm, state.userData, toast]);

  // Handle menu item operations
  const handleMenuItemSubmit = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      const { menuItemForm, currentMenuItem } = formState;
      const isEditing = !!currentMenuItem;
      
      const method = isEditing ? 'PUT' : 'POST';
      const endpoint = isEditing 
        ? `${API_ENDPOINTS.MENU_ITEMS}/${currentMenuItem.id}` 
        : API_ENDPOINTS.MENU_ITEMS;
      
      const body = {
        data: {
          name: menuItemForm.name,
          description: menuItemForm.description,
          price: parseFloat(menuItemForm.price),
          category: menuItemForm.category,
          menus: menuItemForm.menuId // Using menus as per schema
        }
      };
      
      await apiRequest(endpoint, {
        method,
        body: JSON.stringify(body)
      });
      
      toast({
        title: 'Success',
        description: `Menu item ${isEditing ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 2000
      });
      
      // Reset form
      formDispatch({ 
        type: 'RESET_MENU_ITEM_FORM',
        payload: state.userData?.restaurant?.menus?.length > 0 
          ? state.userData.restaurant.menus[0].id 
          : null
      });
      
      // Close modal
      closeMenuItemModal();
      
      // Refresh data
      await checkAuth();
    } catch (error) {
      console.error('Menu item operation error:', error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  }, [apiRequest, checkAuth, closeMenuItemModal, formState, state.userData, toast]);

  // Handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    tokenRef.current = null;
    router.push('/login');
  }, [router]);

  // Handle color customization
  const handleColorChange = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      await apiRequest(`${API_ENDPOINTS.RESTAURANTS}/${state.userData.restaurant.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            custom_colors: state.selectedColors,
            qr_settings: state.qrSettings
          }
        })
      });

      // Update the restaurant data in userData (handled by checkAuth)
      await checkAuth();

      toast({
        title: t('success'),
        description: t('settingsUpdated'),
        status: 'success',
        duration: 2000
      });

      closeColorModal();
    } catch (error) {
      toast({
        title: t('error'),
        description: error.message,
        status: 'error'
      });
    }
  }, [apiRequest, checkAuth, closeColorModal, state.selectedColors, state.qrSettings, state.userData, t, toast]);

  // Handle different actions (add, update, delete)
  const handleAdd = useCallback((type) => {
    switch (type) {
      case 'restaurant':
        router.push('/utlubha/operator/create-page');
        break;
      case 'menu':
        // Reset the form first
        formDispatch({ type: 'RESET_MENU_FORM' });
        openMenuModal();
        break;
      case 'menuItem':
        // Reset the form with default menu if available
        const defaultMenuId = state.userData?.restaurant?.menus?.length > 0 
          ? state.userData.restaurant.menus[0].id 
          : null;
        
        formDispatch({ 
          type: 'RESET_MENU_ITEM_FORM',
          payload: defaultMenuId
        });
        
        openMenuItemModal();
        break;
      case 'table':
        handleAddTable();
        break;
    }
  }, [formDispatch, handleAddTable, openMenuItemModal, openMenuModal, router, state.userData]);

  const handleUpdate = useCallback((type, item) => {
    switch (type) {
      case 'menu':
        // Populate form with menu data
        formDispatch({ 
          type: 'SET_MENU_FORM', 
          payload: {
            name: item.attributes?.name || item.name || '',
            description: item.attributes?.description || item.description || ''
          }
        });
        
        formDispatch({ type: 'SET_CURRENT_MENU', payload: item });
        openMenuModal();
        break;
        
      case 'menuItem':
        // Populate form with menu item data
        formDispatch({ 
          type: 'SET_MENU_ITEM_FORM', 
          payload: {
            name: item.attributes?.name || item.name || '',
            description: item.attributes?.description || item.description || '',
            price: item.attributes?.price || item.price || 0,
            category: item.attributes?.category || item.category || '',
            menuId: item.attributes?.menus?.data?.id || item.menus?.id || item.menuId || null
          }
        });
        
        formDispatch({ type: 'SET_CURRENT_MENU_ITEM', payload: item });
        openMenuItemModal();
        break;
        
      case 'table':
        handleTableAction('edit', item.id, item.attributes?.name || item.name);
        break;
    }
  }, [formDispatch, handleTableAction, openMenuItemModal, openMenuModal]);

  // Continuing from where your code left off...

const handleDelete = useCallback(async (type, id) => {
  if (!window.confirm(t('confirmDelete'))) return;

  try {
    let endpoint;
    
    switch(type) {
      case 'menu':
        endpoint = `${API_ENDPOINTS.MENUS}/${id}`;
        break;
      case 'menuItem':
        endpoint = `${API_ENDPOINTS.MENU_ITEMS}/${id}`;
        break;
      case 'table':
        endpoint = `${API_ENDPOINTS.TABLES}/${id}`;
        break;
      default:
        throw new Error('Invalid type for deletion');
    }

    await apiRequest(endpoint, { method: 'DELETE' });

    // Refresh data after successful deletion
    await checkAuth();

    toast({
      title: t('success'),
      description: t(`${type}Deleted`),
      status: 'success',
      duration: 2000
    });
  } catch (error) {
    console.error('Delete error:', error);
    toast({
      title: t('error'),
      description: error.message,
      status: 'error',
      duration: 3000
    });
  }
}, [apiRequest, checkAuth, t, toast]);

// Handle printing QR code
const handlePrint = useCallback(async (tableName) => {
  try {
    // First capture the QR code using html2canvas
    const element = document.getElementById(`qr-box-${tableName}`);
    if (!element) return;

    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(element, {
      scale: 4,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: state.qrDarkMode ? '#1f2029' : '#0284c7',
    });

    // Convert canvas to image
    const image = canvas.toDataURL('image/png');

    // Create print window with the image
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: 'Error',
        description: 'Please allow pop-ups to print QR codes',
        status: 'error',
        duration: 3000
      });
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Code - ${tableName}</title>
          <style>
            @page {
              size: 85.60mm 53.98mm;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 53.98mm;
            }
            img {
              width: 85.60mm;
              height: 53.98mm;
              object-fit: contain;
              display: block;
            }
            @media print {
              body {
                width: 85.60mm;
                height: 53.98mm;
              }
              img {
                width: 100%;
                height: 100%;
              }
            }
          </style>
        </head>
        <body>
          <img src="${image}" alt="QR Code ${tableName}" />
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for the image to load before printing
    const img = printWindow.document.querySelector('img');
    if (img) {
      img.onload = () => {
        printWindow.print();
        // Close the window after a short delay to ensure print dialog appears
        setTimeout(() => {
          printWindow.close();
        }, 500);
      };
    } else {
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 500);
    }
  } catch (error) {
    console.error('Print error:', error);
    toast({
      title: 'Error',
      description: 'Failed to print QR code',
      status: 'error',
      duration: 3000
    });
  }
}, [state.qrDarkMode, toast]);

// Handle downloading QR code
const captureAndDownload = useCallback(async (tableName) => {
  try {
    // Get the element to capture
    const element = document.getElementById(`qr-box-${tableName}`);
    if (!element) {
      console.error(`Element with ID "qr-box-${tableName}" not found`);
      toast({
        title: 'Error',
        description: 'Failed to find QR code element',
        status: 'error',
        duration: 3000
      });
      return;
    }

    // Make sure html2canvas is imported properly
    const html2canvas = (await import('html2canvas')).default;
    
    // Capture the element with better settings
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality but not too high
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      onclone: (doc) => {
        // Make sure the element is visible in the cloned document
        const clonedElement = doc.getElementById(`qr-box-${tableName}`);
        if (clonedElement) {
          clonedElement.style.display = 'block';
        }
      }
    });

    // Convert to image data URL
    const image = canvas.toDataURL('image/png');
    
    // Create a simple download link
    const link = document.createElement('a');
    link.href = image;
    link.download = `${tableName}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Success',
      description: 'QR code downloaded successfully',
      status: 'success',
      duration: 2000
    });
  } catch (error) {
    console.error('Error capturing QR code:', error);
    toast({
      title: 'Error',
      description: `Failed to download QR code: ${error.message}`,
      status: 'error',
      duration: 3000
    });
  }
}, [toast]);

// Handle viewing order details
const handleViewOrderDetails = useCallback((order) => {
  dispatch({ type: ACTIONS.SET_SELECTED_ORDER, payload: order });
  openOrderDetails();
}, [dispatch, openOrderDetails]);

// Get random color for premium tables
const getRandomTableColor = () => {
  const colors = [
    '#3182CE', // Blue
    '#38A169', // Green
    '#DD6B20', // Orange
    '#805AD5', // Purple
    '#D53F8C', // Pink
    '#718096', // Gray
    '#2B6CB0', // Deep Blue
    '#2C7A7B', // Teal
    '#9F7AEA', // Light Purple
    '#ED64A6'  // Light Pink
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// QR Code Card Component - Memoized to prevent unnecessary re-renders
const QRCodeCard = useMemo(() => {
  return React.memo(({ 
    tableName,
    qrValue,
    isDarkMode,
    restaurantName,
    poweredByText,
    customColors = null,
    showLogo = true,
    showName = true,
    logoUrl = null
  }) => {
    const backgroundColor = customColors 
      ? `linear-gradient(110deg, ${customColors.primary} 0%, ${customColors.secondary} 100%)`
      : isDarkMode 
        ? 'linear-gradient(110deg, #111111 0%, #67bdfd 100%)'
        : 'linear-gradient(110deg, #67bdfd 0%, #111111 100%)';
    
    return (
      <Box 
        id={`qr-box-${tableName}`}
        background={backgroundColor}
        width="85.60mm"
        height="53.98mm"
        style={{
          minWidth: '85.60mm',
          minHeight: '53.98mm',
          maxWidth: '85.60mm',
          maxHeight: '53.98mm',
          direction: 'ltr'
        }}
        position="relative"
        overflow="hidden"
        padding="15px"
        mx="auto"
        boxShadow="0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)"
      >
        {/* Utlubha Brand */}
        <Text 
          fontSize="xs" 
          textAlign="center"
          fontWeight="bold" 
          color={customColors?.accent || (isDarkMode ? 'white' : 'black')}
        >
          Powered by Utlubha
        </Text>

        {/* Main Content Area */}
        <Flex 
          height="calc(100% - 60px)"
          width="100%"
          position="relative"
          justifyContent="flex-end"
          alignItems="center"
          style={{ direction: 'ltr' }}
        >
          {/* Restaurant Name (if shown) */}
          {showName && (
            <Box 
              position="absolute"
              left="0"
              maxWidth="calc(100% - 35mm)"
            >
              <Text 
                fontSize="sm"
                color="whiteAlpha.800"
                letterSpacing="wide"
                noOfLines={1}
                style={{ direction: 'ltr' }}
              >
                {restaurantName}
              </Text>
            </Box>
          )}

          {/* QR Code */}
          <Box
            bg={customColors?.qrBackground || 'white'}
            p={2}
            borderRadius="md"
            width="25mm"
            height="25mm"
            style={{
              minWidth: '25mm',
              minHeight: '25mm',
              maxWidth: '25mm',
              maxHeight: '25mm'
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
            boxShadow="md"
          >
            <QRCodeCanvas
              id={`qr-canvas-${tableName}`}
              value={qrValue}
              size={180}
              level="H"
              bgColor={customColors?.qrBackground || 'white'}
              fgColor={customColors?.qrForeground || (isDarkMode ? '#111111' : '#1179be')}
              style={{
                width: '100%',
                height: '100%'
              }}
            />
          </Box>
        </Flex>

        {/* Bottom Area */}
        <Flex 
          position="absolute"
          bottom="15px"
          left="15px"
          right="15px"
          justifyContent="space-between"
          alignItems="flex-end"
          style={{ direction: 'ltr' }}
        >
          {/* Table Number */}
          <Text 
            fontSize="3xl"
            fontWeight="bold" 
            color={customColors?.accent || 'white'}
            letterSpacing="wide"
          >
            {tableName}
          </Text>

          {/* Restaurant Logo */}
          {showLogo && logoUrl && (
            <Box
              width="12mm"
              height="8mm"
              position="relative"
              overflow="hidden"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                src={logoUrl}
                alt={restaurantName}
                style={{
                  maxWidth: '12mm',
                  maxHeight: '8mm',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </Box>
          )}
        </Flex>
      </Box>
    );
  });
}, []);

// Memoized responsive button component to reduce re-renders
const ResponsiveIconButton = useMemo(() => {
  return React.memo(({ 
    icon: Icon, 
    label, 
    onClick, 
    colorScheme = "blue",
    size = "md",
    variant = "utlubha-solid",
    isDisabled = false,
    iconsOnly = false
  }) => (
    <Button
      onClick={onClick}
      colorScheme={colorScheme}
      size={size}
      variant={variant}
      isDisabled={isDisabled}
      minW={iconsOnly ? "40px" : undefined}
      w={iconsOnly ? "40px" : undefined}
      p={iconsOnly ? "0" : undefined}
    >
      <Icon />
      {!iconsOnly && (
        <Text display={{ base: "none", md: "inline" }} ml={{ md: 2 }}>
          {label}
        </Text>
      )}
    </Button>
  ));
}, []);

// Memoized dashboard card component
const DashboardCard = useMemo(() => {
  return motion(({ children, ...props }) => (
    <Box
      p={6}
      backdropFilter="blur(10px)"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
      {...props}
    >
      {children}
    </Box>
  ));
}, []);

// Color Customization Modal - Memoized to prevent re-renders
const ColorCustomizationModal = useMemo(() => {
  return React.memo(() => {
    // Local state to avoid unnecessary parent re-renders
    const [localColors, setLocalColors] = useState(state.selectedColors);
    const [localQrSettings, setLocalQrSettings] = useState(state.qrSettings);
    
    // Update local state when parent state changes
    useEffect(() => {
      setLocalColors(state.selectedColors);
      setLocalQrSettings(state.qrSettings);
    }, [isColorModalOpen]);
    
    // Handle color input changes
    const handleColorInputChange = (key, value) => {
      setLocalColors(prev => ({
        ...prev,
        [key]: value
      }));
    };
    
    // Handle QR settings changes
    const handleQrSettingChange = (key, value) => {
      setLocalQrSettings(prev => ({
        ...prev,
        [key]: value
      }));
    };
    
    // Save changes to parent state and database
    const handleSave = () => {
      // Update parent state
      dispatch({ type: ACTIONS.SET_COLORS, payload: localColors });
      dispatch({ type: ACTIONS.SET_QR_SETTINGS, payload: localQrSettings });
      
      // Save to database
      handleColorChange();
    };
    
    return (
      <Modal 
        isOpen={isColorModalOpen} 
        onClose={closeColorModal} 
        size="xl"
        motionPreset="slideInBottom"
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Icon as={IoIosColorFill} />
              <Text>Customize QR Cards</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6}>
              {/* QR Code Customization */}
              <Box borderWidth="1px" borderRadius="md" p={4} w="100%" shadow="sm">
                <Heading size="sm" mb={4}>QR Code Settings</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>QR Code Color</FormLabel>
                    <Input 
                      type="color"
                      value={localColors.qrForeground}
                      onChange={(e) => handleColorInputChange('qrForeground', e.target.value)}
                      h="40px"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>QR Background Color</FormLabel>
                    <Input 
                      type="color"
                      value={localColors.qrBackground}
                      onChange={(e) => handleColorInputChange('qrBackground', e.target.value)}
                      h="40px"
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>

              {/* Display Settings */}
              <Box borderWidth="1px" borderRadius="md" p={4} w="100%" shadow="sm">
                <Heading size="sm" mb={4}>Display Settings</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Show Restaurant Logo</FormLabel>
                    <Switch 
                      isChecked={localQrSettings.showLogo}
                      onChange={(e) => handleQrSettingChange('showLogo', e.target.checked)}
                    />
                  </FormControl>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Show Restaurant Name</FormLabel>
                    <Switch 
                      isChecked={localQrSettings.showName}
                      onChange={(e) => handleQrSettingChange('showName', e.target.checked)}
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>

              {/* Card Colors */}
              <Box borderWidth="1px" borderRadius="md" p={4} w="100%" shadow="sm">
                <Heading size="sm" mb={4}>Card Colors</Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Primary Color</FormLabel>
                    <Input 
                      type="color"
                      value={localColors.primary}
                      onChange={(e) => handleColorInputChange('primary', e.target.value)}
                      h="40px"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Secondary Color</FormLabel>
                    <Input 
                      type="color"
                      value={localColors.secondary}
                      onChange={(e) => handleColorInputChange('secondary', e.target.value)}
                      h="40px"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Accent Color</FormLabel>
                    <Input 
                      type="color"
                      value={localColors.accent}
                      onChange={(e) => handleColorInputChange('accent', e.target.value)}
                      h="40px"
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>

              {/* Preview */}
              <Box borderWidth="1px" borderRadius="md" p={4} w="100%" shadow="sm">
                <Heading size="sm" mb={4}>Live Preview</Heading>
                <Box 
                  p={4} 
                  borderRadius="md"
                  display="flex"
                  justifyContent="center"
                >
                  <QRCodeCard
                    tableName="Preview"
                    qrValue="https://preview.example.com"
                    isDarkMode={false}
                    restaurantName={state.userData?.restaurant?.name || "Restaurant Name"}
                    customColors={localColors}
                    showLogo={localQrSettings.showLogo}
                    showName={localQrSettings.showName}
                    logoUrl={state.userData?.restaurant?.logo 
                      ? `${BASE_URL}${state.userData.restaurant.logo.url}` 
                      : null}
                  />
                </Box>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button 
                colorScheme="blue" 
                leftIcon={<Icon as={FiCheck} />}
                onClick={handleSave}
              >
                Save Changes
              </Button>
              <Button 
                variant="ghost" 
                onClick={closeColorModal}
              >
                Cancel
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  });
}, [
  state.selectedColors,
  state.qrSettings,
  state.userData,
  isColorModalOpen,
  closeColorModal,
  handleColorChange,
  QRCodeCard
]);

// Menu Modal Component - Memoized
const MenuModal = useMemo(() => {
  return React.memo(() => {
    const isEditing = !!formState.currentMenu;
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      formDispatch({ 
        type: 'SET_MENU_FORM', 
        payload: { [name]: value } 
      });
    };
    
    return (
      <Modal isOpen={isMenuModalOpen} onClose={closeMenuModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? 'Edit Menu' : 'Create Menu'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired mb={4}>
              <FormLabel>Menu Name</FormLabel>
              <Input 
                name="name"
                value={formState.menuForm.name} 
                onChange={handleChange}
                placeholder="Enter menu name"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formState.menuForm.description}
                onChange={handleChange}
                placeholder="Enter menu description"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeMenuModal}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleMenuSubmit}
              isDisabled={!formState.menuForm.name}
            >
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  });
}, [formState, isMenuModalOpen, closeMenuModal, handleMenuSubmit]);

// Menu Item Modal Component - Memoized
const MenuItemModal = useMemo(() => {
  return React.memo(() => {
    const isEditing = !!formState.currentMenuItem;
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      formDispatch({ 
        type: 'SET_MENU_ITEM_FORM', 
        payload: { [name]: value } 
      });
    };
    
    const handleNumberChange = (value) => {
      formDispatch({ 
        type: 'SET_MENU_ITEM_FORM', 
        payload: { price: value } 
      });
    };
    
    return (
      <Modal isOpen={isMenuItemModalOpen} onClose={closeMenuItemModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? 'Edit Menu Item' : 'Create Menu Item'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Item Name</FormLabel>
                <Input 
                  name="name"
                  value={formState.menuItemForm.name} 
                  onChange={handleChange}
                  placeholder="Enter item name"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formState.menuItemForm.description}
                  onChange={handleChange}
                  placeholder="Enter item description"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <NumberInput 
                  value={formState.menuItemForm.price} 
                  onChange={handleNumberChange}
                  min={0}
                  precision={2}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Input 
                  name="category"
                  value={formState.menuItemForm.category} 
                  onChange={handleChange}
                  placeholder="Enter category (e.g., Appetizers, Main Course)"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Menu</FormLabel>
                <Select 
                  name="menuId"
                  value={formState.menuItemForm.menuId || ''}
                  onChange={handleChange}
                >
                  <option value="">Select a menu</option>
                  {state.userData?.restaurant?.menus && state.userData.restaurant.menus.map(menu => (
                    <option key={menu.id} value={menu.id}>
                      {menu.attributes?.name || menu.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeMenuItemModal}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleMenuItemSubmit}
              isDisabled={!formState.menuItemForm.name || !formState.menuItemForm.menuId}
            >
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  });
}, [formState, isMenuItemModalOpen, closeMenuItemModal, handleMenuItemSubmit, state.userData]);

// Clean up on unmount
useEffect(() => {
  return () => {
    isMounted.current = false;
  };
}, []);

// Initialize the component - only run once on mount
useEffect(() => {
  checkAuth();
}, []);

// RENDER SECTION
return (
  <>
    <Head>
      <title>{state.userData?.restaurant?.name || 'Dashboard'} | {t('dashboard')}</title>
    </Head>
    <Layout>
      {state.isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Spinner size="xl" />
        </Box>
      ) : (
        <Box position="center">
          <Container maxW="1200px">
            <Box
              maxW="1500px"
              mx="auto"
              p={8}
              backdropFilter="blur(20px)"
            >
              <VStack spacing={8} align="stretch">
                {/* Header */}
                <Flex justify="space-between" alignItems="center">
                  <HStack spacing={4}>
                    <Avatar 
                      size="md" 
                      name={state.userData?.restaurant?.name} 
                      src={state.userData?.restaurant?.logo ? `${BASE_URL}${state.userData.restaurant.logo.url}` : undefined} 
                    />
                    <VStack align="start" spacing={0}>
                      <Heading size="lg">
                        {state.userData?.restaurant?.name || t('dashboard')}
                      </Heading>
                      {state.operatorData && (
                        <HStack>
                          <Icon as={FiUser} color="gray.500" />
                          <Text fontSize="sm" color="gray.500">
                            {state.operatorData.attributes?.fullName || "Operator"} 
                            ({state.operatorData.attributes?.operatorType || "standard"})
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                  </HStack>
                  <ResponsiveIconButton
                    icon={FiLogOut}
                    label={t('logout')}
                    onClick={handleLogout}
                  />
                </Flex>

                {/* Restaurant Info Card */}
                {state.userData?.restaurant ? (
                  <Box>
                    <VStack align="stretch" spacing={4}>
                      <Flex justify="space-between" align="center">
                        <Box>
                          <Text>
                            {state.userData.restaurant.description || t('noDescription')}
                          </Text>
                        </Box>
                      </Flex>
                    </VStack>
                  </Box>
                ) : (
                  <Box>
                    <VStack spacing={4} align="center" py={8}>
                      <Icon as={FiSettings} boxSize={12} />
                      <Text>
                        {t('noRestaurant')}
                      </Text>
                      <ResponsiveIconButton
                        icon={FiPlus}
                        label={t('createRestaurant')}
                        onClick={() => handleAdd('restaurant')}
                      />
                    </VStack>
                  </Box>
                )}

                {/* Main Content Tabs */}
                <Tabs 
                  isFitted 
                  variant="enclosed"
                  onChange={index => setActiveTabIndex(index)}
                  index={activeTabIndex}
                >
                  <TabList mb="1em">
                    <Tab>
                      <Icon as={FiGrid} display={{ base: "block", md: "none" }} />
                      <Text display={{ base: "none", md: "block" }}>{t('tables')}</Text>
                    </Tab>
                    <Tab>
                      <Icon as={FiMenu} display={{ base: "block", md: "none" }} />
                      <Text display={{ base: "none", md: "block" }}>{t('menus')}</Text>
                    </Tab>
                    <Tab>
                      <Icon as={FiPackage} display={{ base: "block", md: "none" }} />
                      <Text display={{ base: "none", md: "block" }}>{t('menuItems')}</Text>
                    </Tab>
                    <Tab>
                      <Icon as={FiList} display={{ base: "block", md: "none" }} />
                      <Text display={{ base: "none", md: "block" }}>{t('orders')}</Text>
                    </Tab>
                    <Tab>
                      <Icon as={FiTrendingUp} display={{ base: "block", md: "none" }} />
                      <Text display={{ base: "none", md: "block" }}>{t('analytics')}</Text>
                    </Tab>
                    <Tab>
                      <Icon as={FiCreditCard} display={{ base: "block", md: "none" }} />
                      <Text display={{ base: "none", md: "block" }}>{t('subscription')}</Text>
                    </Tab>
                  </TabList>

                  <TabPanels>
                    {/* Tables Tab */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        <Flex justify="space-between" align="center">
                          <Heading size="md">
                            {t('tables')}
                            </Heading>
                          <HStack spacing={2}>
                            <IconButton
                              icon={<IoIosColorFill />}
                              aria-label="Customize QR Cards"
                              onClick={openColorModal}
                              variant="utlubha-outline"
                            />
                            <ResponsiveIconButton
                              icon={FiPlus}
                              label={t('addTable')}
                              onClick={() => handleAdd('table')}
                              isDisabled={!state.userData?.restaurant}
                            />
                          </HStack>
                        </Flex>

                        {!state.userData?.restaurant ? (
                          <DashboardCard>
                            <VStack spacing={4} align="center" py={8}>
                              <Icon as={FiGrid} boxSize={12} />
                              <Text>
                                {t('noRestaurant')}
                              </Text>
                              <ResponsiveIconButton
                                icon={FiPlus}
                                label={t('createRestaurant')}
                                onClick={() => handleAdd('restaurant')}
                                colorScheme="blue"
                              />
                            </VStack>
                          </DashboardCard>
                        ) : !state.userData.restaurant.tables?.length ? (
                          <DashboardCard>
                            <VStack spacing={4} align="center" py={8}>
                              <Icon as={FiGrid} boxSize={12} />
                              <Text>
                                {t('noTables')}
                              </Text>
                              <ResponsiveIconButton
                                icon={FiPlus}
                                label={t('addFirstTable')}
                                onClick={() => handleAdd('table')}
                                colorScheme="blue"
                              />
                            </VStack>
                          </DashboardCard>
                        ) : (
                          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                            {state.userData.restaurant.tables.map((table) => (
                              <DashboardCard key={table.id}>
                                <VStack spacing={4} align="stretch">
                                  <Flex justify="space-between" align="center">
                                    <Box>
                                      <Heading as="h4" size="sm">
                                        {table.attributes?.name || table.name}
                                      </Heading>
                                      {(table.attributes?.description || table.description) && (
                                        <Text fontSize="sm">
                                          {table.attributes?.description || table.description}
                                        </Text>
                                      )}
                                    </Box>
                                    <HStack spacing={2}>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        leftIcon={<FiEdit />}
                                        onClick={() => handleTableAction('edit', table.id, table.attributes?.name || table.name)}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        size="sm"
                                        colorScheme="red"
                                        variant="outline"
                                        leftIcon={<FiTrash />}
                                        onClick={() => handleTableAction('delete', table.id, table.attributes?.name || table.name)}
                                      >
                                        Delete
                                      </Button>
                                    </HStack>
                                  </Flex>

                                  <Box 
                                    display="flex" 
                                    justifyContent="center" 
                                    width="100%" 
                                    py={4}
                                  >
                                    <QRCodeCard
                                      tableName={table.attributes?.name || table.name}
                                      qrValue={`https://utlubha.bitdash.app/${state.userData.restaurant.id}`}
                                      isDarkMode={state.qrDarkMode}
                                      restaurantName={state.userData.restaurant.name}
                                      customColors={state.userData.restaurant.custom_colors}
                                      showLogo={state.userData.restaurant.qr_settings?.showLogo ?? true}
                                      showName={state.userData.restaurant.qr_settings?.showName ?? true}
                                      logoUrl={state.userData.restaurant.logo 
                                        ? `${BASE_URL}${state.userData.restaurant.logo.url}` 
                                        : null}
                                    />
                                  </Box>

                                  <Flex mt={4} gap={4} justify="center">
                                    <Button
                                      onClick={() => captureAndDownload(table.attributes?.name || table.name)}
                                      leftIcon={<FiDownload />}
                                    >
                                      Download
                                    </Button>
                                  </Flex>
                                </VStack>
                              </DashboardCard>
                            ))}
                          </SimpleGrid>
                        )}
                      </VStack>
                    </TabPanel>

                    {/* Menus Tab */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        <Flex justify="space-between" align="center">
                          <Heading size="md">
                            {t('menus')}
                          </Heading>
                          <Button
                            leftIcon={<FiPlus />}
                            colorScheme="green"
                            onClick={() => handleAdd('menu')}
                            isDisabled={!state.userData?.restaurant}
                          >
                            {t('addMenu')}
                          </Button>
                        </Flex>

                        {!state.userData?.restaurant ? (
                          <DashboardCard>
                            <VStack spacing={4} align="center" py={8}>
                              <Icon as={FiMenu} boxSize={12} />
                              <Text>
                                {t('noRestaurant')}
                              </Text>
                              <ResponsiveIconButton
                                icon={FiPlus}
                                label={t('createRestaurant')}
                                onClick={() => handleAdd('restaurant')}
                                colorScheme="blue"
                              />
                            </VStack>
                          </DashboardCard>
                        ) : !state.userData.restaurant.menus || state.userData.restaurant.menus.length === 0 ? (
                          <DashboardCard>
                            <VStack spacing={4} align="center" py={8}>
                              <Icon as={FiMenu} boxSize={12} />
                              <Text>
                                {t('noMenus')}
                              </Text>
                              <ResponsiveIconButton
                                icon={FiPlus}
                                label={t('createMenu')}
                                onClick={() => handleAdd('menu')}
                                colorScheme="blue"
                              />
                            </VStack>
                          </DashboardCard>
                        ) : (
                          <VStack spacing={4} align="stretch">
                            {state.userData.restaurant.menus.map((menu) => (
                              <DashboardCard key={menu.id}>
                                <VStack spacing={4} align="stretch">
                                  <Flex justify="space-between" align="center">
                                    <Box>
                                      <Heading as="h4" size="sm">
                                        {menu.attributes?.name || menu.name}
                                      </Heading>
                                      <Text fontSize="sm">
                                        {menu.attributes?.description || menu.description}
                                      </Text>
                                    </Box>
                                    <HStack spacing={2}>
                                      <ResponsiveIconButton
                                        icon={FiEdit}
                                        label={t('edit')}
                                        onClick={() => handleUpdate('menu', menu)}
                                        size="sm"
                                        variant="outline"
                                        iconsOnly={true}
                                      />
                                      <ResponsiveIconButton
                                        icon={FiTrash}
                                        label={t('delete')}
                                        onClick={() => handleDelete('menu', menu.id)}
                                        size="sm"
                                        colorScheme="red"
                                        variant="outline"
                                        iconsOnly={true}
                                      />
                                    </HStack>
                                  </Flex>
                                </VStack>
                              </DashboardCard>
                            ))}
                          </VStack>
                        )}
                      </VStack>
                    </TabPanel>

                    {/* Menu Items Tab */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        <Flex justify="space-between" align="center">
                          <Heading size="md">
                            {t('menuItems')}
                          </Heading>
                          <ResponsiveIconButton
                            icon={FiPlus}
                            label={t('addMenuItem')}
                            onClick={() => handleAdd('menuItem')}
                            colorScheme="green"
                            isDisabled={!state.userData?.restaurant?.menus?.length}
                          />
                        </Flex>

                        {!state.userData?.restaurant?.menus?.length ? (
                          <DashboardCard>
                            <VStack spacing={4} align="center" py={8}>
                              <Icon as={FiPackage} boxSize={12} />
                              <Text>
                                {t('noMenu')}
                              </Text>
                              <ResponsiveIconButton
                                icon={FiPlus}
                                label={t('createMenu')}
                                onClick={() => handleAdd('menu')}
                                colorScheme="blue"
                              />
                            </VStack>
                          </DashboardCard>
                        ) : (
                          state.userData.restaurant.menus.map((menu) => {
                            const menuItems = menu.attributes?.menu_items?.data || [];
                            
                            return (
                              <Box key={menu.id}>
                                <Heading as="h4" size="md" mb={4}>
                                  {menu.attributes?.name || menu.name}
                                </Heading>
                                {!menuItems.length ? (
                                  <DashboardCard>
                                    <VStack spacing={4} align="center" py={8}>
                                      <Icon as={FiPackage} boxSize={12} />
                                      <Text>
                                        {t('noMenuItems')}
                                      </Text>
                                      <ResponsiveIconButton
                                        icon={FiPlus}
                                        label={t('addFirstItem')}
                                        onClick={() => handleAdd('menuItem')}
                                        colorScheme="blue"
                                      />
                                    </VStack>
                                  </DashboardCard>
                                ) : (
                                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    {menuItems.map((item) => (
                                      <DashboardCard key={item.id}>
                                        <VStack spacing={4} align="stretch">
                                          <Flex justify="space-between" align="center">
                                            <Box>
                                              <Heading as="h4" size="sm">
                                                {item.attributes?.name || item.name}
                                              </Heading>
                                              <Text fontSize="sm">
                                                {item.attributes?.description || item.description}
                                              </Text>
                                              <HStack spacing={2} mt={2}>
                                                <Badge rounded="full">
                                                  {item.attributes?.category || item.category || 'Uncategorized'}
                                                </Badge>
                                                <Badge rounded="full">
                                                  ${item.attributes?.price || item.price || '0.00'}
                                                </Badge>
                                              </HStack>
                                            </Box>
                                            <HStack spacing={2}>
                                              <ResponsiveIconButton
                                                icon={FiEdit}
                                                label={t('edit')}
                                                onClick={() => handleUpdate('menuItem', item)}
                                                size="sm"
                                                variant="outline"
                                                iconsOnly={true}
                                              />
                                              <ResponsiveIconButton
                                                icon={FiTrash}
                                                label={t('delete')}
                                                onClick={() => handleDelete('menuItem', item.id)}
                                                size="sm"
                                                colorScheme="red"
                                                variant="outline"
                                                iconsOnly={true}
                                              />
                                            </HStack>
                                          </Flex>
                                        </VStack>
                                      </DashboardCard>
                                    ))}
                                  </SimpleGrid>
                                )}
                              </Box>
                            );
                          })
                        )}
                      </VStack>
                    </TabPanel>

                    {/* Orders Tab */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        <Flex justify="space-between" align="center">
                          <Heading size="md">
                            {t('orders')}
                          </Heading>
                        </Flex>

                        {!state.userData?.restaurant ? (
                          <DashboardCard>
                            <VStack spacing={4} align="center" py={8}>
                              <Icon as={FiMenu} boxSize={12}/>
                              <Text>
                                {t('noRestaurant')}
                              </Text>
                            </VStack>
                          </DashboardCard>
                        ) : state.orders.length === 0 ? (
                          <DashboardCard>
                            <VStack spacing={4} align="center" py={8}>
                              <Icon as={FiMenu} boxSize={12} />
                              <Text>
                                {t('noOrders')}
                              </Text>
                            </VStack>
                          </DashboardCard>
                        ) : (
                          <VStack spacing={4} align="stretch">
                            {state.orders.map((order) => (
                              <Flex key={order.id} direction="row" align="stretch">
                                {/* Order Card */}
                                <DashboardCard flex="1">
                                  <VStack spacing={4} align="stretch">
                                    <Heading as="h4" size="sm">
                                      {t('order')} #{order.id}
                                    </Heading>
                                    {order.attributes?.customer_profile ? (
                                      <VStack align="start" spacing={0} mt={1}>
                                        <Text fontSize="sm">Customer: {order.attributes.customer_profile.data?.attributes?.fullName || "Guest"}</Text>
                                        <Text fontSize="sm">Phone: {order.attributes.customer_profile.data?.attributes?.phone || "N/A"}</Text>
                                      </VStack>
                                    ) : order.attributes?.guest_info ? (
                                      <VStack align="start" spacing={0} mt={1}>
                                        <Text fontSize="sm">Guest: {order.attributes.guest_info.name}</Text>
                                        <Text fontSize="sm">Phone: {order.attributes.guest_info.phone}</Text>
                                      </VStack>
                                    ) : null}
                                    <Text fontSize="sm" mt={1}>
                                      Table: {order.attributes?.tables?.data?.[0]?.attributes?.name || 'N/A'}
                                    </Text>
                                    <VStack align="start" spacing={0} mt={2}>
                                      {order.attributes?.order_items?.data?.map((item, index) => (
                                        <Text key={index} fontSize="sm">
                                          {item.attributes?.quantity || 1}x {item.attributes?.menu_item?.data?.attributes?.name || 'Unknown Item'}
                                        </Text>
                                      ))}
                                    </VStack>
                                    <HStack mt={2} spacing={2}>
                                      <Badge rounded="full">
                                        {order.attributes?.payment_method || 'N/A'}
                                      </Badge>
                                      <Badge colorScheme="green" rounded="full">
                                        ${order.attributes?.total || '0.00'}
                                      </Badge>
                                      <Badge
                                        colorScheme={
                                          order.attributes?.status === 'pending'
                                            ? 'yellow'
                                            : order.attributes?.status === 'preparing'
                                            ? 'blue'
                                            : order.attributes?.status === 'ready'
                                            ? 'orange'
                                            : order.attributes?.status === 'completed'
                                            ? 'green'
                                            : 'red'
                                        }
                                        rounded="full"
                                        px={2}
                                      >
                                        {order.attributes?.status || 'pending'}
                                      </Badge>
                                    </HStack>
                                    {order.attributes?.notes && (
                                      <Text fontSize="sm" mt={2}>
                                        Notes: {order.attributes.notes}
                                      </Text>
                                    )}
                                  </VStack>
                                </DashboardCard>

                                {/* Buttons Column */}
                                <VStack spacing={4} justify="space-between" pl={4} w="120px">
                                  <ResponsiveIconButton
                                    icon={FiEdit}
                                    label={t('viewDetails')}
                                    onClick={() => handleViewOrderDetails(order)}
                                    size="sm"
                                    colorScheme="gray"
                                  />
                                  {order.attributes?.status === 'pending' && (
                                    <ResponsiveIconButton
                                      icon={FiList}
                                      label={t('preparing')}
                                      onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                                      size="sm"
                                      colorScheme="blue"
                                    />
                                  )}
                                  {order.attributes?.status === 'preparing' && (
                                    <ResponsiveIconButton
                                      icon={FiClock}
                                      label={t('ready')}
                                      onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                                      size="sm"
                                      colorScheme="orange"
                                    />
                                  )}
                                  {order.attributes?.status === 'ready' && (
                                    <ResponsiveIconButton
                                      icon={FiCheck}
                                      label={t('complete')}
                                      onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                      size="sm"
                                      colorScheme="green"
                                    />
                                  )}
                                  {(order.attributes?.status === 'pending' ||
                                    order.attributes?.status === 'preparing' ||
                                    order.attributes?.status === 'ready') && (
                                    <ResponsiveIconButton
                                      icon={FiX}
                                      label={t('cancel')}
                                      onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                      size="sm"
                                      colorScheme="red"
                                    />
                                  )}
                                </VStack>
                              </Flex>
                            ))}
                          </VStack>
                        )}
                      </VStack>
                    </TabPanel>

                    {/* Analytics Tab - Only render when active to improve performance */}
                    <TabPanel>
                      {activeTabIndex === 4 && (
                        <AnalyticsTab 
                          orders={state.orders} 
                          subscription={state.userData?.restaurant?.subscription || {
                            tier: 'standard',
                            status: 'active'
                          }}
                          dir="ltr" 
                        />
                      )}
                    </TabPanel>
                    
                    {/* Subscription Tab */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        <Heading size="md">{t('subscriptionDetails')}</Heading>
                        {state.userData?.restaurant?.subscription ? (
                          <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                              <Box>
                                <Text fontWeight="bold">Tier:</Text>
                                <Badge colorScheme={state.userData.restaurant.subscription.tier === 'premium' ? 'purple' : 'blue'}>
                                  {state.userData.restaurant.subscription.tier || 'standard'}
                                </Badge>
                              </Box>
                              <Box>
                                <Text fontWeight="bold">Status:</Text>
                                <Badge colorScheme={state.userData.restaurant.subscription.status === 'active' ? 'green' : 'red'}>
                                  {state.userData.restaurant.subscription.status || 'active'}
                                </Badge>
                              </Box>
                              <Box>
                                <Text fontWeight="bold">Monthly Fee:</Text>
                                <Text>${state.userData.restaurant.subscription.monthly_fee || 0}</Text>
                              </Box>
                              <Box>
                                <Text fontWeight="bold">Commission Rate:</Text>
                                <Text>{state.userData.restaurant.subscription.commission_rate || 0}%</Text>
                              </Box>
                              {state.userData.restaurant.subscription.start_date && (
                                <Box>
                                  <Text fontWeight="bold">Start Date:</Text>
                                  <Text>{new Date(state.userData.restaurant.subscription.start_date).toLocaleDateString()}</Text>
                                </Box>
                              )}
                              {state.userData.restaurant.subscription.end_date && (
                                <Box>
                                  <Text fontWeight="bold">End Date:</Text>
                                  <Text>{new Date(state.userData.restaurant.subscription.end_date).toLocaleDateString()}</Text>
                                </Box>
                              )}
                            </SimpleGrid>
                            
                            <HStack mt={6} spacing={4} justify="center">
                              <Button 
                                variant="utlubha-outline"
                                leftIcon={<FiArrowRight />}
                                onClick={() => handleUpgradeSubscription(state.userData.restaurant.subscription.tier === 'standard' ? 'premium' : 'standard')}
                              >
                                {state.userData.restaurant.subscription.tier === 'standard' ? 'Upgrade to Premium' : 'Downgrade to Standard'}
                              </Button>
                              
                              {state.userData.restaurant.subscription.status === 'active' && (
                                <Button 
                                  variant="utlubha-solid"
                                  onClick={handleCancelSubscription}
                                >
                                  Cancel Subscription
                                </Button>
                              )}
                            </HStack>
                          </Box>
                        ) : (
                          <Box textAlign="center" p={8}>
                            <VStack spacing={4}>
                              <Icon as={FiCreditCard} boxSize={12} />
                              <Text>No active subscription found</Text>
                              <Button colorScheme="blue" onClick={() => handleUpgradeSubscription('standard')}>
                                Subscribe Now
                              </Button>
                            </VStack>
                          </Box>
                        )}
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </VStack>
            </Box>
          </Container>
        </Box>
      )}
    </Layout>
    
    {/* Order Details Drawer - Only rendered when open */}
    {isOrderDetailsOpen && (
      <Drawer 
        isOpen={isOrderDetailsOpen} 
        placement="right" 
        onClose={closeOrderDetails} 
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{t('orderDetails')}</DrawerHeader>

          <DrawerBody>
            {state.selectedOrder && (
              <VStack spacing={4} align="stretch">
                <Heading size="md">Order #{state.selectedOrder.id}</Heading>
                
                {/* Guest Info */}
                {state.selectedOrder.attributes?.guest_info && (
                  <Box>
                    <Text fontWeight="bold">Guest Information:</Text>
                    <Text>Name: {state.selectedOrder.attributes.guest_info.name}</Text>
                    <Text>Phone: {state.selectedOrder.attributes.guest_info.phone}</Text>
                  </Box>
                )}

                {/* Table Info */}
                <Box>
                  <Text fontWeight="bold">Table:</Text>
                  <Text>{state.selectedOrder.attributes?.tables?.data?.[0]?.attributes?.name || 'No table'}</Text>
                </Box>

                {/* Order Items */}
                <Box>
                  <Text fontWeight="bold">Items:</Text>
                  {state.selectedOrder.attributes?.order_items?.data?.map((item, index) => (
                    <Box key={index} p={2} borderWidth="1px" borderRadius="md" mt={2}>
                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">{item.attributes.menu_item.data.attributes.name}</Text>
                          <Text fontSize="sm">${item.attributes.unit_price} x {item.attributes.quantity}</Text>
                          {item.attributes.special_instructions && (
                            <Text fontSize="sm">
                              Notes: {item.attributes.special_instructions}
                            </Text>
                          )}
                        </VStack>
                        <Text fontWeight="bold">${item.attributes.subtotal}</Text>
                      </HStack>
                    </Box>
                  ))}
                </Box>

                <Divider />

                {/* Order Details */}
                <Box>
                  <HStack justify="space-between">
                    <Text fontWeight="bold">Total:</Text>
                    <Text>${state.selectedOrder.attributes?.total}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="bold">Payment Method:</Text>
                    <Text>{state.selectedOrder.attributes?.payment_method}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="bold">Status:</Text>
                    <Badge
                      colorScheme={
                        state.selectedOrder.attributes?.status === 'pending'
                          ? 'yellow'
                          : state.selectedOrder.attributes?.status === 'preparing'
                          ? 'blue'
                          : state.selectedOrder.attributes?.status === 'completed'
                          ? 'green'
                          : 'red'
                      }
                      rounded="full"
                      px={2}
                    >
                      {state.selectedOrder.attributes?.status}
                    </Badge>
                  </HStack>
                </Box>

                {/* Notes */}
                {state.selectedOrder.attributes?.notes && (
                  <Box>
                    <Text fontWeight="bold">Notes:</Text>
                    <Text whiteSpace="pre-wrap">{state.selectedOrder.attributes.notes}</Text>
                  </Box>
                )}

                {/* Timestamps */}
                <Box>
                  <Text fontWeight="bold">Order Time:</Text>
                  <Text>{new Date(state.selectedOrder.attributes?.createdAt).toLocaleString()}</Text>
                </Box>
                {state.selectedOrder.id && (
                  <OperatorMessages orderId={state.selectedOrder.id} />
                )}
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )}

    {/* Modals - Only rendered when open for better performance */}
    {isColorModalOpen && <ColorCustomizationModal />}
    {isMenuModalOpen && <MenuModal />}
    {isMenuItemModalOpen && <MenuItemModal />}
  </>
);
};

export default Dashboard;