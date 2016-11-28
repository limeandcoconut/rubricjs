let componentRegistry = Symbol();
let entityIds = Symbol();

export default class EntityManager {
    constructor() {
        this.lowestFreeId = 10;
        this[entityIds] = [];
        this[componentRegistry] = new Map();
    }

    getNewId() {
        if (this.lowestFreeId < this.maxId) {
            let id = this.lowestFreeId;
            this.lowestFreeId += 1;
            return id;
        } else {
            let entityIds = this[entityIds];
            for (let i = 0, iLen = this.maxId; i < iLen; i++) {
                if (entityIds.indexOf(i) === -1) {
                    return i;
                }
            }

            throw new RangeError('Maximum entity ids registered, approaching unsafe value');
        }
    }

    createEntity() {
        let id = this.getNewId();
        this[entityIds].push(id);
        return id;
    }

    deleteEntity(entityId) {
        this[componentRegistry].forEach((componentsOfType, componentName) => {
            componentsOfType.delete(entityId);
        });

        this[entityIds].splice(this[entityIds].indexOf(entityId), 1);
    }


    // getEntity(entityId) {
    //     return entityId;
    // }

    // validateEntity(entityId) {
    //     return this[entityIds].indexOf(entityId) !== -1;
    // }


    validateComonentName(componentName) {
        if (typeof componentName === 'object') {
            componentName = componentName.constructor.name;
        }

        if (typeof componentName !== 'string') {
            throw new TypeError('Unexpected value for component name');
        }

        return componentName;
    }

    getComponentsByType(componentName) {
        let componentsOfType = this[componentRegistry].get(componentName);

        if (typeof componentsOfType === 'undefined') {
            componentsOfType = new Map();
            this[componentRegistry].set(componentName, componentsOfType);
        }

        return componentsOfType;
    }

    addComponent(component, entityId) {
        let componentName = this.validateComonentName(component);
        let componentsOfType = this.getComponentsByType(componentName);
        componentsOfType.set(entityId, component);
        return component;
    }

    removeComponent(componentName, entityId) {
        componentName = this.validateComonentName(componentName);
        let componentsOfType = this[componentRegistry].get(componentName);

        if (typeof componentsOfType === 'undefined' || !componentsOfType.has(entityId)) {
            return false;
        }

        let component = componentsOfType.delete(entityId);
        return component;
    }

    getComponent(componentName, entityId) {
        componentName = this.validateComonentName(componentName);
        let componentsOfType = this.getComponentsByType(componentName);
        return componentsOfType.get(entityId);
    }

    getEntitiesWithComponent(componentName) {
        componentName = this.validateComonentName(componentName);
        let componentsOfType = this.getComponentsByType(componentName);

        let foundEntities = [];

        // TODO: Perf this to see if returning early is notably faster than allowing a forEach to fail on an empty map
        if (!componentsOfType.size) {
            return foundEntities;
        }

        let keys = componentsOfType.keys();
        let key = keys.next().value;

        while (typeof key !== 'undefined') {
            foundEntities.push(Number(key));
            key = keys.next().value;
        }

        return foundEntities;
    }

    getEntitiesWithComponents(componentNames) {
        if (!Array.isArray(componentNames)) {
            throw new TypeError('Argument is required to be an array');
        }

        let commonEntities = this.getEntitiesWithComponent(this.validateComonentName(componentNames[0]));
        componentNames.shift();

        if (!commonEntities.length) {
            return commonEntities;
        }

        //TODO: Perf this similariliy to above perf
        componentNames.some((componentName) => {
            // componentName = this.validateComonentName(componentName);
            let entitiesWithComponent = this.getEntitiesWithComponent(componentName);

            commonEntities = commonEntities.filter(entity => entitiesWithComponent.indexOf(entity) !== -1);

            if (!commonEntities.length) {
                return true;
            }
        });

        return commonEntities;
    }

    getAllEntities() {
        return [...this[entityIds]];
    }

    deleteAllEntities() {
        // Consider switch to this[entityIds].forEach(id => this.deleteEntity());
        this[entityIds] = [];
        this[componentRegistry].clear();
    }
}

EntityManager.prototype.maxId = Number.MAX_SAFE_INTEGER;
