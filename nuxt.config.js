import colors from 'vuetify/es5/util/colors'
import boost from '../../boost.config'
import boost_routes from '../../boost.routes'
import serveStatic from 'serve-static';
import array_marriage from "array-marriage";
import server_config from "../../server.config";

let nuxt_config = {
    mode: 'universal',
    /*
    ** Headers of the page
    */
    head: {
        titleTemplate: '%s - ' + boost.projectName,
        title: 'Boost',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
        ],
        link: [
            // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },
    server: {
        port: 80,
        host: '0.0.0.0'
    },
    /*
    ** Customize the progress-bar color
    */
    loading: { color: '#fff' },
    /*
    ** Global CSS
    */
    css: [
    ],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        __dirname + '/plugins/boost-plugin'
    ],
    /*
    ** Nuxt.js dev-modules
    */
    buildModules: [
        '@nuxtjs/vuetify',
    ],
    /*
    ** Nuxt.js modules
    */
    modules: [
        [
            __dirname + '/modules/session',
            array_marriage({
                secret: server_config.jwt.secret,
                cookie: { maxAge: 1800000, httpOnly: false },
                rolling: true,
                resave: true,
                saveUnitialized: false,
                db_store: false
            }, ((boost.nuxt !== undefined && boost.nuxt.session !== undefined) ? boost.nuxt.session : {}))
        ]
    ],
    /*
    ** vuetify module configuration
    ** https://github.com/nuxt-community/vuetify-module
    */
    vuetify: {
        theme: {
            dark: false,
            themes: {
                light: {
                    primary: colors.teal.lighten1,
                    secondary: colors.teal.lighten1,
                    accent: colors.teal.accent1,
                    error: colors.red.accent2,
                    info: colors.blue.base,
                    success: colors.green.base,
                    warning: colors.amber.base
                },
                dark: {
                    primary: colors.teal.darken3,
                    secondary: colors.teal.darken3,
                    accent: colors.blue.darken1,
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent3
                }
            }
        }
    },
    /*
    ** Build configuration
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        extend (config, ctx) {
        }
    },
    router: {
        middleware: ['tsa'],
        extendRoutes (routes, resolve) {
            for(let path in boost_routes){
                let route = boost_routes[path];
                route.path = path;
                routes.push(route);
            }
        }
    },
    dir: {
        layouts: 'node_modules/boost/layouts',
        pages: 'node_modules/boost/pages/null',
        middleware: 'node_modules/boost/middleware',
        store: 'node_modules/boost/store'
    },
    serverMiddleware: [
        __dirname + '/api/index.js',
        {path: '/static', handler: serveStatic(__dirname + '/assets')}
    ]
};

if(boost.nuxt !== undefined){
    if(boost.nuxt.head !== undefined){
        nuxt_config.head = array_marriage(nuxt_config.head, boost.nuxt.head);
    }
    if(boost.nuxt.server !== undefined){
        nuxt_config.server = array_marriage(nuxt_config.server, boost.nuxt.server);
    }
    if(boost.nuxt.vuetify !== undefined){
        nuxt_config.vuetify = array_marriage(nuxt_config.vuetify, boost.nuxt.vuetify);
    }
}

export default nuxt_config;
