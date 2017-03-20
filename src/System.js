/* eslint-env es6 */
/**
 * A module for creating logical systems that run on each tick of the Rubric engine.
 * @module System
 */

const AbstractConstructError = require('abstract-class-error').default;

/**
 * Class for creating logical system that update on each tick of the Rubric engine.
 * @abstract
 */
 // * @class System
module.exports = class System {

    /**
     * @constructor
     * @throws {AbstractConstructError}      Throws (Error in es2015) if System class is the target of the new operator as
     *                                       this class is abstract.
     * @throws {AbstractConstructError}      Throws (Error in es2015) if update is not overridden by the user.
     */
    constructor() {
        if (new.target === System) {
            throw new AbstractConstructError('Cannot construct class System instances directly');
        }

        if (this.update === System.prototype.update) {
            throw new AbstractConstructError('Method "update" must be overridden in class System');
        }

        this.events = [];

        let userUpdate = this.update;

        /**
         * Wrapper for user set update method. This ensures that events will be cleared before running user logic.
         * @override
         * @method update
         * @return {*}                                          Return is controlled by the user but currently has no
         *                                                      use for systems.
         */
        this.update = () => {
            this.clearEvents();

            return userUpdate.call(this, arguments);
        };
    }

    /**
     * Perform logic each tick.
     * @method update
     * @abstract
     */
    update() {}

    /**
     * Prepare any necessary logic for the system.
     * @method init
     */
    init() {}

    /**
     * Push event to internal list for subscribers to observe.
     * @method publish
     */
    publish(event) {
        this.events.push(event);
    }

    /**
     * Clear internal list of events for this publisher.
     * @method clearEvents
     */
    clearEvents() {
        this.events = [];
    }
};
