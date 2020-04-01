module.exports = {
    endpoints: {
        'auth': {
            method: 'post',
            handler: require("./gravity/endpoints/auth")
        }
    }
};