// components/pay/merchant/CreatePaymentRequest.js
const CreatePaymentRequest = () => {
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const queryClient = useQueryClient();

  const createPayment = useMutation({
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
              merchant: data.merchantId,
              status: 'active',
              pin: data.pin
            }
          })
        }
      );
      if (!response.ok) throw new Error('Failed to create payment request');
      return response.json();
    }
  });

  return (
    <VStack spacing={4}>
      <Input 
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Input 
        type="password"
        placeholder="Your PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />
      <QRCode value={`bitpay://payment/${paymentData.id}`} />
    </VStack>
  );
};

export default CreatePaymentRequest;