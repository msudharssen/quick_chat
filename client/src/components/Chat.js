import React from 'react';
import ChatWindow from './ChatWindow';
import { useConnectContext } from '../contexts/ConnectContext';

const Chat = function(props) {

    const [activeContact, setActiveContact] = useConnectContext();

    const sessionUser = JSON.parse(sessionStorage.getItem("user"));

    return (

        <div className="chat-container">
            
            <div className="chat">

                {activeContact === undefined ?

                    <>
                        <h1>Welcome {sessionUser.username}!</h1>
                        <h2>Find a contact to connect with</h2>
                    </> 
                    
                    :

                    <ChatWindow />

                }
            
            </div>

        </div>

    );
}

export default Chat;