const Entity = require("plasma/PlasmaEntity");
const sanitizer = require("../sanitizer");

class DebugLog extends Entity{

    constructor(){
        super();
        this.type = null;
        this.message = null;
        this.time = null;
        this.tags = null;
        this.line = null;
        this.stack = null;
    }

    static getEntity(){
        return "boost.debug_logs";
    }

    clean() {
        super.clean();
        this.type = sanitizer.cleanNumeric(this.type);
        this.message = sanitizer.cleanExtraSymbols(this.message);
        this.time = sanitizer.cleanNumeric(this.time);
        this.tags = sanitizer.cleanSymbols(this.tags);
        this.line = sanitizer.cleanExtraSymbols(this.line);
        this.stack = sanitizer.cleanExtraSymbols(this.stack);
    }

    static DEBUG = 0;
    static CRON_JOB = 1;
    static SQL = 2;
    static MOBILE = 3;
    static ERROR = 4;
    static EXCEPTION = 5;

}

module.exports = DebugLog;