<template>
    <v-container class="cont">
        <div class="alert-container">

            <div class="alert-holder">
                <v-alert type="success" dense dismissible>
                    I'm a success alert.
                </v-alert>
            </div>

            <div class="alert-holder">
                <v-alert type="error" dense dismissible>
                    I'm a success alert. Aa
                </v-alert>
            </div>

            <div class="alert-holder">
                <v-alert type="warning" dense dismissible>
                    I'm a success alert. atastastast
                </v-alert>
            </div>

            <div class="alert-holder">
                <v-alert type="info" dense dismissible>
                    I'm a success alert.
                </v-alert>
            </div>

        </div>
    </v-container>
</template>

<script>
    export default {
        name: "Notifications"
    }
</script>

<style scoped>
    .cont{
        position: absolute !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        pointer-events: none;
    }
    .cont .alert-container{
        text-align: center;
        pointer-events: none;
    }
    .cont .v-alert{
        display: inline-block;
        pointer-events: all;
    }
</style>