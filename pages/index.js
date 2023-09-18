import Link from 'next/link';
import { useRouter } from "next/router";
import { useEffect} from "react";
import HomepageHeader from '../components/HomepageHeader';

import { fetchUpcomingEvents } from '../event_api_calls';

function HomePage({upcomingEvents, setUpcomingEvents}) {
  const eventId = new Date();


  async function getUpcomingEvents() {
    try {

      const results = await fetchUpcomingEvents()
      console.log("results from getUpcomingEvents >>", results)
      setUpcomingEvents(() => results);

    } catch (error) {
      console.error   
    }
  }

    const router = useRouter();

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
       <div className="home-events-holder-title-month_year">Month Year</div>
       <div className="home-event-holder-flex-div">
         <div className="home-event-details-main-div">
           <div className="home-event-details-top-div">
             <div className="home-event-top-text">Day, Month, Date </div>
             <div className="home-event-top-text right">Time, Zone</div>
           </div>
           <div className="home-event-details-bottom-div">
             <div className="home-event-bottom-details-main-flex-div">
               <div className="home-event-bottom-details-top-flex-div">
                 <div className="home-event-bottom-text">Buddy Name: Hollye</div>
                 <a href="#" className="home-event-button w-button">Signup</a>
               </div>
               <div className="home-event-bottom-details-bottom-flex-div">
                 <div className="home-event-bottom-text middle">Code Languages: html, css, javascript</div>
                 <div className="home-event-bottom-text">Available spots: 3</div>
               </div>
             </div>
           </div>
         </div>
         <div className="home-event-details-main-div">
           <div className="home-event-details-top-div">
             <div className="home-event-top-text">Day, Month, Date </div>
             <div className="home-event-top-text right">Time, Zone</div>
           </div>
           <div className="home-event-details-bottom-div">
             <div className="home-event-bottom-details-main-flex-div">
               <div className="home-event-bottom-details-top-flex-div">
                 <div className="home-event-bottom-text">Buddy Name: Hollye</div>
                 <a href="#" className="home-event-button w-button">Signup</a>
               </div>
               <div className="home-event-bottom-details-bottom-flex-div">
                 <div className="home-event-bottom-text middle">Code Languages: html, css, javascript</div>
                 <div className="home-event-bottom-text">Available spots: 3</div>
               </div>
             </div>
           </div>
         </div>
         <div className="home-event-details-main-div">
           <div className="home-event-details-top-div">
             <div className="home-event-top-text">Day, Month, Date </div>
             <div className="home-event-top-text right">Time, Zone</div>
           </div>
           <div className="home-event-details-bottom-div">
             <div className="home-event-bottom-details-main-flex-div">
               <div className="home-event-bottom-details-top-flex-div">
                 <div className="home-event-bottom-text">Buddy Name: Hollye</div>
                 <a href="#" className="home-event-button w-button">Signup</a>
               </div>
               <div className="home-event-bottom-details-bottom-flex-div">
                 <div className="home-event-bottom-text middle">Code Languages: html, css, javascript</div>
                 <div className="home-event-bottom-text">Available spots: 3</div>
               </div>
             </div>
           </div>
         </div>
         <div className="home-event-details-main-div">
           <div className="home-event-details-top-div">
             <div className="home-event-top-text">Day, Month, Date </div>
             <div className="home-event-top-text right">Time, Zone</div>
           </div>
           <div className="home-event-details-bottom-div">
             <div className="home-event-bottom-details-main-flex-div">
               <div className="home-event-bottom-details-top-flex-div">
                 <div className="home-event-bottom-text">Buddy Name: Hollye</div>
                 <a href="#" className="home-event-button w-button">Signup</a>
               </div>
               <div className="home-event-bottom-details-bottom-flex-div">
                 <div className="home-event-bottom-text middle">Code Languages: html, css, javascript</div>
                 <div className="home-event-bottom-text">Available spots: 3</div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
    </div>
    </div>
  );
}

export default HomePage