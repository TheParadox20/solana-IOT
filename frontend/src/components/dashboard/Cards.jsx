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
            <h3 className="text-xl font-bold my-2">Your cards</h3>

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

            <h3 className="text-xl font-bold my-4">Add card</h3>
            <form className="flex flex-col w-10/12 lg:w-1/3 mx-auto justify-center">
                <label className="my-2 block text-sm font-medium leading-6 text-gray-900" htmlFor="card">Card UID</label>
                <input className="my-2 pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-400 sm:text-sm sm:leading-6" type="text" name="card" id="card" placeholder="12341234" value={card} onChange={event=>setCard(event.target.value)}/>
                <label className="my-2 block text-sm font-medium leading-6 text-gray-900" htmlFor="name">Card Name</label>
                <input className="my-2 pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-400 sm:text-sm sm:leading-6" type="name" name="name" id="name" placeholder="Parking lot" value={cardName} onChange={event=>setCardName(event.target.value)}/>
                <label className="my-2 block text-sm font-medium leading-6 text-gray-900" htmlFor="desc">Description</label>
                <input className="my-2 pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-400 sm:text-sm sm:leading-6" type="text" name="desc" id="desc" placeholder="Work parking space" value={description} onChange={event=>setDescription(event.target.value)}/>
                <button className="flex w-full justify-center rounded-md bg-green-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 my-8" onClick={e=>addCard(e)}>Add</button>
            </form>
        </div>
    )
}