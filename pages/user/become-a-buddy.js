import React, { useState, useEffect } from 'react';
import BuddyRequestForm from '../../components/BuddyRequestForm';
import Header from '../../components/Header';
import Modal from '../../components/Modal';

const RequestToBecomeBuddy = ({ setCurrentPage, currentPage }) => {
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isBuddy, setIsBuddy] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setCurrentPage("Buddy Request");
    setIsBuddy(localStorage.getItem('isBuddy') === 'true');
  }, [setCurrentPage]);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    const sender_id = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const adminUsernames = ['Hollye', 'cmugnai'];

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

  return (
    <div>
      <Header currentPage={currentPage} />
      {isBuddy ? (
        <h3>You are a buddy!</h3>
      ) : (
        <div>
          <button onClick={() => setIsModalOpen(true)}>Request to Become a Buddy</button>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <BuddyRequestForm
              message={message}
              setMessage={setMessage}
              handleMessageSubmit={handleMessageSubmit}
              formSubmitted={formSubmitted}
            />
          </Modal>
        </div>
      )}
    </div>
  );
};

export default RequestToBecomeBuddy;
