import { useState, useEffect} from "react";
import { parseISO, format, set } from 'date-fns';
import Header from "../../components/Header";
import { fetchAdminAddEvent } from "../../event_api_calls";
import Link from "next/link";
const {codeLanguageArray} = require('../../Arrays/CodeLanguageArray')

function AdminAddEvent({selectedDate, isAdmin, setIsAdmin}) {
  const [defaultFormDate, setDefaultFormDate] = useState("")
  const [defaultFormTime, setDefaultFormTime] = useState("19:00")
  const [selectedFormTime, setSelectedFormTime] = useState("")
  const [selectedFormDate, setSelectedFormDate] = useState("")
  const [primaryBuddy, setPrimaryBuddy] = useState("")
  const [secondaryBuddy, setSecondaryBuddy] = useState("")
  const [primaryLanguage, setPrimaryLanguage] = useState("")
  const [secondaryLanguage, setSecondaryLanguage] = useState("")
  const [secondaryLanguageLabel, setSecondaryLanguageLabel] = useState(false)
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
      if(selectedFormDate && selectedFormTime) {
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

      const results = await fetchAdminAddEvent (primaryBuddy, secondaryBuddy, primaryLanguage, secondaryLanguage, selectedDateWithTime, zoomLink);
      console.log("🚀 ~ file: add.js:58 ~ handleAddEvent ~ results:", results);
      
      if(results.id){
        setOpenToBuddy("");
        setPrimaryLanguage("");
        setSecondaryLanguage("")
        setSecondaryLanguageLabel("")
        setZoomLink("")
        setSuccessMessage(true)
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
        {!isAdmin && <div className="loading-page">
          <div className="loading-message">
          <h1>You do not have the correct access level to reach this page</h1>
          </div>
        </div>}
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
              <Link href="/event/add"className="add-event-form-button" >Add Another Event</Link>
              <Link href="/event/calendar" className="add-event-form-button cancel" >Return to calendar</Link>
            </div>  
          </div>}
          {!successMessage && <form className="add-event-form-container" onSubmit={handleAddEvent}>
            <div className="add-event-form-header-container">
              <h1 className="add-event-form-header1">Gather the crew...</h1>
              <h1 className="add-event-form-header2">add an event!</h1>
            </div>
            <div className="add-event-select-border">
              {primaryBuddy && <label className="add-event-select-label">Primary Event Buddy</label>}
              <select className="add-event-select" id="Primary Event Buddy"  onChange={(event) => setPrimaryBuddy(event.target.value)} required>
                <option value="" disabled selected>Primary Event Buddy</option>
                <option value="Hollye">Hollye</option>
                <option value="Catherine">Catherine</option>
              </select>  
            </div>
            <div className="add-event-select-border">
              {secondaryBuddy && <label className="add-event-select-label">Secondary Event Buddy</label>}
              <select className="add-event-select" id="Secondary Event Buddy"  onChange={(event) => setSecondaryBuddy(event.target.value)} required>
                <option value="" disabled selected>Secondary Event Buddy</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Hollye">Hollye</option>
                <option value="Catherine">Catherine</option>
              </select>  
            </div>
            <div className="add-event-select-border">
              {primaryLanguage && <label className="add-event-select-label">Primary Code Language</label>}
              <select className="add-event-select" id="Primary-Language" onChange={(event) => setPrimaryLanguage(event.target.value)} required>
                <option value="" disabled selected>Primary Code Language</option>
                {codeLanguageArray.map((language) => <option value={language}>{language}</option>)}
                </select>
            </div>
            <div className="add-event-select-border">
              {secondaryLanguageLabel && <label className="add-event-select-label">Secondary Code Language</label>}
              <select className="add-event-select" id="Secondary-Language" onChange={(event) => {setSecondaryLanguageLabel(true); setSecondaryLanguage(event.target.value)}} >
              <option value="" disabled selected>Secondary Code Language</option>
              <option value="">None</option>
              {codeLanguageArray.map((language) => <option value={language}>{language}</option>)}
              </select>
            </div>
            <div className="add-event-date-time-select-container">
              <div className="add-event-select-border small">
                <label className="add-event-select-label">Event Date</label>
                <input className="add-event-select small" type="date" defaultValue={defaultFormDate} onChange={(event) => setSelectedFormDate(event.target.value)}></input>
              </div>
              <div className="add-event-select-border small right">
                <label className="add-event-select-label">Event time</label>
                <input className="add-event-select small" type="time" defaultValue={defaultFormTime} onChange={(event) => setSelectedFormTime(event.target.value)}></input>
              </div>
            </div>
            <div className="add-event-select-border">
              {zoomLink && <label className="add-event-select-label">Zoom Meeting Link</label>}
              <input className="add-event-select text-entry" type="text" placeholder="Zoom Meeting Link" id="zoom-link" onChange={(event) => {setZoomLink(event.target.value)}} required>
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