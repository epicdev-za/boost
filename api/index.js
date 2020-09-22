const express = require("express");
const bodyParser = require("body-parser");
const ServerException = require("./ServerException");
const config = require("../../../server.config");

let server = express();
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(bodyParser.raw());

loadEndpoint(config.endpoints);

function loadEndpoint(endpoints, parentPath = []){
    for(let path in endpoints){
        if(endpoints.hasOwnProperty(path)){
            let endpoint = endpoints[path];
            let fullPath = "";
            for(let i = 0; i < parentPath.length; i++){
                fullPath += "/" + parentPath[i];
            }
            fullPath += "/" + path;

            function registerEndpoint(endpoint, server){
                if(endpoint.handler !== undefined && typeof endpoint.handler !== typeof Function){
                    throw new Error("Endpoint configuration '" + fullPath + "' has invalid handler type");
                }

                if(typeof endpoint.method === typeof '' && endpoint.handler !== undefined){
                    server[endpoint.method](fullPath, handlerErrorWrapper(endpoint.handler));
                }

                if(endpoint.children !== undefined){
                    let childPaths = [].concat(parentPath);
                    childPaths.push(path);
                    loadEndpoint(endpoint.children, childPaths);
                }
            }

            if(endpoint.methods !== undefined && Array.isArray(endpoint.methods)){
                for(let i = 0; i < endpoint.methods.length; i++){
                    let endpoint_variant = endpoint.methods[i];
                    registerEndpoint(endpoint_variant, server);
                }
            }

            if((endpoint.method !== undefined && endpoint.handler !== undefined) || endpoint.children !== undefined){
                registerEndpoint(endpoint, server);
            }
        }else{
            throw new Error("Endpoints configuration object somehow missing key '" + path.toString() + "' when its known to be in itself");
        }
    }
}

function handlerErrorWrapper(handler){
    return function(req, res, next){
        let next_hook = function(e){
            if(e !== undefined){
                let user = null;
                if(req.session.user !== undefined && req.session.user !== null){
                    user = req.session.user;
                }

                if(!(e instanceof ServerException)){
                    e = new ServerException(e, user);
                }
                if(e instanceof ServerException){
                    e.user = user;
                    res.status(e.status);
                    res.send({
                        error: e.code,
                        error_description: e.description
                    });

                    e.log();
                    return;
                }
            }
        }

        try{
            handler(req, res, next_hook);
        }catch (e) {
            next_hook(e);
        }
    }
}

server.use(function(req, res){
    res.status(404);
    res.send({
        error: 'not_found',
        error_description: 'The requested endpoint does not exist'
    });
});

module.exports = {
    path: '/api',
    handler: server
};
