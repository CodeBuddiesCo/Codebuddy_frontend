require('dotenv').config()

import { useState, useEffect} from "react";
import '/styles/globals.css'
import '/styles/authForms.module.css'
import {SessionProvider} from 'next-auth/react'
import Header from "../components/Header";

export default function App({ Component, pageProps, session }) {
  const [allEvents, setAllEvents] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [isBuddy, setIsBuddy] = useState(false)

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} 
        /** All Page State **/
          loading={loading}
          setLoading={setLoading}
          isBuddy={isBuddy}
          setIsBuddy={setIsBuddy}
        /** Event State **/
          allEvents={allEvents}
          setAllEvents={setAllEvents}
          upcomingEvents={upcomingEvents}
          setUpcomingEvents={setUpcomingEvents}
        /** Event State **/
      />
    </SessionProvider>
  );
}
