import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerTopBorder}></div> {/* Shorter border above */}
      <div className={styles.footerContent}>
        <div className={styles.logoWrapper}>
          <Image src="/CB_Logo.png" alt="CodeBuddies Logo" width={150} height={50} />
        </div>
        <div className={styles.footerInfo}>
          <p>© {new Date().getFullYear()} CodeBuddies. Colorado | New York</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
