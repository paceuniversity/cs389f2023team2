import React, { useContext, useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { AuthContext } from "../context/AuthContext";
import Message from './Message'

const Messages = () => {
    const [chats, setChats] = useState({});
    const [messages, setMessages] = useState([]);
    const [started, setStarted] = useState(false);

    const { authUser } = useContext(AuthContext);

    if (chats !== undefined && chats.chatID === undefined && authUser !== null) {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", authUser.uid), (doc) => {
                setStarted(false);
                setChats(doc.data());
            });

            return () => {
                unsub();
            };
        };
        getChats();
    }

    if (chats !== undefined && chats.chatID !== undefined && !started) {
        try {
            const getMessages = () => {
                const unsub = onSnapshot(doc(db, "messages", chats.chatID), (doc) => {
                    if (doc !== undefined && doc.data() !== undefined) {
                        setMessages(doc.data().messages);
                    }
                });

                return () => {
                    unsub();
                };
            };
            getMessages();
            setStarted(true);
        } catch (exc) { }
    }
    
    return (
        <div className="messages">
            {messages.map((message) => {
                return <Message message={message} key={message.time} />
            })}
        </div>
    )
}

export default Messages