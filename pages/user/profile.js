import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ReceivedMessages from '../../components/ReceivedMessages';
import DeletedMessages from '../../components/DeletedMessages';
import DemoteBuddy from '../../components/DemoteBuddy';
import Header from '../../components/Header';
import RequestToBecomeBuddy from './become-a-buddy';
import styles from '../../styles/authForms.module.css';

const techOptions = ['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C#', 'Ruby'];

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
    title: '',
    pfp_url: '',
    primary_language: '',
    secondary_language: '',
    buddy_bio: '',
    programmingLanguages: [] // Ensure this is initialized correctly
  });
  const [buddies, setBuddies] = useState([]);
  const [editable, setEditable] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedPfpUrl, setUpdatedPfpUrl] = useState('');
  const [updatedPrimaryLanguage, setUpdatedPrimaryLanguage] = useState('');
  const [updatedSecondaryLanguage, setUpdatedSecondaryLanguage] = useState('');
  const [updatedBuddyBio, setUpdatedBuddyBio] = useState('');
  const [selectedTech, setSelectedTech] = useState([]);

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

  useEffect(() => {
    console.log(userDetails.programmingLanguages);
  }, [userDetails]);

  const toggleEditMode = () => {
    setEditable(!editable);
  };

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

  const handleProfileUpdate = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const updatedData = {
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

  const renderTechDropdown = () => (
    <select multiple value={selectedTech} onChange={handleTechChange} className={styles.techSelect}>
      {techOptions.map((tech) => (
        <option key={tech} value={tech}>
          {tech}
        </option>
      ))}
    </select>
  );

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
            <div>
              <p>Pfp:</p>
              {editable ? (
                <>
                  <input type="text" value={updatedPfpUrl} onChange={(e) => handleInputChange(e, setUpdatedPfpUrl)} />
                  {updatedPfpUrl && (
                    <img src={updatedPfpUrl} alt="Profile Preview" style={{ maxWidth: '100px', maxHeight: '100px', marginLeft: '10px' }} />
                  )}
                </>
              ) : userDetails.pfp_url ? (
                <img src={userDetails.pfp_url} alt="Profile" style={{ maxWidth: '100px', maxHeight: '100px' }} />
              ) : (
                <p>No profile picture set.</p>
              )}
            </div>
            <p>Name: {userDetails.name}</p>
            <p>Username: {userDetails.username}</p>
            <p>Primary Language: {editable ? <input type="text" onChange={(e) => handleInputChange(e, setUpdatedPrimaryLanguage)} /> : userDetails.primary_language}</p>
            <p>SecondaryLanguage: {editable ? <input type="text" onChange={(e) => handleInputChange(e, setUpdatedSecondaryLanguage)} /> : userDetails.secondary_language}</p>
            <p>Title:  {editable ? <input type="text" onChange={(e) => handleInputChange(e, setUpdatedTitle)} /> : userDetails.title}</p>
            <p>Bio:  {editable ? <input type="text" onChange={(e) => handleInputChange(e, setUpdatedBuddyBio)} /> : userDetails.buddy_bio}</p>
            <div>
  {!editable && (
    <div>
      <p>Programming Languages and Technologies:</p>
      <ul>
        {userDetails.programmingLanguages && userDetails.programmingLanguages.map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
    </div>
  )}
  {editable && (
    <div>
      <p>Select Programming Languages and Technologies:</p>
      {techOptions.map((tech, index) => (
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