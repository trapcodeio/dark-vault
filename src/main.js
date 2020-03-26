// import "@fortawesome/fontawesome-pro/css/all.css";
import "./scss/app.scss";

import Vue from 'vue'
import VueTrapPack from 'vue-trap-pack';
import HttpRequest from "vue-trap-pack/HttpRequest";
import App from './App.vue'
import router from './router'

const api = new HttpRequest();
window.$api = api;

Vue.use(VueTrapPack, {api});

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
