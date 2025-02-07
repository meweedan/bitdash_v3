// components/ThemedText.js
import { Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';

export function ThemedText({ type, style, ...props }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const textStyle = [
    { color: isDark ? '#fff' : '#000' },
    type === 'title' && styles.title,
    type === 'link' && styles.link,
    style
  ];

  return (
    <Text 
      {...props}
      style={textStyle}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    fontSize: 16,
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
});