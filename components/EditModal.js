import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/editModal.module.css';
import codeLanguageArray from '../Arrays/CodeLanguageArray';

const EditModal = ({ isOpen, onClose, userDetails, handleProfileUpdate }) => {
  const [updatedName, setUpdatedName] = useState('');
  const [updatedUsername, setUpdatedUsername] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedPfpUrl, setUpdatedPfpUrl] = useState('');
  const [updatedPrimaryLanguage, setUpdatedPrimaryLanguage] = useState('');
  const [updatedSecondaryLanguage, setUpdatedSecondaryLanguage] = useState('');
  const [updatedBuddyBio, setUpdatedBuddyBio] = useState('');
  const [selectedTech, setSelectedTech] = useState([]);

  useEffect(() => {
    if (userDetails) {
      setUpdatedName(userDetails.name || '');
      setUpdatedUsername(userDetails.username || '');
      setUpdatedEmail(userDetails.email || '');
      setUpdatedTitle(userDetails.title || '');
      setUpdatedPfpUrl(userDetails.pfp_url || '');
      setUpdatedPrimaryLanguage(userDetails.primary_language || '');
      setUpdatedSecondaryLanguage(userDetails.secondary_language || '');
      setUpdatedBuddyBio(userDetails.buddy_bio || '');
      setSelectedTech(userDetails.programmingLanguages || []);
    }
  }, [userDetails]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleTechChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedTech((prev) => [...prev, value]);
    } else {
      setSelectedTech((prev) => prev.filter((tech) => tech !== value));
    }
  };

  const handleSubmit = () => {
    const updatedData = {
      name: updatedName,
      username: updatedUsername,
      email: updatedEmail,
      title: updatedTitle,
      pfp_url: updatedPfpUrl,
      primary_language: updatedPrimaryLanguage,
      secondary_language: updatedSecondaryLanguage,
      buddy_bio: updatedBuddyBio,
      programmingLanguages: selectedTech,
    };
    handleProfileUpdate(updatedData);
    onClose();
  };

  if (!isOpen) return null;

 return (
    <div className={styles.editModalOverlay}>
      <div className={styles.editModalContent}>
        <div className={styles.editModalHeader}>
          <h2>Edit Profile</h2>
          <button className={styles.editModalCloseButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.editModalBody}>
        <div className={styles.editModalFormGroup}>
            <label>Name:</label>
            <input className={styles.editModalInput} type="text" value={updatedName} onChange={(e) => handleInputChange(e, setUpdatedName)} />
          </div>
          <div className={styles.editModalFormGroup}>
            <label>Username:</label>
            <input className={styles.editModalInput} type="text" value={updatedUsername} onChange={(e) => handleInputChange(e, setUpdatedUsername)} />
          </div>
          <div className={styles.editModalFormGroup}>
            <label>Email:</label>
            <input className={styles.editModalInput} type="text" value={updatedEmail} onChange={(e) => handleInputChange(e, setUpdatedEmail)} />
          </div>
          <div className={styles.editModalFormGroup}>
            <label>Title:</label>
            <input className={styles.editModalInput} type="text" value={updatedTitle} onChange={(e) => handleInputChange(e, setUpdatedTitle)} />
          </div>
          <div className={styles.editModalFormGroup}>
            <label>Profile Picture URL:</label>
            <input className={styles.editModalInput} type="text" value={updatedPfpUrl} onChange={(e) => handleInputChange(e, setUpdatedPfpUrl)} />
          </div>
          <div className={styles.editModalFormGroup}>
            <label>Primary Language:</label>
            <input className={styles.editModalInput} type="text" value={updatedPrimaryLanguage} onChange={(e) => handleInputChange(e, setUpdatedPrimaryLanguage)} />
          </div>
          <div className={styles.editModalFormGroup}>
            <label>Secondary Language:</label>
            <input className={styles.editModalInput} type="text" value={updatedSecondaryLanguage} onChange={(e) => handleInputChange(e, setUpdatedSecondaryLanguage)} />
          </div>
          <div className={styles.editModalFormGroup}>
            <label>Buddy Bio:</label>
            <textarea className={styles.editModalTextarea} value={updatedBuddyBio} onChange={(e) => handleInputChange(e, setUpdatedBuddyBio)}></textarea>
          </div>
          <div className={styles.editModalFormGroup}>
            <label>Technologies:</label>
            <div className={styles.editModalTechOptionsContainer}>
              {codeLanguageArray && codeLanguageArray.map((tech, index) => (
                <div key={index} className={styles.editModalTechOption}>
                  <input
                    type="checkbox"
                    id={`tech-${index}`}
                    name="tech"
                    value={tech}
                    checked={selectedTech.includes(tech)}
                    onChange={handleTechChange}
                  />
                  <label htmlFor={`tech-${index}`}>{tech}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.editModalFooter}>
          <button className={styles.editModalSubmitButton} onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};
export default EditModal;
