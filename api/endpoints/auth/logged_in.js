const ServerException = require("../../ServerException");

module.exports = function(req, res, next){
    if(req.session.user !== undefined){
        res.send({
            success: true
        });
    }else{
        res.send({
            success: false
        });
    }
}