const BoostPlugin = require("../api/plugins/BoostPlugin");
const SanctumCache = require("../api/entities/SanctumCache");

class DatabaseAutomationPlugin extends BoostPlugin{

    onStart() {
        if(!SanctumCache.tableExists()){
            console.log("Create table");
        }
    }

}

module.exports = DatabaseAutomationPlugin;