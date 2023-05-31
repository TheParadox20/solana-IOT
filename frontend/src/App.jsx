import { useState,useEffect } from 'react'
import { initFlowbite } from 'flowbite'
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';


export default function App() {
  const [count, setCount] = useState(0)
  // fetch('https://solana-iot.herokuapp.com/balance?address=G5ySUnvRthoersCZZqkZwWPWn9JvHSqFoocsJivgUzyT').then(res => res.json()).then(data => console.log(data))
  useEffect(() => {
    initFlowbite();
  }, [])

  return (
    <div className='container mx-auto text-center'>
      <Header/>
      <Body/>
      <Footer/>
    </div>
  )
}
