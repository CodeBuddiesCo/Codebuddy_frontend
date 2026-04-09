import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/resetPassword.module.css';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setToken(router.query.token || '');
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setMessage('Missing or invalid token.');

    setSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('https://codebuddiesserver.onrender.com/api/users/reset-password-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setResetSuccess(true);
        setMessage('Password reset successful!');
      } else {
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setMessage('Unable to reach the server. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
<div className={`${styles.wrapper} ${styles.debug}`}>
      
      <div className={styles.box}>
        <h2 className={styles.title}>Reset Your Password</h2>
        {!resetSuccess ? (
          <>
            <p className={styles.subtitle}>Please enter a new password below.</p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="password"
                placeholder="New password"
                className={styles.input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="submit" className={styles.button} disabled={submitting}>
                {submitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
          </>
        ) : (
          <>
            <p className={styles.message}>{message}</p>
            <a href="/user/login" className={styles.link}>Go to Login</a>
          </>
        )}
      </div>
    </div>
  );
}
