const APIUtil = require("../../../APIUtil");
const SanctumUtil = require("../../../SanctumUtil");

module.exports = function(req, res, next){
    if(req.body === undefined) req.body = {};

    if(APIUtil.hasPermission(req.session.user, 'roles.edit')){
        SanctumUtil.post("/api/sanctum/roles/save", req.body).then((obj) => {
            res.send(obj);
        }).catch(next);
    }
}
