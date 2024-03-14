import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SavedMessages from './SavedMessages';
// import Requests from './Requests';
import Account from './Account';
import { useNotificationContext } from '../contexts/NotificationContext';
import DropdownContext from '../contexts/DropdownContext';

const NavLink = function(props) {

    const location = useLocation();

    const [open, setOpen] = useState(false);

    const linkRef = useRef(null);
    const menuRef = useRef(null);

    let [notifications, setNotifications] = useNotificationContext();

    useEffect(() => {

        document.addEventListener('mousedown', handleClickOutside);

        return () => {

            document.removeEventListener('mousedown', handleClickOutside);

        };

    }, []);

    const closeMenu = () => {

        setOpen(false);

    }

    const handleClickOutside = (event) => {

        if (menuRef.current && !menuRef.current.contains(event.target) && event.target !== linkRef.current) {

            setOpen(false);

        }

    }

    notifications = notifications === 0 ? '' : notifications;

    if (props.label === 'Create Account') {

        return (

            <li key={props.index}><Link to={props.destination} state={ { previousLocation: location } }>{props.label}</Link></li>

        );

    } else if (props.label === 'Messages') {

        return (
        
            <DropdownContext.Provider value={closeMenu}>

                <li key={props.index}>
                    
                    <Link to={props.destination} onClick={() => {setOpen(!open)}} ref={linkRef}>
                    
                        {<div className="message-header">
                            
                            <p className="message-title">{props.label}</p>
                            
                            {
                                (notifications &&
                                
                                    <div className="notifications-circle">
                                        <p className="notifications">{notifications}</p>
                                    </div>

                                ) || (

                                    <div className="notifications-no-circle">
                                        <p className="notifications">{notifications}</p>
                                    </div>

                                )
                            }

                        </div>}
                    
                    </Link>
                    
                    {open && <SavedMessages ref={menuRef} />}
                    
                </li>

            </DropdownContext.Provider>

        );

    // } else if (props.label === 'Requests') {

    //     return (

    //         <DropdownContext.Provider value={closeMenu}>
    //             <li key={props.index}><Link to={props.destination} onClick={() => {setOpen(!open)}} ref={linkRef}>{props.label}</Link>{open && <Requests ref={menuRef} />}</li>
    //         </DropdownContext.Provider>

    //     );

    } else if (props.label === 'My Account') {

        return (

            <DropdownContext.Provider value={closeMenu}>

                <li key={props.index}>
                    
                    <Link to={props.destination} onClick={() => {setOpen(!open)}} ref={linkRef}>
                    
                        {props.label}
                    
                    </Link>
                    
                    {open && <Account ref={menuRef} />}
                    
                </li>

            </DropdownContext.Provider>

        );

    } else {

        return (

            <li key={props.index}><Link to={props.destination}>{props.label}</Link></li>
    
        );
    }
}

export default NavLink;