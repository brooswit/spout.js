import VueRouter from 'vue-router'

import EventEmitter from './lib/EventEmitterX'

import SpoutHome from './components/SpoutHome'
import SpoutDoc from './components/SpoutDoc'

const routerConfig = [
  {
    path: '/',
    component: SpoutHome
  }, {
    path: '/:doc',
    component: SpoutDoc
  }, {
    path: '/:doc/:branch',
    component: SpoutDoc
  /*
// TODO: PRIVATE REPO UPDATE
  }, {
    path: '/authenticate/',
    component: SpoutAuth
// TODO: COLLABORATION UPDATE
  }, {
    path: '/edit/',
    component: SpoutEdit
  }, {
    path: '/edit/:doc/',
    component: SpoutEdit
  }, {
    path: '/edit/:doc/:branch',
    component: SpoutEdit
  }, {
    path: '/review/',
    component: SpoutReview
  }, {
    path: '/review/:doc/',
    component: SpoutReview
  }, {
    path: '/review/:doc/:branch',
    component: SpoutReview
  */
  }
]

const router = new VueRouter(routerConfig)
const routerEvents = new EventEmitter()

router.afterEach((newRoute, oldRoute) => {
  for (let key in oldRoute.params) {
    if (newRoute.params.hasOwnProperty(key)) continue
    this.state[key] = undefined
    console.debug('exit: ' + key)
    routerEvents.emit('exit', key, oldRoute.params[key])
  }
  for (let key in newRoute.params) {
    if (oldRoute.params[key] === newRoute.params[key]) continue
    routerEvents.emit('update', key, oldRoute.params[key], newRoute.params[key])
    this.state[key] = newRoute.params[key]
    if (oldRoute.params.hasOwnProperty(key)) continue
    console.debug('enter: ' + key)
    routerEvents.emit('enter', key, newRoute.params[key])
  }
})

export default class RouterController extends EventEmitter {
  constructor () {
    super()
    this.router = router
    this._updateEventListenerReference = routerEvents.link('update', this)
    this._enterEventListenerReference = routerEvents.link('enter', this)
    this._exitEventListenerReference = routerEvents.link('exit', this)
  }

  close () {
    routerEvents.off(this._updateEventListenerReference)
    routerEvents.off(this._enterEventListenerReference)
    routerEvents.off(this._exitEventListenerReference)
  }
}
