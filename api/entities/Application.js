const Entity = require("plasma/PlasmaEntity");
const sanitizer = require("../sanitizer");

class Application extends Entity{

    constructor(){
        super();
        this.client_id = null;
        this.client_secret = null;
    }

    static getEntity(){
        return "boost.applications";
    }

    clean() {
        super.clean();
        this.client_id = sanitizer.cleanPermalink(this.client_id);
        this.client_secret = sanitizer.cleanAlphaNumeric(this.client_secret);
    }

    static getPlasmaMapping(){
        let mapping = super.getPlasmaMapping();

        mapping['client_id'] = {
            field: "client_id",
            data_type: "VARCHAR",
            data_length: 256,
            nullable: "not null",
            primary_key: false,
            unique: true
        };
        mapping['client_secret'] = {
            field: "client_secret",
            data_type: "VARCHAR",
            data_length: 256,
            nullable: "not null",
            primary_key: false,
            unique: false
        };

        return mapping;
    }

}

module.exports = Application;