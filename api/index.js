const express = require("express");
const bodyParser = require("body-parser");
const ServerException = require("./ServerException");
const config = require("../../../server.config");
const fs = require("fs");
const StaticUtil = require("./StaticUtil");
const PluginEventDispatcher = require("./plugins/PluginEventDispatcher");
const BoostPlugin = require("./plugins/BoostPlugin");

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

for(let i = 0; i < config.plugins.length; i++){
    let pluginClass = require(config.plugins[i]);
    if(pluginClass.prototype instanceof BoostPlugin){
        let plugin = new pluginClass();
        PluginEventDispatcher.plugins.push(plugin);
    }
}

{
    let start_dirs = [];

    let dir_1 = fs.readdirSync(__dirname);
    let dir_2 = fs.readdirSync(__dirname + "\\..\\..\\..\\api");

    for(let i = 0; i < dir_1.length; i++){
        start_dirs.push(__dirname + "\\" + dir_1[i]);
    }
    for(let i = 0; i < dir_2.length; i++){
        start_dirs.push(__dirname + "\\..\\..\\..\\api\\" + dir_2[i]);
    }

    let js_files = [];

    let recursive_read = function(dir){
        let dirs = fs.readdirSync(dir);
        for(let i = 0; i < dirs.length; i++){
            let ndir = dir + "\\" + dirs[i];
            if(fs.lstatSync(ndir).isDirectory()){
                recursive_read(ndir);
            }else if(fs.lstatSync(ndir).isFile() && ndir.endsWith(".js")) {
                js_files.push(ndir);
            }
        }
    }

    for(let i = 0; i < start_dirs.length; i++){
        let dir = start_dirs[i];
        if(fs.lstatSync(dir).isDirectory()){
            recursive_read(dir);
        }else if(fs.lstatSync(dir).isFile() && dir.endsWith(".js")){
            js_files.push(dir);
        }
    }

    const exclude_list = [
        __dirname + "\\APIUtil.js",
        __dirname + "\\index.js",
        __dirname + "\\sanitizer.js",
        __dirname + "\\ServerException.js"
    ]

    let permissions = [];

    for(let i = 0; i < js_files.length; i++){
        let js_file = js_files[i];
        if(!exclude_list.includes(js_file)){
            let data = fs.readFileSync(js_file, {encoding:'utf8', flag:'r'});
            let match_result = data.match(/APIUtil.hasPermission\(.+,.*("|')(.*)("|')/);
            if(match_result !== null && match_result.length > 3){
                let permission = match_result[2];
                if(!permissions.includes(permission)){
                    permissions.push(permission);
                }
            }
        }
    }

    StaticUtil.permissions = permissions;
}

module.exports = {
    path: '/api',
    handler: server
};
