import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import Button from './Button';

import axios from 'axios';

const ModalChangePassword = function(props) {

    const isFirstMountRef = useRef(false);

    const { state } = useLocation();

    const [changeSuccessful, setChangeSuccessful] = useState(false);

    const sessionUser = JSON.parse(sessionStorage.getItem("user"));

    const [credentials, setCredentials] = useState({});

    const modalRef = useRef();

    const currentPasswordRef = useRef();
    const currentPasswordValidationRef = useRef();

    const newPasswordRef = useRef();
    const newPasswordValidationRef = useRef();

    let currentPassword = currentPasswordRef.current;
    let currentPasswordValidation = currentPasswordValidationRef.current;

    let newPassword = newPasswordRef.current;
    let newPasswordValidation = newPasswordValidationRef.current;

    const navigate = useNavigate();

    useEffect(() => {

        currentPassword = currentPasswordRef.current;
        currentPasswordValidation = currentPasswordValidationRef.current;

        newPassword = newPasswordRef.current;
        newPasswordValidation = newPasswordValidationRef.current;

        const observerRefValue = modalRef.current;

        disableBodyScroll(observerRefValue);

        return () => {

            if (observerRefValue) {

                enableBodyScroll(observerRefValue);

            }

        };

    }, []);

    useEffect(() => {

        const listenForEnterKey = (event) => {

            if (event.key === 'Enter') {

                navigate(state.previousLocation.pathname);

            }

        }

        if (isFirstMountRef.current) {

            document.addEventListener("keydown", listenForEnterKey);

        } else {

            isFirstMountRef.current = true;

        }

        return () => {

            document.removeEventListener("keydown", listenForEnterKey);

        };

    }, [changeSuccessful]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setCredentials(values => ({...values, [name]: value}));
    }

    const handleSubmit = (event) => {

        event.preventDefault();

        validateForm();
        
    }

    const validateForm = () => {
        
        if (credentials.currentPassword === undefined || 
            credentials.currentPassword.length === 0) {

            currentPassword.className = '';
            currentPassword.classList.add("login-error");
            currentPassword.placeholder = 'Invalid Password';

            setCredentials({currentPassword: '', newPassword: ''});

            currentPasswordValidation.innerText = 'Enter a valid password';

        } else {

            currentPassword.className = '';
            currentPassword.placeholder = 'Current Password';

            currentPasswordValidation.innerText = '';

        }

        if (credentials.newPassword === undefined || 
            credentials.newPassword.length === 0) {

            newPassword.className = '';
            newPassword.classList.add("login-error");
            newPassword.placeholder = 'Invalid Password';

            setCredentials({currentPassword: credentials.currentPassword, newPassword: ''});

            newPasswordValidation.innerText = 'Enter a valid password';

        } else {

            newPassword.className = '';
            newPassword.placeholder = 'New Password';

            newPasswordValidation.innerText = '';

        }

        if (!(currentPassword.classList.contains("login-error")) && !(newPassword.classList.contains("login-error"))) {

            connectToDatabase();

        }

    }

    const connectToDatabase = async () => {

        const url = "http://3.130.86.5:3005/login";

        try {

            const response = await axios.post(url, {

                username: sessionUser.username,
                password: credentials.currentPassword

            });
            
            verifyUser(response);

        } catch (error) {

            throw error;

        }
    }

    const verifyUser = (response) => {

        console.log(response.data);

        if (response.data.correctPassword === true) {

            currentPassword.className = '';
            currentPassword.classList.add("login-valid");
            currentPassword.placeholder = 'Current Password';

            if (credentials.newPassword !== credentials.currentPassword) {

                newPassword.className = '';
                newPassword.classList.add("login-valid");
                newPassword.placeholder = 'New Password';

                const success = changePassword(response.data.accountID);

                setChangeSuccessful(success);

            } else {

                newPassword.classList.add("login-error");
                newPassword.placeholder = 'Invalid Password';

                setCredentials({currentPassword: credentials.currentPassword, newPassword: ''});

                newPasswordValidation.innerText = 'Your new password cannot be the same as your current password';

            }

        } else {
            
            currentPassword.classList.add("login-error");
            currentPassword.placeholder = 'Incorrect Password';

            setCredentials({currentPassword: '', newPassword: ''});

        }
        
    }

    const changePassword = async (userID) => {

        const url = "http://3.130.86.5:3005/changePassword";

        try {

            const response = await axios.post(url, {

                user_id: userID,
                new_password: credentials.newPassword

            });

            return response.data;

        } catch (error) {

            throw error;

        }
    }
      
    return (

        <div
            ref={ modalRef }
            className="modal"
            onClick={() => navigate(state.previousLocation.pathname)}
        >

            <div
                className="modal-content"
                onClick={event => event.stopPropagation()}
            >

                {
                    (!changeSuccessful && 

                        <>

                            <div className="topRow">

                                <div>
                                    <h3>Change Your Password</h3>
                                    <p>Enter your current password and a new password</p>
                                </div>

                                <div className="close-circle" onClick={() => navigate(state.previousLocation.pathname)}>
                                    <span className="close">&times;</span>
                                </div>

                            </div>

                            <form name="newPasswordForm" onSubmit={handleSubmit}>

                                <label htmlFor="currentPassword"></label>

                                <input 
                                    autoFocus
                                    type="password" 
                                    name="currentPassword" 
                                    autoComplete="on"
                                    placeholder="Current Password"
                                    value={credentials.currentPassword || ""}
                                    onChange={handleChange}
                                    ref={currentPasswordRef}
                                />

                                <div>
                                    <p ref={currentPasswordValidationRef}></p>
                                </div>

                                <label htmlFor="newPassword"></label>

                                <input 
                                    type="password" 
                                    name="newPassword" 
                                    autoComplete="on"
                                    placeholder="New Password"
                                    value={credentials.newPassword || ""}
                                    onChange={handleChange}
                                    ref={newPasswordRef}
                                />

                                <div>
                                    <p ref={newPasswordValidationRef}></p>
                                </div>

                                <input type="submit" value="Change Password" />

                            </form>

                        </>

                    ) || (

                        <>

                            <div className="topRow">

                                <div />

                                <div className="close-circle" onClick={() => navigate(state.previousLocation.pathname)}>
                                    <span className="close">&times;</span>
                                </div>

                            </div>

                            <h3 id="password-changed">Your password has been changed!</h3>

                            <Link to={state.previousLocation.pathname}>

                                <Button btnID="blue-btn" label="Done" />

                            </Link>

                        </>

                    )
                }

            </div>

        </div>

    );
}

export default ModalChangePassword;