import { useRouter } from "next/router";
import { useState, useEffect} from "react";
import { fetchEventById } from "../../../event_api_calls";
import { parseISO, format } from 'date-fns';
import Header from "../../../components/Header";


function Details() {
  const router = useRouter()
  const {eventId} = router.query
  const [eventById, setEventById] = useState([]);

  async function getEventById() {
    try {
      
      const results = await fetchEventById(eventId)
      console.log("results from getEventById >>", results)
      setEventById(results);

    } catch (error) {
      console.error   
    }
  }
  

  useEffect(() => {
    if(!eventId){
      return;
    } else {

    getEventById();}
  }, [eventId])
  
  

  return (
    <div>
      <Header/>
      <div className="event-details-page">
        {(!eventById.error) && eventById.map(event =>(
          <div key={event.event_id}>
            <h1>Event Details for Event Id {event.event_id}</h1>
            <h3>Date: {format(parseISO(event.date_time), 'PPp')}</h3>
            <h3>Buddies: {event.buddy_one} {event.buddy_two !== "open" &&<span>& {event.buddy_two}</span>}</h3>
            <h3>{event.secondary_language && <span>Primary</span>} Code Language: {event.primary_language}</h3>
            {event.secondary_language && <h3>Secondary Code Language: {event.secondary_language}</h3>}
          </div>
        ))}
      </div>
    </div>
  )
  
}




  



  
  
  export default Details;