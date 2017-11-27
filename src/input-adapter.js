/**
 * A module that defines an interface for managing Rubric inputs.
 * @module InputAdapter
 */

let AbstractConstructError = require('abstract-class-error').default

/**
 * Abstract Class representing an adapter for providing input to Rubric
 * @abstract
 */
 // * @class InputAdapter
module.exports = class InputAdapter {
    /**
     * @constructor
     * @throws {AbstractConstructError}    Throws (Error in es2015) if the 'new' keyword is used to construct an instance.
     * @throws {AbstractConstructError}    Throws (Error in es2015) if the the init() method is not overridden.
     */
    constructor() {
        if (new.target === InputAdapter) {
            throw new AbstractConstructError('Cannot construct class InputAdapter instances directly')
        }

        if (this.init === InputAdapter.prototype.init) {
            throw new AbstractConstructError('Method "init" must be overridden in class InputAdapter')
        }
    }

    /**
     * Prepare any necessary logic for the adapter instance.
     * @method init
     * @abstract
     */
    init() {
    }
}
