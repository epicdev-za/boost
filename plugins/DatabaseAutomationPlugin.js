const BoostPlugin = require("../api/plugins/BoostPlugin");
const APIUtil = require("../api/APIUtil");
const SanctumCache = require("../api/entities/SanctumCache");

class DatabaseAutomationPlugin extends BoostPlugin{

    onDatabaseConnected() {
        SanctumCache.tableExists().then((result) => {
            if(!result){
                console.log("SanctumCache table missing. Initializing...");
                SanctumCache.initialiseTable().then(() => {
                    console.log("SanctumCache initialized");
                }).catch((err) => {
                    throw err;
                });
            }
        }).catch((err) => {
            throw err;
        }).finally(() => {
            SanctumCache.fetch("SELECT * FROM " + SanctumCache.getEntity() + " WHERE cached_time + ttl < $1", [APIUtil.time()]).then((res) => {
                for(let i = 0; i < res.length; i++){
                    res[i].delete();
                }
            });
        });
    }

}

module.exports = DatabaseAutomationPlugin;