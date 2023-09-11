import React from 'react';
import styles from '../styles/profile.module.css';

const DeletedMessages = ({ messages }) => {
    return (
        <div className={styles.deletedMessagesContainer}>
            <h3 className={styles.deletedMessagesHeader}>Deleted Messages:</h3>
            <div className={styles.messagesList}>
            {messages.map((msg, index) => (
  <div key={index}>
    <div>
      {msg ? (
        <>
          <span><strong>From:</strong> {msg.sender_name} ({msg.sender_username})</span>
          <span>{new Date(msg.timestamp).toLocaleString()}</span>
          <p><strong>Message:</strong> {msg.message_content}</p>
        </>
      ) : (
        <p>Message deleted or not available.</p>
      )}
    </div>
  </div>
))}

            </div>
        </div>
    );
};

export default DeletedMessages;