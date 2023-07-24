import React, { useState } from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    <div className={styles.container}>
      <div className="row m-5 no-gutters shadow-lg">
        <div className="col-md-6 d-none d-md-block">
          <img src="/logindog2.png"
            className="img-fluid"
            style={{ minHeight: "100%", width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div className={`col-md-6 bg-white p-5 ${styles['form-style']}`}>
          <h3 className="pb-3">Sign In</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group pb-3">
              <input
                type="text"
                placeholder="Username"
                className="form-control"
                id="exampleInputUsername1"
                aria-describedby="usernameHelp"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group pb-3">
              <input
                type="password"
                placeholder="Password"
                className="form-control"
                id="exampleInputPassword1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center"><input name="" type="checkbox" value="" /><span className="pl-2 font-weight-bold">Remember Me</span></div>
              <div><a href="#">Forgot Password?</a></div>
            </div>
            <div className="pb-2">
              <button
                type="submit"
                className={`btn btn-dark w-100 font-weight-bold mt-2 ${styles['form-button']}`}
              >
                Submit
              </button>
            </div>
          </form>
          <div className={styles.sideline}>OR</div>
          <div>
            <button
              type="submit"
              className={`btn btn-dark w-100 font-weight-bold mt-2 ${styles['email-form-button']}`}
            >
              Login With Email
            </button>
          </div>
          <div className="pt-4 text-center">
            Don't have an account? <Link href="/user/register">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
