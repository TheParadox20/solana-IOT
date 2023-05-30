//perform transactions, view transaction history, view wallet balance, view wallet address.
import { useEffect,useState } from "react"
import Popup,{Message} from "../Popups"
import { render } from "react-dom"
export default function Wallet({socket}){
    let [balance, setBalance] = useState(0)
    let [amount, setAmount] = useState(0)
    let [address, setAddress] = useState('')
    let [newMessage, setNewMessage] = useState(false)
    let [message, setMessage] = useState('')
    let {messageType,setMessageType} = useState('')

    socket.onmessage = (e) => {
        console.log('From wallet component: ',e.data);
        let data = JSON.parse(e.data)
        if(data.type === 'error') render(<Message type='error' message={error} />)
        if(data.type === 'update'){
            if(data.status === 'success') render(<Message type='success' message={data.message} />)
        }
    }

    let sendTransaction = (e) => {
        e.preventDefault()
        socket.send(JSON.stringify({
            type: 'transact',
            address: address,
            amount: amount,
            username: localStorage.getItem('username')
        }))
        render(<Message type='warning' message='Transaction processing...' />)
    }

    return (
        <div class="p-4 rounded-lg dark:border-gray-700 mt-14">
            {newMessage && <Message type={messageType} message={message} />}
            <h3>Wallet Page</h3>
            <form>
                <input type="text" placeholder="Enter address" value={address} onChange={(e)=>setAddress(e.target.value)} />
                <input type="number" placeholder="Enter amount" value={amount} onChange={(e)=>setAmount(e.target.value)} />
                <button onClick={e=>sendTransaction(e)}>Send</button>
            </form>
        </div>
    )
}
