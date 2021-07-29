const ServerException = require("../../ServerException");

module.exports = function(req, res, next){
    if(req.session.publicSession === undefined){
        req.session.publicSession = {};
    }
    if(req.session.user !== undefined){
        res.send({
            publicSession:req.session.publicSession,
            success: true
        });
    }else{
        res.send({
            publicSession:{},
            success: false
        });
    }
}
