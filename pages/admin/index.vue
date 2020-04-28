<template>
    <v-container class="fill-height" fluid :style="background_style">
        <div class="dashboard-container">
            <ul class="module-group-ul">
                <li class="module-group-li" v-for="(module_group, x) in dashboard_structure" :key="x" v-if="module_group.modules.length > 0 && module_group.title !== null">
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
                                                <v-icon style="font-size: 80px; color: rgb(208, 208, 208); margin-top: 22px;">{{module.icon}}</v-icon>
                                            </div>
                                            <div class="module-item-title-hold">
                                                <span>{{module.title}}</span>
                                            </div>
                                            <div class="module-item-description-hold">
                                                <p>{{module.description}}</p>
                                            </div>
                                            <div class="module-item-button-hold">
                                                <v-btn elevation="0" class="mx-2" :to="module.index_url" nuxt>Manage</v-btn>
                                                <v-btn elevation="0" class="mx-2" v-if="module.create_url !== undefined" :to="module.create_url" nuxt>Create</v-btn>
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
    import boost from '../../../../boost.config'
    import routes from '../../../../boost.routes'
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
            dashboard_structure(){
                let module_groups = {};

                for(let key in boost.module_groups){
                    let module_group = boost.module_groups[key];
                    if(module_group.modules.length > 0 && module_group.title !== null){
                        let module_keys = module_group.modules;
                        let full_modules = [];
                        for(let i = 0; i < module_keys.length; i++){
                            let module_key = module_keys[i];
                            let module = boost.modules[module_key];

                            let route_key = module.to_prefix + "/" + module_key;
                            let route = routes[route_key];
                            let permissions = route.permissions;

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
                }

                return module_groups;
            }
        },
        methods: {
            hasPermission(perm_array){
                let granted = true;

                if(this.$store.state.boost_store.superuser){
                    return true;
                }

                if(this.$store.state.boost_store.permissions.length === 0){
                    return false;
                }

                for(let i = 0; i < perm_array.length; i++){
                    let permission = perm_array[i];
                    if(!this.$store.state.boost_store.permissions.includes(permission)){
                        granted = false;
                    }
                }

                return granted;
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