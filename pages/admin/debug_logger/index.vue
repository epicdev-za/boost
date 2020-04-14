<template>
    <v-container class="pa-12">
        <v-card>
            <v-card-title>

            </v-card-title>
            <v-data-table :headers="table_headers" :items="table_items" multi-sort :items-per-page="itemsPerPage" :loading="loading" :server-items-length="totalItems" :options.sync="options">
                <template v-slot:item="{item}">
                    <tr :style="'background-color: ' + convertRowColor(item)">
                        <td style="white-space: nowrap;">
                            {{convertTime(item)}}
                        </td>
                        <td style="white-space: nowrap;">
                            <v-chip label :color="convertTypeColor(item).tag" :text-color="convertTypeColor(item).text">{{convertType(item)}}</v-chip>
                        </td>
                        <td style="white-space: nowrap;">
                            <v-chip label v-if="item.tags !== null">{{item.tags}}</v-chip>
                        </td>
                        <td class="overflow-message">
                            <span>{{formatMessage(item)}}</span>
                        </td>
                        <td style="white-space: nowrap;">
                            {{item.line}}
                        </td>
                        <td>
                            <v-btn rounded small icon @click="expanded = ((expanded === item.uuid) ? null : item.uuid)">
                                <v-icon>{{((expanded === item.uuid) ? "mdi-chevron-up" : "mdi-chevron-down")}}</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                    <tr v-if="expanded === item.uuid">
                        <td colspan="4" style="vertical-align: top; padding: 8px 16px; line-break: anywhere;">
                            <span class="monoblock" v-for="(message_line, key) in formatMessage(item).split('\n')" :key="key" style="display: block;">{{message_line.replace(/    +/g, '&nbsp;&nbsp;&nbsp;&nbsp;')}}</span>
                        </td>
                        <td colspan="2" style="vertical-align: top; padding: 8px 16px;">
                            <span v-for="(stack_item, key) in item.stack.split('\n')" :key="key" style="white-space: nowrap; display: block;">{{stack_item}}</span>
                        </td>
                    </tr>
                </template>
                <template v-slot:expanded-item="{ headers, item }">
                    <td :colspan="headers.length">More info about {{ item.message }}</td>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
    const axios = require("axios");
    import config from '../../../../../boost.config'
    export default {
        layout: "backend",
        head(){
            return {
                title: "Roles - Manage"
            }
        },
        data () {
            return {
                totalItems: 0,
                table_items: [],
                itemsPerPage: 15,
                project_column: false,
                loading: true,
                options: {},
                expanded: null,
                table_headers: [
                    { text: 'Time', value: 'time', align: 'left' },
                    { text: 'Type', value: 'type', align: 'left' },
                    { text: 'Tags', value: 'tags', align: 'left' },
                    { text: 'Message', value: 'message', align: 'left' },
                    { text: 'Line', value: 'line', align: 'left' },
                    { text: '', value: 'expand', align: 'right'}
                ]
            }
        },
        watch: {
            options: {
                handler(){
                    this.getLogs();
                }
            }
        },
        mounted() {
            this.getLogs();
        },
        methods: {
            convertType(item){
                switch(item.type){
                    default:
                    case 0:
                        return "DEBUG";
                    case 1:
                        return "CRON JOB";
                    case 2:
                        return "SQL";
                    case 3:
                        return "MOBILE";
                    case 4:
                        return "ERROR";
                    case 5:
                        return "EXCEPTION";
                }
            },
            convertTypeColor(item){
                switch(item.type){
                    default:
                    case 0:
                        return {tag: null, text: null};
                    case 1:
                        return {tag: "#4980a1", text: "#ffffff"};
                    case 2:
                        return {tag: "#26c48e", text: "#ffffff"};
                    case 3:
                        return {tag: "#db5edd", text: "#ffffff"};
                    case 4:
                        return {tag: "#ffb600", text: "#ffffff"};
                    case 5:
                        return {tag: "#ff5153", text: "#ffffff"};
                }
            },
            convertRowColor(item){
                switch(item.type){
                    default:
                    case 0:
                        return null;
                    case 1:
                        return "#e0e1fc";
                    case 2:
                        return "#e3ffde";
                    case 3:
                        return "#fce8fc";
                    case 4:
                        return "#fbeccf";
                    case 5:
                        return "#ffdede";
                }
            },
            formatMessage(item){
                return item.message.replace(/[\\\"]+/g, "\"");
            },
            convertTime(item){
                let a = new Date(item.time * 1000);
                let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                let year = a.getFullYear();
                let month = months[a.getMonth()];
                let date = a.getDate();
                let hour = a.getHours();
                let min = a.getMinutes();
                let sec = a.getSeconds();
                let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
                return time;
            },
            getLogs(){
                let _this = this;
                _this.loading = true;
                _this.expanded = null;
                const { sortBy, sortDesc, page, itemsPerPage } = this.options;

                axios.get("/api/admin/logs/list?page=" + page + "&itemsPerPage=" + itemsPerPage + "&sortBy=" + JSON.stringify(sortBy) + "&sortDesc=" + JSON.stringify(sortDesc)).then((response) => {
                    _this.loading = false;
                    _this.table_items = response.data.items;
                    _this.totalItems = parseInt(response.data.count);
                    _this.project_column = response.data.showProjectColumn;
                }).catch((err, obj) => {
                    _this.loading = false;
                    _this.table_items = [];
                    _this.totalItems = 0;
                    _this.project_column = false;
                    this.$store.commit('notification_store/addNotification', {
                        message: 'An error occurred. Engineers have been notified, please try again later',
                        type: 'error',
                        delay: 3
                    });
                });
            }
        }
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap');

    .v-data-table-header th{
        white-space: nowrap;
    }
    .overflow-message{
        position: relative;
        width: 100%;
    }
    .overflow-message:before{
        content: '&nbsp;';
        visibility: hidden;
    }
    .overflow-message span{
        position: absolute;
        left: 0;
        right: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 16px;
    }
    .monoblock{
        font-family: 'Roboto Mono', monospace;
    }
</style>