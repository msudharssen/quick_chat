import { createContext, useContext } from 'react';

const ConnectContext = createContext();

export default ConnectContext;

export function useConnectContext() {

    const contactInfo = useContext(ConnectContext);

    if (contactInfo === undefined) {

        throw new Error('useConnectContext must be used with a ConnectContext');

    }

    return contactInfo;

}

//