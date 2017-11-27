/* eslint-env es6 */
/**
 * A module for managing Rubric.js systems.
 * @module SystemManager
 */

const System = require('./system.js')

/**
 * Key for private registry.
 * @type {Symbol}
 * @private
 */
let systemRegistry = Symbol()

/**
* Class for managing Rubric.js systems.
*/
// * @class SystemManager
module.exports = class SystemManager {

    /**
     * @constructor
     */
    constructor() {

        /**
         * Internal Map for storing systems.
         * @private
         */
        this[systemRegistry] = new Map()

        this.update = this.update.bind(this)
    }

    /**
     * Records validates and a new system.
     * @method register
     * @param  {object}     system              The system to be registered.
     * @throws {TypeError}                      Throws if system is not an instance of Class System.
     * @return {string}                         The key for registered system.
     */
    register(system) {
        let systemName = system.constructor.name
        if (!(system instanceof System)) {
            throw new TypeError('Argument must be an instance of class System')
        } else if (this[systemRegistry].has(systemName)) {
            throw new Error(`An instance of class "${systemName}" is already defined`)
        }
        this[systemRegistry].set(systemName, system)
        return systemName
    }

    /**
     * @method removeSystem
     * @param  {string|object}     systemName   The id of a system.
     * @return {object|boolean}                 The removed system or false if it was not successful.
     */
    removeSystem(systemName) {
        if (typeof systemName === 'object') {
            systemName = systemName.constructor.name
        }

        if (typeof systemName !== 'string') {
            throw new TypeError('Unexpected value for system name')
        }

        let registry = this[systemRegistry]

        if (!registry.has(systemName)) {
            return false
        }
        let system = registry.get(systemName)
        registry.delete(systemName)
        return system
    }

    /**
     * Calls "update" method on all registered systems.
     * @method update
     */
    update() {
        this[systemRegistry].forEach((system) => {
            system.update()
        })
    }

    /**
     * Remove all systems.
     * @method deleteAllSystems
     */
    deleteAllSystems() {
        this[systemRegistry].clear()
    }
}
