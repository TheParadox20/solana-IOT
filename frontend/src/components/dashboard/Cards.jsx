//add new rfid card, delete rfid card, edit rfid card, view rfid card, view rfid card history.
import { useState } from "react"
import {baseURL} from '../../data.json'

export default function Cards(){
    let [card, setCard] = useState([])
    let [cardName, setCardName] = useState('')

    let addCard = (e) => {
        e.preventDefault()
        console.log('add card')
        fetch(`${baseURL}/addcard?username=${localStorage.getItem('username')}&cardname=${cardName}}&cardid=${card}`).then(res => res.json()).then(data => {})
    }
    return (
        <div class="p-4 rounded-lg dark:border-gray-700 mt-14">
            <h3>Cards Page</h3>
            <form>
                <input type="text" placeholder="Enter card name" />
                <input type="text" placeholder="Enter card id" />
                <button>Add</button>
            </form>
        </div>
    )
}