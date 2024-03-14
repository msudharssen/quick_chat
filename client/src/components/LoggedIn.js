import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button';

const LoggedIn = function(props) {

    const location = useLocation();

    return (

        <div className="already-logged-in">

            <div className="logged-in-content">

                <h1>You're already logged in!</h1>

                <div className="logged-in-btns">
                    
                    <Link to="/messages">

                        <Button btnID="blue-btn" label="Go to messages"/>

                    </Link>

                    <Link to="/signup" state={{ previousLocation: location }}>

                        <Button label="Create a new account"/>

                    </Link>

                </div>

            </div>

        </div>

    );
}

export default LoggedIn;