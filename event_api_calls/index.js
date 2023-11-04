
const setHeader = () => {
  const token = window.localStorage.getItem("token")

  if (token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ token }`
    }
  } else {
    return {
      'Content-Type': 'application/json',
    }
  }
}

export async function fetchAllEvents() {
  
  try {

    const url = `https://codebuddiesserver.onrender.com/api/events`;
    const response = await fetch(url, {
      method: "GET"
    });
    const data = await response.json();

    if (data[0]) {
      console.log('Data from fetchAllEvents :>> ', data);
      return data
    } else {
      console.log ("No Events from fetchAllEvents")
      return({error: "No Events"})
    }

  } catch (error) {
    throw error;
  }
}

export async function fetchAddEvent(secondBuddy, primaryLanguage, secondaryLanguage, selectedDateWithTime, zoomLink) {
  try {
    const header = setHeader()
    const username = window.localStorage.getItem("username")

    const url = `https://codebuddiesserver.onrender.com/api/events`;
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(
        {
          buddy_one: username,
          buddy_two: secondBuddy, 
          primary_language: primaryLanguage, 
          secondary_language: secondaryLanguage,
          date_time: selectedDateWithTime,
          spots_available: 3,
          meeting_link: zoomLink
        }
      )
    });
    const data = await response.json();
    console.log("🚀 ~ file: index.js:62 ~ fetchAddEvent ~ data:", data)
    
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchUpcomingEvents() {
  
  try {

    const url = `https://codebuddiesserver.onrender.com/api/events/upcoming`;
    const response = await fetch(url, {
      method: "GET"
    });
    const data = await response.json();

    if (data[0]) {
      console.log('data from fetchUpcomingEvents :>> ', data);
      return data
    } else {
      console.log ("No Events from fetchUpcomingEvents")
      return({error: "No Events"})
    }

  } catch (error) {
    throw error;
  }
}

export async function fetchEventById(eventId) {
  console.log("eventId in fetchEventById", eventId)
  try {

    const url = `https://codebuddiesserver.onrender.com/api/events/search_by_id/${eventId}`;
    const response = await fetch(url, {
      method: "GET"
    });
    const data = await response.json();

    if (data.event_id) {
      console.log('data from fetchEventById :>> ', data);
      return [data]
    } else {
      console.log ("No Events from fetchEventById")
      return({error: "No Events"})
    }

  } catch (error) {
    throw error;
  }
}




