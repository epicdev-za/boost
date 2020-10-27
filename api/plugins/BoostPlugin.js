class BoostPlugin {

    onExceptionCaught(error, status, description, uuid, currentStack){
        return null;
    }

    onLoginDirection(user){
        return null;
    }

    onSanctumEncryptSecret(secret, project_key){
        return null;
    }

}

module.exports = BoostPlugin;
