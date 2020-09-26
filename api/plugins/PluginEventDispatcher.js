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
    }

}

module.exports = PluginEventDispatcher;
