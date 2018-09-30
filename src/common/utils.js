let nextId = 0

module.exports = exports = {
  capitalizeFirstChar,
  isFunction,
  isAsyncFunction,
  isPromise,
  isAwaitable,
  // decorateWithAccessors,
  // decorateWebSocketServer,
  CommandRegistry,
  EventEmitter
}

function EventEmitter () {
  this._data = {
    events: {},
    lookup: {}
  }
};

EventEmitter.prototype.on = function (eventName, callback, context) {
  return (async () => {
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
  })()
}

EventEmitter.prototype.once = function (event, callback, context) {
  return (async () => {
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
  })()
}

EventEmitter.prototype.isTriggered = function (eventName) {
  return (async () => {
    return this._data.events[eventName] && this._data.events[eventName].triggered
  })()
}

EventEmitter.prototype.reset = function (eventName) {
  return (async () => {
    if (this.isTriggered) {
      this._data.events[eventName].triggered = false
    }
  })()
}

EventEmitter.prototype.when = function (eventName, callback, context) {
  return (async () => {
    if (this.isTriggered(eventName)) {
      await this.emit(eventName, callback, context)
      return 0
    } else {
      return await this.once(eventName, callback, context)
    }
  })()
}

EventEmitter.prototype.emit = function (eventName) {
  return (async () => {
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
  })()
}

EventEmitter.prototype.off = function (key) {
  return (async () => {
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
  })()
}

EventEmitter.ify = (Thing) => {
  Thing.prototype.on = EventEmitter.prototype.on
  Thing.prototype.once = EventEmitter.prototype.once
  Thing.prototype.when = EventEmitter.prototype.when
  Thing.prototype.emit = EventEmitter.prototype.emit
  Thing.prototype.off = EventEmitter.prototype.off
}

function capitalizeFirstChar (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function isFunction (thing) {
  return thing.constructor === Function
}

AsyncFunction = (async () => {}).constructor
function isAsyncFunction (thing) {
  return thing.constructor === AsyncFunction
}

function isPromise (thing) {
  return thing.constructor === Promise
}

function isAwaitable (thing) {
  return isAsyncFunction(thing) || isPromise(thing)
}

// function decorateWithAccessors(public, private, rules) {
//     for (var attribute in rules) {
//         (()=>{
//             var context = {
//                 attribute: attribute,
//                 rule: rules[attribute],
//                 capitalizedAttribute: capitalizeFirstChar(attribute),
//             }
//             if(context.rule['get']) {
//                 public['get' + context.capitalizedAttribute] = isFunction(context.rule['get'])
//                     ? context.rule['get']
//                     : function(){ return private[context.attribute] } ;
//             }
//             if (context.rule['set']) {
//                 public['set' + context.capitalizedAttribute] = isFunction(context.rule['set'])
//                     ? context.rule['set']
//                     : function(value){ private[context.attribute] = value; };
//             }
//         })();
//     }
// }

// function decorateWebSocketServer(wss) {
//     wss.broadcast = function broadcast(data) {
//         wss.clients.forEach( (client) => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(data);
//             }
//         });
//     };
//     return wss;
// };

function CommandRegistry () {
  var cmds = {}

  this.trigger = trigger
  this.register = register

  function trigger (cmdName, message) {
    if (!cmds[cmdName]) {
      console.log(`unknown command: "${cmdName}" with message: "${message}"`)
    } else {
      return cmds[cmdName](message)
    }
  }

  function register (cmdName, func) {
    cmds[cmdName] = func
  }
}
