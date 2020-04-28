import Vue from 'vue';
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import LogoIcon from './../components/LogoIcon.vue';

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        values: {
            logo: {
                component: LogoIcon
            }
        }
    }
});