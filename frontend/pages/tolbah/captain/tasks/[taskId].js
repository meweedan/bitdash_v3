// pages/bsoraa/captain/tasks/[taskId].js
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
  Badge,
  Divider,
  useColorMode,
  useToast,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import {
  Navigation,
  Phone,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

import Layout from '@/components/Layout';

const TaskDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { taskId } = router.query;
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Example task data - would come from API
  const task = {
    id: taskId,
    restaurant: {
      name: 'Pizza Palace',
      address: '123 Main St, Cairo',
      phone: '+201234567890'
    },
    customer: {
      name: 'Ahmed M.',
      address: '456 Side St, Cairo',
      phone: '+201234567891',
      instructions: 'Please ring doorbell twice'
    },
    order: {
      items: [
        { name: 'Large Pepperoni Pizza', quantity: 1 },
        { name: 'Garlic Bread', quantity: 2 }
      ],
      total: 185
    },
    status: 'pickup',
    estimatedTime: '15 min'
  };

  const steps = [
    { title: 'Accepted', description: 'Order accepted' },
    { title: 'At Restaurant', description: 'Picking up order' },
    { title: 'Picked Up', description: 'On the way' },
    { title: 'Delivered', description: 'Order completed' }
  ];

  const currentStep = 1; // This would be dynamic based on task.status

  const handleStatusUpdate = (newStatus) => {
    // API call would go here
    toast({
      title: 'Status Updated',
      status: 'success',
      duration: 3000
    });
    onClose();
  };

  return (
    <Layout>
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              mb={4}
            >
              ← Back
            </Button>
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Heading size="lg">Delivery Task #{taskId}</Heading>
                <Badge colorScheme="blue" fontSize="md">{task.status}</Badge>
              </VStack>
              <Text fontSize="lg" fontWeight="bold">
                {task.estimatedTime} remaining
              </Text>
            </HStack>
          </Box>

          {/* Progress Stepper */}
          <Box
            p={6}
            bg={isDark ? 'gray.800' : 'white'}
            rounded="xl"
            shadow="lg"
          >
            <Stepper index={currentStep} orientation="vertical" height="400px">
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<CheckCircle />}
                      incomplete={<Clock />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <Box flexShrink="0">
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Restaurant Details */}
          <Box
            p={6}
            bg={isDark ? 'gray.800' : 'white'}
            rounded="xl"
            shadow="lg"
          >
            <VStack align="stretch" spacing={4}>
              <Heading size="md">Pickup Location</Heading>
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">{task.restaurant.name}</Text>
                <Text>{task.restaurant.address}</Text>
                <HStack>
                  <Button
                    leftIcon={<Navigation />}
                    onClick={() => window.open(`https://maps.google.com?q=${task.restaurant.address}`)}
                  >
                    Navigate
                  </Button>
                  <Button
                    leftIcon={<Phone />}
                    variant="outline"
                    onClick={() => window.open(`tel:${task.restaurant.phone}`)}
                  >
                    Call Restaurant
                  </Button>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          {/* Customer Details */}
          <Box
            p={6}
            bg={isDark ? 'gray.800' : 'white'}
            rounded="xl"
            shadow="lg"
          >
            <VStack align="stretch" spacing={4}>
              <Heading size="md">Delivery Location</Heading>
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">{task.customer.name}</Text>
                <Text>{task.customer.address}</Text>
                <Text color="gray.500">{task.customer.instructions}</Text>
                <HStack>
                  <Button
                    leftIcon={<Navigation />}
                    onClick={() => window.open(`https://maps.google.com?q=${task.customer.address}`)}
                  >
                    Navigate
                  </Button>
                  <Button
                    leftIcon={<Phone />}
                    variant="outline"
                    onClick={() => window.open(`tel:${task.customer.phone}`)}
                  >
                    Call Customer
                  </Button>
                  <Button
                    leftIcon={<MessageCircle />}
                    variant="outline"
                  >
                    Message
                  </Button>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          {/* Order Details */}
          <Box
            p={6}
            bg={isDark ? 'gray.800' : 'white'}
            rounded="xl"
            shadow="lg"
          >
            <VStack align="stretch" spacing={4}>
              <Heading size="md">Order Details</Heading>
              <VStack align="stretch" spacing={2}>
                {task.order.items.map((item, index) => (
                  <HStack key={index} justify="space-between">
                    <Text>{item.quantity}x {item.name}</Text>
                  </HStack>
                ))}
                <Divider />
                <HStack justify="space-between">
                  <Text fontWeight="bold">Total</Text>
                  <Text fontWeight="bold">{task.order.total} LYD</Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          {/* Action Buttons */}
          <HStack spacing={4}>
            <Button
              size="lg"
              colorScheme="green"
              leftIcon={<CheckCircle />}
              flex={1}
              onClick={onOpen}
            >
              Update Status
            </Button>
            <Button
              size="lg"
              colorScheme="red"
              variant="outline"
              leftIcon={<XCircle />}
            >
              Report Issue
            </Button>
          </HStack>
        </VStack>

        {/* Status Update Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Delivery Status</ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                {steps.map((step, index) => (
                  <Button
                    key={index}
                    w="full"
                    onClick={() => handleStatusUpdate(step.title.toLowerCase())}
                    isDisabled={index < currentStep}
                  >
                    {step.title}
                  </Button>
                ))}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
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

export default TaskDetails;