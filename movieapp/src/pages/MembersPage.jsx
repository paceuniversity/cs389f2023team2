import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './memberspage.css'
import Avatar from '../Assets/avatar.jpg';

import { app } from "../FirebaseConfig";

import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function MembersPage() {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const getAuthJSON = async () => {
            // await setDoc(doc(getFirestore(app), "members", "member"), json);
        
            const querySnapshot = await getDocs(collection(getFirestore(app), "authentications"));
            querySnapshot.forEach((doc) => {
                const authJson = doc.data();

                const membersList = [];
                const promises = [];

                for (let i = 0; i < authJson.usernames.length; i++) {
                    const member = authJson.usernames[i];

                    const storage = getStorage();
                    const avatarRef = ref(storage, `avatars/${member.uid}`);
                    
                    promises.push(getDownloadURL(avatarRef).then((url) => {
                        membersList.push(
                            <div className="member-acc-block">
                                <Link to={`/profile/${member.username}`}><img className="member-avatars" src={url}></img></Link>
                                <div className="member-user">
                                    <Link className='username-link' to={`/profile/${member.username}`}><h2>{member.username}</h2></Link>
                                </div>
                            </div>)
                    }).catch((err)=> {}));
                }
                Promise.all(promises).then(() => {
                    setMembers(membersList);
                });
            });
        }
        getAuthJSON();
    }, {});
    
    console.log(members);

    return (
        <div className="member-page-container">
            <div className="member-section">
                <div className="title"><h1>Members</h1></div>
                    <div className="member-acc">
                        <ol>{members}</ol>
                    </div>
                </div>
        </div>
    );
}
export default MembersPage;