import WebSocket from 'ws';
import { Server as HTTPServer } from 'http';
import express from 'express';

export function setupWebSocket(existingServer) {
  const wss = new WebSocket.Server({ server: existingServer });

  // Keep track of all connected clients
  const clients = new Set();

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected, total clients:', clients.size);

    ws.on('close', () => {
      clients.delete(ws);
      console.log('Client disconnected, total clients:', clients.size);
    });
  });

  // Function to broadcast trade to all connected clients
  const broadcastTrade = (trade) => {
    const message = JSON.stringify(trade);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // Modify the createTradeRecord function in OrderMatchingService
  const enhancedCreateTradeRecord = async (trade, session) => {
    console.log('Trade executed:', trade);
    
    broadcastTrade({
      type: trade.buyOrderId ? 'BUY' : 'SELL',
      price: trade.price,
      amount: trade.amount,
      buyOrderId: trade.buyOrderId,
      sellOrderId: trade.sellOrderId,
      timestamp: trade.timestamp,
      coinPair: trade.coinPair
    });
  };

  return {
    broadcastTrade,
    enhancedCreateTradeRecord
  };
}