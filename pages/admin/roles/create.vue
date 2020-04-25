<template>
    <v-container class="pa-12">
        <v-row justify="center">
            <v-card max-width="900" width="100%">
                <v-card-title>{{(item._uuid !== undefined !== undefined) ? "Edit" : "Create"}} Role</v-card-title>
                <v-form>
                    <v-card flat tile class="pa-5">
                        <v-row>
                            <v-col cols="12" md="12" :lg="(is_sanctum ? 8 : 12)" class="py-0">
                                <v-text-field label="Name" v-model="item.name"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="12" lg="4" class="py-0" v-if="is_sanctum">
                                <v-combobox label="Project" :items="convertProjectsCombobox()" v-model="project_selected"></v-combobox>
                            </v-col>

                            <v-col cols="12" md="12" class="py-0 mt-4">
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
                        </v-row>
                    </v-card>
                </v-form>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn depressed to="/admin/roles" exact>Cancel</v-btn>
                    <v-btn depressed @click="save">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-row>
    </v-container>
</template>

<script>
    const axios = require("axios");
    export default {
        layout: "backend",
        head(){
            return {
                title: "Roles - " + ((this.item._uuid !== undefined) ? "Edit" : "Create")
            }
        },
        data(){
            return {
                valid: false,
                nameRules: [
                    v => !!v || 'Name is required',
                ],
                loading: false,
                item: {
                    name: ''
                },
                permissions: [],
                is_sanctum: false,
                projects: [],
                project_selected: null
            }
        },
        methods: {
            convertProjectsCombobox(){
                let arr = [];
                for(let i = 0; i < this.projects.length; i++){
                    arr.push({
                        text: this.projects[i].name,
                        value: this.projects[i].uuid
                    });
                }
                return arr;
            },
            save(){
                let _this = this;

                if(_this.item.name.length > 0){
                    _this.loading = true;

                    axios.post("/api/admin/roles/save", {
                        item: _this.item,
                        permissions: _this.permissions
                    }).then((response) => {
                        _this.loading = false;
                        _this.item = response.data.item
                        _this.permissions = response.data.permissions;
                        this.$store.commit('boost_store/addNotification', {
                            message: 'Saved successfully',
                            type: 'success',
                            delay: 2
                        });
                    }).catch(() => {
                        _this.loading = false;
                        this.$store.commit('boost_store/addNotification', {
                            message: 'An error occurred. Engineers have been notified, please try again later',
                            type: 'error',
                            delay: 3
                        });
                    });
                }
            }
        },
        watch: {
            project_selected: {
                handler(){
                    this.item.project_uuid = this.project_selected.value;
                }
            }
        },
        mounted() {
            let _this = this;
            let uuid = _this.$route.query.uuid;

            axios.get("/api/admin/roles/is_sanctum").then((res) => {
                _this.is_sanctum = res.data.is_sanctum;
                _this.projects = res.data.projects;

                if(uuid !== undefined){
                    _this.loading = true;
                    axios.get("/api/admin/roles/get?role=" + uuid).then((res) => {
                        _this.loading = false;
                        _this.item = res.data.item;
                        _this.permissions = res.data.permissions;

                        if(_this.is_sanctum){
                            for(let i = 0; i < _this.projects.length; i++){
                                let project = _this.projects[i];
                                if(project.uuid === _this.item.project_uuid){
                                    _this.project_selected = {
                                        text: project.name,
                                        value: _this.item.project_uuid
                                    }
                                }
                            }
                        }
                    }).catch(() => {
                        _this.loading = false;
                        this.$store.commit('boost_store/addNotification', {
                            message: 'An error occurred. Engineers have been notified, please try again later',
                            type: 'error',
                            delay: 3
                        });
                    });
                }
            }).catch((err, obj) => {
                this.$store.commit('boost_store/addNotification', {
                    message: 'An error occurred. Engineers have been notified, please try again later',
                    type: 'error',
                    delay: 3
                });
            });
        }
    }
</script>

<style scoped>

</style>