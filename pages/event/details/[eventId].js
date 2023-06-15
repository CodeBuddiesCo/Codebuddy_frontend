import { useRouter } from "next/router";


function Details() {
 
  const router = useRouter();

  const eventId = router.query.eventId;
  
  

  return (
    <div>
      <h1>Event Details for event {eventId}</h1>
  
    </div>
  )
  }
  
  export default Details;