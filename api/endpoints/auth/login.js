const ServerException = require("../../ServerException");
const clients = require("restify-clients");
const APIUtil = require("../../APIUtil");
const Dispatcher = require("../../plugins/PluginEventDispatcher");

module.exports = function(req, res, next){
    if(req.body === undefined) req.body = {};
    const body = req.body;

    let username, password;
    try{
        username = extract(body, 'username');
        password = extract(body, 'password');

        const config = require("../../../../../server.config");
        let project_key = config.sanctum.project_key;
        let location = config.sanctum.location;

        let client = clients.createJsonClient({
            url: location
        });

        client.post('/api/sanctum/auth', {
            project: project_key,
            username: username,
            password: password
        }, (err, creq, cres, obj) => {
            if(err){
                if(typeof cres === typeof undefined || cres === null){
                    next(err);
                }else{
                    next(new ServerException(cres.statusCode, err.body.error, err.body.error_description));
                }
            }else{
                let direct_to = "/admin";

                let result = Dispatcher.onLoginDirection(obj);
                if(result !== undefined && result !== null){
                    direct_to = result;
                }

                req.session.user = obj;
                res.send({
                    success: true,
                    direct_to: direct_to
                });
            }
        });

    }catch (e) {
        next(e);
    }

}

function extract(object, key){
    if(object[key] !== undefined){
        return object[key];
    }
    throw new ServerException(400, "invalid_request", "Request was missing the '" + key + "' parameter.");
}
