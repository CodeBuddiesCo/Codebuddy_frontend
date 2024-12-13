
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

export async function fetchAddFollow(followeeId) {
  try {
    const header = setHeader()

    const url = `https://codebuddiesserver.onrender.com/api/users/${followeeId}/follow`;
    const response = await fetch(url, {
      method: "POST",
      headers: header
    });
    const data = await response.json();
    console.log("🚀 ~ file: index.js:310 ~ fetchFollowUser ~ data:", data)
    
    
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchRemoveFollow(followedId) {
  try {
    const header = setHeader()

    const url = `https://codebuddiesserver.onrender.com/api/users/${followedId}/unfollow`;
    const response = await fetch(url, {
      method: "Delete",
      headers: header
    });
    const data = await response.json();
    console.log("🚀 ~ file: index.js:310 ~ fetchUnfollowUser ~ data:", data)
    
    
    return data;
  } catch (error) {
    throw error;
  }
}