// components/pay/customer/ProcessPayment.js
const ProcessPayment = ({ paymentId }) => {
  const [pin, setPin] = useState('');
  
  const processPayment = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            data: {
              paymentId: data.paymentId,
              pin: data.pin,
              type: 'transfer',
              status: 'pending'
            }
          })
        }
      );
      if (!response.ok) throw new Error('Payment failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  return (
    <VStack spacing={4}>
      <Text>Amount: {paymentData.amount} LYD</Text>
      <Text>Merchant: {paymentData.merchant.name}</Text>
      <Input 
        type="password"
        placeholder="Enter PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />
      <Button onClick={() => processPayment.mutate({
        paymentId,
        pin
      })}>
        Confirm Payment
      </Button>
    </VStack>
  );
};