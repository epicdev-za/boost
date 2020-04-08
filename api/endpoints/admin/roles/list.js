const ServerException = require("../../../ServerException");
const sanitizer = require("../../../sanitizer");
const clients = require("restify-clients");
const Session = require("../../../Session");

module.exports = function(req, res, next){
    if(req.body === undefined) req.body = {};

    if(Session.hasPermission(req.session.user, 'roles.view')){
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
                    if(project_key === "56343271-772a-43b4-91b7-35ee3d895e6b"){
                        obj.showProjectColumn = true;
                    }
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