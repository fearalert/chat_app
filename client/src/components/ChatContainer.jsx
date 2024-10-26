/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../api/apiRoutes";
import styles from './styles/ChatContainer.module.css';

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY));
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    };

    if (currentChat) fetchMessages();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCALHOST_KEY));
    
    if (msg && msg.trim().length > 0) {
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: data._id,
        msg,
      });
  
      await axios.post(sendMessageRoute, {
        from: data._id,
        to: currentChat._id,
        message: msg,
      });
  
      setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
    }
  };
  

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  });

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.container}>
      <div className={styles.chatHeader}>
        <div className={styles.userDetails}>
          <div className={styles.avatar}>
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className={styles.username}>
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className={styles.chatMessages}>
        {messages.map((message) => (
          <div ref={scrollRef} key={uuidv4()}>
            <div className={`${styles.message} ${message.fromSelf ? styles.sended : styles.recieved}`}>
              <div className={styles.content}>
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
}
