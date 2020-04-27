const ServerException = require("../../../ServerException");
const sanitizer = require("../../../sanitizer");
const clients = require("restify-clients");
const APIUtil = require("../../../APIUtil");

module.exports = function(req, res, next){
    if(APIUtil.hasPermission(req.session.user, 'users.edit')){

        const config = require("../../../../../../server.config");
        let project_key = config.sanctum.project_key;
        let location = config.sanctum.location;

        let client = clients.createJsonClient({
            url: location
        });

        let endpoint = '/api/sanctum/users/get_roles?project=' + project_key;

        for(let key in req.query){
            endpoint += "&" + key + "=" + req.query[key];
        }

        client.get(endpoint, (err, creq, cres, obj) => {
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

    }
}