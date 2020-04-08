import path from 'path'

const resolve = function(vue){
    return path.join(__dirname, vue);
}

export default {
    '/login': {
        name: 'Login',
        component: resolve('pages/login')
    },
    '/admin': {
        name: 'Dashboard',
        component: resolve('pages/admin/index'),
        permissions: ['dashboard']
    },
    '/admin/users': {
        name: 'Users',
        component: resolve('pages/admin/users/index'),
        permissions: ['dashboard', 'users.view']
    },
    '/admin/users/create': {
        name: 'Create User',
        component: resolve('pages/admin/users/create'),
        permissions: ['dashboard', 'users.view', 'users.edit']
    },
    '/admin/roles': {
        name: 'Roles',
        component: resolve('pages/admin/roles/index'),
        permissions: ['dashboard', 'roles.view', 'roles.edit']
    }
}