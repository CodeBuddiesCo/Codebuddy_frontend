import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/resetPassword.module.css';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setToken(router.query.token || '');
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setMessage('Missing or invalid token.');

    setSubmitting(true);

    const res = await fetch('https://codebuddiesserver.onrender.com/api/users/reset-password-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (res.ok) {
      setMessage(
        `✅ Password reset successful. You can now <a href="/user/login" class="${styles.link}">log in</a>.`
      );
    } else {
      setMessage(data.error || 'Something went wrong.');
    }
  };

  return (
<div className={`${styles.wrapper} ${styles.debug}`}>
      
      <div className={styles.box}>
        <h2 className={styles.title}>Reset Your Password</h2>
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
        {message && (
          <p
            className={styles.message}
            dangerouslySetInnerHTML={{ __html: message }}
          />
        )}
      </div>
    </div>
  );
}
