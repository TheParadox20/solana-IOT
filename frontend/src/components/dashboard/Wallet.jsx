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
            <form className="flex flex-col w-10/12 md:w-1/3 mx-auto justify-center">
                <label className="block my-2 rounded-sm pl-4" htmlFor="to">To</label>
                <input className="block my-4 h-12 rounded-sm pl-4" type="text" name="to" id="to" placeholder="address(0xfff)" value={address} onChange={event=>setAddress(event.target.value)}/>
                <label className="block my-2 rounded-sm pl-4" htmlFor="amount">Amount</label>
                <input className="block my-4 h-12 rounded-sm pl-4" type="number" name="amount" id="amount" placeholder="0.1 SOL" value={amount} onChange={event=>setAmount(event.target.value)}/>
                <button className="bg-blue-500 text-white w-3/4 mx-auto py-4 px-4 mt-8 rounded-xl" onClick={e=>sendTransaction(e)}>Send</button>
            </form>
        </div>
    )
}
