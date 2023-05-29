//perform transactions, view transaction history, view wallet balance, view wallet address.
import { useEffect,useState } from "react"
export default function Wallet({socket}){
    let [balance, setBalance] = useState(0)
    let [amount, setAmount] = useState(0)
    let [address, setAddress] = useState('')
    socket.onmessage = (e) => {
        console.log('From wallet component: ',e.data);
        let data = JSON.parse(e.data)
        if(data.type === 'error') alert(data.message)
        if(data.type === 'status') console.log('Status update: ',data.message)
    }

    let sendTransaction = (e) => {
        e.preventDefault()
        socket.send(JSON.stringify({
            type: 'transact',
            address: address,
            amount: amount,
            username: localStorage.getItem('username')
        }))
    }

    return (
        <div>
            <h3>Wallet Page</h3>
            <form>
                <input type="text" placeholder="Enter address" value={address} onChange={(e)=>setAddress(e.target.value)} />
                <input type="number" placeholder="Enter amount" value={amount} onChange={(e)=>setAmount(e.target.value)} />
                <button onClick={e=>sendTransaction(e)}>Send</button>
            </form>
        </div>
    )
}
