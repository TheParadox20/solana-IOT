import { useState } from 'react'
import {Progress, Button, Spinner} from 'flowbite-react'

export default function App() {
  const [count, setCount] = useState(0)
  fetch('http://localhost:8081/balance?address=G5ySUnvRthoersCZZqkZwWPWn9JvHSqFoocsJivgUzyT').then(res => res.json()).then(data => console.log(data))

  return (
    <div className='container mx-auto text-center'>
      Hello World
    </div>
  )
}
