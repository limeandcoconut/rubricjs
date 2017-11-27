/* eslint-env es6 */
/**
 * A module for managing a game loop.
 * @module Rubric
 */
const Powertrain = require('powertrain')
const InputAdapter = require('./input-adapter.js')

/**
 * Key for private data.
 * @type {Symbol}
 * @private
 */
let privateKey = Symbol('Rubric class private data key')

/**
 * Class for managing engine, input and systems.
 */
// * @class Rubric
module.exports = class Rubric {

    /**
     * @constructor
     * @param  {object}     config      An configuration object containing at least the namespaced config info for
     *                                  the Powertrain class.
     */
    constructor(config) {

        /**
         * Internal object literal for storing properly private data.
         * @private
         */
        this[privateKey] = {
            engine: new Powertrain(config.engine),
        }

        this.inputAdapters = new Map()
        this.data = {}

        /**
         * Exposes start method of Powertrain to users.
         */
        this.start = this[privateKey].engine.start.bind(this[privateKey].engine)
    }

    /**
     * Adds an instance of InputAdapter to internal list.
     * @throws  {TypeError}                         Throws if the argument is not an instance of InputAdapter.
     * @param   {InputAdapter}      inputAdapter    Input adapter to be added to internal list.
     */
    addInputAdapter(inputAdapter) {
        if (!(inputAdapter instanceof InputAdapter)) {
            throw new TypeError('Must be instance of InputAdapter')
        }

        this.inputAdapters.set(inputAdapter.constructor.name, inputAdapter)
    }

    /**
     * Sets an instance of InputAdapter as the primary source of input for easy retrieval.
     * @throws {TypeError}  Throws if the argument is not an instance of InputAdapter.
     * @param   {InputAdapter}      inputAdapter    Input adapter to be added to internal list.
     */
    addPrimaryInputAdapter(inputAdapter) {
        if (!(inputAdapter instanceof InputAdapter)) {
            throw new TypeError('Must be instance of InputAdapter')
        }

        this.primaryInput = inputAdapter
        this.inputAdapters.set(inputAdapter.constructor.name, inputAdapter)
    }

    /**
     * Calls init method on each input adapter.
     * @method init
     */
    init() {
        this.inputAdapters.forEach(value => value.init())
    }

    /**
     * Sets update method.
     * @method setUpdate
     * @param  {Function}       fn      The function to be set as Rubric's engine's update method.
     * @throws {Error}                  Throws if engine is running.
     * @throws {TypeError}              Throws if the argument is not a function.
     */
    setUpdate(fn) {
        let engine = this[privateKey].engine
        if (engine.running) {
            throw new Error('Not allowed to override update method while Rubric is running')
        } else if (typeof fn !== 'function') {
            throw new TypeError('Argument must be a function')
        }

        engine.update = fn
    }

    /**
     * Sets render method.
     * @method setRender
     * @param  {Function}       fn      The function to be set as Rubric's engine's render method.
     * @throws {Error}                  Throws if engine is running.
     * @throws {TypeError}              Throws if the argument is not a function.
     */
    setRender(fn) {
        let engine = this[privateKey].engine
        if (engine.running) {
            throw new Error('Not allowed to override render method while Rubric is running')
        } else if (typeof fn !== 'function') {
            throw new TypeError('Argument must be a function')
        }

        engine.render = fn
    }
}
