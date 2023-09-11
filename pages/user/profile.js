import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ReceivedMessages from '../../components/ReceivedMessages';
import BuddyRequestForm from '../../components/BuddyRequestForm';
import DeletedMessages from '../../components/DeletedMessages'; // import the component

const Profile = () => {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || 'Guest');
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBuddy, setIsBuddy] = useState(false);
  const [deletedMessages, setDeletedMessages] = useState([]); // Declare state variable

  const handleSoftDelete = async (messageId, index) => {
    console.log("DELETE request received for /message/:messageId");  // Debug log
    console.log(`Deleting message with ID: ${messageId}`);  // Debug log
    const token = localStorage.getItem('token');
    const deletedMsg = receivedMessages.splice(index, 1)[0];
    setDeletedMessages([...deletedMessages, deletedMsg]);
    setReceivedMessages([...receivedMessages]);

    try {
      const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/message/${messageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        alert('Message marked for deletion');
        const newReceivedMessages = [...receivedMessages];
        const deletedMsg = newReceivedMessages.splice(index, 1)[0];
        setDeletedMessages([...deletedMessages, deletedMsg]);
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

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    setIsBuddy(localStorage.getItem('isBuddy') === 'true');
    setName(session?.user?.name || localStorage.getItem('username') || 'Guest');
    fetchReceivedMessages();
    fetchDeletedMessages();
  }, []);

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
        const filteredMessages = allMessages.filter(msg => !msg.marked_for_deletion);
        setReceivedMessages(filteredMessages);
      }
    } catch (error) {
      console.error('Exception:', error);
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    const sender_id = localStorage.getItem('userId') || session?.user?.id;
    const token = localStorage.getItem('token');
    const adminUsernames = ['Hollye', 'Catherine'];

    for (const receiver_username of adminUsernames) {
      try {
        const response = await fetch('https://codebuddiesserver.onrender.com/api/users/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sender_id, receiver_username, message_content: message }),
        });

        if (response.status === 200) {
          console.log('Message sent successfully to admin:', receiver_username);
        }
      } catch (error) {
        console.error('Exception:', error);
      }
    }

    setFormSubmitted(true);
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

  return (
    <div>
      <h1>Welcome, {name}!</h1>
      {isAdmin && (
        <ReceivedMessages
          messages={receivedMessages}
          promoteToBuddy={promoteToBuddy}
          handleSoftDelete={handleSoftDelete} // Pass handleSoftDelete as a prop
        />)}
      {isAdmin && <h3>You are an admin!</h3>}
      {isBuddy ? (
        <h3>You are a buddy!</h3>
      ) : (
        <BuddyRequestForm
          message={message}
          setMessage={setMessage}
          handleMessageSubmit={handleMessageSubmit}
          formSubmitted={formSubmitted}
        />
      )}
      <h2>This is where you will find your user details and attended event history</h2>
      <DeletedMessages messages={deletedMessages} /> {/* Corrected location */}
    </div>
  );
};

export default Profile;