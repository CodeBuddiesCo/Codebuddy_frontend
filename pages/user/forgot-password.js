// import React from 'react';
// import ForgotPasswordForm from '../../components/ForgotPasswordForm';
// import styles from '../../styles/authForms.module.css';
// import Header from '../../components/Header';

// const ForgotPasswordPage = () => {
//   return (
//     <div className={styles.loginPage}>
//       <Header />
//       <div className={styles.loginMainContentContainer}>
//         <img
//           className={styles.loginFormImageContainer}
//           src="/logindog2.png"
//           alt="Login Image"
//         />
//         <div className={styles.loginFormContainer}>
//           <div className={styles.loginFormHeaderContainer}>
//             <h1 className={styles.loginFormHeader}>Forgot Password</h1>
//           </div>
//           <ForgotPasswordForm />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordPage;

import { useState } from 'react';
import styles from '../../styles/authForms.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('https://codebuddiesserver.onrender.com/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(res.ok ? 'If an account exists for that email, a reset link has been sent.' : data.error || 'Error sending reset email.');
    } catch (err) {
      setMessage('Unable to reach the server. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.simpleFormWrapper}>
      <h2 className={styles.simpleTitle}>Request Password Reset</h2>
      <form onSubmit={handleSubmit} className={styles.simpleForm}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.simpleInput}
        />
        <button type="submit" className={styles.simpleButton}
         disabled={submitting}>
          {submitting ? 'Sending...' : 'Send Reset Link'}

        </button>

      </form>
      {message && <p className={styles.simpleMessage}>{message}</p>}
      <a href="/user/forgot-username" className={styles.simpleLink}>Forgot your username?</a>
    </div>
  );
}
