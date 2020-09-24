const StaticUtil = require("../../../StaticUtil");
const APIUtil = require("../../../APIUtil");

module.exports = function(req, res, next){
    if(APIUtil.hasPermission(req.session.user, 'roles.view')) {
        res.send(StaticUtil.permissions);
    }
}
