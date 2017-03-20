/* eslint-env es6 */
/**
 * A module for constructing entities.
 * @module EntityFactory
 */

/**
 * Key for private registry.
 * @type {Symbol}
 * @private
 */
let registryKey = Symbol('Entity Factory registry key');

/**
 * Class for managing entity constructor functions.
 */
 // * @class EntityFactory
class EntityFactory {

    /**
     * @constructor
     */
    constructor() {
        /**
         * Internal Map for storing entity constructors.
         * @private
         */
        this[registryKey] = new Map();
    }

    /**
     * Creates a Map entry for an entity constructor function to be trapped by proxy or called later.
     * @method registerConstructor
     * @param  {string}     entityName            A string representation of the entity's name.
     * @param  {function}   entityConstructor     The function which should construct an entity.
     * @throws {TypeError}                        Throws if either parameter is not expected type.
     */
    registerConstructor(entityName, entityConstructor) {
        if (typeof entityName !== 'string' || typeof entityConstructor !== 'function') {
            throw new TypeError(`Parameters must be types string, function.
                ${typeof entityName}, ${typeof entityConstructor} given.`);
        }
        entityName = entityName.charAt(0).toUpperCase() + entityName.slice(1);
        this[registryKey].set(entityName, entityConstructor);
    }
}

/**
 * The helper object for the Proxy returned when an EntityFactory is constructed.
 * @type {Object}
 */
let facoryHelper = {
    /**
     * A trap for getting constructor functions from the factory's Map as though they were methods.
     * @method get
     * @param  {object} target   The object targeted by the proxy (the factory).
     * @param  {string} key      The property that is being sought.
     * @return {*}               The property found on the factory if the string does not match desired pattern,
     *                           otherwise, a function from the Map of constructor functions.
     */
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

/**
 * The helper object for the Proxy that traps construct calls to EntityFactory
 * @type {Object}
 */
let constructHelper = {
    /**
     * Traps calls to the EntityFactory constructor and returns another Proxy for trapping EntityFactory property access.
     * @method construct
     * @param  {object}  target           The object targeted by the proxy
     * @param  {array}   argumentList     The arguments passed to the constructor
     * @return {Proxy}                    A Proxy designed to trap property access on a new EntityFactory
     */
    construct: function(target, argumentList/* , newTarget */) {
        return new Proxy(new EntityFactory(argumentList), facoryHelper);
    },
};

/**
 * Exports a Proxy to trap EntityFactory constructor.
 */
module.exports = new Proxy(EntityFactory, constructHelper);
