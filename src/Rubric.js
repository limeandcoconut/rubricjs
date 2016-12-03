import Powertrain from 'powertrain';
import InputAdapter from './InputAdapter';
import EntityManager from './EntityManager';
import EntityFactory from './EntityFactory';
import TimerManager from './TimerManager';

/* eslint-disable no-undef */
let privateKey = Symbol();

class Rubric {
    constructor(config) {

        this[privateKey] = {
            engine: new Powertrain(config.engine),
        };

        this.em = new EntityManager();
        this.entityManager = this.em;
        this.ef = new EntityFactory();
        this.entityFactory = this.ef;
        this.tm = new TimerManager();
        this.timerManager = this.tm;
        /* eslint-disable no-undef */
        this.inputAdapters = new Map();
        this.data = {};
    }

    addInputAdapter(inputAdapter) {
        if (!(inputAdapter instanceof InputAdapter)) {
            throw new TypeError('Must be instance of InputAdapter');
        }

        this.inputAdapters.set(inputAdapter.constructor.name, inputAdapter);
    }

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

export default Rubric;
