# Boost
Boost is an open-source nuxt.js based framework designed to unify development of advanced web-systems.

---

### Contribution
All contributions must be done on a fork of the highest x.x branch available. Any changes made to master will be rejected.

If you are an internal contributor then there is no need to fork. Make the changes directly on the highest x.x branch.

---

### Installation

Prerequisites:
You will need a new nuxt.js project already setup.

**Node.js 12 is required**

Run the following script to install:
```sh
npm install --save github.com:epicdev-za/boost
```

Change your **nuxt.config.js** file to match the following:
```js
import nuxt_config from "boost/nuxt.config";
export default nuxt_config;
```

Create the following files in your projects root directory.

Create a **server.config.js** file using the following format:
```js
const array_marriage = require("array-marriage");
const gravity_config = require("boost/server.config");

let config = {
    db: {
        database: '',
        host: '',
        user: '',
        password: ''
    },
    jwt: {
        secret: ''
    },
    sanctum: {
        project_key: ''
    },
    endpoints: {} //Refer to Documentation to setup endpoints
};

module.exports = array_marriage(gravity_config, config);
```

Create a **boost.config.js** file using the following format:
```js
const array_marriage = require("array-marriage");
const boost_config = require("boost/boost.config");

const config = {
    projectName: "",
    nuxt: {
        head: {
            title: ""
        }
    },
    modules: {}, //Refer to Documentation to setup modules
    module_groups: {} //Refer to Documentation to setup module_groups
};

export default array_marriage(boost_config.default, config);
```

Create a **boost.routes.js** file using the following format:
```js
import path from 'path'
const array_marriage = require("array-marriage");
const boost_routes = require("boost/boost.routes");

const resolve = function(vue){
    return path.join(__dirname, vue);
};

const routes = { //Refer to Documentation to setup routes
    '/': {
        name: 'Home',
        component: resolve('./pages/index');
    }
};

export default array_marriage(boost_routes.default, routes);
```

Lastly delete the **layouts** & **middleware** directory as these are handled by boost.

---

### Documentation

##### Front-end Routes
1. Create your Vue page components inside preferrably the pages directory.
2. Add the following to the **boost.routes.js** file inside the **routes** const.
```js
'/your/url/structure': {
    name: 'Page Name',
    component: resolve('./path/to/page/component'),
    permissions: ['any.permissions.needed'] //This is optional
}
```

##### Loading custom modules onto the dashboard
1. Create your landing page url with its necessary permissions.
2. Add the following to the **boost.config.js** file inside the **modules** key.
```js
'module_uri': {
    title: "Module Title",
    description: "Short description on what module is for",
    icon: "mdi-icon",
    to_prefix: "/admin",
    tag: "beta/in dev/etc", //Optional
    tag_color: "#000000", //Can use vuetify color library by importing it
    create_btn: false //If you want a quick-link to the create page
}
```

Modules can also be grouped by configuring the module_groups as follows:
```js
'Your Module Group Name':{
    title: "Your Module Group Name",
    modules: [
        'module_uri_1',
        'module_uri_2',
        'module_uri_3'
    ]
}
```

##### Creating back-end endpoints
To create a back-end endpoint available on the /api prefix. Configure the **server.config.js** file as follows:
```js
...
endpoints: {
    'dir1': {
        children: {
            'dir2': {
                children: {
                    'endpoint1': { //Url will equate to /api/dir1/dir2/endpoint1
                        method: "get",
                        handler: require("./api/endpoints/your_file/etc")
                    }
                }
            }
        }
    },
    'endpoint2': { //Url will equate to /api/endpoint2
        method: "post",
        handler: require("./api/endpoints/your_file/etc")
    },
    'endpoint3': { //An endpoint can have multiple HTTP methods by configuring it like so
        methods: [
            {
                method: "get",
                handler: require("./api/endpoints/multimethod/get")
            },
            {
                method: "post",
                handler: require("./api/endpoints/multimethod/post")
            }
        ]
    }
}
...
```

---

### Support Disclaimer
This library is intended for internal use at Epicdev. It has been made open-source to avoid "proprietary" conflicts with clients wanting their projects source code. We offer no support to anyone who is not an Epicdev Developer.
