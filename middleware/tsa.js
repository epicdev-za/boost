const axios = require("axios");
const boost_routes = require("./../../../../boost.routes");
const routes = boost_routes.default;

const tsa = async function({app, route, store, redirect, error, env, req}){
    let url = 0;
    if(route.matched.length > 0){
        url = route.matched[0].path;
        if(url.length === 0){
            url = "/";
        }
    }
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

    store.commit('boost_store/setPermissions', []);
    store.commit('boost_store/setSuperUser', false);
    store.commit('boost_store/setPublicSession', {});

    if(boost_route !== undefined){
        if(boost_route.permissions !== undefined){
            if(req !== undefined){
                if(req.session.user !== undefined){
                    let user = req.session.user;

                    store.commit('boost_store/setPermissions', user.permissions);
                    store.commit('boost_store/setSuperUser', user.superuser);
                    if(req.session.publicSession !== undefined){
                        store.commit('boost_store/setPublicSession', req.session.publicSession);
                    }else{
                        store.commit('boost_store/setPublicSession', {});
                    }



                    for(let i = 0; i < boost_route.permissions.length; i++){
                        if(!store.getters['boost_store/hasPermission'](boost_route.permissions[i])){
                            error({
                                statusCode: 403
                            });
                            return;
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
                        if(response.data.publicSession !== undefined){
                            store.commit('boost_store/setPublicSession', response.data.publicSession);
                        }else{
                            store.commit('boost_store/setPublicSession', {});
                        }
                    }
                }else{
                    error({
                        statusCode: 500
                    });
                    return;
                }
            }
        }else{
            if(req !== undefined){
                if(req.session.user !== undefined){
                    let user = req.session.user;
                    store.commit('boost_store/setPermissions', user.permissions);
                    store.commit('boost_store/setSuperUser', user.superuser);
                    if(req.session.publicSession !== undefined){
                        store.commit('boost_store/setPublicSession', req.session.publicSession);
                    }else{
                        store.commit('boost_store/setPublicSession', {});
                    }
                }
            }else{
                try{
                    let response = await axios.get("/api/auth/get_permissions");
                    if(response.status === 200) {
                        store.commit('boost_store/setPermissions', response.data.permissions);
                        store.commit('boost_store/setSuperUser', response.data.superuser);
                        if(response.data.publicSession !== undefined){
                            store.commit('boost_store/setPublicSession', response.data.publicSession);
                        }else{
                            store.commit('boost_store/setPublicSession', {});
                        }
                    }
                }catch (e){

                }
            }
        }
    }else{
        error({
            statusCode: 404
        });
        return;
    }
};

export default (() => {
    return tsa;
})();
