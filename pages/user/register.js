import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../styles/authForms.module.css';
import { signIn } from 'next-auth/react';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  const [securityQuestion1, setSecurityQuestion1] = useState('');
  const [securityQuestion2, setSecurityQuestion2] = useState('');
  const [securityQuestion3, setSecurityQuestion3] = useState('');
  const [securityAnswer1, setSecurityAnswer1] = useState('');
  const [securityAnswer2, setSecurityAnswer2] = useState('');
  const [securityAnswer3, setSecurityAnswer3] = useState('');
  const [filteredQuestions1, setFilteredQuestions1] = useState([]);
  const [filteredQuestions2, setFilteredQuestions2] = useState([]);
  const [filteredQuestions3, setFilteredQuestions3] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const filterQuestions = (selectedQuestions) => {
      return securityQuestions.filter(q => !selectedQuestions.includes(q));
    };

    const selectedQuestions = [securityQuestion1, securityQuestion2, securityQuestion3].filter(Boolean);

    setFilteredQuestions1(filterQuestions([securityQuestion2, securityQuestion3]));
    setFilteredQuestions2(filterQuestions([securityQuestion1, securityQuestion3]));
    setFilteredQuestions3(filterQuestions([securityQuestion1, securityQuestion2]));
  }, [securityQuestion1, securityQuestion2, securityQuestion3]);

  const handlePasswordBlur = () => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <Header />
      <div className={styles.registerMainContentContainer}>
        <img
          className={styles.registerFormImageContainer}
          src="/registerdog2.png"
          alt="Register Image"
        />
        <div className={styles.registerFormContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.registerFormHeaderContainer}>
              <h1 className={styles.registerFormHeader}>Register</h1>
            </div>
            {message && <div className={styles.registerAlert}>{message}</div>}

            <div className={styles.registerFormInputContainer}>
              <div className={styles.registerSelectBorder}>
                <input
                  className={styles.registerSelect}
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.registerSelectBorder}>
                <input
                  className={styles.registerSelect}
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.registerSelectBorder}>
                <input
                  className={styles.registerSelect}
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className={styles.registerSelectBorder}>
                <input
                  className={styles.registerSelect}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handlePasswordBlur}
                  required
                />
              </div>
              {passwordError && (
                <div className="alert alert-danger" role="alert">
                  {passwordError}
                </div>
              )}

              {/* Security Question 1 */}
              <div className={styles.registerFormInputContainer}>
                <div className={styles.securityQuestionContainer}>
                  <select
                    className={styles.registerSelect}
                    value={securityQuestion1}
                    onChange={(e) => setSecurityQuestion1(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select a security question</option>
                    {filteredQuestions1.map((question, index) => (
                      <option key={index} value={question}>{question}</option>
                    ))}
                  </select>
                  {securityQuestion1 && (
                    <input
                      type="text"
                      placeholder="Security Answer 1"
                      className={styles.registerSelect}
                      value={securityAnswer1}
                      onChange={(e) => setSecurityAnswer1(e.target.value)}
                      required
                    />
                  )}
                </div>
              </div>

              {/* Security Question 2 */}
              <div className={styles.registerFormInputContainer}>
                <div className={styles.securityQuestionContainer}>
                  <select
                    className={styles.registerSelect}
                    value={securityQuestion2}
                    onChange={(e) => setSecurityQuestion2(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select a security question</option>
                    {filteredQuestions2.map((question, index) => (
                      <option key={index} value={question}>{question}</option>
                    ))}
                  </select>
                  {securityQuestion2 && (
                    <input
                      type="text"
                      placeholder="Security Answer 2"
                      className={styles.registerSelect}
                      value={securityAnswer2}
                      onChange={(e) => setSecurityAnswer2(e.target.value)}
                      required
                    />
                  )}
                </div>
              </div>

              {/* Security Question 3 */}
              <div className={styles.registerFormInputContainer}>
                <div className={styles.securityQuestionContainer}>
                  <select
                    className={styles.registerSelect}
                    value={securityQuestion3}
                    onChange={(e) => setSecurityQuestion3(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select a security question</option>
                    {filteredQuestions3.map((question, index) => (
                      <option key={index} value={question}>{question}</option>
                    ))}
                  </select>
                  {securityQuestion3 && (
                    <input
                      type="text"
                      placeholder="Security Answer 3"
                      className={styles.registerSelect}
                      value={securityAnswer3}
                      onChange={(e) => setSecurityAnswer3(e.target.value)}
                      required
                    />
                  )}
                </div>
              </div>
              <div className={styles.registerSubmitButtonContainer}>
                <button className={styles.registerSubmitButton} type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Registering...' : 'Register'}
                </button>
              </div>

              <p className={styles.alreadyHaveAccountText}>
                Already have an account? <Link href="/user/login">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
