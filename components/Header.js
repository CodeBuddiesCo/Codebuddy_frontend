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
            <button className="header-nav-buttons w-button">Home</button>
          </Link>
          <Link href="#">
            {!username &&<button className="header-nav-buttons w-button">What is codebuddy?</button>}
          </Link>
          <Link href="become-a-buddy">
            {(username && !isBuddy) &&<button className="header-nav-buttons w-button">Become a buddy</button>}
          </Link>
          <Link href="/user/profile">
            {(username && (currentPage !== "User Profile"))&&<button className="header-nav-buttons w-button">Profile</button>}
          </Link>
          <Link href="/event/calendar">
            {(currentPage !== "Event Calendar") && <button className="header-nav-buttons w-button">Calendar of Events</button>}
          </Link>
          {!username &&<Link href="/user/login">
            <button className="header-nav-buttons button-right w-button">Signup / Login</button>
          </Link>}
          {username && <Link href="/">
            <button className="header-nav-buttons button-right w-button" onClick={handleLogout}>Log Out</button>
          </Link>}
        </div>
      </section>
    </div>
  )
  }
  
  export default Header;