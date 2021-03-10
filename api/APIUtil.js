const DebugLog = require("./entities/DebugLog");

module.exports = {

    hasPermission: function (user, permissions){
        const ServerException = require("./ServerException");
        if(user !== undefined){
            if(user.superuser){
                return true;
            }

            if(!Array.isArray(permissions)){
                permissions = [permissions];
            }

            for(let i = 0; i < permissions.length; i++){
                let permission = permissions[i];

                let split_permission = permission.split('.');

                for(let x = 0; x < user.permissions.length; x++){
                    let granted_permission = user.permissions[x].split(".");
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
        }
        throw new ServerException(403, "permission_denied", "You lack sufficient permission to access this data");
    },

    hasPermissions: function(user, permissions){
        const ServerException = require("./ServerException");
        if(user !== undefined){
            if(user.superuser){
                return true;
            }

            if(!Array.isArray(permissions)){
                permissions = [permissions];
            }

            let approved_count = 0;

            for(let i = 0; i < permissions.length; i++){
                let permission = permissions[i];

                let split_permission = permission.split('.');

                for(let x = 0; x < user.permissions.length; x++){
                    let granted_permission = user.permissions[x].split(".");
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
            
            if(approved_count === permissions.length){
                return true;
            }
        }
        throw new ServerException(403, "permission_denied", "You lack sufficient permission to access this data");
    },

    extract: function (object, key){
        const ServerException = require("./ServerException");
        if(object[key] !== undefined){
            return object[key];
        }
        throw new ServerException(400, "invalid_request", "Request was missing the '" + key + "' parameter.");
    },

    time: function(){
        return Math.round(new Date().getTime()/1000);
    },

    log(obj, type, tags){
        if(obj === undefined){
            throw Error("Object paramter cannot be null");
        }
        if(type === undefined){
            type = DebugLog.DEBUG;
        }
        if(tags === undefined){
            tags = null;
        }

        if(Object.prototype.toString.call(obj) === "[object Function]"){
            throw Error("Object paramter cannot be a function");
        }

        if(Object.prototype.toString.call(obj) === "[object Object]" || Object.prototype.toString.call(obj) === "[object Array]"){
            obj = JSON.stringify(obj, null, 4);
        }

        obj = "" + obj;

        let debugLog = new DebugLog().initialise();
        debugLog.type = type;
        debugLog.message = obj;
        debugLog.time = Math.round(new Date().getTime()/1000);
        debugLog.tags = tags;

        let stack = new Error().stack.split('\n');
        stack.splice(0, 2);
        let firstLine = "";
        let fullStack = "";
        for(let i = 0; i < stack.length; i++){
            let stackLine = stack[i].trimStart().substr(3);
            if(i === 0){
                firstLine = stackLine;
            }
            fullStack += stackLine + ((i !== stack.length-1) ? "\n" : "");
        }

        debugLog.line = firstLine;
        debugLog.stack = fullStack;

        return debugLog.save();
    },

    DebugLevel: {
        DEBUG: 0,
        CRON_JOB: 1,
        SQL: 2,
        MOBILE: 3,
        ERROR: 4,
        EXCEPTION: 5
    }

};