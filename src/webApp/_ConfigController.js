import LDClient from 'ldclient-js'

import EventEmitterX from './lib/EventEmitterX'

let untilFlagsReady = null

const flags = LDClient.init(this._options.ldSdkKey, {
  key: 'anonymous',
  anonymous: true
})

function toBeReady (resolve) {
  const readyRef = flags.once('ready', handleEvent)
  const changeRef = flags.once('change', handleEvent)

  function handleEvent () {
    flags.off(readyRef)
    flags.off(changeRef)

    resolve()
  }
}

function resetUntilFlagsReady () {
  untilFlagsReady = new Promise(toBeReady)
}

resetUntilFlagsReady()

export default class FlagsController extends EventEmitterX {
  constructor (config, optionalDefaults) {
    super()

    this._options = {
      ldSdkKey: config.ldSdkKey || null
    }

    this._defaults = optionalDefaults ? Object.assign({}, optionalDefaults) : {}

    this.tilReady = makeTilReady()
  }

  untilReady () {
    return untilFlagsReady
  }

  get (key, optionalDefault) {
    return this.flags.variation(key, optionalDefault || this._defaults[key])
  }
  async variation (key, optionalDefault) {
    await untilFlagsReady()
    return this.flags.variation(key, optionalDefault || this._defaults[key])
  }
}
