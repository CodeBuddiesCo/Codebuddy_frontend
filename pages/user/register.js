import React, { useState } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';
import Link from 'next/link';
import styles from '../../styles/authForms.module.css';
import { signIn } from 'next-auth/react';

function Register() {
  
  const securityQuestions = [
    "What was your first pet's name?",
    "What was the make of your first car?",
    "What was the name of your elementary school?",
    "What is the name of the town where you were born?",
    "What is your mother's maiden name?",
    "What is the name of the street where you grew up?",
    "What was the make of your first mobile phone?"
  ];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const [passwordError, setPasswordError] = useState('');
  const [securityQuestion1, setSecurityQuestion1] = useState(securityQuestions[0]);
  const [securityQuestion2, setSecurityQuestion2] = useState(securityQuestions[0]);
  const [securityQuestion3, setSecurityQuestion3] = useState(securityQuestions[0]);

  const [securityAnswer1, setSecurityAnswer1] = useState('');
  const [securityAnswer2, setSecurityAnswer2] = useState('');
  const [securityAnswer3, setSecurityAnswer3] = useState('');


  const handlePasswordBlur = () => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleOAuthRegister = async (provider) => {
    try {
      const result = await signIn(provider, { callbackUrl: '/user/register' });
      if (!result.error) {
        // Handle successful registration
        // router.push('/user/profile');
        console.log(result);

      } else {
        // Handle registration error
        console.error(result.error);
      }
    } catch (error) {
      // Handle unexpected errors
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://codebuddiesserver.onrender.com/api/users/register', { // Correct the URL if needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          username,
          password,
          security_question_1: securityQuestion1,
          security_answer_1: securityAnswer1,
          security_question_2: securityQuestion2,
          security_answer_2: securityAnswer2,
          security_question_3: securityQuestion3,
          security_answer_3: securityAnswer3
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
          setMessage('Registration failed: unexpected response from server');
        }
      } else if (response.status === 409) {
        setMessage('Username or Email already exists');
      } else {
        const errorText = await response.text();
        setMessage(`Registration failed: ${errorText}`);
        console.error('Error:', errorText);
      }
    } catch (error) {
      setMessage('Registration failed: unexpected error');
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
                onBlur={handlePasswordBlur}
                required
              />
            </div>
            {passwordError && <div className="text-danger">{passwordError}</div>}

            {/* Security Question 1 */}
            <div className="form-group pb-3">
              <select
                className="form-control"
                value={securityQuestion1}
                onChange={(e) => setSecurityQuestion1(e.target.value)}
                required
              >
                {securityQuestions.map((question, index) => (
                  <option key={index} value={question}>{question}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Security Answer 1"
                className="form-control"
                value={securityAnswer1}
                onChange={(e) => setSecurityAnswer1(e.target.value)}
                required
              />
            </div>

            {/* Security Question 2 */}
            <div className="form-group pb-3">
              <select
                className="form-control"
                value={securityQuestion2}
                onChange={(e) => setSecurityQuestion2(e.target.value)}
                required
              >
                {securityQuestions.map((question, index) => (
                  <option key={index} value={question}>{question}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Security Answer 2"
                className="form-control"
                value={securityAnswer2}
                onChange={(e) => setSecurityAnswer2(e.target.value)}
                required
              />
            </div>

            {/* Security Question 3 */}
            <div className="form-group pb-3">
              <select
                className="form-control"
                value={securityQuestion3}
                onChange={(e) => setSecurityQuestion3(e.target.value)}
                required
              >
                {securityQuestions.map((question, index) => (
                  <option key={index} value={question}>{question}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Security Answer 3"
                className="form-control"
                value={securityAnswer3}
                onChange={(e) => setSecurityAnswer3(e.target.value)}
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
              <div className={styles.sideline}>OR</div>
              <div>
                <button
                  onClick={() => handleOAuthRegister('google')}
                  className={`btn btn-dark w-100 font-weight-bold mt-2 ${styles['email-form-button']}`}
                >
                  Register With Google
                </button>
              </div>
            </div>
          </form>
          <div className="pt-4 text-center">
            Already have an account? <Link href="/user/login">Sign In</Link>
          </div>
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