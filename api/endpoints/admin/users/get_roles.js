const APIUtil = require("../../../APIUtil");
const SanctumUtil = require("../../../SanctumUtil");

module.exports = function(req, res, next){
    if(APIUtil.hasPermission(req.session.user, 'users.edit')){
        SanctumUtil.post('/api/sanctum/users/get_roles', req.query).then((obj) => {
            res.send(obj);
        }).catch(next);
    }
}
