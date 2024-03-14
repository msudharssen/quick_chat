import React from 'react';
import Header from '../components/Header';
import AdText from '../components/AdText';
import LoginBox from '../components/LoginBox';
import LoggedIn from '../components/LoggedIn';
import NavContext from '../contexts/NavContext';


//First page when you open up the site
const Login = function(props) {

    const nowLoggedIn = (sessionStorage.getItem("isLoggedIn") === "true");  //look at session storage again, and see if they are logged in

    let linkTo = nowLoggedIn ? [  //use that to see what links to render into the nav bar. 
 //If they are logged in, render the following two:
        {
            dest: '#',
            label: 'My Account'
        }

    ] : [ 
//If they are not logged in, render the following 4, this is basically the label for the top right of the page. 
        {
            dest: '/',
            label: 'Log In'
        }, {
            dest: '/signup',
            label: 'Create Account'
        }
        
    ];


    //passed to nav context provider, the linkTo values, which is another context
    return (

        <div className="pageContent">

            <NavContext.Provider value={linkTo}>
                <Header />
            </NavContext.Provider>

            {
                (!nowLoggedIn && 

                    <div className="content">
                        
                        <AdText />

                        <LoginBox />

                    </div>

                ) || <LoggedIn />
            }

        </div>

    );
}

export default Login;