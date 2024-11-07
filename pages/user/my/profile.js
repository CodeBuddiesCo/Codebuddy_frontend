import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ReceivedMessages from '../../../components/ReceivedMessages';
import DeletedMessages from '../../../components/DeletedMessages';
import DemoteBuddy from '../../../components/DemoteBuddy';
import Header from '../../../components/Header';
import RequestToBecomeBuddy from '../become-a-buddy';
import styles from './/profile.module.css';
import { codeLanguageArray } from '../../../Arrays/CodeLanguageArray';
import { useRouter } from 'next/router';
import Link from 'next/link';
import EditModal from '../../../components/EditModal';
import { fetchAddFollow,  } from "../../../profile_api_calls";

const Profile = ({ setCurrentPage, currentPage }) => {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || 'Guest');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBuddy, setIsBuddy] = useState(false);
  const [followeeId, setFolloweeId] = useState("")
  const [followsArray, setFollowsArray] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  
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
        console.log(primaryLanguages[1])
        console.log(userData.follows)
      } else {
        console.error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Exception:', error);
    }
  };

  // const fetchProfileDetails = async () => {

  //   try {

  //     const url = `https://codebuddiesserver.onrender.com/api/users/profile/${5}`;
  //     const response = await fetch(url, {
  //       method: "GET"
  //     });

  //     if (response.status === 200) {
  //       const userData = await response.json();
  //       console.log('Fetched User Data:', userData);

  //       setUserDetails(userData);
  //       setFolloweeId(userData.id)
  //       setPrimaryLanguages([userData.primary_language, userData.secondary_language])
  //       setSecondaryLanguages(userData.programmingLanguages)
  //       console.log(primaryLanguages[1])
  //     } else {
  //       console.error(`Server responded with status: ${response.status}`);
  //     }
  //   } catch (error) {
  //     console.error('Exception:', error);
  //   }
  // };



  async function handleAddFollow(followeeId) {

    try {
      const results = await fetchAddFollow(followeeId);
      console.log(results)
    } catch (error) {
      console.error(error)
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
    // fetchProfileDetails();
  }, [setCurrentPage, session?.user?.name]);


  return (
    <div className={styles.profilePage}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      < Header />
      <div className={styles.leftPanel}>
        <section className={styles.mainDetailsContainer}>
          <div className={styles.containerHeaderWrapper}>
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
            {userDetails.is_buddy === true && <div className={styles.profileStatus}>Host Buddy</div>}
          </div>
          <div>
            <Link href="/event/add">
              {(userDetails.is_buddy == true) && (userDetails.isAdmin == false) && <button className={styles.profileGadgetButton}>Add Event</button>}
            </Link>
            <Link href="/user/become-a-buddy">
              {!userDetails.is_buddy && <button className={styles.profileGadgetButton}>Become a Buddy</button>}
            </Link>
            <Link href="/">
              {userDetails.isAdmin == true && <button className={styles.profileGadgetButton}>Manage Buddies</button>}
            </Link>

              {<button className={styles.profileGadgetButton} type="submit"  onClick={() => handleAddFollow(followeeId)}>Follow</button>}
          </div>
        </section>
        <section className={styles.technologiesContainer}>
          <div className={styles.containerHeaderWrapper}>
            <p1 className={styles.containerHeading}>Technologies</p1>
            <button title="Edit Profile" id={styles.iconButtons} onClick={() => setIsModalOpen(true)} className="material-symbols-outlined">edit_square</button>
          </div>
          <h6 className={styles.techSubHeaders}>Primary Technologies</h6>
          <div className={styles.techItemWrappers}>
          {primaryLanguages && primaryLanguages.map((language) => <div className={styles.techItems}>{language}</div>)}
          </div>
          <h6 className={styles.techSubHeaders}>Secondary Technologies</h6>
          <div className={styles.techItemWrappers}>
            {secondaryLanguages && secondaryLanguages.map((language) => <div className={styles.techItems}>{language}</div>)}
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
            <button title="View Monthly Calendar" id={styles.iconButtons} className="material-symbols-outlined">calendar_month</button>
          </div>
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



