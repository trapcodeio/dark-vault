import Vue from 'vue'
import Router from 'vue-router'
import View from './vues/View';
import List from './vues/List'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      name: 'list',
      path: '/',
      component: List,
    },
    {
      name: 'file',
      path: '/file/:file_path',
      component: View,
    }
  ]
})
