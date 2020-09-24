<template>
    <v-container class="pa-12">
        <v-row justify="center">
            <v-card max-width="900" width="100%">
                <v-card-title>Create User</v-card-title>
                <v-form>
                    <v-card flat tile class="pa-5">
                        <v-row>

                            <v-col cols="12" md="12" lg="7" class="py-0">
                                <v-text-field label="Username" v-model="item.username" :rules="usernameRules" required autofocus></v-text-field>
                            </v-col>

                            <v-col cols="12" md="12" lg="5" class="py-0">
                                <v-combobox multiple label="Roles" :items="roles" v-model="roles_selected"></v-combobox>
                            </v-col>

                            <v-col cols="12" md="8" class="py-0 mt-4">
                                <v-simple-table dense style="border: thin solid rgba(0, 0, 0, 0.12)">
                                    <template v-slot:default>
                                        <thead>
                                        <tr>
                                            <th colspan="1" class="text-left" style="width: 100%;">Permissions</th>
                                            <th colspan="1" class="text-left">Value</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="(permission, key) in permissions" :key="key" style="background-color: transparent;">
                                            <td style="padding: 0; width:100%;">
                                                <v-text-field solo flat dense hide-details class="table-field" label="Permission Key" placeholder="project.module.action" v-model="permissions[key].key">
                                                    <template v-slot:append>
                                                        <v-btn icon x-small @click="permissions.splice(key, 1)"><v-icon>mdi-close</v-icon></v-btn>
                                                    </template>
                                                </v-text-field>
                                            </td>
                                            <td>
                                                <v-checkbox dense hide-details :ripple="false" style="margin-top: 0; padding-top: 0;" v-model="permissions[key].value"></v-checkbox>
                                            </td>
                                        </tr>
                                        <tr style="text-align: center">
                                            <td colspan="2" style="padding: 0;"><v-btn depressed small block outlined style="border: none;" @click="permissions.push({key: '', value: true})">Add</v-btn></td>
                                        </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-col>

                            <v-col cols="12" md="4" class="py-0 mt-4">
                                <v-simple-table dense style="border: thin solid rgba(0, 0, 0, 0.12)">
                                    <template v-slot:default>
                                        <thead>
                                        <tr>
                                            <th colspan="1" class="text-left" style="width: 100%;">Available Permissions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="(permission, key) in existing_permissions" :key="key">
                                            <td style="width:100%; font-size: 16px; padding: 7px 12px;">
                                                {{permission}}
                                            </td>
                                        </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-col>

                        </v-row>
                    </v-card>
                </v-form>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-btn depressed @click="generate_password_dialog = true">Set Password</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn depressed to="/admin/users" exact>Cancel</v-btn>
                    <v-btn depressed @click="save">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-row>

        <v-dialog v-model="generate_password_dialog" max-width="350">
            <v-card :loading="generate_loading" :disabled="generate_loading">
                <v-card-title class="headline">Set Password</v-card-title>

                <v-card-text>
                    <strong>Warning:</strong> This will overwrite the old password if one is set.
                </v-card-text>

                <v-col cols="12" md="12" class="px-6 py-0">
                    <v-text-field type="password" class="mt-0 pt-0" v-model="generate_password_field" v-on:keyup="passwordFieldKeyUp"></v-text-field>
                </v-col>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="darken-1" text @click="generate_password_dialog = false">
                        Cancel
                    </v-btn>

                    <v-btn color="darken-1" text @click="generatePassword" :disabled="generate_password_field.length === 0">
                        Set
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
    const axios = require("axios");
    export default {
        layout: "backend",
        head(){
            return {
                title: "Users - Create"
            }
        },
        data(){
            return {
                valid: false,
                usernameRules: [
                    v => !!v || 'Username is required',
                ],
                loading: false,
                item: {
                    username: ''
                },
                permissions: [],
                roles: [],
                roles_selected: [],
                generate_password_dialog: false,
                generate_loading: false,
                generate_password_field: '',
                existing_permissions: []
            }
        },
        mounted() {
            let _this = this;
            let uuid = _this.$route.query.uuid;

            _this.loading = true;

            axios.get("/api/admin/users/get_roles").then((response) => {
                _this.loading = false;
                _this.roles = response.data;

                if(uuid !== undefined){
                    _this.loading = true;
                    axios.get("/api/admin/users/get?uuid=" + uuid).then((res) => {
                        _this.loading = false;
                        _this.item = res.data.item;
                        _this.permissions = res.data.permissions;
                        _this.roles_selected = res.data.roles;
                    }).catch(() => {
                        _this.loading = false;
                        if(err.response.status === 401){
                            this.$store.commit('boost_store/addNotification', {
                                message: err.response.data.error_description,
                                type: 'error',
                                delay: 3
                            });
                        }else{
                            this.$store.commit('boost_store/addNotification', {
                                message: 'An error occurred. Engineers have been notified, please try again later',
                                type: 'error',
                                delay: 3
                            });
                        }
                    });
                }

            }).catch(() => {
                _this.loading = false;
                this.$store.commit('boost_store/addNotification', {
                    message: 'An error occurred. Engineers have been notified, please try again later',
                    type: 'error',
                    delay: 3
                });
            });

            axios.get("/api/admin/users/get_permissions").then((response) => {
                _this.existing_permissions = response.data;
            }).catch(() => {
                _this.loading = false;
                this.$store.commit('boost_store/addNotification', {
                    message: 'An error occurred. Engineers have been notified, please try again later',
                    type: 'error',
                    delay: 3
                });
            });
        },
        methods: {
            passwordFieldKeyUp(e){
                if(e.keyCode === 13){
                    this.generatePassword();
                }
            },
            generatePassword(){
                let _this = this;

                if(_this.generate_password_field.length > 0){
                    _this.generate_loading = true;
                    axios.post("/api/admin/users/generate_password", {
                        password: _this.generate_password_field
                    }).then((response) => {
                        _this.generate_loading = false;
                        _this.item.password = response.data.hash;
                        _this.generate_password_dialog = false;
                    }).catch(() => {
                        _this.generate_loading = false;
                        this.$store.commit('boost_store/addNotification', {
                            message: 'An error occurred. Engineers have been notified, please try again later',
                            type: 'error',
                            delay: 3
                        });
                    });
                }
            },
            save(){
                let _this = this;

                if(_this.item.username.length > 0){
                    _this.loading = true;

                    axios.post("/api/admin/users/save", {
                        item: _this.item,
                        roles: _this.roles_selected,
                        permissions: _this.permissions
                    }).then((response) => {
                        _this.loading = false;
                        _this.item = response.data.item;
                        _this.permissions = response.data.permissions;
                        _this.roles_selected = response.data.roles;
                        this.$store.commit('boost_store/addNotification', {
                            message: 'Saved successfully',
                            type: 'success',
                            delay: 2
                        });
                    }).catch((err) => {
                        _this.loading = false;

                        if(err.response.status === 401){
                            this.$store.commit('boost_store/addNotification', {
                                message: err.response.data.error_description,
                                type: 'error',
                                delay: 3
                            });
                        }else{
                            this.$store.commit('boost_store/addNotification', {
                                message: 'An error occurred. Engineers have been notified, please try again later',
                                type: 'error',
                                delay: 3
                            });
                        }
                    });
                }
            }
        }
    }
</script>

<style scoped>

</style>
