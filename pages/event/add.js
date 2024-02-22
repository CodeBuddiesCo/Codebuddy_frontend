import { useState, useEffect} from "react";
import { parseISO, format, set } from 'date-fns';
import Header from "../../components/Header";
import { fetchAddEvent } from "../../event_api_calls";
import Link from "next/link";
import Unauthorized from "../../components/Unauthorized";
import Loading from "../../components/Loading";
const {codeLanguageArray} = require('../../Arrays/CodeLanguageArray')

function AddEvent({selectedDate, isBuddy, setIsBuddy}) {
  const [defaultFormDate, setDefaultFormDate] = useState("")
  const [defaultFormTime, setDefaultFormTime] = useState((new Date().toTimeString()).slice(0,5))
  const [selectedFormTime, setSelectedFormTime] = useState("")
  const [selectedFormDate, setSelectedFormDate] = useState("")
  const [openToBuddy, setOpenToBuddy] = useState("")
  const [primaryLanguage, setPrimaryLanguage] = useState("")
  const [secondaryLanguage, setSecondaryLanguage] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [secondaryLanguageLabel, setSecondaryLanguageLabel] = useState(false)
  const [secondaryLanguageArray, setSecondaryLanguageArray] = useState(codeLanguageArray)
  const [primaryLanguageArray, setPrimaryLanguageArray] = useState(codeLanguageArray)
  const [zoomLink, setZoomLink] = useState("")
  const [successMessage, setSuccessMessage] = useState(false)

  const formDateFunction = () => {
    if (selectedDate) {
      console.log(selectedDate)
      setDefaultFormDate(selectedDate.toISOString().slice(0,10))
    } else {
      let d = new Date() 
      let month = ("0" + (d.getMonth() + 1)).slice(-2);
      let date = ("0" + d.getDate()).slice(-2);
      setDefaultFormDate(d.getFullYear()+"-"+month+"-"+date)
    }
  }

  const filterPrimaryLanguageArray = (selectedSecondary) => {
    if (primaryLanguage === "") {
      let filteredArray = []
      for (let i=0; i < codeLanguageArray.length; i++) {
        if (codeLanguageArray[i] != selectedSecondary) {
          filteredArray.push(codeLanguageArray[i])
        } 
        setPrimaryLanguageArray(filteredArray)
      } 
    } return 
  }
//!this still isn't working perfectly it only work for the first time selected so I think I need to add in some logic and make same changes on admin_add //
  const filterSecondLanguageArray = (selectedPrimary) => {
    if (secondaryLanguage === "") {
      let filteredArray = []
      for (let i=0; i < codeLanguageArray.length; i++) {
        if (codeLanguageArray[i] != selectedPrimary) {
          filteredArray.push(codeLanguageArray[i])
        } 
        setSecondaryLanguageArray(filteredArray)
      } 
    } return 
  }

  async function handleAddEvent(event) {
    event.preventDefault();
    let selectedDateWithTime = ""
    let secondBuddy = ""

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

      if (openToBuddy === "allow") {
        secondBuddy = "open"
      } else if (openToBuddy === "don't allow"){
        secondBuddy = "closed"
      }

      if (selectedDateWithTime > (new Date()).toISOString()) {
        
        const results = await fetchAddEvent (secondBuddy, primaryLanguage, secondaryLanguage, selectedDateWithTime, zoomLink, additionalInfo);
        console.log("🚀 ~ file: add.js:58 ~ handleAddEvent ~ results:", results);
      
        if(results[0].id){
          setOpenToBuddy("");
          setPrimaryLanguage("");
          setSecondaryLanguage("")
          setSecondaryLanguageLabel("")
          setZoomLink("")
          setSuccessMessage(true)
          setAdditionalInfo("")

        }
      } else {
        alert("Event time must be in the future")
        console.error("Selected time must be in the future")
      }

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    setIsBuddy(JSON.parse(window.localStorage.getItem("isBuddy")));
    formDateFunction()
  }, [])

  return (
    <div>
      <Header/>
      <div className="add-event-page">
        {!isBuddy && <Unauthorized/>}
        {isBuddy && <div className="add-event-main-content-container">
          <img className="add-event-form-image-container" src="/jametlene-reskp-fliwkBbS7oM-unsplash.jpg"
              style={{ width: '52%', objectFit: 'cover', backgroundSize: 'contain', overflow: 'hidden'}}>
          </img>
          {successMessage && <div className="add-event-form-container">
            <div className="add-event-form-header-container">
              <h1 className="add-event-form-header2">Success!!</h1>
              <h1 className="add-event-form-header1">The crew is on the way!</h1>
            </div>
            <div className="add-event-form-button-container">
            <Link onClick={(event) => (setSuccessMessage(false))} href="/event/add"className="add-event-form-button" >Add Another Event</Link>
              <Link href="/event/calendar" className="add-event-form-button cancel" >Return to calendar</Link>
            </div>  
          </div>}
          {!successMessage && <form className="add-event-form-container" onSubmit={handleAddEvent}>
            <div className="add-event-form-header-container">
              <h1 className="add-event-form-header1">Gather the crew...</h1>
              <h1 className="add-event-form-header2">add an event!</h1>
            </div>
            <div className="add-event-select-border">
              {openToBuddy && <label className="add-event-select-label">Open to additional buddy?</label>}
              <select className="add-event-select" id="open-to-buddy"  onChange={(event) => setOpenToBuddy(event.target.value)} required>
                <option value="" disabled selected>Open to additional buddy?</option>
                <option value="allow">Allow</option>
                <option value="don't allow">Don't Allow</option>
              </select>  
            </div>
            <div className="add-event-select-border">
              {primaryLanguage && <label className="add-event-select-label">Primary Code Language</label>}
              <select className="add-event-select" id="Primary-Language" onChange={(event) => {setPrimaryLanguage(event.target.value); filterSecondLanguageArray(event.target.value)}} required>
                <option value="" disabled selected>Primary Code Language</option>
                {primaryLanguageArray.map((language) => <option value={language}>{language}</option>)}
                </select>
            </div>
            <div className="add-event-select-border">
              {secondaryLanguageLabel && <label className="add-event-select-label">Secondary Code Language</label>}
              <select className="add-event-select" id="Secondary-Language" onChange={(event) => {setSecondaryLanguageLabel(true); setSecondaryLanguage(event.target.value), filterPrimaryLanguageArray(event.target.value)}}>
                <option value="" disabled selected>Secondary Code Language</option>
                <option value="">None</option>
                {secondaryLanguageArray.map((language) => <option value={language}>{language}</option>)}
              </select>
            </div>
            <div className="add-event-date-time-select-container">
              <div className="add-event-select-border small">
                <label className="add-event-select-label">Event Date</label>
                <input className="add-event-select small" type="date" min={defaultFormDate} defaultValue={defaultFormDate} onChange={(event) => setSelectedFormDate(event.target.value)}></input>
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
  
  export default AddEvent;