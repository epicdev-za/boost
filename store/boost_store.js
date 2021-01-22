const uuid = require("uuid/v4");

export default (() => {
    return {
        state: () => ({
            notifications: [],
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
            setPermissions(state, permissions){
                state.permissions = permissions;
            },
            setSuperUser(state, superuser){
                state.superuser = superuser;
            }
        },
        getters: {
            hasPermission: (state) => (permission_node) => {
                let node_array = (Array.isArray(permission_node)) ? permission_node : [permission_node];

                let granted = true;

                if(state.superuser){
                    return true;
                }

                if(state.permissions.length === 0){
                    return false;
                }

                for(let i = 0; i < node_array.length; i++){
                    let permission = node_array[i];
                    if(!state.permissions.includes(permission)){
                        granted = false;
                    }
                }

                return granted;
            }
        }
    };
})();
