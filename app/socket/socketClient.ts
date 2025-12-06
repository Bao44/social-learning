import { io } from 'socket.io-client';

let socket: any = null;

export const getSocket = () => {
  if (!socket) {
    // socket = io('http://10.0.2.2:5000', {
    socket = io('https://api.socialonlinelearning.tech', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};
