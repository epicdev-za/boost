module.exports = {
    jwt: {
        secret: '',
        ttl: 900
    },
    sanctum: {
        location: 'https://www.sanctum.epicdev.co.za',
        project_key: ''
    },
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