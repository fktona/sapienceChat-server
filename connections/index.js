import { WebSocketServer } from 'ws';
import { AIChat } from '../llm/setup.js';
import db from '../models/index.js';

const File = db.File;
const webSocketServers = {}; // To keep track of WebSocket servers by customerId

export const initializeLiveServer = (server) => {
  server.on('upgrade', (request, socket, head) => {
    console.log('WebSocket upgrade request:', request.url);
    const urlParts = request.url.split('/');
    console.log('urlParts:', urlParts); 
    const customerId = urlParts[1];

    if (webSocketServers[customerId]) {
      webSocketServers[customerId].handleUpgrade(request, socket, head, (ws) => {
        webSocketServers[customerId].emit('connection', ws, request);
        console.log('WebSocket connected');
      });
    } else {
        console.log('WebSocket server not found for customerId:', customerId);
      socket.destroy();
    }
  });
};

export const startLiveServer = async (customerId) => {
  if (!customerId) {
    throw new Error('customerId is required to start a WebSocket server.');
  }

  if (webSocketServers[customerId]) {
    console.log(`WebSocket server already running for customerId: ${customerId}`);
    return;
  }

//   const file = await File.findOne({ customerId });
//   if (!file) {
//     throw new Error('File not found');
//   }

 // const { filename } = file;
  const wss = new WebSocketServer({ noServer: true });

  webSocketServers[customerId] = wss;

  wss.on('connection', (ws) => {
    let chatting = true;

    const sendMessage = (message) => {
      ws.send(message + '\n\n');
    };

    sendMessage(`Hi, I am Jinx. You can ask me anything about . \nI'll do my best to provide an answer.`);

    ws.on('message', async (data) => {
      const prompt = data.toString().trim();

      if (prompt === '/stop') {
        sendMessage('See you later...');
        sendMessage('Type /start to resume chatting...');
        chatting = false;
      } else if (prompt === '/start') {
        chatting = true;
        sendMessage('Welcome back');
      } else {
        if (chatting) {
          try {
            sendMessage('\nJinx typing...');
            const chatResponse = await AIChat(prompt, '1q3dIBd7vWV9Ggxfb7J8dSKLNdkEFb8Kp');
            sendMessage(chatResponse);
          } catch (error) {
            console.error('Error processing AI chat:', error);
            sendMessage('Error processing AI chat');
          }
        } else {
          sendMessage('Type /start to resume chatting...');
        }
      }
    });

    ws.on('close', () => {
      console.log('WebSocket closed');
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err);
    });
  });

  webSocketServers[customerId] = wss;
  console.log(`WebSocket server initialized for customerId: ${customerId}`);
};
