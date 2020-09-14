const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const Plasma = require("plasma");
const config = require("../../../server.config");

module.exports = function(moduleConfig){

    let database = new Plasma();
    database.connect(config.db);

    if(moduleConfig.db_store !== undefined && moduleConfig.db_store == true) {
        moduleConfig.store = new pgSession({
            pool: database.pool,
            schemaName: "boost"
        });
    }

    const app = express();

    app.use(session(moduleConfig));

    this.options.serverMiddleware.unshift(app);
}
