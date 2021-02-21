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

    static getPlasmaMapping(){
        return {
            _uuid: {
                field: "uuid",
                data_type: "VARCHAR",
                data_length: 36,
                nullable: "not null",
                primary_key: true
            },
            user_uuid: {
                field: "user_uuid",
                data_type: "VARCHAR",
                data_length: 36,
                unique: true
            },
            username: {
                field: "username",
                data_type: "VARCHAR",
                data_length: 1024,
                nullable: "not null"
            },
            password: {
                field: "password",
                data_type: "VARCHAR",
                data_length: 2048,
                nullable: "not null"
            },
            superuser: {
                field: "superuser",
                data_type: "boolean"
            },
            roles: {
                field: "roles",
                data_type: "text"
            },
            permissions: {
                field: "permissions",
                data_type: "text"
            },
            cached_time: {
                field: "cached_time",
                data_type: "integer"
            },
            ttl: {
                field: "ttl",
                data_type: "integer"
            }
        };
    }

}

module.exports = SanctumCache;