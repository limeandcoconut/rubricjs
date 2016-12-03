/* eslint-disable no-undef */
let registryKey = Symbol();
/* eslint-enable no-undef */

class EntityFactory {
    constructor() {
        /* eslint-disable no-undef */
        this[registryKey] = new Map();
        /* eslint-enable no-undef */
    }

    registerConstructor(entityName, entityConstructor) {
        if (typeof entityName !== 'string' || typeof entityConstructor !== 'function') {
            /* eslint-disable max-len */
            throw new TypeError(`Parameters must be types string, function. ${typeof entityName}, ${typeof entityConstructor} given.`);
            /* eslint-enable max-len */
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
        };
    },
};

let constructHelper = {
    construct: function(target, argumentList/* , newTarget */) {
        /* eslint-disable no-undef */
        return new Proxy(new EntityFactory(argumentList), facoryHelper);
        /* eslint-enable no-undef */
    },
};

/* eslint-disable no-undef */
export default new Proxy(EntityFactory, constructHelper);
/* eslint-enable no-undef */
