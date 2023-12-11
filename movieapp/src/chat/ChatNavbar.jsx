
import React from "react";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import { getFirestore, collection, getDocs, setDoc, doc } from "firebase/firestore";
import { auth, app } from '../FirebaseConfig';

const ChatNavbar = () => {
    const {authUser} = useContext(AuthContext)
    const [authJson, setAuthJSON] = useState({});
    const [display, setDisplay] = useState('');

    useEffect(() => {
        const getAuthJSON = async () => {
            // await setDoc(doc(getFirestore(app), "members", "member"), json);
        
            const querySnapshot = await getDocs(collection(getFirestore(app), "authentications"));
            querySnapshot.forEach((doc) => {
                if (doc.data().test === undefined) {
                    setAuthJSON(doc.data());
                }
            });
        }
        getAuthJSON();
    }, {});

    if (authUser !== null && authJson !== null) {
        if (authJson[authUser.email] !== undefined) {
            if (display === '') {
                setDisplay(authJson[authUser.email].username);
            }
        }
    }

    return (
        <div className="chat-navbar">
            <span className="chat-title">Chat</span>
            <div className="user">
                <span>{display}</span>
            </div>
        </div>
    )
}
export default ChatNavbar