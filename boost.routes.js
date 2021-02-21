import path from 'path'

const resolve = function(vue){
    if(__dirname === undefined) __dirname = '';
    return path.join(__dirname, vue);
}

export default {
    '/login': {
        name: 'Login',
        component: resolve('pages/login')
    },
    '/password-recovery': {
        name: "Password Recovery",
        component: resolve("pages/password_recovery")
    },
    '/password-reset': {
        name: "Password Reset",
        component: resolve("pages/password_reset")
    },
    '/admin': {
        name: 'Dashboard',
        component: resolve('pages/admin/index'),
        permissions: ['dashboard']
    },
    '/admin/users': {
        name: 'Users',
        component: resolve('pages/admin/users/index'),
        permissions: ['users.view']
    },
    '/admin/users/create': {
        name: 'Create User',
        component: resolve('pages/admin/users/create'),
        permissions: ['users.view', 'users.edit']
    },
    '/admin/users/edit': {
        name: 'Edit User',
        component: resolve('pages/admin/users/create'),
        permissions: ['users.view', 'users.edit']
    },
    '/admin/roles': {
        name: 'Roles',
        component: resolve('pages/admin/roles/index'),
        permissions: ['roles.view']
    },
    '/admin/roles/create': {
        name: 'Create Role',
        component: resolve('pages/admin/roles/create'),
        permissions: ['roles.view', 'roles.edit']
    },
    '/admin/roles/edit': {
        name: 'Edit Role',
        component: resolve('pages/admin/roles/create'),
        permissions: ['roles.view', 'roles.edit']
    },
    '/admin/debug-logger': {
        name: "Debug Logger",
        component: resolve('pages/admin/debug_logger/index'),
        permissions: ['debug_logger']
    }
}