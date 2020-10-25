const sanitizer = require("../../../sanitizer");
const APIUtil = require("../../../APIUtil");
const SanctumUtil = require("../../../SanctumUtil");

module.exports = function(req, res, next){
    if(APIUtil.hasPermission(req.session.user, 'roles.view')){
        try{
            let role = sanitizer.cleanUUID(APIUtil.extract(req.query, 'role'));

            SanctumUtil.post('/api/sanctum/roles/get', {
                role: role
            }).then((obj) => {
                res.send(obj);
            }).catch(next);
        }catch (e) {
            next(e);
        }
    }
};
