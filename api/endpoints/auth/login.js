const APIUtil = require("../../APIUtil");
const ServerException = require("../../ServerException");
const SanctumUtil = require("../../SanctumUtil");
const sanitizer = require("../../sanitizer");
const Plasma = require("plasma");
const SanctumCache = require("../../entities/SanctumCache");
const Dispatcher = require("../../plugins/PluginEventDispatcher");
const argon = require("argon2");

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
            let direct_to = "/admin";

            let result = Dispatcher.onLoginDirection(obj);
            if(result !== null){
                direct_to = result;
            }

            cacheUser(obj, password);

            req.session.user = obj;
            res.send({
                success: true,
                direct_to: direct_to
            });
        }).catch((err) => {
            if(!(err instanceof ServerException) || (err.status === 500)){
                getCachedUser(username).then((cached_user) => {
                    argon.verify(cached_user.password, password).then((result) => {
                        if(result){
                            cached_user.cached_time = Math.round(new Date().getTime()/1000);
                            cached_user.save();

                            let obj = {
                                uuid: cached_user.user_uuid,
                                username: cached_user.username,
                                superuser: cached_user.superuser,
                                roles: JSON.parse(cached_user.permissions),
                                permissions: JSON.parse(cached_user.permissions)
                            };

                            let direct_to = "/admin";

                            let result = Dispatcher.onLoginDirection(obj);
                            if(result !== null){
                                direct_to = result;
                            }

                            req.session.user = obj;
                            res.send({
                                success: true,
                                direct_to: direct_to
                            });
                        }else{
                            next(new ServerException(400, "unauthorized_user", "The username and password combination is invalid"));
                        }
                    }).catch((err) => {
                        next(new ServerException(400, "unauthorized_user", "The username and password combination is invalid"));
                    });
                }).catch((e) => {
                    next(err);
                });
            }else{
                next(err);
            }
        });

    }catch (e) {
        next(e);
    }

}

function cacheUser(user, password){
    const config = require("../../../../../../server.config");
    return new Promise(async (resolve, reject) => {
        let cached_user = await Plasma.getConnection.fetch(SanctumCache, "SELECT * FROM " + SanctumCache.getEntity() + " WHERE user_uuid = $1", [sanitizer.cleanUUID(user.uuid)]);

        if(cached_user.length === 0){
            cached_user = new SanctumCache().initialise();
            cached_user.user_uuid = user.uuid;
        }else{
            cached_user = cached_user[0];
        }

        cached_user.username = user.username;
        cached_user.password = await argon.hash(password, {
            type: argon.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 5,
            parallelism: 4,
            hashLength: 128
        });
        cached_user.superuser = user.superuser;
        cached_user.roles = JSON.stringify(user.roles);
        cached_user.permissions = JSON.stringify(user.permissions);
        cached_user.cached_time = Math.round(new Date().getTime()/1000);
        cached_user.ttl = config.sanctum.cache_ttl;
        await cached_user.save();

        resolve();
    });
}

function getCachedUser(username){
    return new Promise(async (resolve, reject) => {
        let cached_user = await Plasma.getConnection.fetch(SanctumCache, "SELECT * FROM " + SanctumCache.getEntity() + " WHERE username = $1", [sanitizer.cleanExtraSymbols(username)]);

        if(cached_user.length === 1){
            cached_user = cached_user[0];

            if(Math.round(new Date().getTime()/1000) < (cached_user.cached_time + cached_user.ttl)){
                resolve(cached_user);
            }else{
                await cached_user.delete();
                reject();
            }
        }else{
            reject();
        }
    });
}