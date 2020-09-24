class BoostPlugin {

    onExceptionCaught(error, description, uuid, currentStack){
        throw new Error("Abstract class called");
    }

}

module.exports = BoostPlugin;
