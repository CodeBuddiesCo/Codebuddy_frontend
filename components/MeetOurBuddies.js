import React, { useEffect, useState } from "react";
import Link from "next/link"; // Import Next.js Link
import styles from "../styles/meetOurBuddies.module.css"; // Ensure correct CSS file import

const MeetOurBuddies = () => {
    const [buddies, setBuddies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBuddies = async () => {
            try {
                const response = await fetch(
                    "https://codebuddiesserver.onrender.com/api/users/buddies"
                );
                const data = await response.json();
                if (response.ok && Array.isArray(data)) {
                    setBuddies(data);
                } else {
                    setError("No buddies found.");
                }
            } catch (err) {
                setError("Failed to fetch buddies.");
                console.error(err);
            }
        };
        fetchBuddies();
    }, []);

    if (error) return <p className={styles.errorText}>Error: {error}</p>;

    return (
        <div className={styles.meetBuddiesContainer}>
            <h1 className={styles.meetBuddiesTitle}>Meet Our Buddies</h1>
            <div className={styles.meetBuddiesGrid}>
                {buddies.map((buddy) => (
                    <div key={buddy.id} className={styles.profileWrapper}>
                        <Link href={`user/profile/${buddy.id}`} passHref>
                            <img
                                src={buddy.pfp_url || "/Gemini_Generated_Image_8tpel98tpel98tpe.jpeg"}
                                alt={buddy.username}
                                className={styles.profilePicture}
                            />
                        </Link>
                        <div className={styles.profileName}>{buddy.name}</div>
                        <div className={styles.profileTitle}>{buddy.title}</div>
                        {buddy.is_buddy && (
                            <div className={styles.profileStatus}>Host Buddy</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MeetOurBuddies;
