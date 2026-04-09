import styles from '../styles/aboutUs.module.css';

function AboutUs() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.content}>
        <h2 className={styles.title}>What is CodeBuddies?</h2>
        <p className={styles.text}>
          CodeBuddies is a community-driven platform that connects aspiring developers with experienced code enthusiasts through live video sessions. Whether you're stuck on a bug, learning a new language, or just want someone to code with, our Buddies are here to help.
        </p>
        <div className={styles.features}>
          <div className={styles.feature}>
            <h3 className={styles.featureTitle}>Live Video Sessions</h3>
            <p className={styles.featureText}>Join scheduled events and get real-time help from experienced developers through live video collaboration.</p>
          </div>
          <div className={styles.feature}>
            <h3 className={styles.featureTitle}>Community Driven</h3>
            <p className={styles.featureText}>Our Buddies are passionate developers who volunteer their time to help others grow and learn.</p>
          </div>
          <div className={styles.feature}>
            <h3 className={styles.featureTitle}>All Skill Levels</h3>
            <p className={styles.featureText}>From your first line of code to advanced topics, there's a Buddy ready to help you at every stage.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
