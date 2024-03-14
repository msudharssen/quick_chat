import React, { useState, useRef } from 'react';
import { useSocketContext } from '../contexts/SocketContext';

import axios from 'axios';

const SidebarForm = function(props) {

    const [socket, setSocket] = useSocketContext();

    const [contactName, setContactName] = useState();

    const contactNameRef = useRef(null);

    const sessionUser = JSON.parse(sessionStorage.getItem("user"));
    
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setContactName(values => ({...values, [name]: value}));
    }

    const handleSubmit = (event) => {

        event.preventDefault();

        const contactID = event.target.elements[0].value;

        validateUser(contactID);

    }

    const validateUser = (contactID) => {

        const isValidUser = connectToDatabase(contactID);

        isValidUser.then((result) => {

            let findUser = contactNameRef.current;

            findUser.className = '';
            findUser.value = '';

            if (contactID === sessionUser.username || !result.userExists) {

                findUser.classList.add("login-error");
                findUser.placeholder = 'Invalid Username';

                setTimeout(() => {

                    findUser.className = '';
                    findUser.value = '';

                }, 300);

            } else {
    
                findUser.placeholder = 'Find Username';
                directMessage(sessionUser.username, contactID, result.accountID);
    
            } 
        });

    }

    const connectToDatabase = async (contactID) => {

        const url = "http://3.130.86.5:3005/login";

        try {

            const response = await axios.post(url, {

                username: contactID,
                password: ""

            });

            return response.data;

        } catch (error) {

            throw error;

        }
    }

    const directMessage = (user, contactID, accountID) => {

        socket.emit("direct_message", user, contactID, sessionUser.accountID, accountID);

    }

    return (

        <form name="connectTo" onSubmit={handleSubmit}>

            <label htmlFor="connectUser"></label>

            <input 
                autoFocus
                type="text" 
                id="connectUser"
                name="connectUser" 
                placeholder="Find Username" 
                onChange={handleChange}
                ref={contactNameRef}
            />

            {/* 
            
            <label htmlFor="connectRoom"></label>

            <input 
                type="text" 
                id="connectRoom"
                name="connectRoom" 
                disabled
            />

            */}

            <input type="submit" value="Connect" />

        </form>

    );
}

export default SidebarForm;