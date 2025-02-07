import React, { useState, useCallback } from 'react';
import { Animated, StyleSheet } from 'react-native';

export function useToast() {
 const [isVisible, setIsVisible] = useState(false);
 const [message, setMessage] = useState('');
 const [type, setType] = useState('info');
 const opacity = useState(new Animated.Value(0))[0];

 const show = useCallback((message, toastType = 'info', options = {}) => {
   const { duration = 2000 } = options;
   
   setMessage(message);
   setType(toastType);
   setIsVisible(true);

   Animated.sequence([
     Animated.timing(opacity, {
       toValue: 1,
       duration: 300,
       useNativeDriver: true,
     }),
     Animated.delay(duration),
     Animated.timing(opacity, {
       toValue: 0,
       duration: 300,
       useNativeDriver: true,
     }),
   ]).start(() => {
     setIsVisible(false);
   });
 }, [opacity]);

 const Toast = () => {
   if (!isVisible) return null;

   const backgroundColor = 
     type === 'success' ? '#4CAF50' : 
     type === 'error' ? '#f44336' : 
     '#2196F3';

   return (
     <Animated.View 
       style={[
         styles.container, 
         { backgroundColor, opacity }
       ]}
     >
       <Animated.Text style={styles.text}>
         {message}
       </Animated.Text>
     </Animated.View>
   );
 };

 return { show, Toast };
}

const styles = StyleSheet.create({
 container: {
   position: 'absolute',
   bottom: 50,
   left: 20,
   right: 20,
   padding: 15,
   borderRadius: 8,
   alignItems: 'center',
   justifyContent: 'center',
   zIndex: 1000,
 },
 text: {
   color: '#fff',
   fontSize: 14,
   textAlign: 'center',
 },
});