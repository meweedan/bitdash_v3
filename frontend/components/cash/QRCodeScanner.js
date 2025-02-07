const QRCodeGenerator = ({ amount, merchantId, description = '', customColors = null }) => {
  const [qrData, setQRData] = useState(null);
  const queryClient = useQueryClient();

  const generatePaymentLink = useMutation({
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
              merchant: data.merchantId,
              description: data.description,
              currency: 'LYD',
              status: 'active',
              payment_type: 'fixed',
              link_id: `PAY${Date.now()}${Math.random().toString(36).substr(2, 4)}`.toUpperCase()
            }
          })
        }
      );
      if (!response.ok) throw new Error('Failed to generate payment link');
      return response.json();
    },
    onSuccess: (data) => {
      setQRData(data.data);
      queryClient.invalidateQueries(['paymentLinks']);
    }
  });

  useEffect(() => {
    if (amount && merchantId) {
      generatePaymentLink.mutate({ amount, merchantId, description });
    }
  }, [amount, merchantId, description]);

  if (!qrData) return null;

  return (
    <Box
      p={4}
      bg={customColors?.background || 'white'}
      borderRadius="lg"
      width="full"
      maxW="300px"
      mx="auto"
    >
      <VStack spacing={4}>
        <QRCode
          value={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/cash/${qrData.attributes.link_id}`}
          size={200}
          level="H"
          bgColor={customColors?.qrBackground || 'white'}
          fgColor={customColors?.qrForeground || 'black'}
        />
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          {amount} LYD
        </Text>
        {description && (
          <Text color="gray.500" textAlign="center">
            {description}
          </Text>
        )}
        <Text fontSize="sm" color="gray.500">
          Payment ID: {qrData.attributes.link_id}
        </Text>
      </VStack>
    </Box>
  );
};

export default QRCodeScanner;