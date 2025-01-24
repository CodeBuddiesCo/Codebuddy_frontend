
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '../../../components/Header';
import RequestToBecomeBuddy from '../become-a-buddy';
import styles from './profile_id.module.css';
import { useRouter } from 'next/router';
import Link from 'next/link';
import EditModal from '../../../components/EditModal';
import { parseISO, format } from 'date-fns';
import { fetchAddFollow, fetchRemoveFollow } from "../../../api_calls_profile";
import UserCalendar from '../../../components/UserCalendar';

const Profile = ({ setCurrentPage, currentPage }) => {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || 'Guest');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBuddy, setIsBuddy] = useState(false);
  const [followeeId, setFolloweeId] = useState("")
  const [followsArray, setFollowsArray] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const [userDetails, setUserDetails] = useState({});
  const [primaryLanguages, setPrimaryLanguages] = useState([]);
  const [secondaryLanguages, setSecondaryLanguages] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false)
  const [primaryCriteria, setPrimaryCriteria] = useState("");
  const [secondaryCriteria, setSecondaryCriteria] = useState("");
  const [searchType, setSearchType] = useState("");

  const fetchProfileDetails = async (id) => {

    try {

      const url = `https://codebuddiesserver.onrender.com/api/users/profile/${id}`;
      const response = await fetch(url, {
        method: "GET"
      });

      if (response.status === 200) {
        const userData = await response.json();
        console.log('Fetched User Data:', userData);

        setUserDetails(userData);
        setFolloweeId(userData.id)
        setFollowsArray(userData.follows)
        setPrimaryLanguages([userData.primary_language, userData.secondary_language])
        setSecondaryLanguages(userData.programmingLanguages)
        const userSchedule = userData.schedule
        setUserEvents(userSchedule.events)
        console.log(primaryLanguages[1])
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
      fetchProfileDetails()
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
      if (searchType === "Host") {
        if (primaryCriteria && secondaryCriteria) {
          const results = await fetchTwoBuddySearch(primaryCriteria, secondaryCriteria)
          console.log(results)
          if(results[0]) {
          setDisplayEvents(() => results)}
          console.log(displayEvents)
        } else {
          const results = await fetchOneBuddySearch(primaryCriteria)
          console.log(displayEvents)
          console.log(results)
          if(results[0]) {
            setDisplayEvents(results)
            console.log(displayEvents)
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
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    setIsBuddy(localStorage.getItem('isBuddy') === 'true');
    setName(session?.user?.name || localStorage.getItem('username') || 'Guest');
    fetchProfileDetails(id);
    }
    
  }, [setCurrentPage, session?.user?.name, id]);


  return (
    <div className={styles.profilePage}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      < Header  {...currentPage={currentPage}}/>
      <div className={styles.leftPanel}>
        <section className={styles.mainDetailsContainer}>
          <div className={styles.containerHeaderWrapper} id={styles.noBorder}>
            <div className={styles.containerHeading}> </div>
            <button title="Edit Profile" onClick={() => setIsModalOpen(true)} id={styles.iconButtons} className="material-symbols-outlined"></button>
                      </div>
          <div className={styles.profilePictureWrapper}>
            {!userDetails.pfp_url && <img src={"/Gemini_Generated_Image_8tpel98tpel98tpe.jpeg"} alt="Profile Preview" className={styles.profilePicture} />}
            {userDetails.pfp_url  && <img src={userDetails.pfp_url} alt="Profile Preview" className={styles.profilePicture} />}
          </div>
          <div className={styles.profileNameWrapper}>
            <div className={styles.profileUsername}><span className={styles.curly}>{`{`}</span>{userDetails.username}<span className={styles.curly}>{`}`}</span></div>
            <div className={styles.profileName}>{userDetails.name}</div>
          </div>
          <div className={styles.profileTitlesWrapper}>
            {userDetails.title && <div className={styles.profileTitle}>{userDetails.title}</div>}
            {userDetails.is_buddy == true && <div className={styles.profileStatus}>Host Buddy</div>}
          </div>
          <div>
              {<button className={styles.profileGadgetButton} type="submit"  onClick={() => handleAddFollow(followeeId)}>Follow</button>}
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
            {!userDetails.buddy_bio && <p className={styles.bioText}>Don’t leave us guessing! Complete your bio and connect with fellow coders! Click the edit button to get started.</p>}
            {userDetails.buddy_bio && <p className={styles.bioText}>{userDetails.buddy_bio}</p>}
          </div>
        </section>
        <section className={styles.eventsContainer}>
          <div className={styles.containerHeaderWrapper}>
            <p1 className={styles.containerHeading}>My Events</p1>
            {!isCalendarOpen && <button title="View Monthly Calendar" onClick={()=> setIsCalendarOpen(true)} id={styles.iconButtons} className="material-symbols-outlined">calendar_month</button>}
            {isCalendarOpen && <button title="View Monthly Calendar" onClick={()=> setIsCalendarOpen(false)} id={styles.iconButtons} className="material-symbols-outlined">list</button>}
          </div>
          <UserCalendar isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} userEvents={userEvents}/>
          {!isCalendarOpen && <div>
            {userEvents.map(event => {
              const eventDate = parseISO(event.date_time);
              return (
                <Link key={event.event_id} href={`/event/details/${event.event_id}`}>
                  <div className={styles.calendarEventContainer}>
                    <div className={styles.calendarEventText}>
                      <span className={styles.bold}>{format(eventDate, 'iiii LLLL do p')}</span> - {event.primary_language} {event.secondary_language && <span> & {event.secondary_language}</span>} Buddy Code
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>}
        </section>
      </div>
      <div className={styles.rightPanel}>
        <section className={styles.followingContainer}>
          <div className={styles.containerHeaderWrapper}>
            <p1 className={styles.containerHeading}>Following</p1>
          </div>
          {followsArray && <div className={styles.followedUsersContainer}>
            {followsArray.map ((followedUser) => (<div>
              <div className={styles.followButtonContainer}>
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
                  {userDetails.title && <div className={styles.followedUserTitle}>{followedUser.title}</div>}
                </div>
              </Link>
            </div>))}
          </div>}
        </section>
      </div>
    </div>
  );
}

export default Profile;

