

<div className={styles.profileContainer}>
< Header />
  <div className={styles.mainContent}>

   <div className={styles.sidebar}>
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
       <div className={styles.profilePictureSection}>
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
       <div className={styles.profileName}>
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


         <p className={styles.detailTitle}><strong>Title</strong></p>
         <p className={styles.dataContent}>{isSidebarEditable ? <input type="text" value={updatedTitle} onChange={(e) => handleInputChange(e, setUpdatedTitle)} /> : userDetails.title}</p>
         <p className={styles.detailTitle}><strong>Status</strong></p>
         <p className={styles.dataContent}>{isAdmin ? 'Admin' : isBuddy ? 'Buddy' : 'User'}</p>
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

   </div>
   
   <div className={styles.centerColumns}>
     <div className={styles.centerColumn}>
       
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
     <h2 className={styles.bioHeader}>Bio</h2>
     {isBioEditable ? (
       <textarea
         className={`${styles.textAreaField} ${isBioEditable ? styles.bioEdit : ''}`}
         onChange={(e) => handleInputChange(e, setUpdatedBuddyBio)}
         value={updatedBuddyBio}
       ></textarea>

     ) : (
       <p>{userDetails.buddy_bio}</p>
     )}
   </div>

     </div>
     <div className={styles.centerColumn}>
     <div className={styles.techSection}>


     <p className={styles.detailTitle}><strong>Programming Languages and Technologies</strong></p>
            <ul className={styles.techList}>
              {userDetails.programmingLanguages.map((language, index) => (
                <li key={index} className={styles.dataContent}>{language}</li>
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
 <h3>  Events Placeholder</h3>
</div>
</div>
   </div>
   

   <div className={styles.sidebar}>
   <div className={styles.rightSidebar}>

   <p className={styles.detailTitle}><strong>Primary Language</strong></p>
         <p className={styles.dataContent}>{isSidebarEditable ? <input type="text" value={updatedPrimaryLanguage} onChange={(e) => handleInputChange(e, setUpdatedPrimaryLanguage)} /> : userDetails.primary_language}</p>
         <p className={styles.detailTitle}><strong>Secondary Language</strong></p>
         <p className={styles.dataContent}>{isSidebarEditable ? <input type="text" value={updatedSecondaryLanguage} onChange={(e) => handleInputChange(e, setUpdatedSecondaryLanguage)} /> : userDetails.secondary_language}</p>
   </div>
 </div>
 </div>
 </div>