class PluginEventDispatcher {

    static plugins = [];
    static call_queue = [];

    static popCallQueue(){
        for(let i = 0; i < this.call_queue.length; i++){
            this.call_queue[i]();
        }
    }

    static onStart(){
        for(let i = 0; i < this.plugins.length; i++){
            this.plugins[i].onStart();
        }
    }

    static onDatabaseConnected(){
        if(this.plugins.length > 0){
            for(let i = 0; i < this.plugins.length; i++){
                this.plugins[i].onDatabaseConnected();
            }
        }else{
            this.call_queue.push(function(){
                PluginEventDispatcher.onDatabaseConnected();
            });
        }
    }

    static onExceptionCaught(error, status, description, uuid, currentStack){
        for(let i = 0; i < this.plugins.length; i++){
            this.plugins[i].onExceptionCaught(error, status, description, uuid, currentStack);
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

    static onSanctumEncryptSecret(secret, project_key){
        for(let i = 0; i < this.plugins.length; i++){
            let res = this.plugins[i].onSanctumEncryptSecret(secret, project_key);
            if(res !== undefined && res !== null){
                return res;
            }
        }
        return null;
    }

}

module.exports = PluginEventDispatcher;
