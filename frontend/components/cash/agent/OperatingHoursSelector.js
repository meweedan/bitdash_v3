// components/pay/agent/OperatingHoursSelector.js
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  useColorModeValue,
  Icon,
  useToast,
  Select,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { FiClock, FiSave } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

const OperatingHoursSelector = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Fetch operating hours
  const { data: hoursData, isLoading } = useQuery({
    queryKey: ['operatingHours'],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agent/hours`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch hours data');
      return response.json();
    }
  });

  const updateHours = useMutation({
    mutationFn: async (newHours) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agent/hours`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(newHours)
        }
      );
      if (!response.ok) throw new Error('Failed to update hours');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operatingHours'] });
      toast({
        title: 'Hours Updated',
        status: 'success',
        duration: 3000,
      });
    }
  });


  const handleSave = () => {
    if (!hoursData.start || !hoursData.end) {
      toast({
        title: 'Invalid Hours',
        description: 'Please select both start and end times',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    const [startHour, startMinute] = hoursData.start.split(':').map(Number);
    const [endHour, endMinute] = hoursData.end.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (endTime <= startTime) {
      toast({
        title: 'Invalid Hours',
        description: 'End time must be after start time',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    updateHours.mutate({
      start: hoursData.start,
      end: hoursData.end,
      isAlwaysOpen: hoursData.isAlwaysOpen
    });
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <VStack spacing={4} align="stretch">
        <HStack>
          <Icon as={FiClock} />
          <Text fontWeight="medium">Operating Hours</Text>
        </HStack>

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="always-open" mb="0">
            Always Open
          </FormLabel>
          <Switch
            id="always-open"
            isChecked={hoursData?.isAlwaysOpen}
            onChange={(e) => {
              updateHours.mutate({
                ...hoursData,
                isAlwaysOpen: e.target.checked
              });
            }}
          />
        </FormControl>

        {!hoursData?.isAlwaysOpen && (
          <>
            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Start Time</FormLabel>
                <Select
                  value={hoursData?.start || ''}
                  onChange={(e) => {
                    updateHours.mutate({
                      ...hoursData,
                      start: e.target.value
                    });
                  }}
                >
                  {timeSlots.map((time) => (
                    <option key={`start-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>End Time</FormLabel>
                <Select
                  value={hoursData?.end || ''}
                  onChange={(e) => {
                    updateHours.mutate({
                      ...hoursData,
                      end: e.target.value
                    });
                  }}
                >
                  {timeSlots.map((time) => (
                    <option key={`end-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </HStack>

            <Button
              leftIcon={<FiSave />}
              colorScheme="blue"
              onClick={handleSave}
              isLoading={updateHours.isLoading}
              loadingText="Saving..."
            >
              Save Hours
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default OperatingHoursSelector;