require('dotenv').config()
import Head from 'next/head'
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
      console.log("results from getAllBuddies >>", results)
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
      <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
      <link href="https://fonts.googleapis.com/css2?family=Arima:wght@100..700&family=Big+Shoulders+Stencil+Display:wght@100..900&family=swap" rel="stylesheet"/>
      </Head>
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
