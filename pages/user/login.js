import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../../styles/authForms.module.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://codebuddiesserver.onrender.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          console.log('Token:', data.token); // Log the token to the console
          setMessage('You have successfully logged in');
          setUsername('');
          setPassword('');
        } else {
          throw new Error();
        }
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
      <h1 className={styles.heading}>Login</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label className={styles.label}>Username:</label>
          <input
            className={styles.input}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className={styles.label}>Password:</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {message && <p className={styles.message}>{message}</p>}
        <button className={styles.button} type="submit">
          Login
        </button>
      </form>

      <div className={styles.link}>
        Don't have an account? <Link href="/user/register">Register</Link>
      </div>
    </div>
  );
}

export default Login;
