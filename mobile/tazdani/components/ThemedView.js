// components/ThemedView.js
import { View } from 'react-native';
import { useColorScheme } from 'react-native';

export function ThemedView(props) {
  const colorScheme = useColorScheme();
  return (
    <View 
      {...props}
      style={[
        { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' },
        props.style
      ]}
    />
  );
}