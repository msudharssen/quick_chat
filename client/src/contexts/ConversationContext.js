import { createContext, useContext } from 'react';

const ConversationContext = createContext();

export default ConversationContext;

export function useConversationContext() {

    const conversations = useContext(ConversationContext);

    if (conversations === undefined) {

        throw new Error('useConversationContext must be used with a ConversationContext');

    }

    return conversations;

}