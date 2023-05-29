import { useState } from 'react'
import Header from './components/Header';
import Services from './components/Services';


export default function App() {
  const [count, setCount] = useState(0)
  // fetch('https://solana-iot.herokuapp.com/balance?address=G5ySUnvRthoersCZZqkZwWPWn9JvHSqFoocsJivgUzyT').then(res => res.json()).then(data => console.log(data))

  return (
    <div className='container mx-auto text-center'>
      <Header/>
      <Services/>
    </div>
  )
}
