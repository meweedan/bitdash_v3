import { io } from 'socket.io-client';

class SocketClient {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        auth: {
          token: localStorage.getItem('jwt')
        }
      });

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        this.connected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        this.connected = false;
      });
    }
    return this;
  }

  createOrder(orderData) {
    if (!this.connected) {
      this.connect();
    }
    this.socket.emit('createOrder', orderData);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }
}

export const socketClient = new SocketClient();