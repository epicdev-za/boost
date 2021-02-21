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
                                    <v-card-title style="text-align: center; word-break: keep-all;">Reset Password</v-card-title>
                                    <v-card-text style="text-align: center">Enter your new password below.</v-card-text>
                                </v-row>
                            </slot>
                            <v-row justify="center" class="pt-4">
                                <v-alert type="error" dense text dismissible class="mb-0" :value="passwordResetError" v-model="passwordResetError">
                                    {{passwordResetErrorText}}
                                </v-alert>
                            </v-row>
                            <v-row justify="center" class="pb-8">
                                <v-form style="width: 100%;" class="px-12">
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" md="12">
                                                <v-text-field class="a-field" v-model="password" :rules="passwordRules" label="Password" :type="password_show_1 ? 'text' : 'password'" :append-icon="password_show_1 ? 'mdi-eye' : 'mdi-eye-off'" @click:append="password_show_1 = !password_show_1"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="12">
                                                <v-text-field class="a-field" v-model="confirm_password" v-on:keyup="fieldEnterPress" :rules="confirmPasswordRules" label="Confirm Password" :type="password_show_2 ? 'text' : 'password'" :append-icon="password_show_2 ? 'mdi-eye' : 'mdi-eye-off'" @click:append="password_show_2 = !password_show_2"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row justify="center" class="mt-12">
                                            <v-btn color="primary" depressed class="px-8" @click="reset" :disabled="password.length === 0 || confirm_password.length === 0 || confirm_password !== password">Reset</v-btn>
                                        </v-row>
                                    </v-container>
                                </v-form>
                            </v-row>
                        </v-tab-item>
                        <v-tab-item>
                            <v-row justify="center" align="center" style="min-height: 400px;">
                                <v-progress-circular size="64" indeterminate color="grey lighten-1"></v-progress-circular>
                            </v-row>
                        </v-tab-item>
                        <v-tab-item>
                            <slot name="success">
                                <v-row justify="center" class="pt-8">
                                    <v-card-title style="text-align: center; word-break: keep-all;">Reset Complete</v-card-title>
                                    <v-card-text style="text-align: center; padding: 0px 30px;">Your new password is now active. You may now head back to the login screen to gain access to your account.</v-card-text>
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
                        <v-tab-item>
                            <slot name="success">
                                <v-row justify="center" class="pt-8">
                                    <v-card-title style="text-align: center; word-break: keep-all;">Invalid Link</v-card-title>
                                    <v-card-text style="text-align: center; padding: 0px 30px;">The reset link you have used it no longer valid. Please go back to Password Recovery to request a new link.</v-card-text>
                                </v-row>
                            </slot>
                            <v-row justify="center" class="pb-8">
                                <v-form style="width: 100%;" class="px-12">
                                    <v-container>
                                        <v-row justify="center" class="mt-12">
                                            <v-btn class="px-8 mx-4" depressed nuxt :to="'/password-recovery'">Password Recovery</v-btn>
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
    name: "PasswordReset",
    props: {
        param: {
            required: true
        }
    },
    data(){
        return {
            tab: (this.param.r === undefined || (this.param.r !== undefined && !this.param.r.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/))) ? 3 : 1,
            passwordResetError: false,
            passwordResetErrorText: '',
            password: '',
            confirm_password: '',
            password_show_1: false,
            password_show_2: false,
            passwordRules: [v => !!v || 'Password is required'],
            confirmPasswordRules: [
                v => !!v || 'Confirm Password is required',
                v => v === this.password || 'Does not match'
            ]
        }
    },
    methods: {
        fieldEnterPress(e){
            if(e.keyCode === 13){
                this.reset();
            }
        },
        reset(){
            this.tab = 1;

            if(this.password.length > 0 && this.confirm_password === this.password){
                axios.post("/api/auth/reset-password", {uuid: this.param.r, password: this.password}).then((res) => {
                    if(res.data.success){
                        this.tab = 2;
                    }
                }).catch((error) => {
                    this.tab = (error.response.data.error === "invalid_request") ? 3 : 0;
                    this.passwordResetError = true;
                    this.passwordResetErrorText = "An error occurred. Engineers have been notified";
                });
            }
        }
    },
    mounted(){
        if(this.param.r !== undefined && this.param.r.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/)){
            axios.post("/api/auth/validate-password-recovery", {uuid: this.param.r}).then((res) => {
                if(res.data.valid){
                    this.tab = 0;
                }else{
                    this.tab = 3;
                }
            }).catch((error) => {
                this.tab = (error.response.data.error === "invalid_request") ? 3 : 0;
                this.passwordResetError = true;
                this.passwordResetErrorText = "An error occurred. Engineers have been notified";
            });
        }else{
            this.tab = 3;
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