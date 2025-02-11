// components/charts/CategorySpendingChart.js
import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Sector
} from 'recharts';
import {
  Box,
  Spinner,
  Center,
  useColorModeValue,
  Text,
  VStack,
  HStack,
  Badge
} from '@chakra-ui/react';

const COLORS = ['#3182CE', '#63B3ED', '#4FD1C5', '#9F7AEA', '#ED64A6', '#F6AD55', '#48BB78', '#FC8181'];

const CategorySpendingChart = ({ orders = [], isLoading }) => {
  const chartData = useMemo(() => {
    if (!orders.length) return [];

    // Group orders by category and calculate totals
    const categoryTotals = orders.reduce((acc, order) => {
      const items = order.attributes.items || [];
      items.forEach(item => {
        const category = item.category || 'Uncategorized';
        const amount = parseFloat(item.price || 0) * (parseInt(item.quantity || 1));
        acc[category] = (acc[category] || 0) + amount;
      });
      return acc;
    }, {});

    // Convert to array and sort by amount
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value,
        percentage: 0 // Will be calculated below
      }))
      .sort((a, b) => b.value - a.value)
      .map((item, _, arr) => ({
        ...item,
        percentage: (item.value / arr.reduce((sum, i) => sum + i.value, 0) * 100).toFixed(1)
      }));
  }, [orders]);

  const [activeIndex, setActiveIndex] = React.useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      value
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 6}
          outerRadius={innerRadius - 2}
          fill={fill}
        />
      </g>
    );
  };

  if (isLoading) {
    return (
      <Center h="300px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (chartData.length === 0) {
    return (
      <Center h="300px">
        <Text color="gray.500">No spending data available</Text>
      </Center>
    );
  }

  return (
    <VStack h="400px" spacing={4} align="stretch">
      <Box h="300px">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              onMouseEnter={onPieEnter}
              paddingAngle={1}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value.toFixed(2)} LYD`}
              contentStyle={{
                backgroundColor: useColorModeValue('#FFF', '#2D3748'),
                border: '1px solid #CBD5E0',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Category Legend */}
      <VStack align="stretch" maxH="200px" overflowY="auto" spacing={2}>
        {chartData.map((category, index) => (
          <HStack key={category.name} justify="space-between">
            <HStack>
              <Badge
                w="3"
                h="3"
                p="0"
                bg={COLORS[index % COLORS.length]}
                borderRadius="sm"
              />
              <Text fontSize="sm">{category.name}</Text>
            </HStack>
            <HStack spacing={4}>
              <Text fontSize="sm" fontWeight="bold">
                {category.value.toFixed(2)} LYD
              </Text>
              <Text fontSize="sm" color="gray.500">
                {category.percentage}%
              </Text>
            </HStack>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};

export default CategorySpendingChart;