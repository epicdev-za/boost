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
        location: 'https://sanctum.epicdev.co.za',
        project_key: '',
        cache_ttl: 7200
    },
    plugins: [__dirname + "/plugins/DatabaseAutomationPlugin", __dirname + "/plugins/PermissionLoaderPlugin"],
    endpoints: {
        'auth': {
            children: {
                'token': {
                    method: 'post',
                    handler: __dirname + "/api/endpoints/auth/token"
                },
                'login': {
                    method: 'post',
                    handler: __dirname + "/api/endpoints/auth/login"
                },
                'has_access': {
                    method: 'post',
                    handler: __dirname + "/api/endpoints/auth/has_access"
                },
                'logout': {
                    method: 'post',
                    handler: __dirname + "/api/endpoints/auth/logout"
                },
                'logged_in': {
                    method: 'get',
                    handler: __dirname + "/api/endpoints/auth/logged_in"
                },
                'get_permissions': {
                    method: 'get',
                    handler: __dirname + "/api/endpoints/auth/get_permissions"
                },
                'password-recovery': {
                    method: 'post',
                    handler: __dirname + "/api/endpoints/auth/password-recovery"
                },
                'validate-password-recovery': {
                    method: "post",
                    handler: __dirname + "/api/endpoints/auth/validate-password-recovery"
                },
                'reset-password': {
                    method: "post",
                    handler: __dirname + "/api/endpoints/auth/reset-password"
                }
            }
        },
        'admin': {
            children: {
                'roles': {
                    children: {
                        'list': {
                            method: 'get',
                            handler: __dirname + "/api/endpoints/admin/roles/list"
                        },
                        'is_sanctum': {
                            method: 'get',
                            handler: __dirname + "/api/endpoints/admin/roles/is_sanctum"
                        },
                        'get': {
                            method: 'get',
                            handler: __dirname + "/api/endpoints/admin/roles/get"
                        },
                        'save': {
                            method: 'post',
                            handler: __dirname + "/api/endpoints/admin/roles/save"
                        },
                        'delete': {
                            method: 'post',
                            handler: __dirname + "/api/endpoints/admin/roles/delete"
                        },
                        'get_permissions': {
                            method: 'get',
                            handler: __dirname + "/api/endpoints/admin/roles/get_permissions"
                        }
                    }
                },
                'users': {
                    children: {
                        'list': {
                            method: 'get',
                            handler: __dirname + "/api/endpoints/admin/users/list"
                        },
                        'save': {
                            method: 'post',
                            handler: __dirname + "/api/endpoints/admin/users/save"
                        },
                        'generate_password': {
                            method: 'post',
                            handler: __dirname + "/api/endpoints/admin/users/generate_password"
                        },
                        'get_roles': {
                            method: 'get',
                            handler: __dirname + "/api/endpoints/admin/users/get_roles"
                        },
                        'get': {
                            method: 'get',
                            handler: __dirname + "/api/endpoints/admin/users/get"
                        },
                        'delete': {
                            method: 'post',
                            handler: __dirname + "/api/endpoints/admin/users/delete"
                        },
                        'get_permissions': {
                            method: 'get',
                            handler: __dirname + "/api/endpoints/admin/users/get_permissions"
                        }
                    }
                },
                'logs': {
                    children: {
                        'list': {
                            method: 'get',
                            handler: __dirname + "/api/endpoints/admin/logs/list"
                        }
                    }
                }
            }
        }
    }
};
