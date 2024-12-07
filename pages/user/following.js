import { useEffect, useState } from 'react';

const Follows = () => {
  const [followedUsers, setFollowedUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      const userId = localStorage.getItem('userId'); // Get the current user's ID from local storage
      if (!userId) return; // Exit if userId is not found

      console.log(userId);

      try {
        const res = await fetch(`https://codebuddiesserver.onrender.com/api/users/${userId}/follows`);
        if (!res.ok) throw new Error('Failed to fetch followed users');

        const data = await res.json();
        setFollowedUsers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFollowedUsers();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Users You Are Following</h1>
      <ul>
        {followedUsers.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default Follows;
