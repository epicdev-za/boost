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

}

module.exports = Application;