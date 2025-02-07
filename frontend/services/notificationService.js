// services/notificationService.js
export const requestNotificationPermission = async () => {
  if (typeof window === 'undefined') return false;
  
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  try {
    // First, try to register service worker if not already registered
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        await navigator.serviceWorker.register('/sw.js');
      }
    }

    // Then request notification permission
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error setting up notifications:', error);
    return false;
  }
};

export const sendNotification = async (title, options = {}) => {
  if (typeof window === 'undefined') return;
  if (!('Notification' in window)) return;
  
  try {
    // Check if we have permission
    if (Notification.permission !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }

    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;
    
    // Show notification
    await registration.showNotification(title, {
      icon: '/app-logo.png',
      badge: '/app-logo.png',
      vibrate: [200, 100, 200],
      requireInteraction: true, // Keep notification until user interacts
      ...options,
      data: {
        url: window.location.origin + (options.url || ''),
        ...options.data
      }
    });
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};