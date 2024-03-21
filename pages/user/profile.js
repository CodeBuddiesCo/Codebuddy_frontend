import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import ReceivedMessages from '../../components/ReceivedMessages';
import DeletedMessages from '../../components/DeletedMessages';
import DemoteBuddy from '../../components/DemoteBuddy';
import Header from '../../components/Header';
import RequestToBecomeBuddy from './become-a-buddy';
import styles from '../../styles/profile.module.css';
import { codeLanguageArray } from '../../Arrays/CodeLanguageArray';

const Profile = ({ setCurrentPage, currentPage }) => {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || 'Guest');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBuddy, setIsBuddy] = useState(false);
  const [deletedMessages, setDeletedMessages] = useState([]);
  const [viewingDeleted, setViewingDeleted] = useState(false);
  const [viewingDemoteBuddy, setViewingDemoteBuddy] = useState(false);

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

  const [buddies, setBuddies] = useState([]);
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
    fetchReceivedMessages();
    fetchDeletedMessages();
    fetchUserDetails();
    fetchBuddies();
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
    // Optionally, disable bio editing when enabling sidebar editing
    if (isBioEditable) setIsBioEditable(false);
  };

  // Function to toggle edit mode for the bio section
  const toggleBioEditMode = () => {
    setIsBioEditable(!isBioEditable);
    // Optionally, disable sidebar editing when enabling bio editing
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

  const handleSoftDelete = async (messageId, index) => {
    const token = localStorage.getItem('token');
    const newReceivedMessages = [...receivedMessages];
    const deletedMsg = newReceivedMessages.splice(index, 1)[0];

    setDeletedMessages([...deletedMessages, deletedMsg]);
    setReceivedMessages(newReceivedMessages);

    try {
      const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/message/${messageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        try {
          const textResponse = await response.text();
          console.log('Raw server response:', textResponse);


          const deletedMessageData = JSON.parse(textResponse);
          console.log('Parsed server response:', deletedMessageData);
        } catch (error) {
          console.error('Failed to parse JSON:', error);
        }
        alert('Message marked for deletion');
        fetchReceivedMessages();
      } else {
        newReceivedMessages.splice(index, 0, deletedMsg);
        setReceivedMessages(newReceivedMessages);
      }
    } catch (error) {
      console.error('Exception:', error);
    }
  };

  const fetchDeletedMessages = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/deletedMessages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setDeletedMessages(await response.json());
      } else {
        console.error(`Server responded with status: ${response.status}`);
        const data = await response.json();
        console.log('Server response:', data);

        const responseData = await response.json();
        console.error('Response data:', responseData);
      }
    } catch (error) {
      console.error('Exception:', error);
    }
  };

  const fetchReceivedMessages = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const allMessages = await response.json();
        const filteredMessages = allMessages.filter(msg => !msg.marked_for_deletion && !msg.sender_is_buddy);
        setReceivedMessages(filteredMessages);
        console.log('All messages:', allMessages);

      }
    } catch (error) {
      console.error('Exception:', error);
    }
  };

  const promoteToBuddy = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/promote/${userId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        alert('User successfully promoted to buddy');
      } else {
        alert('Failed to promote user: ' + (await response.json()).message || 'Unknown error');
      }
    } catch (error) {
      console.error('Exception:', error);
    }
  };

  const demoteFromBuddy = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/demote/${userId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        alert('User successfully demoted from buddy');
        fetchBuddies();
      } else {
        const errorResponse = await response.json();
        alert(`Failed to demote user: ${errorResponse.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Exception:', error);
      alert('Error while demoting user');
    }
  };

  const fetchBuddies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const allUsers = await response.json();
        const buddies = allUsers.filter(user => user.is_buddy);
        setBuddies(buddies);
      } else {
        console.error(`Server responded with status: ${response.status}`);
        alert('Failed to fetch users');
      }
    } catch (error) {
      console.error('Exception:', error);
      alert('Error while fetching users');
    }
  };

  return (
    <div className={styles.profilePageContainer}>
      < Header />
      <div className={styles.mainContent}>
        <aside className={`${styles.profileSidebar} ${styles.relativePosition}`}>
          {!isSidebarEditable ? ( 
            <div className={styles.editIcon} onClick={toggleSidebarEditMode} style={{ cursor: 'pointer', position: 'absolute', top: '20px', right: '20px' }}>
              <FontAwesomeIcon icon={faEdit} />
            </div>
          ) : ( 
            <div className={styles.editOptions} style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
              <div className={styles.saveIcon} onClick={handleProfileUpdate} style={{ cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faSave} />
              </div>
              <div className={styles.cancelIcon} onClick={toggleSidebarEditMode} style={{ cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faTimes} />
              </div>
            </div>
          )}
          <div className={styles.profilePictureSection}>
            {isSidebarEditable ? (
              <div className={styles.profilePictureWrapper}>
                {updatedPfpUrl && <img src={updatedPfpUrl} alt="Profile Preview" className={styles.profilePicture} />}
                <input
                  type="text"
                  placeholder="Enter new profile URL"
                  value={updatedPfpUrl}
                  onChange={(e) => handleInputChange(e, setUpdatedPfpUrl)}
                  className={styles.profileUrlInput}
                />
              </div>
            ) : userDetails.pfp_url ? (
              <img src={userDetails.pfp_url} alt="Profile" className={styles.profilePicture} />
            ) : (
              <p>No profile picture set.</p>
            )}
          </div>
          <div className={styles.profileName}>
            <p>{userDetails.name}</p>
          </div>
          <div className={styles.profileUsername}>
            <p>{isSidebarEditable ? <input type="text" value={updatedUsername} onChange={(e) => handleInputChange(e, setUpdatedUsername)} /> : userDetails.username}</p>
          </div>
          <div className={styles.profileDetails}>
            <p><strong>Title:</strong><br />{isSidebarEditable ? <input type="text" value={updatedTitle} onChange={(e) => handleInputChange(e, setUpdatedTitle)} /> : userDetails.title}</p>
            <p><strong>Status:</strong><br />{isAdmin ? 'Admin' : isBuddy ? 'Buddy' : 'User'}</p>
            <p><strong>Primary Language:</strong><br />{isSidebarEditable ? <input type="text" value={updatedPrimaryLanguage} onChange={(e) => handleInputChange(e, setUpdatedPrimaryLanguage)} /> : userDetails.primary_language}</p>
            <p><strong>Secondary Language:</strong><br />{isSidebarEditable ? <input type="text" value={updatedSecondaryLanguage} onChange={(e) => handleInputChange(e, setUpdatedSecondaryLanguage)} /> : userDetails.secondary_language}</p>
            <div className={styles.programmingLanguagesSection}>
              <p><strong>Programming Languages and Technologies:</strong></p>
              <ul>
                {userDetails.programmingLanguages.map((language, index) => (
                  <li key={index}>{language}</li>
                ))}
              </ul>
            </div>
            {isSidebarEditable && (
              <div>
                <p>Email:<br /><input type="text" value={updatedEmail} onChange={(e) => handleInputChange(e, setUpdatedEmail)} /></p>
                <p>Select Programming Languages and Technologies:</p>
                {codeLanguageArray.map((tech, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      id={`tech-${index}`}
                      name="tech"
                      value={tech}
                      checked={selectedTech.includes(tech)}
                      onChange={handleTechChange}
                    />
                    <label htmlFor={`tech-${index}`}>{tech}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        <div className={styles.contentRightOfSidebar}>
          <div className={styles.topContent}>
            <div className={`${styles.profileBio} ${styles.relativePosition}`}>
              {!isBioEditable ? (
                <div className={styles.editIcon} onClick={toggleBioEditMode} style={{ cursor: 'pointer', position: 'absolute', top: '20px', right: '20px' }}>
                  <FontAwesomeIcon icon={faEdit} />
                </div>
              ) : (
                <div className={styles.editOptions} style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
                  <div className={styles.saveIcon} onClick={handleProfileUpdate} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faSave} />
                  </div>
                  <div className={styles.cancelIcon} onClick={toggleBioEditMode} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faTimes} />
                  </div>
                </div>
              )}
              <h2>Bio</h2>
              {isBioEditable ? (
                <textarea
                  className={`${styles.textAreaField} ${isBioEditable ? styles.bioEdit : ''}`}
                  onChange={(e) => handleInputChange(e, setUpdatedBuddyBio)}
                  value={updatedBuddyBio}
                ></textarea>

              ) : (
                <p>{userDetails.buddy_bio}</p>
              )}
            </div>
            <div className={styles.messagesBox}>
              {!isBuddy && (
                <div className={styles.requestToBecomeBuddySection}>
                  <RequestToBecomeBuddy setCurrentPage={setCurrentPage} currentPage={currentPage} />
                </div>
              )}
              {isAdmin && (
                <div className={styles.adminSection}>
                  <button onClick={() => setViewingDemoteBuddy(!viewingDemoteBuddy)}>
                    {viewingDemoteBuddy ? 'Hide Demote Buddies' : 'Manage Buddies'}
                  </button>
                  {viewingDemoteBuddy ? (
                    <DemoteBuddy buddies={buddies} demoteFromBuddy={demoteFromBuddy} />
                  ) : (
                    <div>
                      {viewingDeleted ? (
                        <DeletedMessages messages={deletedMessages} viewingDeleted={viewingDeleted} setViewingDeleted={setViewingDeleted} />
                      ) : (
                        <ReceivedMessages
                          messages={receivedMessages}
                          promoteToBuddy={promoteToBuddy}
                          handleSoftDelete={handleSoftDelete}
                          fetchReceivedMessages={fetchReceivedMessages}
                          viewingDeleted={viewingDeleted}
                          setViewingDeleted={setViewingDeleted}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className={styles.eventsBox}>
              <h2>Events</h2>
              {/* Events content goes here */}
            </div>
            <div className={styles.placeholderBox}>
              <h2>Placeholder</h2>
              {/* Placeholder or additional content */}
            </div>
          </div>
        </div>
        {/* {editable && (
        <div className={styles.editButtonSection}>
          <button onClick={toggleEditMode} className={styles.editButton}>
            Cancel Edit
          </button>
          <button onClick={handleProfileUpdate} className={styles.saveChangesButton}>
            Save Changes
          </button>
        </div>
      )} */}
      </div>
    </div>
  );
}

export default Profile;