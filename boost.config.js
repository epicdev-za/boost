import colors from 'vuetify/es5/util/colors'
import _project from '../../boost.config'

function extend(obj, src){
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}

function getProjectModulesForGroup(){
    let mod_groups = [];
    for(var key in _project.modules){
        mod_groups.push(key);
    }
    return mod_groups;
}

export default {
    version: '1.0.0',
    modules: extend(
        {
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
                tag: 'in dev',
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
                icon: "mdi-settings-outline",
                to_prefix: '/admin',
                tag: '',
                tag_color: colors.blue.base
            }
        },
        _project.modules
    ),
    module_groups: function () {
        let mod_groups = [
            {
                title: null,
                modules: [
                    'admin'
                ]
            }
        ];

        if(getProjectModulesForGroup().length > 0){
            mod_groups.push({
                title: "Your Modules",
                modules: getProjectModulesForGroup()
            });
        }

        mod_groups.push({
            title: "System",
            modules: [
                'users',
                'roles',
                'debug-logger',
                'preferences'
            ]
        });

        return mod_groups;
    }()
}