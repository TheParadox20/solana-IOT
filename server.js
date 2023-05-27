import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import {getUserBalance} from './wallet.js';

const app = express();
app.use(cors());
const port =  process.env.PORT || 5001;

// sendFile will go here
let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname,'frontend', 'dist')));

app.listen(port,()=>{
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