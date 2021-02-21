<template>
    <PasswordRecovery></PasswordRecovery>
</template>

<script>
import PasswordRecovery from "./../components/PasswordRecovery";
export default {
    components: {PasswordRecovery},
    name: "password_recovery",
    head(){
        return {
            title: "Password Recovery"
        }
    }
}
</script>

<style scoped>

</style>