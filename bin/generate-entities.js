const Plasma = require("@epicdev/plasma");
const config = require("../../../../server.config");
const fs = require('fs');

let database = new Plasma();
database.connect(config.db).then(async (client) => {

    let tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = '" + config.db.schema + "'");

    let entities = [];

    for(let i = 0; i < tables.rows.length; i++){
        let table_name = tables.rows[i].table_name;

        let columns = await client.query("SELECT * FROM information_schema.columns WHERE table_name = '" + table_name + "' AND table_schema = '" + config.db.schema + "'");

        let entity = {
            name: table_name,
            fields: []
        };

        for(let x = 0; x < columns.rows.length; x++){
            let column = columns.rows[x];

            entity.fields.push({
                name: column.column_name,
                type: column.data_type,
                nullable: column.is_nullable == 'YES',
                default: column.column_default
            });
        }

        entities.push(entity);
    }

    for(let i = 0; i < entities.length; i++){
        let entity = entities[i];
        let class_name = entity.name.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
        class_name = class_name[0].toUpperCase() + class_name.substr(1);
        if(class_name.endsWith("ies")){
            class_name = class_name.substr(0, class_name.length-3) + "y";
        }
        if(class_name.endsWith("s")){
            class_name = class_name.substr(0, class_name.length-1);
        }

        let output = "";
        output += "const Entity = require(\"@epicdev/plasma/PlasmaEntity\");";
        output += "\nconst sanitizer = require(\"@epicdev/boost/api/sanitizer\");";
        output += "\n";
        output += "\nclass " + class_name + " extends Entity{";
        output += "\n";
        output += "\n    constructor(){";
        output += "\n        super();";
        for(let x = 0; x < entity.fields.length; x++){
            let field = entity.fields[x];
            if(field.name === "uuid") continue;
            output += "\n        this." + field.name + " = ";
            if(typeof field.default === 'string') output += "\"";
            output += field.default;
            if(typeof field.default === 'string') output += "\"";
            output += ";";
        }
        output += "\n    }";
        output += "\n";
        output += "\n    static getEntity(){";
        output += "\n        return \"" + entity.name + "\";";
        output += "\n    }";
        output += "\n";
        output += "\n    clean(){";
        output += "\n        super.clean();";
        for(let x = 0; x < entity.fields.length; x++){
            let field = entity.fields[x];
            if(field.name === "uuid") continue;
            output += "\n        this." + field.name + " = sanitizer.";
            switch(field.type){
                case "character varying":
                    if(field.name.endsWith("uuid")){
                        output += "cleanUUID";
                    }else if(field.name === "permalink"){
                        output += "cleanPermalink";
                    }else{
                        output += "cleanExtraSymbols";
                    }
                    break;
                case "integer":
                    output += "cleanNumeric";
                    break;
                case "text":
                    output += "cleanExtraSymbols";
                    break;
                case "bool":
                    output += "cleanBoolean";
                    break;
                case "double precision":
                    output += "cleanDecimal";
                    break;
            }
            output += "(this." + field.name;
            if(field.nullable){
                output += ", true";
            }
            output += ");";
        }

        output += "\n    }";
        output += "\n";
        output += "\n}";
        output += "\n";
        output += "\n";
        output += "module.exports = " + class_name + ";";

        let output_file = process.cwd() + "\\" + class_name + ".js";

        fs.writeFileSync(output_file, output);

        console.log("Generated: " + class_name + ".js");
    }

    client.release();

    process.exit(0);
}).catch((err) => {
    console.log(err);
});