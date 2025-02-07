import React, { useState, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import {
  Box,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  VStack,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useBreakpointValue,
  useColorMode,
  Alert,
  AlertIcon,
  Badge,
  HStack,
  Divider,
  Icon,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useTheme
} from '@chakra-ui/react';
import { TrendingUp, TrendingDown, Users, UserPlus, Clock, DollarSign } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  Area
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box
      p={3}
      borderRadius="md"
      boxShadow="lg"
      bg="white"
      border="1px solid"
      borderColor="gray.200"
    >
      <Text fontWeight="bold" color="black" mb={1}>{label}</Text>
      {payload.map((entry, index) => (
        <Text key={index} color="black">
          {entry.name}: {typeof entry.value === 'number' ? 
            entry.value.toFixed(2) : entry.value}
        </Text>
      ))}
    </Box>
  );
};

const StatCard = ({ label, value, icon, trend }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  return (
    <Box
      p={isMobile ? 3 : 4}
      bg={isDark ? 'gray.800' : 'white'}
      borderRadius="xl"
      borderLeft="4px solid"
      borderColor="blue.500"
      shadow="sm"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-2px)' }}
    >
      <Stat>
        <HStack justify="space-between" mb={2}>
          <StatLabel fontSize={isMobile ? "xs" : "sm"} color={isDark ? "white" : "gray.600"}>
            {label}
          </StatLabel>
          <Icon as={icon} color="blue.500" boxSize={isMobile ? 4 : 5} />
        </HStack>
        <StatNumber 
          fontSize={isMobile ? "lg" : { base: 'xl', md: '2xl' }} 
          color={isDark ? "white" : "gray.900"}
        >
          {value}
        </StatNumber>
        {trend != null && (
          <StatHelpText 
            fontSize={isMobile ? "xs" : "sm"}
            color={trend > 0 ? "green.500" : "red.500"}
          >
            <StatArrow type={trend > 0 ? 'increase' : 'decrease'} />
            {Math.abs(trend)}%
          </StatHelpText>
        )}
      </Stat>
    </Box>
  );
};

const TimeAnalysisBlock = ({ periodData }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const isMobile = useBreakpointValue({ base: true, md: false });

  const periods = Object.entries(periodData).reduce((acc, [hour, data]) => {
    const period = parseInt(hour) < 11 ? 'morning' :
                  parseInt(hour) < 15 ? 'lunch' :
                  parseInt(hour) < 18 ? 'afternoon' :
                  parseInt(hour) < 22 ? 'dinner' : 'late';
    
    if (!acc[period]) {
      acc[period] = { orders: 0, revenue: 0 };
    }
    acc[period].orders += data.count || 0;
    acc[period].revenue += data.total || 0;
    return acc;
  }, {});

  return (
    <Grid 
      templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} 
      gap={4} 
      w="full"
    >
      {Object.entries(periods).map(([name, data]) => (
        <Box 
          key={name} 
          p={isMobile ? 3 : 4}
          bg={isDark ? 'gray.800' : 'white'}
          borderRadius="lg"
          shadow="sm"
        >
          <Text 
            fontWeight="bold" 
            color={isDark ? "white" : "gray.900"} 
            textTransform="capitalize"
          >
            {name}
          </Text>
          <HStack justify="space-between" mt={2}>
            <Text 
              fontSize={isMobile ? "xs" : "sm"} 
              color={isDark ? "gray.300" : "gray.600"}
            >
              Orders: {data.orders}
            </Text>
            <Text 
              fontSize={isMobile ? "xs" : "sm"} 
              color={isDark ? "gray.300" : "gray.600"}
            >
              Revenue: ${(data.revenue || 0).toFixed(2)}
            </Text>
          </HStack>
        </Box>
      ))}
    </Grid>
  );
};

const ChartContainer = ({ children, height = 400 }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Box 
      w="full" 
      h={isMobile ? 250 : height} 
      p={isMobile ? 2 : 4}
    >
      <ResponsiveContainer>
        {children}
      </ResponsiveContainer>
    </Box>
  );
};

const AnalyticsTab = ({ orders = [], subscription, dir = 'ltr' }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation('common');

  const colors = {
    primary: '#67bdfd',
    secondary: '#2196f3',
    accent: '#1976d2',
    dark: '#0d47a1',
    light: '#bbdefb',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    background: isDark ? 'rgba(103, 189, 253, 0.1)' : 'rgba(103, 189, 253, 0.05)',
    text: isDark ? '#e3f2fd' : '#1565c0'
  };

  const metrics = useMemo(() => ({
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
    avgOrderValue: orders.length ? orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length : 0,
    guestOrders: orders.filter(o => o.guest_info),
    customerOrders: orders.filter(o => o.customer_profile),
    customerRetention: orders.reduce((acc, o) => {
      if (o.customer_profile?.orders_count > 1) acc.returning++;
      else if (o.customer_profile) acc.new++;
      return acc;
    }, { returning: 0, new: 0 }),
    hourlyMetrics: orders.reduce((acc, o) => {
      const hour = new Date(o.createdAt).getHours();
      if (!acc[hour]) {
        acc[hour] = {
          total: 0,
          count: 0,
          guests: 0,
          customers: 0,
          items: {}
        };
      }
      acc[hour].total += o.total || 0;
      acc[hour].count++;
      acc[hour][o.guest_info ? 'guests' : 'customers']++;
      o.order_items?.forEach(i => {
        const name = i.menu_item?.name;
        if (name) {
          acc[hour].items[name] = (acc[hour].items[name] || 0) + (i.quantity || 0);
        }
      });
      return acc;
    }, {}),
    itemMetrics: orders.reduce((acc, o) => {
      o.order_items?.forEach(i => {
        const name = i.menu_item?.name;
        if (name) {
          if (!acc[name]) {
            acc[name] = {
              quantity: 0,
              revenue: 0,
              peakHours: Array(24).fill(0),
              orderFrequency: 0,
              guestOrders: 0,
              customerOrders: 0
            };
          }
          acc[name].quantity += i.quantity || 0;
          acc[name].revenue += (i.unit_price || 0) * (i.quantity || 0);
          acc[name].peakHours[new Date(o.createdAt).getHours()]++;
          acc[name].orderFrequency++;
          acc[name][o.guest_info ? 'guestOrders' : 'customerOrders']++;
        }
      });
      return acc;
    }, {})
  }), [orders]);

  const OverviewContent = ({metrics, colors}) => (
 <VStack spacing={6} w="full">
   <Grid 
     templateColumns={{
       base: 'repeat(2, 1fr)',
       md: 'repeat(4, 1fr)'
     }}
     gap={{base: 2, md: 4}}
     w="full"
   >
     <StatCard
       label={t('Total Orders')}
       value={metrics.totalOrders}
       icon={Clock}
       trend={5}
       colors={colors}
     />
     <StatCard
       label={t('Total Revenue')}
       value={`$${metrics.totalRevenue.toFixed(2)}`}
       icon={DollarSign}
       trend={8}
       colors={colors}
     />
     <StatCard
       label={t('Avg Order')}
       value={`$${metrics.avgOrderValue.toFixed(2)}`}
       icon={TrendingUp}
       trend={3}
       colors={colors}
     />
     <StatCard
       label={t('Customer Orders')}
       value={`${metrics.totalOrders ? ((metrics.customerOrders.length / metrics.totalOrders) * 100).toFixed(1) : 0}%`}
       icon={Users}
       trend={-2}
       colors={colors} 
     />
   </Grid>

   <Box w="full" minH={{base: '300px', md: '400px'}} p={{base: 2, md: 4}}>
     <ResponsiveContainer width="100%" height="100%">
       <ComposedChart
         data={Object.entries(metrics.hourlyMetrics).map(([hour, data]) => ({
           hour: `${hour}:00`,
           orders: data.count || 0,
           revenue: data.total || 0,
           customers: data.customers || 0
         }))}
         margin={{
           top: 5,
           right: 20,
           left: 20,
           bottom: 5
         }}
       >
         <CartesianGrid strokeDasharray="3 3" stroke={colors.light} />
         <XAxis dataKey="hour" stroke={colors.text} />
         <YAxis stroke={colors.text} />
         <YAxis yAxisId="right" orientation="right" stroke={colors.text} />
         <Tooltip content={(props) => <CustomTooltip {...props} colors={colors} />} />
         <Legend />
         <Bar dataKey="orders" fill={colors.primary} name={t('Orders')} />
         <Line yAxisId="right" type="monotone" dataKey="revenue" stroke={colors.accent} name={t('Revenue')} />
         <Area dataKey="customers" fill={colors.light} stroke={colors.secondary} name={t('Customers')} />
       </ComposedChart>
     </ResponsiveContainer>
   </Box>
 </VStack>
);

  const premiumMetrics = useMemo(() => {
    if (subscription?.tier !== 'premium') return null;

    return {
      customerSegments: orders.reduce((acc, o) => {
        if (!o.customer_profile) return acc;
        const orderCount = o.customer_profile.orders_count || 0;
        const segment = orderCount > 10 ? 'loyal' :
                       orderCount > 5 ? 'regular' :
                       orderCount > 1 ? 'returning' : 'new';
        acc[segment] = (acc[segment] || 0) + 1;
        return acc;
      }, {}),
      itemTrends: Object.entries(metrics.itemMetrics)
        .map(([item, stats]) => {
          const peakHour = stats.peakHours.indexOf(Math.max(...stats.peakHours));
          const total = stats.guestOrders + stats.customerOrders;
          const customerPreference = total > 0 ? stats.customerOrders / total : 0;
          return {
            item,
            peakHour,
            customerPreference,
            popularity: stats.quantity / (orders.length || 1),
            recommendation: customerPreference > 0.7 ? 'Customer Favorite' :
                          stats.quantity > orders.length * 0.3 ? 'High Demand' :
                          'Moderate Demand'
          };
        })
        .sort((a, b) => b.popularity - a.popularity),
      peakPeriods: Object.entries(metrics.hourlyMetrics).reduce((acc, [hour, data]) => {
        const period = parseInt(hour) < 11 ? 'morning' :
                      parseInt(hour) < 15 ? 'lunch' :
                      parseInt(hour) < 18 ? 'afternoon' :
                      parseInt(hour) < 22 ? 'dinner' : 'late';
        if (!acc[period]) {
          acc[period] = { orders: 0, revenue: 0, customers: 0, guests: 0 };
        }
        acc[period].orders += data.count || 0;
        acc[period].revenue += data.total || 0;
        acc[period].customers += data.customers || 0;
        acc[period].guests += data.guests || 0;
        return acc;
      }, {})
    };
  }, [metrics, orders, subscription?.tier]);

   return (
    <VStack spacing={6} w="full" dir={dir}>
      {subscription?.tier === 'premium' ? (
        <Tabs 
          variant="soft-rounded" 
          colorScheme="blue" 
          w="full" 
          isLazy
        >
          <TabList 
            overflowX="auto" 
            overflowY="hidden"
            whiteSpace="nowrap"
            py={2}
            css={{
              scrollbarWidth: 'none',
              '::-webkit-scrollbar': { display: 'none' },
              'button': {
                fontSize: { base: 'xs', md: 'sm' },
                px: { base: 2, md: 4 },
                whiteSpace: 'nowrap'
              }
            }}
          >
            <Tab>{t('Overview')}</Tab>
            <Tab>{t('Customers')}</Tab>
            <Tab>{t('Time Analysis')}</Tab>
            <Tab>{t('Items')}</Tab>
            <Tab>{t('Advanced')}</Tab>
          </TabList>

          <TabPanels>
          <TabPanel>
            <VStack spacing={6}>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} w="full">
                <Box w="full" h={{ base: '300px', md: '400px' }} p={4}>
                <ResponsiveContainer>
                    <LineChart
                    data={Object.entries(metrics.hourlyMetrics).map(([hour, data]) => ({
                        hour: `${hour}:00`,
                        revenue: data.total || 0
                    }))}
                    >
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.light} />
                    <XAxis dataKey="hour" stroke={colors.text} />
                    <YAxis stroke={colors.text} />
                    <Tooltip content={(props) => <CustomTooltip {...props} colors={colors} />} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke={colors.accent} name="Revenue" />
                    </LineChart>
                </ResponsiveContainer>
                </Box>

                <Box w="full" h={{ base: '300px', md: '400px' }} p={4}>
                <ResponsiveContainer>
                    <BarChart
                    data={Object.entries(metrics.hourlyMetrics).map(([hour, data]) => ({
                        hour: `${hour}:00`,
                        customers: data.customers || 0,
                        guests: data.guests || 0
                    }))}
                    >
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.light} />
                    <XAxis dataKey="hour" stroke={colors.text} />
                    <YAxis stroke={colors.text} />
                    <Tooltip content={(props) => <CustomTooltip {...props} colors={colors} />} />
                    <Legend />
                    <Bar dataKey="customers" fill={colors.primary} name="Customers" stackId="a" />
                    <Bar dataKey="guests" fill={colors.secondary} name="Guests" stackId="a" />
                    </BarChart>
                </ResponsiveContainer>
                </Box>
            </Grid>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={6}>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} w="full">
                <StatCard
                  label="Guest Orders"
                  value={metrics.guestOrders.length}
                  icon={UserPlus}
                  trend={2}
                  colors={colors}
                />
                <StatCard
                  label="Returning Customers"
                  value={metrics.customerRetention.returning}
                  icon={Users}
                  trend={7}
                  colors={colors}
                />
              </Grid>

              <Box w="full" h={{ base: '300px', md: '400px' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Guest Orders', value: metrics.guestOrders.length },
                        { name: 'Customer Orders', value: metrics.customerOrders.length }
                      ]}
                      labelLine={false}
                      label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                    >
                      <Cell fill={colors.primary} />
                      <Cell fill={colors.accent} />
                    </Pie>
                    <Tooltip content={(props) => <CustomTooltip {...props} colors={colors} />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              {subscription?.tier === 'premium' && premiumMetrics?.customerSegments && (
                <>
                  <Divider />
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} w="full">
                    {Object.entries(premiumMetrics.customerSegments).map(([segment, count]) => (
                      <Box key={segment} p={4} bg={colors.background} borderRadius="lg">
                        <Text fontWeight="bold" color={colors.text} textTransform="capitalize">{segment}</Text>
                        <Progress 
                          value={orders.length ? ((count / orders.length) * 100) : 0} 
                          colorScheme="blue" 
                          mt={2}
                        />
                        <Text fontSize="sm" mt={1} color={colors.text}>{count} customers</Text>
                      </Box>
                    ))}
                  </Grid>
                </>
              )}
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={6}>
              <TimeAnalysisBlock periodData={metrics.hourlyMetrics} colors={colors} />
              <Box w="full" h={{ base: '300px', md: '400px' }}>
                <ResponsiveContainer>
                  <ComposedChart
                    data={Object.entries(metrics.hourlyMetrics).map(([hour, data]) => ({
                      hour: `${hour}:00`,
                      orders: data.count || 0,
                      revenue: data.total || 0
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.light} />
                    <XAxis dataKey="hour" stroke={colors.text} />
                    <YAxis yAxisId="left" stroke={colors.text} />
                    <YAxis yAxisId="right" orientation="right" stroke={colors.text} />
                    <Tooltip content={(props) => <CustomTooltip {...props} colors={colors} />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="orders" fill={colors.primary} name="Orders" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke={colors.accent} name="Revenue" />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={6}>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Item</Th>
                    <Th isNumeric>Quantity</Th>
                    <Th isNumeric>Revenue</Th>
                    <Th>Peak Time</Th>
                    <Th>Performance</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.entries(metrics.itemMetrics)
                    .sort((a, b) => b[1].revenue - a[1].revenue)
                    .map(([item, stats]) => (
                      <Tr key={item}>
                        <Td>{item}</Td>
                        <Td isNumeric>{stats.quantity}</Td>
                        <Td isNumeric>${stats.revenue.toFixed(2)}</Td>
                        <Td>{stats.peakHours.indexOf(Math.max(...stats.peakHours))}:00</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              stats.quantity > orders.length * 0.3 ? 'green' :
                              stats.quantity > orders.length * 0.1 ? 'blue' : 'gray'
                            }
                          >
                            {stats.quantity > orders.length * 0.3 ? 'High' :
                             stats.quantity > orders.length * 0.1 ? 'Medium' : 'Low'}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </VStack>
          </TabPanel>

          {subscription?.tier === 'premium' && premiumMetrics && (
            <TabPanel>
              <VStack spacing={6}>
                <Alert status="info" variant="subtle" borderRadius="lg">
                  <AlertIcon />
                  Advanced analytics and predictions based on your restaurant's data
                </Alert>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} w="full">
                  {premiumMetrics.itemTrends.slice(0, 6).map((item) => (
                    <Box
                      key={item.item}
                      p={4}
                      bg={colors.background}
                      borderRadius="lg"
                      borderLeft="4px solid"
                      borderColor={
                        item.recommendation === 'Customer Favorite' ? colors.success :
                        item.recommendation === 'High Demand' ? colors.primary :
                        colors.warning
                      }
                    >
                      <Text fontWeight="bold" color={colors.text}>{item.item}</Text>
                      <HStack mt={2} spacing={4}>
                        <Badge colorScheme="blue">Peak: {item.peakHour}:00</Badge>
                        <Badge
                          colorScheme={
                            item.recommendation === 'Customer Favorite' ? 'green' :
                            item.recommendation === 'High Demand' ? 'blue' : 'yellow'
                          }
                        >
                          {item.recommendation}
                        </Badge>
                      </HStack>
                      <Progress
                        value={item.customerPreference * 100}
                        colorScheme="blue"
                        mt={2}
                        size="sm"
                      />
                      <Text fontSize="xs" mt={1} color={colors.text}>
                        Customer Preference: {(item.customerPreference * 100).toFixed(1)}%
                      </Text>
                    </Box>
                  ))}
                </Grid>

                <Box w="full" h={{ base: '300px', md: '400px' }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={Object.entries(premiumMetrics.peakPeriods).map(([period, data]) => ({
                        period,
                        customers: data.customers,
                        guests: data.guests,
                        revenue: data.revenue
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.light} />
                      <XAxis dataKey="period" stroke={colors.text} />
                      <YAxis yAxisId="left" stroke={colors.text} />
                      <YAxis yAxisId="right" orientation="right" stroke={colors.text} />
                      <Tooltip content={(props) => <CustomTooltip {...props} colors={colors} />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="customers" fill={colors.primary} stackId="a" />
                      <Bar yAxisId="left" dataKey="guests" fill={colors.secondary} stackId="a" />
                      <Line yAxisId="right" type="monotone" dataKey="revenue" stroke={colors.accent} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </TabPanel>
          )}
        </TabPanels>
       </Tabs>
     ) : (
       <OverviewContent metrics={metrics} colors={colors} />
     )}
   </VStack>
 );
};

export default AnalyticsTab;