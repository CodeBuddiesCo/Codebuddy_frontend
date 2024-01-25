import React, { useState, useEffect } from 'react';
import BuddyRequestForm from '../../components/BuddyRequestForm';
import Header from '../../components/Header';

const RequestToBecomeBuddy = ({ setCurrentPage, currentPage }) => {
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isBuddy, setIsBuddy] = useState(false);

  setCurrentPage("Buddy Request")

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

  useEffect(() => {
    setIsBuddy(localStorage.getItem('isBuddy') === 'true');
  }, []);

  return (
    <div>
      <Header currentPage={currentPage} />
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
    </div>
  );
};

export default RequestToBecomeBuddy;
