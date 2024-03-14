import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import ConversationContext from '../contexts/ConversationContext';
import NavContext from '../contexts/NavContext';
import ConnectContext from '../contexts/ConnectContext';
import ContactContext from '../contexts/ContactContext';
import { useSocketContext } from '../contexts/SocketContext';
import { useNotificationContext } from '../contexts/NotificationContext';

import axios from 'axios';

const Messages = function(props) {

    const [activeContact, setActiveContact] = useState();

    const [messageList, setMessageList] = useState([]);

    const [conversations, setConversations] = useState([]);
    
    const contactList = useState([]);

    const [socket, setSocket] = useSocketContext();

    const [notifications, setNotifications] = useNotificationContext();

    const linkTo = [ 

        {
            dest: '#',
            label: 'Messages'
        }, {
        //     dest: '#',
        //     label: 'Requests'
        // }, {
            dest: '#',
            label: 'My Account'
        }
        
    ];
    
    const sessionUser = JSON.parse(sessionStorage.getItem("user"));

    let count = 0;

    useEffect(() => {

        console.log(activeContact); //click a new name, console logs it

        (async () => { //this func activates on omount and when all 3 variables are changed. It updates the messages box on the top right corner. 

            const retrievedConversations = await getConversations(sessionUser.accountID);

            console.log(retrievedConversations);

            count = 0;

            retrievedConversations.forEach((conversation) => {

                const unreadLower = Number(conversation.unreadLower);
                const unreadHigher = Number(conversation.unreadHigher);

                const friendID = sessionUser.accountID === Number(conversation.authorID) ? Number(conversation.receiverID) : Number(conversation.authorID);

                let unread = sessionUser.accountID < friendID ? unreadLower : unreadHigher;

                count += unread;

            });
        
            setNotifications(count);

            setConversations(retrievedConversations);
            
        })();

        socket.on("request_accepted", (contactID, contactSocketID, contactUsername) => {

            console.log("your request to chat with " + contactUsername + " (" + contactID + ") {" + contactSocketID + "} has been accepted");

            setActiveContact({

                contactID: contactUsername,
                contactNo: contactID,
                socketID: contactSocketID,

            });
    
        });

        socket.on("send_offline_message", (contactID, contactNo) => {

            setActiveContact({

                contactID: contactID,
                contactNo: contactNo,
                socketID: '',

            });

        });

        socket.on("receive_dm", (data) => {

            console.log("recevied dm: ");
            console.log(data);

            // display message only if from activeContact

            // if activeContact, set unread = 0, otherwise if not activeContact leave unread set = 1

            // notify online user: received new message!

            if (activeContact && data.author === activeContact.contactNo) {                

                setRead(sessionUser.accountID, activeContact.contactNo);

                setMessageList((list) => [...list, data]);

            } // if you have an active contact, and the author of that message is equal to the activeContact.contact number, then this will trigger

            (async () => {

                const retrievedConversations = await getConversations(sessionUser.accountID);
    
                console.log(retrievedConversations);

                count = 0;

                retrievedConversations.forEach((conversation) => {

                    const unreadLower = Number(conversation.unreadLower);
                    const unreadHigher = Number(conversation.unreadHigher);
    
                    const friendID = sessionUser.accountID === Number(conversation.authorID) ? Number(conversation.receiverID) : Number(conversation.authorID);
    
                    let unread = sessionUser.accountID < friendID ? unreadLower : unreadHigher;
    
                    count += unread;
    
                });
            
                setNotifications(count);
    
                setConversations(retrievedConversations);
    
            })();

        });

        return () => {

            socket.removeAllListeners("request_accepted");
            socket.removeAllListeners("send_offline_message");
            socket.removeAllListeners("receive_dm");

        };

    }, [socket, activeContact, messageList]);

    const getConversations = async (userID) => {

        const url = `http://3.130.86.5:3005/conversations/${userID}`;

        try {

            const response = await axios.get(url);

            return response.data;

        } catch (error) {

            throw error;

        }

    }

    const setRead = async (userID, contactID) => {

        const url = "http://3.130.86.5:3005/setRead";

        try {

            await axios.post(url, {

                user_id: userID,
                contact_id: contactID

            });

        } catch (error) {

            throw error;

        }

    }

    return (

        <div className="pageContent">

            <ConversationContext.Provider value={[[messageList, setMessageList], [conversations, setConversations], getConversations]}>
                <NavContext.Provider value={linkTo}>
                    <Header />
                </NavContext.Provider>

                <ConnectContext.Provider value={[activeContact, setActiveContact]}>
                    <ContactContext.Provider value={contactList}>
                        <div className="messaging-client">

                            <Sidebar />

                            <Chat />

                        </div>
                    </ContactContext.Provider>
                </ConnectContext.Provider>
            </ConversationContext.Provider>

        </div>

    );
}

export default Messages;