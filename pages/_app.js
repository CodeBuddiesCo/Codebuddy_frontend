require('dotenv').config()

import { useState, useEffect} from "react";
import '/styles/globals.css'
import '/styles/authForms.module.css'
import {SessionProvider} from 'next-auth/react'

export default function App({ Component, pageProps, session }) {
  const [allEvents, setAllEvents] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} 
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
