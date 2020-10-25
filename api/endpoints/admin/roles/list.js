const APIUtil = require("../../../APIUtil");
const SanctumUtil = require("../../../SanctumUtil");

module.exports = function(req, res, next){
    if(req.body === undefined) req.body = {};

    if(APIUtil.hasPermission(req.session.user, 'roles.view')){
        let page, itemsPerPage, sortBy, sortDesc;
        try{
            SanctumUtil.post('/api/sanctum/roles/list', req.query).then((obj) => {
                let items = [];
                for(let i = 0; i < obj.items.length; i++){
                    let item = obj.items[i];
                    if(!obj.showProjectColumn){
                        delete item['project'];
                    }
                    delete item['project_uuid'];
                    items.push(item);
                }
                obj.items = items;
                res.send(obj);
            }).catch(next);
        }catch (e) {
            next(e);
        }
    }
}
