// components/pay/QRCodeGenerator.js
import { Text } from "@chakra-ui/react";
import { QRCodeCanvas } from 'qrcode.react';

const QRCodeGenerator = ({ 
  amount,
  merchantId,
  description,
  customColors = null,
  showLogo = true
}) => {
  const [paymentLink, setPaymentLink] = useState(null);
  const qrValue = paymentLink ? 
    `${process.env.NEXT_PUBLIC_FRONTEND_URL}/cash/${paymentLink.attributes.link_id}` : '';

  // Create payment link mutation
  const createPaymentLink = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-links`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            data: {
              amount: parseFloat(data.amount),
              currency: 'LYD',
              description: data.description,
              merchant: data.merchantId,
              status: 'active',
              payment_type: 'fixed',
              link_id: `M${Date.now()}${Math.random().toString(36).substr(2, 4)}`.toUpperCase()
            }
          })
        }
      );
      if (!response.ok) throw new Error('Failed to create payment link');
      return response.json();
    },
    onSuccess: (data) => {
      setPaymentLink(data.data);
    }
  });

  return (
    <Box id="payment-qr-card" width="85.60mm" height="53.98mm">
      <VStack spacing={4}>
        {paymentLink ? (
          <Box
            bg={customColors?.background || 'white'}
            p={4}
            borderRadius="lg"
            boxShadow="lg"
            width="full"
          >
            <QRCodeCanvas
              value={qrValue}
              size={180}
              level="H"
              bgColor={customColors?.qrBackground || 'white'}
              fgColor={customColors?.qrForeground || '#1179be'}
            />
            <Text mt={2} textAlign="center" fontWeight="bold">
              {amount} LYD
            </Text>
          </Box>
        ) : (
          <Button
            colorScheme="blue"
            onClick={() => createPaymentLink.mutate({
              amount,
              merchantId,
              description
            })}
            isLoading={createPaymentLink.isLoading}
          >
            Generate Payment QR
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default QRCodeGenerator;