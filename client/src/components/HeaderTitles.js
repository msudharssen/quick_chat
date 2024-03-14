import React from 'react';
import logo from '../images/Artboard1@4x.svg';
import { Link } from 'react-router-dom';

const HeaderTitles = function(props) {

    return (

        <div className="logo">
            <Link to="/"><img src={logo} alt="Logo"/></Link>
            <Link to="/"><h1 className="title">QuickChat</h1></Link>
        </div>
        
    );
}

export default HeaderTitles;