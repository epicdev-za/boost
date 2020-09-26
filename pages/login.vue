<template>
    <div class="page-container">
        <div class="background-container primary"></div>
        <v-container class="fill-height">
            <v-row align="center" justify="center" class="px-4">
                <v-card max-width="550" elevation="6" class="px-12" :loading="form_loading" :disabled="form_loading">
                    <v-row justify="center" class="pt-4">
                        <v-card-title>
                            <v-avatar size="48" tile>
                                <svg :style="style" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 175.53 175.53"><path d="M172.33,64.27a87.82,87.82,0,0,1-36,96.59q-2.26,1.51-4.67,2.9a87.65,87.65,0,0,1-21.17,8.79,86.43,86.43,0,0,1-23.5,3,87.39,87.39,0,0,1-16.56-1.74q-2.7-.54-5.36-1.26a87.52,87.52,0,0,1-20.47-8.36l-.7-.39a86.66,86.66,0,0,1-18.17-13.94l-.58-.57a88,88,0,0,1-13.36-17.62q-1.38-2.4-2.6-4.85a87.74,87.74,0,0,1,30-112.12q2.28-1.51,4.68-2.9a87.41,87.41,0,0,1,61.24-10q2.7.54,5.35,1.25A87.37,87.37,0,0,1,131,11.37l-.26,1L125,33.49a65.91,65.91,0,0,0-16.72-8.25c-1.16-.38-2.32-.73-3.5-1A65.62,65.62,0,0,0,58.07,29l0-.14-3.25,1.88a65.57,65.57,0,0,0-30.66,40l-1,3.63.13-.07a65.61,65.61,0,0,0,7.42,46.38c.61,1.06,1.26,2.1,1.92,3.11a65,65,0,0,0,12.29,14A63.85,63.85,0,0,0,50.51,142a65.78,65.78,0,0,0,16.72,8.26c1.16.38,2.32.72,3.5,1a66,66,0,0,0,22.16,2.06,65.21,65.21,0,0,0,24.55-6.89l0,.14,3.26-1.88a65.6,65.6,0,0,0,30.66-40l1-3.63L109.7,125.76a43.84,43.84,0,0,1-43.88,0,43.94,43.94,0,0,1-21.94-38,44.28,44.28,0,0,1,1.5-11.36A43.75,43.75,0,0,1,65.83,49.76a44.38,44.38,0,0,1,10.58-4.39A43.93,43.93,0,0,1,118.8,56.73l-4.17,15.52L87.77,87.76l5.67-21.19a21.94,21.94,0,1,0,5.29,40.19Z"/></svg>
                            </v-avatar>
                        </v-card-title>
                    </v-row>
                    <v-row justify="center">
                        <v-card-title class="pt-0" style="text-align: center; word-break: keep-all;">{{project_name}}</v-card-title>
                        <v-card-text style="text-align: center">Boost Management System<br/>v{{version}}</v-card-text>
                    </v-row>
                    <v-row justify="center" class="pt-4">
                        <v-alert type="error" dense text dismissible class="mb-0" :value="error" v-model="error">
                            {{error_text}}
                        </v-alert>
                    </v-row>
                    <v-row justify="center" class="pb-4">
                        <v-form v-model="valid">
                            <v-container>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <v-text-field v-model="username" :rules="usernameRules" label="Username" required autofocus></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-text-field class="a-field" v-model="password" v-on:keyup="fieldEnterPress" :rules="passwordRules" label="Password" :type="password_show ? 'text' : 'password'" :append-icon="password_show ? 'mdi-eye' : 'mdi-eye-off'" @click:append="password_show = !password_show"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row justify="center" class="mt-12">
                                    <v-btn color="secondary" class="px-8" @click="login(username, password)">Login</v-btn>
                                </v-row>
                            </v-container>
                        </v-form>
                    </v-row>
                </v-card>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    const axios = require("axios");
    import config from '../../../boost.config';
    export default {
        name: "login",
        head(){
            return {
                title: "Login"
            }
        },
        data(){
            return {
                version: config.version,
                project_name: config.projectName,
                valid: false,
                username: '',
                password: '',
                form_loading: false,
                password_show: false,
                error: false,
                error_text: '',
                usernameRules: [
                    v => !!v || 'Username is required',
                ],
                passwordRules: [
                    v => !!v || 'Password is required'
                ]
            }
        },
        methods: {
            fieldEnterPress(e){
                if(e.keyCode === 13){
                    this.login(this.username, this.password);
                }
            },
            login: function(username, password){
                if(username.length > 0 && password.length > 0){
                    let _this = this;
                    _this.form_loading = true;
                    axios.post("/api/auth/login", {
                        username: username,
                        password: password
                    }).then(function(response){
                        _this.form_loading = false;
                        _this.$router.push(response.data.direct_to);
                    }).catch(function(error, obj){
                        _this.form_loading = false;
                        if(!error.response){
                            error.response = {
                                status: 500
                            };
                        }
                        switch(error.response.status){
                            default:
                            case 500:
                                _this.error = true;
                                _this.error_text = "Failed to connect to authentication server";
                                break;
                            case 400:
                                _this.error = true;
                                _this.error_text = "Invalid credentials";
                                break;
                        }
                    });
                }
            }
        },
        computed: {
            style(){
                if(!this.$vuetify.theme.dark){
                    return "fill: " + this.$vuetify.theme.defaults.light.primary;
                }else{
                    return "fill: " + this.$vuetify.theme.defaults.dark.primary;
                }
            }
        }
    }
</script>

<style scoped>
    .page-container{
        position: relative;
        width: 100%;
        height: 100%;
    }
    .background-container{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(50% - 100px);
    }
</style>

<style>
    .login-bg .v-responsive__sizer{
        position: absolute;
    }
    .login-bg .v-image__image{
        top: 25%;
        height: 50%;
        box-shadow:inset 0 0 0 10000px rgba(0,114,186,0.8);
        background-position: 50% bottom !important;
    }
    .a-field .v-input__icon--append i{
        font-size: 20px;
    }
</style>
