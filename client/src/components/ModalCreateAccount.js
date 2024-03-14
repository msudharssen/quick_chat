import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import Form from './Form';

const ModalCreateAccount = function(props) {

    const { state } = useLocation();

    const modalRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {

        const observerRefValue = modalRef.current;

        disableBodyScroll(observerRefValue);

        return () => {

            if (observerRefValue) {

                enableBodyScroll(observerRefValue);

            }
        };

    }, []);

    return (

        <div
            ref={ modalRef }
            className="modal"
            onClick={() => navigate(state.previousLocation.pathname)}
        >

            <div
                className="modal-content"
                onClick={event => event.stopPropagation()}
            >

                <div className="topRow">

                    <div>
                        <h3>Sign Up</h3>
                        <p>Create a new account</p>
                    </div>

                    <div className="close-circle" onClick={() => navigate(state.previousLocation.pathname)}>
                        <span className="close">&times;</span>
                    </div>

                </div>

                <Form loggingIn={false} username={"createUsername"} password={"createPassword"} />

            </div>

        </div>
        
    );
}

export default ModalCreateAccount;