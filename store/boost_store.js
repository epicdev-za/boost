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

                if(state.superuser){
                    return true;
                }

                if(state.permissions.length === 0){
                    return false;
                }

                for(let i = 0; i < node_array.length; i++){
                    let permission = node_array[i];

                    let split_permission = permission.split('.');

                    for(let x = 0; x < state.permissions.length; x++){
                        let granted_permission = state.permissions[x].split(".");
                        let passed_count = 0;
                        for(let i = 0; i < split_permission.length; i++){
                            if(granted_permission.length >= i+1){
                                let granted_node = granted_permission[i];
                                let needed_node = split_permission[i];
                                if(granted_node !== needed_node){
                                    if(granted_node === "*" && passed_count === i){
                                        return true;
                                    }
                                }else{
                                    passed_count++;
                                }
                            }
                        }

                        if(passed_count === split_permission.length){
                            return true;
                        }
                    }
                }

                return false;
            },
            hasPermissions: (state) => (permissions) => {
                if(!Array.isArray(permissions)){
                    permissions = [permissions];
                }

                if(state.superuser){
                    return true;
                }

                if(state.permissions.length === 0){
                    return false;
                }

                let approved_count = 0;

                for(let i = 0; i < permissions.length; i++){
                    let permission = permissions[i];

                    let split_permission = permission.split('.');

                    for(let x = 0; x < state.permissions.length; x++){
                        let granted_permission = state.permissions[x].split(".");
                        let passed_count = 0;
                        for(let i = 0; i < split_permission.length; i++){
                            if(granted_permission.length >= i+1){
                                let granted_node = granted_permission[i];
                                let needed_node = split_permission[i];
                                if(granted_node !== needed_node){
                                    if(granted_node === "*" && passed_count === i){
                                        approved_count++;
                                        break;
                                    }
                                }else{
                                    passed_count++;
                                }
                            }
                        }

                        if(passed_count === split_permission.length){
                            approved_count++;
                            break;
                        }
                    }
                }

                return (approved_count === permissions.length);
            }
        }
    };
})();
