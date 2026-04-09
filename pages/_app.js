require('dotenv').config()
import {useEffect, useState} from "react";
import '/styles/globals.css'
import '/styles/authForms.module.css'
import {SessionProvider} from 'next-auth/react'
import {fetchAllBuddies} from "../api_calls_event";


export default function App({ Component, pageProps, session }) {
  const [allEvents, setAllEvents] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [isBuddy, setIsBuddy] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [currentPage, setCurrentPage] = useState("")
  const [today, setToday] = useState(new Date())
  const [buddyArray, setBuddyArray] = useState([])
  const [buddyUsernameArray, setBuddyUsernameArray] = useState([])


  async function getAllBuddies() {
    try {
      const buddyUsernames = [] 
      const results = await fetchAllBuddies()
      setBuddyArray(() => results);
      results.map((buddy) => {buddyUsernames.push({value: buddy.username, label: buddy.username})})
      setBuddyUsernameArray(buddyUsernames)

    } catch (error) {
      console.error   
    }
  }

  useEffect(() => {
    getAllBuddies()
  }, [])

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} 
        /** All Page State **/
          loading={loading}
          setLoading={setLoading}
          isBuddy={isBuddy}
          setIsBuddy={setIsBuddy}
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          buddyUsernameArray={buddyUsernameArray}
        /** Event State **/
          allEvents={allEvents}
          setAllEvents={setAllEvents}
          upcomingEvents={upcomingEvents}
          setUpcomingEvents={setUpcomingEvents}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          today={today}
        /** Event State **/
      />
    </SessionProvider>
  );
}
