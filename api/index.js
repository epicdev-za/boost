let express = require("express");
let server = express();
const ServerException = require("./ServerException");
const config = require("../../../server.config");

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
        }else{
            throw new Error("Endpoints configuration object somehow missing key '" + path.toString() + "' when its known to be in itself");
        }
    }
}

function handlerErrorWrapper(handler){
    return function(req, res){
        try{
            handler(req, res);
        }catch (e) {
            if(!(e instanceof ServerException)){
                e = new ServerException(e);
            }
            if(e instanceof ServerException){
                res.status(e.status);
                res.send({
                    error: e.code,
                    error_description: e.description
                });
            }
        }
    }
}

module.exports = {
    path: '/api',
    handler: server
};