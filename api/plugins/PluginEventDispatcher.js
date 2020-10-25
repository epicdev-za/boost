class PluginEventDispatcher {

    static plugins = [];

    static onExceptionCaught(error, description, uuid, currentStack){
        for(let i = 0; i < this.plugins.length; i++){
            this.plugins[i].onExceptionCaught(error, description, uuid, currentStack);
        }
    }

    static onLoginDirection(user){
        for(let i = 0; i < this.plugins.length; i++){
            let res = this.plugins[i].onLoginDirection(user);
            if(res !== undefined && res !== null){
                return res;
            }
        }
        return null;
    }

    static onSanctumEncrypt(data, project_key){
    	console.log(this.plugins);
        for(let i = 0; i < this.plugins.length; i++){
            let res = this.plugins[i].onSanctumEncrypt(data, project_key);
            if(res !== undefined && res !== null){
                return res;
            }
        }
        return null;
    }

    static onSanctumDecrypt(data, project_key){
        for(let i = 0; i < this.plugins.length; i++){
            let res = this.plugins[i].onSanctumDecrypt(data, project_key);
            if(res !== undefined && res !== null){
                return res;
            }
        }
        return null;
    }

}

module.exports = PluginEventDispatcher;
