// utils/websocket.utils.js
import { Server } from 'socket.io';
let io;

const initializeWebSocket = (server) => {
    io = new Server(server);
    
    io.on('connection', (socket) => {
        console.log('Client connected');
        
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

const emitOrderbookUpdate = (coinPair) => {
    if (io) {
        io.emit('orderbook-update', { coinPair });
    }
};

export { initializeWebSocket, emitOrderbookUpdate };