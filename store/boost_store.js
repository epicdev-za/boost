const uuid = require("uuid/v4");

module.exports = {
    state: () => ({
        notifications: [],
        notificationRemoveInterval: null,
        debug_logger: {
            removalInterval: null
        },
        permissions: [],
        superuser: false
    }),
    mutations: {
        addNotification(state, notif) {
            notif.time_created = Math.round(new Date().getTime()/1000);
            if(notif.delay === undefined) notif.delay = 5;
            state.notifications.push(notif);
        },
        removeNotification(state, index){
            state.notifications.splice(index, 1);
        },
        setNotificationRemoveInterval(state, interval){
            state.notificationRemoveInterval = interval;
        },
        setDebugLoggerRemoveInterval(state, interval){
            state.debug_logger.removalInterval = interval;
        },
        setPermissions(state, permissions){
            state.permissions = permissions;
        },
        setSuperUser(state, superuser){
            state.superuser = superuser;
        }
    }
};
