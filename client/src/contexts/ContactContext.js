import { createContext, useContext } from 'react';

const ContactContext = createContext();

export default ContactContext;

export function useContactContext() {

    const contacts = useContext(ContactContext);

    if (contacts === undefined) {

        throw new Error('useContactContext must be used with a ContactContext');

    }

    return contacts;

}