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
        name: "default"
    }
</script>

<style scoped>

</style>