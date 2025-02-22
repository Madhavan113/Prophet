const socketIO = require('socket.io');
let io;

const initializeWebSocket = (server) => {
  io = socketIO(server);
  
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

module.exports = {
  initializeWebSocket,
  emitOrderbookUpdate
};
