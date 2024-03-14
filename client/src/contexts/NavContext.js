import { createContext, useContext } from 'react';

const NavContext = createContext();

export default NavContext;

export function useNavContext() {

    const linkTo = useContext(NavContext);

    if (linkTo === undefined) {

        throw new Error('useNavContext must be used with a NavContext');

    }

    return linkTo;

}