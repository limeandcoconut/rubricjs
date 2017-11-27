/* eslint-env mocha */
const EntityFactory = require('../dist/entity-factory.js')
const expect = require('chai').expect

let ef
let registrySymbol

describe('EntityFactory Class', function() {

    /*
     ██████ ██████  ███████  █████  ████████ ███████
    ██      ██   ██ ██      ██   ██    ██    ██
    ██      ██████  █████   ███████    ██    █████
    ██      ██   ██ ██      ██   ██    ██    ██
     ██████ ██   ██ ███████ ██   ██    ██    ███████
    */

    describe('On the subject of creating an instance, it ', function() {

        beforeEach(function() {
            ef = new EntityFactory()
            let keys = Reflect.ownKeys(ef)
            keys.forEach((key) => {
                if (typeof key === 'symbol') {
                    let prop = ef[key]
                    if (prop.constructor && prop.constructor.name === 'Map') {
                        registrySymbol = key
                    }
                }
            })

            if (!registrySymbol) {
                throw new Error('Cannot reflect keys from EntityFactory class')
            }
        })

        it('should result private variable constructorRegistry', function() {
            expect(ef.constructorRegistry).to.be.undefined
            expect(registrySymbol).to.be.ok
        })
    })

    /*
     ██████  ██████  ███    ██ ███████ ████████ ██████  ██    ██  ██████ ████████  ██████  ██████  ███████
    ██      ██    ██ ████   ██ ██         ██    ██   ██ ██    ██ ██         ██    ██    ██ ██   ██ ██
    ██      ██    ██ ██ ██  ██ ███████    ██    ██████  ██    ██ ██         ██    ██    ██ ██████  ███████
    ██      ██    ██ ██  ██ ██      ██    ██    ██   ██ ██    ██ ██         ██    ██    ██ ██   ██      ██
     ██████  ██████  ██   ████ ███████    ██    ██   ██  ██████   ██████    ██     ██████  ██   ██ ███████
    */

    describe('On the subject of creating an instance, it ', function() {

        it('should throw if passed invalid parameters', function() {
            expect(() => {
                ef.registerConstructor(1, () => {})
            }).to.throw(TypeError, /parameter/i)

            expect(() => {
                ef.registerConstructor('foo', 'constructorName')
            }).to.throw(TypeError, /parameter/i)
        })

        it('should store function in registry', function() {
            ef.registerConstructor('test', () => {
                return 'abc'
            })

            expect(ef[registrySymbol]).to.have.property('size').equals(1)
        })

        it('should result in a map entry keyed properly', function() {
            let constructorName = 'test'

            ef.registerConstructor(constructorName, () => {
                return 'abc'
            })

            let constructorKey = constructorName.charAt(0).toUpperCase() + constructorName.slice(1)

            expect(ef[registrySymbol].has(constructorKey)).to.be.true
        })

        it('should result proxy function calls similar to "createTest" to the stored constructor', function() {
            ef.registerConstructor('test', function() {
                return 'abc'
            })

            expect(ef.createTest()).to.equal('abc')
        })

        it('should execute in proper scope', function() {
            ef.registerConstructor('thisTest', function() {
                return this.constructor.name
            })

            let context = ef.createThisTest()
            expect(context).to.equal(EntityFactory.name)
        })

        it('should not trap access to functions that are not stored', function() {
            expect(() => {
                ef.createOtherTest()
            }).to.throw(TypeError)
        })

    })
})
