// components/pay/PortfolioChart.js
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, Text, Skeleton, useColorModeValue } from '@chakra-ui/react';
import { useAuth } from '@/hooks/useAuth';
import useSWR from 'swr';
import { formatCurrency } from '@/utils/format';

ChartJS.register(ArcElement, Tooltip, Legend);

const generateChartColors = (numColors) => {
  const baseColors = [
    '#3182CE', '#38A169', '#DD6B20', '#805AD5', '#D53F8C', '#ECC94B'
  ];
  
  return Array.from({ length: numColors }, (_, i) => 
    i < baseColors.length ? baseColors[i] : 
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
  );
};

const PortfolioChart = () => {
  const { user } = useAuth();
  const { data, error } = useSWR(user ? `/api/wallets/${user.id}/portfolio` : null);
  const textColor = useColorModeValue('gray.700', 'gray.300');

  if (error) return (
    <Box p={4} bg="red.50" borderRadius="md">
      <Text color="red.500">Failed to load portfolio data</Text>
    </Box>
  );

  if (!data) return <Skeleton height="300px" borderRadius="xl" />;

  const chartData = {
    labels: data.assets.map(asset => asset.currency.toUpperCase()),
    datasets: [{
      data: data.assets.map(asset => asset.value),
      backgroundColor: generateChartColors(data.assets.length),
      borderWidth: 0,
      hoverOffset: 20
    }]
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
        labels: { color: textColor, font: { size: 14 } }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${formatCurrency(value, data.currency)} (${((value / data.total) * 100).toFixed(1)}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <Box position="relative" height="300px">
      <Doughnut data={chartData} options={options} />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        textAlign="center"
      >
        <Text fontSize="lg" fontWeight="bold" color={textColor}>
          Total Value
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          {formatCurrency(data.total, data.currency)}
        </Text>
      </Box>
    </Box>
  );
};

export default PortfolioChart;