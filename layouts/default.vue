<template>
    <v-app app>
        <nuxt/>
    </v-app>
</template>

<script>
    export default {
        head(){
            return {
                link: [
                    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
                ]
            }
        },
        name: "default",
        mounted() {
            if(document.cookie.match(/^(.*;)?\s*BoostDark\s*=\s*[^;]+(.*)?$/)){
                this.$vuetify.theme.dark = true;
            }
        }
    }
</script>

<style scoped>

</style>
