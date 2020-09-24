const ServerException = require("../../../ServerException");
const sanitizer = require("../../../sanitizer");
const clients = require("restify-clients");
const APIUtil = require("../../../APIUtil");

module.exports = function(req, res, next){
    if(APIUtil.hasPermission(req.session.user, 'roles.view')){
        try{
            let role = sanitizer.cleanUUID(APIUtil.extract(req.query, 'role'));

            const config = require("../../../../../../server.config");
            let project_key = config.sanctum.project_key;
            let location = config.sanctum.location;

            let client = clients.createJsonClient({
                url: location
            });

            client.get('/api/sanctum/roles/get?project=' + project_key + "&role=" + role, (err, creq, cres, obj) => {
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
};
