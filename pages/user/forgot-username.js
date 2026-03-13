import { useState } from 'react';
import styles from '../../styles/authForms.module.css';

export default function ForgotUsernamePage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('https://codebuddiesserver.onrender.com/api/users/forgot-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message || 'Something went wrong.');
    } catch (err) {
      setMessage('Unable to reach the server. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.simpleFormWrapper}>
      <h2 className={styles.simpleTitle}>Request Username</h2>
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
      {message && <p className={styles.simpleMessage}>{message}</p>}
      <a href="/user/forgot-password" className={styles.simpleLink}>Forgot your password?</a>
    </div>
  );
}
