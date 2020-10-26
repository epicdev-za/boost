const ServerException = require("./ServerException");
const Dispatcher = require("./plugins/PluginEventDispatcher");
const clients = require("restify-clients");
const fs = require("fs");
const crypto = require("crypto");

class SanctumUtil {

    static post = function(endpoint, data){
        if(data === undefined) data = {};

        return new Promise((resolve, reject) => {
            const config = require("../../../server.config");
            let project_key = config.sanctum.project_key;
            let location = config.sanctum.location;

            let client = clients.createJsonClient({
                url: location
            });

            encryptData(data, project_key).then((encrypted_data) => {
                let packet = {
                    data: encrypted_data
                };

                client.post(endpoint + "?project=" + project_key, packet, (err, req, res, obj) => {
                	console.log(err);
                	console.log(obj);
                    if(err){
                        if(typeof cres === typeof undefined || cres === null){
                            reject(err);
                        }else{
                            reject(new ServerException(cres.statusCode, err.body.error, err.body.error_description));
                        }
                    }else{
                        decryptData(obj.data, project_key).then((decrypted_data) => {
                            resolve(decrypted_data);
                        }).catch((e) => {
                            if(e instanceof ServerException){
                                reject(e);
                            }else {
                                reject(new ServerException(500, 'invalid_sanctum_key', "Invalid sanctum key"));
                            }
                        });
                    }
                });
            }).catch((e) => {
                if(e instanceof ServerException){
                    reject(e);
                }else {
                    reject(new ServerException(500, 'invalid_sanctum_key', "Invalid sanctum key"));
                }
            });
        });
    }

};

async function encryptData(data, project_key){
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
        }, Buffer.from(JSON.stringify(data))).toString("base64");
    }else{
        let res = Dispatcher.onSanctumEncrypt(data, project_key);
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

async function decryptData(data, project_key){
    if(process.env[project_key + '-sanctum-private'] !== undefined){
        const key_file = process.env[project_key + '-sanctum-private'];
        let key;
        try{
            key = await fs.promises.readFile(key_file, 'utf8');
        }catch (e){
            throw new ServerException(500, "missing_sanctum_key", "Missing sanctum key");
        }

        return JSON.parse(crypto.privateDecrypt({
            key: key,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256"
        }, Buffer.from(data, 'base64')).toString());
    }else{
        let res = Dispatcher.onSanctumDecrypt(data, project_key);
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

module.exports = SanctumUtil;
