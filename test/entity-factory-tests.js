/* eslint-env mocha */
const EntityFactory = require('../dist/entity-factory.js')
const test = require('ava')

// CREATING

test.beforeEach((t) => {
    t.ef = new EntityFactory()
    let ef = t.ef
    let keys = Reflect.ownKeys(ef)
    keys.forEach((key) => {
        if (typeof key === 'symbol') {
            let prop = ef[key]
            if (prop.constructor && prop.constructor.name === 'Map') {
                t.registrySymbol = key
            }
        }
    })

    if (!registrySymbol) {
        throw new Error('Cannot reflect keys from EntityFactory class')
    }
})

test('Constructing should result in private variable constructorRegistry.', (t) => {
    t.true(typeof ef.constructorRegistry === 'undefined')
    t.truthy(registrySymbol)
})

// CONSTRUCTORS

test('Creating an instance should throw if passed invalid parameters', (t) => {
    let ef = t.ef
    t.throws(() => {
        ef.registerConstructor(1, () => {})
    },
    TypeError, /parameter/i)

    t.throws(() => {
        ef.registerConstructor('foo', 'constructorName')
    },
    TypeError, /parameter/i)
})

test('Creating an instance should store function in registry', (t) => {
    let ef = t.ef
    let registrySymbol = t.registrySymbol
    ef.registerConstructor('test', () => {
        return 'abc'
    })

    t.true(ef[registrySymbol].size === 1)
})

test('Creating an instance should result in a map entry keyed properly', (t) => {
    let ef = t.ef
    let registrySymbol = t.registrySymbol
    let constructorName = 'test'

    ef.registerConstructor(constructorName, () => {
        return 'abc'
    })

    let constructorKey = constructorName.charAt(0).toUpperCase() + constructorName.slice(1)

    t.true(ef[registrySymbol].has(constructorKey))
})

test('Creating an instance should result proxy function calls similar to "createTest" to the stored constructor', (t) => {
    let ef = t.ef

    ef.registerConstructor('test', function() {
        return 'abc'
    })

    t.true(ef.createTest() === 'abc')
})

test('Creating an instance should execute in proper scope', (t) => {
    let ef = t.ef

    ef.registerConstructor('thisTest', function() {
        return this.constructor.name
    })

    let context = ef.createThisTest()
    t.true(context === EntityFactory.name)
})

test('Creating an instance should not trap access to functions that are not stored', (t) => {
    t.throws(() => {
        t.ef.createOtherTest()
    },
    TypeError)
})

