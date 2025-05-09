
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

export async function fetchAddEvent(secondBuddy, primaryLanguage, secondaryLanguage, selectedDateWithTime, zoomLink, additionalInfo) {
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
          meeting_link: zoomLink,
          additional_info: additionalInfo
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

export async function fetchAdminAddEvent(primaryBuddy, secondaryBuddy, primaryLanguage, secondaryLanguage, selectedDateWithTime, zoomLink, additionalInfo) {
  try {
    const header = setHeader()

    const url = `https://codebuddiesserver.onrender.com/api/events`;
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(
        {
          buddy_one: primaryBuddy,
          buddy_two: secondaryBuddy, 
          primary_language: primaryLanguage, 
          secondary_language: secondaryLanguage,
          date_time: selectedDateWithTime,
          spots_available: 3,
          meeting_link: zoomLink,
          additional_info: additionalInfo
        }
      )
    });
    const data = await response.json();
    console.log("🚀 ~ file: index.js:92 ~ fetchAdminAddEvent ~ data:", data)
    
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

export async function fetchSignup(eventId) {
  try {
    const header = setHeader()

    const url = `https://codebuddiesserver.onrender.com/api/events/signup/${eventId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: header
    });
    const data = await response.json();
    console.log("🚀 ~ file: index.js:155 ~ fetchSignup ~ data:", data)
    
    
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchBuddySignup(eventId, buddyUserName) {
  try {
    const header = setHeader()

    const url = `https://codebuddiesserver.onrender.com/api/events/buddy_signup/${eventId}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: header,
      body: JSON.stringify(
        {
          buddyUserName: buddyUserName, 
        }
      )
    });
    const data = await response.json();
    console.log("🚀 ~ file: index.js:178 ~ fetchBuddySignup ~ data:", data)

    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchCancelSignup(eventId) {
  try {
    const header = setHeader()

    const url = `https://codebuddiesserver.onrender.com/api/events/cancel_signup/${eventId}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: header
    });
    const data = await response.json();
    console.log("🚀 ~ file: index.js:173 ~ fetchCancelSignup ~ data:", data)
    
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchCancelBuddySignup(eventId, buddyUserName) {
  try {
    const header = setHeader()

    const url = `https://codebuddiesserver.onrender.com/api/events/buddy_cancel_signup/${eventId}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: header,
      body: JSON.stringify(
        {
          buddyUserName: buddyUserName, 
        }
      )
    });
    const data = await response.json();
    console.log("🚀 ~ file: index.js:219 ~ fetchCancelBuddySignup ~ data:", data)
    
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchCancelEvent(eventId) {
  try {
    const header = setHeader()

    const url = `https://codebuddiesserver.onrender.com/api/events/cancel/${eventId}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: header
    });
    const data = await response.json();
    console.log("🚀 ~ file: index.js:191 ~ fetchCancelSignup ~ data:", data)

    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchDeleteEvent(eventId) {
  try {
    const header = setHeader()

    const url = `https://codebuddiesserver.onrender.com/api/events/delete/${eventId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: header
    });
    const data = await response.json();
    console.log("🚀 ~ file: index.js:209 ~ fetchDeleteEvent ~ data:", data)


    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchOneBuddySearch(primaryCriteria) {
  try {

    const url = `https://codebuddiesserver.onrender.com/api/events/search_by_buddy/${primaryCriteria}`;
    const response = await fetch(url, {
      method: "GET"
    });
    const data = await response.json();

    if (!data[0]) {
      console.log ("No Events from fetchOneBuddySearch")
      return({error: "No Events"})
    }

    if (data[0].event_id) {
      console.log('data from fetchOneBuddySearch :>> ', data);
      return data;
    } 

  } catch (error) {
    console.log(error)
    throw error;
  }
}

export async function fetchTwoBuddySearch(primaryCriteria, secondaryCriteria) {
  try {

    const url = `https://codebuddiesserver.onrender.com/api/events/search_by_buddy/${primaryCriteria}/${secondaryCriteria}`;
    const response = await fetch(url, {
      method: "GET"
    });
    const data = await response.json();
    console.log(data)

    if (!data[0]) {
      console.log ("No Events from fetchTwoBuddySearch")
      return({error: "No Events"})
    }

    if (data[0].event_id) {
      console.log('data from fetchTwoBuddySearch :>> ', data);
      return data;
    } 

  } catch (error) {
    console.log(error)
    throw error;
  }
}

export async function fetchOneLanguageSearch(primaryCriteria) {
  try {

    const url = `https://codebuddiesserver.onrender.com/api/events/search_by_code_language/${primaryCriteria}`;
    const response = await fetch(url, {
      method: "GET"
    });
    const data = await response.json();

    if (!data[0]) {
      console.log ("No Events from fetchOneLanguageSearch")
      return({error: "No Events"})
    }

    if (data[0].event_id) {
      console.log('data from fetchOneLanguageSearch :>> ', data);
      return data;
    } 

  } catch (error) {
    console.log(error)
    throw error;
  }
}

export async function fetchTwoLanguageSearch(primaryCriteria, secondaryCriteria) {
  try {

    const url = `https://codebuddiesserver.onrender.com/api/events/search_by_code_language/${primaryCriteria}/${secondaryCriteria}`;
    const response = await fetch(url, {
      method: "GET"
    });
    const data = await response.json();
    console.log(data)

    if (!data[0]) {
      console.log ("No Events from fetchTwoLanguageSearch")
      return({error: "No Events"})
    }

    if (data[0].event_id) {
      console.log('data from fetchTwoLanguageSearch :>> ', data);
      return data;
    } 

  } catch (error) {
    console.log(error)
    throw error;
  }
}


export async function fetchAllBuddies() {
  
  try {

    const url = `https://codebuddiesserver.onrender.com/api/users/buddies`;
    const response = await fetch(url, {
      method: "GET"
    });
    const data = await response.json();

    if (data[0]) {
      console.log('Data from fetchAllBuddies :>> ', data);
      return data
    } else {
      console.log ("No Buddies from fetchAllBuddies")
      return({error: "No Buddies"})
    }

  } catch (error) {
    throw error;
  }
}