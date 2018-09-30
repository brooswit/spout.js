var EventEmitter = require('events');
module.exports = exports = class UserView {
  constructor(nunur, username) {
    this._nunur = nunur;
    this._username = username;
    this._authenticated = false;
    this._resourceView = nunur.createResourceView(['users', username]);
  }

  async _handleMessage(originUsername, message) {
    this.emit('message', originUsername, message);
  }

  async signUp(passwordHash) {
    if (this._authenticated) return false;
    if (this._resourceView.exists()) return false;
    this._resourceView.set({username, passwordHash});
    this._resourceView.on('message', this._handleMessage);
    this._authenticated = true;
    return true;
  }

  async logIn(passwordHash) {
    if (this._authenticated) return false;
    if (!this._resourceView.exists()) return false;
    if (!this._resourceView.get('passwordHash') === passwordHash) return false;
    this._resourceView.on('message', this._handleMessage);
    this._authenticated = true;
    return true;
  }

  async logOut() {
    if (!this._authenticated) return false;
    this._resourceView.off('message', this._handleMessage);
    this._authenticated = false;
    return true;
  }

  async sendEvent(targetUsername, eventName, eventData) {
    if (!this._authenticated) return false;
    let targetUserResourceView = this._nunur.createResourceView('users', targetUsername);
    targetUserResourceView.emit('event_recieved', {
      originUserName: this._userName,
      eventName, eventData
    });
    return true;
  }
}

// var decorateWithAccessors = require('./utils').decorateWithAccessors;

// module.exports = exports = function UserView(nunur, username, password, key) {
//   var private = {
//     'emitter':       new EventEmitter(),
//     'authenticated': false,
//     'resourceView':  null,
//     'username':      "",
//     'password':      password,
//     'key':           key
//   };

//   decorateWithAccessors(this, private, {
//     'username': {
//       'set': async (username) => {
//         if (username === private.username) {
//           return;
//         }

//         this.setAuthenticated(false);
//         private.username = username;

//         if (private.resourceView !== null) {
//           await private.resourceView.close();
//         }

//         private.resourceView = nunur.createResourceView(["users", username]);
//       }
//     },
//     'authenticated': {
//       'get': true,
//       'set': (status) => {
//         if (status == private.authenticated) {
//           return;
//         }

//         private.authenticated = status == true;

//         if (status) {
//           private.resourceView.getEmitter().on('message', handleMessage);
//         } else {
//           private.resourceView.getEmitter().off('message', handleMessage);
//         }
//       }
//     },
//     'emitter': {
//         'get': true
//     },
//     'resourceView': {
//         'get': true
//     }
//   });

//   this.setUsername(username);

//   this.signUp = signUp;
//   this.logIn = logIn;
//   this.send = send;
//   this.logout = logout;

//   return;

//   function updateUser() {
//     return new Promise( async(resolve, reject) => {

//     });
//   }

//   function handleMessage(username, message) {
//     events.emit("message", username, message);
//   }

//   async function signUp(username, password) {
//     if (this.getAuthenticated()) {
//       return false;
//     }

//     this.setUsername(username);

//     if (!private.resourceView || await private.resourceView.exists()) {
//       return false;
//     }

//     await private.resourceView.set({ username, password });
//     this.setAuthenticated(true);

//     return true;
//   }

//   function logIn(username, password) {
//     return new Promise(async (resolve, reject) => {
//       if (this.getAuthenticated()) {
//         return reject();
//       }

//       this.setUsername(username);

//       if (!await private.resourceView.exists()) {
//         return reject();
//       }
//       if (password === await private.resourceView.get('password')) {
//         return reject();
//       }
      
//       this.setAuthenticated(true);

//       resolve();      
//     })
//   }

//   function logout() {
//     return new Promise(async (resolve, reject) => {
//       if (!this.getAuthenticated()) {
//         return reject();
//       }

//       private.resourceView.getEmitter().off('message', handleMessage);
      
//       this.setAuthenticated(false);

//       resolve();
//     });
//   }

//   function send(target, message) {
//     return new Promise(async (resolve, reject) => {
//       if (!this.getAuthenticated()) {
//         return reject();
//       }

//       resourceManager.get('users', target).getEmitter().emit('message', username, message);
//       resolve();
//     });
//   }
// };
