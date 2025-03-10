import React from 'react';
import styles from '../styles/modal.module.css';

const DemoteBuddy = ({ buddies, demoteFromBuddy }) => {
  return (
    <div className={styles.demoteBuddiesContainer}>
      <h3 className={styles.currentBuddies}>Current Buddies</h3>
      <div className={styles.buddiesList}>
        {buddies.map((buddy, index) => (
          <div key={index} className={styles.buddyItem}>
            <span>{buddy.name} ({buddy.username})</span>
            <button className={styles.demoteButton} onClick={() => demoteFromBuddy(buddy.id)}>Demote from Buddy</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoteBuddy;