import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  Button 
} from "@chakra-ui/react";
import { QRCodeCanvas } from "qrcode.react";
import { useMutation } from '@tanstack/react-query';

const QRCodeModal = ({ 
  merchantData, 
  customColors = null,
  showLogo = true,
  showName = true
}) => {
  const [qrCodeData, setQRCodeData] = useState(null);
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');

  // Ensure environment variables are defined
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!frontendUrl || !backendUrl) {
    console.error('Missing environment variables');
    return null;
  }

  const generateQRCode = useMutation({
    mutationFn: async (data) => {
      // Retrieve token safely
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      // Validate merchant data
      if (!merchantData || !merchantData.id) {
        throw new Error('Invalid merchant information');
      }

      try {
        const response = await fetch(
          `${backendUrl}/api/payment-links`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              data: {
                amount: parseFloat(data.amount),
                currency: 'LYD',
                merchant: merchantData.id,
                status: 'active',
                payment_type: 'fixed',
                pin: data.pin,
                link_id: `QR${Date.now()}${Math.random().toString(36).substr(2, 4)}`.toUpperCase()
              }
            })
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to generate QR code');
        }

        return response.json();
      } catch (error) {
        console.error('QR Generation Error:', error);
        throw new Error(error.message || 'Failed to generate QR code');
      }
    },
    onSuccess: (data) => {
      setQRCodeData(data.data);
    },
    onError: (error) => {
      console.error('Payment link creation error:', error);
    }
  });

  const handleGenerate = () => {
    if (!amount || !pin) {
      alert('Please enter both amount and PIN');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }

    if (pin.length !== 6 || isNaN(pin)) {
      alert('PIN must be 6 digits');
      return;
    }

    generateQRCode.mutate({ amount, pin });
  };

  return (
    <Box 
      id="payment-qr-card" 
      width="85.60mm" 
      height="53.98mm"
    >
      <VStack spacing={4}>
        {!qrCodeData ? (
          <VStack spacing={4}>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter 6-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={6}
            />
            <Button
              colorScheme="blue"
              onClick={handleGenerate}
              isLoading={generateQRCode.isLoading}
            >
              Generate QR Code
            </Button>
          </VStack>
        ) : (
          <VStack spacing={4} align="center">
            <QRCodeCanvas
              value={`${frontendUrl}/${qrCodeData.attributes.link_id}`}
              size={200}
              level="H"
              bgColor={customColors?.qrBackground || 'white'}
              fgColor={customColors?.qrForeground || '#1179be'}
            />
            <Text fontSize="xl" fontWeight="bold">
              {parseFloat(qrCodeData.attributes.amount).toLocaleString()} LYD
            </Text>
            <Text fontSize="sm" color="gray.500">
              Payment ID: {qrCodeData.attributes.link_id}
            </Text>
            <Button
              variant="outline"
              onClick={() => {
                setQRCodeData(null);
                setAmount('');
                setPin('');
              }}
            >
              Generate New Code
            </Button>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default QRCodeModal;