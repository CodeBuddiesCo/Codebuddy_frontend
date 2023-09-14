import React, { useState } from 'react';
import styles from '../styles/profile.module.css';

const ReceivedMessages = ({ messages, promoteToBuddy, handleSoftDelete, viewingDeleted, setViewingDeleted, fetchReceivedMessages }) => {
    const [promotedMessages, setPromotedMessages] = useState({});

    const handlePromotion = (senderId, index) => {
        promoteToBuddy(senderId);
        setPromotedMessages({ ...promotedMessages, [index]: true });
    };

    return (
        <div className={styles.receivedMessagesContainer}>
            <div className={styles.tabContainer}>
                <button 
                  className={`${styles.tabButton} ${!viewingDeleted ? styles.activeTab : ''}`} 
                  onClick={() => setViewingDeleted(false)}
                >
                  Buddy Requests
                </button>
                <button 
                  className={`${styles.tabButton} ${viewingDeleted ? styles.activeTab : ''}`} 
                  onClick={() => setViewingDeleted(true)}
                >
                  Deleted Requests
                </button>
            </div>
            {/* <h3 className={styles.receivedMessagesHeader}>Buddy Requests:</h3> */}
            <div className={styles.messagesList}>
                {messages.map((msg, index) => (
                    <div key={index} className={styles.messageItem}>
                        <button onClick={() => handleSoftDelete(msg.id, index)}>Delete</button>
                        {promotedMessages[index] ? (
                            <p><strong>{msg.sender_name} ({msg.sender_username}) has been promoted to a buddy.</strong></p>
                        ) : (
                            <div>
                                <div className={styles.messageHeader}>
                                    <span><strong>From:</strong> {msg.sender_name} ({msg.sender_username})</span>
                                    <span>{new Date(msg.timestamp).toLocaleString()}</span>
                                </div>
                                <p className={styles.messageContent}><strong>Message:</strong> {msg.message_content}</p>
                                <div className={styles.messageActions}>
                                    <button className={styles.promoteButton} onClick={() => handlePromotion(msg.sender_id, index)}>Promote to Buddy</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <button onClick={fetchReceivedMessages}>Refresh Messages</button>
            </div>
        </div>
    );
};

export default ReceivedMessages;