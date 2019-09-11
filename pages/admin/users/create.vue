<template>
    <v-container class="pa-12">
        <v-row justify="center">
            <v-card max-width="900" width="100%">
                <v-card-title>Create User</v-card-title>
                <v-form>
                    <v-card flat tile class="pa-5">
                        <v-row>
                            <v-col cols="12" md="12" class="py-0">
                                <v-text-field label="Username"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="12" class="py-0">
                                <v-text-field label="Password" :type="password_show ? 'text' : 'password'" :append-icon="password_show ? 'mdi-eye' : 'mdi-eye-off'" @click:append="password_show = !password_show"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6" class="py-0">
                                <v-combobox :items="roles" label="Roles" multiple chips></v-combobox>
                            </v-col>

                            <v-col cols="12" md="6" class="py-0">
                                <v-checkbox label="Active" color="primary"></v-checkbox>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-form>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn depressed to="/admin/users" exact>Cancel</v-btn>
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