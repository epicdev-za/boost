<template>
    <v-app app class="fill-height">
        <v-navigation-drawer class="sidemenu" :permanent="!$vuetify.breakpoint.xsOnly" app overflow clipped :mini-variant="!drawer && !$vuetify.breakpoint.xsOnly" mini-variant-width="60" v-model="drawer_open">

            <template v-for="(module_group, key) in module_groups">
                <div v-if="module_group.modules.length > 0">
                    <v-divider></v-divider>

                    <v-list>
                        <v-subheader style="white-space: nowrap" v-if="module_group.title !== null">{{module_group.title}}</v-subheader>

                        <v-list-item-group>

                            <template v-for="(module, index) in module_group.modules">
                                <v-tooltip right :disabled="drawer || $vuetify.breakpoint.xsOnly">
                                    <template v-slot:activator="{ on }">
                                        <v-list-item v-on="on" :to="modules[module].to_prefix + '/' + module" exact nuxt :class="isActive(modules[module].to_prefix + '/' + module)">
                                            <v-list-item-icon>
                                                <v-icon>{{modules[module].icon}}</v-icon>
                                            </v-list-item-icon>
                                            <v-list-item-content>
                                                <v-list-item-title>{{modules[module].title}}</v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template>
                                    <span>{{modules[module].title}}</span>
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

        <v-content class="fill-height" style="background-color: rgb(240, 240, 240);">
            <v-app-bar dense height="40" elevation="0" style="border-bottom: 1px solid rgba(0,0,0,.12); background-color: #ffffff;" class="hidden-xs-only" v-if="getBreadcrumbs().length > 1">
                <v-breadcrumbs :items="getBreadcrumbs()" divider="/" class="px-0">
                    <template v-slot:item="{item}">
                        <v-breadcrumbs-item :to="item.to" exact nuxt>{{item.text}}</v-breadcrumbs-item>
                    </template>
                </v-breadcrumbs>
            </v-app-bar>
            <nuxt :modulegroups="module_groups"></nuxt>
        </v-content>
    </v-app>
</template>

<script>
    const axios = require("axios");
    const boost = require('../../../boost.config');
    const config = boost.default;
    export default {
        data(){
            return {
                projectName: config.projectName,
                module_groups: config.module_groups,
                modules: config.modules,
                drawer: false,
                drawer_open: false
            }
        },
        methods: {
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
                    _this.$router.push("/");
                })
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