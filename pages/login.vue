<template>
    <Login></Login>
</template>

<script>
import Login from '../components/Login';
export default {
    name: "login",
    components: {Login},
    head(){
        return {
            title: "Login"
        }
    }
}
</script>