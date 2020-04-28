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

    static getPlasmaMapping(){
        let mapping = super.getPlasmaMapping();

        mapping['type'] = {
            field: "type",
            data_type: "integer",
            nullable: "not null",
            primary_key: false
        };
        mapping['message'] = {
            field: "message",
            data_type: "TEXT",
            nullable: "not null",
            primary_key: false
        };
        mapping['time'] = {
            field: "time",
            data_type: "INTEGER",
            nullable: "not null",
            primary_key: false
        };
        mapping['tags'] = {
            field: "tags",
            data_type: "VARCHAR",
            data_length: 128,
            nullable: "",
            primary_key: false
        };
        mapping['line'] = {
            field: "line",
            data_type: "VARCHAR",
            data_length: 512,
            nullable: "not null",
            primary_key: false
        };
        mapping['stack'] = {
            field: "stack",
            data_type: "TEXT",
            nullable: "",
            primary_key: false
        };

        return mapping;
    }

}

module.exports = DebugLog;