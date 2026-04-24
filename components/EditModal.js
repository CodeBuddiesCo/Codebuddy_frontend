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
  const [updatedBuddyBio, setUpdatedBuddyBio] = useState('');
  const [highLanguages, setHighLanguages] = useState([]);
  const [intermediateLanguages, setIntermediateLanguages] = useState([]);

  useEffect(() => {
    if (userDetails) {
      setUpdatedName(userDetails.name || '');
      setUpdatedUsername(userDetails.username || '');
      setUpdatedEmail(userDetails.email || '');
      setUpdatedTitle(userDetails.title || '');
      setUpdatedPfpUrl(userDetails.pfp_url || '');
      setUpdatedBuddyBio(userDetails.buddy_bio || '');
      setHighLanguages(userDetails.highProficiencyLanguages || []);
      setIntermediateLanguages(userDetails.intermediateProficiencyLanguages || []);
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

  const addHighLanguage = (event) => {
    const value = event.target.value;
    if (value) {
      setHighLanguages((prev) => (prev.includes(value) ? prev : [...prev, value]));
    }
  };

  const removeHighLanguage = (language) => {
    setHighLanguages((prev) => prev.filter((lang) => lang !== language));
  };

  const addIntermediateLanguage = (event) => {
    const value = event.target.value;
    if (value) {
      setIntermediateLanguages((prev) => (prev.includes(value) ? prev : [...prev, value]));
    }
  };

  const removeIntermediateLanguage = (language) => {
    setIntermediateLanguages((prev) => prev.filter((lang) => lang !== language));
  };

  const availableForHigh = codeLanguageArray.filter(
    (lang) => !highLanguages.includes(lang) && !intermediateLanguages.includes(lang)
  );
  const availableForIntermediate = codeLanguageArray.filter(
    (lang) => !highLanguages.includes(lang) && !intermediateLanguages.includes(lang)
  );

  const handleSubmit = () => {
    const updatedData = {
      name: updatedName,
      username: updatedUsername,
      email: updatedEmail,
      title: updatedTitle,
      pfp_url: updatedPfpUrl,
      buddy_bio: updatedBuddyBio,
      highProficiencyLanguages: highLanguages,
      intermediateProficiencyLanguages: intermediateLanguages,
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
            <label>High Proficiency:</label>
            <select
              className={styles.editModalInput}
              value=""
              onChange={addHighLanguage}
            >
              <option value="">Select a language to add…</option>
              {availableForHigh.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <div className={styles.editModalLanguageChips}>
              {highLanguages.map((lang) => (
                <span key={lang} className={styles.editModalLanguageChip}>
                  {lang}
                  <button
                    type="button"
                    className={styles.editModalLanguageChipRemove}
                    onClick={() => removeHighLanguage(lang)}
                    aria-label={`Remove ${lang}`}
                  >×</button>
                </span>
              ))}
            </div>
          </div>
          <div className={styles.editModalFormGroup}>
            <label>Intermediate Proficiency:</label>
            <select
              className={styles.editModalInput}
              value=""
              onChange={addIntermediateLanguage}
            >
              <option value="">Select a language to add…</option>
              {availableForIntermediate.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <div className={styles.editModalLanguageChips}>
              {intermediateLanguages.map((lang) => (
                <span key={lang} className={styles.editModalLanguageChip}>
                  {lang}
                  <button
                    type="button"
                    className={styles.editModalLanguageChipRemove}
                    onClick={() => removeIntermediateLanguage(lang)}
                    aria-label={`Remove ${lang}`}
                  >×</button>
                </span>
              ))}
            </div>
            <p className={styles.editModalBioHelper}>
              Skilled in other frameworks and technologies? Let us know in your bio!
            </p>
          </div>
          <div className={styles.editModalFormGroup}>
            <label>Buddy Bio:</label>
            <textarea className={styles.editModalTextarea} value={updatedBuddyBio} onChange={(e) => handleInputChange(e, setUpdatedBuddyBio)}></textarea>
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
