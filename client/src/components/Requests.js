import React, { useState, forwardRef } from 'react';
import ActiveConversation from './ActiveConversation';
import { CSSTransition } from 'react-transition-group';
import { useDropdownContext } from '../contexts/DropdownContext';

const Requests = forwardRef(function(props, ref) {

    const [activeMenu, setActiveMenu] = useState('main');

    const [menuHeight, setMenuHeight] = useState(null);

    const closeMenu = useDropdownContext();

    const calculateHeight = (element) => {

        const height = parseFloat(getComputedStyle(element).height);

        const style = getComputedStyle(element.parentElement);

        const newHeight = height + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTop) + parseFloat(style.borderBottom);

        setMenuHeight(newHeight);

    }

    return (

        <div ref={ref} className='dropdown-menu' style={{ height: menuHeight }}>

            <CSSTransition in={activeMenu === 'main'} unmountOnExit timeout={300} classNames="menu-primary" onEnter={calculateHeight}>

                <div className='menu'>

                    <ActiveConversation setActiveMenu={setActiveMenu} goToMenu='received'>Received</ActiveConversation>
                    <ActiveConversation setActiveMenu={setActiveMenu} goToMenu='sent'>Sent</ActiveConversation>

                </div>

            </CSSTransition>

            <CSSTransition in={activeMenu === 'received'} unmountOnExit timeout={300} classNames="menu-secondary" onEnter={calculateHeight}>

                <div className='menu'>

                    <ActiveConversation closeMenu={undefined} setActiveMenu={setActiveMenu} goToMenu='main'>Return</ActiveConversation>
                    <ActiveConversation closeMenu={closeMenu}>Request 1</ActiveConversation>
                    <ActiveConversation closeMenu={closeMenu}>Request 1</ActiveConversation>
                    <ActiveConversation closeMenu={closeMenu}>Request 1</ActiveConversation>
                    <ActiveConversation closeMenu={closeMenu}>Request 1</ActiveConversation>
                    <ActiveConversation closeMenu={closeMenu}>Request 1</ActiveConversation>
                    <ActiveConversation closeMenu={closeMenu}>Request 1</ActiveConversation>
                    <ActiveConversation closeMenu={closeMenu}>Request 1</ActiveConversation>
                    <ActiveConversation closeMenu={closeMenu}>Request 1</ActiveConversation>

                </div>

            </CSSTransition>

            <CSSTransition in={activeMenu === 'sent'} unmountOnExit timeout={300} classNames="menu-secondary" onEnter={calculateHeight}>

                <div className='menu'>

                    <ActiveConversation closeMenu={undefined} setActiveMenu={setActiveMenu} goToMenu='main'>Return</ActiveConversation>
                    <ActiveConversation closeMenu={closeMenu}>Sent 1</ActiveConversation>
                    <ActiveConversation closeMenu={closeMenu}>Sent 1</ActiveConversation>
                    <ActiveConversation closeMenu={closeMenu}>Sent 1</ActiveConversation>
                    <ActiveConversation closeMenu={closeMenu}>Sent 1</ActiveConversation>
                    <ActiveConversation closeMenu={closeMenu}>Sent 1</ActiveConversation>
                    <ActiveConversation closeMenu={closeMenu}>Sent 1</ActiveConversation>
                    <ActiveConversation closeMenu={closeMenu}>Sent 1</ActiveConversation>
                    <ActiveConversation closeMenu={closeMenu}>Sent 1</ActiveConversation>

                </div>

            </CSSTransition>

        </div>

    );
});

export default Requests;