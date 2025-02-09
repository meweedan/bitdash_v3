import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ComparisonChart = () => {
  const data = [
    {
      name: 'Order Time',
      Traditional: 12,
      BitFood: 2,
    },
    {
      name: 'Error Rate',
      Traditional: 15,
      BitFood: 0.1,
    },
    {
      name: 'Staff Cost',
      Traditional: 100,
      BitFood: 40,
    },
    {
      name: 'Customer Satisfaction',
      Traditional: 75,
      BitFood: 98,
    }
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar 
          dataKey="Traditional" 
          fill="#FDA4AF" 
          name="Traditional System"
          animationBegin={0}
          animationDuration={2000}
        />
        <Bar 
          dataKey="BitFood" 
          fill="#60A5FA" 
          name="BitFood"
          animationBegin={1000}
          animationDuration={2000}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};