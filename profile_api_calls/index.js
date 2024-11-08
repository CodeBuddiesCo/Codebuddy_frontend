
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

// const fetchUserDetails = async () => {

//   try {
//     const token = localStorage.getItem('token');
//     const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/me`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (response.status === 200) {
//       const userData = await response.json();
//       console.log('Fetched User Data:', userData);

//       setUserDetails(userData);
//       setFolloweeId(userData.id)
//       setPrimaryLanguages([userData.primary_language, userData.secondary_language])
//       setSecondaryLanguages(userData.programmingLanguages)
//       console.log(primaryLanguages[1])
//     } else {
//       console.error(`Server responded with status: ${response.status}`);
//     }
//   } catch (error) {
//     console.error('Exception:', error);
//   }
// };

// export async function fetchUserDetails() {
//   try {
//     const header = setHeader()

//     const url = `https://codebuddiesserver.onrender.com/api/users/${followeeId}/follow`;
//     const response = await fetch(url, {
//       method: "POST",
//       headers: header
//     });
//     const data = await response.json();
//     console.log("🚀 ~ file: index.js:310 ~ fetchFollowUser ~ data:", data)
    
    
//     return data;
//   } catch (error) {
//     throw error;
//   }
// }


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