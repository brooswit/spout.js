var nextId = 0

export default class EventEmitter {
  constructor () {
    this._data = {
      events: {},
      lookup: {}
    }
  }
  link (eventName, other) {
    return this.on('eventName', other.emit)
  }
  async on (eventName, callback, context) {
    let key = nextId++
    let eventData = {key, eventName, callback, context}

    this._data = this._data || {}
    this._data.events = this._data.events || {}
    this._data.events[eventName] = this._data.events[eventName] || {triggered: false, callbacks: {}}
    this._data.events[eventName].callbacks[callback] = this._data.events[eventName].callbacks[callback] || {}
    this._data.events[eventName].callbacks[callback][context] = this._data.events[eventName].callbacks[callback][context] || {}
    this._data.events[eventName].callbacks[callback][context][key] = eventData

    this._data.lookup = this._data.lookup || {}
    this._data.lookup[key] = this._data.lookup[key] || []
    this._data.lookup[key].push(eventData)

    return key
  }

  async once (event, callback, context) {
    let eventEmitter = this
    this.on(event, () => {
      this.off(event, wrappedCallback, context, key)
    }, context)
    let key = this.on(event, wrappedCallback, context)
    function wrappedCallback () {
      eventEmitter.off(key)
      callback.apply(context, arguments)
    }
    return key
  }

  async isTriggered (eventName) {
    return this._data.events[eventName] && this._data.events[eventName].triggered
  }

  async reset (eventName) {
    if (this.isTriggered) {
      this._data.events[eventName].triggered = false
    }
  }

  async when (eventName, callback, context) {
    if (this.isTriggered(eventName)) {
      await this.emit(eventName, callback, context)
      return 0
    } else {
      return await this.once(eventName, callback, context)
    }
  }

  async emit (eventName) {
    this._data = this._data || {}
    this._data.events = this._data.events || {}

    if (!this._data.events[eventName]) return false

    let args = Array.prototype.slice.call(arguments, 1)
    let responses = []

    this._data.events[eventName].triggered = true

    for (let callback in this._data.events[eventName]) {
      for (let context in this._data.events[eventName].callbacks[callback]) {
        for (let key in this._data.events[eventName].callbacks[callback][context]) {
          let eventData = this._data.events[eventName].callbacks[callback][context][key]
          let result = eventData.callback

          if (isFunction(result) || isAsyncFunction(result)) {
            result = result.apply(eventData.context, args)
          }
          if (isPromise(result)) {
            result = await result
          }
          responses.push(result)
        }
      }
    }

    return responses
  }

  async off (key) {
    this._data = this._data || {}
    this._data.events = this._data.events || {}
    this._data.lookup = this._data.lookup || {}

    if (!this._data.lookup[key]) return false

    let {event, callback, context} = this._data.lookup[key]

    if (!this._data.events[event]) return false
    if (!this._data.events[event].callbacks[callback]) return false
    if (!this._data.events[event].callbacks[callback][context]) return false

    delete this._data.events[event][callback][context][key]
    delete this._data.lookup[key]

    return true
  }
}
