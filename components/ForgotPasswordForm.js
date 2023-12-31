import React, { useState } from 'react';
import Link from 'next/link';

function ForgotPasswordForm() {
  const [username, setUsername] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleFetchQuestions = async () => {
    if (username) {
      try {
        const response = await fetch(`https://codebuddiesserver.onrender.com/api/users/security-questions/${username}`);
        const data = await response.json();
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          setQuestions([data.security_question_1, data.security_question_2, data.security_question_3]);
          setAnswers(new Array(3).fill(''));
        } else {
          setMessage('Unable to fetch security questions');
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Error fetching security questions');
      }
    } else {
      setMessage('Please enter a username');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const verificationResponse = await fetch('https://codebuddiesserver.onrender.com/api/users/verify-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, answer1: answers[0], answer2: answers[1], answer3: answers[2] }),
      });
  
      const verificationResult = await verificationResponse.json();
      if (verificationResult.verified) {
        const resetResponse = await fetch('https://codebuddiesserver.onrender.com/api/users/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, newPassword, answer1: answers[0], answer2: answers[1], answer3: answers[2] }),
        });
  
        if (resetResponse.ok) {
          setMessage('Password reset successfully. ');
          setResetSuccess(true);
        } else {
          setMessage('Error resetting password');
        }
      } else {
        setMessage('Security answers do not match');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error processing request');
    }
  };  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="button" onClick={handleFetchQuestions}>Fetch Security Questions</button>
        {questions.map((question, index) => (
          <div key={index}>
            <label>{question}</label>
            <input
              type="text"
              value={answers[index]}
              onChange={(e) => {
                const newAnswers = [...answers];
                newAnswers[index] = e.target.value;
                setAnswers(newAnswers);
              }}
            />
          </div>
        ))}
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && (
        <p>
          {message}
          {resetSuccess && (
            <span>
              You can now <Link href="/user/login">Login</Link>.
            </span>
          )}
        </p>
      )}
    </div>
  );
}

export default ForgotPasswordForm;