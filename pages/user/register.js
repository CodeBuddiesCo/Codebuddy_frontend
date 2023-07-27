import React, { useState } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';
import Link from 'next/link';
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
    <div className={styles.container}>
      <div className={`row m-5 no-gutters shadow-lg my-card`}>
        <div className="col-md-6 d-none d-md-block left">
          <img src="/registerdog2.png"
            className="img-fluid"
            style={{ minHeight: "100%", width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div className={`col-md-6 bg-white p-5 right ${styles['form-style']}`}>
          <h3 className="pb-3">Register</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group pb-3">
              <input
                type="text"
                placeholder="Name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group pb-3">
              <input
                type="text"
                placeholder="Email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group pb-3">
              <input
                type="text"
                placeholder="Username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group pb-3">
              <input
                type="password"
                placeholder="Password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="pb-2">
              <button
                type="submit"
                className={`btn btn-dark w-100 font-weight-bold mt-2 ${styles['form-button']}`}
              >
                Submit
              </button>
              <div className="pt-4 text-center">
                Already have an account? <Link href="/user/login">Sign In</Link>
              </div>
            </div>
          </form>
          {message && (
            <Alert variant="danger" className="mt-3">
              {message}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
