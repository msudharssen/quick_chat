import React from 'react';
import HeaderTitles from './HeaderTitles';
import Nav from './Nav';

const Header = function(props) {

    return (

        <header className="header">            

            <HeaderTitles />

            <Nav />

        </header>
        
    );
}

export default Header;