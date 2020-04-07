<template>
    <v-container class="fill-height pb-12" :style="background_style" fluid>
        <div v-for="(module_group, index) in module_groups" :key="index" class="pt-12" v-if="module_group.title !== null && module_group.modules.length > 0">
            <span class="group-title px-12">{{module_group.title}}</span>
            <v-row class="px-12 mt-4">
                <div v-for="(module, key) in module_group.modules" :key="key">
                    <v-badge class="dash-notif-badge" :value="0 > 0">
                        <v-btn :to="modules[module].to_prefix + '/' + module" nuxt class="ma-2 pa-0 dash-item" width="160" elevation="1" tile :width="300" style="height: unset; background: #ffffff; text-transform: unset;">
                            <div style="display: table">
                                <div style="display: table-row">
                                    <div style="display: table-cell">
                                        <v-icon class="dash-icon ma-4" style="color: rgba(0, 0, 0, 0.54);">{{modules[module].icon}}</v-icon>
                                    </div>
                                    <div style="display: table-cell; width: 100%; vertical-align: middle; text-align: left;">
                                        <span class="dash-text">{{modules[module].title}}</span>
                                    </div>
                                </div>
                            </div>
                        </v-btn>
                        <template v-slot:badge>0</template>
                    </v-badge>
                </div>
            </v-row>
        </div>
    </v-container>
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
            background_style(){
                return "background: url('" + this.background + "'); background-size: cover; display: block;";
            },
            module_groups(){
                return boost.module_groups;
            },
            modules(){
                return boost.modules;
            }
        }
    }
</script>

<style scoped>
    .group-title{
        font-size: 28px;
        font-weight: 500;
    }

    .dash-item{
        cursor: pointer;
        text-align: center;
    }

    .dash-icon{
        font-size: 30px !important;
    }

    .dash-text {
        font-weight: 400;
        font-size: 1rem;
    }
</style>

<style>
    .dash-notif-badge .v-badge__badge{
        inset: unset !important;
        right: -2px !important;
        top: -2px !important;
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