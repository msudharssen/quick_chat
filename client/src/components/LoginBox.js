import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Form from './Form';
import Button from './Button';

const LoginBox = function(props) {

    const location = useLocation();

    return (

        <div className="login">

            <Form loggingIn={true} username={"loginUsername"} password={"loginPassword"} />

            <div id="formBottom">

                <div id="spacer">
                    <div id="line">
                    </div>            
                </div>
                
                <Link to="/signup" state={{ previousLocation: location }}>

                    <Button label="Create a new account"/>

                </Link>

            </div>

        </div>

    );
}

export default LoginBox;