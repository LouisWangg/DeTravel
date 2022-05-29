import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import GoogleMap from '@/components/GoogleMap'
import Wishlist from '@/components/Wishlist'
import Admin from '@/components/Admin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/api',
      name: 'root',
      component: GoogleMap
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/favorit',
      name: 'favorit',
      component: Wishlist
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin
    },
  ]
})
