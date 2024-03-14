const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    timezone: '+00:00'
}).promise();

const login = async (username) => {

    const result = {

        userExists: false,
        encryptedPassword: '',
        accountID: 0

    };

    const [ [ loginAttempt ] ] = await pool.query(`
        SELECT * 
        FROM ACCOUNTS
        WHERE USER_ID = ?;
    `, [username]);

    if (loginAttempt !== undefined) {

        result.userExists = true;
        result.accountID = loginAttempt.account_id;

        result.encryptedPassword = loginAttempt.password;


    } else {

        result.userExists = false;

    }

    return result;

}

const register = async (username, password) => {

    const result = {

        success: false,
        accountID: 0

    };

    const [ [ registrationAttempt ] ] = await pool.query(`
        SELECT *
        FROM ACCOUNTS
        WHERE USER_ID = ?;
    `, [username]);

    if (registrationAttempt !== undefined) {

        result.success = false;

    } else {

        result.success = true;

        await pool.query(`
            INSERT INTO ACCOUNTS(USER_ID, PASSWORD)
            VALUES(?, ?);
        `, [username, password]);

        const [ [ accountNumber ] ] = await pool.query(`
            SELECT ACCOUNT_ID 
            FROM ACCOUNTS 
            WHERE USER_ID = ?;
        `, [username]);

        result.accountID = accountNumber.ACCOUNT_ID;

    }

    return result;

}

const changePassword = async (userId, newPassword) => {

    await pool.query(`
        UPDATE ACCOUNTS
        SET PASSWORD = ?
        WHERE ACCOUNT_ID = ?;
    `, [newPassword, userId]);

    const [ [ confirm ] ] = await pool.query(`
        SELECT PASSWORD AS password
        FROM ACCOUNTS
        WHERE ACCOUNT_ID = ?;    
    `, [userId]);

    return confirm.password === newPassword;

}

const getAllContacts = async () => {

    const [allContacts] = await pool.query("SELECT * FROM CONTACTS;");

    return allContacts;

} 

const getContactList = async (id) => {

    const [contactList] = await pool.query(`
        SELECT ACCOUNT_ID AS accountID, USER_ID AS userID
        FROM ACCOUNTS 
        WHERE ACCOUNT_ID IN (
            SELECT CONTACT_ID 
            FROM CONTACTS INNER JOIN ACCOUNTS 
            ON CURRENT_USER_ID = ACCOUNT_ID 
            WHERE ACCOUNT_ID = ?
        );
    `, [id]);

    return contactList;

}

const addToContacts = async (userId, contactId) => {

    await pool.query(`
        INSERT INTO CONTACTS (CURRENT_USER_ID, CONTACT_ID)
        SELECT A1.ACCOUNT_ID AS CURRENT_USER_ID, A2.ACCOUNT_ID AS CONTACT_ID
        FROM ACCOUNTS A1, ACCOUNTS A2
        WHERE A1.ACCOUNT_ID = ?
        AND A2.ACCOUNT_ID = ?;
    `, [userId, contactId]);

    return getContactList(userId);

}

const deleteContact = async (userId, contactId) => {

    await pool.query(`
        DELETE FROM CONTACTS 
        WHERE CURRENT_USER_ID = ?
        AND CONTACT_ID = ?;
    `, [userId, contactId]);

    return getContactList(userId);

}

const saveMessage = async (messageData, lower, higher) => {

    await pool.query(`
        INSERT INTO MESSAGES (AUTHOR_ID, RECEIVER_ID, CONTENT, TIME, UNREAD_LOWER, UNREAD_HIGHER)
        SELECT A1.ACCOUNT_ID AS AUTHOR_ID, A2.ACCOUNT_ID AS RECEIVER_ID, ? AS CONTENT, ? AS TIME, ? AS UNREAD_LOWER, ? AS UNREAD_HIGHER
        FROM ACCOUNTS A1, ACCOUNTS A2
        WHERE A1.ACCOUNT_ID = ?
        AND A2.ACCOUNT_ID = ?;
    `, [messageData.message, messageData.timestamp, lower, higher, messageData.author, messageData.contactID]);

}

const loadMessages = async (userId, contactId) => {

    await setRead(userId, contactId);

    const [messages] = await pool.query(`
        SELECT * FROM MESSAGES
        WHERE AUTHOR_ID IN (?, ?) 
        AND RECEIVER_ID IN (?, ?)
        ORDER BY TIME;
    `, [userId, contactId, userId, contactId]);

    return messages;

}

const setRead = async (userId, contactId) => {

    if (userId < contactId) {

        await pool.query(`
            UPDATE MESSAGES 
            SET UNREAD_LOWER = 0
            WHERE AUTHOR_ID IN (?, ?) 
            AND RECEIVER_ID IN (?, ?);
    `, [userId, contactId, userId, contactId]);

    } else {

        await pool.query(`
            UPDATE MESSAGES 
            SET UNREAD_HIGHER = 0
            WHERE AUTHOR_ID IN (?, ?) 
            AND RECEIVER_ID IN (?, ?);
    `, [userId, contactId, userId, contactId]);

    }

}

const getConversations = async (userId) => {

    const [conversations] = await pool.query(`
        SELECT DISTINCT
			M.RECEIVER_ID AS receiverID,
            A1.USER_ID AS receiver,
            M.AUTHOR_ID AS authorID,
            A2.USER_ID AS author, 
            LAST_VALUE(TIME) OVER w AS "lastTimestamp",
            LAST_VALUE(CONTENT) OVER w AS "lastMessage",
            SUM(UNREAD_LOWER) OVER w AS "unreadLower",
            SUM(UNREAD_HIGHER) OVER w AS "unreadHigher"
        FROM MESSAGES M 
            INNER JOIN ACCOUNTS A1 ON A1.ACCOUNT_ID = M.RECEIVER_ID
            INNER JOIN ACCOUNTS A2 ON A2.ACCOUNT_ID = M.AUTHOR_ID
        WHERE (M.AUTHOR_ID = ? OR M.RECEIVER_ID = ?)
        WINDOW w AS (
	        PARTITION BY M.AUTHOR_ID, M.RECEIVER_ID
            ORDER BY M.MESSAGE_ID 
	        RANGE BETWEEN 
		        UNBOUNDED PRECEDING AND 
		        UNBOUNDED FOLLOWING
            )
        ORDER BY lastTimestamp DESC;
    `, [userId, userId]);

    return conversations;

}

module.exports = { login, register, changePassword, getAllContacts, getContactList, addToContacts, deleteContact, saveMessage, loadMessages, setRead, getConversations };