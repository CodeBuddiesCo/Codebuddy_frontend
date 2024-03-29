import { useState, useEffect, Children} from "react";
import { fetchAllEvents } from "../../event_api_calls";
import { parseISO, format } from 'date-fns';
import React from 'react'
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import Link from "next/link";


function CalendarOfEvents({allEvents, setAllEvents, loading, setLoading, isBuddy, setIsBuddy, isAdmin, setIsAdmin, setSelectedDate, setCurrentPage, currentPage}) {
  const [state, setState] = useState({currentDate: new Date(),});
  const [popout, setPopout] = useState(false)
  const [detailedDay, setDetailedDay] = useState(10)
  const [toggle, setToggle] = useState("calendar-popout-container")
  const { currentDate } = state;
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];
  const days = [];
  setCurrentPage("Event Calendar")


  /* This is constructing a date object with the year, the month following the current month, and then calling the day
  before the first of that month (0), to get the previous day which was the last day of that month and then calling getDate to
  get the amount of days in that month. */
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const detailedDate = (new Date(currentDate.getFullYear(), (currentDate.getMonth()), detailedDay)).toISOString()

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
    setIsBuddy(JSON.parse(window.localStorage.getItem("isBuddy")));
    setIsAdmin(JSON.parse(window.localStorage.getItem("isAdmin")));
    getAllEvents();
    console.log(new Date(currentDate.getFullYear(), (currentDate.getMonth()), detailedDay))
  }, [])

  return (
    <div className="calendar-page" id="test" onClick={()=> setToggle("calendar-popout-container")}>
      <Header {...currentPage={currentPage}}/>
      <div className="header-background"></div>
      {loading && <Loading/>}
      {!loading &&<div>
        <div className="calendar-all-content">
          <div className="calendar-main-content">
            <div>
              <div className="calendar-month">
              <h1 className="calendar-header">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()} Events</h1>
                <button onClick={prevMonth}>Previous</button>
                <button onClick={nextMonth}>Next</button>
                {isBuddy && !isAdmin &&<Link href="/event/add"><button>Add Event</button></Link>}
                {isAdmin &&<Link href="/event/admin_add"><button>Add Event</button></Link>}
              </div>
              <div className="calendar-days-container"> 
                {daysOfWeek.map((day)=>(<div className="calendar-days">{day}</div>))}
              </div>
              <div className="calendar-dates-container">
                {days.map((day) =>(<div key={day.key} className="calendar-dates" onClick={(e) => {e.stopPropagation(); if (day.key > 0) {setToggle("calendar-popout-container open"); setDetailedDay(day.key)} else {setToggle("calendar-popout-container")}}} >
                  <div>{day.key > 0 && <h4 className="calendar-date-num">{day.key}</h4>}
                    {isBuddy && !isAdmin &&<div>
                      {(currentDate.getFullYear() == new Date().getFullYear()) && ((currentDate.getMonth() +1) > (new Date().getMonth() +1)) && <div>
                        {day.key > 0 &&<Link href="/event/add"><button className="add-event-calendar-button" onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.key))}>Add Event</button></Link>}
                      </div>}
                      {(currentDate.getFullYear() == new Date().getFullYear()) && ((currentDate.getMonth() +1) == (new Date().getMonth() +1)) && <div>
                        {day.key >= new Date().getDate() && <Link href="/event/add"><button className="add-event-calendar-button" onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.key))}>Add Event</button></Link>}
                      </div>}
                    </div>}
                    {isAdmin &&<div>
                      {(currentDate.getFullYear() == new Date().getFullYear()) && ((currentDate.getMonth() +1) > (new Date().getMonth() +1)) && <div>
                        {day.key > 0 &&<Link href="/event/admin_add"><button className="add-event-calendar-button" onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.key))}>Add Event</button></Link>}
                      </div>}
                      {(currentDate.getFullYear() == new Date().getFullYear()) && ((currentDate.getMonth() +1) == (new Date().getMonth() +1)) && <div>
                        {day.key >= new Date().getDate() && <Link href="/event/admin_add"><button className="add-event-calendar-button" onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.key))}>Add Event</button></Link>}
                      </div>}
                    </div>}
                    {isBuddy && !isAdmin &&<div>
                      {((currentDate.getFullYear()) === (new Date().getFullYear()+1)) && <div>
                        {day.key > 0 && <Link href="/event/add"><button className="add-event-calendar-button" onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.key))}>Add Event</button></Link>}
                      </div>}
                    </div>}
                    {isAdmin &&<div>
                      {((currentDate.getFullYear()) === (new Date().getFullYear()+1)) && <div>
                        {day.key > 0 &&<Link href="/event/admin_add"><button className="add-event-calendar-button" onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.key))}>Add Event</button></Link>}
                      </div>}
                    </div>}
                  </div>
                  {allEvents[0] && allEvents.map(event => (<Link href={`/event/details/${event.event_id}`}>
                    <div className="calendar-event-container" key={event.event_id} >
                      {format(parseISO(event.date_time), 'M') == (currentDate.getMonth() +1) && format(parseISO(event.date_time), 'y') == (currentDate.getFullYear()) && <div>
                        {format(parseISO(event.date_time), 'd') === day.key  && <div>
                          <div className="calendar-event-text"><span className="calendar-event-text bold">{format(parseISO(event.date_time), 'p')}</span> - {event.primary_language} {event.secondary_language && <span> & {event.secondary_language}</span>} Buddy Code</div>
                        </div>}
                      </div>}
                    </div>
                  </Link>))}
                </div>))}
              </div>
            </div>
          </div>
          <div className={toggle}>
            <button onClick={()=> {if (detailedDay > 0) {setToggle("calendar-popout-container")}}}>x</button>
            <p>{format(parseISO(detailedDate), 'iiii LLLL do')}</p>
            {allEvents[0] && allEvents.map(event => (<Link href={`/event/details/${event.event_id}`}>
              <div className="calendar-detained-event-container" key={event.event_id} >
                {format(parseISO(event.date_time), 'M') == (currentDate.getMonth() +1) && format(parseISO(event.date_time), 'y') == (currentDate.getFullYear()) && <div>
                  {format(parseISO(event.date_time), 'd') === detailedDay  && <div>
                    <div className="calendar-event-text">{format(parseISO(event.date_time), 'p')} - {event.primary_language} {event.secondary_language && <span> & {event.secondary_language}</span>} Buddy Code</div>
                  </div>}
                </div>}
              </div>
            </Link>))}
          </div>
        </div>
      </div>}
    </div>
  )
}

  export default CalendarOfEvents;
