const ServerException = require("../../ServerException");

module.exports = function(req, res){
    res.send({
        success: true
    });
}