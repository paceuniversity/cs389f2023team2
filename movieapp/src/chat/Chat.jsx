import React, { useContext, useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { AuthContext } from "../context/AuthContext";
import Messages from "./Messages";
import Input from "./Input";

const Chat = () => {
    const [chats, setChats] = useState({});
    const [username, setUsername] = useState('');

    const { authUser } = useContext(AuthContext);

    if (chats !== undefined && chats.chatID === undefined && authUser !== null) {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", authUser.uid), (doc) => {
                setUsername(doc.data().username);
                setChats(doc.data());
            });

            return () => {
                unsub();
            };
        };
        getChats();
    }

    return (
        <div className="chat">
            <div className="chatInfo">
                <span>{username}</span>
            </div>
            <Messages/>
            <Input />
        </div>
    )
}
export default Chat