<template>
    <PasswordReset></PasswordReset>
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
    }
}
</script>

<style scoped>

</style>