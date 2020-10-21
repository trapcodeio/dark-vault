// import "@fortawesome/fontawesome-pro/css/all.css";
import "bulma";
import 'izitoast/dist/css/iziToast.css';
import "shred-bootstrap/css/utilities/spacing.css"
import "shred-bootstrap/css/utilities/shadows.css"
import "./scss/app.scss";

import Vue from 'vue';
import store from './store';
import VueIziToast from 'vue-izitoast';
import VueTrapPack from 'vue-trap-pack';
import HttpRequest from "vue-trap-pack/HttpRequest";
import App from './App.vue';
import router from './router';
import Busy from './components/Busy'
import LoadingButton from "./components/LoadingButton";

const api = new HttpRequest('/api');
window.$api = api;

Vue.config.productionTip = false;
Vue.use(VueTrapPack, {api});
Vue.use(VueIziToast, {
    position: 'topCenter'
});

// Import Components
Vue.component('Busy', Busy);
Vue.component('LoadingButton', LoadingButton);

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
