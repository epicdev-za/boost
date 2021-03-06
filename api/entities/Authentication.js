const Entity = require("@epicdev/plasma/PlasmaEntity");
const sanitizer = require("../sanitizer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class Authentication extends Entity{

    constructor(){
        super();
        this.application_uuid = null;
        this.user_uuid = null;
        this.user_agent = null;
        this.ip_address = null;
    }

    static getEntity(){
        return "boost.authentication";
    }

    clean() {
        super.clean();
        this.application_uuid = sanitizer.cleanUUID(this.application_uuid, true);
        this.user_uuid = sanitizer.cleanUUID(this.user_uuid, true);
        this.user_agent = sanitizer.cleanSymbols(this.user_agent);
        this.ip_address = sanitizer.cleanSymbols(this.ip_address);
    }

    static authenticate(ip, application, user, user_agent, callback){
        const config = require("../../../../server.config");

        let authentication = new Authentication().initialise();
        if(user !== undefined){
            authentication.user_uuid = user.uuid;
        }
        if(application !== undefined) {
            authentication.application_uuid = application.uuid;
        }
        authentication.ip_address = ip;
        authentication.user_agent = user_agent;
        authentication.save((err, res) => {
            if(err) {
                callback(err);
            }else{
                let access_token = {
                    auth: authentication.uuid
                };
                if(user !== undefined){
                    access_token.user = user
                }

                try{
                    callback(false, this.generateTokenPayload(access_token, config));
                }catch (e) {
                    callback(e);
                }
            }
        });
    }

    static generateTokenPayload(access_token, config){
        access_token = jwt.sign(access_token, config.jwt.secret, {
            expiresIn: config.jwt.ttl + 's'
        });
        let refresh_token = jwt.sign({
            access_token: crypto.createHash('sha256').update(access_token).digest('hex')
        }, config.jwt.secret, {
            expiresIn: (config.jwt.ttl + 1800) + 's'
        });

        return {
            access_token: access_token,
            token_type: "bearer",
            expires_in: config.jwt.ttl,
            refresh_token: refresh_token
        };
    }

}

module.exports = Authentication;