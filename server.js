import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import {getUserBalance} from './wallet.js';
import WebSocket from 'ws';
import http from 'http';

const app = express();
app.use(cors());
const port =  process.env.PORT || 3000;

// sendFile will go here
let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname,'frontend', 'dist')));

let server = http.createServer(app);
server.listen(port,()=>{
    console.log('Server started at http://localhost:' + port);
});
app.get('/test',(req,res)=>{
    console.log(req.query);
    res.send('Hello World');
});
app.get('/balance',(req,res)=>{
    console.log(req.query);
    getUserBalance(req.query.address).then((balance)=>{
        res.send(`{"balance":${balance}}`);
    });
});

//Websocket
let wss = new WebSocket.Server({server});
// Event handler for connection
wss.on('connection', (ws) => {
    console.log('Client connected');
  
    // Event handler for receiving messages
    ws.on('message', (message) => {
      console.log(`Received message: ${message}`);
  
      // Send a response back to the client
      ws.send(`Server received: ${message}`);
    });
  
    // Event handler for disconnection
    ws.on('close', () => {
      console.log('Client disconnected');
    });
});