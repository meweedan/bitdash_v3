import { io } from 'socket.io-client';

export const initSocket = () => {
  const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
    path: '/socket.io',
    transports: ['websocket'],
    auth: {
      token: localStorage.getItem('token')
    }
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};