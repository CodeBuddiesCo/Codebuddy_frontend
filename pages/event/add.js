import { useState, useEffect} from "react";
import { parseISO, format } from 'date-fns';
import Header from "../../components/Header";

function AddEvent({selectedDate}) {
  const [defaultFormDate, setDefaultFormDate] = useState("")
  const [defaultFormTime, setDefaultFormTime] = useState("19:00")
  const [selectedFormTime, setSelectedFormTime] = useState("")
  const [selectedFormDate, setSelectedFormDate] = useState("")
  const [selectedDateWithTime, setSelectedDateWithTime] = useState("")
  const [openToBuddyLabel, setOpenToBuddyLabel] = useState(false)
  const [primaryLanguageLabel, setPrimaryLanguageLabel] = useState(false)
  const [secondaryLanguageLabel, setSecondaryLanguageLabel] = useState(false)
  // const [timeLabel, setTimeLabel] = useState(false)
  // const [dateLabel, setDateLabel] = useState(false)


  const formDateFunction = () => {
    if (selectedDate) {
    setDefaultFormDate(selectedDate.toISOString().slice(0,10))
  } else {
    setDefaultFormDate(new Date().toISOString().slice(0,10))
  }
}

  const handleAddTimeToDate = (event) => {
    event.preventDefault();
    if(selectedFormDate && selectedFormTime) {
      console.log(selectedFormDate)
      const connectedDateAndTime = new Date(selectedFormDate + "T" + selectedFormTime + ":00")
      setSelectedDateWithTime(connectedDateAndTime.toISOString())
    } else if (selectedFormDate && !selectedFormTime) {
      console.log(selectedFormDate)
      const connectedDateAndTime = new Date(selectedFormDate + "T" + defaultFormTime + ":00")
      setSelectedDateWithTime(connectedDateAndTime.toISOString())
    } else if (!selectedFormDate && selectedFormTime) {
      console.log(selectedFormDate)
      const connectedDateAndTime = new Date(defaultFormDate + "T" + selectedFormTime + ":00")
      setSelectedDateWithTime(connectedDateAndTime.toISOString())
    } else {
      console.log(selectedFormDate)
      const connectedDateAndTime = new Date(defaultFormDate + "T" + defaultFormTime + ":00")
      setSelectedDateWithTime(connectedDateAndTime.toISOString())
    }
  }

  useEffect(() => {
    formDateFunction()
  }, [])

  return (
    <div>
      <Header/>
      <div className="add-event-page">
        <div className="add-event-main-content-container">
          <div className="add-event-form-image-container">
          </div>
          {selectedDateWithTime && <p>{format(parseISO(selectedDateWithTime), 'PPPPpp')}</p>}
          <form className="add-event-form-container" onSubmit={handleAddTimeToDate}>
            <div className="add-event-select-border">
              {openToBuddyLabel && <label className="add-event-select-label">Open to additional buddy?</label>}
              <select className="add-event-select" id="open-to-buddy"  onChange={() => setOpenToBuddyLabel(true)} required>
                <option disabled selected>Open to additional buddy?</option>
                <option value="allow">Allow</option>
                <option value="don't allow">Don't Allow</option>
              </select>  
            </div>
            <div className="add-event-select-border">
              {primaryLanguageLabel && <label className="add-event-select-label">Primary Code Language</label>}
              <select className="add-event-select" id="Primary-Language" onChange={() => setPrimaryLanguageLabel(true)} required>
                <option value="Secondary Code Language" disabled selected hidden>Primary Code Language</option>
                <option value="HTML">HTML</option>
                <option value="JavaScript">JavaScript</option>
                <option value="PHP">PHP</option>
              </select>
            </div>
            <div className="add-event-select-border">
              {secondaryLanguageLabel && <label className="add-event-select-label">Primary Code Language</label>}
              <select className="add-event-select" id="Secondary-Language" onChange={() => setSecondaryLanguageLabel(true)} required>
                <option value="Secondary Code Language" disabled selected hidden>Secondary Code Language</option>
                <option value="HTML">HTML</option>
                <option value="JavaScript">JavaScript</option>
                <option value="PHP">PHP</option>
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
            <button type="submit" >Submit</button>
          </form>
        </div>
      </div>
    </div>
  )
  }
  
  export default AddEvent;