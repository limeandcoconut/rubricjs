let registryKey = Symbol();

class EntityFactory {
    constructor() {
        this[registryKey] = new Map();
    }

    registerConstructor(entityName, entityConstructor) {
        if (typeof entityName !== 'string' || typeof entityConstructor !== 'function' ) {
            throw new TypeError(`Parameters must be types string, function. ${typeof entityName}, ${typeof entityConstructor} given.`);
        }
        entityName = entityName.charAt(0).toUpperCase() + entityName.slice(1);
        this[registryKey].set(entityName, entityConstructor);
    }
}

let facoryHelper = {
    get: function(target, key) {
        let matches;
        let entityName;
        if (typeof key !== 'string') {
            return target[key];
        }

        matches = key.match(/^create((?:[A-Z][a-z]*)+)$/);
        entityName = matches ? matches[1] : null;

        if (!entityName) {
            return target[key];
        }

        const originalMethod = target[registryKey].get(entityName);


        if (typeof originalMethod !== 'function') {
            return undefined;
        }

        return function(...args) {
            return originalMethod.apply(this, args);
        }
    }
};

let constructHelper = {
    construct: function(target, argumentList, newTarget) {
        return new Proxy(new EntityFactory(argumentList), facoryHelper);
    }
};

export default new Proxy(EntityFactory, constructHelper);
