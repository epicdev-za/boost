module.exports = function(req, res, next) {
    if(req.session.user !== undefined){
        delete req.session.user;
        res.send({
            success: true
        });
    }else{
        res.send({
            success: false
        });
    }
}