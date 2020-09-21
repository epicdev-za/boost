const fs = require('fs');

export default (() => {
    if(fs.existsSync("../../../store/store.js")){
        const project_store = require("../../../store/store");
        if(project_store != undefined){
            return project_store;
        }else{
            return {};
        }
    }else{
        return {};
    }
})();
