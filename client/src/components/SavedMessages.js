import React, { forwardRef, useEffect } from 'react';
import ActiveConversation from './ActiveConversation';
import NoActiveConversations from './NoActiveConversations';
import { useDropdownContext } from '../contexts/DropdownContext';
import { useSocketContext } from '../contexts/SocketContext';
import { useNotificationContext } from '../contexts/NotificationContext';
import { useConversationContext } from '../contexts/ConversationContext';

const SavedMessages = forwardRef(function(props, ref) {

    const closeMenu = useDropdownContext();

    const [notifications, setNotifications] = useNotificationContext();

    const [[messageList, setMessageList], [conversations, setConversations], getConversations] = useConversationContext();

    const [socket, setSocket] = useSocketContext();

    const sessionUser = JSON.parse(sessionStorage.getItem("user"));

    let count = 0;

    useEffect(() => {

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

    }, [messageList]);

    const handleClick = (event) => {

        const friendName = event.currentTarget.dataset.friend;

        const friendID = event.currentTarget.dataset.friendid;
        
        socket.emit("direct_message", sessionUser.username, friendName, sessionUser.accountID, friendID);

        closeMenu();

    }

    let conversationObjects = conversations.map((conversation) => {

        const unreadLower = Number(conversation.unreadLower);
        const unreadHigher = Number(conversation.unreadHigher);
                        
        const friendID = sessionUser.accountID === Number(conversation.authorID) ? Number(conversation.receiverID) : Number(conversation.authorID);
        const friend = sessionUser.accountID === Number(conversation.authorID) ? conversation.receiver : conversation.author;

        let unread = sessionUser.accountID < friendID ? unreadLower : unreadHigher;
        unread = unread === 0 ? '' : unread;

        return {

            friend: friend,
            friendID: friendID,
            timestamp: conversation.lastTimestamp,
            message: conversation.lastMessage,
            unread: unread

        }

    });

    const removeDuplicates = (array) => {
        
        let arr1 = [];
        let arr2 = [];

        array.forEach((conversation) => {

            if (!arr1.includes(conversation.friend)) {

                arr1.push(conversation.friend);
                arr2.push(conversation);

            }

        });

        return arr2;

    }

    conversationObjects = removeDuplicates(conversationObjects);

    return (

        <div ref={ref} className="dropdown-menu">

            {(conversationObjects.length !== 0 && 

                <ul>

                    {conversationObjects.map((conversation, index) => {

                        return <li key={index} className="dropdown-item" data-friendid={conversation.friendID} data-friend={conversation.friend} onClick={handleClick}><ActiveConversation conversation={conversation} friend={conversation.friend} unread={conversation.unread} /></li>

                    })}

                </ul>

            ) || <NoActiveConversations />} 

        </div>

    );
});

export default SavedMessages;