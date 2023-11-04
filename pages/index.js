import { useEffect, useState} from "react";
import { parseISO, format} from 'date-fns';
import HomepageHeader from '../components/HomepageHeader';

import { fetchUpcomingEvents } from '../event_api_calls';

function HomePage({upcomingEvents, setUpcomingEvents}) {
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const date = new Date();

  let currentMonth = month[date.getMonth()];
  let nextMonth = month[date.getMonth()+1];

  async function getUpcomingEvents() {
    try {

      const results = await fetchUpcomingEvents()
      results.sort((a, b) => {return a.date_time - b.date_time})
      console.log("results from getUpcomingEvents >>", results)
      setUpcomingEvents(results);

    } catch (error) {
      console.error   
    }
  }

  useEffect(() => {
    getUpcomingEvents();
  }, [])

  return (
    <div>
      <div className="main-photo"></div>
      <HomepageHeader/>
      <section className="home-section wf-section">
        <div className="home-top-div">
          <div className="home-spacer-div"></div>
          <div className="tagline-div">
            <div className="tagline-text-block">
              Experience the power of <span className="collab-text-span">collaboration</span> on <span><img className='logo-text-span' src='grey_logo.png' alt='code buddy logo'/></span>, connecting you with skilled code enthusiasts through live video to supercharge your code
            </div>
          </div>
        </div>
      </section>
      <div className="home-events-section">
     <div className="home-events-title">Upcoming Buddy Events</div>
     <div className="home-events-holder-div">
      <div>
       <div className="home-events-holder-title-month_year">{currentMonth}</div>
       <div className="home-event-holder-flex-div">
         {upcomingEvents.map ((upcomingEvent) => ( format(parseISO(upcomingEvent.date_time), 'LLLL') === currentMonth &&
         <div className="home-event-details-main-div">
           <div className="home-event-details-top-div">
             <div className="home-event-top-text">{format(parseISO(upcomingEvent.date_time), 'cccc') + "," + format(parseISO(upcomingEvent.date_time), ' LLLL') +format(parseISO(upcomingEvent.date_time), ' do') }</div>
             <div className="home-event-top-text right">{format(parseISO(upcomingEvent.date_time), 'p')}</div>
           </div>
           <div className="home-event-details-bottom-div">
             <div className="home-event-bottom-details-main-flex-div">
               <div className="home-event-bottom-details-top-flex-div">
               {(upcomingEvent.buddy_two === ('open'||'closed')) &&<div className="home-event-bottom-text">Host Buddy: {upcomingEvent.buddy_one}</div>}
                 {(upcomingEvent.buddy_two !== ('open'||'closed')) &&<div className="home-event-bottom-text">Host Buddies: {upcomingEvent.buddy_one} & {upcomingEvent.buddy_two}</div>}
                 <a href="#" className="home-event-button w-button">Signup</a>
               </div>
               <div className="home-event-bottom-details-bottom-flex-div">
                 {upcomingEvent.secondary_language === null && <div className="home-event-bottom-text middle">Code Language: {upcomingEvent.primary_language}</div>}
                 {upcomingEvent.secondary_language !== null && <div className="home-event-bottom-text middle">Code Languages: {upcomingEvent.primary_language} & {upcomingEvent.secondary_language}</div>}
                 <div className="home-event-bottom-text">Available spots: {upcomingEvent.spots_available}</div>
               </div>
             </div>
           </div>
         </div>))}
       </div>
       </div>
       <div>
      <div className="home-events-holder-title-month_year">{nextMonth}</div>
       <div className="home-event-holder-flex-div">
         {upcomingEvents.map ((upcomingEvent) => ( format(parseISO(upcomingEvent.date_time), 'LLLL') === nextMonth &&
         <div className="home-event-details-main-div">
           <div className="home-event-details-top-div">
             <div className="home-event-top-text">{format(parseISO(upcomingEvent.date_time), 'cccc') + "," + format(parseISO(upcomingEvent.date_time), ' LLLL') +format(parseISO(upcomingEvent.date_time), ' do') }</div>
             <div className="home-event-top-text right">{format(parseISO(upcomingEvent.date_time), 'p')}</div>
           </div>
           <div className="home-event-details-bottom-div">
             <div className="home-event-bottom-details-main-flex-div">
               <div className="home-event-bottom-details-top-flex-div">
                 {(upcomingEvent.buddy_two === ('open'||'closed')) &&<div className="home-event-bottom-text">Host Buddy: {upcomingEvent.buddy_one}</div>}
                 {(upcomingEvent.buddy_two !== ('open'||'closed')) &&<div className="home-event-bottom-text">Host Buddies: {upcomingEvent.buddy_one} & {upcomingEvent.buddy_two}</div>}
                 <a href="#" className="home-event-button w-button">Signup</a>
               </div>
               <div className="home-event-bottom-details-bottom-flex-div">
               {upcomingEvent.secondary_language === null && <div className="home-event-bottom-text middle">Code Language: {upcomingEvent.primary_language}</div>}
                 {upcomingEvent.secondary_language !== null && <div className="home-event-bottom-text middle">Code Languages: {upcomingEvent.primary_language} & {upcomingEvent.secondary_language}</div>}
                 <div className="home-event-bottom-text">Available spots: {upcomingEvent.spots_available}</div>
               </div>
             </div>
           </div>
         </div>))}
       </div>
       </div>
     </div>
    </div>
    </div>
  );
}

export default HomePage