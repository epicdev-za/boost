const axios = require("axios");
const boost_routes = require("../boost.routes");
const routes = boost_routes.default;

module.exports = async function({app, route, store, redirect, error, env, req}){
    let url = route.path;
    let boost_route = routes[url];

    if(boost_route !== undefined){
        if(boost_route.permissions !== undefined){
            console.log(req);
        }
    }else{
        error({
            statusCode: 404
        });
    }

    // try {
    //     let axios_config = {
    //         "path": url
    //     }
    //
    //     if(req !== undefined && req.headers.cookie !== undefined){
    //         console.log(req.headers.cookie);
    //     }
    //
    //     let response = await axios.post("/api/auth/has_access", );
    //     if(response.status === 200){
    //         if(!response.data.granted){
    //             error({
    //                 statusCode: 403
    //             });
    //         }
    //     }else{
    //         error({
    //             statusCode: 500
    //         });
    //     }
    // }catch (e) {
    //     error({
    //         statusCode: 500
    //     });
    // }
}