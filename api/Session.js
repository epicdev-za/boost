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
    }
};