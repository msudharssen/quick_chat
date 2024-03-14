import React from 'react';
import SidebarForm from './SidebarForm';
import ContactList from './ContactList';

const Sidebar = function(props) {

    return (

        <div className="sidebar-container">
            
            <div className="sidebar">

                <SidebarForm />

                <ContactList />

            </div>

        </div>

    );
}

export default Sidebar;