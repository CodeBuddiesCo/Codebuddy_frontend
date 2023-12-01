import { useRouter } from "next/router";
import { useState, useEffect} from "react";
import Link from 'next/link';

function HomepageHeader() {
  const router = useRouter();
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
    window.localStorage.removeItem("nextauth.message")
    window.location = "/"
  }
  
  
  useEffect(() => {
    setUsername(window.localStorage.getItem("username"));
    setIsBuddy(JSON.parse(window.localStorage.getItem("isBuddy")));
  }, [])

  

  return (
    <div>
      <section className="HP-header-section wf-section">
        <img className='HP-logo-div' src="/CB_Logo.png" alt='code buddy logo'/>
        <div className="HP-nav-btn-div">
          <Link href="#">
            {!username &&<div className="HP-header-nav-buttons w-button">What is codebuddy?</div>}
          </Link>
          <Link href="/user/become-a-buddy">
            {(username && !isBuddy) && <div className="HP-header-nav-buttons w-button">Become a buddy</div>}
          </Link>
          <Link href="/user/profile">
            {username &&<div className="HP-header-nav-buttons w-button">My Profile</div>}
          </Link>
          <Link href="/event/calendar">
            <div className="HP-header-nav-buttons w-button">Calendar of Events</div>
          </Link>
          {!username &&<Link href="/user/login">
            <div className="HP-header-nav-buttons button-right w-button">Signup / Login</div>
          </Link>}
          {username && <Link href="/">
            <div className="HP-header-nav-buttons button-right w-button" onClick={handleLogout}>Log Out</div>
          </Link>}
        </div>
      </section>
    </div>
  )
  }
  
  export default HomepageHeader;