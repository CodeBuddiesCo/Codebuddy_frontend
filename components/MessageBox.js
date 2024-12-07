import React, { useState, useEffect } from 'react';
import ManageBuddiesPage from '../pages/user/manage-buddies';
import MessagesPage from '../pages/user/messages';
import styles from '../styles/modal.module.css';

const MessageBox = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('Buddies');

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const tabs = [
    { name: 'Buddies', component: <ManageBuddiesPage /> },
    { name: 'Requests', component: <MessagesPage /> },
  ];

  if (!isOpen) return null;

  return (
    <div className={styles.messagesModalOverlay}>
      <div className={styles.messagesModalContent}>
        <button className={styles.messagesCloseButton} onClick={onClose}>
          X
        </button>
        <div className={styles.messagesModalBody}>
          {/* Left Panel */}
          <div className={styles.messagesLeftPanel}>
            <h2 className={styles.panelTitle}>Admin Hub</h2>
            <div className={styles.tabContainer}>
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  className={`${styles.tabButton} ${activeTab === tab.name ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab(tab.name)}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className={styles.messagesMainContent}>
            {tabs
              .filter((tab) => tab.name === activeTab)
              .map((tab) => (
                <div key={tab.name}>
                  {tab.component}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
