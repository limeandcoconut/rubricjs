import ava from 'ava';
import EntityManager from '../src/EntityManager.js';
import auid from 'alphastring';

function createComponentClass() {
    let componentName = auid();
    let propertyName = auid();

    /* eslint-disable max-len, no-new-func */
    return Function(`return function ${componentName}(){this.${propertyName} = 'foo'; this.propertyName = '${propertyName}';}`)();
}

let em;
let idsSymbol;
let registrySymbol;

let ComponentClass1;
let component1;
let ComponentClass2;
let component2;

ava.beforeEach((test) => {
    em = new EntityManager();
    ComponentClass1 = createComponentClass();
    component1 = new ComponentClass1();
    ComponentClass2 = createComponentClass();
    component2 = new ComponentClass2();

    /* eslint-disable no-undef */
    let keys = Reflect.ownKeys(em);
    /* eslint-enable no-undef */

    keys.forEach((key) => {
        let prop = em[key];
        if (typeof key === 'symbol') {
            if (prop.constructor.name === 'Array') {
                idsSymbol = key;
            } else if (prop.constructor.name === 'Map') {
                registrySymbol = key;
            }
        }
        return false;
    });

    if (!idsSymbol || !registrySymbol) {
        test.fail();
    }
});

/*
 ██████ ██████  ███████  █████  ████████ ███████
██      ██   ██ ██      ██   ██    ██    ██
██      ██████  █████   ███████    ██    █████
██      ██   ██ ██      ██   ██    ██    ██
 ██████ ██   ██ ███████ ██   ██    ██    ███████
*/

ava('should result private lists', test => {
    test.is(em.entityIds, undefined);
    test.is(em.componentRegistry, undefined);
});

ava('should result in empty lists', test => {
    test.is(em[idsSymbol].length, 0);
    test.is(em[registrySymbol].size, 0);
});

/*
███████ ███    ██ ████████ ██ ████████ ██ ███████ ███████
██      ████   ██    ██    ██    ██    ██ ██      ██
█████   ██ ██  ██    ██    ██    ██    ██ █████   ███████
██      ██  ██ ██    ██    ██    ██    ██ ██           ██
███████ ██   ████    ██    ██    ██    ██ ███████ ███████
*/

/*
 ██████ ██████  ███████  █████  ████████ ███████
██      ██   ██ ██      ██   ██    ██    ██
██      ██████  █████   ███████    ██    █████
██      ██   ██ ██      ██   ██    ██    ██
 ██████ ██   ██ ███████ ██   ██    ██    ███████
*/

ava('should result in expected when incrementing ids', test => {
    test.is(em.createEntity(), 10);
    test.is(em.createEntity(), 11);
});

ava('should search for free ids if max reached', test => {
    em.lowestFreeId = em.maxId;

    test.is(em.createEntity(), 0);
    test.is(em.createEntity(), 1);
});

ava('should throw if no ids available', test => {
    em.maxId = 0;

    test.throws(() => {
        em.createEntity();
    }, RangeError);
});

/*
 ██████  ██████  ███    ███ ██████   ██████  ███    ██ ███████ ███    ██ ████████ ███████
██      ██    ██ ████  ████ ██   ██ ██    ██ ████   ██ ██      ████   ██    ██    ██
██      ██    ██ ██ ████ ██ ██████  ██    ██ ██ ██  ██ █████   ██ ██  ██    ██    ███████
██      ██    ██ ██  ██  ██ ██      ██    ██ ██  ██ ██ ██      ██  ██ ██    ██         ██
 ██████  ██████  ██      ██ ██       ██████  ██   ████ ███████ ██   ████    ██    ███████
*/

/*
 █████  ██████  ██████
██   ██ ██   ██ ██   ██
███████ ██   ██ ██   ██
██   ██ ██   ██ ██   ██
██   ██ ██████  ██████
*/

ava('should result in expected structure', test => {
    let entity1 = em.createEntity();
    em.createEntity(entity1);
    em.addComponent(component1, entity1);

    /* eslint-disable no-undef */
    let mockRegistry = new Map();
    mockRegistry.set(component1.constructor.name, new Map());
    /* eslint-enable no-undef */
    mockRegistry.get(component1.constructor.name).set(entity1, component1);

    test.is(em[registrySymbol].size, 1);
    test.is(em[registrySymbol].get(component1.constructor.name).size, 1);
    test.is(em[registrySymbol].get(component1.constructor.name).get(entity1)[component1.propertyName], 'foo');
    test.deepEqual(em[registrySymbol], mockRegistry);
});

ava('should not cause intersections between components', test => {
    let entity1 = em.createEntity();
    em.addComponent(component1, entity1);
    em.addComponent(component2, entity1);

    /* eslint-disable no-undef */
    let mockRegistry = new Map();
    mockRegistry.set(component1.constructor.name, new Map());
    mockRegistry.get(component1.constructor.name).set(entity1, component1);

    mockRegistry.set(component2.constructor.name, new Map());
    /* eslint-enable no-undef */
    mockRegistry.get(component2.constructor.name).set(entity1, component2);

    test.deepEqual(em[registrySymbol], mockRegistry);
});

ava('should throw if non-object is passed for component', test => {
    let entity1 = em.createEntity();
    test.throws(() => {
        em.addComponent(1, entity1);
    }, TypeError);
});

/*
██████  ███████ ██      ███████ ████████ ███████
██   ██ ██      ██      ██         ██    ██
██   ██ █████   ██      █████      ██    █████
██   ██ ██      ██      ██         ██    ██
██████  ███████ ███████ ███████    ██    ███████
*/

ava('should result in empty list', test => {
    let entity1 = em.createEntity();
    em.addComponent(component1, entity1);
    em.deleteEntity();
    test.is(em[idsSymbol].length, 0);
    test.is(em[registrySymbol].size, 1);
    test.true(em[registrySymbol].get(component1.constructor.name).constructor.name === 'Map');
    test.is(em[registrySymbol].get(component1.constructor.name).size, 1);
});

ava('should clear all', test => {
    em.createEntity();
    em.createEntity();
    em.createEntity();
    em.deleteAllEntities();

    test.is(em[idsSymbol].length, 0);
    test.is(em[registrySymbol].size, 0);
});

/*
██████  ███████ ████████ ██████  ██ ███████ ██    ██ ███████
██   ██ ██         ██    ██   ██ ██ ██      ██    ██ ██
██████  █████      ██    ██████  ██ █████   ██    ██ █████
██   ██ ██         ██    ██   ██ ██ ██       ██  ██  ██
██   ██ ███████    ██    ██   ██ ██ ███████   ████   ███████
*/

ava('should return proper entities', test => {
    let entity1 = em.createEntity();
    let entity2 = em.createEntity();

    em.addComponent(component1, entity1);
    em.addComponent(component2, entity2);

    let retrieved = em.getEntitiesWithComponent(component1.constructor.name);
    test.deepEqual(retrieved, [entity1]);
    retrieved = em.getEntitiesWithComponent(component2.constructor.name);
    test.deepEqual(retrieved, [entity2]);
});

ava('should return empty array if no entities found', test => {
    let retrieved = em.getEntitiesWithComponent('foo');
    test.is(retrieved.length, 0);
});

ava('should return entities from intersection of component list', test => {
    let entity1 = em.createEntity();
    let entity2 = em.createEntity();
    em.addComponent(component1, entity1);
    em.addComponent(component2, entity1);

    em.addComponent(component2, entity2);

    let retrieved = em.getEntitiesWithComponents([component1.constructor.name, component2.constructor.name]);
    test.deepEqual(retrieved, [entity1]);
    retrieved = em.getEntitiesWithComponents([component2.constructor.name]);
    test.is(retrieved.length, 2);
    test.not(retrieved[0], retrieved[1]);
});

ava('should return entities from mixed list of constructor names and instances', test => {
    let entity1 = em.createEntity();
    let entity2 = em.createEntity();
    em.addComponent(component1, entity1);
    em.addComponent(component2, entity1);

    em.addComponent(component2, entity2);

    let retrieved = em.getEntitiesWithComponents([component1, component2.constructor.name]);
    test.deepEqual(retrieved, [entity1]);
    retrieved = em.getEntitiesWithComponents([component2]);
    test.is(retrieved.length, 2);
    test.not(retrieved[0], retrieved[1]);
});

ava('should throw when a non array is presented to getEntitiesWithComponents', test => {
    let entity1 = em.createEntity();

    em.addComponent(component1, entity1);

    test.throws(() => {
        em.getEntitiesWithComponents(component1);
    }, TypeError);
});

ava('should return empty array if no entities exist', test => {
    let retrieved = em.getEntitiesWithComponents(['bar']);
    test.is(retrieved.length, 0);
});

ava('should return empty array if no entities found', test => {
    let entity1 = em.createEntity();
    em.addComponent(component1, entity1);
    let retrieved = em.getEntitiesWithComponents([component1, component2]);
    test.is(retrieved.length, 0);
});

ava('should retrieve all entities', test => {
    em.createEntity();
    em.createEntity();
    em.createEntity();

    let retrieved = em.getAllEntities();
    test.is(retrieved.length, 3);
    test.not(retrieved[0], retrieved[1]);
    test.not(retrieved[0], retrieved[2]);
    test.not(retrieved[1], retrieved[2]);
});

/*
██████  ███████ ███    ███  ██████  ██    ██ ███████
██   ██ ██      ████  ████ ██    ██ ██    ██ ██
██████  █████   ██ ████ ██ ██    ██ ██    ██ █████
██   ██ ██      ██  ██  ██ ██    ██  ██  ██  ██
██   ██ ███████ ██      ██  ██████    ████   ███████
*/

ava('should work with constructor name or instance', test => {
    let entity1 = em.createEntity();
    em.addComponent(component1, entity1);
    em.removeComponent(component1.constructor.name, entity1);
    em.addComponent(component1, entity1);
    em.removeComponent(component1, entity1);

    /* eslint-disable no-undef */
    let mockRegistry = new Map();
    mockRegistry.set(component1.constructor.name, new Map());
    /* eslint-enable no-undef */
    mockRegistry.get(component1.constructor.name).set(entity1, component1);
    mockRegistry.get(component1.constructor.name).delete(entity1);

    test.is(em[registrySymbol].size, 1);
    test.is(em[registrySymbol].get(component1.constructor.name).size, 0);
    test.is(em[registrySymbol].get(component1.constructor.name).has(entity1), false);
    test.deepEqual(em[registrySymbol], mockRegistry);
});

ava('should generate expected structure', test => {
    let entity1 = em.createEntity();
    em.addComponent(component1, entity1);
    em.addComponent(component2, entity1);
    em.removeComponent(component1, entity1);

    /* eslint-disable no-undef */
    let mockRegistry = new Map();
    mockRegistry.set(component1.constructor.name, new Map());
    mockRegistry.get(component1.constructor.name).set(entity1, component1);

    mockRegistry.set(component2.constructor.name, new Map());
    /* eslint-enable no-undef */
    mockRegistry.get(component2.constructor.name).set(entity1, component2);

    mockRegistry.get(component1.constructor.name).delete(entity1);

    test.deepEqual(em[registrySymbol], mockRegistry);
});

ava('should return false if no component was removed', test => {
    let entity1 = em.createEntity();
    let entity2 = em.createEntity();
    em.addComponent(component1, entity1);

    test.false(em.removeComponent(component1, entity2));
    test.false(em.removeComponent(component2, entity2));
});

/*
██████  ███████ ████████ ██████  ██ ███████ ██    ██ ███████        ███████ ███    ██ ████████ ██ ████████ ██ ███████ ███████
██   ██ ██         ██    ██   ██ ██ ██      ██    ██ ██             ██      ████   ██    ██    ██    ██    ██ ██      ██
██████  █████      ██    ██████  ██ █████   ██    ██ █████          █████   ██ ██  ██    ██    ██    ██    ██ █████   ███████
██   ██ ██         ██    ██   ██ ██ ██       ██  ██  ██             ██      ██  ██ ██    ██    ██    ██    ██ ██           ██
██   ██ ███████    ██    ██   ██ ██ ███████   ████   ███████        ███████ ██   ████    ██    ██    ██    ██ ███████ ███████
*/

ava('should return proper instance', test => {
    let entity1 = em.createEntity();
    em.addComponent(component1, entity1);
    let retrieved = em.getComponent(component1.constructor.name, entity1);

    test.is(retrieved, component1);
});

ava('should work with constructor name or instance', test => {
    let entity1 = em.createEntity();

    em.addComponent(component1, entity1);
    let retrieved = em.getComponent(component1.constructor.name, entity1);
    test.is(retrieved, component1);
    retrieved = em.getComponent(component1, entity1);
    test.is(retrieved, component1);
});
