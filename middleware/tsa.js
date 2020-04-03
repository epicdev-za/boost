module.exports = function({route, store, redirect, error}){
    if(route.path === '/login'){
        console.log(store.state.authentication_store.token);
        // error({
        //     statusCode: 403,
        //     message: 'Test'
        // });
    }
}