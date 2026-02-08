import { useState, useEffect} from "react";
import { parseISO, format, set } from 'date-fns';
import Header from "../../components/Header";
import { fetchAdminAddEvent, fetchAllBuddies } from "../../api_calls_event";
import Link from "next/link";
import Unauthorized from "../../components/Unauthorized";
const {codeLanguageObjectArray} = require('../../Arrays/CodeLanguageObjectArray')

function AdminAddEvent({selectedDate, isAdmin, setIsAdmin, buddyUsernameArray}) {
  const [defaultFormDate, setDefaultFormDate] = useState("")
  const [defaultFormTime, setDefaultFormTime] = useState((new Date().toTimeString()).slice(0,5))
  const [selectedFormTime, setSelectedFormTime] = useState("")
  const [selectedFormDate, setSelectedFormDate] = useState("")
  const [primaryBuddy, setPrimaryBuddy] = useState("")
  const [secondaryBuddy, setSecondaryBuddy] = useState("")
  const [primaryLanguage, setPrimaryLanguage] = useState("")
  const [secondaryLanguage, setSecondaryLanguage] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [zoomLink, setZoomLink] = useState("")
  const [successMessage, setSuccessMessage] = useState(false)
  

  const formDateFunction = () => {
    if (selectedDate) {
      setDefaultFormDate(selectedDate.toISOString().slice(0,10))
    } else {
      let d = new Date() 
      let month = ("0" + (d.getMonth() + 1)).slice(-2);
      let date = ("0" + d.getDate()).slice(-2);
      setDefaultFormDate(d.getFullYear()+"-"+month+"-"+date)
      console.log(defaultFormDate)
    }
  }

  async function handleAddEvent(event) {
    event.preventDefault();
    let selectedDateWithTime = ""

    try {

      if (selectedFormDate && selectedFormTime) {
        const connectedDateAndTime = new Date(selectedFormDate + "T" + selectedFormTime + ":00");
        selectedDateWithTime = connectedDateAndTime.toISOString();
      } else if (selectedFormDate && !selectedFormTime) {
        const connectedDateAndTime = new Date(selectedFormDate + "T" + defaultFormTime + ":00");
        selectedDateWithTime = connectedDateAndTime.toISOString();
      } else if (!selectedFormDate && selectedFormTime) {
        const connectedDateAndTime = new Date(defaultFormDate + "T" + selectedFormTime + ":00");
        selectedDateWithTime = connectedDateAndTime.toISOString();
      } else {
        const connectedDateAndTime = new Date(defaultFormDate + "T" + defaultFormTime + ":00");
        selectedDateWithTime = connectedDateAndTime.toISOString();
      }

      selectedDateWithTime = new Date(selectedDateWithTime).toISOString().slice(0,19).replace("T", " ")
      console.log(selectedDateWithTime)

      const results = await fetchAdminAddEvent (primaryBuddy, secondaryBuddy, primaryLanguage, secondaryLanguage, selectedDateWithTime, zoomLink, additionalInfo);
      console.log("🚀 ~ file: add.js:58 ~ handleAddEvent ~ results:", results);

      
      if(results[0].id){
        setPrimaryBuddy("");
        setSecondaryBuddy("");
        setPrimaryLanguage("");
        setSecondaryLanguage("");
        setZoomLink("");
        setSuccessMessage(true);
        setAdditionalInfo("")
      }

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    setIsAdmin(JSON.parse(window.localStorage.getItem("isAdmin")));
    formDateFunction()
  }, [])

  return (
    <div>
      <Header/>
      <div className="add-event-page">
        {!isAdmin && <Unauthorized/>}
        {isAdmin && <div className="add-event-main-content-container">
          <img className="add-event-form-image-container" src="/jametlene-reskp-fliwkBbS7oM-unsplash.jpg"
              style={{ width: '52%', objectFit: 'cover', backgroundSize: 'contain', overflow: 'hidden'}}>
          </img>
          {successMessage && <div className="add-event-form-container">
            <div className="add-event-form-header-container">
              <h1 className="add-event-form-header2">Success!!</h1>
              <h1 className="add-event-form-header1">The crew is on the way!</h1>
            </div>
            <div className="add-event-form-button-container">
              <Link onClick={(event) => (setSuccessMessage(false))} href="/event/admin_add"className="add-event-form-button" >Add Another Event</Link>
              <Link  href="/event/calendar" className="add-event-form-button cancel">Return to calendar</Link>
            </div>  
          </div>}
          {!successMessage && <form className="add-event-form-container" onSubmit={handleAddEvent}>
            <div className="add-event-form-header-container">
              <h1 className="add-event-form-header1">Gather the crew...</h1>
              <h1 className="add-event-form-header2">add an event!</h1>
            </div>
            <div className="add-event-select-border">
              {primaryBuddy && <label className="add-event-select-label">Primary Event Buddy</label>}
              <select className="add-event-select" value={primaryBuddy} id="Primary Event Buddy"  onChange={(event) => {setPrimaryBuddy(event.target.value)}} required>
                <option value="" disabled selected>Primary Event Buddy</option>
                {buddyUsernameArray.map((buddy) => <option key={buddy.value} value={buddy.value} disabled={buddy.value === secondaryBuddy}>{buddy.label}</option>)}
              </select>  
            </div>
            <div className="add-event-select-border">
              {secondaryBuddy && <label className="add-event-select-label">Secondary Event Buddy</label>}
              <select className="add-event-select" value={secondaryBuddy} id="Secondary Event Buddy"  onChange={(event) => {setSecondaryBuddy(event.target.value)}} required>
                <option value="" disabled selected>Secondary Event Buddy</option>
                <option value="open">open</option>
                <option value="closed">closed</option>
                {buddyUsernameArray.map((buddy) => <option key={buddy.value} value={buddy.value} disabled={buddy.value === primaryBuddy}>{buddy.label}</option>)}
              </select>  
            </div>
            <div className="add-event-select-border">
              {primaryLanguage && <label className="add-event-select-label">Primary Code Language</label>}
              <select className="add-event-select" value={primaryLanguage} id="Primary-Language" onChange={(event) => {setPrimaryLanguage(event.target.value)}} required>
                <option value="" disabled selected>Primary Code Language</option>
                {codeLanguageObjectArray.map((language) => <option key={language.value} value={language.value} disabled={language.value === secondaryLanguage}>{language.label}</option>)}
              </select>
            </div>
            <div className="add-event-select-border">
              {secondaryLanguage && <label className="add-event-select-label">Secondary Code Language</label>}
              <select className="add-event-select" id="Secondary-Language" onChange={(event) => { setSecondaryLanguage(event.target.value)}} >
                <option value="" disabled selected>Secondary Code Language</option>
                <option value="">None</option>
                {codeLanguageObjectArray.map((language) => <option key={language.value} value={language.value} disabled={language.value === primaryLanguage}>{language.label}</option>)}
              </select>
            </div>
            <div className="add-event-date-time-select-container">
              <div className="add-event-select-border small">
                <label className="add-event-select-label">Event Date</label>
                <input className="add-event-select small" type="date" defaultValue={defaultFormDate} onChange={(event) => setSelectedFormDate(event.target.value)}></input>
              </div>
              <div className="add-event-select-border small right">
                <label className="add-event-select-label">Event time</label>
                <input className="add-event-select small" type="time" required onChange={(event) => setSelectedFormTime(event.target.value)}></input>
              </div>
            </div>
            <div className="add-event-select-border">
              {zoomLink && <label className="add-event-select-label">Zoom Meeting Link</label>}
              <input className="add-event-select text-entry" type="text" placeholder="Zoom Meeting Link" id="zoom-link" onChange={(event) => {setZoomLink(event.target.value)}} required>
              </input>
            </div>
            <div className="add-event-select-border">
              {additionalInfo && <label className="add-event-select-label">Additional Event Details</label>}
              <input className="add-event-select text-entry" type="text" placeholder="Additional Event Details" id="add-info" onChange={(event) => {setAdditionalInfo(event.target.value)}} required>
              </input>
            </div>
            <div className="add-event-form-button-container">
              <button className="add-event-form-button" type="submit" >Submit</button>
              <Link href="/event/calendar" className="add-event-form-button cancel" >Cancel</Link>
            </div>  
          </form>}
        </div>}
      </div>
    </div>
  )
}
  
  export default AdminAddEvent;