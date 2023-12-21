import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';
import styles from '../../styles/authForms.module.css';
import { useSession, signIn, signOut } from 'next-auth/react';

function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [isUsernameLogin, setIsUsernameLogin] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (localStorage.getItem('loginMethod') === 'username') {
      setIsUsernameLogin(true);
    }
  }, []);

  const handleUsernamePasswordLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://codebuddiesserver.onrender.com/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response Status:', response.status);
      const result = await response.json();
      console.log('Response Body:', result);

      if (result.token) {
        console.log("Token received, redirecting to profile...");
        localStorage.setItem('token', result.token);
        localStorage.setItem('loginMethod', 'username');
        localStorage.setItem('username', result.user.name);
        localStorage.setItem('isAdmin', result.user.isAdmin ? 'true' : 'false'); // Store the admin status
        localStorage.setItem('isBuddy', result.user.is_buddy ? 'true' : 'false'); // Store the buddy status
        localStorage.setItem('userId', result.user.id);

        router.push('/user/profile');
      } else {
        console.log("No token received, showing error...");
        setMessage('Invalid username or password');
        setShowAlert(true);
      }
    } catch (error) {
      setMessage('Invalid username or password');
      setShowAlert(true);
      console.error('Exception:', error)
    }
  };

  const handleGoogleLogin = () => {
    signIn('google');
  };

  if ((session && session.user) || isUsernameLogin) {
    return (
      <div>
        <p>Welcome, {session?.user?.name || localStorage.getItem('username') || 'Guest'}</p>
        <button onClick={() => { signOut(); localStorage.removeItem('loginMethod'); setIsUsernameLogin(false); }}>Sign out</button>
      </div>
    );
  } else {

    return (
      <div className="add-event-page">
          <div className="add-event-main-content-container">
          <img className="add-event-form-image-container" src="/logindog2.png" alt="Login Image"
                style={{ width: '52%', objectFit: 'cover', backgroundSize: 'contain', overflow: 'hidden' }}>
            </img>
            <div className="add-event-form-container">
              
            <div className="add-event-form-header-container">
                <h1 className="add-event-form-header2">Sign In</h1>
              </div>
            {showAlert && <Alert variant="danger">{message}</Alert>}
            <form onSubmit={handleUsernamePasswordLogin}>
            <div className="add-event-select-border">
                  <input
                    className="add-event-select"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="add-event-select-border">
                  <input
                    className="add-event-select"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <input name="" type="checkbox" value="" />
                  <span className="pl-2 font-weight-bold">Remember Me</span>
                </div>
                <div>
                <Link href="/user/forgot-password">Forgot Password?</Link>
                </div>
              </div>
              <div className="add-event-form-button-container">
                  <button className="add-event-form-button-login" type="submit">Submit</button>
                </div>
            </form>
            {/* <div className={styles.sideline}>OR</div>
            <div>
              <button onClick={handleGoogleLogin} className={`btn btn-dark w-100 font-weight-bold mt-2 ${styles['email-form-button']}`}>
                Login With Google
              </button>
            </div> */}
            <div className="pt-4 text-center">
              Don't have an account? <Link href="/user/register">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;

