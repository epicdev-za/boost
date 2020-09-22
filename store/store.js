const fs = require("fs");

export default (() => {
	let project_store = {};

	if(fs.existsSync("../../../store/store.js")){
    	project_store = require("../../../store/store");
	}

    return project_store;
})();
