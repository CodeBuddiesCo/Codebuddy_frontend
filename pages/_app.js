require('dotenv').config()

import { useEffect, useState} from "react";
import '/styles/globals.css'
import '/styles/authForms.module.css'
import {SessionProvider} from 'next-auth/react'


export default function App({ Component, pageProps, session }) {
  const [allEvents, setAllEvents] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [isBuddy, setIsBuddy] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [currentPage, setCurrentPage] = useState("")


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
        /** Event State **/
          allEvents={allEvents}
          setAllEvents={setAllEvents}
          upcomingEvents={upcomingEvents}
          setUpcomingEvents={setUpcomingEvents}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        /** Event State **/
      />
    </SessionProvider>
  );
}
