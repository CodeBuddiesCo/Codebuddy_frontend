import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

function Profile() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || 'Guest');
  const [recipientUsername, setRecipientUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBuddy, setIsBuddy] = useState(false);
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState([]);

  useEffect(() => {
    console.log('useEffect is running'); 
    setName(session?.user?.name || localStorage.getItem('username') || 'Guest');
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    setIsBuddy(localStorage.getItem('isBuddy') === 'true');

    fetchReceivedMessages();
  }, []);

  const fetchReceivedMessages = async () => {
    console.log('fetchReceivedMessages is called');
    try {
      const token = localStorage.getItem('token');
      const user_id = localStorage.getItem('userId');
console.log('userid:', user_id)
      if (!user_id) {
        console.error('User ID not available');
        return;
      }

      console.log('Fetching messages...');
      const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/messages/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        console.error('Error fetching received messages:', response);
        return;
      }

      const messages = await response.json();
      console.log('Received Messages:', messages);

      setReceivedMessages(messages);
    } catch (error) {
      console.error('Exception:', error);
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();

    try {
    const sender_id = localStorage.getItem('userId') || session?.user?.id;
      const receiver_username = recipientUsername;
      const token = localStorage.getItem('token');
      console.log('Sending message...');
      const response = await fetch('https://codebuddiesserver.onrender.com/api/users/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender_id,
          receiver_username,
          message_content: message,
        }),
      });
  
      if (response.status === 200) {
        console.log('Message sent successfully');
        setFormSubmitted(true);
      } else {
        const errorResponse = await response.json(); 
        console.error('Failed to send message:', errorResponse);
      }
    } catch (error) {
      console.error('Exception:', error);
    }
  };

  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <h3>Received Messages:</h3>
      <button onClick={fetchReceivedMessages}>Refresh Messages</button>
      <ul>
        {receivedMessages.map((msg, index) => (
          <li key={index}>{JSON.stringify(msg)}</li>
        ))}
      </ul>
      {isAdmin && <h3>You are an admin!</h3>}
      {isBuddy ? (
        <h3>You are a buddy!</h3>
      ) : (
        <>
          <h3>You are not a buddy. Send a message request to become one!:</h3>
          {formSubmitted ? (
            <p>Message sent!</p>
          ) : (
            <form onSubmit={handleMessageSubmit}>
              <input
                type="text"
                placeholder="Recipient's username"
                value={recipientUsername}
                onChange={(e) => setRecipientUsername(e.target.value)}
                required
              />
              <textarea
                placeholder="Enter your message here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <button type="submit">Send Message</button>
            </form>
          )}
        </>
      )}
      <h2>This is where you will find your user details and attended event history</h2>
    </div>
  );
}

export default Profile;
