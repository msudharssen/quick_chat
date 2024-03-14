import { createContext, useContext } from 'react';

const SocketContext = createContext();

export default SocketContext;

export function useSocketContext() {

    const socket = useContext(SocketContext);

    if (socket === undefined) {

        throw new Error('useSocketContext must be used with a SocketContext');

    }

    return socket;

}

/*
//Import like usual
//once you have the create context function, you can create a variable, i.e socketContext = createContext();, then export it
// then create a new function called useSocketContext(), and make sure you export this because, you need this to be exported as well
//in order to use the exported SocketContext variable.

All other contexts in this folder is set up similarily
*/
