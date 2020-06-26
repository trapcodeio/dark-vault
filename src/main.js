// import "@fortawesome/fontawesome-pro/css/all.css";
import "bulma";
import "shred-bootstrap/css/utilities/spacing.css"
import "shred-bootstrap/css/utilities/shadows.css"
import "./scss/app.scss";

import Vue from 'vue';
import store from './store';
import VueTrapPack from 'vue-trap-pack';
import HttpRequest from "vue-trap-pack/HttpRequest";
import App from './App.vue';
import router from './router';
import Busy from './components/Busy'

const api = new HttpRequest('/api');
window.$api = api;

Vue.use(VueTrapPack, {api});
Vue.config.productionTip = false;

// Import Components
Vue.component('Busy', Busy);

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
