import Vue from 'vue'

import Vuex from 'vuex'
import VueRouter from 'vue-router'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App'

import RouterController from './RouterController'
import StoreController from './StoreController'
import EventEmitter from './lib/EventEmitterX'

export default class AppController extends EventEmitter {
  constructor () {
    super()
    const el = '#app'
    const render = h => h(App)
    let router, store

    this.routerController = new RouterController()
    this.storeController = new StoreController()

    this.routerController.on('update', (key, oldValue, newValue) => {
      this.storeController.state[key] = newValue
    })

    this.router = router = this.routerController.router
    this.store = store = this.storeController.store
    this.vue = new Vue({el, render, router, store})
  }
}

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(Vuex)
Vue.use(VueRouter)
