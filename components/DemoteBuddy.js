import React from 'react';
import styles from '../styles/profile.module.css';

const DemoteBuddy = ({ buddies, demoteFromBuddy }) => {
  return (
    <div className={styles.demoteBuddiesContainer}>
      <h3>Current Buddies</h3>
      <div className={styles.buddiesList}>
        {buddies.map((buddy, index) => (
          <div key={index} className={styles.buddyItem}>
            <span>{buddy.name} ({buddy.username})</span>
            <button onClick={() => demoteFromBuddy(buddy.id)}>Demote from Buddy</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoteBuddy;