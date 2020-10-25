const APIUtil = require("../../../APIUtil");
const SanctumUtil = require("../../../SanctumUtil");

module.exports = function(req, res, next){
    if(APIUtil.hasPermission(req.session.user, 'users.view')){
        SanctumUtil.post('/api/sanctum/users/list', req.query).then((obj) => {
            res.send(obj);
        }).catch(next);
    }
}
