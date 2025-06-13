import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

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
      setMessage('✅ Password reset successful. You can now <a href="/user/login" style="color: #0070f3;">log in</a>.');
    } else {
      setMessage(data.error || 'Something went wrong.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 400, margin: 'auto' }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {message && <p dangerouslySetInnerHTML={{ __html: message }} />}
    </div>
  );
}
