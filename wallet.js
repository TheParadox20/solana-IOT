import * as web3 from "@solana/web3.js";
import bs58 from 'bs58'

let connection = new web3.Connection("https://api.devnet.solana.com", "confirmed");

let senderWallet = web3.Keypair.fromSecretKey(bs58.decode("3Xaan3iCA6iGGmGcAs9zcs2ikoNZzbuJepuFZFV85afQy7ruC12y2cnY45CpPqCHeMdjUvZPovxjvEXZ9SkKTNMF"));
console.log('Sender Address : ',senderWallet.publicKey.toBase58());
let receiverWallet = web3.Keypair.fromSecretKey(bs58.decode("2w6EW3B2dCPUUpEGLrtBhqGMEsGzaL9vYZH5NgPEEJ25D7QJffRPJ7K9T36M3q1FHkCm4FzysWusCNQXGDMRumj3"));
console.log('Receiver Address : ',receiverWallet.publicKey.toBase58());

//get user balance
async function getUserBalance(address) {
    let balance = await connection.getBalance(new web3.PublicKey(address));
    console.log('Balance : ',balance, 'LAMPORTS');
    return balance;
}
export {getUserBalance};
