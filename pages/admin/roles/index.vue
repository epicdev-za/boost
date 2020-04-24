<template>
    <v-container class="pa-12">
        <v-card>
            <v-card-title>
                Manage Roles
                <v-spacer></v-spacer>
                <v-btn depressed to="/admin/roles/create">
                    <v-icon small class="mr-2">mdi-plus</v-icon>
                    Create Role
                </v-btn>
            </v-card-title>
            <v-data-table :headers="table_headers" :items="table_items" multi-sort :items-per-page="itemsPerPage" :loading="loading" :server-items-length="totalItems" :options.sync="options">
                <template v-slot:item.active="{item}">
                    <v-icon>{{convertActiveToIcon(item)}}</v-icon>
                </template>
                <template v-slot:item.actions="{item}">
                    <v-menu origin="right top" transition="scale-transition" bottom left>
                        <template v-slot:activator="{on}">
                            <v-btn icon small v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <v-list dense>

                                <v-list-item link :to="'/admin/roles/edit?uuid=' + item.uuid" nuxt>
                                    <v-list-item-icon>
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Edit</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-list-item link>
                                    <v-list-item-icon>
                                        <v-icon>mdi-delete</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Delete</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>

                            </v-list>
                        </v-card>
                    </v-menu>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
    const axios = require("axios");
    import config from '../../../../../boost.config'
    export default {
        layout: "backend",
        head(){
            return {
                title: "Roles - Manage"
            }
        },
        data () {
            return {
                totalItems: 0,
                table_items: [],
                itemsPerPage: 15,
                project_column: false,
                loading: true,
                options: {
                    sortBy: ['project', 'name'],
                    sortDesc: [false, false]
                }
            }
        },
        computed: {
            table_headers(){
                let headers = [
                    { text: 'Name', value: 'name', align: 'left' }
                ];

                if(this.project_column){
                    headers.push({ text: 'Project', value: 'project', align: 'left' });
                }

                headers.push({ text: 'Actions', value: 'actions', align: 'right', sortable: false });

                return headers;
            }
        },
        watch: {
            options: {
                handler(){
                    this.getRoles();
                }
            }
        },
        mounted() {
            this.getRoles();
        },
        methods: {
            convertActiveToIcon(item){
                if(item.active){
                    return 'mdi-check'
                }else{
                    return 'mdi-close'
                }
            },
            getRoles(){
                let _this = this;
                _this.loading = true;
                const { sortBy, sortDesc, page, itemsPerPage } = this.options;

                axios.get("/api/admin/roles/list?page=" + page + "&itemsPerPage=" + itemsPerPage + "&sortBy=" + JSON.stringify(sortBy) + "&sortDesc=" + JSON.stringify(sortDesc)).then((response) => {
                    _this.loading = false;
                    _this.table_items = response.data.items;
                    _this.totalItems = parseInt(response.data.count);
                    _this.project_column = response.data.showProjectColumn;
                }).catch((err, obj) => {
                    _this.loading = false;
                    _this.table_items = [];
                    _this.totalItems = 0;
                    _this.project_column = false;
                    this.$store.commit('boost_store/addNotification', {
                        message: 'An error occurred. Engineers have been notified, please try again later',
                        type: 'error',
                        delay: 3
                    });
                });
            }
        }
    }
</script>

<style scoped>

</style>