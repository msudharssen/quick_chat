import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Header from '../components/Header';
import NavContext from '../contexts/NavContext';
import { useSocketContext } from '../contexts/SocketContext'; //import from context



const NewSession = function(props) {

    const [socket, setSocket] = useSocketContext(); //extracting values from socketContext, specifically the socket value, it is not the same as the socket like 
    //the socket client

    const navigate = useNavigate(); //comes with react-router, navigate f(x)

    const sessionUser = JSON.parse(sessionStorage.getItem("user")); //initially this is null, but once user signs in, it will have user's username and accid

    useEffect(() => {

        socket.on("logout_confirmed", (userData) => { //this socket.on refers to what you are passing in during the App component. It will listen 
            //the following events

            sessionStorage.setItem("isLoggedIn", true);
            sessionStorage.setItem("user", userData);
    
            socket.emit("register_user", sessionUser.username);

        });

        socket.on("login", () => {

            navigate("/messages");

        });

        return () => {

            socket.removeAllListeners("logout_confirmed");
            socket.removeAllListeners("login");

        }; 

    }, [socket, sessionUser]); //dependent on socket object or session user

    const handleClick = () => {

        socket.emit("log_out_everywhere", sessionUser.username);

    } //this f(x), username is passed with this specific event, if user trying to login in another tab, while already logged in

    sessionStorage.setItem("secondAttempt", false); //set the second attempt to false intially so that once they logged in, they cant log out

    return (

        <>

            <NavContext.Provider value={[]}>
                <Header />
            </NavContext.Provider>

            <div className="already-logged-in">

                <div className="logged-in-content">

                    <h1>You're already logged in!</h1>

                    <div className="logged-in-btns">

                        <Button btnID="blue-btn" label="Log Out Everywhere and Log In Here" btnClick={handleClick} />
                        
                        <Link to="/">

                            <Button btnID="red-btn" label="Cancel" />

                        </Link>

                    </div>

                </div>

            </div>

        </>

    );
}

export default NewSession;