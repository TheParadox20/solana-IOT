//add new rfid card, delete rfid card, edit rfid card, view rfid card, view rfid card history.
import { useState,useEffect } from "react"
import {baseURL} from '../../data.json'

export default function Cards(){
    let [card, setCard] = useState([])
    let [cardName, setCardName] = useState('')
    let [description, setDescription] = useState('')
    let [cards,  setCards] = useState([
        {
          "id": 12341235,
          "card": "toll",
          "description": "use in toll station",
          "user": "sammy"
        }
      ])

    useEffect(()=>{
        fetch(`${baseURL}/getcards?user=${localStorage.getItem('username')}`).then(res => res.json()).then(data => {
            if(data.status==='success') setCards(data.data)
        }).catch(err => console.log(err));
        console.log(cards)
    },[])

    let addCard = (e) => {
        e.preventDefault()
        console.log('add card')
        fetch(`${baseURL}/addcard?user=${localStorage.getItem('username')}&card=${cardName}}&id=${card}&desc=${description}`).then(res => res.json()).then(data => {})
    }
    return (
        <div class="p-4 rounded-lg dark:border-gray-700 mt-14">
            <h3>Your cards</h3>

            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                UID
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Description
                            </th>
                            <th scope="col" class="px-6 py-3">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            cards.map((card, index) => {
                                <tr key={index} class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                    {console.log('from map :: ',card.id)}
                                    <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {card.id}
                                    </td>
                                    <td class="px-6 py-4">
                                        {card.card}
                                    </td>
                                    <td class="px-6 py-4">
                                        {card.description}
                                    </td>
                                    <td class="px-6 py-4">
                                        <button class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>

            <h3>Add card</h3>
            <form className="flex flex-col w-10/12 md:w-1/3 mx-auto justify-center">
                <label className="block my-2 rounded-sm pl-4" htmlFor="card">Card UID</label>
                <input className="block my-4 h-12 rounded-sm pl-4" type="text" name="card" id="card" placeholder="12341234" value={card} onChange={event=>setCard(event.target.value)}/>
                <label className="block my-2 rounded-sm pl-4" htmlFor="name">Card Name</label>
                <input className="block my-4 h-12 rounded-sm pl-4" type="name" name="name" id="name" placeholder="Parking lot" value={cardName} onChange={event=>setCardName(event.target.value)}/>
                <label className="block my-2 rounded-sm pl-4" htmlFor="desc">Description</label>
                <input className="block my-4 h-12 rounded-sm pl-4" type="text" name="desc" id="desc" placeholder="address(0xfff)" value={description} onChange={event=>setDescription(event.target.value)}/>
                <button className="bg-blue-500 text-white w-3/4 mx-auto py-4 px-4 mt-8 rounded-xl" onClick={e=>addCard(e)}>Add</button>
            </form>
        </div>
    )
}