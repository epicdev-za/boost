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
                    method: 'get',
                    handler: require("./api/endpoints/auth/token")
                }
            }
        }
    }
};