import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';
import styles from '../../styles/authForms.module.css';
import { useSession, signIn, signOut } from 'next-auth/react';
import Header from '../../components/Header';

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
      <div className={styles.loginPage}>
        <Header />
        <div className={styles.loginMainContentContainer}>
          <img
            className={styles.loginFormImageContainer}
            src="/logindog2.png"
            alt="Login Image"
          />
          <div className={styles.loginFormContainer}>
            <div className={styles.loginFormHeaderContainer}>
              <h1 className={styles.loginFormHeader}>Sign In</h1>
            </div>
            {showAlert && <Alert variant="danger">{message}</Alert>}
            <div className={styles.loginFormInputContainer} form onSubmit={handleUsernamePasswordLogin}>
              <div className={styles.loginSelectBorder}>
                <input
                  className={styles.loginSelect}
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className={styles.loginSelectBorder}>
                <input
                  className={styles.loginSelect}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.loginRememberMeContainer}>
                <input name="rememberMe" type="checkbox" className={styles.loginCheckbox} />
                <label htmlFor="rememberMe" className={styles.loginRememberMeLabel}>Remember Me</label>
                <Link href="/user/forgot-password" className={styles.forgotPasswordLink}>Forgot Password?</Link>
              </div>
              <div className={styles.loginSubmitButtonContainer}>
              <button className={styles.loginSubmitButton} onClick={handleUsernamePasswordLogin}>Submit</button>
              </div>
              <p className={styles.dontHaveAccountText}>Don't have an account? <Link href="/user/register" className={styles.signUpLink}>Sign Up</Link></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;

