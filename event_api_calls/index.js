

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

    if (data) {
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




