<template>
    <v-container class="fill-height" fluid :style="background_style">
        <div class="dashboard-container">
            <ul class="module-group-ul">
                <li class="module-group-li" v-for="(module_group, x) in module_groups" :key="x" v-if="module_group.modules.length > 0 && module_group.title !== null">
                    <div class="dashboard-module-group">
                        <div class="module-group-title-hold">
                            <span>{{module_group.title}}</span>
                        </div>
                        <div class="module-group-list-hold">
                            <ul class="module-group-list-ul">
                                <li class="module-group-list-li" v-for="(module, y) in module_group.modules" :key="y">
                                    <v-card class="module-item-btn">
                                        <div class="module-item-hold">
                                            <div class="module-item-icon-hold">
                                                <v-icon style="font-size: 80px; color: rgb(208, 208, 208); margin-top: 22px;">{{modules[module].icon}}</v-icon>
                                            </div>
                                            <div class="module-item-title-hold">
                                                <span>{{modules[module].title}}</span>
                                            </div>
                                            <div class="module-item-description-hold">
                                                <p>{{modules[module].description}}</p>
                                            </div>
                                            <div class="module-item-button-hold">
                                                <v-btn elevation="0" class="mx-2" :to="modules[module].to_prefix + '/' + module" nuxt>Manage</v-btn>
                                                <v-btn elevation="0" class="mx-2" v-if="modules[module].create_btn" :to="modules[module].to_prefix + '/' + module + '/create'" nuxt>Create</v-btn>
                                            </div>
                                        </div>
                                    </v-card>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
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
                return "background: url('" + this.background + "'); background-size: cover; background-position: center center; display: block; background-attachment: fixed;";
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

    .dashboard-container{
        display: flex;
        justify-content: center;
        padding: 0px 24px;
    }

    .module-group-ul{
        list-style: none;
        text-align: left;
        margin: 0;
        padding: 0;
        overflow: auto;
    }

    .module-group-ul .module-group-li{
        display: block;
        margin: 0;
        padding: 0;
    }

    .dashboard-module-group{
        margin-top: 12px;
    }

    .module-group-title-hold{
        display: block;
        width: 100%;
        padding: 8px 0px;
        text-align: center;
    }
    .module-group-title-hold span{
        font-size: 28px;
        font-weight: 300;
    }

    .module-group-list-hold{
        display: block;
    }

    .module-group-list-hold .module-group-list-ul{
        list-style: none;
        text-align: center;
        margin: 0;
        padding: 0;
        overflow: auto;
    }

    .module-group-list-hold .module-group-list-ul .module-group-list-li{
        display: inline-block;
        margin: 0;
        padding: 12px;
        perspective: 300px;
        perspective-origin: 50% 50%;
    }

    .module-item-btn{
        height: unset;
        min-width: unset;
        padding: 0;
        margin: 0;
        background: #ffffff;
        text-align: center;
    }

    .module-item-hold{
        display: block;
        width: 240px;
        height: 300px;
    }

    .module-item-hold{
        display: table;
    }

    .module-item-icon-hold{
        display: table-row;
        height: 110px;
    }

    .module-item-title-hold{
        display: table-row;
    }

    .module-item-title-hold span{
        font-size: 18px;
        font-weight: 500;
    }

    .module-item-description-hold{
        display: table-row;
    }

    .module-item-description-hold p{
        font-size: 14px;
        font-weight: 300;
        max-height: 62px;
        min-height: 62px;
        overflow: hidden;
        padding: 0px 12px;
        margin: 0;
        color: #a7a7a7;
    }

    .module-item-button-hold{
        display: table-row;
    }

</style>