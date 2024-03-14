import React, { forwardRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDropdownContext } from '../contexts/DropdownContext';
import { useSocketContext } from '../contexts/SocketContext';

const Account = forwardRef(function(props, ref) {

    const navigate = useNavigate();

    const location = useLocation();

    const closeMenu = useDropdownContext();

    const [socket, setSocket] = useSocketContext();

    const sessionUser = JSON.parse(sessionStorage.getItem("user"));

    const handleLogOut = () => {

        if (sessionStorage.getItem("isLoggedIn")) {

            socket.emit("logout", sessionUser.username);

            sessionStorage.setItem("isLoggedIn", false);

            sessionStorage.setItem("user", null);
            
            console.log("isLoggedIn: " + sessionStorage.getItem("isLoggedIn"));
            console.log(sessionStorage.getItem("user"));

        }

        closeMenu();

        navigate("/");

    }

    return (

        <div ref={ref} className="dropdown-menu">

            <ul>

                <li className="dropdown-account"><Link to={"/changePassword"} className="dropdown-account-item" onClick={closeMenu} state={ { previousLocation: location } }>Change Your Password</Link></li>

                <li className="dropdown-account"><Link to={"/"} className="dropdown-account-item" onClick={handleLogOut}>Log Out</Link></li>

            </ul>

        </div>

    );
});

export default Account;