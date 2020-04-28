const ServerException = require("../../ServerException");
const boost_routes = require("../../../boost.routes");
const routes = boost_routes.default;

module.exports = function(req, res, next){
    if(req.body === undefined) req.body = {};
    const body = req.body;

    let path;
    try{
        path = extract(body, 'path');
        let route = routes[path];
        if(route === undefined){
            res.send({
                granted: false
            });
            return;
        };

        if(route.permissions !== undefined){
            if(req.session.user !== undefined){
                let user = req.session.user;

                if(user.superuser){
                    res.send({
                        granted: true
                    });
                    return;
                }

                let granted = true;

                for(let i = 0; i < route.permissions.length; i++){
                    if(!user.permissions.includes(route.permissions[i])){
                        granted = false;
                        break;
                    }
                }

                res.send({
                    granted: granted
                });
            }else{
                res.send({
                    granted: false
                });
            }
        }else{
            res.send({
                granted: true
            });
        }
    }catch (e) {
        next(e);
    }
};

function extract(object, key){
    if(object[key] !== undefined){
        return object[key];
    }
    throw new ServerException(400, "invalid_request", "Request was missing the '" + key + "' parameter.");
}