import React, { useRef, useEffect, useState } from 'react';
import Button from './Button';
import { useSocketContext } from '../contexts/SocketContext';
import { useConnectContext } from '../contexts/ConnectContext';
import { useConversationContext } from '../contexts/ConversationContext';

import axios from 'axios';

const MessageField = function(props) {

    const [activeContact, setActiveContact] = useConnectContext();

    const [[messageList, setMessageList], [conversations, setConversations], getConversations] = useConversationContext();

    const [socket, setSocket] = useSocketContext();

    const [currentMessage, setCurrentMessage] = useState("");

    const lastMessageRef = useRef(null);

    const sessionUser = JSON.parse(sessionStorage.getItem("user"));

    const userID = sessionUser.accountID;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    useEffect(() => {

        (async () => {

            const messages = await loadMessages(userID, activeContact.contactNo);

            const retrievedMessages = messages.map(({ author_id, receiver_id, content, time }) => ({

                author: author_id,
                contactID: receiver_id,
                message: content,
                time: convertDate(time)

            }));

            setMessageList(retrievedMessages);

        })();   

    }, [activeContact]);

    const convertDate = (date) => {

        date = new Date(date);

        const ampm = date.getHours() >= 12 ? 'pm' : 'am';

        const hours = (date.getHours() % 12) === 0 ? 12 : (date.getHours() % 12);

        const minutes = ("0" + date.getMinutes()).slice(-2);

        let time = hours + ":" + minutes + " " + ampm;

        if (date.setHours(0,0,0,0) !== new Date().setHours(0,0,0,0)) {

            const month = months[date.getMonth()];

            const day = ("0" + date.getDate()).slice(-2);

            const year = date.getFullYear();

            if (year !== new Date().getFullYear()) {

                time = month + " " + day + ", " + year + " - " + time;

            } else {

                time = month + " " + day + " - " + time;

            }

        }

        return time;

    }

    // auto-scroll to bottom    
    useEffect(() => {

        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });

    }, [messageList]);


    const loadMessages = async (userID, contactID) => {

        const url = "http://3.130.86.5:3005/loadMessages";

        try {

            const response = await axios.post(url, {

                user_id: userID,
                contact_id: contactID

            });

            return response.data;

        } catch (error) {

            throw error;

        }

    }

    const sendMessage = async () => {

        if (currentMessage !== "") {

            const today = new Date();

            const ampm = today.getHours() >= 12 ? 'pm' : 'am';

            const hours = (today.getHours() % 12) === 0 ? 12 : (today.getHours() % 12);

            const minutes = ("0" + today.getMinutes()).slice(-2);

            let currentTime = hours + ":" + minutes + " " + ampm;

            const messageData = {

                contactID: activeContact.contactNo,
                contactSocket: activeContact.socketID,
                author: userID,
                message: currentMessage,
                time: currentTime,
                timestamp: today.toISOString().slice(0, 19).replace('T', ' ')

            };

            await socket.emit("send_dm", messageData);

            setMessageList((list) => [...list, messageData]);

            setCurrentMessage("");

        }
    }
    

    return (

        <div className="message-field">

            <div className="chat-body">

                {messageList.map((messageContent, index) => {

                    return (

                        <div key={index} className={userID === messageContent.author ? "you" : "other"}>

                            <div className="message-box">

                                <h3>{messageContent.message}</h3>

                            </div>

                            <div className="metadata">

                                <p>{messageContent.time}</p>

                            </div>

                        </div>
                    )
                })}

                <div ref={lastMessageRef} />

            </div>

            <div className="text-field-container">

                <div className="text-field">

                    <input
                        autoFocus
                        autoComplete="off"
                        type="text" 
                        id="chat-input"
                        name="chat-input" 
                        value={currentMessage}
                        placeholder="Send a message"  

                        onChange={(event) => {

                            setCurrentMessage(event.target.value);

                        }}

                        onKeyPress={(event) => {event.key === "Enter" && sendMessage();}}

                    />

                    <div></div>

                    <Button btnID="send-message" btnClick={sendMessage} />

                </div>

            </div>

        </div>

    );
}

export default MessageField;