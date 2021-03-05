const BoostPlugin = require("../api/plugins/BoostPlugin");
const fs = require("fs");
const StaticUtil = require("./../api/StaticUtil");
const boost_routes = require("../../../../boost.routes");

class PermissionLoaderPlugin extends BoostPlugin {

    onStart() {
        const permissions = [];

        for(let key in boost_routes.default){
            let route = boost_routes.default[key];
            if(route.permissions !== undefined){
                for(let i = 0; i < route.permissions.length; i++){
                    if(!permissions.includes(route.permissions[i])){
                        permissions.push(route.permissions[i]);
                    }
                }
            }
        }

        const backend_permissions = this.loadBackendPermissions();
        for(let i = 0; i < backend_permissions.length; i++){
            if(!permissions.includes(backend_permissions[i])){
                permissions.push(backend_permissions[i]);
            }
        }

        const frontend_permissions = this.loadFrontendPermissions();
        for(let i = 0; i < frontend_permissions.length; i++){
            if(!permissions.includes(frontend_permissions[i])){
                permissions.push(frontend_permissions[i]);
            }
        }

        StaticUtil.permissions = permissions.sort();
    }

    loadBackendPermissions(){
        let start_dirs = [];

        let dir_1 = fs.readdirSync(__dirname + "/../api");
        let dir_2 = fs.readdirSync(__dirname + "/../../../../api");

        for(let i = 0; i < dir_1.length; i++){
            start_dirs.push(__dirname + "/../api/" + dir_1[i]);
        }
        for(let i = 0; i < dir_2.length; i++){
            start_dirs.push(__dirname + "/../../../../api/" + dir_2[i]);
        }

        let js_files = [];

        let recursive_read = function(dir){
            let dirs = fs.readdirSync(dir);
            for(let i = 0; i < dirs.length; i++){
                let ndir = dir + "/" + dirs[i];
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
            __dirname + "/../api/APIUtil.js",
            __dirname + "/../api/index.js",
            __dirname + "/../api/SanctumUtil.js",
            __dirname + "/../api/sanitizer.js",
            __dirname + "/../api/ServerException.js",
            __dirname + "/../api/StaticUtil.js"
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

        return permissions;
    }

    loadFrontendPermissions(){
        const search_dirs = [
            __dirname + "/../pages",
            __dirname + "/../layouts",
            __dirname + "/../../../../pages",
            __dirname + "/../../../../components"
        ];

        if(fs.existsSync(__dirname + "/../../aspect")){
            search_dirs.push(__dirname + "/../../../aspect/components");
            search_dirs.push(__dirname + "/../../../aspect/layouts");
        }

        let vue_files = [];

        let recursive_read = function(dir){
            let dirs = fs.readdirSync(dir);
            for(let i = 0; i < dirs.length; i++){
                let ndir = dir + "/" + dirs[i];
                if(fs.lstatSync(ndir).isDirectory()){
                    recursive_read(ndir);
                }else if(fs.lstatSync(ndir).isFile() && ndir.endsWith(".vue")) {
                    vue_files.push(ndir);
                }
            }
        }

        for(let i = 0; i < search_dirs.length; i++){
            let dir = search_dirs[i];
            if(fs.lstatSync(dir).isDirectory()){
                recursive_read(dir);
            }else if(fs.lstatSync(dir).isFile() && dir.endsWith(".vue")){
                vue_files.push(dir);
            }
        }

        let permissions = [];

        for(let i = 0; i < vue_files.length; i++){
            let vue_file = vue_files[i];
            let data = fs.readFileSync(vue_file, {encoding:'utf8', flag:'r'});
            let match_result = data.match(/\$store.getters\['boost_store\/hasPermission'\]\(("|')(.*)("|')\)/);
            if(match_result !== null && match_result.length > 3){
                let permission = match_result[2];
                if(!permissions.includes(permission)){
                    permissions.push(permission);
                }
            }
        }

        return permissions;
    }

}

module.exports = PermissionLoaderPlugin;