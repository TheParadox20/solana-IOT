import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import {getUserBalance,transact,createWallet} from './wallet.js';
import WebSocket from 'ws';
import http from 'http';
import mysql from 'mysql';
import bodyParser from 'body-parser';

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "solana"
});
//create users table
//CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), email VARCHAR(255), password VARCHAR(64) NOT NULL, private_key VARCHAR(128), address VARCHAR(42), card VARCHAR(8));
con.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
});
let users = {"id1":{
    wallet: null,
    client: null
}};
let clients = [];

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port =  process.env.PORT || 3000;

// sendFile will go here
let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname,'frontend', 'dist')));

let server = http.createServer(app);
//Websocket
let wss = new WebSocket.Server({server});
//start server
server.listen(port,()=>{
    console.log('Server started at http://localhost:' + port);
});
app.get('/test',(req,res)=>{
    console.log(req.query);
    res.send('Hello World');
});
app.post('/login',(req,res)=>{
    //check is username and password is correct
    con.query(`SELECT * FROM users  WHERE username='${req.body.username}' AND password='${req.body.password}'`, function (err, result) {
        if (err) throw err;
        if(result.length > 0){
            //create wallet
            if(result[0].private_key != ""){
                users[req.body.username] = {
                    wallet: createWallet(result[0].private_key),
                    client: null
                };
                res.send(JSON.stringify({
                    status: 'success',
                    address: users[req.body.username].wallet.publicKey.toBase58(),
                    message: 'Wallet Created',
                    username: req.body.username
                }))
            }else{
                res.send(JSON.stringify({
                    status: 'success',
                    message: 'Login Successful',
                    username: req.body.username,
                }))
            }
        }
        else res.send(JSON.stringify({
            status: 'error',
            message: 'Invalid Username or Password'
        }))
        
    });
    console.log('login flow completed');
});
app.post('/signup',(req,res)=>{
    //insert into users table
    con.query(`INSERT INTO users (username, email, password, private_key) VALUES ("${req.body.username}", "${req.body.email}","${req.body.password}", "${req.body.pk}")`, function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify({
            status: 'success',
            message: 'Signup Successful'
        }))
    });
    console.log('signup flow completed');
});
app.get('/balance',(req,res)=>{
    console.log(req.query);
    getUserBalance(req.query.address).then((balance)=>{
        res.send(`{"balance":${balance}}`);
    });
});
app.get('/transact',async (req,res)=>{//transaction request from base station
    console.log(req.query);
    let clientResponse = async (client)=>{
        return new Promise((resolve,reject)=>{
            client.on('message', (message) => {
                msg = JSON.parse(message);
                if(msg.type == 'update'){
                    resolve(msg.status);
                }else{
                    reject('failed');
                }
            });
        });
    }
    con.query(`SELECT username FROM users  WHERE rfid='${req.query.rfid}'`, function (err, result) {
        if (err) throw err;
        if(result.length > 0){
            if(users[result[0].username]){//send transaction request to user
                users[result[0].username].client.send(`{"type":"notification","amount":${req.query.amount},"address":"${req.query.address}"}`);
                res.send(
                    clientResponse(users[result[0].username].client).then((status)=>{
                        return `{"status":"${status}","message":"Transaction ${status}"}`
                    })
                )
            }
            else res.send('{"status":"Failed","message":"user not online"}');
        }
        else res.send('{"status":"Failed","message":"RFID not registered"}')
    });
});
//add card to user
app.get('/addcard',(req,res)=>{
    console.log(req.query);
    con.query(`UPDATE users SET card='${req.query.card}' WHERE username='${req.query.username}'`, function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify({
            status: 'success',
            message: 'Card Added'
        }))
    });
})

// Event handler for connection
wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.push(ws);
    console.log(clients.length);

    // Event handler for receiving messages
    ws.on('message', (message) => {
        let msg = JSON.parse(message);
        if(msg.type == 'setup'){
            users[msg.data.username].client = ws;
        }
        else if(msg.type == 'transact'){//transaction initiated by user
            if(users[msg.username].client == ws){
                transact(msg.amount,msg.address,users[msg.username].wallet).then((signature)=>{
                    users[msg.username].client.send(`{"type":"status","signature":"${signature}","status":"success"}`);
                });
            }else{
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Invalid User'
                }));
            }
        }
        else if(msg.type == 'logout'){
            delete users[msg.username];
        }
      console.log(`Received message: ${message}`);

      // Send a response back to the client
      ws.send(`Server received: ${message}`);
    });
  
    // Event handler for disconnection
    ws.on('close', () => {
      console.log('Client disconnected');
      clients.splice(clients.indexOf(ws),1);
    });
});