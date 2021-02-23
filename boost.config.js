import colors from 'vuetify/es5/util/colors'

export default {
    version: '1.2.1',
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
            description: "User accounts allow a person to log into the system. From here you can manage your user accounts.",
            icon: "mdi-account-outline",
            to_prefix: '/admin',
            tag: '',
            tag_color: colors.red.base,
            create_btn: true
        },
        'roles': {
            title: "Roles",
            description: "Roles define what a group of users is able to do. From here you can manage your roles.",
            icon: "mdi-clipboard-outline",
            to_prefix: '/admin',
            tag: '',
            tag_color: colors.blue.base,
            create_btn: true
        },
        'debug-logger': {
            title: "Debug Logger",
            description: "From here you can view all warnings, errors or debug messages logged in the system.",
            icon: "mdi-radar",
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
                'debug-logger'
            ]
        }
    }
};
