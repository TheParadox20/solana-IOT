//perform transactions, view transaction history, view wallet balance, view wallet address.
import { useEffect,useState } from "react"
import {Message} from "../Popups"
export default function Wallet({socket}){
    let [balance, setBalance] = useState(0)
    let [amount, setAmount] = useState(null)
    let [address, setAddress] = useState('')
    let [newMessage, setNewMessage] = useState(false)
    let [message, setMessage] = useState('')
    let [messageType,setMessageType] = useState('')

    socket.onmessage = (e) => {
        console.log('From wallet component: ',e.data);
        let data = JSON.parse(e.data)
        if(data.type === 'update'){
            if(data.status === 'success') setMessageType('success')
            if(data.type === 'error') setMessageType('error')
        }
        setMessage(data.message)
        setNewMessage(true)
    }

    let sendTransaction = (e) => {
        e.preventDefault()
        socket.send(JSON.stringify({
            type: 'transact',
            address: address,
            amount: amount,
            username: localStorage.getItem('username')
        }))
        setMessageType('warning')
        setMessage('Transaction processing...')
        setNewMessage(true)
    }

    return (
        <div class="p-4 rounded-lg dark:border-gray-700 mt-14">
            {newMessage && <Message type={messageType} message={message} close={()=>{setNewMessage(false)}} />}
            <h3 className="text-3xl font-bold my-8">Transact</h3>
            <form className="flex flex-col w-10/12 lg:w-[30%] mx-auto justify-center">
                <form className="space-y-6" action="#" method="POST">
                    <div>
                    <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                        To: Address
                    </label>
                    <div className="mt-2">
                        <input
                        id="address"
                        name="address"
                        required
                        placeholder="address(0xfff)" value={address} onChange={event=>setAddress(event.target.value)}
                        className=" pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-400 sm:text-sm sm:leading-6"
                        />
                    </div>
                    </div>
                    <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                        Amount
                        </label>
                    </div>
                    <div className="mt-2">
                        <input
                        id="number"
                        name="number"
                        placeholder="0.1 SOL" value={amount} onChange={event=>setAmount(event.target.value)}
                        className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-400 sm:text-sm sm:leading-6"
                        />
                    </div>
                    </div>

                    <div>
                    <button onClick={e=>sendTransaction(e)} className="flex w-full justify-center rounded-md bg-green-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400">
                        Send
                    </button>
                    </div>
                </form>
            </form>
            <div className="h-40 md:h-72"></div>
        </div>
    )
}
