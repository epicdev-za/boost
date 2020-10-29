const Dispatcher = require("./plugins/PluginEventDispatcher");
const clients = require("restify-clients");
const fs = require("fs");
const crypto = require("crypto");

class SanctumUtil {

    static post = function(endpoint, data){
        const ServerException = require("./ServerException");

        if(data === undefined) data = {};

        return new Promise((resolve, reject) => {
            const config = require("../../../server.config");
            let project_key = config.sanctum.project_key;
            let location = config.sanctum.location;

            let client = clients.createJsonClient({
                url: location
            });

            const key = generateAESSecret();
            encryptSecret(key, project_key).then((secret) => {
                let packet = {
                    secret: secret,
                    data: encryptData(key, data)
                };

                client.post(endpoint + "?project=" + project_key, packet, (err, req, res, obj) => {
                    if(err){
                        if(typeof res === typeof undefined || res === null){
                            reject(err);
                        }else{
                            reject(new ServerException(res.statusCode, err.body.error, err.body.error_description));
                        }
                    }else{
                        resolve(decryptData(key, obj.data));
                    }
                });
            }).catch(reject);
        });
    }

};

function generateAESSecret(){
    const enc_key = crypto.randomBytes(32).toString('hex');
    const iv = crypto.randomBytes(16).toString('hex');
    return {key: enc_key, iv: iv};
}

async function encryptSecret(secret, project_key){
    if(process.env[project_key + '-sanctum-public'] !== undefined){
        const key_file = process.env[project_key + '-sanctum-public'];
        let key;
        try{
            key = await fs.promises.readFile(key_file, 'utf8');
        }catch (e){
            throw new ServerException(500, "missing_sanctum_key", "Missing sanctum key");
        }

        return crypto.publicEncrypt({
            key: key,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256"
        }, Buffer.from(JSON.stringify(secret))).toString("base64");
    }else{
        let res = Dispatcher.onSanctumEncryptSecret(secret, project_key);
        if(res !== null){
            if(res instanceof Promise){
                return await res;
            }else{
                return res;
            }
        }
    }

    throw new ServerException(500, "missing_sanctum_key", "Missing sanctum key");
}

function encryptData(secret, data){
    const key = Buffer.from(secret.key, "hex");
    const iv = Buffer.from(secret.iv, "hex");

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

function decryptData(secret, data){
    const key = Buffer.from(secret.key, "hex");
    const iv = Buffer.from(secret.iv, "hex");

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(data, "base64", 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}

module.exports = SanctumUtil;
