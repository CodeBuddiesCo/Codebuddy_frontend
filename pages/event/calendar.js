import { useState, useEffect, useRef} from "react";
import { fetchAllEvents } from "../../event_api_calls";
import { parseISO, format } from 'date-fns';
import React from 'react'
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import Link from "next/link";
import { useRouter } from "next/router";

function CalendarOfEvents({allEvents, setAllEvents, loading, setLoading, isBuddy, setIsBuddy, isAdmin, setIsAdmin, setSelectedDate, setCurrentPage, currentPage}) {
  const router = useRouter()
  const [state, setState] = useState({currentDate: new Date(),});
  const [detailedDay, setDetailedDay] = useState(10)
  const [toggle, setToggle] = useState("calendar-popout-container")
  const { currentDate } = state;
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];
  const days = [];

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

  const backToCurrentMonth = () => {
    Link
  }

  useEffect(() => {
    setIsBuddy(JSON.parse(window.localStorage.getItem("isBuddy")));
    setIsAdmin(JSON.parse(window.localStorage.getItem("isAdmin")));
    getAllEvents();
    setCurrentPage("Event Calendar")
    console.log(new Date(currentDate.getFullYear(), (currentDate.getMonth()), detailedDay))
  }, []);

  return (
    <div className="calendar-page" id="empty-control" onClick={()=> setToggle("calendar-popout-container")}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,200,0,0" />
      <Header {...currentPage={currentPage}}/>
      <div className="header-background"></div>
      {loading && <Loading/>}
      {!loading &&<div>
        <div className="calendar-all-content">
          <div className="calendar-main-content">
            <div>
              <div className="calendar-controls">
                <button className="material-symbols-outlined" onClick={prevMonth}>arrow_back</button>
                <p className="calendar-header">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</p>
                <button className="material-symbols-outlined" onClick={nextMonth}>arrow_forward</button>
              </div>
              <div className="calendar-add-button-container">
                {(currentDate.getMonth() +1) > (new Date().getMonth() +1) &&<button onClick={() => router.reload()} title="Current Month" className="material-symbols-outlined return">keyboard_double_arrow_left</button>}
                {isBuddy && !isAdmin &&<Link href="/event/add" title="Add Event"className="material-symbols-outlined add-button">calendar_add_on</Link>}
                {isAdmin &&<Link href="/event/admin_add" title="Add Event" className="material-symbols-outlined add-button">calendar_add_on</Link>}
              </div>     
              <div className="calendar-days-container"> 
                {daysOfWeek.map((day)=>(<div key={day} className="calendar-days">{day}</div>))}
              </div>
              <div className="calendar-dates-container">
                {days.map((day) =>(<div key={day.key} className="calendar-dates" onClick={(e) => {e.stopPropagation(); if (day.key > 0) {setToggle("calendar-popout-container open"); setDetailedDay(day.key)} else {setToggle("calendar-popout-container")}}} >
                  <div className="calendar-num-add-container">
                    {isBuddy && !isAdmin &&<div className="empty-control">
                      {(currentDate.getFullYear() == new Date().getFullYear()) && ((currentDate.getMonth() +1) > (new Date().getMonth() +1)) && <div>
                        {day.key > 0 &&<Link href="/event/add"><button className="material-symbols-outlined add-buttons" onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.key))}>calendar_add_on</button></Link>}
                      </div>}
                      {(currentDate.getFullYear() == new Date().getFullYear()) && ((currentDate.getMonth() +1) == (new Date().getMonth() +1)) && <div>
                        {day.key >= new Date().getDate() && <Link href="/event/add"><button className="material-symbols-outlined add-buttons" onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.key))}>calendar_add_on</button></Link>}
                      </div>}
                    </div>}
                    {isAdmin &&<div className="empty-control">
                      {(currentDate.getFullYear() == new Date().getFullYear()) && ((currentDate.getMonth() +1) > (new Date().getMonth() +1)) && <div>
                        {day.key > 0 &&<Link href="/event/admin_add"><button className="material-symbols-outlined add-buttons" onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.key))}>calendar_add_on</button></Link>}
                      </div>}
                      {(currentDate.getFullYear() == new Date().getFullYear()) && ((currentDate.getMonth() +1) == (new Date().getMonth() +1)) && <div>
                        {day.key >= new Date().getDate() && <Link href="/event/admin_add"><button className="material-symbols-outlined add-buttons" onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.key))}>calendar_add_on</button></Link>}
                      </div>}
                    </div>}
                    {isBuddy && !isAdmin &&<div className="empty-control" >
                      {((currentDate.getFullYear()) === (new Date().getFullYear()+1)) && <div className="empty-control">
                        {day.key > 0 && <Link href="/event/add"><button className="material-symbols-outlined add-buttons" onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.key))}>calendar_add_on</button></Link>}
                      </div>}
                    </div>}
                    {isAdmin &&<div className="empty-control">
                      {((currentDate.getFullYear()) === (new Date().getFullYear()+1)) && <div className="empty-control">
                        {day.key > 0 &&<Link href="/event/admin_add"><button className="material-symbols-outlined add-buttons" onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.key))}>calendar_add_on</button></Link>}
                      </div>}
                    </div>}
                    {day.key > 0 && <h4 className="calendar-date-num">{day.key}</h4>}
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
            <button onClick={()=> {if (detailedDay > 0) {setToggle("calendar-popout-container")}}}></button>
            <p>{format(parseISO(detailedDate), 'iiii LLLL do')}</p>
            {allEvents[0] && allEvents.map(event => (<Link href={`/event/details/${event.event_id}`}>
              <div  key={event.event_id} >
                {format(parseISO(event.date_time), 'M') == (currentDate.getMonth() +1) && format(parseISO(event.date_time), 'y') == (currentDate.getFullYear()) && <div>
                  {format(parseISO(event.date_time), 'd') === detailedDay  && <div className="calendar-popout-event-container">
                    <div className="calendar-popout-time">{format(parseISO(event.date_time), 'p')}</div>
                    <div className="calendar-popout-event-details">
                    <div className="calendar-popout-text">{event.primary_language} {event.secondary_language && <span> & {event.secondary_language}</span>} Buddy Code</div>
                    {(event.buddy_two === 'open') &&<div className="calendar-popout-text">Host Buddy: {event.buddy_one}</div>}
                      {(event.buddy_two === 'closed') &&<div className="calendar-popout-text">Host Buddy: {event.buddy_one}</div>}
                      {(event.buddy_two !== 'open' ) && (event.buddy_two !== 'closed') &&<div className="calendar-popout-text">Host Buddies: {event.buddy_one} & {event.buddy_two}</div>}
                  </div>
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
