import { useRouter } from "next/router";
import { useState, useEffect} from "react";
import Link from 'next/link';

function Header() {
  const router = useRouter();
  const [username, setUsername] = useState("")

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("token")
    window.localStorage.removeItem("username")
    window.location = "/"
  }
  
  
  useEffect(() => {
    setUsername(window.localStorage.getItem("username"));
  }, [])

  

  return (
    <div>
      <section className="header-section wf-section">
        <img className='logo-div' src="/CB_logo.png" alt='code buddy logo'/>
        <div className="nav-btn-div">
          <Link href="#">
            <div className="header-nav-buttons w-button">What is codebuddy?</div>
          </Link>
          <Link href="#">
            <div className="header-nav-buttons w-button">Become a buddy</div>
          </Link>
          <Link href="/event/calendar">
            <div className="header-nav-buttons w-button">Calendar of Events</div>
          </Link>
          {!username &&<Link href="/user/login">
            <div className="header-nav-buttons button-right w-button">Signup / Login</div>
          </Link>}
          {username && <Link href="/">
            <div className="header-nav-buttons button-right w-button" onClick={handleLogout}>Log Out</div>
          </Link>}
        </div>
      </section>
    </div>
  )
  }
  
  export default Header;