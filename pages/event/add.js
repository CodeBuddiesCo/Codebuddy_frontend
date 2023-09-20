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
      <h1>This will be the form to add an event</h1>
      {selectedDateWithTime && <p>{format(parseISO(selectedDateWithTime), 'PPPPpp')}</p>}
      <form>
      <input type="time" onChange={(event) => setTestState(event.target.value)}></input>
      <button onClick={handleAddTimeToDate}>Submit</button>
      </form>
    </div>
    </div>
  )
  }
  
  export default AddEvent;