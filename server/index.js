const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: { 
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const cors = require("cors");
app.use(cors());

app.use(express.json());

const { login, register, changePassword, getAllContacts, getContactList, addToContacts, deleteContact, saveMessage, loadMessages, setRead, getConversations } = require('./database.js');

const bcrypt = require("bcrypt");
const saltRounds = 10;

server.listen(3005, () => {

    console.log("Server is now running");
    
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const loginAttempt = await login(username);

    const check = await bcrypt.compare(password, loginAttempt.encryptedPassword);

    if (check) {

        loginAttempt.correctPassword = true;

    } else {

        loginAttempt.correctPassword = false;

    }

    delete loginAttempt.encryptedPassword;

    res.status(200).send(loginAttempt);
    console.log(loginAttempt);

});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, saltRounds);
    const registrationAttempt = await register(username, hash);
    res.status(200).send(registrationAttempt);
    console.log(registrationAttempt);
});

app.post("/changePassword", async (req, res) => {
    const { user_id, new_password } = req.body;
    const hash = await bcrypt.hash(new_password, saltRounds);
    const changePasswordAttempt = await changePassword(user_id, hash);
    res.status(200).send(changePasswordAttempt);
});

app.get("/contacts", async (req, res) => {
    const allContacts = await getAllContacts();
    res.status(200).send(allContacts);
    console.log(allContacts);
});

app.get("/contacts/:id", async (req, res) => {
    const currentUserId = req.params.id;
    const contactList = await getContactList(currentUserId);
    res.status(200).send(contactList);
});

app.post("/addToContacts", async (req, res) => {
    const { current_user_id, contact_id } = req.body;
    const contactList = await addToContacts(current_user_id, contact_id);
    res.status(201).send(contactList);
    console.log(contactList);
});

app.post("/deleteContact", async (req, res) => {
    const { current_user_id, contact_id } = req.body;
    const contactList = await deleteContact(current_user_id, contact_id);
    res.status(200).send(contactList);
    console.log(contactList);
});

app.post("/loadMessages", async (req, res) => {
    const { user_id, contact_id } = req.body;
    const messages = await loadMessages(user_id, contact_id);
    res.status(200).send(messages);
});

app.post("/setRead", async (req, res) => {
    const { user_id, contact_id } = req.body;
    await setRead(user_id, contact_id);
    res.status(200);
});

app.get("/conversations/:id", async (req, res) => {
    const userID = req.params.id;
    const conversations = await getConversations(userID);
    res.status(200).send(conversations);
});

let socketLookup = [];

// has a user connected to this server?
io.on("connection", (socket) => {

    // who connected to this server?
    console.log(`connected: ${socket.id}`);

    console.log('registered connections: ');
    console.log(socketLookup);

    socket.on("check_online", (contactID) => {

        const isOnline = socketLookup.find(({ username }) => username === contactID);

        socket.emit("is_online", isOnline);

    });

    socket.on("direct_message", (user, contactID, selfID, contactNo) => {

        console.log(`${user} (${selfID}) wants to send a direct message to ${contactID}`);

        const friendSocket = socketLookup.find(({ username }) => username === contactID);

        if (friendSocket && friendSocket.socketID) {

            socket.to(friendSocket.socketID).emit("send_req_info", {

                username: user,
                accountID: selfID,
                socketID: socket.id
                
            });

        } else {

            console.log("offline")

            socket.emit("send_offline_message", contactID, contactNo);

        }

    });

    // approver
    socket.on("send_res_info", (apvrID, socketID, apvrUsername) => {

        socket.to(socketID).emit("request_accepted", apvrID, socket.id, apvrUsername);

    });

    socket.on("register_user", (newUser) => {

        const isLoggedIn = socketLookup.find(({ username }) => username === newUser);

        if (isLoggedIn === undefined) {

            socketLookup.push({

                username: newUser,
                socketID: socket.id
    
            });

            socket.broadcast.emit("now_active", newUser, socket.id);
    
            console.log(socketLookup);

            socket.emit("login");

        } else {

            console.log("ERROR this user is already logged in");

            socket.emit("already_logged_in");

        }

    });

    socket.on("send_dm", (data) => {

        console.log(data);

        if (data.author < data.contactID) {

            saveMessage(data, 0, 1);

        } else {

            saveMessage(data, 1, 0);

        }

        socket.to(data.contactSocket).emit("receive_dm", data);

    });

    socket.on("logout", (userID) => {

        socketLookup = socketLookup.filter(user => user.socketID !== socket.id);

        socket.broadcast.emit("now_inactive", userID);

        console.log(socketLookup);

        console.log(userID + " has logged out");

    });

    socket.on("log_out_everywhere", (userID) => {

        const prevSession = socketLookup.find(({ username }) => username === userID); // retrieve users initially loggedin socketid. 

        socket.to(prevSession.socketID).emit("log_out_all", socket.id); //emits to intial socket id 1 of user, an event called log_out_all , and emits 
        // a new id. 

    });

    socket.on("confirm_logout", (userData, socketID) => {

        socket.to(socketID).emit("logout_confirmed", userData);

    });

    // what to do when a user wants to disconnect
    socket.on("disconnect", () => {

        const connection = socketLookup.find(({ socketID }) => socketID === socket.id);

        if (connection) {

            socket.broadcast.emit("now_inactive", connection.username);

        }

        socketLookup = socketLookup.filter(user => user.socketID !== socket.id);

        console.log(socketLookup);

        // see which user disconnected
        console.log(`disconnected: ${socket.id}`);

    });

});