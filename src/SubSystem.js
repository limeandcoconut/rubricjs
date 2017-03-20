/* eslint-env es6 */
/**
 * A module for creating logical systems that inherit their input from other systems.
 * @module SubSystem
 */

const System = require('./System.js');

/**
 * Class for creating logical systems that depend on other systems.
 */
 // * @class SubSystem

class SubSystem extends System {

    /**
     * @constructor
     * @throws AbstractConstructError(Error in es2015)      Super class throws if it is the target of the new
     *                                                      operator as this class is abstract.
     * @throws AbstractConstructError(Error in es2015)      Super Class will throw if update is not overridden by
     *                                                      the user.
     */
    constructor() {
        super();

        this.inputQueue = [];

        let userUpdate = this.update;

        /**
         * Wrapper for user set update method. This ensures that events will be pulled from a publisher System
         * (provided one is set) before running user logic.
         * @override
         * @method update
         * @return {*}                                          Return is controlled by the user but currently has no
         *                                                      use for systems.
         */
        this.update = () => {
            if (this.publisher) {
                this.inputQueue = this.publisher.events.slice();
            } else if (this.inputQueue.length) {
                this.inputQueue = [];
            }

            return userUpdate.call(this, arguments);
        };
    }

    /**
     * Prepare any necessary logic for the system.
     * @method init
     */
    init() {}

    /**
     * Set a parent System for this one to pull input from. This is a publish/subscribe relationship.
     * @method subscribe
     * @param  {System}     system      The parent system from which events will be pulled.
     * @throws {TypeError}              Throws if the parameter is not an instance of System.
     */
    subscribe(system) {
        if (!(system instanceof System)) {
            throw new TypeError('Argument must be instance of class System');
        }

        this.publisher = system;
    }

    /**
     * Stop using publisher System for input.
     * @method unsubscribe
     */
    unsubscribe() {
        this.publisher = null;
    }

    /**
     * Clear internal queue of events pulled from publisher.
     * @method clearQueue
     */
    clearQueue() {
        this.inputQueue = [];
    }
};

module.exports = SubSystem;
