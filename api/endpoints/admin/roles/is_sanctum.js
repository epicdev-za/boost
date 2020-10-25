const APIUtil = require("../../../APIUtil");
const SanctumUtil = require("../../../SanctumUtil");

module.exports = function(req, res, next){
    if(APIUtil.hasPermission(req.session.user, 'roles.edit')){
        const config = require("../../../../../../server.config");
        let project_key = config.sanctum.project_key;

        if(project_key === "56343271-772a-43b4-91b7-35ee3d895e6b"){
            SanctumUtil.post('/api/sanctum/roles/get_projects').then((obj) => {
                res.send({
                    is_sanctum: true,
                    projects: obj.projects
                });
            }).catch(next);
        }else{
            res.send({
                is_sanctum: false,
                projects: []
            });
        }
    }
}
