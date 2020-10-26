class BoostPlugin {

    onExceptionCaught(error, status, description, uuid, currentStack){
        return null;
    }

    onLoginDirection(user){
        return null;
    }

    onSanctumEncrypt(data, project_key){
        return null;
    }

    onSanctumDecrypt(data, project_key){
        return null;
    }

}

module.exports = BoostPlugin;
