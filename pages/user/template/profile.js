import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import ReceivedMessages from '../../../components/ReceivedMessages';
import DeletedMessages from '../../../components/DeletedMessages';
import DemoteBuddy from '../../../components/DemoteBuddy';
import Header from '../../../components/Header';
import RequestToBecomeBuddy from '../become-a-buddy';
import styles from './/profile.module.css';
import { codeLanguageArray } from '../../../Arrays/CodeLanguageArray';
import { useRouter } from 'next/router';

const Profile = ({ setCurrentPage, currentPage }) => {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || 'Guest');
  // const [receivedMessages, setReceivedMessages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBuddy, setIsBuddy] = useState(false);
  // const [deletedMessages, setDeletedMessages] = useState([]);
  // const [viewingDeleted, setViewingDeleted] = useState(false);
  // const [viewingDemoteBuddy, setViewingDemoteBuddy] = useState(false);
  const router = useRouter();

  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    title: '',
    pfp_url: '',
    primary_language: '',
    secondary_language: '',
    buddy_bio: '',
    programmingLanguages: []
  });

  // const [buddies, setBuddies] = useState([]);
  const [updatedUsername, setUpdatedUsername] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedPfpUrl, setUpdatedPfpUrl] = useState('');
  const [updatedPrimaryLanguage, setUpdatedPrimaryLanguage] = useState('');
  const [updatedSecondaryLanguage, setUpdatedSecondaryLanguage] = useState('');
  const [updatedBuddyBio, setUpdatedBuddyBio] = useState('');
  const [selectedTech, setSelectedTech] = useState([]);

  const [isSidebarEditable, setIsSidebarEditable] = useState(false);
  const [isBioEditable, setIsBioEditable] = useState(false);


  useEffect(() => {
    setCurrentPage("User Profile");
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    setIsBuddy(localStorage.getItem('isBuddy') === 'true');
    setName(session?.user?.name || localStorage.getItem('username') || 'Guest');
    // fetchReceivedMessages();
    // fetchDeletedMessages();
    fetchUserDetails();
    // fetchBuddies();
  }, [setCurrentPage, session?.user?.name]);

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
    console.log(userDetails.programmingLanguages);
  }, [userDetails]);



  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleTechChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedTech(prev => [...prev, value]);
    } else {
      setSelectedTech(prev => prev.filter(tech => tech !== value));
    }
  };

  const toggleSidebarEditMode = () => {
    setIsSidebarEditable(!isSidebarEditable);
    if (isBioEditable) setIsBioEditable(false);
  };

  const toggleBioEditMode = () => {
    setIsBioEditable(!isBioEditable);
    if (isSidebarEditable) setIsSidebarEditable(false);
  };

  const handleProfileUpdate = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const updatedData = {
      username: updatedUsername,
      email: updatedEmail,
      title: updatedTitle,
      pfp_url: updatedPfpUrl,
      primary_language: updatedPrimaryLanguage,
      secondary_language: updatedSecondaryLanguage,
      buddy_bio: updatedBuddyBio,
      programmingLanguages: selectedTech,
    };

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
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const userData = await response.json();
        console.log('Fetched User Data:', userData);

        setUserDetails(userData);
      } else {
        console.error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Exception:', error);
    }
  };


  return (
    <div className={styles.profilePage}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      < Header />
      <div className={styles.leftPanel}>
        <div className={styles.mainDetailsContainer}>
          <div className={styles.containerHeaderWrapper}>
            <div className={styles.containerHeading}> </div>
            <button title="Edit Profile" id={styles.iconButtons} className="material-symbols-outlined">edit_square</button>
          </div>
          <div className={styles.profilePictureWrapper}>
            {updatedPfpUrl && <img src={updatedPfpUrl} alt="Profile Preview" className={styles.profilePicture} />}
          </div>
          <div className={styles.profileNameWrapper}>
            <div className={styles.profileUsername}><span className={styles.curly}>{`{`}</span>{userDetails.username}<span className={styles.curly}>{`}`}</span></div>
            <div className={styles.profileName}>{userDetails.name}</div>
          </div>
        </div>
        <div className={styles.technologiesContainer}>
          <div className={styles.containerHeaderWrapper}>
            <p1 className={styles.containerHeading}>Technologies</p1>
            <button title="Edit Profile" id={styles.iconButtons} className="material-symbols-outlined">edit_square</button>
          </div>
        </div>
      </div>
      <div className={styles.middlePanel}>
        <div className={styles.bioContainer}>
          <div className={styles.containerHeaderWrapper}>
            <p1 className={styles.containerHeading}>Bio</p1>
            <button title="Edit Profile" id={styles.iconButtons} className="material-symbols-outlined">edit_square</button>
          </div>
          <div className={styles.bioTextWrapper} >
            {!userDetails.buddy_bio && <p className={styles.bioText}>Don’t leave us guessing! Complete your bio and connect with fellow coders! Click the edit button to get started.</p>}
            {userDetails.buddy_bio && <p className={styles.bioText}>{userDetails.buddy_bio}</p>}
          </div>
        </div>
        <div className={styles.eventsContainer}>
          <div className={styles.containerHeaderWrapper}>
            <p1 className={styles.containerHeading}>My Events</p1>
            <button title="View Monthly Calendar" id={styles.iconButtons} className="material-symbols-outlined">calendar_month</button>
          </div>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.followingContainer}>
          <div className={styles.containerHeaderWrapper}>
            <p1 className={styles.containerHeading}>Following</p1>
            <button title="Add person to follow" id={styles.iconButtons} className="material-symbols-outlined">person_add</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;



