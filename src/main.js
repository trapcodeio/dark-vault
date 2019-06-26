import Vue from 'vue'
import VueTrapPack from 'vue-trap-pack';
import HttpRequest from "vue-trap-pack/HttpRequest";
import App from './App.vue'
import router from './router'
// import './registerServiceWorker'
const api = new HttpRequest();
window.$api = api;

Vue.use(VueTrapPack, {api: $api});
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
