import { useState, useEffect} from "react";
import { fetchAllEvents } from "../../event_api_calls";
import { parseISO, format } from 'date-fns';
import React from 'react'
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import Link from "next/link";
import { useRouter } from "next/router";

function CalendarOfEvents({allEvents, setAllEvents, loading, setLoading, isBuddy, setIsBuddy, isAdmin, setIsAdmin, setSelectedDate, setCurrentPage, currentPage}) {
  const router = useRouter()
  const [state, setState] = useState({chosenDate: new Date(),});
  const [selectedDayToDetail, setSelectedDayToDetail] = useState(1)
  const [toggle, setToggle] = useState("calendar-popout-container")
  const [eventCounts, setEventCounts] = useState([]);
  const { chosenDate } = state;
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];
  const days = [];
  const todaysFullDate = new Date()
  const todaysYearMonDate = new Date(todaysFullDate.getFullYear(), todaysFullDate.getMonth(), todaysFullDate.getDate());
  const todaysYearMon = new Date(todaysFullDate.getFullYear(), todaysFullDate.getMonth(), 1)


  /* This is constructing a date object with the year, the month following the current month, and then calling the day
  before the first of that month (0), to get the previous day which was the last day of that month and then calling getDate to
  get the amount of days in that month. */
  const daysInMonth = new Date(chosenDate.getFullYear(), chosenDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(chosenDate.getFullYear(), chosenDate.getMonth(), 1).getDay();  
  const selectedDateToDetail = (new Date(chosenDate.getFullYear(), (chosenDate.getMonth()), selectedDayToDetail)).toISOString()

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({key:`empty-${i}`});
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({key:i});
  }

  const prevMonth = () => {
    const { chosenDate } = state;
    const newDate = new Date(chosenDate.getFullYear(), chosenDate.getMonth() - 1, 1);
    setState({ chosenDate: newDate });
  };

  const nextMonth = () => {
    const { chosenDate } = state;
    const newDate = new Date(chosenDate.getFullYear(), chosenDate.getMonth() + 1, 1);
    setState({ chosenDate: newDate });
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
    setCurrentPage("Event Calendar")
  }, []);
 
  useEffect(() => {
    const counts = days.map(day => {
      const dayEventsCount = allEvents.filter(event => {
        const eventDate = parseISO(event.date_time);
        return format(eventDate, 'd') === day.key.toString() &&
               format(eventDate, 'M') === (chosenDate.getMonth() + 1).toString() &&
               format(eventDate, 'y') === chosenDate.getFullYear().toString();
      }).length;
      return { day: day.key, count: dayEventsCount };
    });
  
    setEventCounts(counts);
  }, [chosenDate, allEvents]);
  

  return (
    <div  className="calendar-page" onClick={()=> setToggle("calendar-popout-container")}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,200,0,0" />
      <Header {...currentPage={currentPage}} />
      {loading && <Loading/>}
        {!loading &&<div  className="calendar-all-content">
          <div className="calendar-main-content">
            <div className="calendar-header">
              <div className="calendar-controls">
                <button title="Previous Month" className="material-symbols-outlined" onClick={prevMonth}>arrow_back</button>
                <p className="calendar-month">{monthNames[chosenDate.getMonth()]} {chosenDate.getFullYear()}</p>
                <button title="Next Month" className="material-symbols-outlined" onClick={nextMonth}>arrow_forward</button>
              </div>
              <div className="calendar-add-button-container">
                {chosenDate > todaysFullDate && <button onClick={() => router.reload()} title="Current Month" className="material-symbols-outlined return">keyboard_double_arrow_left</button>}
                {chosenDate < todaysYearMon && <button onClick={() => router.reload()} title="Current Month" className="material-symbols-outlined return">keyboard_double_arrow_right</button>}
                {isBuddy && !isAdmin &&<Link href="/event/add" title="Add Event"className="material-symbols-outlined add-button">calendar_add_on</Link>}
                {isAdmin &&<Link href="/event/admin_add" title="Add Event" className="material-symbols-outlined add-button">calendar_add_on</Link>}
              </div>     
            </div>
              <div className="calendar-grid">
              <div className="calendar-days-container"> 
                {daysOfWeek.map((day)=>(<div key={day} className="calendar-days">{day}</div>))}
              </div>
              <div className="calendar-dates-container">
                {days.map((day) =>(<div key={day.key} className="calendar-dates" onClick={(e) => {e.stopPropagation(); if (day.key > 0) {setToggle("calendar-popout-container open"); setSelectedDayToDetail(day.key)} else {setToggle("calendar-popout-container")}}} >
                  <div className="calendar-num-add-container">

                    {isBuddy && !isAdmin &&<div className="empty-control">
                      {(new Date(chosenDate.getFullYear(), chosenDate.getMonth(), day.key) >= todaysYearMonDate) && <div>
                        <Link href="/event/add"><button className="material-symbols-outlined add-buttons" onClick={() => setSelectedDate(new Date(chosenDate.getFullYear(), chosenDate.getMonth(), day.key))}>calendar_add_on</button></Link>
                      </div>}
                    </div>}
                    {isAdmin &&<div className="empty-control">
                      {(new Date(chosenDate.getFullYear(), chosenDate.getMonth(), day.key) >= todaysYearMonDate) && <div>
                        <Link href="/event/admin_add"><button className="material-symbols-outlined add-buttons" onClick={() => setSelectedDate(new Date(chosenDate.getFullYear(), chosenDate.getMonth(), day.key))}>calendar_add_on</button></Link>
                      </div>}
                    </div>}
                    {day.key > 0 && <h4 className="calendar-date-num">{day.key} </h4>}
                    {/* <p>(Events: {eventCounts.find(e => e.day === day.key)?.count || 0})</p> */}
                  </div>


                   {/* you need to read and understand this text to see if you should use it or not*/} 
                              {allEvents.map(event => {
              const eventDate = parseISO(event.date_time);
              if (format(eventDate, 'd') === day.key.toString() && format(eventDate, 'M') === (chosenDate.getMonth() + 1).toString() && format(eventDate, 'y') === chosenDate.getFullYear().toString()) {
                return (
                  <Link key={event.event_id} href={`/event/details/${event.event_id}`}>
                    <div className="calendar-event-container">
                      <div className="calendar-event-text">
                        <span className="calendar-event-text bold">{format(eventDate, 'p')}</span> - {event.primary_language} {event.secondary_language && <span> & {event.secondary_language}</span>} Buddy Code
                      </div>
                    </div>
                  </Link>
                );
              }
              return null;
            })}
            {/* you need to read and understand this text to see if you should use it or not*/} 

                </div>))}
                </div>
              </div>

          </div>
          <div className={toggle}>
            <button onClick={()=> {if (selectedDayToDetail > 0) {setToggle("calendar-popout-container")}}}></button>
            <p>{format(parseISO(selectedDateToDetail), 'iiii LLLL do')}</p>
            {allEvents[0] && allEvents.map(event => (<Link href={`/event/details/${event.event_id}`}>
              <div  key={event.event_id} >
                {format(parseISO(event.date_time), 'M') == (chosenDate.getMonth() +1) && format(parseISO(event.date_time), 'y') == (chosenDate.getFullYear()) && <div>
                  {format(parseISO(event.date_time), 'd') === selectedDateToDetail  && <div className="calendar-popout-event-container">
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
        </div>}
    </div>
  )
}

  export default CalendarOfEvents;

                    
                  {/* {allEvents[0] && allEvents.map(event => (<Link href={`/event/details/${event.event_id}`}>
                    <div className="calendar-event-container" key={event.event_id} >
                      {format(parseISO(event.date_time), 'M') == (chosenDate.getMonth() +1) && format(parseISO(event.date_time), 'y') == (chosenDate.getFullYear()) && <div>
                        {format(parseISO(event.date_time), 'd') === day.key  && <div>
                          <div className="calendar-event-text"><span className="calendar-event-text bold">{format(parseISO(event.date_time), 'p')}</span> - {event.primary_language} {event.secondary_language && <span> & {event.secondary_language}</span>} Buddy Code</div>
                        </div>}
                      </div>}
                    </div>
                  </Link>))} */}