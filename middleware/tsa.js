const axios = require("axios");
const boost_routes = require("../boost.routes");
const routes = boost_routes.default;

module.exports = async function({app, route, store, redirect, error, env, req}){
    let url = route.path;
    let boost_route = routes[url];

    if(boost_route !== undefined){
        if(boost_route.permissions !== undefined){
            if(req !== undefined){
                if(req.session.user !== undefined){
                    let user = req.session.user;

                    if(!user.superuser){
                        for(let i = 0; i < boost_route.permissions; i++){
                            if(!user.permissions.includes(boost_route.permissions[i])){
                                error({
                                    statusCode: 403
                                });
                                break;
                            }
                        }
                    }
                }else{
                    error({
                        statusCode: 403
                    });
                }
            }else{
                let response = await axios.post("/api/auth/has_access", {
                    path: url
                });
                if(response.status === 200){
                    if(!response.data.granted){
                        error({
                            statusCode: 403
                        });
                    }
                }else{
                    error({
                        statusCode: 500
                    });
                }
            }
        }
    }else{
        error({
            statusCode: 404
        });
    }
}