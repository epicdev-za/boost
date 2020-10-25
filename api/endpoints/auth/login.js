const APIUtil = require("../../APIUtil");
const SanctumUtil = require("../../SanctumUtil");
const Dispatcher = require("../../plugins/PluginEventDispatcher");

module.exports = function(req, res, next){
    if(req.body === undefined) req.body = {};
    const body = req.body;

    let username, password;
    try{
        username = APIUtil.extract(body, 'username');
        password = APIUtil.extract(body, 'password');

        SanctumUtil.post('/api/sanctum/auth', {
            username: username,
            password: password
        }).then((obj) => {
        	console.log(obj);
            let direct_to = "/admin";

            let result = Dispatcher.onLoginDirection(obj);
            if(result !== null){
                direct_to = result;
            }

            req.session.user = obj;
            console.log(req.session);
            res.send({
                success: true,
                direct_to: direct_to
            });
        }).catch(next);

    }catch (e) {
        next(e);
    }

}
