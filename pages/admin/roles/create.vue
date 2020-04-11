<template>
    <v-container class="pa-12">
        <v-row justify="center">
            <v-card max-width="900" width="100%">
                <v-card-title>{{(uuid !== undefined) ? "Edit" : "Create"}} Role</v-card-title>
                <v-form>
                    <v-card flat tile class="pa-5">
                        <v-row>
                            <v-col cols="12" md="12" class="py-0">
                                <v-text-field label="Name"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6" class="py-0">
                                <v-combobox :items="roles" label="Roles" multiple chips></v-combobox>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-form>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn depressed to="/admin/roles" exact>Cancel</v-btn>
                    <v-btn depressed>Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        layout: "backend",
        head(){
            return {
                title: "Users - Create"
            }
        },
        data(){
            return {
                uuid: this.$route.query.uuid,
                password_show: false,
                roles: [
                    "Administrator",
                    "Client",
                    "Support",
                    "Marketing"
                ]
            }
        }
    }
</script>

<style scoped>

</style>