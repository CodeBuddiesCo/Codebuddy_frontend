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
    setName(session?.user?.name || localStorage.getItem('username') || 'Guest');
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    setIsBuddy(localStorage.getItem('isBuddy') === 'true');
    if (isAdmin) {
      fetchReceivedMessages();
    }
  }, [isAdmin]);

const fetchReceivedMessages = async () => {
  try {
    const token = session?.accessToken || localStorage.getItem('token');
    const response = await fetch('https://codebuddiesserver.onrender.com/api/users/inbox', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      // Log the response to see what went wrong
      const text = await response.text();
      console.error('Error fetching received messages:', text);
      return;
    }

    const messages = await response.json();
    setReceivedMessages(messages);
  } catch (error) {
    console.error('Exception:', error);
  }
};
  
  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use token from session if it exists, otherwise use token from local storage
      const token = session?.accessToken || localStorage.getItem('token');
  
      if (!token) {
        console.error('No token found');
        return; // Handle this case as needed
      }
  
      const response = await fetch('https://codebuddiesserver.onrender.com/api/users/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipientUsername, message }),
      });
  
      if (response.status === 200) {
        setFormSubmitted(true);
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Exception:', error);
    }
  };  

  return (
    <div>
      <h1>Welcome, {name}!</h1>
      {isAdmin && (
        <>
          <h3>You are an admin!</h3>
          <h3>Received Messages:</h3>
          <ul>
            {receivedMessages.map((msg, index) => (
              <li key={index}>{msg.content}</li>
            ))}
          </ul>
        </>
      )}
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
