import { useEffect, useState } from 'react';

export default function MeetOurTeamPage() {
  const [buddies, setBuddies] = useState([]);
  const [following, setFollowing] = useState(new Set()); // Track which users are followed

  useEffect(() => {
    async function loadBuddies() {
      try {
        const response = await fetch('https://codebuddiesserver.onrender.com/api/users/buddies');
        if (!response.ok) {
          throw new Error('Failed to fetch buddies');
        }
        const buddiesList = await response.json();
        setBuddies(buddiesList);
        // Initialize following state if needed
        // For demo, assume all users are not followed
      } catch (error) {
        console.error('Error fetching buddies:', error);
        setBuddies([]); // Set to empty array on error
      }
    }

    loadBuddies();
  }, []);

  const handleFollow = async (followeeId) => {
    try {
      const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/${followeeId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ followeeId }),
      });

      if (!response.ok) {
        throw new Error('Failed to follow user');
      }

      const result = await response.json();
      setFollowing(prevFollowing => new Set(prevFollowing).add(followeeId));
      console.log('Follow result:', result);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Meet Our Team</h1>
      <p>Connect with the amazing people in our community:</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {buddies.map(buddy => (
          <div key={buddy.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', width: '300px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
            <img
              src={buddy.pfp_url || '/default-avatar.png'} // Use a default image if none provided
              alt={buddy.name}
              style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '10px' }}
            />
            <h2 style={{ fontSize: '18px', margin: '10px 0' }}>{buddy.name}</h2>
            <h3 style={{ fontSize: '16px', color: '#0073b1' }}>{buddy.title || 'No title available'}</h3>
            <p style={{ fontSize: '14px', color: '#555' }}>
              {buddy.primary_language ? `Primary Language: ${buddy.primary_language}` : 'Primary Language: Not specified'}
              <br />
              {buddy.secondary_language ? `Secondary Language: ${buddy.secondary_language}` : 'Secondary Language: Not specified'}
            </p>
            <p style={{ fontSize: '14px', color: '#777' }}>{buddy.buddy_bio || 'No bio available'}</p>
            <button
              onClick={() => handleFollow(buddy.id)}
              style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', backgroundColor: '#0073b1', color: '#fff', cursor: 'pointer', marginTop: '10px' }}
              disabled={following.has(buddy.id)} // Disable if already following
            >
              {following.has(buddy.id) ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
