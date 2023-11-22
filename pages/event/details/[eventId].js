import { useRouter } from "next/router";
import { useState, useEffect} from "react";
import { fetchEventById } from "../../../event_api_calls";
import { parseISO, format } from 'date-fns';
import Link from "next/link";
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
  
  

//   return (
//     <div>
//       <Header/>
//       <div className="event-details-page">

//                       <div className="home-event-holder-flex-div">
//                 {eventById.map ((event) => ( 
//                 <div className="home-event-details-main-div">
//                   <div className="home-event-details-top-div">
//                   <img className="event-details-image-container" src="/vincent-van-zalinge-AjtGg8feZhg-unsplash.jpg"
//               style={{ width: '100%', objectFit: 'cover', backgroundSize: 'contain', overflow: 'hidden'}}>
//           </img>
//                   </div>
//                 <div className="home-event-details-bottom-div">
//                   <div className="home-event-bottom-details-main-flex-div">
//                     <div className="home-event-top-text">{event.primary_language} {event.secondary_language !== null && <span> & {event.secondary_language}</span>} Buddy Code</div>  
//                     <div className="home-event-bottom-details-top-flex-div">
                    
//                     <div className="home-event-bottom-text middle">{format(parseISO(event.date_time), 'cccc') + "," + format(parseISO(event.date_time), ' LLLL') +format(parseISO(event.date_time), ' do') }</div>
//                     <div className="home-event-bottom-text middle">{format(parseISO(event.date_time), 'p')}</div>
//                     </div>
//                     <div className="home-event-bottom-details-bottom-flex-div">
//                     <div className="home-event-bottom-details-top-flex-div">
//                       {(event.buddy_two === ('open'||'closed')) &&<div className="home-event-bottom-text">Host Buddy: {event.buddy_one}</div>}
//                       {(event.buddy_two !== ('open'||'closed')) &&<div className="home-event-bottom-text">Host Buddies: {event.buddy_one} & {event.buddy_two}</div>}
//                     </div>
//                       <div className="home-event-bottom-text">Available spots: {event.spots_available}</div>
//                     </div>
//                     <div className="event-details-button-container">
//               <button className="event-details-button" type="submit" >Sign Up</button>
//               <Link href="/event/calendar" className="event-details-button cancel" >Cancel</Link>
//             </div>  
//                   </div>
//                 </div>
//               </div>))}
//             </div>
//       </div>
//       </div>

//   )
  
// }


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
           <h3 className="event-details-header2">{format(parseISO(event.date_time), 'cccc') + "," + format(parseISO(event.date_time), ' LLLL') +format(parseISO(event.date_time), ' do') }</h3>
           <h3 className="event-details-header2">{format(parseISO(event.date_time), 'p')}</h3>
          </div>
          <div className="event-details-select-border">

          </div>

          <div className="event-details-button-container">
            <button className="event-details-button" type="submit" >Sign Up</button>
            <Link href="/event/calendar" className="event-details-button cancel" >Cancel</Link>
          </div>  
        </div>
      </div>))}
    </div>
  </div>
)
}



  



  
  
  export default Details;