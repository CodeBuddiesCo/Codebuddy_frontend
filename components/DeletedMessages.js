import React from 'react';
import styles from '../styles/profile.module.css';

const DeletedMessages = ({ messages, viewingDeleted, setViewingDeleted }) => {
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
                            <div className={styles.messageHeader}>
                                <span><strong>From:</strong> {msg.sender_name} ({msg.sender_username})</span>
                                <span className={styles.emailTimestamp}>{new Date(msg.timestamp).toLocaleString()}</span>
                            </div>
                            <p className={styles.messageContent}><strong>Message:</strong> {msg.message_content}</p>
                        </div>
                    ))
                ) : (
                    <div className={styles.noMessages}>
                        <p>No deleted messages.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeletedMessages;