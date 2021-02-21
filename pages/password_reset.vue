<template>
    <PasswordReset :param="param"></PasswordReset>
</template>

<script>
import PasswordReset from "./../components/PasswordReset";
export default {
    components: {PasswordReset},
    name: "password_reset",
    head(){
        return {
            title: "Password Reset"
        }
    },
    asyncData(context){
        return {
            param: context.route.query
        }
    }
}
</script>

<style scoped>

</style>