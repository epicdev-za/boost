const axios = require("axios");
const boost_routes = require("./../../../boost.routes");
const routes = boost_routes.default;

module.exports = async function({app, route, store, redirect, error, env, req}){
    let url = route.path;
    let boost_route = routes[url];

    let loggedIn = false;
    if(req !== undefined) {
        loggedIn = req.session.user !== undefined;
    }else{
        let response = await axios.get("/api/auth/logged_in");
        if(response.status === 200 && response.data.success){
            loggedIn = true;
        }
    }
    if(loggedIn){
        switch(url){
            case "/login":
                redirect("/admin");
                return;
        }
    }

    if(boost_route !== undefined){
        if(boost_route.permissions !== undefined){
            if(req !== undefined){
                if(req.session.user !== undefined){
                    let user = req.session.user;

                    store.commit('boost_store/setPermissions', user.permissions);
                    store.commit('boost_store/setSuperUser', user.superuser);

                    if(!user.superuser){
                        for(let i = 0; i < boost_route.permissions.length; i++){
                            if(!user.permissions.includes(boost_route.permissions[i])){
                                error({
                                    statusCode: 403
                                });
                                return;
                            }
                        }
                    }
                }else{
                    error({
                        statusCode: 403
                    });
                    return;
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
                        return;
                    }else{
                        let response = await axios.get("/api/auth/get_permissions");
                        store.commit('boost_store/setPermissions', response.data.permissions);
                        store.commit('boost_store/setSuperUser', response.data.superuser);
                    }
                }else{
                    error({
                        statusCode: 500
                    });
                    return;
                }
            }
        }
    }else{
        error({
            statusCode: 404
        });
        return;
    }
}