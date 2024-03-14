import React from 'react';
import { useNavContext } from '../contexts/NavContext';

import NavLink from './NavLink';

const Nav = function(props) {

    const links = useNavContext();

    return (

        <nav>
            <ul>

                {links.map((link, index) => {
                    
                    return <NavLink key={index} destination={link.dest} label={link.label} />
                    
                })}

            </ul>
        </nav>


    );
}

export default Nav;