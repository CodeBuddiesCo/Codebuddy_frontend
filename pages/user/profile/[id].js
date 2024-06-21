import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const UserProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchProfile = async () => {
        try {
          const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/profile/${id}`);
          if (!response.ok) {
            throw new Error(`Error fetching profile: ${response.statusText}`);
          }
          const data = await response.json();
          setProfile(data);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchProfile();
    }
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{profile.name}'s Profile</h1>
      <p>Email: {profile.email}</p>
      <p>Username: {profile.username}</p>
      <img src={profile.pfp_url} alt={`${profile.name}'s profile picture`} />
      <p>Title: {profile.title}</p>
      <p>Primary Language: {profile.primary_language}</p>
      <p>Secondary Language: {profile.secondary_language}</p>
      <p>Bio: {profile.buddy_bio}</p>
      <p>Programming Languages:</p>
      <ul>
        {profile.programmingLanguages.map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
