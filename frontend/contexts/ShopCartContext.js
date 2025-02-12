// contexts/ShopCartContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ShopCartContext = createContext(null);

const initialState = {
  items: [],
  shopId: null,
  total: 0
};

const shopCartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      if (existingItemIndex >= 0) {
        const newItems = [...state.items];
        if (newItems[existingItemIndex].quantity + 1 <= action.payload.stock) {
          newItems[existingItemIndex].quantity += 1;
          return {
            ...state,
            items: newItems,
            total: state.total + action.payload.price
          };
        }
        return state;
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price
      };
    }

    case 'REMOVE_FROM_CART': {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (itemToRemove ? itemToRemove.price * itemToRemove.quantity : 0)
      };
    }

    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.id === action.payload.id);
      if (!item) return state;
      const quantityDiff = action.payload.quantity - item.quantity;
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (item.price * quantityDiff)
      };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'SET_SHOP':
      return {
        ...state,
        shopId: action.payload
      };

    default:
      return state;
  }
};

export const ShopCartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(shopCartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('shopCart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items) {
          dispatch({ type: 'CLEAR_CART' });
          parsedCart.items.forEach(item => {
            dispatch({ type: 'ADD_TO_CART', payload: item });
          });
        }
        if (parsedCart.shopId) {
          dispatch({ type: 'SET_SHOP', payload: parsedCart.shopId });
        }
      }
    } catch (error) {
      console.error('Error loading shop cart from localStorage:', error);
      localStorage.removeItem('shopCart');
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('shopCart', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving shop cart to localStorage:', error);
    }
  }, [state]);

  const addToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setShop = (shopId) => {
    dispatch({ type: 'SET_SHOP', payload: shopId });
  };

  const getCartTotal = () => state.total;

  const value = {
    cart: state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setShop,
    getCartTotal
  };

  return (
    <ShopCartContext.Provider value={value}>
      {children}
    </ShopCartContext.Provider>
  );
};

export const useShopCart = () => {
  const context = useContext(ShopCartContext);
  if (!context) {
    throw new Error('useShopCart must be used within a ShopCartProvider');
  }
  return context;
};

export default ShopCartContext;