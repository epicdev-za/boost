import path from 'path'

const resolve = function(vue){
    return path.join(__dirname, vue);
}

export default [
    {
        name: 'login',
        path: '/login',
        component: resolve('pages/login')
    },
    {
        name: 'Dashboard',
        path: '/admin',
        component: resolve('pages/admin/index')
    },
    {
        name: 'Users',
        path: '/admin/users',
        component: resolve('pages/admin/users/index')
    },
    {
        name: 'Create User',
        path: '/admin/users/create',
        component: resolve('pages/admin/users/create')
    }
]