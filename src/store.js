import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        config: null
    },
    mutations: {
        setConfig(state, data) {
            state.config = data;
        }
    }
});