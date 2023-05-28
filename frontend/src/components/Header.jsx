import {Navbar, Button} from 'flowbite-react'
import { useNavigate } from 'react-router-dom';
import logo from '/logo.svg'

export default function Header() {
    let navigate = useNavigate();
    return(
        <div>
            <Navbar
                fluid
                rounded
            >
                <Navbar.Brand>
                <img
                    alt="Flowbite Logo"
                    className="mr-3 h-12"
                    src={logo}
                />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                    Sol-IoT
                </span>
                </Navbar.Brand>
                <div className="flex md:order-2">
                <Button className=' bg-[#25c2a0] hover:bg-green-400' onClick={(e)=>navigate('/login')}>
                    Get started
                </Button>
                <Navbar.Toggle />
                </div>
                <Navbar.Collapse>
                <Navbar.Link
                    active
                    href="/navbars"
                >
                    Home
                </Navbar.Link>
                <Navbar.Link href="/navbars">
                    About
                </Navbar.Link>
                <Navbar.Link href="/navbars">
                    Services
                </Navbar.Link>
                <Navbar.Link href="/navbars">
                    Contact
                </Navbar.Link>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}