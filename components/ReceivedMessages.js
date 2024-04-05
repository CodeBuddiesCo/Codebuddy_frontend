import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
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
            <div className={styles.messagesList}>
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className={styles.messageItem}>
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
                                        <button className={styles.deleteButton} onClick={() => handleSoftDelete(msg.id, index)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className={styles.noMessages}>
                        <p>No messages available.</p>
                    </div>
                )}
                <button className={styles.refreshButton} onClick={fetchReceivedMessages}><FontAwesomeIcon icon={faTrash} /> Refresh Messages</button>
            </div>
        </div>
    );
};

export default ReceivedMessages;