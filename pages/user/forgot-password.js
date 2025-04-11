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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('https://codebuddiesserver.onrender.com/api/users/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(res.ok ? 'Reset link sent if email exists.' : data.error || 'Error sending reset email');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Request Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
