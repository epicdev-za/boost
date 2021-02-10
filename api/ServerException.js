const uuidV4 = require("uuid/v4");
const SanctumUtil = require("boost/api/SanctumUtil");
const Dispatcher = require("./plugins/PluginEventDispatcher");

class ServerException extends Error{

    constructor(status, code, object) {
        super();

        this.reference_code = uuidV4();
        this.currentStack = new Error();

        if(status instanceof Error){
            this.status = 500;
            this.description = "An internal server error occurred. Engineers have been notified, please try again later.";
            this.code = this.reference_code;
            this.suberror = status;
            this.user = code;
            this.message = status.message;
        }else{
            this.status = status;
            this.description = object;
            this.code = code;
            this.suberror = this;
            this.message = this.description;
        }
    }

    log(){
        const err = this.suberror;

        const config = require("../../../server.config");
        let project_key = config.sanctum.project_key;

        let currentStack = this.currentStack;

        if(this.status === 500) {
            console.log(err);
            console.log(currentStack.stack);
        }

        let uuid = this.reference_code;

        let stackSplitter = function(stack){
            stack = stack.split('\n');
            stack.splice(0, 1);
            let fullStack = "";
            for(let i = 0; i < stack.length; i++){
                let stackLine = stack[i].trimStart().substr(3);
                fullStack += stackLine + ((i !== stack.length-1) ? "\n" : "");
            }
            return fullStack;
        }

        const stack = err.message + "\n\n" + stackSplitter(err.stack) + "\n\n" + stackSplitter(currentStack.stack);

        let sanctum_payload = {
            project_uuid: project_key,
            http_status: this.status,
            code: uuid,
            stack: stack,
            description: this.description
        };

        if(this.user !== undefined && this.user !== null && this.user.uuid !== undefined && this.user.uuid !== null){
            sanctum_payload.user_uuid = this.user.uuid;
        }

        if(this.code !== 'error_logger_error'){
            SanctumUtil.post("/api/sanctum/errors/log", sanctum_payload).then((obj) => {
                console.log("Logged error to Sanctum");
            }).catch((e) => {
                console.log("Failed to log error to Sanctum");
            });
        }

        Dispatcher.onExceptionCaught(err, this.status, this.description, uuid, currentStack);

        return uuid;
    }

}

module.exports = ServerException;
