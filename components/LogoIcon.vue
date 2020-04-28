<template>
    <svg :style="style" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="folder" version="1.1" viewBox="0 0 24 24" x="0px" y="0px" xml:space="preserve">
<g>
	<path d="M20,22H4c-1.654,0-3-1.346-3-3V5c0-1.654,1.346-3,3-3h5c0.334,0,0.646,0.167,0.832,0.445L11.535,5H20c1.654,0,3,1.346,3,3   v11C23,20.654,21.654,22,20,22z M4,4C3.449,4,3,4.449,3,5v14c0,0.552,0.449,1,1,1h16c0.552,0,1-0.448,1-1V8c0-0.551-0.448-1-1-1h-9   c-0.334,0-0.646-0.167-0.832-0.445L8.465,4H4z"></path>
</g>
</svg>
</template>

<script>
    export default {
        name: "LogoIcon",
        computed: {
            style(){
                if(!this.$vuetify.theme.dark){
                    return "fill: " + this.$vuetify.theme.defaults.light.primary;
                }else{
                    return "fill: " + this.$vuetify.theme.defaults.dark.primary;
                }
            }
        }
    }
</script>

<style scoped>

</style>