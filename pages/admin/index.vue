<template>
    <v-img :src="background" style="height: calc(100vh - 60px)">
        <v-container class="fill-height" style="background-color: rgba(255, 255, 255, 0.8)" fluid>
            <v-row align="start" justify="center" class="px-12">
                <nuxt-link v-for="(module, index) in modules" :key="index" :to="module.to_prefix + '/' + module.to">
                    <v-card class="ma-0 px-4 py-4 dash-item" width="160" color="transparent" elevation="0" tile>
                        <v-badge overlap class="dash-notif-badge" :value="module.notification_count > 0">
                            <template v-slot:badge>{{module.notification_count}}</template>
                            <v-icon class="dash-icon mx-2 mt-2 mb-1">{{module.icon}}</v-icon>
                        </v-badge>
                        <v-badge overlap class="dash-tag-badge" :color="module.tag_color" :value="module.tag !== ''">
                            <template v-slot:badge>{{module.tag}}</template>
                            <v-card-text class="pa-0 mb-2 mt-1 dash-text">{{module.title}}</v-card-text>
                        </v-badge>
                    </v-card>
                </nuxt-link>
            </v-row>
        </v-container>
    </v-img>
</template>

<script>
    import boost from 'boost/boost.config'
    export default {
        layout: 'backend',
        head(){
            return {
                title: "Dashboard"
            }
        },
        data(){
            return {
                background: require("../../assets/images/duncan-meyer-LhJfI7lKySc-unsplash.jpg"),
                breadcrumbs: [
                    {
                        text: 'Dashboard',
                        disabled: false,
                        href: 'breadcrumbs_dashboard'
                    }
                ]
            }
        },
        computed: {
            modules(){
                let modules = [];

                const module_groups = boost.module_groups;
                for(let i = 0; i < module_groups.length; i++){
                    let module_group = module_groups[i];
                    if(module_group.title !== null){
                        for(let x = 0; x < module_group.modules.length; x++){
                            let module = boost.modules[module_group.modules[x]];

                            module.notification_count = 0;
                            module.to = module_group.modules[x];

                            modules.push(module);
                        }
                    }
                }

                return modules;
            }
        }
    }
</script>

<style scoped>
    .dash-item{
        cursor: pointer;
        text-align: center;
    }

    .dash-icon{
        font-size: 50px !important;
    }
    .dash-item .dash-icon{
        -webkit-transition: all 150ms cubic-bezier(.7,.91,.93,2) !important;
        -moz-transition: all 150ms cubic-bezier(.7,.91,.93,2) !important;
        -ms-transition: all 150ms cubic-bezier(.7,.91,.93,2) !important;
        -o-transition: all 150ms cubic-bezier(.7,.91,.93,2) !important;
        transition: all 150ms cubic-bezier(.7,.91,.93,2) !important;
    }
    .dash-item:hover .dash-icon{
        transform: scale(1.1);
    }

    .dash-text {
        font-weight: 700;
    }
</style>

<style>
    .dash-notif-badge .v-badge__badge{
        right: 28px !important;
        top: 0px !important;
    }
    .dash-tag-badge{
        width: 100%;
    }
    .dash-tag-badge .v-badge__badge{
        top: unset !important;
        right: unset !important;
        bottom: unset !important;
        left: unset !important;
        position: unset !important;
        margin-top: 30px !important;
    }
</style>