import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '../../../components/Header';
import styles from './myProfile.module.css';
import { useRouter } from 'next/router';
import Link from 'next/link';
import EditModal from '../../../components/EditModal';
import MessageBox from '../../../components/MessageBox';
import { parseISO, format } from 'date-fns';
import { fetchAddFollow, fetchRemoveFollow, } from "../../../api_calls_profile";
import UserCalendar from '../../../components/UserCalendar';

const Profile = ({ setCurrentPage, currentPage }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = useState(session?.user?.name || 'Guest');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBuddy, setIsBuddy] = useState(false);
  const [followeeId, setFolloweeId] = useState("")
  const [followsArray, setFollowsArray] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [primaryCriteria, setPrimaryCriteria] = useState("");
  const [secondaryCriteria, setSecondaryCriteria] = useState("");
  const [searchType, setSearchType] = useState("");

  
  const [userDetails, setUserDetails] = useState({});
  const [primaryLanguages, setPrimaryLanguages] = useState([]);
  const [secondaryLanguages, setSecondaryLanguages] = useState([]);
  const [updatedUsername, setUpdatedUsername] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedPfpUrl, setUpdatedPfpUrl] = useState('');
  const [updatedPrimaryLanguage, setUpdatedPrimaryLanguage] = useState('');
  const [updatedSecondaryLanguage, setUpdatedSecondaryLanguage] = useState('');
  const [updatedBuddyBio, setUpdatedBuddyBio] = useState('');
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false)

  const toggleBox = () => {
    setIsBoxOpen((prev) => !prev);
  };

  const handleProfileUpdate = async (updatedData) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.status === 200) {
        alert('User details updated successfully');
        fetchUserDetails();
      } else {
        alert('Failed to update user details');
      }
    } catch (error) {
      console.error('Exception:', error);
      alert('Error while updating user details');
    }
    console.log("Updated Data:", updatedData);
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

        setUserDetails(userData);
        setFolloweeId(userData.id)
        setFollowsArray(userData.follows)
        setPrimaryLanguages([userData.primary_language, userData.secondary_language])
        setSecondaryLanguages(userData.programmingLanguages)
        const userSchedule = userData.schedule
        setUserEvents(userSchedule.events)
        console.log(primaryLanguages[1])
        console.log(userData.follows)
        console.log(userSchedule.events)
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
      fetchUserDetails()
    } catch (error) {
      console.error(error)
    }

  }

  // ! you need to fix this with the styling and also then add it on to id.js
  async function handleSearch(event) {
    event.preventDefault()
    try {
      if (searchType === "Host") {
        if (primaryCriteria && secondaryCriteria) {
          const results = await fetchTwoBuddySearch(primaryCriteria, secondaryCriteria)
          console.log(results)

          if (!results[0]) {
            setDisplayEvents([])
            alert("No Results")
          }
          if(results[0].event_id) {
            setDisplayEvents(() => results)
          }
          
        } else {
          const results = await fetchOneBuddySearch(primaryCriteria)
          console.log(results)

          if (!results[0]) {
            setDisplayEvents([])
            alert("No Results")
          }
          if(results[0].event_id) {
            setDisplayEvents(results)
          }

        }
      }

      // ! you need to change this code search function
      // if (searchType === "Host") {
      //   if (primaryCriteria && secondaryCriteria) {
      //     const results = await fetchTwoBuddySearch(primaryCriteria, secondaryCriteria)
      //     console.log(results)

      //     if (!results[0]) {
      //       setDisplayEvents([])
      //       alert("No Results")
      //     }
      //     if(results[0].event_id) {
      //       setDisplayEvents(() => results)
      //     }
          
      //   } else {
      //     const results = await fetchOneBuddySearch(primaryCriteria)
      //     console.log(results)

      //     if (!results[0]) {
      //       setDisplayEvents([])
      //       alert("No Results")
      //     }
      //     if(results[0].event_id) {
      //       setDisplayEvents(results)
      //     }

      //   }
      // }

    } catch (error) {
      console.error
    }
  }

  useEffect(() => {
    if (userDetails) {
      setUpdatedUsername(userDetails.username || '');
      setUpdatedEmail(userDetails.email || '');
      setUpdatedTitle(userDetails.title || '');
      setUpdatedPfpUrl(userDetails.pfp_url || '');
      setUpdatedPrimaryLanguage(userDetails.primary_language || '');
      setUpdatedSecondaryLanguage(userDetails.secondary_language || '');
      setUpdatedBuddyBio(userDetails.buddy_bio || '');
    }
  }, [userDetails]);  
  
  useEffect(() => {
    setCurrentPage("User Profile");
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    setIsBuddy(localStorage.getItem('isBuddy') === 'true');
    setName(session?.user?.name || localStorage.getItem('username') || 'Guest');
    fetchUserDetails();
  }, [setCurrentPage, session?.user?.name]);


  return (
    <div className={styles.profilePage}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      < Header  {...currentPage={currentPage}}/>
      <div className={styles.leftPanel}>
        <section className={styles.mainDetailsContainer}>
          <div className={styles.containerHeaderWrapper} id={styles.noBorder}>
            <div className={styles.containerHeading}> </div>
            <button title="Edit Profile" onClick={() => setIsModalOpen(true)} id={styles.iconButtons} className="material-symbols-outlined">edit_square</button>
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
            {(userDetails.is_buddy == true) && (userDetails.isAdmin == false) && <Link href="/event/add">
              <button className={styles.profileGadgetButton}>Add Event</button>
            </Link>}
            {!userDetails.is_buddy && <Link href="/user/become-a-buddy">
             <button className={styles.profileGadgetButton}>Become a Buddy</button>
            </Link>}
            {userDetails.isAdmin == true && (
            <>
              <button 
                className={styles.profileGadgetButton} 
                onClick={toggleBox}
              >
              {isBoxOpen ? 'Manage Buddies' : 'Manage Buddies'}
              </button>
              {isBoxOpen && (
                <MessageBox isOpen={isBoxOpen} onClose={toggleBox}>
                  <p>Your content goes here!</p>
                </MessageBox>
              )}
            </>
            )}
          </div>
        </section>
        <section className={styles.technologiesContainer}>
          <div className={styles.containerHeaderWrapper}>
            <p1 className={styles.containerHeading}>Technologies</p1>
            <button title="Edit Profile" id={styles.iconButtons} onClick={() => setIsModalOpen(true)} className="material-symbols-outlined">edit_square</button>
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
            <button title="Edit Profile" id={styles.iconButtons} onClick={() => setIsModalOpen(true)} className="material-symbols-outlined">edit_square</button>
          </div>
          <div className={styles.bioTextWrapper} >
            {!userDetails.buddy_bio && <p className={styles.bioText}>Don’t leave us guessing! Complete your bio and connect with fellow coders! Click the edit button to get started.</p>}
            {userDetails.buddy_bio && <p className={styles.bioText}>{userDetails.buddy_bio}</p>}
          </div>
        </section>
        <section className={styles.eventsContainer}>
          <div className={styles.containerHeaderWrapper}>
            <p1 className={styles.containerHeading}>My Events</p1>                
            {!toggleSearch &&<button onClick={() => setToggleSearch(true)} title="Search" className="material-symbols-outlined search">search</button>}
            {toggleSearch && <form className={styles.calendarSearchFormContainer} onSubmit={handleSearch}>
              <div className={styles.calendarSelectBorder}>
                {searchType && <label className={styles.calendarSelectLabel}>Search Type</label>}
                <select className={styles.calendarSelect} onChange={(event) => setSearchType(event.target.value)} required>
                  <option value="" disabled selected>Search Type</option>
                  <option value="Host">Host Buddies</option>
                  <option value="Code">Code Languages</option>
                </select>
              </div>
              {searchType === "Code" && <div className={styles.calendarSelectBorder}>
                {primaryCriteria && <label className={styles.calendarSelectLabel}>Primary Language</label>}           
                <select className={styles.calendarSelect} value={primaryCriteria} id="Primary-Language" onChange={(event) => {setPrimaryCriteria(event.target.value)}} required>
                  <option value="" disabled selected>Primary Language</option>
                  {codeLanguageObjectArray.map((language) => <option key={language.value} value={language.value} disabled={language.value === secondaryCriteria}>{language.label}</option>)}
                </select>
              </div>}  
              {searchType === "Code" && <div className={styles.calendarSelectBorder}>
                {secondaryCriteria && <label className={styles.calendarSelectLabel}>Secondary Language</label>}           
                <select className={styles.calendarSelect} value={secondaryCriteria} id="Secondary-Criteria" onChange={(event) => {setSecondaryCriteria(event.target.value)}}>
                  <option value="" disabled selected>Secondary Language</option>
                  {codeLanguageObjectArray.map((language) => <option key={language.value} value={language.value} disabled={language.value === primaryCriteria}>{language.label}</option>)}
                </select>
              </div>}  
                <button className="material-symbols-outlined button calendar-search-form-button" type="submit" >search</button>
                <button className="material-symbols-outlined button calendar-close-search-button" onClick={(e) => setToggleSearch(false)}>close</button>
            </form>}
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
            <button title="Find others to follow" id={styles.iconButtons} className="material-symbols-outlined">person_add</button>
          </div>
          {followsArray && <div className={styles.followedUsersContainer}>
            {followsArray.map ((followedUser) => (<div>
              <div className={styles.followButtonContainer}>
                <button title="Unfollow User" id={styles.followButtons} className="material-symbols-outlined" type="submit"  onClick={() => handleRemoveFollow(followedUser.id)}>person_remove</button>
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
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userDetails={userDetails}
        handleProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
}

export default Profile;

