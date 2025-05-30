import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '../../../components/Header';
import styles from '../../../styles/profile.module.css';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MessageBox from '../../../components/MessageBox';
import { parseISO, format, isBefore, isAfter } from 'date-fns';
import { fetchAddFollow, fetchRemoveFollow, } from "../../../api_calls_profile";
import UserCalendar from '../../../components/UserCalendar';
import Footer from '../../../components/Footer';
const {codeLanguageObjectArray} = require('../../../Arrays/CodeLanguageObjectArray')


const Profile = ({ setCurrentPage, currentPage, buddyUsernameArray, today }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [profileIsBuddy, setProfileIsBuddy] = useState(false);
  const [profileId, setProfileId] = useState("")
  const [profileFollowsArray, setProfileFollowsArray] = useState([]);
  const [userFollowsArray, setUserFollowsArray] = useState([]);
  const [profileEvents, setProfileEvents] = useState([]);
  const [displayEvents, setDisplayEvents] =useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [primaryCriteria, setPrimaryCriteria] = useState("");
  const [secondaryCriteria, setSecondaryCriteria] = useState("");
  const [searchType, setSearchType] = useState("");
  const [profileDetails, setProfileDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [primaryLanguages, setPrimaryLanguages] = useState([]);
  const [secondaryLanguages, setSecondaryLanguages] = useState([]);
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false)
  const [moYrList, setMoYrList] = useState([])
  const [previousMoYrList, setPreviousMoYrList] = useState([])
  const [upcomingMoYrList, setUpcomingMoYrList] = useState([])
  const [displayPreviousMoYrList, setDisplayPreviousMoYrList] = useState([])
  const [displayUpcomingMoYrList, setDisplayUpcomingMoYrList] = useState([])
  const [upcomingResultsBoolean, setUpcomingResultsBoolean] = useState(true)
  const [previousResultsBoolean, setPreviousResultsBoolean] = useState(true)
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [previousEvents, setPreviousEvents] = useState([]);
  const [displayUpcomingEvents, setDisplayUpcomingEvents] = useState([]);
  const [displayPreviousEvents, setDisplayPreviousEvents] = useState([]);
  const [upcomingEventsToggle, setUpcomingEventsToggle] = useState(true);
  const todayFormatted = format(today, 'iiii LLLL do yyyy p')




  const toggleBox = () => {
    setIsBoxOpen((prev) => !prev);
  };

  const fetchProfileDetails = async (id) => {

    try {
      console.log(id)
      setPreviousResultsBoolean(true)
      setUpcomingResultsBoolean(true)
      const token = localStorage.getItem('token');
      const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/profile/${id}`, {
        method: "GET"
      });

      if (response.status === 200) {
        const profileData = await response.json();
        console.log('Fetched profile Data:', profileData);
        
        const monthYearArray =[]
        const pastMonthYearArray = []
        const futureMonthYearArray = []
        const profileSchedule = profileData.schedule
        const localProfileEvents = profileSchedule.events
        
        setProfileDetails(profileData);
        if (profileData.is_buddy) {
          setProfileIsBuddy(true)
        }
        setProfileId(profileData.id)
        setProfileFollowsArray(profileData.follows)
        setPrimaryLanguages([profileData.primary_language, profileData.secondary_language])
        setSecondaryLanguages(profileData.programmingLanguages)

        if (!localProfileEvents[0]) {
          setUpcomingResultsBoolean(false)
          setPreviousResultsBoolean(false)
        }
        
        localProfileEvents.forEach(event => {
          monthYearArray.push(format(parseISO(event.date_time), 'LLLL yyyy'))
        });
        setMoYrList([...new Set(monthYearArray)])

        const pastEvents = localProfileEvents.filter(event => isBefore(parseISO(event.date_time), today));
        const sortPast = pastEvents.sort((a, b) => {return new Date (b.date_time) - new Date (a.date_time)}); 
        setPreviousEvents(sortPast)
        setDisplayPreviousEvents(sortPast)
        pastEvents.forEach(event => {
          pastMonthYearArray.push(format(parseISO(event.date_time), 'LLLL yyyy'))
        });
        setPreviousMoYrList([...new Set (pastMonthYearArray)])
        setDisplayPreviousMoYrList([...new Set (pastMonthYearArray)])
        if (!pastEvents[0]) {
          setPreviousResultsBoolean(false)
        }
      
        const futureEvents = localProfileEvents.filter(event => isAfter(parseISO(event.date_time), today));
        const sort = futureEvents.sort((a, b) => {return new Date (a.date_time) - new Date (b.date_time)}); 
        setUpcomingEvents(sort)
        setDisplayUpcomingEvents(sort)
        futureEvents.forEach(event => {
          futureMonthYearArray.push(format(parseISO(event.date_time), 'LLLL yyyy'))
        });
        setUpcomingMoYrList([...new Set (futureMonthYearArray)])
        setDisplayUpcomingMoYrList([...new Set (futureMonthYearArray)])
        if (!futureEvents[0]) {
          setUpcomingResultsBoolean(false)
        }
        
        setProfileEvents(localProfileEvents)
        setDisplayEvents(localProfileEvents)

      } else {
        console.error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Exception:', error);
    }
  };

   const fetchUserDetails = async () => {
  
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.status === 200) {
          const userData = await response.json();
          console.log('Fetched User Data:', userData);
          
          const userSchedule = userData.schedule
          
          setUserDetails(userData);
          setUserFollowsArray(userData.follows)

  
        } else {
          console.error(`Server responded with status: ${response.status}`);
        }
      } catch (error) {
        console.error('Exception:', error);
      }
    };
  

  async function handleAddFollow(followeeId) {

    try {
      const results = await fetchAddFollow(followeeId);
      console.log(results)
      fetchUserDetails()
    } catch (error) {
      console.error(error)
    }

  }

  async function handleRemoveFollow(followedId) {

    try {
      const results = await fetchRemoveFollow(followedId);
      console.log(results)
      fetchProfileDetails()
    } catch (error) {
      console.error(error)
    }

  }
 
  async function handleSearch(event) {
    event.preventDefault()
    try {
      setPreviousResultsBoolean(true)
      setUpcomingResultsBoolean(true)
      const monthYearArray =[]
      const pastMonthYearArray = []
      const futureMonthYearArray = []

      if (searchType === "Host") {
        if (primaryCriteria && secondaryCriteria) {

          const matchingEvents = profileEvents.filter(event => 
            (event.buddy_one === primaryCriteria || event.buddy_one === secondaryCriteria) && 
            (event.buddy_two === primaryCriteria || event.buddy_two === secondaryCriteria)
          );
          setDisplayEvents(matchingEvents)

          const pastEvents = matchingEvents.filter(event => isBefore(parseISO(event.date_time), today));
          const sortPastTwoB = pastEvents.sort((a, b) => {return new Date (b.date_time) - new Date (a.date_time)}); 
          setDisplayPreviousEvents(sortPastTwoB)
          pastEvents.forEach(event => {
            pastMonthYearArray.push(format(parseISO(event.date_time), 'LLLL yyyy'))
          });
          setDisplayPreviousMoYrList([...new Set (pastMonthYearArray)])
          if (!pastEvents[0]) {
            setPreviousResultsBoolean(false)
          }
          
          const futureEvents = matchingEvents.filter(event => isAfter(parseISO(event.date_time), today));
          const sortFutureEventsTwoB = futureEvents.sort((a, b) => {return new Date (a.date_time) - new Date (b.date_time)}); 
          setDisplayUpcomingEvents(sortFutureEventsTwoB)
          futureEvents.forEach(event => {
            futureMonthYearArray.push(format(parseISO(event.date_time), 'LLLL yyyy'))
          });
          setUpcomingMoYrList(futureMonthYearArray)
          setDisplayUpcomingMoYrList([...new Set (futureMonthYearArray)])
          if (!futureEvents[0]) {
            setUpcomingResultsBoolean(false)
          }
        }

        if (primaryCriteria && !secondaryCriteria) {

          const matchingEvents = profileEvents.filter(event => 
            (event.buddy_one === primaryCriteria || event.buddy_two === primaryCriteria)
          );
          setDisplayEvents(matchingEvents)

          const pastEvents = matchingEvents.filter(event => isBefore(parseISO(event.date_time), today));
          const sortPastOneB = pastEvents.sort((a, b) => {return new Date (b.date_time) - new Date (a.date_time)}); 
          setDisplayPreviousEvents(sortPastOneB)
          pastEvents.forEach(event => {
            pastMonthYearArray.push(format(parseISO(event.date_time), 'LLLL yyyy'))
          });
          setDisplayPreviousMoYrList([...new Set (pastMonthYearArray)])
          if (!pastEvents[0]) {
            setPreviousResultsBoolean(false)
          }
          
          const futureEvents = matchingEvents.filter(event => isAfter(parseISO(event.date_time), today));
          const sortFutureEventsOneB = futureEvents.sort((a, b) => {return new Date (a.date_time) - new Date (b.date_time)}); 
          setDisplayUpcomingEvents(sortFutureEventsOneB)
          futureEvents.forEach(event => {
            futureMonthYearArray.push(format(parseISO(event.date_time), 'LLLL yyyy'))
          });
          setUpcomingMoYrList(futureMonthYearArray)
          setDisplayUpcomingMoYrList([...new Set (futureMonthYearArray)])
          if (!futureEvents[0]) {
            setUpcomingResultsBoolean(false)
          }
        }
      }

      if (searchType === "Language") {
        if (primaryCriteria && secondaryCriteria) {
          const matchingEvents = profileEvents.filter(event => 
            (event.primary_language === primaryCriteria || event.primary_language === secondaryCriteria) && 
            (event.secondary_language === primaryCriteria || event.secondary_language === secondaryCriteria)
          );
          setDisplayEvents(matchingEvents)

          const pastEvents = matchingEvents.filter(event => isBefore(parseISO(event.date_time), today));
          const sortPastEventsTwoL = pastEvents.sort((a, b) => {return new Date (b.date_time) - new Date (a.date_time)}); 
          setDisplayPreviousEvents(sortPastEventsTwoL)
          pastEvents.forEach(event => {
            pastMonthYearArray.push(format(parseISO(event.date_time), 'LLLL yyyy'))
          });
          setDisplayPreviousMoYrList([...new Set (pastMonthYearArray)])
          if (!pastEvents[0]) {
            setPreviousResultsBoolean(false)
          }
          
          const futureEvents = matchingEvents.filter(event => isAfter(parseISO(event.date_time), today));
          const sortFutureEventsTwoL = futureEvents.sort((a, b) => {return new Date (a.date_time) - new Date (b.date_time)}); 
          setDisplayUpcomingEvents(sortFutureEventsTwoL)
          futureEvents.forEach(event => {
            futureMonthYearArray.push(format(parseISO(event.date_time), 'LLLL yyyy'))
          });
          setUpcomingMoYrList(futureMonthYearArray)
          setDisplayUpcomingMoYrList([...new Set (futureMonthYearArray)])
          if (!futureEvents[0]) {
            setUpcomingResultsBoolean(false)
          }
        } 

        if (primaryCriteria && !secondaryCriteria) {
          const matchingEvents = profileEvents.filter(event => 
            (event.primary_language === primaryCriteria || event.secondary_language === primaryCriteria)
          );
          setDisplayEvents(matchingEvents)

          const pastEvents = matchingEvents.filter(event => isBefore(parseISO(event.date_time), today));
          const sortPastEventsOneL = pastEvents.sort((a, b) => {return new Date (b.date_time) - new Date (a.date_time)}); 
          setDisplayPreviousEvents(sortPastEventsOneL)
          pastEvents.forEach(event => {
            pastMonthYearArray.push(format(parseISO(event.date_time), 'LLLL yyyy'))
          });
          setDisplayPreviousMoYrList([...new Set (pastMonthYearArray)])
          if (!pastEvents[0]) {
            setPreviousResultsBoolean(false)
          }
          
          const futureEvents = matchingEvents.filter(event => isAfter(parseISO(event.date_time), today));
          const sortFutureEventsOneL = futureEvents.sort((a, b) => {return new Date (a.date_time) - new Date (b.date_time)}); 
          setDisplayUpcomingEvents(sortFutureEventsOneB)
          futureEvents.forEach(event => {
            futureMonthYearArray.push(format(parseISO(event.date_time), 'LLLL yyyy'))
          });
          setUpcomingMoYrList(futureMonthYearArray)
          setDisplayUpcomingMoYrList([...new Set (futureMonthYearArray)])
          if (!futureEvents[0]) {
            setUpcomingResultsBoolean(false)
          }
        }
      }

    } catch (error) {
      console.error
    }
  }
  
    useEffect(() => {
    if (id) {
    setCurrentPage("Other Profile");
    fetchProfileDetails(id);
    }
    
  }, [setCurrentPage, id]);


  return (
  <div>
    <div className={styles.profilePage}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      < Header  {...currentPage={currentPage}}/>
      <div className={styles.leftPanel}>
        <section className={styles.mainDetailsContainer}>
          <div className={styles.containerHeaderWrapper} id={styles.noBorder}>
            <div className={styles.containerHeading}> </div>
            //!! you need to set this to a spacer div
            <button title="Edit Profile" id={styles.iconButtons} className="material-symbols-outlined"></button>
          </div>
          <div className={styles.profilePictureWrapper}>
            {!profileDetails.pfp_url && <img src={"/Gemini_Generated_Image_8tpel98tpel98tpe.jpeg"} alt="Profile Preview" className={styles.profilePicture} />}
            {profileDetails.pfp_url  && <img src={profileDetails.pfp_url} alt="Profile Preview" className={styles.profilePicture} />}
          </div>
          <div className={styles.profileNameWrapper}>
            <div className={styles.profileUsername}><span className={styles.curly}>{`{`}</span>{profileDetails.username}<span className={styles.curly}>{`}`}</span></div>
            <div className={styles.profileName}>{profileDetails.name}</div>
          </div>
          <div className={styles.profileTitlesWrapper}>
            {profileDetails.title && <div className={styles.profileTitle}>{profileDetails.title}</div>}
            {profileIsBuddy && <div className={styles.profileStatus}>Host Buddy</div>}
          </div>
          <div>
          //!! you need to set the gadget button
             <button className={styles.profileGadgetButton}>Follow</button>
             <button className={styles.profileGadgetButton}>Unfollow</button>
          </div>
        </section>
        <section className={styles.technologiesContainer}>
          <div className={styles.containerHeaderWrapper}>
            <p1 className={styles.containerHeading}>Technologies</p1>

          </div>
          <div className={styles.technologiesWrapper}>
            <h6 className={styles.techSubHeaders}>Primary Technologies</h6>
            <div className={styles.techItemWrappers}>
              {primaryLanguages && primaryLanguages.map((language) => <div className={styles.techItems}>{language}</div>)}
            </div>
            <h6 className={styles.techSubHeaders}>Secondary Technologies</h6>
            <div className={styles.techItemWrappers}>
              {secondaryLanguages && secondaryLanguages.map((language) => <div className={styles.techItems}>{language}</div>)}
            </div>
          </div> 
        </section>
      </div>
      <div className={styles.middlePanel}>
        <section className={styles.bioContainer}>
          <div className={styles.containerHeaderWrapper}>
            <p1 className={styles.containerHeading}>Bio</p1>

          </div>
          <div className={styles.bioTextWrapper} >
            {!profileDetails.buddy_bio && <p className={styles.bioText}>Don’t leave us guessing! Complete your bio and connect with fellow coders! Click the edit button to get started.</p>}
            {profileDetails.buddy_bio && <p className={styles.bioText}>{profileDetails.buddy_bio}</p>}
          </div>
        </section>
        <section className={styles.eventsContainer}>
          <div className={styles.containerHeaderWrapper}>
            <p1 className={styles.containerHeading}>My Events</p1>   
            <div className={styles.eventsHeaderRightWrapper}>
            <div className="calendar-menu-right-container">
                {!toggleSearch &&<button onClick={() => setToggleSearch(true)} title="Current Month" className="material-symbols-outlined search" id={styles.searchButton}>search</button>}
                {toggleSearch && <form className={styles.calendarSearchFormContainer} onSubmit={handleSearch}>
                  <div className={styles.calendarSelectBorder}>
                    {searchType && <label className={styles.calendarSelectLabel}>Search Type</label>}
                    <select className={styles.calendarSelect} onChange={(event) => {setSearchType(event.target.value), setPrimaryCriteria(""), setSecondaryCriteria("")}} required>
                      <option value="" disabled selected>Search Type</option>
                      <option value="Host">Host Buddies</option>
                      <option value="Language">Code Languages</option>
                    </select>
                  </div>
                  {searchType === "Language" && <div className={styles.calendarSelectBorder}>
                    {primaryCriteria && <label className={styles.calendarSelectLabel}>Primary Search Criteria</label>}           
                    <select className={styles.calendarSelect} value={primaryCriteria} id="Primary-Language" onChange={(event) => {setPrimaryCriteria(event.target.value)}} required>
                      <option value="" disabled selected>Primary Search Criteria</option>
                      {codeLanguageObjectArray.map((language) => <option key={language.value} value={language.value} disabled={language.value === secondaryCriteria}>{language.label}</option>)}
                    </select>
                  </div>}  
                  {searchType === "Language" && <div className={styles.calendarSelectBorder}>
                    {secondaryCriteria && <label className={styles.calendarSelectLabel}>Secondary Search Criteria</label>}           
                    <select className={styles.calendarSelect} value={secondaryCriteria} id="Secondary-Criteria" onChange={(event) => {setSecondaryCriteria(event.target.value)}}>
                      <option value="" disabled selected>Secondary Search Criteria</option>
                      <option value="">None</option>
                      {codeLanguageObjectArray.map((language) => <option key={language.value} value={language.value} disabled={language.value === primaryCriteria}>{language.label}</option>)}
                    </select>
                  </div>}  
                  {searchType === "Host" && <div className={styles.calendarSelectBorder}>
                    {primaryCriteria && <label className={styles.calendarSelectLabel}>Primary Search Criteria</label>}           
                    <select className={styles.calendarSelect} value={primaryCriteria} id="Primary-Buddy" onChange={(event) => {setPrimaryCriteria(event.target.value)}} required>
                      <option value="" disabled selected>Primary Search Criteria</option>
                      {buddyUsernameArray.map((buddy) => <option key={buddy.value} value={buddy.value} disabled={buddy.value === secondaryCriteria}>{buddy.label}</option>)}
                    </select>
                  </div>}  
                  {searchType === "Host" && <div className={styles.calendarSelectBorder}>
                    {secondaryCriteria && <label className={styles.calendarSelectLabel}>Secondary Search Criteria</label>}           
                    <select className={styles.calendarSelect} value={secondaryCriteria} id="Secondary-Criteria" onChange={(event) => {setSecondaryCriteria(event.target.value)}}>
                      <option value="" disabled selected>Secondary Search Criteria</option>
                      <option value="">None</option>
                      {buddyUsernameArray.map((buddy) => <option key={buddy.value} value={buddy.value} disabled={buddy.value === primaryCriteria}>{buddy.label}</option>)}
                    </select>
                  </div>}  
                  <button className="material-symbols-outlined button calendar-search-form-button" type="submit" >search</button>
                  <button className="material-symbols-outlined button calendar-close-search-button" onClick={(e) => {setToggleSearch(false), setSearchType(""), fetchProfileDetails()}}>close</button>
                </form>}
              </div>
            {!toggleSearch && !isCalendarOpen && <button title="View Monthly Calendar" onClick={()=> setIsCalendarOpen(true)} id={styles.iconButtons} className="material-symbols-outlined">calendar_month</button>}
            {!toggleSearch && isCalendarOpen && <button title="View Monthly Calendar" onClick={()=> setIsCalendarOpen(false)} id={styles.iconButtons} className="material-symbols-outlined">list</button>}
            </div>
          </div>
          <div className={styles.eventsWrapper}>
            <UserCalendar isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} displayEvents={displayEvents}/>
            {!isCalendarOpen && <div id="UserCalList">
              <button onClick={()=> setUpcomingEventsToggle(true)}>Upcoming Events {displayUpcomingEvents.length}</button>
              <button onClick={()=> setUpcomingEventsToggle(false)}>Previous Events {displayPreviousEvents.length}</button>
              {upcomingEventsToggle && <div id='upcoming events'>
                {!upcomingResultsBoolean &&<div>No upcoming events</div>}
                {displayUpcomingMoYrList.map(monthYear => <div>{monthYear}
                  {displayUpcomingEvents.map(event =>  {const eventDate = parseISO(event.date_time);
                    return (
                      (format((eventDate), 'LLLL yyyy') === monthYear &&<Link key={event.event_id} href={`/event/details/${event.event_id}`}>
                        <div className={styles.calendarEventContainer}>
                          <div className={styles.calendarEventText}>
                            <span className={styles.bold}>{format(eventDate, 'iiii LLLL do yyyy p')}</span> - {event.primary_language} {event.secondary_language && <span> & {event.secondary_language}</span>} Buddy Code
                          </div>
                        </div>
                      </Link>)
                    )
                  })}
                </div>)}
              </div>}
              {!upcomingEventsToggle && <div id='previous events'>
                {!previousResultsBoolean &&<div>No previous events</div>}
                {displayPreviousMoYrList.map(monthYear => <div>{monthYear}
                  {displayPreviousEvents.map(event =>  {const eventDate = parseISO(event.date_time);
                    return (
                      (format((eventDate), 'LLLL yyyy') === monthYear &&<Link key={event.event_id} href={`/event/details/${event.event_id}`}>
                        <div className={styles.calendarEventContainer}>
                          <div className={styles.calendarEventText}>
                            <span className={styles.bold}>{format(eventDate, 'iiii LLLL do yyyy p')}</span> - {event.primary_language} {event.secondary_language && <span> & {event.secondary_language}</span>} Buddy Code
                          </div>
                        </div>
                      </Link>)
                    )
                  })}
                </div>)}
              </div>}
            </div>}
          </div>
        </section>
      </div>
      <div className={styles.rightPanel}>
        <section className={styles.followingContainer}>
          <div className={styles.containerHeaderWrapper}>
            <p1 className={styles.containerHeading}>Following</p1>

          </div>
          {profileFollowsArray && <div className={styles.followedUsersContainer}>
            {profileFollowsArray.map ((followedUser) => (<div>
               //!! you need to set this to a spacer div
              <div className={styles.followButtonContainer}>               
                <button title="Unfollow User" id={styles.followButtons} className="material-symbols-outlined" type="submit"></button>
              </div>
              <Link key={followedUser.id} href={`/user/profile/${followedUser.id}`}>
                <div className={styles.followedUserPictureWrapper}>
                  {!followedUser.pfp_url && <img src={"/Gemini_Generated_Image_8tpel98tpel98tpe.jpeg"} alt="Profile Preview" className={styles.followedUserPicture} />}
                  {followedUser.pfp_url  && <img src={followedUser.pfp_url} alt="Profile Preview" className={styles.followedUserPicture} />}
                </div>
                <div className={styles.followedUserNameWrapper}>
                  <div className={styles.followedUserUsername}><span className={styles.followsCurly}>{`{`}</span>{followedUser.username}<span className={styles.followsCurly}>{`}`}</span></div>
                  <div className={styles.followedUserName}>{followedUser.name}</div>
                </div>
                <div className={styles.followedUserTitlesWrapper}>
                  {profileDetails.title && <div className={styles.followedUserTitle}>{followedUser.title}</div>}
                </div>
              </Link>
            </div>))}
          </div>}
        </section>
      </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Profile;





// import React, { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import Header from '../../../components/Header';
// import RequestToBecomeBuddy from '../become-a-buddy';
// import styles from '../../../styles/profile.module.css';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
// import EditModal from '../../../components/EditModal';
// import { parseISO, format } from 'date-fns';
// import { fetchAddFollow, fetchRemoveFollow } from "../../../api_calls_profile";
// import UserCalendar from '../../../components/UserCalendar';

// const Profile = ({ setCurrentPage, currentPage }) => {
//   const { data: session } = useSession();
//   const [name, setName] = useState(session?.user?.name || 'Guest');
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isBuddy, setIsBuddy] = useState(false);
//   const [followeeId, setFolloweeId] = useState("")
//   const [followsArray, setFollowsArray] = useState([]);
//   const [userEvents, setUserEvents] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const router = useRouter();
//   const { id } = router.query;
//   const [userDetails, setUserDetails] = useState({});
//   const [primaryLanguages, setPrimaryLanguages] = useState([]);
//   const [secondaryLanguages, setSecondaryLanguages] = useState([]);
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [toggleSearch, setToggleSearch] = useState(false)
//   const [primaryCriteria, setPrimaryCriteria] = useState("");
//   const [secondaryCriteria, setSecondaryCriteria] = useState("");
//   const [searchType, setSearchType] = useState("");

//   const fetchProfileDetails = async (id) => {

//     try {

//       const url = `https://codebuddiesserver.onrender.com/api/users/profile/${id}`;
//       const response = await fetch(url, {
//         method: "GET"
//       });

//       if (response.status === 200) {
//         const userData = await response.json();
//         console.log('Fetched User Data:', userData);

//         setUserDetails(userData);
//         setFolloweeId(userData.id)
//         setFollowsArray(userData.follows)
//         setPrimaryLanguages([userData.primary_language, userData.secondary_language])
//         setSecondaryLanguages(userData.programmingLanguages)
//         const userSchedule = userData.schedule
//         setUserEvents(userSchedule.events)
//         console.log(primaryLanguages[1])
//       } else {
//         console.error(`Server responded with status: ${response.status}`);
//       }
//     } catch (error) {
//       console.error('Exception:', error);
//     }
//   };


//   async function handleAddFollow(followeeId) {

//     try {
//       const results = await fetchAddFollow(followeeId);
//       console.log(results)
//       fetchProfileDetails()
//     } catch (error) {
//       console.error(error)
//     }

//   }

//   async function handleRemoveFollow(followedId) {

//     try {
//       const results = await fetchRemoveFollow(followedId);
//       console.log(results)
//       fetchProfileDetails()
//     } catch (error) {
//       console.error(error)
//     }

//   }

//   async function handleSearch(event) {
//     event.preventDefault()
//     try {
//       if (searchType === "Host") {
//         if (primaryCriteria && secondaryCriteria) {
//           const results = await fetchTwoBuddySearch(primaryCriteria, secondaryCriteria)
//           console.log(results)
//           if(results[0]) {
//           setDisplayEvents(() => results)}
//           console.log(displayEvents)
//         } else {
//           const results = await fetchOneBuddySearch(primaryCriteria)
//           console.log(displayEvents)
//           console.log(results)
//           if(results[0]) {
//             setDisplayEvents(results)
//             console.log(displayEvents)
//           }
//         }
//       }

//     } catch (error) {
//       console.error
//     }
//   }

  
//   useEffect(() => {
//     if (id) {
//     setCurrentPage("Other Profile");
//     setIsAdmin(localStorage.getItem('isAdmin') === 'true');
//     setIsBuddy(localStorage.getItem('isBuddy') === 'true');
//     setName(session?.user?.name || localStorage.getItem('username') || 'Guest');
//     fetchProfileDetails(id);
//     }
    
//   }, [setCurrentPage, session?.user?.name, id]);


//   return (
//     <div className={styles.profilePage}>
//       <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
//       < Header  {...currentPage={currentPage}}/>
//       <div className={styles.leftPanel}>
//         <section className={styles.mainDetailsContainer}>
//           <div className={styles.containerHeaderWrapper} id={styles.noBorder}>
//             <div className={styles.containerHeading}> </div>
//             <button title="Edit Profile" onClick={() => setIsModalOpen(true)} id={styles.iconButtons} className="material-symbols-outlined"></button>
//                       </div>
//           <div className={styles.profilePictureWrapper}>
//             {!userDetails.pfp_url && <img src={"/Gemini_Generated_Image_8tpel98tpel98tpe.jpeg"} alt="Profile Preview" className={styles.profilePicture} />}
//             {userDetails.pfp_url  && <img src={userDetails.pfp_url} alt="Profile Preview" className={styles.profilePicture} />}
//           </div>
//           <div className={styles.profileNameWrapper}>
//             <div className={styles.profileUsername}><span className={styles.curly}>{`{`}</span>{userDetails.username}<span className={styles.curly}>{`}`}</span></div>
//             <div className={styles.profileName}>{userDetails.name}</div>
//           </div>
//           <div className={styles.profileTitlesWrapper}>
//             {userDetails.title && <div className={styles.profileTitle}>{userDetails.title}</div>}
//             {userDetails.is_buddy == true && <div className={styles.profileStatus}>Host Buddy</div>}
//           </div>
//           <div>
//               {<button className={styles.profileGadgetButton} type="submit"  onClick={() => handleAddFollow(followeeId)}>Follow</button>}
//           </div>
//         </section>
//         <section className={styles.technologiesContainer}>
//           <div className={styles.containerHeaderWrapper}>
//             <p1 className={styles.containerHeading}>Technologies</p1>
//           </div>
//           <div className={styles.technologiesWrapper}>
//             <h6 className={styles.techSubHeaders}>Primary Technologies</h6>
//             <div className={styles.techItemWrappers}>
//               {primaryLanguages && primaryLanguages.map((language) => <div className={styles.techItems}>{language}</div>)}
//             </div>
//             <h6 className={styles.techSubHeaders}>Secondary Technologies</h6>
//             <div className={styles.techItemWrappers}>
//               {secondaryLanguages && secondaryLanguages.map((language) => <div className={styles.techItems}>{language}</div>)}
//             </div>
//           </div>
//         </section>
//       </div>
//       <div className={styles.middlePanel}>
//         <section className={styles.bioContainer}>
//           <div className={styles.containerHeaderWrapper}>
//             <p1 className={styles.containerHeading}>Bio</p1>
//           </div>
//           <div className={styles.bioTextWrapper} >
//             {!userDetails.buddy_bio && <p className={styles.bioText}>Don’t leave us guessing! Complete your bio and connect with fellow coders! Click the edit button to get started.</p>}
//             {userDetails.buddy_bio && <p className={styles.bioText}>{userDetails.buddy_bio}</p>}
//           </div>
//         </section>
//         <section className={styles.eventsContainer}>
//           <div className={styles.containerHeaderWrapper}>
//             <p1 className={styles.containerHeading}>My Events</p1>
//             {!isCalendarOpen && <button title="View Monthly Calendar" onClick={()=> setIsCalendarOpen(true)} id={styles.iconButtons} className="material-symbols-outlined">calendar_month</button>}
//             {isCalendarOpen && <button title="View Monthly Calendar" onClick={()=> setIsCalendarOpen(false)} id={styles.iconButtons} className="material-symbols-outlined">list</button>}
//           </div>
//           <UserCalendar isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} userEvents={userEvents}/>
//           {!isCalendarOpen && <div>
//             {userEvents.map(event => {
//               const eventDate = parseISO(event.date_time);
//               return (
//                 <Link key={event.event_id} href={`/event/details/${event.event_id}`}>
//                   <div className={styles.calendarEventContainer}>
//                     <div className={styles.calendarEventText}>
//                       <span className={styles.bold}>{format(eventDate, 'iiii LLLL do p')}</span> - {event.primary_language} {event.secondary_language && <span> & {event.secondary_language}</span>} Buddy Code
//                     </div>
//                   </div>
//                 </Link>
//               )
//             })}
//           </div>}
//         </section>
//       </div>
//       <div className={styles.rightPanel}>
//         <section className={styles.followingContainer}>
//           <div className={styles.containerHeaderWrapper}>
//             <p1 className={styles.containerHeading}>Following</p1>
//           </div>
//           {followsArray && <div className={styles.followedUsersContainer}>
//             {followsArray.map ((followedUser) => (<div>
//               <div className={styles.followButtonContainer}>
//               </div>
//               <Link key={followedUser.id} href={`/user/profile/${followedUser.id}`}>
//                 <div className={styles.followedUserPictureWrapper}>
//                   {!followedUser.pfp_url && <img src={"/Gemini_Generated_Image_8tpel98tpel98tpe.jpeg"} alt="Profile Preview" className={styles.followedUserPicture} />}
//                   {followedUser.pfp_url  && <img src={followedUser.pfp_url} alt="Profile Preview" className={styles.followedUserPicture} />}
//                 </div>
//                 <div className={styles.followedUserNameWrapper}>
//                   <div className={styles.followedUserUsername}><span className={styles.followsCurly}>{`{`}</span>{followedUser.username}<span className={styles.followsCurly}>{`}`}</span></div>
//                   <div className={styles.followedUserName}>{followedUser.name}</div>
//                 </div>
//                 <div className={styles.followedUserTitlesWrapper}>
//                   {userDetails.title && <div className={styles.followedUserTitle}>{followedUser.title}</div>}
//                 </div>
//               </Link>
//             </div>))}
//           </div>}
//         </section>
//       </div>
//     </div>
//   );
// }

// export default Profile;

