import { useState } from 'react'
import {Progress, Button, Spinner} from 'flowbite-react'
import logo from '/logo.svg'

// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:5000");

// Connection opened
socket.addEventListener("open", (event) => {
  socket.send("Fuck society!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);
});
export default function App() {
  const [count, setCount] = useState(0)
  fetch('https://solana-iot.herokuapp.com/balance?address=G5ySUnvRthoersCZZqkZwWPWn9JvHSqFoocsJivgUzyT').then(res => res.json()).then(data => console.log(data))

  return (
    <div className='container mx-auto text-center'>
      <img className=' min-w-[10%]' src={logo} alt="" />
      Hello World
    </div>
  )
}
