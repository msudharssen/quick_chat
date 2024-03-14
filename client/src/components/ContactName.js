import React from 'react';
import { useContactContext } from '../contexts/ContactContext';
import { useSocketContext } from '../contexts/SocketContext';
import Button from './Button';

import axios from 'axios';

const ContactName = function(props) {

    const [contacts, setContacts] = useContactContext();

    const [socket, setSocket] = useSocketContext();

    const sessionUser = JSON.parse(sessionStorage.getItem("user"));

    const handleSubmit = (event) => {

        event.preventDefault();

        const contactID = event.target.innerText.split('\n')[0];

        const accountID = event.target.dataset.id;

        console.log(contactID + ' (' + accountID + ')');

        directMessage(sessionUser.username, contactID, sessionUser.accountID, accountID);

    }

    const directMessage = (user, contactID, selfID, contactNo) => {

        socket.emit("direct_message", user, contactID, selfID, contactNo);
        
    }  

    const handleDelete = (event) => {

        event.stopPropagation();

        const contactID = event.currentTarget.parentNode.innerText.split('\n')[0];

        const contactNo = event.currentTarget.parentNode.dataset.id;

        console.log("contact deleted: " + contactID + " (" + contactNo + ")");

        const updatedContacts = deleteContact(contactNo);

        updatedContacts.then((result) => {

            setContacts(result);

            console.log(result);

        });

    }

    const deleteContact = async (contactNo) => {

        const url = "http://3.130.86.5:3005/deleteContact";

        try {

            const response = await axios.post(url, {

                current_user_id: sessionUser.accountID,
                contact_id: contactNo

            });

            return response.data;

        } catch (error) {

            throw error;

        }

    }

    return (

        <>

            {contacts.map((contact) => {return (<li key={contact.accountID} data-id={contact.accountID} onClick={handleSubmit}>{contact.userID}<Button btnClass="delete-contact" label="Delete" btnClick={handleDelete} /></li>);})}

        </>

    );
}

export default ContactName;