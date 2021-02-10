const Entity = require("plasma/PlasmaEntity");
const sanitizer = require("../sanitizer");

class SanctumCache extends Entity{

    constructor(){
        super();
        this.user_uuid = null;
        this.username = null;
        this.password = null;
        this.superuser = null;
        this.roles = null;
        this.permissions = null;
        this.cached_time = null;
        this.ttl = null;
    }

    static getEntity(){
        return "boost.sanctum_cache";
    }

    clean() {
        super.clean();
        this.user_uuid = sanitizer.cleanUUID(this.user_uuid);
        this.username = sanitizer.cleanExtraSymbols(this.username);
        this.superuser = sanitizer.cleanBoolean(this.superuser);
        this.roles = sanitizer.cleanExtraSymbols(this.roles);
        this.permissions = sanitizer.cleanExtraSymbols(this.permissions);
        this.cached_time = sanitizer.cleanNumeric(this.cached_time);
        this.ttl = sanitizer.cleanNumeric(this.ttl);
    }

}

module.exports = SanctumCache;