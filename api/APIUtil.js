const ServerException = require("./ServerException");

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
    }
};