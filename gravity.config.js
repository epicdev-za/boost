module.exports = {
    sanctum: {
        location: 'https://sanctum.epicdev.co.za'
    },
    endpoints: {
        'auth': {
            method: 'post',
            handler: require("./gravity/endpoints/auth")
        }
    }
};