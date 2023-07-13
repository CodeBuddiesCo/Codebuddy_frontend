import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/authForms.module.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://codebuddiesserver.onrender.com/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          setMessage('You have successfully registered');
          setName('');
          setEmail('');
          setUsername('');
          setPassword('');
          router.push('/user/login');
        } else {
          throw new Error();
        }
      } else {
        if (response.status === 409) {
          setMessage('Username or Email already exists');
        } else {
          throw new Error();
        }
      }
    } catch (error) {
      setMessage('Registration failed');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1 className={styles.heading}>Register</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label className={styles.label}>Name:</label>
          <input
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className={styles.label}>Email:</label>
          <input
            className={styles.input}
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
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
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
