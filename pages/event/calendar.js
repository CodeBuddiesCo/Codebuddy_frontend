import { useState, useEffect} from "react";
import { fetchAllEvents, fetchOneBuddySearch, fetchTwoBuddySearch } from "../../event_api_calls";
import { parseISO, format } from 'date-fns';
import React from 'react'
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import Link from "next/link";
import { useRouter } from "next/router";


function CalendarOfEvents({setAllEvents, loading, setLoading, isBuddy, setIsBuddy, isAdmin, setIsAdmin, setSelectedDate, setCurrentPage, currentPage}) {
  const router = useRouter()
  const [state, setState] = useState({chosenDate: new Date(),});
  const [selectedDayToDetail, setSelectedDayToDetail] = useState(1)
  const [togglePopout, setTogglePopout] = useState("calendar-popout-container")
  const [toggleSearch, setToggleSearch] = useState(false)
  const [eventCounts, setEventCounts] = useState([]);
  const [primaryCriteria, setPrimaryCriteria] = useState("");
  const [secondaryCriteria, setSecondaryCriteria] = useState("");
  const [searchType, setSearchType] = useState("");
  const { chosenDate } = state;
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];
  const days = [];
  const todaysFullDate = new Date()
  const todaysYearMonDate = new Date(todaysFullDate.getFullYear(), todaysFullDate.getMonth(), todaysFullDate.getDate());
  const todaysYearMon = new Date(todaysFullDate.getFullYear(), todaysFullDate.getMonth(), 1)
  const [displayEvents, setDisplayEvents] = useState([])


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
      results.sort((a, b) => {return new Date (a.date_time) - new Date (b.date_time)}); 
      console.log("results from getAllEvents >>", results)
      setAllEvents(() => results);
      setDisplayEvents(results)
      setLoading(false);

    } catch (error) {
      console.error   
    }
  }

  async function handleSearch(event) {
    event.preventDefault()
    try {
      if (searchType === "Host Buddies") {
        if (primaryCriteria && secondaryCriteria) {
          const results = await fetchTwoBuddySearch(primaryCriteria, secondaryCriteria)
          console.log(results)
          if(results[0]) {
          setDisplayEvents(() => results)}
          console.log(displayEvents)
        } else {
          const results = await fetchOneBuddySearch(primaryCriteria)
          console.log(displayEvents)
          console.log(results)
          if(results[0]) {
            setDisplayEvents(results)
            console.log(displayEvents)
          }
          
        }
      }

    } catch (error) {
      console.error
    }
  }

  useEffect(() => {
    setIsBuddy(JSON.parse(window.localStorage.getItem("isBuddy")));
    setIsAdmin(JSON.parse(window.localStorage.getItem("isAdmin")));
    getAllEvents();
    setSelectedDate("")
    setCurrentPage("Event Calendar")
  }, []);
 
  useEffect(() => {
    const counts = days.map(day => {
      const dayEventsCount = displayEvents.filter(event => {
        const eventDate = parseISO(event.date_time);
        return format(eventDate, 'd') === day.key.toString() &&
               format(eventDate, 'M') === (chosenDate.getMonth() + 1).toString() &&
               format(eventDate, 'y') === chosenDate.getFullYear().toString();
      }).length;
      return { day: day.key, count: dayEventsCount };
    });
  
    setEventCounts(counts);
    console.log(counts)
  }, [chosenDate, displayEvents]);
  

  return (
    <div  className="calendar-page" onClick={()=> setTogglePopout("calendar-popout-container")}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,200,0,0" />
      <Header {...currentPage={currentPage}} />
      {loading && <Loading/>}
      {!loading &&<div  className="calendar-all-content">
        <div className="calendar-main-content">
          <div className="calendar-header">
            <div className="calendar-month-controls">
              <button title="Previous Month" className="material-symbols-outlined" onClick={prevMonth}>arrow_back</button>
              <p className="calendar-month">{monthNames[chosenDate.getMonth()]} {chosenDate.getFullYear()}</p>
              <button title="Next Month" className="material-symbols-outlined" onClick={nextMonth}>arrow_forward</button>
            </div>
            <div className="calendar-menu-container">
              <div>
                {chosenDate > todaysFullDate && <button onClick={() => router.reload()} title="Current Month" className="material-symbols-outlined return">keyboard_double_arrow_left</button>}
                {chosenDate < todaysYearMon && <button onClick={() => router.reload()} title="Current Month" className="material-symbols-outlined return">keyboard_double_arrow_right</button>}
              </div>
              <div className="calendar-menu-right-container">
                {!toggleSearch &&<button onClick={() => setToggleSearch(true)} title="Current Month" className="material-symbols-outlined search">search</button>}
                {toggleSearch && <form className="calendar-search-form-container" onSubmit={handleSearch}>
                  
                  <div className="calendar-select-border">
                    {searchType && <label className="calendar-select-label">Choose Search Type</label>}
                    <select className="calendar-select" onChange={(event) => setSearchType(event.target.value)} required>
                      <option value="" disabled selected>Search Type</option>
                      <option>Host Buddies</option>
                      <option>Code Languages</option>
                    </select>
                  </div>
                  <div className="calendar-select-border">
                    {primaryCriteria && <label className="calendar-select-label">Search Criteria</label>}           
                    <input className="calendar-select input" placeholder="Search Criteria" onChange={(event) => {setPrimaryCriteria(event.target.value)}} required></input>
                  </div>  
                  <div className="calendar-select-border">           
                    {secondaryCriteria &&<label className="calendar-select-label" >Search Criteria</label>}
                    <input className="calendar-select input" placeholder="Search Criteria" onChange={(event) => {setSecondaryCriteria(event.target.value)}}></input>
                  </div>
                  <button className="material-symbols-outlined button calendar-search-form-button" type="submit" >search</button>
                  <button className="material-symbols-outlined button calendar-close-search-button" onClick={(e) => setToggleSearch(false)}>close</button>
                </form>}
                {isBuddy && !isAdmin &&<Link href="/event/add" title="Add Event"className="material-symbols-outlined add-button">calendar_add_on</Link>}
                {isAdmin &&<Link href="/event/admin_add" title="Add Event" className="material-symbols-outlined add-button">calendar_add_on</Link>}
              </div>
            </div>     
          </div>
            <div className="calendar-grid">
              <div className="calendar-days-of-the-week-container"> 
                {daysOfWeek.map((day)=>(<div key={day} className="calendar-days-of-the-week">{day}</div>))}
              </div>
              <div className="calendar-dates-container">
                {days.map((day) =>(<div key={day.key} className="calendar-dates" onClick={(e) => {e.stopPropagation(); if ((day.key > 0) && (eventCounts.find(e => e.day === day.key)?.count > 0)) {setTogglePopout("calendar-popout-container open"); setSelectedDayToDetail(day.key)} else {setTogglePopout("calendar-popout-container")}}} >
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
                  </div>
                  {displayEvents.map(event => {
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
                </div>))}
              </div>
            </div>
          </div>
          <div className={togglePopout}>
            <button onClick={()=> {if (selectedDayToDetail > 0) {setTogglePopout("calendar-popout-container")}}}></button>
            <p>{format(parseISO(selectedDateToDetail), 'iiii LLLL do')}</p>
            {displayEvents.map(event => {
              const eventDate = parseISO(event.date_time);
              if (format(eventDate, 'd') === selectedDayToDetail.toString() && format(eventDate, 'M') === (chosenDate.getMonth() + 1).toString() && format(eventDate, 'y') === chosenDate.getFullYear().toString()) {
                return (
                  <Link href={`/event/details/${event.event_id}`}>
                    <div  key={event.event_id} >
                      <div>
                        <div className="calendar-popout-event-container">
                          <div className="calendar-popout-time">{format(parseISO(event.date_time), 'p')}</div>
                          <div className="calendar-popout-event-details">
                            <div className="calendar-popout-text">{event.primary_language} {event.secondary_language && <span> & {event.secondary_language}</span>} Buddy Code</div>
                            {(event.buddy_two === 'open') &&<div className="calendar-popout-text">Host Buddy: {event.buddy_one}</div>}
                            {(event.buddy_two === 'closed') &&<div className="calendar-popout-text">Host Buddy: {event.buddy_one}</div>}
                            {(event.buddy_two !== 'open' ) && (event.buddy_two !== 'closed') &&<div className="calendar-popout-text">Host Buddies: {event.buddy_one} & {event.buddy_two}</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }
              return null;
            })}
          </div>
      </div>}
    </div>
  )
}

  export default CalendarOfEvents;
