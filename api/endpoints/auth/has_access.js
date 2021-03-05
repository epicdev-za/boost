const ServerException = require("../../ServerException");
const APIUtil = require("../../APIUtil");
const boost_routes = require("../../../../../../boost.routes");
const routes = boost_routes.default;

module.exports = function(req, res, next){
    if(req.body === undefined) req.body = {};
    const body = req.body;

    let path;
    try{
        path = APIUtil.extract(body, 'path');
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
                    try{
                        APIUtil.hasPermission(user, route.permissions[i]);
                    }catch (e){
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
