<template>
    <div class="page-container">
        <div class="background-container primary"></div>
        <v-container class="fill-height">
            <v-row align="center" justify="center" class="px-4">
                <v-card width="550" min-height="300" elevation="6">
                    <v-tabs-items v-model="tab">
                        <v-tab-item>
                            <slot name="heading">
                                <v-row justify="center" class="pt-8">
                                    <v-card-title style="text-align: center; word-break: keep-all;">Forgot Password?</v-card-title>
                                    <v-card-text style="text-align: center">Enter the username or email address associated with your account.</v-card-text>
                                </v-row>
                            </slot>
                            <v-row justify="center" class="pt-4">
                                <v-alert type="error" dense text dismissible class="mb-0" :value="forgotPasswordError" v-model="forgotPasswordError">
                                    {{forgotPasswordErrorText}}
                                </v-alert>
                            </v-row>
                            <v-row justify="center" class="pb-8">
                                <v-form style="width: 100%;" class="px-12">
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" md="12">
                                                <v-text-field v-model="forgotPasswordUsername" :rules="usernameRules" label="Username" required autofocus></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row justify="center" class="mt-12">
                                            <v-btn class="px-8 mx-4" depressed nuxt :to="'/login'">Cancel</v-btn>
                                            <v-btn color="secondary" class="px-8 mx-4" depressed @click="processForgotPassword(forgotPasswordUsername)" :disabled="forgotPasswordUsername.length === 0">Next</v-btn>
                                        </v-row>
                                    </v-container>
                                </v-form>
                            </v-row>
                        </v-tab-item>
                        <v-tab-item>
                            <v-row justify="center" align="center" style="min-height: 300px;">
                                <v-progress-circular size="64" indeterminate color="grey lighten-1"></v-progress-circular>
                            </v-row>
                        </v-tab-item>
                        <v-tab-item>
                            <slot name="success">
                                <v-row justify="center" class="pt-8">
                                    <v-card-title style="text-align: center; word-break: keep-all;">Sent</v-card-title>
                                    <v-card-text style="text-align: center; padding: 0px 30px;">Please check your email inbox associated to the address you used to sign up. You will receive an email with a recovery link.</v-card-text>
                                </v-row>
                            </slot>
                            <v-row justify="center" class="pb-8">
                                <v-form style="width: 100%;" class="px-12">
                                    <v-container>
                                        <v-row justify="center" class="mt-12">
                                            <v-btn class="px-8 mx-4" depressed nuxt :to="'/login'">Back to Login</v-btn>
                                        </v-row>
                                    </v-container>
                                </v-form>
                            </v-row>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </v-row>
        </v-container>
    </div>
</template>

<script>
const axios = require("axios");
export default {
    name: "PasswordRecovery",
    data(){
        return {
            tab: 0,
            usernameRules: [
                v => !!v || 'Email Address is required',
                value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid Email Address.'
                }
            ],
            forgotPasswordUsername: '',
            forgotPasswordError: false,
            forgotPasswordErrorText: ''
        }
    },
    methods: {
        processForgotPassword(username){
            let _this = this;
            if(username.length > 0){
                _this.tab = 1;
                axios.post("/api/auth/password-recovery", {username: username}).then((response) => {
                    _this.tab = 2;
                }).catch((error, obj) => {
                    _this.tab = 0;
                    if(!error.response){
                        error.response = {
                            status: 500
                        };
                    }
                    switch(error.response.status){
                        default:
                        case 500:
                            _this.forgotPasswordError = true;
                            _this.forgotPasswordErrorText = "Failed to connect to authentication server";
                            break;
                        case 400:
                            switch(error.response.data.error){
                                default:
                                    _this.forgotPasswordError = true;
                                    _this.forgotPasswordErrorText = "Invalid credentials";
                                    break;
                                case "unable_to_mail":
                                    _this.forgotPasswordError = true;
                                    _this.forgotPasswordErrorText = error.response.data.error_description;
                                    break;
                            }
                            break;
                    }
                });
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