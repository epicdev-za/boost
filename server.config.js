module.exports = {
    db: {
        database: 'gravity',
        host: 'localhost',
        user: 'postgres',
        password: '',
        port: 5432
    },
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
                    handler: require("./api/endpoints/auth/token")
                }
            }
        }
    }
};