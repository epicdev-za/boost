const ServerException = require("../../../ServerException");
const sanitizer = require("../../../sanitizer");
const clients = require("restify-clients");
const APIUtil = require("../../../APIUtil");

module.exports = function(req, res, next){
    if(req.body === undefined) req.body = {};

    if(APIUtil.hasPermission(req.session.user, 'roles.view')){
        let page, itemsPerPage, sortBy, sortDesc;
        try{
            page = sanitizer.cleanNumeric(extract(req.query, 'page'));
            itemsPerPage = sanitizer.cleanNumeric(extract(req.query, 'itemsPerPage'));
            sortBy = extract(req.query, 'sortBy');
            sortDesc = extract(req.query, 'sortDesc');

            const config = require("../../../../../../server.config");
            let project_key = config.sanctum.project_key;
            let location = config.sanctum.location;

            let client = clients.createJsonClient({
                url: location
            });

            client.get("/api/sanctum/roles/list?page=" + page + "&itemsPerPage=" + itemsPerPage + "&sortBy=" + sortBy + "&sortDesc=" + sortDesc + "&project=" + project_key, (err, creq, cres, obj) => {
                if(err){
                    if(typeof cres === typeof undefined || cres === null){
                        next(err);
                    }else{
                        next(new ServerException(cres.statusCode, err.body.error, err.body.error_description));
                    }
                }else{
                    let items = [];
                    for(let i = 0; i < obj.items.length; i++){
                        let item = obj.items[i];
                        if(!obj.showProjectColumn){
                            delete item['project'];
                        }
                        delete item['project_uuid'];
                        items.push(item);
                    }
                    obj.items = items;
                    res.send(obj);
                }
            });
        }catch (e) {
            next(e);
        }
    }else{
        next(new ServerException(403, "permission_denied", "You lack sufficient permission to access this data"));
    }
}

function extract(object, key){
    if(object[key] !== undefined){
        return object[key];
    }
    throw new ServerException(400, "invalid_request", "Request was missing the '" + key + "' parameter.");
}