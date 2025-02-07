// components/pay/agent/AnalyticsPanel.js
import {
  Box,
  SimpleGrid,
  VStack,
  Heading,
  Text,
  Select,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
} from '@chakra-ui/react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsPanel = ({ data }) => {
  // Chart configurations
  const transactionChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Transaction Volume',
        data: data?.dailyVolumes || [5000, 7500, 6000, 8000, 9500, 7000, 8500],
        fill: true,
        borderColor: 'rgba(66, 153, 225, 0.8)',
        backgroundColor: 'rgba(66, 153, 225, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const commissionChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Commissions Earned',
        data: data?.dailyCommissions || [125, 187.5, 150, 200, 237.5, 175, 212.5],
        backgroundColor: 'rgba(72, 187, 120, 0.7)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Performance Overview */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Box 
          p={6} 
          borderRadius="xl" 
          bg="white" 
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.100"
        >
          <VStack align="start" spacing={2}>
            <Heading size="sm" color="gray.500">Daily Goal Progress</Heading>
            <Stat>
              <StatNumber>78%</StatNumber>
              <Progress 
                value={78} 
                size="sm" 
                colorScheme="green" 
                borderRadius="full"
                mt={2}
              />
            </Stat>
            <StatHelpText>
              <StatArrow type="increase" />
              12% from yesterday
            </StatHelpText>
          </VStack>
        </Box>

        <Box 
          p={6} 
          borderRadius="xl" 
          bg="white" 
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.100"
        >
          <VStack align="start" spacing={2}>
            <Heading size="sm" color="gray.500">Customer Satisfaction</Heading>
            <Stat>
              <StatNumber>4.8/5.0</StatNumber>
              <Progress 
                value={96} 
                size="sm" 
                colorScheme="blue" 
                borderRadius="full"
                mt={2}
              />
            </Stat>
            <StatHelpText>Based on 128 transactions</StatHelpText>
          </VStack>
        </Box>

        <Box 
          p={6} 
          borderRadius="xl" 
          bg="white" 
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.100"
        >
          <VStack align="start" spacing={2}>
            <Heading size="sm" color="gray.500">Efficiency Rate</Heading>
            <Stat>
              <StatNumber>92%</StatNumber>
              <Progress 
                value={92} 
                size="sm" 
                colorScheme="purple" 
                borderRadius="full"
                mt={2}
              />
            </Stat>
            <StatHelpText>
              <StatArrow type="increase" />
              5% from last week
            </StatHelpText>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Charts */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Box 
          p={6} 
          borderRadius="xl" 
          bg="white" 
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.100"
        >
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between">
              <Heading size="sm" color="gray.500">Transaction Volume</Heading>
              <Select size="sm" width="120px">
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </Select>
            </HStack>
            <Box h="300px">
              <Line data={transactionChartData} options={chartOptions} />
            </Box>
          </VStack>
        </Box>

        <Box 
          p={6} 
          borderRadius="xl" 
          bg="white" 
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.100"
        >
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between">
              <Heading size="sm" color="gray.500">Commission Earnings</Heading>
              <Select size="sm" width="120px">
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </Select>
            </HStack>
            <Box h="300px">
              <Bar data={commissionChartData} options={chartOptions} />
            </Box>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Key Metrics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Box 
          p={6} 
          borderRadius="xl" 
          bg="white" 
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.100"
        >
          <VStack align="start">
            <Text color="gray.500" fontSize="sm">Average Transaction</Text>
            <Heading size="lg">$847.50</Heading>
            <StatHelpText>
              <StatArrow type="increase" />
              23% vs last week
            </StatHelpText>
          </VStack>
        </Box>

        <Box 
          p={6} 
          borderRadius="xl" 
          bg="white" 
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.100"
        >
          <VStack align="start">
            <Text color="gray.500" fontSize="sm">Repeat Customers</Text>
            <Heading size="lg">73%</Heading>
            <StatHelpText>
              <StatArrow type="increase" />
              12% vs last month
            </StatHelpText>
          </VStack>
        </Box>

        <Box 
          p={6} 
          borderRadius="xl" 
          bg="white" 
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.100"
        >
          <VStack align="start">
            <Text color="gray.500" fontSize="sm">Processing Time</Text>
            <Heading size="lg">2.3 min</Heading>
            <StatHelpText>
              <StatArrow type="decrease" />
              30% faster
            </StatHelpText>
          </VStack>
        </Box>

        <Box 
          p={6} 
          borderRadius="xl" 
          bg="white" 
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.100"
        >
          <VStack align="start">
            <Text color="gray.500" fontSize="sm">Success Rate</Text>
            <Heading size="lg">99.8%</Heading>
            <StatHelpText>
              <StatArrow type="increase" />
              0.3% improvement
            </StatHelpText>
          </VStack>
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

export default AnalyticsPanel;