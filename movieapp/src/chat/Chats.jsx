import React, { useContext, useState, useEffect } from "react";
import { db, app } from "../FirebaseConfig";
import { AuthContext } from "../context/AuthContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { getFirestore, collection, getDocs, setDoc, doc, onSnapshot } from "firebase/firestore";

const Chats = () => {
    const [chats, setChats] = useState([]);
    const [json, setJSON] = useState({});
    const [authJSON, setAuthJSON] = useState({});
    const [displayFriends, setDisplayFriends] = useState([]);
    const [started, setStarted] = useState(false);

    const { authUser } = useContext(AuthContext);

    if (chats !== undefined && chats.length === 0 && authUser !== null) {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", authUser.uid), (doc) => {
                setChats(doc.data());
            });

            return () => {
                unsub();
            };
        };
        getChats();
    }

    useEffect(() => {
        const getJSON = async () => {
            // await setDoc(doc(getFirestore(app), "members", "member"), json);
        
            const querySnapshot = await getDocs(collection(getFirestore(app), "members"));
            querySnapshot.forEach((doc) => {
                if (doc.data().test === undefined) {
                    setJSON(doc.data());
                }
            });
        }
        getJSON();
    }, {});

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

    if (authUser !== null && authJSON !== null && json !== null && !started) {
        if (authJSON[authUser.email] !== undefined) {
            if (json[authJSON[authUser.email].username] !== undefined) {
                const chatFriends = [];
                const friends = json[authJSON[authUser.email].username].friends;

                for (let i = 0; i < friends.length; i++) {
                    if (friends[i] !== undefined) {
                        if (friends[i] !== '') {
                            
                            const addToChatSidebar = async () => {
                                for (let j = 0; j < authJSON.usernames.length; j++) {
                                    if (authJSON.usernames[j].username === friends[i]) {
                                        const storage = getStorage();
                                        const avatarRef = ref(storage, `avatars/${authJSON.usernames[j].uid}`);

                                        await getDownloadURL(avatarRef)
                                            .then((url) => {
                                                chatFriends.push(
                                                    <div className="userChat">
                                                        <img src={url}
                                                        alt="" 
                                                        />
                                                        <div className="userChatInfo">
                                                            <span>{friends[i]}</span>
                                                        </div>
                                                    </div>);
                                            }).catch((err)=> {
                                                console.log(err)
                                            });
                                    }
                                }
                            }
                            const update = async () => {
                                await addToChatSidebar();
                                setDisplayFriends(chatFriends);
                                setStarted(true);
                            }
                            update();
                        }
                    }
                }
            }
        }
    }

    return (
        <div className="chats">
            <ol>{displayFriends}</ol>
        </div>
    )
}
export default Chats