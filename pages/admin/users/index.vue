<template>
    <v-container class="pa-12">
        <v-card>
            <v-card-title>
                Manage Users
                <v-spacer></v-spacer>
                <v-btn depressed to="/admin/users/create">
                    <v-icon small class="mr-2">mdi-plus</v-icon>
                    Create User
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

                                <v-list-item link :to="'/admin/users/edit?uuid=' + item.uuid" nuxt>
                                    <v-list-item-icon>
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Edit</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-list-item link @click="openDelete(item)">
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

        <v-dialog v-model="delete_dialog" max-width="350" v-if="delete_item !== null">
            <v-card :loading="delete_loading" :disabled="delete_loading">
                <v-card-title class="headline">Delete user</v-card-title>

                <v-card-text>
                    You are about to delete the user: <strong>{{delete_item.username}}</strong>. Are you sure you wish to do this? This will prevent the user from accessing this system. This action is <strong>permanent</strong> and <strong>non-reversible</strong>.
                </v-card-text>

                <v-card-text class="pb-0">
                    Type the username to confirm:
                </v-card-text>

                <v-col cols="12" md="12" class="px-6 py-0">
                    <v-text-field class="mt-0 pt-0" :placeholder="delete_item.username" v-model="delete_confirm_field"></v-text-field>
                </v-col>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="darken-1" text @click="delete_dialog = false">
                        Cancel
                    </v-btn>

                    <v-btn color="darken-1" text :disabled="(delete_confirm_field !== delete_item.username)" @click="deleteUser(delete_item.uuid)">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
    const axios = require("axios");
    definePageMeta({ layout: 'backend' });
    export default {
        head(){
            return {
                title: "Users - Manage"
            }
        },
        data () {
            return {
                table_headers: [
                    { text: 'Username', value: 'username', align: 'left' },
                    { text: 'Actions', value: 'actions', align: 'right', sortable: false }
                ],
                totalItems: 0,
                table_items: [],
                itemsPerPage: 15,
                loading: true,
                options: {},
                delete_item: null,
                delete_dialog: false,
                delete_loading: false,
                delete_confirm_field: ""
            }
        },
        watch: {
            options: {
                handler(){
                    this.getUsers();
                }
            }
        },
        methods: {
            convertActiveToIcon(item){
                if(item.active){
                    return 'mdi-check'
                }else{
                    return 'mdi-close'
                }
            },
            openDelete(item){
                this.delete_item = item;
                this.delete_dialog = true;
                this.delete_confirm_field = "";
            },
            deleteUser(uuid){
                let _this = this;
                _this.delete_loading = true;

                axios.post("/api/admin/users/delete", {user: uuid}).then(() => {
                    _this.delete_loading = false;
                    _this.getUsers();
                    _this.delete_item = null;
                    _this.delete_dialog = false;
                    this.$store.commit('boost_store/addNotification', {
                        message: 'User deleted',
                        type: 'info',
                        delay: 2
                    });
                }).catch(() => {
                    _this.delete_loading = false;
                    this.$store.commit('boost_store/addNotification', {
                        message: 'An error occurred. Engineers have been notified, please try again later',
                        type: 'error',
                        delay: 3
                    });
                });
            },
            getUsers(){
                let _this = this;
                _this.loading = true;
                const { sortBy, sortDesc, page, itemsPerPage } = this.options;

                axios.get("/api/admin/users/list?page=" + page + "&itemsPerPage=" + itemsPerPage + "&sortBy=" + JSON.stringify(sortBy) + "&sortDesc=" + JSON.stringify(sortDesc)).then((response) => {
                    _this.loading = false;
                    _this.table_items = response.data.items;
                    _this.totalItems = parseInt(response.data.count);
                }).catch(() => {
                    _this.loading = false;
                    _this.table_items = [];
                    _this.totalItems = 0;
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