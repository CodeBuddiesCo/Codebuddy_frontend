import Link from 'next/link';

function HomePage() {
  const eventId = new Date();
  
  return (
    <div>
      <div className="main-photo"></div>
      <section className="header-section wf-section">
        <img className='logo-div' src="/CB_logo.png" alt='code buddy logo'/>
        <div className="nav-btn-div">
          <Link href="#">
            <div className="header-nav-buttons w-button">What is codebuddy?</div>
          </Link>
          <Link href="#">
            <div className="header-nav-buttons w-button">Become a buddy</div>
          </Link>
          <Link href="#">
            <div className="header-nav-buttons w-button">Calendar of Events</div>
          </Link>
          <Link href="/user/login">
            <div className="header-nav-buttons button-right w-button">Signup / Login</div>
          </Link>
        </div>
      </section>
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
      <div class="home-events-section">
     <div class="home-events-title">Upcoming Buddy Events</div>
     <div class="home-events-holder-div">
       <div class="home-events-holder-title-month_year">Month Year</div>
       <div class="home-event-holder-flex-div">
         <div class="home-event-details-main-div">
           <div class="home-event-details-top-div">
             <div class="home-event-top-text">Day, Month, Date </div>
             <div class="home-event-top-text right">Time, Zone</div>
           </div>
           <div class="home-event-details-bottom-div">
             <div class="home-event-bottom-details-main-flex-div">
               <div class="home-event-bottom-details-top-flex-div">
                 <div class="home-event-bottom-text">Buddy Name: Hollye</div>
                 <a href="#" class="home-event-button w-button">Signup</a>
               </div>
               <div class="home-event-bottom-details-bottom-flex-div">
                 <div class="home-event-bottom-text middle">Code Languages: html, css, javascript</div>
                 <div class="home-event-bottom-text">Available spots: 3</div>
               </div>
             </div>
           </div>
         </div>
         <div class="home-event-details-main-div">
           <div class="home-event-details-top-div">
             <div class="home-event-top-text">Day, Month, Date </div>
             <div class="home-event-top-text right">Time, Zone</div>
           </div>
           <div class="home-event-details-bottom-div">
             <div class="home-event-bottom-details-main-flex-div">
               <div class="home-event-bottom-details-top-flex-div">
                 <div class="home-event-bottom-text">Buddy Name: Hollye</div>
                 <a href="#" class="home-event-button w-button">Signup</a>
               </div>
               <div class="home-event-bottom-details-bottom-flex-div">
                 <div class="home-event-bottom-text middle">Code Languages: html, css, javascript</div>
                 <div class="home-event-bottom-text">Available spots: 3</div>
               </div>
             </div>
           </div>
         </div>
         <div class="home-event-details-main-div">
           <div class="home-event-details-top-div">
             <div class="home-event-top-text">Day, Month, Date </div>
             <div class="home-event-top-text right">Time, Zone</div>
           </div>
           <div class="home-event-details-bottom-div">
             <div class="home-event-bottom-details-main-flex-div">
               <div class="home-event-bottom-details-top-flex-div">
                 <div class="home-event-bottom-text">Buddy Name: Hollye</div>
                 <a href="#" class="home-event-button w-button">Signup</a>
               </div>
               <div class="home-event-bottom-details-bottom-flex-div">
                 <div class="home-event-bottom-text middle">Code Languages: html, css, javascript</div>
                 <div class="home-event-bottom-text">Available spots: 3</div>
               </div>
             </div>
           </div>
         </div>
         <div class="home-event-details-main-div">
           <div class="home-event-details-top-div">
             <div class="home-event-top-text">Day, Month, Date </div>
             <div class="home-event-top-text right">Time, Zone</div>
           </div>
           <div class="home-event-details-bottom-div">
             <div class="home-event-bottom-details-main-flex-div">
               <div class="home-event-bottom-details-top-flex-div">
                 <div class="home-event-bottom-text">Buddy Name: Hollye</div>
                 <a href="#" class="home-event-button w-button">Signup</a>
               </div>
               <div class="home-event-bottom-details-bottom-flex-div">
                 <div class="home-event-bottom-text middle">Code Languages: html, css, javascript</div>
                 <div class="home-event-bottom-text">Available spots: 3</div>
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

export default HomePage;
