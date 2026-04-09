import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/modal.module.css';

const DeletedMessages = ({ messages, viewingDeleted, setViewingDeleted, onRestore }) => {
    return (
        <div className={styles.receivedMessagesContainer}>
            <div className={styles.adminTabContainer}>
                <button
                    className={`${styles.adminTabButton} ${!viewingDeleted ? styles.adminActiveTab : ''}`}
                    onClick={() => setViewingDeleted(false)}
                >
                    Buddy Requests
                </button>
                <button
                    className={`${styles.adminTabButton} ${viewingDeleted ? styles.adminActiveTab : ''}`}
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
                            <div className={styles.messageActions}>
                                <button className={styles.promoteButton} onClick={() => onRestore(msg.id)}>
                                    <FontAwesomeIcon icon={faRotateLeft} /> Restore
                                </button>
                            </div>
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