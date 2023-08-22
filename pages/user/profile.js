import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const Profile = () => {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || 'Guest');
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isBuddy = localStorage.getItem('isBuddy') === 'true';

  useEffect(() => {
    setName(session?.user?.name || localStorage.getItem('username') || 'Guest');
    fetchReceivedMessages();
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
        setReceivedMessages(await response.json());
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
        <>
          <h3>Received Messages:</h3>
          <button onClick={fetchReceivedMessages}>Refresh Messages</button>
          <div>
            {receivedMessages.map((msg, index) => (
              <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                <p><strong>From:</strong> {msg.sender_name}</p>
                <p><strong>Username:</strong> {msg.sender_username}</p>
                <p><strong>Message:</strong> {msg.message_content}</p>
                <p><strong>Timestamp:</strong> {new Date(msg.timestamp).toLocaleString()}</p>
                <button onClick={() => promoteToBuddy(msg.sender_id)}>Promote to Buddy</button> {/* Added button here */}
              </div>
            ))}
          </div>
        </>
      )}
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