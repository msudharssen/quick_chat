import { createContext, useContext } from 'react';

const NotificationContext = createContext();

export default NotificationContext;

export function useNotificationContext() {

    const notifications = useContext(NotificationContext);

    if (notifications === undefined) {

        throw new Error('useNotificationContext must be used with a NotificationContext');

    }

    return notifications;

}