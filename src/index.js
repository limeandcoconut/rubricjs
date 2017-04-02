const Rubric = require('./Rubric.js');
const System = require('./System.js');
const SubSystem = require('./SubSystem.js');
const SystemManager = require('./SystemManager.js');
const InputAdapter = require('./InputAdapter.js');
const EntityManager = require('./EntityManager.js');
const EntityFactory = require('./EntityFactory.js');
const Timer = require('./Timer.js');
const TimerManager = require('./TimerManager.js');

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
