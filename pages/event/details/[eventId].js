import { useRouter } from "next/router";
import { useState, useEffect} from "react";
import { fetchEventById, fetchSignup } from "../../../event_api_calls";
import { parseISO, format } from 'date-fns';
import Link from "next/link";
import Header from "../../../components/Header";


function Details() {
  const router = useRouter()
  const {eventId} = router.query

  const [eventById, setEventById] = useState([]);
  const [eventSignupId, setEventSignupId] = useState([]);

  async function getEventById() {
    try {
      
      const results = await fetchEventById(eventId)
      console.log("results from getEventById >>", results)
      setEventById(results);
      setEventSignupId(results[0].event_id)

    } catch (error) {
      console.error   
    }
  }

  async function handleSignup() {
    console.log(eventSignupId)

    try {
      const results = await fetchSignup (eventSignupId);
      console.log("🚀 ~ file: add.js:58 ~ handleSignup ~ results:", results);
      getEventById()
      
    } catch (error) {
      console.error(error)
    }
  }
  

  useEffect(() => {
    if(!eventId){
      return;
    } else {
      getEventById();
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
        {/* <div className="event-details-container">
          <div className="event-details-header-container">
            <h1 className="event-details-header2">Success!!</h1>
            <h1 className="event-details-header1">The crew is on the way!</h1>
          </div>
          <div className="event-details-button-container">
            <Link href="/event/add"className="event-details-button" >Add Another Event</Link>
            <Link href="/event/calendar" className="event-details-button cancel" >Return to calendar</Link>
          </div>  
        </div> */}
        <div className="event-details-container" >
          <div className="event-details-header-container">
            <h1 className="event-details-header1">{event.primary_language} {event.secondary_language !== null && <span> & {event.secondary_language}</span>}</h1>
            <h1 className="event-details-header1">Buddy Code</h1>
          </div>
          <div className="event-details-header-container">
           <h3 className="event-details-header2">{format(parseISO(event.date_time), 'cccc') + "," + format(parseISO(event.date_time), ' LLLL') + format(parseISO(event.date_time), ' do') }</h3>
           <h3 className="event-details-header2">{"- " + format(parseISO(event.date_time), 'p')}</h3>
          </div>
          <div className="event-details-select-border">
            <h1 className="event-details-select">Attendees:</h1>
            {(eventById[0].attendees).map ((attendee) => (<h1 className="event-details-select">{attendee}</h1>))}
          </div>

          <div className="event-details-button-container">
            <button className="event-details-button" type="submit"  onClick={handleSignup}>Sign Up</button>
            <Link href="/event/calendar" className="event-details-button cancel" >Cancel</Link>
          </div>  
        </div>
      </div>))}
    </div>
  </div>
)
}



  



  
  
  export default Details;