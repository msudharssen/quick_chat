import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button';

const AdText = function(props) {

    const location = useLocation();

    return (

        <div className="adText">

            <h2>Connect instantly with friends all across the world!</h2>

            <Link to="/signup" state={{ previousLocation: location }}>
            
                <Button label="Create an account"/>
            
            </Link>

        </div>

    );
}

export default AdText;