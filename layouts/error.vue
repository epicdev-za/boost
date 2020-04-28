<template>
    <v-app app class="background">
        <div class="top-bar primary">
            <h1 class="error-header">{{error.statusCode}}</h1>
        </div>
        <div class="bottom-bar">
            <v-row justify="center">
                <v-card elevation="0" class="pa-12">
                    <v-card-title style="text-align: center; word-break: keep-all;">{{header}}</v-card-title>
                    <v-card-text style="text-align: center; word-break: keep-all;">{{subheader}}</v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" x-large class="px-12" style="margin: 0px auto; margin-top: 36px; margin-bottom: 18px" @click="btnFunction">{{button_text}}</v-btn>
                    </v-card-actions>
                </v-card>
            </v-row>
        </div>
    </v-app>
</template>

<script>
    const axios = require("axios");
    export default {
        layout: 'empty',
        props: {
            error: {
                type: Object,
                default: null
            }
        },
        head () {
            return {
                title: (() => {
                    switch(this.error.statusCode){
                        case 404:
                            return "404 Not Found";
                        case 403:
                            return "403 Permission Denied";
                        default:
                            return "500 An error occurred";
                    }
                })()
            }
        },
        data(){
            return {
                headers: {
                    '404': 'It looks like the resource you are looking for does not exist',
                    '403': 'You are not authenticated'
                },
                subheaders: {
                    '404': 'Please go back and try take another route',
                    '403': 'Please go back and log in'
                },
                logged_in: false
            }
        },
        methods: {
            btnFunction(){
                if(this.error.statusCode === 403){
                    this.$router.push("/login");
                }else{
                    this.$router.back();
                }
            }
        },
        computed: {
            header(){
                return (this.headers[this.error.statusCode] !== undefined) ? this.headers[this.error.statusCode] : "An error occurred";
            },
            subheader(){
                if(this.error.statusCode === 403 && this.logged_in) return this.subheaders[404];
                return (this.subheaders[this.error.statusCode] !== undefined) ? this.subheaders[this.error.statusCode] : "Please try again later";
            },
            button_text(){
                return (this.error.statusCode === 403 && !this.logged_in) ? "Login" : "Go Back";
            }
        },
        mounted(){
            let _this = this;
            axios.get("/api/auth/logged_in").then((response) => {
                if(response.data.success){
                    _this.logged_in = true;
                }
            });
        }
    }
</script>

<style scoped>
    .background{
        background-color: #ffffff !important;
    }
    .top-bar{
        height: 33%;
        position: relative;
        min-height: 220px;
    }
    .bottom-bar{
        height: 66%;
        position: relative;
    }
    .error-header{
        position: absolute;
        width: 100%;
        text-align: center;
        bottom: -110px;
        font-size: 256px;
        color: #ffffff;
        z-index: 100;
    }

    .theme--dark .background{
        background-color: #1E1E1E !important;
    }
    .theme--dark .error-header{
        color: #1E1E1E !important;
    }

    @media only screen and (max-width: 450px) {
        .error-header{
            font-size: 196px;
            bottom: -80px;
        }
    }
</style>
