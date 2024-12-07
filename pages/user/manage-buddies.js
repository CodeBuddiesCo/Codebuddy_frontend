import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import DemoteBuddy from '../../components/DemoteBuddy';
import { useSession } from 'next-auth/react';

const ManageBuddiesPage = () => {
  const { data: session } = useSession();
  const [buddies, setBuddies] = useState([]);

  useEffect(() => {
    fetchBuddies();
  }, []);

  const demoteFromBuddy = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/demote/${userId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        alert('User successfully demoted from buddy');
        fetchBuddies();
      } else {
        const errorResponse = await response.json();
        alert(`Failed to demote user: ${errorResponse.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Exception:', error);
      alert('Error while demoting user');
    }
  };

  const fetchBuddies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const allUsers = await response.json();
        const buddies = allUsers.filter(user => user.is_buddy);
        setBuddies(buddies);
      } else {
        console.error(`Server responded with status: ${response.status}`);
        alert('Failed to fetch users');
      }
    } catch (error) {
      console.error('Exception:', error);
      alert('Error while fetching users');
    }
  };

  return (
    <div>
      <DemoteBuddy 
        buddies={buddies}
        demoteFromBuddy={demoteFromBuddy}
      />
    </div>
  );
}

export default ManageBuddiesPage;
