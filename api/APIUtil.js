const ServerException = require("./ServerException");
const DebugLog = require("./entities/DebugLog");

module.exports = {

    hasPermission: function (user, permission){
        if(user !== undefined){
            if(user.superuser){
                return true;
            }

            if(user.permissions.includes(permission)){
                return true;
            }
        }
        return false;
    },

    extract: function (object, key){
        if(object[key] !== undefined){
            return object[key];
        }
        throw new ServerException(400, "invalid_request", "Request was missing the '" + key + "' parameter.");
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