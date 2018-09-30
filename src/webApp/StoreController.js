import getGitHubContent from './lib/getGitHubContent'
import Vuex from 'vuex'
import _ from 'underscore'
import EventEmitter from './lib/EventEmitterX'

const mutations = {
  // setTargetPath (state, newTargetPath) {
  //   console.log('setting target path', newTargetPath)
  //   state.targetPath = newTargetPath
  // }
  storeInit (state, initData) {
    state.account = initData.account
    state.repository = initData.repository
    state.branch = initData.branch
  },
  storeSpout (state, spoutData) {
    console.log(typeof spoutData)
    state.name = spoutData.settings.name || 'spout.js'
    state.rootDoc = spoutData.settings.rootDoc || 'root'
    state.docs = spoutData.doc
  },
  storeDoc (state, newDoc) {

  }
}

const getters = {
  getSpoutRequest (state) {
    return {
      account: state.account,
      repository: state.repository,
      branch: state.branch,
      path: ['spout.json']
    }
  },
  getDocRequest (state, getters) {
    return {
      account: state.account,
      repository: state.repository,
      branch: state.branch,
      path: [getters.getCurrentDoc]
    }
  },
  getCurrentDoc (state) {
    return state.currentDocKey
  }
}

const initPromise = new Promise((resolve) => {
  var xmlHttp = new XMLHttpRequest()
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      resolve(JSON.parse(xmlHttp.responseText))
    }
  }
  xmlHttp.open('GET', '/init.json', true)
  xmlHttp.send(null)
})

function getInit () {
  return initPromise
}

const actions = {
  async init ({getters, commit, dispatch}) {
    commit('storeInit', await getInit())
    await dispatch('fetchSpout')
  },
  async fetchSpout ({getters, commit, dispatch}) {
    commit('storeSpout', JSON.parse(await getGitHubContent(getters.getSpoutRequest)))
    await dispatch('fetchDoc')
  },
  async fetchDoc ({getters, commit}) {
    commit('storeDoc', await getGitHubContent(getters.getDocRequest))
  }
}

function upperCaseFirst (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default class StoreController extends EventEmitter {
  constructor () {
    super()
    const storeConfig = {
      state: {
        account: '',
        repository: '',
        branch: '',
        currentDocKey: '',
        name: 'Spout.js',
        rootDoc: 'root',
        docs: {}
      },
      mutations,
      getters,
      actions
    }

    this.store = new Vuex.Store(storeConfig)

    this.on('update', (key, oldValue, newValue) => {
      console.log({key, oldValue, newValue})
      switch (key) {
        case 'account':
        case 'repository':
        case 'branch':
          this.store.dispatch('fetchSpout')
          break

        case 'spoutData':
        case 'currentDoc':
          this.store.dispatch('fetchDoc')
          break

        case 'docData':
          this.store.dispatch('fetchAllDocs')
          break

        default:
          console.debug('unhandled update for ' + key)
          break
      }
    })

    for (let key in this.store.state) {
      (function () {
        let prevValue
        this.store.watch((state) => {
          return state[key]
        }, () => {
          const currentValue = this.store.state[key]
          console.log('update', {key, prevValue, currentValue})
          this.emit('update', key, prevValue, currentValue)
          prevValue = currentValue
        }, {
          immediate: true
        })
      }).call(this)
    }

    this.store.dispatch('init')
  }
}
