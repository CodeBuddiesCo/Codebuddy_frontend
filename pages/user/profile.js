import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import Header from '../../components/Header';
import RequestToBecomeBuddy from './become-a-buddy';
import styles from '../../styles/profile.module.css';
import { useRouter } from 'next/router';
import EditModal from '../../components/EditModal';
import { codeLanguageArray } from '../../Arrays/CodeLanguageArray';

const Profile = ({ setCurrentPage, currentPage }) => {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || 'Guest');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBuddy, setIsBuddy] = useState(false);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    fetchUserDetails();
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
    <div className={styles.profileContainer}>
      <Header />
      <div className={styles.mainContent}>
        <div className={styles.leftSidebar}>
          <aside className={`${styles.profileSidebar} ${styles.relativePosition}`}>
            <button className={styles.editButton} onClick={() => setIsModalOpen(true)}>
              <FontAwesomeIcon icon={faEdit} className={styles.largeIcon} /> Edit
            </button>
            <div className={`${styles.profilePictureSection} ${styles.sidebarItem}`}>
              {userDetails.pfp_url ? (
                <img src={userDetails.pfp_url} alt="Profile" className={styles.profilePicture} />
              ) : (
                <p>No profile picture set.</p>
              )}
            </div>
            <div className={`${styles.profileName} ${styles.sidebarItem}`}>
              <p className={styles.nameHeader}>{userDetails.name}</p>
            </div>
            <div className={styles.profileUsername}>
              <p className={styles.dataContent}>{userDetails.username}</p>
            </div>
            <div className={styles.profileDetails}>
              <div className={styles.messagesBox}>
                {!isBuddy && !isAdmin && (
                  <div className={styles.requestToBecomeBuddySection}>
                    <RequestToBecomeBuddy setCurrentPage={setCurrentPage} currentPage={currentPage} />
                  </div>
                )}
              </div>
              <div className={styles.detailRow}>
                <p className={styles.detailTitle}><strong>Title:</strong></p>
                <p className={styles.dataContent}>{userDetails.title}</p>
              </div>
              <div className={styles.detailRow}>
                <p className={styles.detailTitle}><strong>Status:</strong></p>
                <p className={`${styles.dataContent} ${styles.adminHeader}`}>{isAdmin ? 'Admin' : isBuddy ? 'Buddy' : 'User'}</p>
              </div>
              <p className={`${styles.dataContent} ${styles.languageBubble}`}>
                <span className={styles.goldStar}>★</span> {userDetails.primary_language}
              </p>
              <p className={`${styles.dataContent} ${styles.languageBubble}`}>
                <span className={styles.silverStar}>★</span> {userDetails.secondary_language}
              </p>
              <p className={styles.dataContent}>{userDetails.email}</p>
            </div>
            {isAdmin && (
              <div>
                <div className={styles.adminSection}>
                  <button className={styles.buddiesButton} onClick={() => router.push('/user/manage-buddies')}>Manage Buddies</button>
                  <button className={styles.messagesButton} onClick={() => router.push('/user/messages')}>Manage Messages</button>
                </div>
              </div>
            )}
          </aside>
        </div>
        <div className={styles.centerColumns}>
          <div className={styles.centerColumn}>
            <div className={`${styles.topCenterPlaceholder} ${styles.relativePosition}`}>
              <h2 className={styles.bioHeader}>Biography</h2>
              <p className={styles.buddyBio}>{userDetails.buddy_bio}</p>
            </div>
          </div>
          <div className={styles.centerColumn}>
            <div className={styles.techSection}>
              <p className={styles.techHeader}>Technologies</p>
              <ul className={styles.techList}>
                {userDetails.programmingLanguages.map((language, index) => (
                  <li key={index} className={styles.techContent}>{language}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.centerColumn}>
            <div className={styles.eventsSection}>
              <h3 className={styles.eventsHeader}>Events Placeholder</h3>
            </div>
          </div>
        </div>
        <div className={`${styles.sidebar} ${styles.rightSidebar}`}>
          <div className={`${styles.profileBio} ${styles.relativePosition}`}>
            <h2 className={styles.bioHeader}>Biography</h2>
            <p className={styles.buddyBio}>{userDetails.buddy_bio}</p>
          </div>
        </div>
      </div>
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userDetails={userDetails}
        handleProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default Profile;
