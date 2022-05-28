// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import { sync } from 'vuex-router-sync'
import 'vuetify/dist/vuetify.min.css'
import store from '@/store/store'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.config.productionTip = false

sync(store, router)

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCJYr_1WvHqs1TKh52J6wflFhGfyqZ8PXA',
    libraries: 'places',
  }
});

Vue.use(Vuetify)

/* eslint-disable no-new */
new Vue({
  vuetify: new Vuetify(),
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
