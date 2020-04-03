module.exports = {
    state: () => ({
        token: null
    }),
    mutations: {
        setToken(state, payload) {
            state.token = payload;
        }
    }
};