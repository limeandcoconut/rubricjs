/* eslint-env mocha, es6 */
const EntityManager = require(`../dist/EntityManager.js`);
const expect = require('chai').expect;
const auid = require('alphastring');

function createComponentClass() {
    let componentName = auid();
    let propertyName = auid();

    /* eslint-disable max-len, no-new-func */
    return Function(`return function ${componentName}(){this.${propertyName} = 'foo'; this.propertyName = '${propertyName}';}`)();
}

describe('EntityManager Class', function() {

    let em;
    let idsSymbol;
    let registrySymbol;

    let ComponentClass1;
    let component1;
    let ComponentClass2;
    let component2;

    beforeEach(function() {
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
            throw new Error('Cannot reflect keys from EntityManager class');
        }
    });

    /*
     ██████ ██████  ███████  █████  ████████ ███████
    ██      ██   ██ ██      ██   ██    ██    ██
    ██      ██████  █████   ███████    ██    █████
    ██      ██   ██ ██      ██   ██    ██    ██
     ██████ ██   ██ ███████ ██   ██    ██    ███████
    */

    describe('One the subject of creating an instance, it ', function() {

        it('should result private lists', function() {
            expect(em.entityIds).to.be.undefined;
            expect(em.componentRegistry).to.be.undefined;
        });

        it('should result in empty lists', function() {
            expect(em[idsSymbol]).to.have.length(0);
            expect(em[registrySymbol]).to.have.property('size').equals(0);
        });

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

    describe('On the subject of creating entities, it, ', function() {

        it('should result in expected when incrementing ids', function() {
            expect(em.createEntity()).to.equal(10);
            expect(em.createEntity()).to.equal(11);
        });

        it('should search for free ids if max reached', function() {
            em.lowestFreeId = em.maxId;

            expect(em.createEntity()).to.equal(0);
            expect(em.createEntity()).to.equal(1);
        });

        it('should throw if no ids available', function() {
            em.maxId = 0;

            expect(() => {
                em.createEntity();
            }).to.throw(RangeError, /unsafe/i);
        });

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

    describe('On the subject of adding components, it, ', function() {

        it('should result in expected structure', function() {
            let entity1 = em.createEntity();
            em.createEntity(entity1);
            em.addComponent(component1, entity1);

            // let mockRegistry = new Map();
            // mockRegistry.set(component1.constructor.name, new Map());
            // mockRegistry.get(component1.constructor.name).set(entity1, component1);

            expect(em[registrySymbol]).to.have.property('size').equals(1);
            expect(em[registrySymbol].get(component1.constructor.name)).to.have.property('size').equals(1);
            expect(em[registrySymbol].get(component1.constructor.name).get(entity1)).to.have.property(component1.propertyName).equals('foo');
        });

        it('should not cause intersections between components', function() {
            let entity1 = em.createEntity();
            em.addComponent(component1, entity1);
            em.addComponent(component2, entity1);

            // let mockRegistry = new Map();
            // mockRegistry.set(component1.constructor.name, new Map());
            // mockRegistry.get(component1.constructor.name).set(entity1, component1);
            //
            // mockRegistry.set(component2.constructor.name, new Map());
            // mockRegistry.get(component2.constructor.name).set(entity1, component2);

            // expect(em[registrySymbol]).to.eql(mockRegistry);
            expect(em[registrySymbol]).to.have.property('size').equal(2);
            expect(em[registrySymbol].get(component1.constructor.name)).to.have.property('size').equal(1);
            expect(em[registrySymbol].get(component2.constructor.name)).to.have.property('size').equal(1);
            expect(em[registrySymbol].get(component1.constructor.name).get(entity1)).to.equal(component1);
            expect(em[registrySymbol].get(component2.constructor.name).get(entity1)).to.equal(component2);

        });

        it('should throw if non-object is passed for component', function() {
            let entity1 = em.createEntity();
            expect(() => {
                em.addComponent(1, entity1);
            }).to.throw(TypeError, /component/i);
        });

    });

    /*
    ██████  ███████ ██      ███████ ████████ ███████
    ██   ██ ██      ██      ██         ██    ██
    ██   ██ █████   ██      █████      ██    █████
    ██   ██ ██      ██      ██         ██    ██
    ██████  ███████ ███████ ███████    ██    ███████
    */

    describe('On the subject of deleting entities, it, ', function() {

        it('should result in empty list', function() {
            let entity1 = em.createEntity();
            em.addComponent(component1, entity1);
            em.deleteEntity();
            expect(em[idsSymbol]).to.have.length(0);
            expect(em[registrySymbol]).to.have.property('size').equal(1);
            expect(em[registrySymbol].get(component1.constructor.name).constructor.name).to.equal('Map');
            expect(em[registrySymbol].get(component1.constructor.name)).to.have.property('size').equal(1);
        });

        it('should clear all', function() {
            em.createEntity();
            em.createEntity();
            em.createEntity();
            em.deleteAllEntities();

            expect(em[idsSymbol]).to.have.length(0);
            expect(em[registrySymbol]).to.have.property('size').equal(0);
        });

    });

    /*
    ██████  ███████ ████████ ██████  ██ ███████ ██    ██ ███████
    ██   ██ ██         ██    ██   ██ ██ ██      ██    ██ ██
    ██████  █████      ██    ██████  ██ █████   ██    ██ █████
    ██   ██ ██         ██    ██   ██ ██ ██       ██  ██  ██
    ██   ██ ███████    ██    ██   ██ ██ ███████   ████   ███████
    */

    describe('On the subject of creating entities, it, ', function() {

        it('should return proper entities', function() {
            let entity1 = em.createEntity();
            let entity2 = em.createEntity();

            em.addComponent(component1, entity1);
            em.addComponent(component2, entity2);

            let retrieved = em.getEntitiesWithComponent(component1.constructor.name);
            expect(retrieved).eql([entity1]);
            retrieved = em.getEntitiesWithComponent(component2.constructor.name);
            expect(retrieved).eql([entity2]);
        });

        it('should return empty array if no entities found', function() {
            let retrieved = em.getEntitiesWithComponent('foo');
            expect(retrieved).to.have.length(0);
        });

        // it('should return entities from intersection of component list', function() {
        //     let entity1 = em.createEntity();
        //     let entity2 = em.createEntity();
        //     em.addComponent(component1, entity1);
        //     em.addComponent(component2, entity1);
        //
        //     em.addComponent(component2, entity2);
        //
        //     let retrieved = em.getEntitiesWithComponents([component1.constructor.name, component2.constructor.name]);
        //     expect(retrieved).eql([entity1]);
        //     retrieved = em.getEntitiesWithComponents([component2.constructor.name]);
        //     expect(retrieved).to.have.length(2);
        //     expect(retrieved[0]).not.equal(retrieved[1]);
        // });

        it('should return entities from mixed list of constructor names and instances', function() {
            let entity1 = em.createEntity();
            let entity2 = em.createEntity();
            em.addComponent(component1, entity1);
            em.addComponent(component2, entity1);

            em.addComponent(component2, entity2);

            let retrieved = em.getEntitiesWithComponents([component1, component2.constructor.name]);
            expect(retrieved).eql([entity1]);
            retrieved = em.getEntitiesWithComponents([component2]);
            expect(retrieved).to.have.length(2);
            expect(retrieved[0]).not.equal(retrieved[1]);
        });

        it('should throw when a non array is presented to getEntitiesWithComponents', function() {
            let entity1 = em.createEntity();

            em.addComponent(component1, entity1);

            expect(() => {
                em.getEntitiesWithComponents(component1);
            }).to.throw(TypeError, /array/i);
        });

        it('should return empty array if no entities exist', function() {
            let retrieved = em.getEntitiesWithComponents(['bar']);
            expect(retrieved).to.have.length(0);
        });

        it('should return empty array if no entities found', function() {
            let entity1 = em.createEntity();
            em.addComponent(component1, entity1);
            let retrieved = em.getEntitiesWithComponents([component1, component2]);
            expect(retrieved).to.have.length(0);
        });

        it('should retrieve all entities', function() {
            em.createEntity();
            em.createEntity();
            em.createEntity();

            let retrieved = em.getAllEntities();
            expect(retrieved).to.have.length(3);
            expect(retrieved[0]).not.equal(retrieved[1]);
            expect(retrieved[0]).not.equal(retrieved[2]);
            expect(retrieved[1]).not.equal(retrieved[2]);
        });

    });

    /*
    ██████  ███████ ███    ███  ██████  ██    ██ ███████
    ██   ██ ██      ████  ████ ██    ██ ██    ██ ██
    ██████  █████   ██ ████ ██ ██    ██ ██    ██ █████
    ██   ██ ██      ██  ██  ██ ██    ██  ██  ██  ██
    ██   ██ ███████ ██      ██  ██████    ████   ███████
    */

    describe('On the subject of removing components, it, ', function() {

        it('should return false when no component exists', function() {
            let entity1 = em.createEntity();
            expect(em.removeComponent(component1.constructor.name, entity1)).to.equal(false);
        });

        it('should return the removed component', function() {
            let entity1 = em.createEntity();
            em.addComponent(component1, entity1);
            expect(em.removeComponent(component1.constructor.name, entity1)).to.equal(component1);
        });

        it('should work with constructor name or instance', function() {
            let entity1 = em.createEntity();
            em.addComponent(component1, entity1);
            em.removeComponent(component1.constructor.name, entity1);
            em.addComponent(component1, entity1);
            em.removeComponent(component1, entity1);

            // let mockRegistry = new Map();
            // mockRegistry.set(component1.constructor.name, new Map());
            // mockRegistry.get(component1.constructor.name).set(entity1, component1);
            // mockRegistry.get(component1.constructor.name).delete(entity1);

            expect(em[registrySymbol]).to.have.property('size').equal(1);
            expect(em[registrySymbol].get(component1.constructor.name)).to.have.property('size').equal(0);
            expect(em[registrySymbol].get(component1.constructor.name).has(entity1)).equal(false);
            // expect(em[registrySymbol]).eql(mockRegistry);
        });

        it('should generate expected structure', function() {
            let entity1 = em.createEntity();
            em.addComponent(component1, entity1);
            em.addComponent(component2, entity1);
            em.removeComponent(component1, entity1);

            // let mockRegistry = new Map();
            // mockRegistry.set(component1.constructor.name, new Map());
            // mockRegistry.get(component1.constructor.name).set(entity1, component1);
            //
            // mockRegistry.set(component2.constructor.name, new Map());
            // mockRegistry.get(component2.constructor.name).set(entity1, component2);
            //
            // mockRegistry.get(component1.constructor.name).delete(entity1);
            //
            // expect(em[registrySymbol]).eql(mockRegistry);

            expect(em[registrySymbol]).to.have.property('size').equal(2);
            expect(em[registrySymbol].get(component1.constructor.name)).to.have.property('size').equal(0);
            expect(em[registrySymbol].get(component2.constructor.name)).to.have.property('size').equal(1);
            expect(em[registrySymbol].get(component2.constructor.name).get(entity1)).to.equal(component2);
        });

        it('should return false if no component was removed', function() {
            let entity1 = em.createEntity();
            let entity2 = em.createEntity();
            em.addComponent(component1, entity1);

            expect(em.removeComponent(component1)).to.not.equal(entity2);
            expect(em.removeComponent(component2)).to.not.equal(entity2);
        });

    });

    /*
    ██████  ███████ ████████ ██████  ██ ███████ ██    ██ ███████        ███████ ███    ██ ████████ ██ ████████ ██ ███████ ███████
    ██   ██ ██         ██    ██   ██ ██ ██      ██    ██ ██             ██      ████   ██    ██    ██    ██    ██ ██      ██
    ██████  █████      ██    ██████  ██ █████   ██    ██ █████          █████   ██ ██  ██    ██    ██    ██    ██ █████   ███████
    ██   ██ ██         ██    ██   ██ ██ ██       ██  ██  ██             ██      ██  ██ ██    ██    ██    ██    ██ ██           ██
    ██   ██ ███████    ██    ██   ██ ██ ███████   ████   ███████        ███████ ██   ████    ██    ██    ██    ██ ███████ ███████
    */

    describe('On the subject of retrieving entities, it, ', function() {
        it('should return proper instance', function() {
            let entity1 = em.createEntity();
            em.addComponent(component1, entity1);
            let retrieved = em.getComponent(component1.constructor.name, entity1);

            expect(retrieved).equal(component1);
        });

        it('should work with constructor name or instance', function() {
            let entity1 = em.createEntity();

            em.addComponent(component1, entity1);
            let retrieved = em.getComponent(component1.constructor.name, entity1);
            expect(retrieved).equal(component1);
            retrieved = em.getComponent(component1, entity1);
            expect(retrieved).equal(component1);
        });

    });
});
