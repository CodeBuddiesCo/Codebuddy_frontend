import { useEffect, useState} from "react";
import { parseISO, format} from 'date-fns';
import Link from "next/link";
import HomepageHeader from '../components/HomepageHeader';
import MeetOurBuddies from "../components/MeetOurBuddies";
import Footer from "../components/Footer";

import { fetchUpcomingEvents } from '../api_calls_event';

function HomePage({upcomingEvents, setUpcomingEvents}) {
  const [upcomingEventMonths, setUpcomingEventMonths] = useState([]);

  async function getUpcomingEvents() {
    try {
      const monthArray = []
      const results = await fetchUpcomingEvents()
      results.sort((a, b) => {return new Date(a.date_time) - new Date(b.date_time)})
      console.log("results from getUpcomingEvents >>", results)
      setUpcomingEvents(results);
      const resultsCopy = results
      resultsCopy.forEach(event => {
        monthArray.push(format(parseISO(event.date_time), 'LLLL'))
      });
      setUpcomingEventMonths([...new Set(monthArray)])
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
            <div className="home-events-holder-title-month_year">{upcomingEventMonths[0]}</div>
            <div className="home-event-holder-flex-div">
              {upcomingEvents.map ((upcomingEvent) => ( format(parseISO(upcomingEvent.date_time), 'LLLL') === upcomingEventMonths[0] && 
              <Link href={`/event/details/${upcomingEvent.event_id}`}><div className="home-event-details-main-div">
                <div className="home-event-details-top-div">
                  <div className="home-event-top-text">{format(parseISO(upcomingEvent.date_time), 'cccc') + "," + format(parseISO(upcomingEvent.date_time), ' LLLL') +format(parseISO(upcomingEvent.date_time), ' do') }</div>
                  <div className="home-event-top-text right">{format(parseISO(upcomingEvent.date_time), 'p')}</div>
                </div>
                <div className="home-event-details-bottom-div">
                  <div className="home-event-bottom-details-main-flex-div">
                    <div className="home-event-bottom-details-top-flex-div">
                      {(upcomingEvent.buddy_two === 'open') &&<div className="home-event-bottom-text">Host Buddy: {upcomingEvent.buddy_one}</div>}
                      {(upcomingEvent.buddy_two === 'closed') &&<div className="home-event-bottom-text">Host Buddy: {upcomingEvent.buddy_one}</div>}
                      {(upcomingEvent.buddy_two !== 'open' ) && (upcomingEvent.buddy_two !== 'closed') &&<div className="home-event-bottom-text">Host Buddies: {upcomingEvent.buddy_one} & {upcomingEvent.buddy_two}</div>}
                      {/* <a href="#" className="home-event-button w-button">Signup</a> */}
                    </div>
                    <div className="home-event-bottom-details-bottom-flex-div">
                      {!upcomingEvent.secondary_language && <div className="home-event-bottom-text middle">Code Language: {upcomingEvent.primary_language}</div>}
                      {upcomingEvent.secondary_language && <div className="home-event-bottom-text middle">Code Languages: {upcomingEvent.primary_language} & {upcomingEvent.secondary_language}</div>}
                      <div className="home-event-bottom-text">Available spots: {upcomingEvent.spots_available}</div>
                    </div>
                  </div>
                </div>
              </div></Link>))}
            </div>
          </div>
        <div>
            <div className="home-events-holder-title-month_year">{upcomingEventMonths[1]}</div>
            <div className="home-event-holder-flex-div">
              {upcomingEvents.map ((upcomingEvent) => ( format(parseISO(upcomingEvent.date_time), 'LLLL') === upcomingEventMonths[1] &&
              <Link href={`/event/details/${upcomingEvent.event_id}`}><div className="home-event-details-main-div">
                <div className="home-event-details-top-div">
                  <div className="home-event-top-text">{format(parseISO(upcomingEvent.date_time), 'cccc') + "," + format(parseISO(upcomingEvent.date_time), ' LLLL') +format(parseISO(upcomingEvent.date_time), ' do') }</div>
                  <div className="home-event-top-text right">{format(parseISO(upcomingEvent.date_time), 'p')}</div>
                </div>
              <div className="home-event-details-bottom-div">
                <div className="home-event-bottom-details-main-flex-div">
                  <div className="home-event-bottom-details-top-flex-div">
                    {(upcomingEvent.buddy_two === 'open') &&<div className="home-event-bottom-text">Host Buddy: {upcomingEvent.buddy_one}</div>}
                    {(upcomingEvent.buddy_two === 'closed') &&<div className="home-event-bottom-text">Host Buddy: {upcomingEvent.buddy_one}</div>}
                    {(upcomingEvent.buddy_two !== 'open' ) && (upcomingEvent.buddy_two !== 'closed') &&<div className="home-event-bottom-text">Host Buddies: {upcomingEvent.buddy_one} & {upcomingEvent.buddy_two}</div>}
                    {/* <a href="#" className="home-event-button w-button">Signup</a> */}
                  </div>
                  <div className="home-event-bottom-details-bottom-flex-div">
                    {!upcomingEvent.secondary_language && <div className="home-event-bottom-text middle">Code Language: {upcomingEvent.primary_language}</div>}
                    {upcomingEvent.secondary_language && <div className="home-event-bottom-text middle">Code Languages: {upcomingEvent.primary_language} & {upcomingEvent.secondary_language}</div>}
                    <div className="home-event-bottom-text">Available spots: {upcomingEvent.spots_available}</div>
                  </div>
                </div>
              </div>
            </div></Link>))}
          </div>
        </div>
        <div>
            <div className="home-events-holder-title-month_year">{upcomingEventMonths[2]}</div>
              <div className="home-event-holder-flex-div">
                {upcomingEvents.map ((upcomingEvent) => ( format(parseISO(upcomingEvent.date_time), 'LLLL') === upcomingEventMonths[2] &&
                <Link href={`/event/details/${upcomingEvent.event_id}`}><div className="home-event-details-main-div">
                  <div className="home-event-details-top-div">
                    <div className="home-event-top-text">{format(parseISO(upcomingEvent.date_time), 'cccc') + "," + format(parseISO(upcomingEvent.date_time), ' LLLL') +format(parseISO(upcomingEvent.date_time), ' do') }</div>
                    <div className="home-event-top-text right">{format(parseISO(upcomingEvent.date_time), 'p')}</div>
                  </div>
                <div className="home-event-details-bottom-div">
                  <div className="home-event-bottom-details-main-flex-div">
                    <div className="home-event-bottom-details-top-flex-div">
                      {(upcomingEvent.buddy_two === 'open') &&<div className="home-event-bottom-text">Host Buddy: {upcomingEvent.buddy_one}</div>}
                      {(upcomingEvent.buddy_two === 'closed') &&<div className="home-event-bottom-text">Host Buddy: {upcomingEvent.buddy_one}</div>}
                      {(upcomingEvent.buddy_two !== 'open' ) && (upcomingEvent.buddy_two !== 'closed') &&<div className="home-event-bottom-text">Host Buddies: {upcomingEvent.buddy_one} & {upcomingEvent.buddy_two}</div>}
                      {/* <a href="#" className="home-event-button w-button">Signup</a> */}
                    </div>
                    <div className="home-event-bottom-details-bottom-flex-div">
                      {!upcomingEvent.secondary_language && <div className="home-event-bottom-text middle">Code Language: {upcomingEvent.primary_language}</div>}
                      {upcomingEvent.secondary_language && <div className="home-event-bottom-text middle">Code Languages: {upcomingEvent.primary_language} & {upcomingEvent.secondary_language}</div>}
                      <div className="home-event-bottom-text">Available spots: {upcomingEvent.spots_available}</div>
                    </div>
                  </div>
                </div>
              </div></Link>))}
            </div>
          </div>
        </div>
        
      </div>
      
      <div>

      < MeetOurBuddies />

    </div>

< Footer />

    </div>
  );
}

export default HomePage