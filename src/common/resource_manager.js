module.exports = exports = class ResourceManager {
    constructor() {
        this._store = {};
    }

    async whenReady() {
        return true;
    }

    async exists(path) {
        await this.whenReady();
        var node = this._store;
        var route = path.slice();
        while (route.length > 0) {
            var key = route.shift();
            if (node[key] === undefined) return false;
            node = node[key];
        }
        return true;
    }

    async get(path, defaultValueOrGetter) {
        await this.whenReady();

        var node = this._store;
        var path = path.slice();

        while (path.length > 0) {
            var key = path.shift();
            try {
                node = node[key] = node[key] || {};
            } catch(e) {
                return node;
            }
        }

        return node;
    }

    async set(path, value) {
        await this.whenReady();

        var root = this._store;
        var route = path.slice();

        while (route.length > 1) {
            var key = route.shift();
            try {
                route[key] = route[key] || {};

                // test depth before 
                // TODO: Find better depth test
                route[key]['_'] = '_'; delete route[key];

                route = route[key];
            } catch(e) {
                console.debug(`ResourceManager: DESTROYED ${key}(${route['key']}`);
                route = route['key'] = {};
            }
        }
        route[route[0]] = typeof valueOrFunction === 'function' ? valueOrFunction() : valueOrFunction;

        return true;
    }
}
