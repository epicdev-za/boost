const APIUtil = require("../../APIUtil");
const SanctumUtil = require("../../SanctumUtil");

module.exports = function(req, res, next){
    SanctumUtil.post('/api/sanctum/system/validate-password-recovery', req.body).then((obj) => {
        res.send(obj);
    }).catch(next);
}
