const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const Plasma = require("plasma");
const ServerException = require("./ServerException");
const config = require("../../../server.config");

let database = new Plasma();
database.connect(config.db);

let server = express();
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(bodyParser.raw());
// server.use(session({
//     secret: config.jwt.secret,
//     resave: false,
//     saveUnitialized: false,
//     cookie: { maxAge: 1800000, httpOnly: false }
// }));

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
    return function(req, res, next){
        let next_hook = function(e){
            if(e !== undefined){
                if(!(e instanceof ServerException)){
                    e = new ServerException(e);
                }
                if(e instanceof ServerException){
                    res.status(e.status);
                    res.send({
                        error: e.code,
                        error_description: e.description
                    });
                    return;
                }
            }
        }

        handler(req, res, next_hook);
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