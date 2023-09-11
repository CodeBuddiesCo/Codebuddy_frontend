import { useState, useEffect} from "react";
import { fetchAllEvents, fetchUpcomingEvents } from "../../event_api_calls";
import { parseISO, format } from 'date-fns';



function Calendar({allEvents, setAllEvents, upcomingEvents, setUpcomingEvents}) {
  // const [allEvents, setAllEvents] = useState([])
  // const [upcomingEvents, setUpcomingEvents] = useState([])


  async function getAllEvents() {
    try {

      const results = await fetchAllEvents()
      console.log("results from getAllEvents >>", results)
      setAllEvents(() => results);

    } catch (error) {
      console.error   
    }
  }

  useEffect(() => {
    getAllEvents();
  }, [])


  return (
    <div>
      <h1>Codebuddy Calendar of Events</h1>
      <h2>All Events</h2>
      {allEvents[0] && allEvents.map(event =>(
        <div key={event.event_id}>
          <h3>{format(parseISO(event.date_time), 'PPp')}</h3>
        </div>
      ))}
      <h2>Upcoming Events</h2>
      <div>
        {upcomingEvents[0] && upcomingEvents.map(event =>(
          <div key={event.event_id}>
            <h3>{format(parseISO(event.date_time), 'PPPPpppp')}</h3>
          </div>
        ))}
        {!upcomingEvents[0] && <h3>No Upcoming Events</h3>}
      </div>
    </div>
  )
  }
  
  export default Calendar;