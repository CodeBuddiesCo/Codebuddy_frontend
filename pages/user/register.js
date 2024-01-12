import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../styles/authForms.module.css';
import { signIn } from 'next-auth/react';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const securityQuestions = [
    "Select a security question",
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
  const [filteredQuestions1, setFilteredQuestions1] = useState(securityQuestions);
  const [filteredQuestions2, setFilteredQuestions2] = useState(securityQuestions);
  const [filteredQuestions3, setFilteredQuestions3] = useState(securityQuestions);

  useEffect(() => {
    setFilteredQuestions1(securityQuestions.filter(q => q === securityQuestions[0] || (q !== securityQuestion2 && q !== securityQuestion3)));
    setFilteredQuestions2(securityQuestions.filter(q => q === securityQuestions[0] || (q !== securityQuestion1 && q !== securityQuestion3)));
    setFilteredQuestions3(securityQuestions.filter(q => q === securityQuestions[0] || (q !== securityQuestion1 && q !== securityQuestion2)));
  }, [securityQuestion1, securityQuestion2, securityQuestion3]);

  
  const handlePasswordBlur = () => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  // const handleOAuthRegister = async (provider) => {
  //   try {
  //     const result = await signIn(provider, { callbackUrl: '/user/register' });
  //     if (!result.error) {
  //       console.log(result);
  //     } else {
  //       console.error(result.error);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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

  const isQuestionSelected = (question) => {
    return question !== securityQuestions[0];
  };

  const getFilteredQuestions = (currentQuestion, otherQuestion1, otherQuestion2) => {
    return securityQuestions.filter(question => {
      return question !== otherQuestion1 && question !== otherQuestion2;
    });
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
                <inputv
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
                    {filteredQuestions1.map((question, index) => (
                      <option key={index} value={question}>{question}</option>
                    ))}
                  </select>
                  {isQuestionSelected(securityQuestion1) && (
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
                    {filteredQuestions2.map((question, index) => (
                      <option key={index} value={question}>{question}</option>
                    ))}
                  </select>
                  {isQuestionSelected(securityQuestion2) && (
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
                    {filteredQuestions3.map((question, index) => (
                      <option key={index} value={question}>{question}</option>
                    ))}
                  </select>
                  {isQuestionSelected(securityQuestion3) && (
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
                <button className={styles.registerSubmitButton} type="submit">Register</button>
              </div>

              <p className={styles.alreadyHaveAccountText}>
                Already have an account? <Link href="/user/login" className={styles.SignInLink}>Sign In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;