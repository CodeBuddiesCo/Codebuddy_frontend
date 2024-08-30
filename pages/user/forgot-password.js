import React from 'react';
import ForgotPasswordForm from '../../components/ForgotPasswordForm';
import styles from '../../styles/authForms.module.css';
import Header from '../../components/Header';

const ForgotPasswordPage = () => {
  return (
    <div className={styles.loginPage}>
      <Header />
      <div className={styles.loginMainContentContainer}>
        <img
          className={styles.loginFormImageContainer}
          src="/logindog2.png"
          alt="Login Image"
        />
        <div className={styles.loginFormContainer}>
          <div className={styles.loginFormHeaderContainer}>
            <h1 className={styles.loginFormHeader}>Forgot Password</h1>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
