import { useState, useEffect } from "react";
import styles from './styles/Welcome.module.css';

export default function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      const user = JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY));
      if (user) {
        setUserName(user.username);
      }
    };
    fetchUserName();
  }, []);

  return (
    <div className={styles.container}>
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to start messaging.</h3>
    </div>
  );
}
