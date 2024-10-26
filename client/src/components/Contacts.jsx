/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import Logo from "../assets/logo.svg";
import styles from './styles/Contacts.module.css';

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY)
    );
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && (
        <div className={styles.container}>
          <div className={styles.brand}>
            <img src={Logo} alt="logo" />
            <h3>Chat App</h3>
          </div>
          <div className={styles.contacts}>
            {contacts.map((contact, index) => (
              <div
                key={contact._id}
                className={`${styles.contact} ${index === currentSelected ? styles.selected : ""}`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className={styles.avatar}>
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt=""
                  />
                </div>
                <div className={styles.username}>
                  <h3>{contact.username}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.currentUser}>
            <div className={styles.avatar}>
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className={styles.username}>
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
