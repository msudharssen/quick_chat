import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '../contexts/SocketContext';

import axios from 'axios';

const Form = function(props) {

    const [credentials, setCredentials] = useState({});

    const navigate = useNavigate();

    const [socket, setSocket] = useSocketContext();

    const sessionUser = JSON.parse(sessionStorage.getItem("user"));
    const authorized = JSON.parse(sessionStorage.getItem("isLoggedIn"));

    const usernameRef = useRef(); //you want to reference an particular html element in the return JSX portion of this. so usernnameRef is a prop, which you set to a ref attribute 
    const passwordRef = useRef();
    const usernameValidationRef = useRef();
    const passwordValidationRef = useRef();

    let username = usernameRef.current;
    let password = passwordRef.current;
    let usernameValidation = usernameValidationRef.current;
    let passwordValidation = passwordValidationRef.current;

    useEffect(() => {

        username = usernameRef.current;
        password = passwordRef.current;
        usernameValidation = usernameValidationRef.current;
        passwordValidation = passwordValidationRef.current;

    }, []);

    useEffect(() => {

        socket.on("login", () => {

            navigate("/messages");

        });

        socket.on("already_logged_in", () => {

            sessionStorage.setItem("isLoggedIn", false);

            sessionStorage.setItem("secondAttempt", true);

            console.log("this user is already logged in!");

            navigate("/loggedIn");

        });

        return () => {

            // socket.removeAllListeners("login");
            socket.removeAllListeners("already_logged_in");

        };

    }, [socket]);

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

        let runPage = 0;

        if (credentials.username === undefined || 
            credentials.username.length === 0 ||
            /(\.)\1/.test(credentials.username) || 
            !credentials.username.match(/^[a-zA-Z_]+([a-zA-Z0-9.])([a-zA-Z0-9._]+)[a-zA-Z0-9_]+$/gm)) {
            
            username.className = '';
            username.classList.add("login-error");
            username.placeholder = 'Invalid Username';

            setCredentials('');

        } else {

            username.classList.remove("login-error");
            username.placeholder = 'Username';

        }
        
        if (credentials.password === undefined || 
            credentials.password.length === 0) {

            password.classList.add("login-error");
            password.placeholder = 'Invalid Password';

            setCredentials({username: credentials.username, password: ''});

        } else {

            password.className = '';
            password.placeholder = 'Password';

        }

        if (credentials.username === undefined || credentials.username.length === 0) {

            setCredentials('');
            usernameValidation.innerText = 'Enter a valid username';

        } else if (credentials.username.length < 4) {

            setCredentials('');
            usernameValidation.innerText = 'Username must be at least 4 characters in length';

        } else if (/\s/.test(credentials.username)) {

            setCredentials('');
            usernameValidation.innerText = 'Username must not contain any spaces';

        } else if (/^[0-9]/.test(credentials.username)) {

            setCredentials('');
            usernameValidation.innerText = 'Username must not begin with a number';

        } else if (/[-’/`~!#*$@%+=,^&(){}[\]|;:”<>?\\]/.test(credentials.username)) {

            setCredentials('');
            usernameValidation.innerText = 'Username must not contain any special characters aside from dots or underscores';

        } else if (/^\./.test(credentials.username) || /\.$/.test(credentials.username)) {

            setCredentials('');
            usernameValidation.innerText = 'Username must not begin or end with a dot';

        } else if (/[.]{2,}/.test(credentials.username)) {

            setCredentials('');
            usernameValidation.innerText = 'Username must not contain multiple consecutive dots';

        } else {

            usernameValidation.innerText = '';

        }
        
        if (credentials.password === undefined || credentials.password.length === 0 ) {

            passwordValidation.innerText = 'Enter a valid password';

        } else {

            passwordValidation.innerText = '';

        }

        if (!(username.classList.contains("login-error")) && !(password.classList.contains("login-error"))) {

            if (props.loggingIn) {

                runPage = '/login';
                
            } else {

                runPage = '/register';

            }

            connectToDatabase(runPage);

        }

    }

    const connectToDatabase = async (runPage) => {

        const url = "http://3.130.86.5:3005" + runPage;

        try {

            const response = await axios.post(url, {

                username: credentials.username.toLowerCase(),
                password: credentials.password

            });

            if (props.loggingIn) {

                login(response);

            } else {

                createAccount(response);

            }

        } catch (error) {

            throw error;

        }
    }

    const login = (response) => {

        console.log(response.data);

        if (response.data.userExists === true) {

            username.className = '';
            username.classList.add("login-valid");
            username.placeholder = 'Username';

            if (response.data.correctPassword === true) {

                password.className = '';
                password.classList.add("login-valid");
                password.placeholder = 'Password';

                sessionStorage.setItem("isLoggedIn", true);
                sessionStorage.setItem("user", JSON.stringify({

                    username: credentials.username.toLowerCase(),
                    accountID: response.data.accountID

                }));

                socket.emit("register_user", credentials.username.toLowerCase());

            } else {
                
                password.classList.add("login-error");
                password.placeholder = 'Incorrect Password';

                setCredentials({username: credentials.username, password: ''});

            }

        } else {

            username.className = '';
            username.classList.add("login-error");
            username.placeholder = 'User Not Found';

            setCredentials('');

        }
    }

    const createAccount = (response) => {

        console.log(response.data);

        if (response.data.success === false) {

            username.className = '';
            username.classList.add("login-error");
            username.placeholder = 'This username is unavailable';

            setCredentials('');

        } else {

            username.className = '';
            username.classList.add("login-valid");
            username.placeholder = 'Username';

            password.className = '';
            password.classList.add("login-valid");
            password.placeholder = 'Password';

            if (authorized) {

                socket.emit("logout", sessionUser.username);

            }

            sessionStorage.setItem("isLoggedIn", true);
            sessionStorage.setItem("user", JSON.stringify({
                
                username: credentials.username.toLowerCase(),
                accountID: response.data.accountID

            }));

            socket.emit("register_user", credentials.username.toLowerCase());

        }

    }

    return (

        <form name="credForm" onSubmit={handleSubmit}>

            <label htmlFor="username"></label>

            <input 
                autoFocus
                type="text" 
                id={props.username}
                name="username" 
                placeholder="Username" 
                value={credentials.username || ""} 
                onChange={handleChange}    
                ref={usernameRef}
            />

            <div>
                <p ref={usernameValidationRef}></p>
            </div>

            <label htmlFor="password"></label>

            <input 
                type="password" 
                id={props.password}
                name="password" 
                autoComplete="on"
                placeholder="Password"
                value={credentials.password || ""}
                onChange={handleChange}
                ref={passwordRef}
            />

            <div>
                <p ref={passwordValidationRef}></p>
            </div>

            <input type="submit" value="Log In" />

        </form>

    );
}

export default Form;