import React from 'react'
import './chatpage.scss'
import Sidebar from '../chat/Sidebar'
import Chat from '../chat/Chat'


const ChatPage = () => {
    return (
        <div className='chatpage'>
            <div className="chat-container">
                <Sidebar/>
                <Chat/>
            </div>
        </div>
    )
}

export default ChatPage