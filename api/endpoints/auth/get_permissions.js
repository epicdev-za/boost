const ServerException = require("../../ServerException");

module.exports = function(req, res, next){
    if(req.session.user !== undefined){
        res.send({
            permissions: req.session.user.permissions,
            superuser: req.session.user.superuser
        });
    }else{
        next(new ServerException(403, "unauthorized", "Permission denied"));
    }
}