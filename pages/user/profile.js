import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import ReceivedMessages from '../../components/ReceivedMessages';
import DeletedMessages from '../../components/DeletedMessages';
import DemoteBuddy from '../../components/DemoteBuddy';
import Header from '../../components/Header';
import RequestToBecomeBuddy from './become-a-buddy';
import styles from '../../styles/profile.module.css';
import { codeLanguageArray } from '../../Arrays/CodeLanguageArray';
import { useRouter } from 'next/router';

const Profile = ({ setCurrentPage, currentPage }) => {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || 'Guest');
  // const [receivedMessages, setReceivedMessages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBuddy, setIsBuddy] = useState(false);
  // const [deletedMessages, setDeletedMessages] = useState([]);
  // const [viewingDeleted, setViewingDeleted] = useState(false);
  // const [viewingDemoteBuddy, setViewingDemoteBuddy] = useState(false);
  const router = useRouter();

  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    title: '',
    pfp_url: '',
    primary_language: '',
    secondary_language: '',
    buddy_bio: '',
    programmingLanguages: []
  });

  // const [buddies, setBuddies] = useState([]);
  const [updatedUsername, setUpdatedUsername] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedPfpUrl, setUpdatedPfpUrl] = useState('');
  const [updatedPrimaryLanguage, setUpdatedPrimaryLanguage] = useState('');
  const [updatedSecondaryLanguage, setUpdatedSecondaryLanguage] = useState('');
  const [updatedBuddyBio, setUpdatedBuddyBio] = useState('');
  const [selectedTech, setSelectedTech] = useState([]);

  const [isSidebarEditable, setIsSidebarEditable] = useState(false);
  const [isBioEditable, setIsBioEditable] = useState(false);


  useEffect(() => {
    setCurrentPage("User Profile");
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    setIsBuddy(localStorage.getItem('isBuddy') === 'true');
    setName(session?.user?.name || localStorage.getItem('username') || 'Guest');
    // fetchReceivedMessages();
    // fetchDeletedMessages();
    fetchUserDetails();
    // fetchBuddies();
  }, [setCurrentPage, session?.user?.name]);

  useEffect(() => {
    if (userDetails) {
      setUpdatedUsername(userDetails.username || '');
      setUpdatedEmail(userDetails.email || '');
      setUpdatedTitle(userDetails.title || '');
      setUpdatedPfpUrl(userDetails.pfp_url || '');
      setUpdatedPrimaryLanguage(userDetails.primary_language || '');
      setUpdatedSecondaryLanguage(userDetails.secondary_language || '');
      setUpdatedBuddyBio(userDetails.buddy_bio || '');

    }
  }, [userDetails]);

  useEffect(() => {
    console.log(userDetails.programmingLanguages);
  }, [userDetails]);



  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleTechChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedTech(prev => [...prev, value]);
    } else {
      setSelectedTech(prev => prev.filter(tech => tech !== value));
    }
  };

  const toggleSidebarEditMode = () => {
    setIsSidebarEditable(!isSidebarEditable);
    if (isBioEditable) setIsBioEditable(false);
  };

  const toggleBioEditMode = () => {
    setIsBioEditable(!isBioEditable);
    if (isSidebarEditable) setIsSidebarEditable(false);
  };

  const handleProfileUpdate = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const updatedData = {
      username: updatedUsername,
      email: updatedEmail,
      title: updatedTitle,
      pfp_url: updatedPfpUrl,
      primary_language: updatedPrimaryLanguage,
      secondary_language: updatedSecondaryLanguage,
      buddy_bio: updatedBuddyBio,
      programmingLanguages: selectedTech,
    };

    try {
      const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.status === 200) {
        alert('User details updated successfully');
        fetchUserDetails();
      } else {
        alert('Failed to update user details');
      }
    } catch (error) {
      console.error('Exception:', error);
      alert('Error while updating user details');


    }
    console.log("Updated Data:", updatedData);
  };

  const fetchUserDetails = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const userData = await response.json();
        console.log('Fetched User Data:', userData);

        setUserDetails(userData);
      } else {
        console.error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Exception:', error);
    }
  };


  return (

    //   <div className={styles.profilePageContainer}>
    //     < Header />


    //     <div className={styles.mainContent}>

    //       <aside className={`${styles.profileSidebar} ${styles.relativePosition}`}>
    //         {!isSidebarEditable ? (
    //           <div className={styles.editIcon} onClick={toggleSidebarEditMode} style={{ color: '#939393', cursor: 'pointer', position: 'absolute', top: '20px', right: '20px' }}>
    //             <FontAwesomeIcon icon={faEdit} />
    //           </div>
    //         ) : (
    //           <div className={styles.editOptions} style={{ color: '#939393', position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
    //             <div className={styles.saveIcon} onClick={handleProfileUpdate} style={{ cursor: 'pointer' }}>
    //               <FontAwesomeIcon icon={faSave} />
    //             </div>
    //             <div className={styles.cancelIcon} onClick={toggleSidebarEditMode} style={{ color: '#939393', cursor: 'pointer' }}>
    //               <FontAwesomeIcon icon={faTimes} />
    //             </div>
    //           </div>
    //         )}
    //         <div className={styles.profilePictureSection}>
    //           {isSidebarEditable ? (
    //             <div className={styles.profilePictureWrapper}>
    //               {updatedPfpUrl && <img src={updatedPfpUrl} alt="Profile Preview" className={styles.profilePicture} />}
    //               <input
    //                 type="text"
    //                 placeholder="Enter new profile URL"
    //                 value={updatedPfpUrl}
    //                 onChange={(e) => handleInputChange(e, setUpdatedPfpUrl)}
    //                 className={styles.profileUrlInput}
    //               />
    //             </div>
    //           ) : userDetails.pfp_url ? (
    //             <img src={userDetails.pfp_url} alt="Profile" className={styles.profilePicture} />
    //           ) : (
    //             <p>No profile picture set.</p>
    //           )}
    //         </div>
    //         <div className={styles.profileName}>
    //           <p className={styles.nameHeader}>{userDetails.name}</p>
    //         </div>
    //         <div className={styles.profileUsername}>
    //           <p className={styles.dataContent}>{isSidebarEditable ? <input type="text" value={updatedUsername} onChange={(e) => handleInputChange(e, setUpdatedUsername)} /> : userDetails.username}</p>
    //         </div>
    //         <div className={styles.profileDetails}>

    //           {isAdmin && (
    //             <div>
    //               <div className={styles.adminSection}>
    //                 <button onClick={() => router.push('/user/manage-buddies')}>Manage Buddies</button>
    //               </div>
    //               <div className="messagesLink">
    //                 <button onClick={() => router.push('/user/messages')}>Manage Messages</button>
    //               </div>
    //             </div>
    //           )}


    //           <div className={styles.messagesBox}>
    //             {!isBuddy && !isAdmin && (
    //               <div className={styles.requestToBecomeBuddySection}>
    //                 <RequestToBecomeBuddy setCurrentPage={setCurrentPage} currentPage={currentPage} />
    //               </div>
    //             )}
    //           </div>


    //           <p className={styles.detailTitle}><strong>Title</strong></p>
    //           <p className={styles.dataContent}>{isSidebarEditable ? <input type="text" value={updatedTitle} onChange={(e) => handleInputChange(e, setUpdatedTitle)} /> : userDetails.title}</p>
    //           <p className={styles.detailTitle}><strong>Status</strong></p>
    //           <p className={styles.dataContent}>{isAdmin ? 'Admin' : isBuddy ? 'Buddy' : 'User'}</p>
    //           <p className={styles.detailTitle}><strong>Primary Language</strong></p>
    //           <p className={styles.dataContent}>{isSidebarEditable ? <input type="text" value={updatedPrimaryLanguage} onChange={(e) => handleInputChange(e, setUpdatedPrimaryLanguage)} /> : userDetails.primary_language}</p>
    //           <p className={styles.detailTitle}><strong>Secondary Language</strong></p>
    //           <p className={styles.dataContent}>{isSidebarEditable ? <input type="text" value={updatedSecondaryLanguage} onChange={(e) => handleInputChange(e, setUpdatedSecondaryLanguage)} /> : userDetails.secondary_language}</p>
    //           <div className={styles.programmingLanguagesSection}>
    //             <p className={styles.detailTitle}><strong>Programming Languages and Technologies</strong></p>
    //             <ul className={styles.techList}>
    //               {userDetails.programmingLanguages.map((language, index) => (
    //                 <li key={index} className={styles.dataContent}>{language}</li>
    //               ))}
    //             </ul>
    //           </div>
    //           {isSidebarEditable && (
    //             <div>
    //               <p className={styles.detailTitle}>Email:</p>
    //               <p className={styles.dataContent}><input type="text" value={updatedEmail} onChange={(e) => handleInputChange(e, setUpdatedEmail)} /></p>
    //               <p className={styles.detailTitle}>Select Programming Languages and Technologies:</p>
    //               {codeLanguageArray.map((tech, index) => (
    //                 <div key={index} className={styles.dataContent}>
    //                   <input
    //                     type="checkbox"
    //                     id={`tech-${index}`}
    //                     name="tech"
    //                     value={tech}
    //                     checked={selectedTech.includes(tech)}
    //                     onChange={handleTechChange}
    //                   />
    //                   <label htmlFor={`tech-${index}`}>{tech}</label>
    //                 </div>
    //               ))}
    //             </div>
    //           )}
    //         </div>
    //       </aside>

    //       <div className={styles.contentRightOfSidebar}>
    //         <div className={styles.topContent}>





    //           <div className={styles.eventsBox}>
    //             <h2 className={styles.eventsHeader}>Events</h2>
    //           </div>
    //           <div className={styles.placeholderBox}>
    //             <h2 className={styles.placeholderHeader}>Placeholder</h2>
    //           </div>
    //         </div>
    //       </div>

    //     </div>

    //     <div className={`${styles.profileBio} ${styles.relativePosition}`}>
    //       {!isBioEditable ? (
    //         <div className={styles.editIcon} onClick={toggleBioEditMode} style={{ cursor: 'pointer', position: 'absolute', top: '20px', right: '20px' }}>
    //           <FontAwesomeIcon icon={faEdit} />
    //         </div>
    //       ) : (
    //         <div className={styles.editOptions} style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
    //           <div className={styles.saveIcon} onClick={handleProfileUpdate} style={{ cursor: 'pointer' }}>
    //             <FontAwesomeIcon icon={faSave} />
    //           </div>
    //           <div className={styles.cancelIcon} onClick={toggleBioEditMode} style={{ cursor: 'pointer' }}>
    //             <FontAwesomeIcon icon={faTimes} />
    //           </div>
    //         </div>
    //       )}
    //       <h2 className={styles.bioHeader}>Bio</h2>
    //       {isBioEditable ? (
    //         <textarea
    //           className={`${styles.textAreaField} ${isBioEditable ? styles.bioEdit : ''}`}
    //           onChange={(e) => handleInputChange(e, setUpdatedBuddyBio)}
    //           value={updatedBuddyBio}
    //         ></textarea>

    //       ) : (
    //         <p>{userDetails.buddy_bio}</p>
    //       )}
    //     </div>
    //   </div>
    // );
    <div className={styles.profileContainer}>
      < Header />


      <div className={styles.mainContent}>
        <div className={styles.leftSidebar}>
          <aside className={`${styles.profileSidebar} ${styles.relativePosition}`}>
            {!isSidebarEditable ? (
              <div className={styles.editIcon} onClick={toggleSidebarEditMode} style={{ color: '#939393', cursor: 'pointer', position: 'absolute', top: '20px', right: '20px' }}>
                <FontAwesomeIcon icon={faEdit} />
              </div>
            ) : (
              <div className={styles.editOptions} style={{ color: '#939393', position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
                <div className={styles.saveIcon} onClick={handleProfileUpdate} style={{ cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faSave} />
                </div>
                <div className={styles.cancelIcon} onClick={toggleSidebarEditMode} style={{ color: '#939393', cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faTimes} />
                </div>
              </div>
            )}
            <div className={`${styles.profilePictureSection} ${styles.sidebarItem}`}>
              {isSidebarEditable ? (
                <div className={styles.profilePictureWrapper}>
                  {updatedPfpUrl && <img src={updatedPfpUrl} alt="Profile Preview" className={styles.profilePicture} />}
                  <input
                    type="text"
                    placeholder="Enter new profile URL"
                    value={updatedPfpUrl}
                    onChange={(e) => handleInputChange(e, setUpdatedPfpUrl)}
                    className={styles.profileUrlInput}
                  />
                </div>
              ) : userDetails.pfp_url ? (
                <img src={userDetails.pfp_url} alt="Profile" className={styles.profilePicture} />
              ) : (
                <p>No profile picture set.</p>
              )}
            </div>
            <div className={`${styles.profileName} ${styles.sidebarItem}`}>
              <p className={styles.nameHeader}>{userDetails.name}</p>
            </div>
            <div className={styles.profileUsername}>
              <p className={styles.dataContent}>{isSidebarEditable ? <input type="text" value={updatedUsername} onChange={(e) => handleInputChange(e, setUpdatedUsername)} /> : userDetails.username}</p>
            </div>
            <div className={styles.profileDetails}>




              <div className={styles.messagesBox}>
                {!isBuddy && !isAdmin && (
                  <div className={styles.requestToBecomeBuddySection}>
                    <RequestToBecomeBuddy setCurrentPage={setCurrentPage} currentPage={currentPage} />
                  </div>
                )}
              </div>


              <div className={styles.detailRow}>
                <p className={styles.detailTitle}><strong>Title:</strong></p>
                <p className={styles.dataContent}>{isSidebarEditable ? <input type="text" value={updatedTitle} onChange={(e) => handleInputChange(e, setUpdatedTitle)} /> : userDetails.title}</p>
              </div>

              <div className={styles.detailRow}>
                <p className={styles.detailTitle}><strong>Status:</strong></p>
                <p className={`${styles.dataContent} ${styles.adminHeader}`}>{isAdmin ? 'Admin' : isBuddy ? 'Buddy' : 'User'}</p>
              </div>
              <p className={`${styles.dataContent} ${styles.languageBubble}`}>
                {isSidebarEditable ? (
                  <input
                    type="text"
                    value={updatedPrimaryLanguage}
                    onChange={(e) => handleInputChange(e, setUpdatedPrimaryLanguage)}
                  />
                ) : (
                  <>
                    <span className={styles.goldStar}>★</span> {userDetails.primary_language}
                  </>
                )}
              </p>

              <p className={`${styles.dataContent} ${styles.languageBubble}`}>
                {isSidebarEditable ? (
                  <input
                    type="text"
                    value={updatedSecondaryLanguage}
                    onChange={(e) => handleInputChange(e, setUpdatedSecondaryLanguage)}
                  />
                ) : (
                  <>
                    <span className={styles.silverStar}>★</span> {userDetails.secondary_language}
                  </>
                )}
              </p>
              {/* <p className={styles.detailTitle}><strong>Primary Language</strong></p>
         <p className={styles.dataContent}>{isSidebarEditable ? <input type="text" value={updatedPrimaryLanguage} onChange={(e) => handleInputChange(e, setUpdatedPrimaryLanguage)} /> : userDetails.primary_language}</p>
         <p className={styles.detailTitle}><strong>Secondary Language</strong></p>
         <p className={styles.dataContent}>{isSidebarEditable ? <input type="text" value={updatedSecondaryLanguage} onChange={(e) => handleInputChange(e, setUpdatedSecondaryLanguage)} /> : userDetails.secondary_language}</p> */}
              {/* <div className={styles.programmingLanguagesSection}>
           <p className={styles.detailTitle}><strong>Programming Languages and Technologies</strong></p>
           <ul className={styles.techList}>
             {userDetails.programmingLanguages.map((language, index) => (
               <li key={index} className={styles.dataContent}>{language}</li>
             ))}
           </ul>
         </div> */}
              {isSidebarEditable && (
                <div>
                  <p className={styles.detailTitle}>Email:</p>
                  <p className={styles.dataContent}><input type="text" value={updatedEmail} onChange={(e) => handleInputChange(e, setUpdatedEmail)} /></p>
                  {/* <p className={styles.detailTitle}>Select Programming Languages and Technologies:</p> */}
                  {/* {codeLanguageArray.map((tech, index) => (
               <div key={index} className={styles.dataContent}>
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
             ))} */}
                </div>
              )}
            </div>
            {isAdmin && (
              <div>
                <div className={styles.adminSection}>

                  <button className={styles.buddiesButton} onClick={() => router.push('/user/manage-buddies')}>Manage Buddies</button>

                  <button className={styles.messagesButton} onClick={() => router.push('/user/messages')}>Manage Messages</button>
                </div>
              </div>

            )}
          </aside>
        </div>

        <div className={styles.centerColumns}>
          <div className={styles.centerColumn}>

            <div className={`${styles.topCenterPlaceholder} ${styles.relativePosition}`}>
              {!isBioEditable ? (
                <div className={styles.editIcon} onClick={toggleBioEditMode} style={{ color: '#939393', cursor: 'pointer', position: 'absolute', top: '20px', right: '20px' }}>
                  <FontAwesomeIcon icon={faEdit} />
                </div>
              ) : (
                <div className={styles.editOptions} style={{ color: '#939393', position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
                  <div className={styles.saveIcon} onClick={handleProfileUpdate} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faSave} />
                  </div>
                  <div className={styles.cancelIcon} onClick={toggleBioEditMode} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faTimes} />
                  </div>
                </div>
              )}
              <h2 className={styles.bioHeader}>Placeholder</h2>
              {isBioEditable ? (
                <textarea
                  className={`${styles.textAreaField} ${isBioEditable ? styles.bioEdit : ''}`}
                  onChange={(e) => handleInputChange(e, setUpdatedBuddyBio)}
                  value={updatedBuddyBio}
                ></textarea>

              ) : (
                <p className={styles.buddyBio}>{userDetails.buddy_bio}</p>
              )}
            </div>

          </div>
          <div className={styles.centerColumn}>
            <div className={styles.techSection}>


              <p className={styles.techHeader}>Technologies</p>
              <ul className={styles.techList}>
                {userDetails.programmingLanguages.map((language, index) => (
                  <li key={index} className={styles.techContent}>{language}</li>
                ))}
              </ul>

              {isSidebarEditable && (
                <div>
                  <p className={styles.detailTitle}>Select Programming Languages and Technologies:</p>

                  {codeLanguageArray.map((tech, index) => (
                    <div key={index} className={styles.dataContent}>
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
              )}

            </div>
          </div>
          <div className={styles.centerColumn}>
            <div className={styles.eventsSection}>
              <h3 className={styles.eventsHeader}>  Events Placeholder</h3>
            </div>
          </div>
        </div>

        <div className={`${styles.sidebar} ${styles.rightSidebar}`}>
        <div className={`${styles.profileBio} ${styles.relativePosition}`}>
              {!isBioEditable ? (
                <div className={styles.editIcon} onClick={toggleBioEditMode} style={{ color: '#939393', cursor: 'pointer', position: 'absolute', top: '20px', right: '20px' }}>
                  <FontAwesomeIcon icon={faEdit} />
                </div>
              ) : (
                <div className={styles.editOptions} style={{ color: '#939393', position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
                  <div className={styles.saveIcon} onClick={handleProfileUpdate} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faSave} />
                  </div>
                  <div className={styles.cancelIcon} onClick={toggleBioEditMode} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faTimes} />
                  </div>
                </div>
              )}
              <h2 className={styles.bioHeader}>Biography</h2>
              {isBioEditable ? (
                <textarea
                  className={`${styles.textAreaField} ${isBioEditable ? styles.bioEdit : ''}`}
                  onChange={(e) => handleInputChange(e, setUpdatedBuddyBio)}
                  value={updatedBuddyBio}
                ></textarea>

              ) : (
                <p className={styles.buddyBio}>{userDetails.buddy_bio}</p>
              )}
            </div>

        </div>
      </div>

    </div>
  );
}

export default Profile;



