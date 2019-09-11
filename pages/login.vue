<template>
    <div class="page-container">
        <div class="background-container primary"></div>
        <v-container class="fill-height">
            <v-row align="center" justify="center" class="px-4">
                <v-card max-width="550" elevation="6" class="px-12 py-4">
                    <v-row justify="center">
                        <v-card-title>
                            <v-avatar size="48" tile color="primary">
                                <img :src="logo" alt="avatar">
                            </v-avatar>
                        </v-card-title>
                    </v-row>
                    <v-row justify="center">
                        <v-card-title class="pt-0" style="text-align: center">Boost Management System</v-card-title>
                        <v-card-text style="text-align: center">v{{version}}</v-card-text>
                    </v-row>
                    <v-row justify="center">
                        <v-form v-model="valid">
                            <v-container>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <v-text-field v-model="username" :rules="usernameRules" label="Username" required autofocus></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-text-field class="a-field" v-model="password" :rules="passwordRules" label="Password" :type="password_show ? 'text' : 'password'" :append-icon="password_show ? 'mdi-eye' : 'mdi-eye-off'" @click:append="password_show = !password_show"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row justify="center" class="mt-12">
                                    <v-btn color="secondary" class="px-8">Login</v-btn>
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
    import boost from 'boost/boost.config';
    export default {
        name: "login",
        head(){
            return {
                title: "Login"
            }
        },
        data(){
            return {
                version: boost.version,
                valid: false,
                username: '',
                password: '',
                password_show: false,
                usernameRules: [
                    v => !!v || 'Username is required',
                ],
                passwordRules: [
                    v => !!v || 'Password is required'
                ]
            }
        },
        computed: {
            logo(){
                if(!this.$vuetify.theme.dark){
                    return require("boost/assets/images/login-logo-light.png");
                }else{
                    return require("boost/assets/images/login-logo-dark.png");
                }
            }
        },
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