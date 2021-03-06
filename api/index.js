const express = require("express");
const bodyParser = require("body-parser");
const ServerException = require("./ServerException");
const config = require("../../../../server.config");
const PluginEventDispatcher = require("./plugins/PluginEventDispatcher");
const BoostPlugin = require("./plugins/BoostPlugin");

if(process.env.NODE_ENV === 'production'){
    process.on("uncaughtException", function(err){
        let exception = new ServerException(err);
        exception.log();
    });
}

let rawBodySaver = function (req, res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
}

let server = express();
server.use(bodyParser.urlencoded({extended: true, verify: rawBodySaver}));
server.use(bodyParser.json({verify: rawBodySaver}));
server.use(bodyParser.raw({verify: rawBodySaver}));

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
                if(endpoint.handler !== undefined && !(typeof endpoint.handler === typeof Function || typeof endpoint.handler === 'string')){
                    throw new Error("Endpoint configuration '" + fullPath + "' has invalid handler type");
                }

                if(typeof endpoint.method === typeof '' && endpoint.handler !== undefined){
                    let handler = (typeof endpoint.handler === 'string') ? require(endpoint.handler) : endpoint.handler;
                    server[endpoint.method](fullPath, handlerErrorWrapper(handler));
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

                if(!Number.isInteger(e.status)){
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
            if(req.body === undefined) req.body = {};
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

for(let i = 0; i < config.plugins.length; i++){
    let pluginClass = require(config.plugins[i]);
    if(pluginClass.prototype instanceof BoostPlugin){
        let plugin = new pluginClass();
        PluginEventDispatcher.plugins.push(plugin);
    }
}

PluginEventDispatcher.popCallQueue();
PluginEventDispatcher.onStart();

module.exports = {
    path: '/api',
    handler: server
};
