import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ReceivedMessages from '../../components/ReceivedMessages';
import DeletedMessages from '../../components/DeletedMessages';
import DemoteBuddy from '../../components/DemoteBuddy';
import Header from '../../components/Header';
import RequestToBecomeBuddy from './become-a-buddy';
import styles from '../../styles/authForms.module.css';

const Profile = ({ setCurrentPage, currentPage }) => {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || 'Guest');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBuddy, setIsBuddy] = useState(false);
  const [deletedMessages, setDeletedMessages] = useState([]);
  const [viewingDeleted, setViewingDeleted] = useState(false);
  const [viewingDemoteBuddy, setViewingDemoteBuddy] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [buddies, setBuddies] = useState([]);
  const [editable, setEditable] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedPfpUrl, setUpdatedPfpUrl] = useState('');
  const [updatedPrimaryLanguage, setUpdatedPrimaryLanguage] = useState('');
  const [updatedSecondaryLanguage, setUpdatedSecondaryLanguage] = useState('');
  const [updatedBuddyBio, setUpdatedBuddyBio] = useState('');


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
      setUpdatedTitle(userDetails.title || '');
      setUpdatedPfpUrl(userDetails.pfp_url || '');
      setUpdatedPrimaryLanguage(userDetails.primary_language || '');
      setUpdatedSecondaryLanguage(userDetails.secondary_language || '');
      setUpdatedBuddyBio(userDetails.buddy_bio || '');
    }
  }, [userDetails]);

  const toggleEditMode = () => {
    setEditable(!editable);
  };

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleProfileUpdate = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const updatedData = {
      title: updatedTitle,
      pfp_url: updatedPfpUrl,
      primary_language: updatedPrimaryLanguage,
      secondary_language: updatedSecondaryLanguage,
      buddy_bio: updatedBuddyBio
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
    <div>
      <Header currentPage={currentPage} />
      <h1>Welcome, {name}!</h1>

      <h2>User Details:</h2>
      <button onClick={toggleEditMode}>
        {editable ? 'Cancel Edit' : 'Edit Profile'}
      </button>
      {editable && (
        <button onClick={handleProfileUpdate}>
          Save Changes
        </button>
      )}
      {
        userDetails ? (
          <div>
            <p>Name: {userDetails.name}</p>
            <p>Username: {userDetails.username}</p>
            <p>Primary Language: {editable ? <input type="text" onChange={(e) => handleInputChange(e, setUpdatedPrimaryLanguage)} /> : userDetails.primary_language}</p>
            <p>SecondaryLanguage: {editable ? <input type="text" onChange={(e) => handleInputChange(e, setUpdatedSecondaryLanguage)} /> : userDetails.secondary_language}</p>
            <p>Title:  {editable ? <input type="text" onChange={(e) => handleInputChange(e, setUpdatedTitle)} /> : userDetails.title}</p>
            <p>Bio:  {editable ? <input type="text" onChange={(e) => handleInputChange(e, setUpdatedBuddyBio)} /> : userDetails.buddy_bio}</p>
            <div>
              <p>Pfp:</p>
              {editable ? (
                <>
                  <input type="text" value={updatedPfpUrl} onChange={(e) => handleInputChange(e, setUpdatedPfpUrl)} />
                  {/* Display the image next to the input field when in edit mode */}
                  {updatedPfpUrl && (
                    <img src={updatedPfpUrl} alt="Profile Preview" style={{ maxWidth: '100px', maxHeight: '100px', marginLeft: '10px' }} />
                  )}
                </>
              ) : userDetails.pfp_url ? (
                // Display the image directly when not in edit mode
                <img src={userDetails.pfp_url} alt="Profile" style={{ maxWidth: '100px', maxHeight: '100px' }} />
              ) : (
                <p>No profile picture set.</p>
              )}
            </div>
          </div>
        ) : (
          <p className='loading-user-details'>Loading user details...</p>
        )
      }
      {!isBuddy && (
        <RequestToBecomeBuddy setCurrentPage={setCurrentPage} currentPage={currentPage} />
      )}
      {isAdmin && (
        <div>
          <button onClick={() => setViewingDemoteBuddy(!viewingDemoteBuddy)}>
            {viewingDemoteBuddy ? 'Hide Demote Buddies' : 'Manage Buddies'}
          </button>
          {viewingDemoteBuddy ? (
            <DemoteBuddy buddies={buddies} demoteFromBuddy={demoteFromBuddy} />
          ) : (
            <div className={styles.receivedMessagesHeader}>
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
              <h3>You are an admin!</h3>
            </div>
          )}
        </div>
      )}
      <h2>This is where you will find your user details and attended event history</h2>
    </div>
  );
};

export default Profile;