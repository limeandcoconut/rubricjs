/* eslint-env es6 */
/**
 * A module for managing a game loop.
 * @module Rubric
 */
// import Powertrain from 'powertrain';
const Powertrain = require('powertrain').default;
// import InputAdapter from './InputAdapter';
const InputAdapter = require('./InputAdapter.js');
// import EntityManager from './EntityManager';
const EntityManager = require('./EntityManager.js');
// import EntityFactory from './EntityFactory';
const EntityFactory = require('./EntityFactory.js');
// import TimerManager from './TimerManager';
const TimerManager = require('./TimerManager.js');

/**
 * Key for private data.
 * @type {Symbol}
 * @private
 */
let privateKey = Symbol('Rubric class private data key');

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
        };

        this.em = new EntityManager();
        this.entityManager = this.em;
        this.ef = new EntityFactory();
        this.entityFactory = this.ef;
        this.tm = new TimerManager();
        this.timerManager = this.tm;
        this.inputAdapters = new Map();
        this.data = {};
    }

    /**
     * Adds an instance of InputAdapter to internal list.
     * @throws  {TypeError}                         Throws if the argument is not an instance of InputAdapter.
     * @param   {InputAdapter}      inputAdapter    Input adapter to be added to internal list.
     */
    addInputAdapter(inputAdapter) {
        if (!(inputAdapter instanceof InputAdapter)) {
            throw new TypeError('Must be instance of InputAdapter');
        }

        this.inputAdapters.set(inputAdapter.constructor.name, inputAdapter);
    }

    /**
     * Sets an instance of InputAdapter as the primary source of input for easy retrieval.
     * @throws {TypeError}  Throws if the argument is not an instance of InputAdapter.
     * @param   {InputAdapter}      inputAdapter    Input adapter to be added to internal list.
     */
    addPrimaryInputAdapter(inputAdapter) {
        if (!(inputAdapter instanceof InputAdapter)) {
            throw new TypeError('Must be instance of InputAdapter');
        }

        this.primaryInput = inputAdapter;
        this.inputAdapters.set(inputAdapter.constructor.name, inputAdapter);
    }

    init() {
        this.inputAdapters.forEach(value => value.init());
    }
}
