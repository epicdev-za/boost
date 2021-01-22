<template>
    <v-app app class="fill-height">
        <v-navigation-drawer class="sidemenu" :permanent="!$vuetify.breakpoint.xsOnly" app overflow clipped :mini-variant="!drawer && !$vuetify.breakpoint.xsOnly" mini-variant-width="60" v-model="drawer_open">

            <template v-for="(module_group, key) in menu_structure">
                <div v-if="module_group.modules.length > 0">
                    <v-divider></v-divider>

                    <v-list>
                        <v-subheader style="white-space: nowrap" v-if="module_group.title !== null">{{module_group.title}}</v-subheader>

                        <v-list-item-group>

                            <template v-for="(module, index) in module_group.modules">
                                <v-tooltip right :disabled="drawer || $vuetify.breakpoint.xsOnly">
                                    <template v-slot:activator="{ on }">
                                        <v-list-item v-on="on" :to="(!module.exact) ? module.index_url : null" :href="(module.exact) ? module.index_url : null" exact :nuxt="!module.exact" :target="((module.new_window) ? '_blank' : null)" :class="isActive(module.index_url)">
                                            <v-list-item-icon>
                                                <v-icon>{{module.icon}}</v-icon>
                                            </v-list-item-icon>
                                            <v-list-item-content>
                                                <v-list-item-title>{{module.title}}</v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template>
                                    <span>{{module.title}}</span>
                                </v-tooltip>
                            </template>

                        </v-list-item-group>

                    </v-list>
                </div>
            </template>

        </v-navigation-drawer>

        <v-app-bar app color="secondary" clipped-left dark :height="($vuetify.breakpoint.xsOnly) ? 50 : 60">
            <v-app-bar-nav-icon @click.stop="toggle_nav"></v-app-bar-nav-icon>

            <v-toolbar-title>{{projectName}}</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn fab small v-on="on" color="transparent" depressed class="ml-1" @click="toggleTheme">
                        <v-icon>mdi-invert-colors</v-icon>
                    </v-btn>
                </template>
                <span>Toggle Theme</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn fab small v-on="on" color="transparent" depressed class="ml-1" :to="'/'">
                        <v-icon>mdi-web</v-icon>
                    </v-btn>
                </template>
                <span>Back to Website</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn fab small v-on="on" color="transparent" depressed class="ml-1" @click="logout">
                        <v-icon>mdi-power</v-icon>
                    </v-btn>
                </template>
                <span>Logout</span>
            </v-tooltip>

        </v-app-bar>

        <v-main class="fill-height" :style="(!$vuetify.theme.dark) ? 'background-color: rgb(240, 240, 240);' : ''">

            <v-app-bar dense height="40" elevation="0" style="border-bottom: 1px solid rgba(0,0,0,.12);" :style="(!$vuetify.theme.dark) ? 'background-color: #ffffff;' : ''" class="hidden-xs-only" v-if="getBreadcrumbs().length > 1">
                <v-breadcrumbs :items="getBreadcrumbs()" divider="/" class="px-0">
                    <template v-slot:item="{item}">
                        <v-breadcrumbs-item :disabled="item.disabled" :to="item.to" exact nuxt>{{item.text}}</v-breadcrumbs-item>
                    </template>
                </v-breadcrumbs>
            </v-app-bar>

            <nuxt></nuxt>

            <Notifications></Notifications>

        </v-main>
    </v-app>
</template>

<script>
    const axios = require("axios");
    import boost from '../../../boost.config'
    import routes from '../../../boost.routes'
    import Notifications from './../components/Notifications';
    export default {
        head(){
            return {
                link: [
                    { rel: 'icon', type: 'image/x-icon', href: '/backend.ico' }
                ]
            }
        },
        data(){
            return {
                projectName: boost.projectName,
                drawer: false,
                drawer_open: false
            }
        },
        components: { Notifications },
        computed: {
            menu_structure(){
                let module_groups = {};

                for(let key in boost.module_groups){
                    let module_group = boost.module_groups[key];
                    let module_keys = module_group.modules;
                    let full_modules = [];
                    for(let i = 0; i < module_keys.length; i++){
                        let module_key = module_keys[i];
                        let module = boost.modules[module_key];

                        let route_key = module.to_prefix + "/" + module_key;
                        if(module.to_prefix === undefined && module.to !== undefined){
                            route_key = module.to;
                        }

                        if(module.permissions === undefined){
                            module.permissions = [];
                        }
                        if(module.exact === undefined){
                            module.exact = false;
                        }
                        if(module.new_window === undefined){
                            module.new_window = false;
                        }

                        let route = routes[route_key];
                        let permissions = (route !== undefined) ? route.permissions : module.permissions;

                        module.index_url = route_key;

                        let create_route_key = route_key + "/create";
                        let create_route = routes[create_route_key];
                        if(module.create_btn && create_route !== undefined){
                            let create_permissions = create_route.permissions;
                            if(this.hasPermission(create_permissions)){
                                module.create_url = create_route_key;
                            }
                        }

                        if(this.hasPermission(permissions)){
                            full_modules.push(module);
                        }
                    }
                    if(full_modules.length > 0){
                        let new_module_group = {
                            title: module_group.title,
                            modules: full_modules
                        };
                        module_groups[key] = new_module_group;
                    }
                }

                return module_groups;
            }
        },
        methods: {
            hasPermission(perm_array){
                return this.$store.getters["boost_store/hasPermission"](perm_array);
            },
            toggle_nav(){
                if(this.$vuetify.breakpoint.xsOnly){
                    this.drawer = false;
                    this.drawer_open = !this.drawer_open;
                }else{
                    this.drawer_open = false;
                    this.drawer = !this.drawer;
                }
            },
            isActive(to){
                if(to !== '/admin'){
                    let currentPath = this.$route.path;
                    if(currentPath.startsWith(to)){
                        return "v-list-item--active";
                    }
                }
            },
            getBreadcrumbs(){
                //@todo: Optimize
                let breadcrumbs = [];

                let pathed_routes = {};
                let system_routes = this.$router.options.routes;
                for(let i = 0; i < system_routes.length; i++){
                    pathed_routes[system_routes[i].path] = system_routes[i];
                }

                let currentPath = this.$route.path;
                let splitPaths = currentPath.split('/');
                splitPaths.splice(0, 1);

                let crumbedPaths = [];
                for(let i = 0; i < splitPaths.length; i++){
                    let partialPath = "";
                    for(let x = 0; x < i+1; x++){
                        partialPath += "/" + splitPaths[x];
                    }
                    crumbedPaths.push(partialPath);
                }

                for(let i = 0; i < crumbedPaths.length; i++){
                    let crumbedPath = pathed_routes[crumbedPaths[i]];
                    breadcrumbs.push({
                        text: crumbedPath.name,
                        disabled: (i === crumbedPaths.length-1),
                        to: crumbedPath.path
                    });
                }

                return breadcrumbs;
            },
            logout(){
                let _this = this;
                axios.post("/api/auth/logout", {}).then(() => {
                    _this.$router.replace("/");
                })
            },
            toggleTheme(){
                this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
                if(this.$vuetify.theme.dark){
                    document.cookie = "BoostDark=true; max-age=" + 365*24*60*60;
                }else{
                    document.cookie = "BoostDark=; max-age=0";
                }
            }
        },
        mounted() {
            if(document.cookie.match(/^(.*;)?\s*BoostDark\s*=\s*[^;]+(.*)?$/)){
                this.$vuetify.theme.dark = true;
            }
        }
    }
</script>

<style>
    body{
        font-family: "Roboto", sans-serif;
        font-size: 0;
        font-weight: 400;
    }

    .sidemenu .v-navigation-drawer__content{
        font-size: 14px;
        position: absolute;
        width: 273px;
    }

    .sidemenu .v-navigation-drawer__content .v-list{
        max-width: 273px;
    }
    .sidemenu.v-navigation-drawer--mini-variant .v-navigation-drawer__content .v-list{
        max-width: 60px;
    }
    .sidemenu.v-navigation-drawer--mini-variant .v-navigation-drawer__content .v-list-item__icon{
        margin-right: 4px !important;
    }
    .sidemenu.v-navigation-drawer--mini-variant .v-navigation-drawer__content .v-list-item .v-list-item__content{
        display: flex;
    }

    .sidemenu .v-subheader{
        max-height: 48px;
        overflow: hidden;
        opacity: 1;
        transition: max-height 0.5s cubic-bezier(.12,.84,.36,1.01), opacity 0.5s cubic-bezier(.12,.84,.36,1.01);
    }
    .sidemenu.v-navigation-drawer--mini-variant .v-subheader{
        max-height: 0px;
        opacity: 0;
    }
</style>
