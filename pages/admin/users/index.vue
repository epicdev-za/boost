<template>
    <v-container class="pa-12">
        <v-card>
            <v-card-title>
                Manage Users
                <v-spacer></v-spacer>
                <v-btn depressed to="/admin/users/create">
                    <v-icon small class="mr-2">mdi-plus</v-icon>
                    Create User
                </v-btn>
            </v-card-title>
            <v-data-table :headers="table_headers" :items="table_items" multi-sort :items-per-page="15">
                <template v-slot:item.active="{item}">
                    <v-icon>{{convertActiveToIcon(item)}}</v-icon>
                </template>
                <template v-slot:item.actions="{item}">
                    <v-menu origin="right top" transition="scale-transition" bottom left>
                        <template v-slot:activator="{on}">
                            <v-btn icon small v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <v-list dense>

                                <v-list-item link>
                                    <v-list-item-icon>
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Edit</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-list-item link>
                                    <v-list-item-icon>
                                        <v-icon>mdi-delete</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Delete</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>

                            </v-list>
                        </v-card>
                    </v-menu>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
    export default {
        layout: "backend",
        head(){
            return {
                title: "Users - Manage"
            }
        },
        data () {
            return {
                table_headers: [
                    { text: 'Username', value: 'username', align: 'left' },
                    { text: 'Active', value: 'active', align: 'center' },
                    { text: 'Actions', value: 'actions', align: 'center', sortable: false }
                ],
                table_items: [

                ],
            }
        },
        methods: {
            convertActiveToIcon(item){
                if(item.active){
                    return 'mdi-check'
                }else{
                    return 'mdi-close'
                }
            }
        }
    }
</script>

<style scoped>

</style>