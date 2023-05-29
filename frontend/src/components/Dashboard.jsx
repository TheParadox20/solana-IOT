import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Home  from './dashboard/Home'
import Cards from "./dashboard/Cards"
import Wallet from "./dashboard/Wallet"
import Settings from "./dashboard/Settings"

let socket = null;
export default function Dashboard(){
    let [page, setPage] = useState('home')
    let navigate = useNavigate()
    //if not logged in, redirect to login page via useEffect
    useEffect(()=>{
        socket = new WebSocket("ws://localhost:3000/");
        //on open send message
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'setup',
                data: {
                    username: localStorage.getItem('username')
                }
            }))
        }
        //on message print message
        socket.onmessage = (e) => {
            console.log(e);
        }
        if(!localStorage.getItem('username')) navigate('/login')
    },[])
    let logout = (e) => {
        e.preventDefault()
        socket.send(JSON.stringify({
            type: 'logout',
            data: {
                username: localStorage.getItem('username')
            }
        }))
        socket.close()
        localStorage.removeItem('username')
        navigate('/')
    }
    
    return(
        <div>
            <header>
                <button onClick={e=>logout(e)}>Logout</button>
            </header>
            <div className="flex">
                <div className="sidebar hidden sm:block w-1/4 bg-gray-200">
                    <button className="block w-full" onClick={e=>setPage('home')}>Home</button>
                    <button className="block w-full" onClick={e=>setPage('wallet')}>Wallet</button>
                    <button className="block w-full" onClick={e=>setPage('cards')}>Cards</button>
                    <button className="block w-full" onClick={e=>setPage('settings')}>Settings</button>
                </div>

                <div className="main w-full">
                    {page === 'home' && <Home />}
                    {page === 'cards' && <Cards />}
                    {page === 'wallet' && <Wallet socket={socket} />}
                    {page === 'settings' && <Settings />}
                </div>
            </div>
        </div>
    )
}