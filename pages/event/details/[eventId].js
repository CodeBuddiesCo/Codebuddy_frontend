import { useRouter } from "next/router";
import { useState, useEffect} from "react";
import { fetchEventById, fetchSignup, fetchCancelSignup, fetchCancelEvent, fetchDeleteEvent, fetchBuddySignup } from "../../../event_api_calls";
import { parseISO, format } from 'date-fns';
import Link from "next/link";
import Header from "../../../components/Header";


function Details({isAdmin, setIsAdmin, today, isBuddy, setIsBuddy}) {
  const router = useRouter()
  const {eventId} = router.query
  const [eventById, setEventById] = useState([]);
  const [eventSignupId, setEventSignupId] = useState([]);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [username, setUsername] = useState("");
  const [userRequiredMessage, setUserRequiredMessage] = useState(false)
  

  async function getEventById() {
    try {
      
      const results = await fetchEventById(eventId)
      console.log("results from getEventById >>", results)
      setEventById(results);
      setEventSignupId(results[0].event_id)
      setAttendees(results[0].attendees)
      findIsSignedUp(results[0].attendees)

    } catch (error) {
      console.error   
    }
  }

  async function handleSignup() {
    console.log(eventSignupId)
    if (username) {
      try {
        const results = await fetchSignup (eventSignupId);
        console.log("🚀 ~ file: add.js:58 ~ handleSignup ~ results:", results);
        getEventById()
      
      }   catch (error) {
        console.error(error)
      }
    } else {
      alert("You must sign in or register to attend")
      setUserRequiredMessage(true)
    }
  }

  async function handleBuddySignup() {
    console.log(eventSignupId)
    if (isBuddy) {
      try {
        const results = await fetchBuddySignup (eventSignupId, username);
        console.log("🚀 ~ file: [eventId].js:56 ~ handleBuddySignup ~ results:", results)
        getEventById()
      
      }   catch (error) {
        console.error(error)
      }
    } else {
      setUserRequiredMessage(true)
    }
  }

  async function handleCancelSignup() {
    console.log(eventSignupId)

    try {
      const results = await fetchCancelSignup (eventSignupId);
      console.log("🚀 ~ file: add.js:58 ~ handleSignup ~ results:", results);
      getEventById()
      setIsSignedUp(false)
      
    } catch (error) {
      console.error(error)
    }
  }

  async function handleCancelEvent() {
    console.log(eventSignupId)

    try {
      const results = await fetchCancelEvent (eventSignupId);
      console.log("🚀 ~ file: [eventId].js:64 ~ handleCancelEvent ~ results:", results)
      getEventById()
      
    } catch (error) {
      console.error(error)
    }
  }  

  async function handleDeleteEvent() {
    console.log(eventSignupId)

    try {
      const results = await fetchDeleteEvent (eventSignupId);
      console.log("🚀 ~ file: [eventId].js:76 ~ handleDeleteEvent ~ results:", results)
      window.location = "/event/calendar"
      
    } catch (error) {
      console.error(error)
    }
  }  

  async function findIsSignedUp(attendeeList) {
    let username = (window.localStorage.getItem("username"));
    console.log(username)
    for (let i = 0; i < attendeeList.length; i++) {
      if (attendeeList[i] === username) {
        setIsSignedUp(true)
      }
    }
  }

  
  useEffect(() => {
    if(!eventId){
      return;
    } else {
      setUsername(window.localStorage.getItem("username"));
      setIsAdmin(JSON.parse(window.localStorage.getItem("isAdmin")));
      setIsBuddy(JSON.parse(window.localStorage.getItem("isBuddy")));
      getEventById();
      console.log("today", today)
    }
  }, [eventId])

return (
  <div>
    <Header/>
    <div className="event-details-page">
      {eventById.map ((event) => (<div className="event-details-main-content-container">
        <img className="event-details-image-container" src="/anoir-chafik-2_3c4dIFYFU-unsplash (1) 1-min.jpg"
            style={{ width: '100%', height: 'auto', objectFit: 'cover', backgroundSize: 'cover', overflow: 'hidden'}}>
        </img>
        <div className="event-details-container" >
          <div className="event-details-header-container">
            <h1 className="event-details-header1">{event.primary_language} {event.secondary_language !== null && <span> & {event.secondary_language}</span>}</h1>
            <h1 className="event-details-header1">Buddy Code</h1>
          </div>
          <div className="event-details-header-container">
           <h3 className="event-details-header2">{format(parseISO(event.date_time), 'cccc') + "," + format(parseISO(event.date_time), ' LLLL') + format(parseISO(event.date_time), ' do') }</h3>
           <h3 className="event-details-header2">{"- " + format(parseISO(event.date_time), 'p')}</h3>
          </div>
          <h1 className="event-details-select">Attendees:</h1>
          <div className="event-details-select-border">
            <h1 className="event-details-select">{event.buddy_one} - Host Buddy</h1>
            {(event.buddy_two !== "open") && (event.buddy_two !== "closed") && <h1 className="event-details-select">{event.buddy_two} - Host Buddy</h1>}
            {(attendees).map ((attendee) =>(<div>
              {(attendee !== event.buddy_one) && (attendee !== event.buddy_two) && <h1 className="event-details-select">{attendee}</h1>}
            </div>))}
          </div>
          <div className="event-details-button-container">
            {(today.toISOString() <= event.date_time) && !isSignedUp && <button className="event-details-button" type="submit"  onClick={handleSignup}>Sign Up</button>}
            {(today.toISOString() <= event.date_time) && !isSignedUp && isBuddy && (event.buddy_two === "open") && <button className="event-details-button" type="submit"  onClick={handleBuddySignup}>Sign Up As Buddy</button>}
            {(today.toISOString() <= event.date_time) && isSignedUp && (username != (event.buddy_one||event.buddy_two))  && <button className="event-details-button" type="submit"  onClick={handleCancelSignup}>Cancel Sign Up</button>}
            {((today.toISOString() <= event.date_time) && (username === event.buddy_one) && event.is_active == true) && <button className="event-details-button" type="submit"  onClick={handleCancelEvent}>Cancel Event</button>}
            {isAdmin && <button className="event-details-button" type="submit"  onClick={handleDeleteEvent}>Delete Event</button>}
            <Link href="/event/calendar" className="event-details-button cancel" >Return to Calendar</Link>
          </div>  
        </div>
      </div>))}
    </div>
  </div>
)
}

  export default Details;