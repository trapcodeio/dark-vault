import Vue from 'vue'
import HttpRequest from "vue-trap-pack/HttpRequest";
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import Config from "../config.json";
const api = new HttpRequest(Config.BACKEND_SERVER_URL);
window.$api = api;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
