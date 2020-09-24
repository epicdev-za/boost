class PluginEventDispatcher {

    static plugins = [];

    static onExceptionCaught(error, description, uuid, currentStack){
        for(let i = 0; i < this.plugins; i++){
            this.plugins[i].onExceptionCaught(error, description, uuid, currentStack);
        }
    }

}

module.exports = PluginEventDispatcher;
