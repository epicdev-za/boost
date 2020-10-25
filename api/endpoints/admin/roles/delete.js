const sanitizer = require("../../../sanitizer");
const APIUtil = require("../../../APIUtil");
const SanctumUtil = require("../../../SanctumUtil");

module.exports = function(req, res, next){
    if(req.body === undefined) req.body = {};

    if(APIUtil.hasPermission(req.session.user, 'roles.edit')){
        try{
            let role = sanitizer.cleanUUID(APIUtil.extract(req.body, 'role'));
            
            SanctumUtil.post("/api/sanctum/roles/delete", {
                role: role
            }).then((obj) => {
                res.send(obj);
            }).catch(next);
        }catch (e) {
            next(e);
        }
    }
}
