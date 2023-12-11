import React, { useContext, useState, useEffect } from "react";
import { collection, getDocs, getDoc, setDoc, updateDoc, doc, query, where } from "firebase/firestore";
import { db,app } from "../FirebaseConfig";
import { getFirestore } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Search = () => {
    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    const [err, setErr] = useState(false)
    const {authUser} = useContext(AuthContext)
    const [chatID, setChatID] = useState('');
    const [avatarURL, setAvatarURL] = useState('');

    const handleSearch = async () => {
        setName("");
        try {
            const querySnapshot = await getDocs(collection(getFirestore(app), "users"));
            querySnapshot.forEach((doc) => {
                // console.log(doc.data().username);
                if (doc.data().username !== undefined && doc.data().username === username && doc.id !== authUser.uid) {
                    const storage = getStorage();
                    const avatarRef = ref(storage, `avatars/${doc.id}`);

                    getDownloadURL(avatarRef)
                        .then((url) => {
                            setAvatarURL(url);
                        }).catch((err)=> {
                            console.log(err)
                    });

                    setErr(false);
                    setName(doc.data().username);

                    if (authUser.uid < doc.id) {
                        setChatID(authUser.uid + doc.id);
                    } else {
                        setChatID(doc.id + authUser.uid);
                    }
                } else if (doc.id === authUser.uid && doc.data().username === username) {
                    throw new Error();
                }
                // setUser(doc.data())
            });
        } catch (err) {
            setErr(true);
        }
    };

    const handleKey = (e)=>{
        e.code==="Enter" && handleSearch();
    }

    const handleSelect = async () => {
        try {
            const chat = await getDoc(doc(db, "messages", chatID));
        
            if (!chat.exists()) {
                await setDoc(doc(db, "messages", chatID), { messages: [] });

                await updateDoc(doc(db, "userChats", authUser.uid), {
                    other: [],
                    username: username,
                    chatID: chatID,
                });
            } else {
                const random = Math.floor(Math.random() * 1000);
                await updateDoc(doc(db, "userChats", authUser.uid), {
                    other: [random],
                    username: username,
                    chatID: chatID,
                });
            }
        } catch (exc) { }
        // const res = await getDocs(db, "chats",)
    }

    return (
        <div className="search">
            <div className="searchForm">
                <input type="text" 
                placeholder="Find a user" 
                onKeyDown={handleKey} 
                onChange={e=>setUsername(e.target.value)}/>
            </div>
            {err && <span>User not found!</span>}
            {name &&<div className="userChat" onClick={handleSelect}>
                {/* onClick={handleSelect} */}
                <img src={avatarURL} alt="" />
                <div className="userChatInfo">
                    <span>{name}</span>
                </div>
            </div>}
        </div>
    )
}
export default Search