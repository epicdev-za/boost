const ServerException = require("../../../ServerException");
const sanitizer = require("../../../sanitizer");
const APIUtil = require("../../../APIUtil");
const DebugLog = require("../../../entities/DebugLog");
const Plasma = require("plasma");

module.exports = function(req, res, next){
    if(req.body === undefined) req.body = {};

    let page, itemsPerPage, sortBy, sortDesc, search, tags, date_range;
    try{
        page = sanitizer.cleanNumeric(APIUtil.extract(req.query, 'page'));
        page = (page > 1) ? page : 1;
        itemsPerPage = sanitizer.cleanNumeric(APIUtil.extract(req.query, 'itemsPerPage'));
        sortBy = JSON.parse(APIUtil.extract(req.query, 'sortBy'));
        sortDesc = JSON.parse(APIUtil.extract(req.query, 'sortDesc'));
        search = sanitizer.cleanExtraSymbols(APIUtil.extract(req.query, 'search'));
        tags = JSON.parse(APIUtil.extract(req.query, 'type'));
        date_range = JSON.parse(APIUtil.extract(req.query, 'date'));
        tagsSelected = JSON.parse(APIUtil.extract(req.query, 'tags'));

        if(APIUtil.hasPermission(req.session.user, 'debug_logger')){
            let query = "SELECT * FROM " + DebugLog.getEntity();
            let params = [];
            let count_params = [];
            let param_count = 1;

            let where_query = "";
            if(search.length > 0 || tags.length > 0 || date_range.length === 2 || tagsSelected.length > 0){
                where_query += " WHERE";
            }
            if(search.length > 0){
                where_query += " (uuid LIKE $" + (param_count++) + " OR message LIKE $" + (param_count++) + " OR stack LIKE $" + (param_count++) + ") AND";
                params.push("%" + search + "%");
                params.push("%" + search + "%");
                params.push("%" + search + "%");
                count_params.push("%" + search + "%");
                count_params.push("%" + search + "%");
                count_params.push("%" + search + "%");
            }
            if(tags.length > 0){
                where_query += " type in(";
                for(let i = 0; i < tags.length; i++){
                    if(i === 0) {
                        where_query += "$" + (param_count++);
                    }else{
                        where_query += ", $" + (param_count++);
                    }
                    params.push(sanitizer.cleanNumeric(tags[i].value));
                    count_params.push(sanitizer.cleanNumeric(tags[i].value));
                }
                where_query += ") AND";
            }
            if(date_range.length === 2){
                let start_date = sanitizer.cleanSymbols(date_range[0]) + " 00:00:00";
                let end_date = sanitizer.cleanSymbols(date_range[1]) + " 23:59:59";

                start_date = new Date(start_date);
                end_date = new Date(end_date);

                start_date = Math.round(start_date.getTime() / 1000);
                end_date = Math.round(end_date.getTime() / 1000);

                where_query += " (time > $" + (param_count++) + " AND time < $" + (param_count++) + ") AND";
                params.push(start_date);
                params.push(end_date);
                count_params.push(start_date);
                count_params.push(end_date);
            }
            if(tagsSelected.length > 0){
                where_query += " tags in(";
                for(let i = 0; i < tagsSelected.length; i++){
                    if(i === 0) {
                        where_query += "$" + (param_count++);
                    }else{
                        where_query += ", $" + (param_count++);
                    }
                    params.push(sanitizer.cleanExtraSymbols(tagsSelected[i]));
                    count_params.push(sanitizer.cleanExtraSymbols(tagsSelected[i]));
                }
                where_query += ") AND";
            }

            where_query = where_query.substring(0, where_query.length-4);

            query += where_query;

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
                query += " LIMIT $" + (param_count++) + " OFFSET $" + (param_count++) + "";
                params.push(itemsPerPage);
                params.push((page-1) * itemsPerPage);
            }

            let count_query = "SELECT count(uuid) FROM " + DebugLog.getEntity() + where_query;

            Plasma.getConnection.query(query, params, (err, r) => {
                if(err){
                    next(err);
                }else{
                    Plasma.getConnection.query(count_query, count_params, (errr, rr) => {
                        if(errr){
                            next(errr);
                        }else{

                            Plasma.getConnection.query("SELECT tags FROM " + DebugLog.getEntity() + " GROUP BY tags", [], (errrr, rrr) => {
                                if(errrr){
                                    next(errrr);
                                }else{
                                    let tags = [];
                                    for(let i = 0; i < rrr.rows.length; i++){
                                        if(rrr.rows[i].tags !== null) {
                                            tags.push(rrr.rows[i].tags);
                                        }
                                    }
                                    res.send({
                                        count: rr.rows[0].count,
                                        items: r.rows,
                                        tags: tags
                                    });
                                }
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