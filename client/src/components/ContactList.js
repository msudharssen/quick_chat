import React, { useEffect } from 'react';
import ContactName from './ContactName';
import NoContacts from './NoContacts';
import { useContactContext } from '../contexts/ContactContext';

import axios from 'axios';

const ContactList = function(props) {

    const [contacts, setContacts] = useContactContext();

    useEffect(() => {

        const contactList = connectToDatabase();

        contactList.then((result) => {

            setContacts(result);

        });

    }, []);

    const connectToDatabase = async () => {

        const sessionUser = JSON.parse(sessionStorage.getItem("user"));

        const url = `http://3.130.86.5:3005/contacts/${sessionUser.accountID}`;

        try {

            const response = await axios.get(url);

            return response.data;

        } catch (error) {

            throw error;

        }
    }

    return (

        <div className="contact-list-container">

            <h2>Contacts</h2>

                <div className="contact-list">

                    <div className="contact-list-wrapper">

                        {(contacts.length !== 0 && 

                            <ul>
                                <ContactName />
                            </ul>
                            
                        ) || <NoContacts />}

                    </div>

                </div>

        </div>

    );
}

export default ContactList;