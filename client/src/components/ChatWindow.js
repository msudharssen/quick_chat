import React from 'react';
import ContactCard from './ContactCard';
import MessageField from './MessageField';

const ChatWindow = function(props) {

    return (

        <div className="chat-window">

            <ContactCard />

            <MessageField />

        </div>

    );
}

export default ChatWindow;