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
                },
                'login': {
                    method: 'post',
                    handler: require("./api/endpoints/auth/login")
                },
                'has_access': {
                    method: 'post',
                    handler: require("./api/endpoints/auth/has_access")
                },
                'logout': {
                    method: 'post',
                    handler: require("./api/endpoints/auth/logout")
                },
                'logged_in': {
                    method: 'get',
                    handler: require("./api/endpoints/auth/logged_in")
                }
            }
        },
        'admin': {
            children: {
                'roles': {
                    children: {
                        'list': {
                            method: 'get',
                            handler: require("./api/endpoints/admin/roles/list")
                        }
                    }
                }
            }
        }
    }
};