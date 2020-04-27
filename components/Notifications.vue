<template>
    <v-container class="cont">
        <div class="alert-container">

            <div v-for="(notification, key) in notifications" class="alert-holder">
                <v-alert :type="notification.type" dense dismissible border="left">
                    {{notification.message}}
                    <template v-slot:close>
                        <v-btn icon rounded small class="v-alert__dismissible" @click="removeNotification(key)">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </template>
                </v-alert>
            </div>

        </div>
    </v-container>
</template>

<script>
    export default {
        name: "Notifications",
        computed: {
            notifications(){
                return this.$store.state.boost_store.notifications;
            }
        },
        methods: {
            removeNotification(index){
                this.$store.commit('boost_store/removeNotification', index);
            }
        },
        mounted() {
            let _this = this;
            if(_this.$store.state.boost_store.notificationRemoveInterval !== null){
                clearInterval(_this.$store.state.boost_store.notificationRemoveInterval);
            }
            this.$store.commit('boost_store/setNotificationRemoveInterval', setInterval(function(){
                let current_time = Math.round(new Date().getTime()/1000);
                let removals = [];
                for(let i = 0; i < _this.notifications.length; i++){
                    let notif = _this.notifications[i];
                    if((notif.time_created + notif.delay) < current_time){
                        removals.push(i);
                    }
                }
                for(let i = 0; i < removals.length; i++){
                    _this.$store.commit('boost_store/removeNotification', removals[i]);
                }
            }, 100));
        }
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
        z-index: 201;
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