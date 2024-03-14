import { createContext, useContext } from 'react';

const DropdownContext = createContext();

export default DropdownContext;

export function useDropdownContext() {

    const isOpen = useContext(DropdownContext);

    if (isOpen === undefined) {

        throw new Error('useDropdownContext must be used with a DropdownContext');

    }

    return isOpen;

}