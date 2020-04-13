const uuid = require("uuid/v4");

module.exports = {
    state: () => ({
        notifications: [],
        removeInterval: null
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
        setRemoveInterval(state, interval){
            state.removeInterval = interval;
        }
    }
};
