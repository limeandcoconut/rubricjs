import EntityManager from '../src/EntityManager.js';
import auid from 'alphastring';
var expect = require('chai').expect;

function createComponentClass() {
    let componentName = auid();
    let propertyName = auid();

    /* eslint-disable max-len, no-new-func */
    return Function(`return function ${componentName}(){this.${propertyName} = 'foo'; this.propertyName = '${propertyName}';}`)();
}

/* eslint-disable no-undef */
describe('Entity Manager', function() {

    /*
     ██████ ██████  ███████  █████  ████████ ███████
    ██      ██   ██ ██      ██   ██    ██    ██
    ██      ██████  █████   ███████    ██    █████
    ██      ██   ██ ██      ██   ██    ██    ██
     ██████ ██   ██ ███████ ██   ██    ██    ███████
    */

    describe('Creating Manager', function() {
        let em = new EntityManager();

        it('should result private lists', function() {
            expect(em.entityIds).to.be.undefined;
            expect(em.componentRegistry).to.be.undefined;
        });

        it('should result in empty lists', function() {
            let keys = Reflect.ownKeys(em);
            keys.forEach((key) => {
                if (typeof key === 'symbol') {
                    let prop = em[key];
                    if (Array.isArray(prop)) {
                        expect(prop).to.have.length(0);
                    } else {
                        expect(prop).to.have.property('size').equal(0);
                    }
                }
            });
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

    describe('Creating Entities', function() {
        it('should result in expected ids', function() {
            let em = new EntityManager();
            expect(em.createEntity()).to.equal(10);
            expect(em.createEntity()).to.equal(11);
        });
    });

    /*
    ██████  ███████ ██      ███████ ████████ ███████
    ██   ██ ██      ██      ██         ██    ██
    ██   ██ █████   ██      █████      ██    █████
    ██   ██ ██      ██      ██         ██    ██
    ██████  ███████ ███████ ███████    ██    ███████
    */

    describe('Deleting Entities', function() {
        let em = new EntityManager();
        em.createEntity();
        em.deleteEntity();
        let keys = Reflect.ownKeys(em);
        let idsSymbol;
        let registrySymbol;
        keys.some((key) => {
            let prop = em[key];
            if (typeof key === 'symbol') {
                if (prop.constructor.name === 'Array') {
                    idsSymbol = key;
                } else if (prop.constructor.name === "Map") {
                    registrySymbol = key;
                }
            }
        });

        it('should result in empty list', function() {
            expect(em[idsSymbol]).to.have.length(0);
        });

        it('should clear all', function() {
            em.createEntity();
            em.createEntity();
            em.createEntity();
            em.deleteAllEntities();

            expect(em[idsSymbol]).to.have.length(0);
        });
    });

    /*
    ██████  ███████ ████████ ██████  ██ ███████ ██    ██ ███████
    ██   ██ ██         ██    ██   ██ ██ ██      ██    ██ ██
    ██████  █████      ██    ██████  ██ █████   ██    ██ █████
    ██   ██ ██         ██    ██   ██ ██ ██       ██  ██  ██
    ██   ██ ███████    ██    ██   ██ ██ ███████   ████   ███████
    */

    describe('Retrieving entities', function() {
        let em = new EntityManager();
        let ComponentClass1 = createComponentClass();
        let component1 = new ComponentClass1();
        let entity1;
        let entity2;
        let ComponentClass2 = createComponentClass();
        let component2 = new ComponentClass2();

        beforeEach(function() {
            em.deleteAllEntities();
            entity1 = em.createEntity();
            entity2 = em.createEntity();
        });

        it('should return proper entities', function() {

            em.addComponent(component1, entity1);
            em.addComponent(component2, entity2);

            let retrieved = em.getEntitiesWithComponent(component1.constructor.name);
            expect(retrieved).to.eql([entity1]);
            retrieved = em.getEntitiesWithComponent(component2.constructor.name);
            expect(retrieved).to.eql([entity2]);

        });

        it('should return entities from intersection of component list', function() {
            em.addComponent(component1, entity1);
            em.addComponent(component2, entity1);

            em.addComponent(component2, entity2);

            let retrieved = em.getEntitiesWithComponents([component1.constructor.name, component2.constructor.name]);
            expect(retrieved).to.eql([entity1]);
            retrieved = em.getEntitiesWithComponents([component2.constructor.name]);
            expect(retrieved).to.have.length(2);
            expect(retrieved[0]).to.not.equal(retrieved[1]);
        });

        it('should return entities from mixed list of constructor names and instances', function() {
            em.addComponent(component1, entity1);
            em.addComponent(component2, entity1);

            em.addComponent(component2, entity2);

            let retrieved = em.getEntitiesWithComponents([component1, component2.constructor.name]);
            expect(retrieved).to.eql([entity1]);
            retrieved = em.getEntitiesWithComponents([component2]);
            expect(retrieved).to.have.length(2);
            expect(retrieved[0]).to.not.equal(retrieved[1]);
        });

        it('should throw when a non array is presented to getEntitiesWithComponents', function() {
            let em = new EntityManager();
            let entity = em.createEntity();
            let ComponentClass = createComponentClass();
            let component = new ComponentClass();

            em.addComponent(component, entity);

            expect(() => {
                em.getEntitiesWithComponents(component);
            }).throw(TypeError, /array/i);
        });

        it('should retrieve all entities', function() {
            let em = new EntityManager();
            let entity1 = em.createEntity();
            let entity2 = em.createEntity();
            let entity3 = em.createEntity();

            let retrieved = em.getAllEntities();
            expect(retrieved).to.have.length(3);
            expect(retrieved[0]).to.not.equal(retrieved[1]);
            expect(retrieved[0]).to.not.equal(retrieved[2]);
            expect(retrieved[1]).to.not.equal(retrieved[2]);
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

    describe('Adding components', function() {
        let em = new EntityManager();
        let entity;
        let ComponentClass1 = createComponentClass();
        let component1 = new ComponentClass1();

        let ComponentClass2 = createComponentClass();
        let component2 = new ComponentClass2();

        let keys = Reflect.ownKeys(em);
        let idsSymbol;
        let registrySymbol;
        keys.some((key) => {
            let prop = em[key];
            if (typeof key === 'symbol') {
                if (prop.constructor.name === 'Array') {
                    idsSymbol = key;
                } else if (prop.constructor.name === "Map") {
                    registrySymbol = key;
                }
            }
        });

        beforeEach(function() {
            em.deleteAllEntities();
            entity = em.createEntity();
        });

        it('should result in expected structure', function() {
            em.addComponent(component1, entity);

            let mockRegistry = new Map();
            mockRegistry.set(component1.constructor.name, new Map());
            mockRegistry.get(component1.constructor.name).set(entity, component1);

            expect(em[registrySymbol]).to.have.property('size').equal(1);
            expect(em[registrySymbol].get(component1.constructor.name)).to.have.property('size').equal(1);
            expect(em[registrySymbol].get(component1.constructor.name).get(entity))
                .to.have.property(component1.propertyName).equal('foo');
            // .eql does deep comparison
            expect(em[registrySymbol]).to.eql(mockRegistry);
        });

        it('should not cause intersetions between components', function() {
            em.addComponent(component1, entity);
            em.addComponent(component2, entity);

            let mockRegistry = new Map();
            mockRegistry.set(component1.constructor.name, new Map());
            mockRegistry.get(component1.constructor.name).set(entity, component1);

            mockRegistry.set(component2.constructor.name, new Map());
            mockRegistry.get(component2.constructor.name).set(entity, component2);

            expect(em[registrySymbol]).to.have.property('size').equal(2);
            expect(em[registrySymbol].get(component1.constructor.name)).to.have.property('size').equal(1);
            expect(em[registrySymbol].get(component2.constructor.name)).to.have.property('size').equal(1);
            expect(em[registrySymbol].get(component1.constructor.name).get(entity)).to.have.property(component1.propertyName).equal('foo');
            expect(em[registrySymbol].get(component2.constructor.name).get(entity)).to.have.property(component2.propertyName).equal('foo');
            // .eql does deep comparison
            expect(em[registrySymbol]).to.eql(mockRegistry);
        });
    });

    /*
    ██████  ███████ ███    ███  ██████  ██    ██ ███████
    ██   ██ ██      ████  ████ ██    ██ ██    ██ ██
    ██████  █████   ██ ████ ██ ██    ██ ██    ██ █████
    ██   ██ ██      ██  ██  ██ ██    ██  ██  ██  ██
    ██   ██ ███████ ██      ██  ██████    ████   ███████
    */

    describe('Removing components', function() {
        let em = new EntityManager();
        let entity = em.createEntity();
        let ComponentClass1 = createComponentClass();
        let component1 = new ComponentClass1();
        let ComponentClass2 = createComponentClass();
        let component2 = new ComponentClass2();

        let keys = Reflect.ownKeys(em);
        let idsSymbol;
        let registrySymbol;
        keys.some((key) => {
            let prop = em[key];
            if (typeof key === 'symbol') {
                if (prop.constructor.name === 'Array') {
                    idsSymbol = key;
                } else if (prop.constructor.name === "Map") {
                    registrySymbol = key;
                }
            }
        });

        it('should work with constructor name or instance', function() {

            em.addComponent(component1, entity);
            em.removeComponent(component1.constructor.name, entity);
            em.addComponent(component1, entity);
            em.removeComponent(component1, entity);

            let mockRegistry = new Map();
            mockRegistry.set(component1.constructor.name, new Map());
            mockRegistry.get(component1.constructor.name).set(entity, component1);
            mockRegistry.get(component1.constructor.name).delete(entity);

            expect(em[registrySymbol]).to.have.property('size').equal(1);
            expect(em[registrySymbol].get(component1.constructor.name)).to.have.property('size').equal(0);
            expect(em[registrySymbol].get(component1.constructor.name).has(entity)).to.equal(false);
            // .eql does deep comparison
            expect(em[registrySymbol]).to.eql(mockRegistry);
        });

        it('should generate expected structure', function() {
            em.addComponent(component1, entity);
            em.addComponent(component2, entity);
            em.removeComponent(component1, entity);

            let mockRegistry = new Map();
            mockRegistry.set(component1.constructor.name, new Map());
            mockRegistry.get(component1.constructor.name).set(entity, component1);

            mockRegistry.set(component2.constructor.name, new Map());
            mockRegistry.get(component2.constructor.name).set(entity, component2);

            mockRegistry.get(component1.constructor.name).delete(entity);

            expect(em[registrySymbol]).to.have.property('size').equal(2);
            expect(em[registrySymbol].get(component1.constructor.name)).to.have.property('size').equal(0);
            expect(em[registrySymbol].get(component2.constructor.name)).to.have.property('size').equal(1);
            expect(em[registrySymbol].get(component1.constructor.name).has(entity)).to.equal(false);
            expect(em[registrySymbol].get(component2.constructor.name).get(entity))
                .to.have.property(component2.propertyName).equal('foo');
            // .eql does deep comparison
            expect(em[registrySymbol]).to.eql(mockRegistry);
        });
    });

    /*
    ██████  ███████ ████████ ██████  ██ ███████ ██    ██ ███████
    ██   ██ ██         ██    ██   ██ ██ ██      ██    ██ ██
    ██████  █████      ██    ██████  ██ █████   ██    ██ █████
    ██   ██ ██         ██    ██   ██ ██ ██       ██  ██  ██
    ██   ██ ███████    ██    ██   ██ ██ ███████   ████   ███████
    */

    describe('Retrieving components', function() {
        let em = new EntityManager();
        let entity = em.createEntity();
        let ComponentClass = createComponentClass();
        let component = new ComponentClass();

        it('should return proper instance', function() {
            em.addComponent(component, entity);
            let retrieved = em.getComponent(component.constructor.name, entity);

            expect(retrieved).to.eql(component);
        });

        it('should work with constructor name or instance', function() {

            em.addComponent(component, entity);
            let retrieved = em.getComponent(component.constructor.name, entity);
            expect(retrieved).to.eql(component);
            retrieved = em.getComponent(component, entity);
            expect(retrieved).to.eql(component);

        });
    });


});
