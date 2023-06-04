import express, { response } from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import {getUserBalance, transact, createWallet, verifyPrivateKey} from './wallet.js';
import WebSocket from 'ws';
import http from 'http';
import mysql from 'mysql';
import bodyParser from 'body-parser';

// var con = mysql.createConnection({
//     host: "127.0.0.1",
//     user: "sammy",
//     password: "sammy",
//     database: "solana"
// });
let con = mysql.createConnection({
    host:"eporqep6b4b8ql12.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user:"g69oj8qro3rtnqj1",
    password:"aeosrm4kqv9akf96",
    database:"m7ukhlpb3u1u4yjb"
});
//CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), email VARCHAR(255), password VARCHAR(64) NOT NULL, private_key VARCHAR(128), address VARCHAR(42));
//CREATE TABLE cards (id INT PRIMARY KEY, card VARCHAR(255), description VARCHAR(255), user VARCHAR(255));
//CREATE TABLE transactions (id INT AUTO_INCREMENT PRIMARY KEY, sender VARCHAR(255), receiver VARCHAR(255), amount INT, signature VARCHAR(255),time TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
//CREATE TABLE stations (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255));
con.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
});
let users = {"janedoe":{
    wallet: null,
    client: null,
    userID: 1
}};
let clients = [];

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port =  process.env.PORT || 80;

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
    res.send('Hello World\n');
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
                    client: null,
                    userID: result[0].id
                };
                res.send(JSON.stringify({
                    status: 'success',
                    address: users[req.body.username].wallet.publicKey.toBase58(),
                    message: 'Wallet Created',
                    username: req.body.username,
                    email: result[0].email
                }))
            }else{
                res.send(JSON.stringify({
                    status: 'success',
                    message: 'Login Successful',
                    username: req.body.username,
                    email: result[0].email
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
    if(req.body.pk=='' || verifyPrivateKey(req.body.pk)){
        con.query(`INSERT INTO users (username, email, password, private_key) VALUES ("${req.body.username}", "${req.body.email}","${req.body.password}", "${req.body.pk}")`, function (err, result) {
            if (err) throw err;
            res.send(JSON.stringify({
                status: 'success',
                message: 'Signup Successful'
            }))
        });
        console.log('signup flow completed');
    }else{
        res.send(JSON.stringify({
            status: 'failed',
            message: 'Invalid Private Key'
        }))
    }
});
app.get('/balance',(req,res)=>{
    console.log(req.query);
    getUserBalance(req.query.address).then((balance)=>{
        res.send(`{"balance":${balance}}`);
    });
});
app.get('/transact',async (req,res)=>{//transaction request from base station
    console.log('Transact parameters: ',req.query);
    //get station from table
    let station = {}
    con.query(`SELECT * FROM stations  WHERE id='${req.query.station}'`, function (err, result) {
        if (err) throw err;
        if(result.length > 0){
            station = (result[0]);
        }
        else console.log('{"status":"Failed","message":"Station not registered"}')
    })
    //wait for client to respond if positive wait for transaction to complete if negative send failed
    await new Promise((resolve,reject)=>{
        let username = '';
        con.query(`SELECT user FROM cards  WHERE id='${req.query.rfid}'`, function (err, result) {
            if (err) throw err;
            if(result.length > 0){//check if rfid is registered
                username = result[0].user;
                console.log(username);
                if(users[username] && users[username].client){//check if user is online
                    users[username].client.send(JSON.stringify({//send transaction request to user
                        type: 'transact',
                        amount: req.query.amount,
                        address: station.address,
                        message: `Transaction of ${req.query.amount} SOL to ${station.name}`
                    }));
                    users[username].client.on('message',(message)=>{
                        let msg = JSON.parse(message);
                        if(msg.type == 'authorize') if(msg.data.status==='deny') reject('{"status":"Failed","message":"Transaction Denied"}');
                        resolve(msg);
                    });
                    setTimeout(()=>{
                        reject('{"status":"Failed","message":"user not responding"}');
                    },10000);
                }
                else reject('{"status":"Failed","message":"user not online"}')
            }
            else reject('{"status":"Failed","message":"RFID not registered"}')
        });
    })
    .then((msg)=>{
        if(msg.type == 'authorize'){
            if(msg.data.status==='accept'){
                transact(msg.data.amount,msg.data.address,users[msg.data.username].wallet).then((signature)=>{
                    let confirmation = JSON.stringify({
                        type: 'update',
                        status: 'success',
                        message: {
                            text: `Transaction Successful`,
                            signature: signature
                        },
                    })
                    users[msg.data.username].client.send(confirmation);
                    res.send(confirmation);
                    console.log('confirmation sent');
                });
            }
        }
    })
    .catch((err)=>{
        console.log('From catch',err);
        res.send(err);
    });

});
//add card to user
app.get('/addcard',(req,res)=>{
    console.log(req.query);
    con.query(`INSERT INTO cards (id,user,card,description) VALUES (${req.query.id},"${req.query.user}","${req.query.card}","${req.query.desc}")`, function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify({
            status: 'success',
            message: 'Card Added'
        }))
    });
})
//get cards
app.get('/getcards',(req,res)=>{
    con.query(`SELECT * FROM cards  WHERE user='${req.query.user}'`, function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify({
            status: 'success',
            data: result
        }))
    });
})
//delete card
app.get('/deletecard',(req,res)=>{
    con.query(`DELETE FROM cards WHERE id=${req.query.card}`, function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify({
            status: 'success',
            message: 'Card Deleted'
        }))
    });
})

// Event handler for connection
wss.on('connection', (ws) => {
    console.log('Client connected');
    // Event handler for receiving messages
    ws.on('message', (message) => {
        let msg = JSON.parse(message);
        if(msg.type == 'setup'){
            users[msg.data.username].client = ws;
        }
        else if(msg.type == 'transact'){//transaction initiated by user
            if(users[msg.username].client == ws){
                transact(msg.amount,msg.address,users[msg.username].wallet).then((signature)=>{
                    users[msg.username].client.send(JSON.stringify({
                        type: 'update',
                        status: 'success',
                        message: {
                            text: `Transaction Successful`,
                            signature: signature
                        },
                    }));
                });
            }else{
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Invalid User'
                }));
            }
        }
        else if(msg.type == 'ping'){//respond to user ping
            console.log('ping');
            ws.send(JSON.stringify({
                type: 'pong'
            }));
        }
        else if(msg.type == 'logout'){
            delete users[msg.data.username];
        }
      console.log(`Received message: ${message}`);
    });
  
    // Event handler for disconnection
    ws.on('close', () => {
      console.log('Client disconnected');
      clients.splice(clients.indexOf(ws),1);
    });
});