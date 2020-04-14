const ServerException = require("../../../ServerException");
const sanitizer = require("../../../sanitizer");
const APIUtil = require("../../../APIUtil");
const DebugLog = require("../../../entities/DebugLog");
const Plasma = require("plasma");

module.exports = function(req, res, next){
    if(req.body === undefined) req.body = {};

    let page, itemsPerPage, sortBy, sortDesc;
    try{
        page = sanitizer.cleanNumeric(APIUtil.extract(req.query, 'page'));
        page = (page > 1) ? page : 1;
        itemsPerPage = sanitizer.cleanNumeric(APIUtil.extract(req.query, 'itemsPerPage'));
        sortBy = JSON.parse(APIUtil.extract(req.query, 'sortBy'));
        sortDesc = JSON.parse(APIUtil.extract(req.query, 'sortDesc'));

        if(APIUtil.hasPermission(req.session.user, 'debug_logger')){
            let query = "SELECT * FROM " + DebugLog.getEntity();
            let params = [];

            if(sortBy.length === sortDesc.length && sortBy.length > 0){
                for(let i = 0; i < sortBy.length; i++){
                    let sortByField = sanitizer.cleanPermalink(sortBy[i]);
                    if(i === 0){
                        query += " ORDER BY " + sortByField + " " + ((sortDesc[i] === true) ? "DESC" : "ASC");
                    }else{
                        query += ", " + sortByField + " " + ((sortDesc[i] === true) ? "DESC" : "ASC");
                    }
                }
            }

            if(itemsPerPage > 0) {
                query += " LIMIT $1 OFFSET $2";
                params.push(itemsPerPage);
                params.push((page-1) * itemsPerPage);
            }

            let count_query = "SELECT count(uuid) FROM " + DebugLog.getEntity();

            Plasma.getConnection.query(query, params, (err, r) => {
                if(err){
                    next(err);
                }else{
                    Plasma.getConnection.query(count_query, [], (errr, rr) => {
                        if(errr){
                            next(errr);
                        }else{
                            res.send({
                                count: rr.rows[0].count,
                                items: r.rows
                            });
                        }
                    });
                }
            });
        }else{
            next(new ServerException(403, "permission_denied", "You lack sufficient permission to access this data"));
        }
    }catch (e) {
        next(e);
    }
}