const ServerException = require("../../../ServerException");
const sanitizer = require("../../../sanitizer");
const clients = require("restify-clients");
const APIUtil = require("../../../APIUtil");

module.exports = function(req, res, next){
    if(req.body === undefined) req.body = {};

    if(APIUtil.hasPermission(req.session.user, 'roles.edit')){
        try{
            let role = sanitizer.cleanUUID(APIUtil.extract(req.body, 'role'));

            const config = require("../../../../../../server.config");
            let project_key = config.sanctum.project_key;
            let location = config.sanctum.location;

            let client = clients.createJsonClient({
                url: location
            });

            client.post("/api/sanctum/roles/delete?project=" + project_key, {
                role: role
            }, (err, creq, cres, obj) => {
                if(err){
                    if(typeof cres === typeof undefined || cres === null){
                        next(err);
                    }else{
                        next(new ServerException(cres.statusCode, err.body.error, err.body.error_description));
                    }
                }else{
                    res.send(obj);
                }
            });
        }catch (e) {
            next(e);
        }
    }
}