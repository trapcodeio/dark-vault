import Vue from 'vue'
import Router from 'vue-router'
import Index from './vues/Index';
import View from './vues/View';
import List from './vues/List'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      name: 'index',
      path: '/',
      component: Index,
    },
    {
      name: 'file',
      path: '/file/:file_path',
      component: View,
    },
    {
      name: 'folder',
      path: '/folder/:folder_path',
      component: List,
    }
  ]
})
