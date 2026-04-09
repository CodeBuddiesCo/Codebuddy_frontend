import { useState } from 'react';
import styles from '../../styles/authForms.module.css';

export default function ForgotUsernamePage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      const res = await fetch('https://codebuddiesserver.onrender.com/api/users/forgot-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('If an account exists for that email, your username has been sent. Check your inbox and spam folder.');
        setSubmitted(true);
      } else {
        setIsError(true);
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setIsError(true);
      setMessage('Unable to reach the server. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.simpleFormWrapper}>
      <h2 className={styles.simpleTitle}>Request Username</h2>
      {!submitted ? (
        <form onSubmit={handleSubmit} className={styles.simpleForm}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.simpleInput}
          />
          <button type="submit" className={styles.simpleButton} disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Username'}
          </button>
        </form>
      ) : (
        <p className={styles.simpleMessage}>{message}</p>
      )}
      {!submitted && isError && message && <p className={styles.simpleMessage}>{message}</p>}
      <a href="/user/forgot-password" className={styles.simpleLink}>Forgot your password?</a>
      <a href="/user/login" className={styles.simpleLink}>Back to Login</a>
    </div>
  );
}
