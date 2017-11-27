/* eslint-env es6 */
/**
 * A module for managing timers.
 * @module TimerManager
 */

/**
 * Key for private registry
 * @type {Symbol}
 * @private
 */
let registryKey = Symbol('Timer Manager registry key')

/**
 * Class for managing entitiy constructor functions.
 */
 // * @class TimerManager
class TimerManager {

    /**
     * @constructor
     */
    constructor() {
        // FIXME: Generate uids
        this.lowestFreeId = 10
        /**
         * Internal private Map for storing timers.
         * @private
         */
        this[registryKey] = new Map()
    }

    /**
     * Returns a new unique iid.
     * @method getNewId
     * @throws {RangeError}     Throws if there are no unique numbers under MAX_SAFE_INTEGER.
     * @return {number}         A unique id number.
     */
    getNewId() {
        // FIXME: Id incrementing shouldn't be separated from registration. Currently id's can be consumed without
        // getting  used.
        if (this.lowestFreeId < this.maxId) {
            let id = this.lowestFreeId
            this.lowestFreeId += 1
            return id
        }

        let timerRegistry = this[registryKey]
        for (let i = 0, iLen = this.maxId; i < iLen; i++) {
            if (!timerRegistry.has(i)) {
                return i
            }
        }

        throw new RangeError('Maximum timer ids registered, approaching unsafe value')
    }

    /**
     * Records a timer with the manager.
     * @method registerTimer
     * @param {Timer}       timer   An instance of class timer to register.
     * @throws {TypeError}          Throws if the passed argument is not a n instance of class timer.
     * @return {number}             A unigue id number representing the timer.
     */
    registerTimer(timer) {
        if (!timer.constructor || timer.constructor.name !== 'Timer') {
            throw new TypeError('Argument must be instance of class Timer')
        }

        let timerRegistry = this[registryKey]
        if (timer.id && timerRegistry.has(timer.id)) {
            return timer.id
        }

        let id = this.getNewId()
        timerRegistry.set(id, timer)
        timer.id = id
        return id
    }

    /**
     * Removes a timer from the registry.
     * @method removeTimer
     * @param   {number|Timer}      timerId     An id or timer instance to remove.
     * @throws  {TypeError}                     Throws if the passed argument is not type number or instance of Timer.
     * @return  {number|false}                  Returns the id of removed timer if successful or false if not.
     */
    removeTimer(timerId) {
        if (typeof timerId === 'object') {
            if (timerId.constructor.name !== 'Timer') {
                throw new TypeError('Argument of type object must be instance of class Timer')
            }

            timerId = timerId.id
        }

        let registry = this[registryKey]

        if (registry.has(timerId)) {
            registry.delete(timerId)
            return timerId
        }

        return false
    }

    /**
     * Clears out internal registry.
     * @method removeAllTimers
     */
    removeAllTimers() {
        this[registryKey] = new Map()
    }

    /**
     * Retrieve a timer from internal registry.
     * @method  getTimer
     * @param   {number|Timer}  timerId     An in number or timer instance to retrieve.
     * @return  {Timer|false}               Returns timer instance if found or false if not.
     */
    getTimer(timerId) {
        if (typeof timerId === 'object') {

            timerId = timerId.id
            if (typeof timerId === 'undefined') {
                return false
            }
        }

        let registry = this[registryKey]
        if (registry.has(timerId)) {
            return registry.get(timerId)
        }

        return false
    }

    /**
     * Call tick method on each registered, running, timer.
     * @method tick
     */
    tick() {
        this[registryKey].forEach((timer, id) => {
            if (timer.running) {
                timer.tick()
            }
        })
    }
}

/**
 * Maximum id that TimerManager will assign.
 * @type {number}
 * @static
 * @memberOf TimerManager
 */
TimerManager.prototype.maxId = Number.MAX_SAFE_INTEGER

module.exports = TimerManager
