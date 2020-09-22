const uuidV4 = require("uuid/v4");

class ServerException extends Error{

    constructor(status, code, object) {
        super();
        if(status instanceof Error){
            this.status = 500;
            this.description = "An internal server error occurred. Engineers have been notified, please try again later.";
            this.code = uuidV4();
            this.suberror = status;
        }else{
            this.status = status;
            this.description = object;
            this.code = code;
            this.suberror = this;
        }
    }

    log(){
        const err = this.suberror;

        const config = require("../../../server.config");

        console.log(err);
        let currentStack = new Error();
        console.log(currentStack.stack);

        let uuid = uuidV4();

        let reporter_class = null;

        if(config.plugins.includes("boost-error-plugin")){
            reporter_class = require("boost-error-plugin");
        }
        if(config.plugins.includes("boost-error-plugin/gc")){
            reporter_class = require("boost-error-plugin/gc");
        }

        if(reporter_class !== null){
            let reporter = new reporter_class(err, this.description, uuid, currentStack);
            reporter.report();
        }

        return uuid;
    }

}

module.exports = ServerException;
