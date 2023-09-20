import { useState, useEffect} from "react";
import Link from 'next/link';

function Header({currentPage}) {
  const [username, setUsername] = useState("")
  const [isBuddy, setIsBuddy] = useState("false")

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("token")
    window.localStorage.removeItem("username")
    window.localStorage.removeItem("isAdmin")
    window.localStorage.removeItem("isBuddy")
    window.localStorage.removeItem("userId")
    window.localStorage.removeItem("loginMethod")
    window.location = "/"
  }
  
  
  useEffect(() => {
    setUsername(window.localStorage.getItem("username"));
    setIsBuddy(JSON.parse(window.localStorage.getItem("isBuddy")));
  }, [])

  

  return (
    <div>
      <section className="header-section wf-section">
        <img className='logo-div' src="/CB_Logo.png" alt='code buddy logo'/>
        <div className="nav-btn-div">
        <Link href="/">
            <div className="header-nav-buttons w-button">Home</div>
          </Link>
          <Link href="#">
            {!username &&<div className="header-nav-buttons w-button">What is codebuddy?</div>}
          </Link>
          <Link href="#">
            {(username && !isBuddy) &&<div className="header-nav-buttons w-button">Become a buddy</div>}
          </Link>
          <Link href="/user/profile">
            {(username && (currentPage !== "User Profile"))&&<div className="header-nav-buttons w-button">Profile</div>}
          </Link>
          <Link href="/event/calendar">
            {(currentPage !== "Event Calendar") && <div className="header-nav-buttons w-button">Calendar of Events</div>}
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