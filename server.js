const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let clients = [];

wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.push(ws);

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });

    // If a client ends the call, notify the other
    if (data.end) {
      clients = clients.filter(client => client !== ws);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients = clients.filter(client => client !== ws);
  });
});

console.log('Signaling server running on ws://localhost:8080');