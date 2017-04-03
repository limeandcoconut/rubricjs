const Rubric = require('./rubric.js');
const System = require('./system.js');
const SubSystem = require('./sub-system.js');
const SystemManager = require('./system-manager.js');
const InputAdapter = require('./input-adapter.js');
const EntityManager = require('./entity-manager.js');
const EntityFactory = require('./entity-factory.js');
const Timer = require('./timer.js');
const TimerManager = require('./timer-manager.js');

/**
 * Export all of the core packages including the Rubric class.
 * @module
 * @exports {Rubric, System, InputAdapter, EntityManager, EntityFactory, Timer, TimerManager}
 */
module.exports = {
    default: Rubric,
    Rubric,
    System,
    SubSystem,
    SystemManager,
    InputAdapter,
    EntityManager,
    EntityFactory,
    Timer,
    TimerManager,
};
