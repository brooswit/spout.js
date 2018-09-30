var EventEmitter = require('events');

module.exports = exports = class Session extends EventEmitter {
    constructor(nunur, id) {
        super();
        this._id = id;
        this._nunur = nunur;
        this._userView = null;
    }
    _handleEventRecieved() {

    }
    async signUp(username, passwordHash) {
        if (this._userView) return false;
        let userView = this._nunur.createUserView(username);
        if (!userView.signUp(passwordHash)) return false;
        this._userView = userView;
        return true;
    }
    async logIn(username, passwordHash) {
        if (this._userView) return false;
        let userView = this._nunur.createUserView(username);
        if (!userView.logIn(passwordHash)) return false;
        this._userView = userView;
        return true;
    }
    async logOut() {
        if (!this._userView) return false;
        await this._userView.logOut;
        this._userView = null;
        return true;
    }
    async send(targetUsername, eventName, eventData) {
        if (!this._userView) return false;
        
    }

}

// var decorateWithAccessors = require('./utils').decorateWithAccessors;
// module.exports = exports = function Session(nunur) {
//     var private = {
//         'userView': nunur.createUserView(),
//         'emitter': new EventEmitter(),
//         'friend': {},
//         'blocks' : {},
//         'subscriptions': {}
//     }

//     decorateWithAccessors(this, private, {
//         'emitter': {
//             'get': true
//         },
//         'friend': {
//             'set': (username, status)=>{
//                 if (status) {
//                     var friendView = private.friend[username] = nunur.createUserView(username);
//                     // friendView.on('logIn', handleFriendLogIn);
//                     // friendView.on('logOut', handleFriendLogOut);
//                 } else {
//                     var friendView = private.friends[username]
//                     // friendView.off('logIn', handleFriendLogIn);
//                     // friendView.off('logOut', handleFriendLogOut);
//                     delete private.friends[username];
//                 }
//             }
//         },
//         'block': {
//             'set': (username, status)=>{
//                 if (status) {
//                     private.block[username] = true;
//                 } else {
//                     delete private.block[username];
//                 }
//             }
//         },
//         'subscription': {
//             'set': (channelname, status)=>{
//                 if (status) {
//                     private.subscription[channelname] = true;
//                 } else {
//                     delete private.subscription[channelname];
//                 }
//             }
//         }
//     });

//     this.signUp = handleSignUp;
//     this.logIn  = handleLogIn;
//     this.send   = handleSend;
//     this.logOut = handleLogOut;

//     this.close = close;

//     private.userView.getEmitter().on('message', handleMessage);

//     return;

//     function handleMessage(username, message) {
//         if(username in private.blocks) {
//             return;
//         }

//         events.emit("message", username, message);
//     }

//     function handleFriendLogIn(username) {
//         handleMessage(username, "has logged in");
//     }

//     function handleFriendLogOut(username) {
//         handleMessage(username, "has logged out");
//     }

//     async function handleSignUp(username, password) {
//         return await private.userView.signUp(username, password);
//     }
    
//     function handleLogIn(username, password) {
//         return new Promise( async (reolve, reject) =>{
//             await private.userView.logIn(username, password);
//             resolve();
//         });
//     }
    
//     function handleSend(target, message) {
//         return new Promise( async (reolve, reject) =>{
//             await private.userView.send(target, message);
//             resolve();
//         });
//     }
    
//     function handleLogOut() {
//         return new Promise( async (reolve, reject) =>{
//             await private.userView.logOut();
//             resolve();
//         });
//     }

//     function close() {
//         private.userView.logOut();
//     }
// }
