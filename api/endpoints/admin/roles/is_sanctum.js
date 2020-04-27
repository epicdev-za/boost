const ServerException = require("../../../ServerException");
const APIUtil = require("../../../APIUtil");
const clients = require("restify-clients");

module.exports = function(req, res, next){
    if(APIUtil.hasPermission(req.session.user, 'roles.edit')){
        const config = require("../../../../../../server.config");
        let project_key = config.sanctum.project_key;

        if(project_key === "56343271-772a-43b4-91b7-35ee3d895e6b"){

            const config = require("../../../../../../server.config");
            let project_key = config.sanctum.project_key;
            let location = config.sanctum.location;

            let client = clients.createJsonClient({
                url: location
            });

            client.get('/api/sanctum/roles/get_projects?project=' + project_key, (err, creq, cres, obj) => {
                if(err){
                    if(typeof cres === typeof undefined || cres === null){
                        next(err);
                    }else{
                        next(new ServerException(cres.statusCode, err.body.error, err.body.error_description));
                    }
                }else{
                    res.send({
                        is_sanctum: true,
                        projects: obj.projects
                    });
                }
            });
        }else{
            res.send({
                is_sanctum: false,
                projects: []
            })
        }
    }
}