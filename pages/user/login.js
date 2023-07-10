import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://54.196.0.68/api/users/login', {
        username,
        password,
      });

      if (response.data.token) {
        setMessage('You have successfully logged in');

        setUsername('');
        setPassword('');
      } else {
        throw new Error();
      }
    } catch (error) {
      setMessage('Invalid username or password');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>This is where you will log in</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {message && <p>{message}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
