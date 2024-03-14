import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './css/styles.css';
import Login from './pages/Login';
import Messages from './pages/Messages';
import NewSession from './pages/NewSession';
import ModalCreateAccount from './components/ModalCreateAccount';
import ModalChangePassword from './components/ModalChangePassword';
import SocketContext from './contexts/SocketContext';
import NotificationContext from './contexts/NotificationContext';

import io from "socket.io-client";

const mainSocket = io.connect("http://3.130.86.5:3005");

function App() {

	/*
modal - i.e pop up, when you click create account, a dialogue opens up , 
draws on hooks, integrated witihin react-router dom. so use Location is a react router dom Hook.
Location has varible - state, state has variable has previousLocation. so the previous location is in the background, then you have the pop up.
	*/

	const location = useLocation(); 
	const previousLocation = location.state?.previousLocation;

	const navigate = useNavigate();

	const [socket, setSocket] = useState(mainSocket); //You Know it

	const [notifications, setNotifications] = useState(0); //Random number, default 0, amount of notificatons, any user might have., set at applevel

	const sessionUser = JSON.parse(sessionStorage.getItem("user")); //Nothing to start off 

	useEffect(() => {

		const isLoggedIn = sessionStorage.getItem("isLoggedIn");

		console.log("session " + isLoggedIn);

	}, []);// Loads once on load, once the componenet mounts, runs everything inside, and then not

	useEffect(() => {

		window.addEventListener("load", () => {

            if (sessionUser && JSON.parse(sessionStorage.getItem("isRefresh"))) {

                socket.emit("register_user", sessionUser.username);

                sessionStorage.setItem("isRefresh", false);

            }

        }); //window addevent listener - when the app component loads, the event listner activates, then the if condition, very fisttime, when it fir
		//initially no user, then the point of it is refreshing. This is for refresh

		window.addEventListener("beforeunload", () => {sessionStorage.setItem("isRefresh", true);}); //This is also part of refreshing

		socket.on("log_out_all", (socketID) => {

			console.log("log out here");

			if (sessionStorage.getItem("isLoggedIn")) {

				socket.emit("logout", sessionUser.username);

				socket.emit("confirm_logout", sessionStorage.getItem("user"), socketID);

				sessionStorage.setItem("isLoggedIn", false);

				sessionStorage.setItem("user", null);

				navigate("/");

				console.log("isLoggedIn: " + sessionStorage.getItem("isLoggedIn"));
				console.log(sessionStorage.getItem("user"));

			}

		}); //This is for when you are trying to login to the same user account on the same tab or other tabs.

		socket.on("send_req_info", (requestFrom) => {

            const {username, accountID, socketID} = requestFrom;

            console.log("you have a request from " + username + " (" + accountID + "): " + socketID);

            socket.emit("send_res_info", sessionUser.accountID, socketID, sessionUser.username);

        }); //Thats for messaging -> send_res_info, you will get a socketid from someone who is trying to msg you, then you will share your socketId with them

		return () => {  //

			window.removeEventListener("load", () => { if (sessionUser && JSON.parse(sessionStorage.getItem("isRefresh"))) { socket.emit("register_user", sessionUser.username); sessionStorage.setItem("isRefresh", false); }});
			window.removeEventListener("beforeunload", () => {sessionStorage.setItem("isRefresh", true);});
			socket.removeAllListeners("log_out_all");
			socket.removeAllListeners("send_req_info");

		};

	}, [socket, sessionUser]); //ANY changes to session user, i.e the user logs out? the use effect triggers again, or if the socket changes

	const nowLoggedIn = (sessionStorage.getItem("isLoggedIn") === "true"); // checks session storage, if the variable is logged in is true, then nowLoggedIn will be true

	const alreadyLoggedIn = (sessionStorage.getItem("secondAttempt") === "true"); //logging in on different tabl, trigger to open that window, where it
	//gives you option to log out everywhere.

	return (
		//socketContext provider, every component that you enclose within this provider, will have access to the value which you specified value/
		// so socket context provider sends a value, i.e a prop, of an array with two variables, socket and setSocket

		<>

			<SocketContext.Provider value={[socket, setSocket]}> 

				<NotificationContext.Provider value={[notifications, setNotifications]}>

					<Routes location={previousLocation || location}>

						<Route path="/" exact element={<Login />} />

						<Route path="/messages" exact element={nowLoggedIn ? (<Messages />) : (<Navigate to="/" />)} />

						<Route path="/loggedIn" exact element={nowLoggedIn ? (<Navigate to="/" />) : alreadyLoggedIn ? (<NewSession />) : (<Navigate to="/" />)} />

					</Routes>

					{previousLocation && (

						<Routes>

							<Route path="/signup" exact element={<ModalCreateAccount />} />

							<Route path="/changePassword" exact element={<ModalChangePassword />} />

						</Routes>

					)}

				</NotificationContext.Provider>

			</SocketContext.Provider>

		</>
	);
}

export default App;
