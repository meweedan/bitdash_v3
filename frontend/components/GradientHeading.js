import { Heading } from '@chakra-ui/react';

const GradientHeading = ({ children, ...props }) => (
  <Heading
    className="gradient-text"
    bgGradient="linear(to-r, #0a60a3, #67bdfd)"
    bgClip="text"
    css={{
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }}
    {...props}
  >
    {children}
  </Heading>
);

export default GradientHeading;