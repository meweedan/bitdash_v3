import { 
  FiCheck, 
  FiClock, 
  FiX 
} from 'react-icons/fi';

export const getStatusIcon = (status) => {
  switch (status) {
    case 'completed':
      return { icon: FiCheck, color: 'green' };
    case 'pending':
      return { icon: FiClock, color: 'yellow' };
    case 'failed':
      return { icon: FiX, color: 'red' };
    default:
      return { icon: FiClock, color: 'gray' };
  }
};

export const formatCurrency = (amount, currency = 'LYD') => {
  return `${amount.toLocaleString()} ${currency}`;
};