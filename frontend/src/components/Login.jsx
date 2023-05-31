import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {baseURL} from '../data.json'

export default function Login() {
    let [signup, setSignup] = useState(false)
    let [username, setUsername] = useState('')
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    let [key, setKey] = useState('')

    let navigate = useNavigate()

    let login = (e) => {
        e.preventDefault()
        console.log('login')
        fetch(`${baseURL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username:username,
                password:password
            })
        }).then(res => res.json()).then(data => {
            console.log(data)
            if(data.status === 'success'){
                localStorage.setItem('username',data.username)
                localStorage.setItem('email',data.email)
                navigate('/dashboard')
            }else if(data.status === 'error'){
                alert(data.message)
            }
        })
    }
    let signUp = (e) => {
        e.preventDefault()
        console.log('signup')
        fetch(`${baseURL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username:username,
                password:password,
                pk:key,
                email:email
            })
        }).then(res => res.json()).then(data => {
            console.log(data)
            if(data.status === 'success') setSignup(false)
        })
    }
    
    return(
        <div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-24 w-auto"
                    src="/logo.svg"
                    alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" method="POST">
                    <div>
                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                        Username
                    </label>
                    <div className="mt-2">
                        <input
                        id="username"
                        name="username"
                        type="username"
                        autoComplete="username"
                        required
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                        className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-geen-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    </div>

                    {signup && (
                            <div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Email address
                                    </label>
                                    <div className="mt-2">
                                        <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e)=>setEmail(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    </div>

                                    <div>
                                    <label htmlFor="key" className="block text-sm font-medium leading-6 text-gray-900">
                                        Key
                                    </label>
                                    <div className="mt-2">
                                        <input
                                        id="key"
                                        name="key"
                                        type="password"
                                        value={key}
                                        onChange={(e)=>setKey(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    </div>
                                </div>
                    )}

                    <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                        Password
                        </label>
                        <div className="text-sm">
                        <a href="#" className="font-semibold text-green-500 hover:text-green-400">
                            Forgot password?
                        </a>
                        </div>
                    </div>
                    <div className="mt-2">
                        <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    </div>

                    <div>
                    <button
                        onClick={(e)=>signup ? signUp(e) : login(e)}
                        className="flex w-full justify-center rounded-md bg-green-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {signup ? 'Sign up' : 'Sign in'}
                    </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    {signup ? 'Already have an account?' : 'Don\'t have an account?'}
                    <a onClick={(e)=>setSignup(!signup)} className="font-semibold leading-6 text-green-500 hover:text-green-400">
                    {signup ? ' Sign in' : ' Sign up'}
                    </a>
                </p>
                </div>
            </div>
        </div>
    )
}