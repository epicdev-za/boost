module.exports = {
    state: () => ({
        token: null
    }),
    mutations: {
        setToken(state, payload) {
            console.log(session);
            state.token = payload;
        }
    }
};