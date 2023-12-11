import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Message = ({ message }) => {
    const { authUser } = useContext(AuthContext);

    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
        <div
            ref={ref}
            className={`message ${message.senderId === (authUser === null ? "" : authUser.uid) ? "owner" : ""}`}
            >
            <div className="messageInfo">
                <img
                src={message.avatar}
                alt=""
                />
                <span>{message.time}</span>
            </div>
            <div className="messageContent">
                <p>{message.message}</p>
            </div>
        </div>
    );
};

export default Message;