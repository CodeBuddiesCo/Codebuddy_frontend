import { useState, useEffect} from "react";
import { fetchAllEvents, fetchUpcomingEvents } from "../../event_api_calls";
import { parseISO, format, startOfWeek, getDay, parse } from 'date-fns';
import React from 'react'
import Loading from "../../components/Loading";


function CalendarOfEvents({allEvents, setAllEvents, upcomingEvents, setUpcomingEvents, loading, setLoading}) {
  const [state, setState] = useState({currentDate: new Date(),});
  const { currentDate } = state;
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];
  const days = [];

  /* This is constructing a date object with the year, the month following the current month, and then calling the day
  before the first of that month (0), to get the previous day which was the last day of that month and then calling getDate to
  get the amount of days in that month. */
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div className="calendar-day empty" key={`empty-${i}`}></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(<div className="calendar-day" key={i}>{i}</div>);
  }

  const prevMonth = () => {
    const { currentDate } = state;
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setState({ currentDate: newDate });
  };

  const nextMonth = () => {
    const { currentDate } = state;
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setState({ currentDate: newDate });
  };

  async function getAllEvents() {
    try {
      setLoading(true);
      const results = await fetchAllEvents()
      console.log("results from getAllEvents >>", results)
      setAllEvents(() => results);
      setLoading(false);

    } catch (error) {
      console.error   
    }
  }


  useEffect(() => {
    getAllEvents();
  }, [])

  return (
    <div>
      {loading && <Loading/>}
      {!loading &&<div>
        <h1>Codebuddy Calendar of Events</h1>
        <div>
          <div class="calendar-header">
            <button onClick={prevMonth}>Previous</button>
            <h1>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h1>
            <button onClick={nextMonth}>Next</button>
          </div> 
          <div class="calendar-container">
            {days.map((day) =>(<div key={day.key} class="calendar-days">
              {day.key > 0 && <h1>{day.key}</h1>}
              {allEvents[0] && allEvents.map(event =>(
              <div key={event.event_id}>
                {format(parseISO(event.date_time), 'd') === day.key  && <h3>{format(parseISO(event.date_time), 'PPp')}</h3>}
              </div>))}
              {(day.key > 0) && <button>Add Event</button>}
            </div>))}
          </div>
        </div>
      </div>}
    </div>
  )

}

  export default CalendarOfEvents;