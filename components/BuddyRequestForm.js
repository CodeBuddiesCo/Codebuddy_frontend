import React from 'react';
import styles from '../styles/profile.module.css';

const maxCharacters = 300;

const BuddyRequestForm = ({ message, setMessage, handleMessageSubmit, formSubmitted }) => {
  return (
    <div className={styles.formContainer}>
      {formSubmitted ? (
        <p className={styles.successMessage}>Your request to become a buddy has been sent. We'll review it and get back to you soon.</p>
      ) : (
        <form onSubmit={handleMessageSubmit}>
          <h3 className={styles.requestHeader}>Interested in becoming a buddy? Send a request below!</h3>
          <div className={styles.textareaContainer}>
            <textarea
              className={styles.textarea}
              placeholder="Tell us why you'd like to be a buddy!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength={maxCharacters}
            />
            <span className={styles.characterLimit}>
              {maxCharacters - message.length} remaining
            </span>
          </div>
          <button className={styles.submitButton} type="submit">Send Request</button>
        </form>
      )}
    </div>
  );
};

export default BuddyRequestForm;
