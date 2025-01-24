import { useState, useEffect} from "react";
import { fetchAllEvents, fetchOneBuddySearch, fetchTwoBuddySearch } from "../api_calls_event";
import { parseISO, format } from 'date-fns';
import React from 'react'
import Loading from "./Loading";
import Header from "./Header";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from '../styles/userCalendar.module.css';

const UserCalendar = ({ isOpen, onClose, children, userEvents, setAllEvents, loading, setLoading, isBuddy, setIsBuddy, isAdmin, setIsAdmin, setSelectedDate, }) => {
  const router = useRouter()
  const [state, setState] = useState({chosenDate: new Date(),});
  const [selectedDayToDetail, setSelectedDayToDetail] = useState(1)
  const [togglePopout, setTogglePopout] = useState("calendar-popout-container")
  const [toggleSearch, setToggleSearch] = useState(false)
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


  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div>
      <div >
        {children}
        <div  className={styles.calendarPage} onClick={()=> setTogglePopout("calendar-popout-container")}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,200,0,0" />
      {loading && <Loading/>}
      {!loading &&<div  className={styles.calendarAllContent}>
        <div className={styles.calendarMainContent}>
          <div className={styles.calendarHeader}>
            <div className={styles.calendarMonthControls}>
              <button title="Previous Month" className="material-symbols-outlined" onClick={prevMonth}>arrow_back</button>
              <p className={styles.calendarMonth}>{monthNames[chosenDate.getMonth()]} {chosenDate.getFullYear()}</p>
              <button title="Next Month" className="material-symbols-outlined" onClick={nextMonth}>arrow_forward</button>
            </div>
            <div className={styles.calendarMenuContainer}>
              <div>
                {chosenDate > todaysFullDate && <button onClick={() => router.reload()} title="Current Month" className="material-symbols-outlined return">keyboard_double_arrow_left</button>}
                {chosenDate < todaysYearMon && <button onClick={() => router.reload()} title="Current Month" className="material-symbols-outlined return">keyboard_double_arrow_right</button>}
              </div>
              <div className={styles.calendarMenuRightContainer}>
                {isBuddy && !isAdmin &&<Link href="/event/add" title="Add Event"className="material-symbols-outlined add-button">calendar_add_on</Link>}
                {isAdmin &&<Link href="/event/admin_add" title="Add Event" className="material-symbols-outlined add-button">calendar_add_on</Link>}
              </div>
            </div>     
          </div>
            <div className={styles.calendarGrid}>
              <div className={styles.calendarDaysOfTheWeekContainer}> 
                {daysOfWeek.map((day)=>(<div key={day} className={styles.calendarDaysOfTheWeek}>{day}</div>))}
              </div>
              <div className={styles.calendarDatesContainer}>
                {days.map((day) =>(<div key={day.key} className={styles.calendarDates}>
                  <div className={styles.calendarNumAddContainer}>
                    {isBuddy && !isAdmin &&<div className={styles.emptyControl}>
                      {(new Date(chosenDate.getFullYear(), chosenDate.getMonth(), day.key) >= todaysYearMonDate) && <div>
                        <Link href="/event/add"><button className="material-symbols-outlined add-buttons" onClick={() => setSelectedDate(new Date(chosenDate.getFullYear(), chosenDate.getMonth(), day.key))}>calendar_add_on</button></Link>
                      </div>}
                    </div>}
                    {isAdmin &&<div className={styles.emptyControl}>
                      {(new Date(chosenDate.getFullYear(), chosenDate.getMonth(), day.key) >= todaysYearMonDate) && <div>
                        <Link href="/event/admin_add"><button className="material-symbols-outlined add-buttons" onClick={() => setSelectedDate(new Date(chosenDate.getFullYear(), chosenDate.getMonth(), day.key))}>calendar_add_on</button></Link>
                      </div>}
                    </div>}
                    {day.key > 0 && <div className={styles.calendarDateNum}>{day.key} </div>}
                  </div>
                  {userEvents.map(event => {
                    const eventDate = parseISO(event.date_time);
                    if (format(eventDate, 'd') === day.key.toString() && format(eventDate, 'M') === (chosenDate.getMonth() + 1).toString() && format(eventDate, 'y') === chosenDate.getFullYear().toString()) {
                      return (
                        <Link key={event.event_id} href={`/event/details/${event.event_id}`}>
                          <div className={styles.calendarEventContainer}>
                            <div className={styles.calendarEventText}>
                              <span className={styles.calendarEventText}>{format(eventDate, 'p')}</span> - {event.primary_language} {event.secondary_language && <span> & {event.secondary_language}</span>} Buddy Code
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
      </div>}
    </div>
      </div>
    </div>
  );
};

export default UserCalendar;