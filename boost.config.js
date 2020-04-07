import colors from 'vuetify/es5/util/colors'

export default {
    version: '1.0.0',
    modules: {
        'admin': {
            title: "Dashboard",
            icon: "mdi-view-dashboard-outline",
            to_prefix: '',
            tag: '',
            tag_color: colors.blue.base
        },
        'users': {
            title: "Users",
            icon: "mdi-account-outline",
            to_prefix: '/admin',
            tag: '',
            tag_color: colors.red.base
        },
        'roles': {
            title: "Roles",
            icon: "mdi-clipboard-outline",
            to_prefix: '/admin',
            tag: '',
            tag_color: colors.blue.base
        },
        'debug-logger': {
            title: "Debug Logger",
            icon: "mdi-radar",
            to_prefix: '/admin',
            tag: '',
            tag_color: colors.blue.base
        },
        'preferences': {
            title: "Preferences",
            icon: "mdi-cog-outline",
            to_prefix: '/admin',
            tag: '',
            tag_color: colors.blue.base
        }
    },
    module_groups: {
        0: {
            title: null,
            modules: [
                'admin'
            ]
        },
        'Your Modules': {
            title: 'Your Modules',
            modules: []
        },
        'System': {
            title: "System",
            modules: [
                'users',
                'roles',
                'debug-logger',
                'preferences'
            ]
        }
    }
};