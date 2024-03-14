import React, { useEffect, useRef } from 'react';
import Button from './Button';
import { useSocketContext } from '../contexts/SocketContext';
import { useConnectContext } from '../contexts/ConnectContext';
import { useContactContext } from '../contexts/ContactContext';

import axios from 'axios';

const ContactCard = function(props) {

    const activeIndicatorRef = useRef(null);

    const activeDescriptorRef = useRef(null);

    const [activeContact, setActiveContact] = useConnectContext();

    const [contacts, setContacts] = useContactContext();

    const [socket, setSocket] = useSocketContext();

    useEffect(() => {

        (async () => {

            await socket.emit("check_online", activeContact.contactID); 
            
        })();

        socket.on("is_online", (isOnline) => {

            let contactName = isOnline ? isOnline.username : '';

            checkOnline(contactName);

        });

        socket.on("now_active", (contactName, socketID) => {

            if (activeContact && activeContact.contactID === contactName) {

                console.log(`${contactName} has received a new socket ID: ${socketID}`);

                console.log(`${contactName} is now active`);

                checkOnline(contactName);

                setActiveContact(values => ({...values, socketID: socketID}));

            }

        });

        socket.on("now_inactive", (contactName) => {

            if (activeContact && activeContact.contactID === contactName) {
                
                console.log(`${contactName} is now inactive`);

                checkOnline('');

                setActiveContact(values => ({...values, socketID: ''}));

            }

        });

        const checkOnline = (contactName) => {

            if (activeIndicatorRef.current && activeDescriptorRef.current) {

                const activeIndicator = activeIndicatorRef.current;
                const activeDescriptor = activeDescriptorRef.current;

                activeIndicator.className = '';
                activeDescriptor.innerText = '';

                if (contactName === activeContact.contactID) {

                    activeIndicator.classList.add("user-active");
                    activeDescriptor.innerText = "Active Now";

                } else {

                    activeIndicator.classList.add("user-inactive");
                    activeDescriptor.innerText = "Offline";

                }
            }
        }

        return () => {

            socket.removeAllListeners("is_online");
            socket.removeAllListeners("now_active");
            socket.removeAllListeners("now_inactive");

        };

    }, [socket, activeContact, contacts]);

    const handleClick = () => {

        console.log("contact added: " + activeContact.contactID + " (" + activeContact.contactNo + ")");

        const updatedContacts = addToContacts();

        updatedContacts.then((result) => {

            setContacts(result);

            console.log(result);

        });
    }

    const addToContacts = async () => {

        const sessionUser = JSON.parse(sessionStorage.getItem("user"));

        const url = "http://3.130.86.5:3005/addToContacts";

        try {

            const response = await axios.post(url, {

                current_user_id: sessionUser.accountID,
                contact_id: activeContact.contactNo

            });

            return response.data;

        } catch (error) {

            throw error;

        }

    }

    return (

        <div className="contact-card">

            <div className="contact-info">

                <h1>{activeContact.contactID}</h1>

            </div>

            {
                (
                    !(contacts.find((o) => o.userID === activeContact.contactID)) && (
                    
                        <div className="add-to-contacts">

                            <Button btnID="add-contact-btn" btnClick={handleClick} label="Add to Contacts" />

                        </div>
                    
                    )
            
                ) || (

                    <div className="user-activity">

                        <div ref={activeIndicatorRef} />

                        <p ref={activeDescriptorRef} />

                    </div>
                )
            }

        </div>
        
    );
}

export default ContactCard;