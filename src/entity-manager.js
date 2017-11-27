/* eslint-env es6 */
/**
 * A module for managing entities and components.
 * @module EntityManager
 */

/**
 * Key for private registry.
 * @type {Symbol}
 * @private
 */
let componentRegistry = Symbol()
/**
 * Key for private a uid Array.
 * @type {Symbol}
 * @private
 */
let entityIds = Symbol()

/**
* Class for managing entities and components.
*/
// * @class EntityManager
class EntityManager {

    /**
     * @constructor
     */
    constructor() {
        this.lowestFreeId = 10
        /**
         * Internal Array for storing uids.
         * @private
         */
        this[entityIds] = []

        /**
         * Internal Map for storing Maps of components.
         * @private
         */
        this[componentRegistry] = new Map()
    }

    /**
     * Returns a new unique id.
     * @method getNewId
     * @throws {RangeError}   Throws if there are no unique numbers under MAX_SAFE_INTEGER.
     * @return {number}       A unique id number.
     */
    getNewId() {
        if (this.lowestFreeId < this.maxId) {
            let id = this.lowestFreeId
            this.lowestFreeId += 1
            return id
        }

        let ids = this[entityIds]
        for (let i = 0, iLen = this.maxId; i < iLen; i++) {
            if (ids.indexOf(i) === -1) {
                return i
            }
        }

        throw new RangeError('Maximum entity ids registered, approaching unsafe value')
    }

    /**
     * Creates and records a new entity.
     * @method createEntity
     * @return {number}       A unique id number representing an entity
     */
    createEntity() {
        let id = this.getNewId()
        this[entityIds].push(id)
        return id
    }

    /**
     * Removes all components associated with an entity's id, and removes the id from the internal list.
     * @method deleteEntity
     * @param  {number}     entityId   The id of an entity.
     */
    deleteEntity(entityId) {
        this[componentRegistry].forEach((componentsOfType/* , componentName */) => {
            componentsOfType.delete(entityId)
        })

        this[entityIds].splice(this[entityIds].indexOf(entityId), 1)
    }

    /**
     * Confirms that the argument passed is an object with a constructor or a string representing a constructor,
     * and returns the name of the constructor.
     * @method validateComonentName
     * @param  {string|object}  componentName   An object with a construtor,
     *                                              or a string representing such a constructor.
     * @throws {TypeError}                      Throws if a string was not passed
     *                                              and no constructor name can be extracted from the argument.
     * @return {string}                         The name of a constructor for a component.
     */
    validateComonentName(componentName) {
        if (typeof componentName === 'object') {
            componentName = componentName.constructor.name
        }
        if (typeof componentName !== 'string') {
            throw new TypeError('Unexpected value for component name')
        }

        return componentName
    }

    /**
     * Returns a Map of component instances; creates one if no such Map exists.
     * @method getComponentsByType
     * @param  {string} componentName     The name of a component constructor
     * @return {Map}                      A map containing any components of specified class (or a new, empty, map).
     */
    getComponentsByType(componentName) {
        let componentsOfType = this[componentRegistry].get(componentName)

        if (typeof componentsOfType === 'undefined') {
            componentsOfType = new Map()
            this[componentRegistry].set(componentName, componentsOfType)
        }

        return componentsOfType
    }

    /**
     * Stores a component in Maps by component class name and entity id.
     * @method addComponent
     * @param  {object}     component     An object to be stored in relation to an entity.
     * @param  {number}     entityId      The unique id of an entity to attach the component to.
     * @return {object}                   The component passed.
     */
    addComponent(component, entityId) {
        let componentName = this.validateComonentName(component)
        let componentsOfType = this.getComponentsByType(componentName)
        componentsOfType.set(entityId, component)
        return component
    }

    /**
     * Removes a component form the registry and returns it.
     * @method removeComponent
     * @param  {string|object}  componentName     The class name of the object to search for (or the object itself).
     * @param  {number}         entityId          The uid of the entity to remove it from.
     * @return {object|boolean}                   The object removed or false if nothing is found.
     */
    removeComponent(componentName, entityId) {
        componentName = this.validateComonentName(componentName)
        let componentsOfType = this[componentRegistry].get(componentName)

        if (typeof componentsOfType === 'undefined' || !componentsOfType.has(entityId)) {
            return false
        }

        let component = componentsOfType.get(entityId)
        componentsOfType.delete(entityId)
        return component
    }

    /**
     * Returns the component of specified type for specified entity.
     * @method getComponent
     * @param  {string|object}      componentName     The class name of the object to search for (or the object itself).
     * @param  {number}             entityId          The uid of the entity to remove it from.
     * @return {object|undefined}                     The object stored or undefined if nothing is found.
     */
    getComponent(componentName, entityId) {
        componentName = this.validateComonentName(componentName)
        let componentsOfType = this.getComponentsByType(componentName)
        return componentsOfType.get(entityId)
    }

    /**
     * Returns a list of entities that each have the specified component
     * @method getEntitiesWithComponent
     * @param  {string|object}      componentName     The class name of the object to search for (or the object itself).
     * @return {Array}                                An Array containing any entities that have the specified component.
     */
    getEntitiesWithComponent(componentName) {
        componentName = this.validateComonentName(componentName)
        let componentsOfType = this.getComponentsByType(componentName)

        let foundEntities = []

        // TODO: Perf this to see if returning early is notably faster than allowing a forEach to fail on an empty map
        if (!componentsOfType.size) {
            return foundEntities
        }

        let keys = componentsOfType.keys()
        let key = keys.next().value

        while (typeof key !== 'undefined') {
            foundEntities.push(Number(key))
            key = keys.next().value
        }

        return foundEntities
    }

    /**
     * Returns a list of entites that each have all of the specified components
     * @method getEntitiesWithComponents
     * @param  {Array}          componentNames          An array of components or component names to search for.
     * @return {Array}                                  An Array containing any entities that have the specified component.
     */
    getEntitiesWithComponents(componentNames) {
        if (!Array.isArray(componentNames)) {
            throw new TypeError('Argument is required to be an array')
        }
        componentNames = componentNames.slice()

        let commonEntities = this.getEntitiesWithComponent(this.validateComonentName(componentNames[0]))
        componentNames.shift()

        if (!commonEntities.length) {
            return commonEntities
        }

        // TODO: Perf this similariliy to above perf
        componentNames.some((componentName) => {
            componentName = this.validateComonentName(componentName)
            let entitiesWithComponent = this.getEntitiesWithComponent(componentName)

            commonEntities = commonEntities.filter(entity => entitiesWithComponent.indexOf(entity) !== -1)

            if (!commonEntities.length) {
                return []
            }
            return false
        })

        return commonEntities
    }

    /**
     * Returns all entity ids that are stored.
     * @method getAllEntities
     * @return {Array}        All entity uids stored.
     */
    getAllEntities() {
        // Spread operator duplicates array here
        return [...this[entityIds]]
    }

    /**
     * Remove all entity uids and all components stored (because each component is dependent on an entity).
     * @method deleteAllEntities
     */
    deleteAllEntities() {
        // Consider switch to this[entityIds].forEach(id => this.deleteEntity());
        this[entityIds] = []
        this[componentRegistry].clear()
    }
}

/**
 * Maximum id that EntityManager will assign.
 * @type {number}
 * @static
 * @memberOf EntityManager
 */
EntityManager.prototype.maxId = Number.MAX_SAFE_INTEGER

module.exports = EntityManager
