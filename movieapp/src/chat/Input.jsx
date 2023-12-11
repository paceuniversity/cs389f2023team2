import React, { useContext, useState, useEffect } from "react";
import { setDoc, getFirestore, doc, onSnapshot } from "firebase/firestore";
import { db, app } from "../FirebaseConfig";
import { AuthContext } from "../context/AuthContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Input = () => {
    const [chats, setChats] = useState({});
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [started, setStarted] = useState(false);
    const [avatarURL, setAvatarURL] = useState('');

    const { authUser } = useContext(AuthContext);

    if (authUser !== null) {
        const storage = getStorage();
        const avatarRef = ref(storage, `avatars/${authUser.uid}`);
        getDownloadURL(avatarRef)
            .then((url) => {
                setAvatarURL(url);
            }).catch((err) => {
                console.log(err)
            });
    }

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
        const getMessages = () => {
            const unsub = onSnapshot(doc(db, "messages", chats.chatID), (doc) => {
                setMessages(doc.data().messages);
            });

            return () => {
                unsub();
            };
        };
        getMessages();
        setStarted(true);
    }

    const handleSend = (i) => {
        messages.push({message: i, senderId: authUser.uid, time: new Date().toLocaleString(), avatar: avatarURL});
        const set = async () => {
            await setDoc(doc(getFirestore(app), "messages", chats.chatID), {messages: messages});
        }
        set();
    }

    const handleKey = (e) => {
        e.code === "Enter" && handleSend(input);
    }

    return (
        <div className="input">
            <input type="text" placeholder="Type something..." onKeyDown={handleKey} onChange={(e) => setInput(e.target.value)}/>
            <div className="send">
                <img src="" alt="" />
                <button onClick={() => {
                    handleSend(input);
                }}>Send</button>
            </div>
        </div>
    )
}
export default Input