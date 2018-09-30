var decorateWithAccessors = require('./utils').decorateWithAccessors;

module.exports = exports = class ResourceView {
    constructor(parent, path) {
        if (parent === undefined || path === undefined) {
            throw "expects two arguments";
        }

        this._path = parent._path ? (parent._path).concat(path) : path;
        this._manager = parent._manager ? parent._manager : parent;
    }

    async whenReady() {
        return true;
    }

    async exists(path) {
        await this.whenReady();
        return await this._manager.exists(path ? this._path.concat(path) : this._path);
    }

    async get(path) {
        await this.whenReady();
        return await this._manager.get(path ? this._path.concat(path) : this._path);
    }

    async set(pathOrValue, valueOrNothing) {
        if (pathOrValue === undefined) {
            throw "expects at least one argument";
        } else if (valueOrNothing === undefined) {
            valueOrNothing = pathOrValue;
            pathOrValue = undefined;
        }

        let path = this.getPath().concat(pathOrValue || []);
        let value = valueOrNothing;

        await this.whenReady();
        return await this._manager.set(path ? this._path.concat(path) : this._path, value);
    }
}
