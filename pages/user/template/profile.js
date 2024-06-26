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
      < Header />
      <div className={styles.leftPanel}>
        <div className={styles.mainDetailsContainer}>
          <div className={styles.profilePictureWrapper}>
            {updatedPfpUrl && <img src={updatedPfpUrl} alt="Profile Preview" className={styles.profilePicture} />}
          </div>
        </div>
        <div className={styles.technologiesContainer}>
          <p1 className={styles.containerHeader}>Technologies</p1>
        </div>
      </div>
      <div className={styles.middlePanel}>
        <div className={styles.bioContainer}>
        <p1 className={styles.containerHeader}>Bio</p1>
          <div className={styles.bioTextWrapper}>
            <p className={styles.bioText}>I am a seasoned software engineer with over a decade of experience in developing cutting-edge applications and leading innovative projects in the tech industry. Currently, I serve as a Senior Software Engineer at XYZ Tech Solutions, where I specialize in cloud computing and artificial intelligence, focusing on creating forward-thinking solutions that enhance business efficiency and user experience.</p>
          </div>
        </div>
        <div className={styles.eventsContainer}>
          <p1 className={styles.containerHeader}>Events</p1>
        </div>
      </div>
        
      <div className={styles.rightPanel}>
        <div className={styles.followingContainer}>
        <p1 className={styles.containerHeader}>Following</p1>
        </div>

      </div>

    </div>
  );
}

export default Profile;



