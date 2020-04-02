module.exports = {
    endpoints: {
        'auth': {
            children: {
                'token': {
                    method: 'post',
                    handler: require("./gravity/endpoints/auth/token")
                }
            }
        }
    }
};