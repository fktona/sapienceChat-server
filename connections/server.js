import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { AIChat } from '../llm/setup.js';
import db from '../models/index.js';

const File = db.File;

export const liveServer = async ( slug) => {
    if(slug == '') {
        return;
    }
    const server = createServer();
//   const {fileId, filename} = await File.findOne({ slug });
    const wss = new WebSocketServer({ noServer: true });



    wss.on('connection', (ws) => {
            console.log('WebSocket connected');
      
        let chatting = true;
        
        const sendMessage = (message) => {
            ws.send(message + '\n\n');
        };
        sendMessage(`Hi, I am Jinx. You can ask me anything about ${filename}. \nI'll do my best to provide an answer.`);

        
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
                        const chatResponse = await AIChat(prompt,'1q3dIBd7vWV9Ggxfb7J8dSKLNdkEFb8Kp');
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

    
    // process.on('SIGINT', () => {
    //     console.log('Server shutting down...');
    //     wss.close(() => {
    //         console.log('Server closed');
    //         process.exit(0);
    //     });
    // });

    // console.log('WebSocket server listening on port 3001');
};