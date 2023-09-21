import { useRouter } from "next/router";
import { useState, useEffect} from "react";
import { parseISO, format, startOfWeek, getDay, parse } from 'date-fns';
import { faCommentsDollar } from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/Header";

function AddEvent({selectedDate, setSelectedDate}) {
  const [testState, setTestState] = useState("")
  const [selectedDateWithTime, setSelectedDateWithTime] = useState("")
  const router = useRouter();

  console.log("selected date =>", selectedDate)
  const selectedDateCopy = new Date(selectedDate)


  //* .setHours will change the dateObject causing no refresh to state on the page since it seems like the same
  const handleAddTimeToDate = (event) => {
    event.preventDefault();
    const newHour = testState.slice(0,2)
    const newMinutes = testState.slice(3,5)
    selectedDateCopy.setHours(newHour, newMinutes)
    setSelectedDateWithTime(selectedDateCopy.toISOString()) //this is the data I want to return to the create event function
  }


  return (
    <div>
      <Header/>
    <div className="add-event-page">
      <div className="add-event-form-container">
        <div className="add-event-form-image-container">

        </div>
      {selectedDateWithTime && <p>{format(parseISO(selectedDateWithTime), 'PPPPpp')}</p>}
      <form>
        <div className="select-border">
        <select className="add-event-select" id="open-to-buddy" placeholder="Open to additional buddy?" required>
          <option value="Open to additional buddy?" disabled selected hidden>Open to additional buddy?</option>
          <option value="allow">Allow</option>
          <option value="don't-allow">Don't Allow</option>
        </select>
      </div>
      <div className="select-border">
        {/* <p>Open to additional buddy?</p>   */}
        <select className="add-event-select" id="open-to-buddy" placeholder="Open to additional buddy?" required>
          <option value="primary-code-language" disabled selected hidden>Open to additional buddy?</option>
          <option value="allow">Allow</option>
          <option value="don't-allow">Don't Allow</option>
        </select>  
      </div>
      <input type="time" onChange={(event) => setTestState(event.target.value)}></input>
      <button onClick={handleAddTimeToDate}>Submit</button>
      </form>
      </div>
    </div>
    </div>
  )
  }
  
  export default AddEvent;