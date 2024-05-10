import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import ReceivedMessages from '../../components/ReceivedMessages';
import DeletedMessages from '../../components/DeletedMessages';
import DemoteBuddy from '../../components/DemoteBuddy';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../../styles/profile.module.css';


const MessagesPage = ({ setCurrentPage, currentPage }) => {
  const { data: session } = useSession();
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [deletedMessages, setDeletedMessages] = useState([]);
  const [viewingDeleted, setViewingDeleted] = useState(false);
  const [viewingDemoteBuddy, setViewingDemoteBuddy] = useState(false);
  const [isBuddy, setIsBuddy] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState(session?.user?.name || 'Guest');


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

  
  useEffect(() => {
    setCurrentPage("User Profile");
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    setIsBuddy(localStorage.getItem('isBuddy') === 'true');
    setName(session?.user?.name || localStorage.getItem('username') || 'Guest');
    fetchReceivedMessages();
    fetchDeletedMessages();
    fetchUserDetails();
  }, [setCurrentPage, session?.user?.name]);

 
  useEffect(() => {
    fetchReceivedMessages();
    fetchDeletedMessages();
  }, []);


  
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
  return (
    <div className={styles.messagesBox}>
  
    {isAdmin && (
      <div className={styles.adminSection}>
        <div className={styles.tabs}>
        
          
        </div>
        
        {!viewingDemoteBuddy ? (
          <>
            {viewingDeleted ? (
              <DeletedMessages 
                messages={deletedMessages} 
                viewingDeleted={viewingDeleted} 
                setViewingDeleted={setViewingDeleted} />
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
          </>
        ) : (
          <DemoteBuddy 
            buddies={buddies} 
            demoteFromBuddy={demoteFromBuddy} />
        )}
      </div>
    )}
  </div>
  
  );
}

export default MessagesPage;

