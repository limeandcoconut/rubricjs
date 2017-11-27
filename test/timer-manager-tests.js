/* eslint-env mocha, es6 */
/* eslint-disable no-unused-expressions */
const Timer = require('../dist/timer.js')
const TimerManager = require('../dist/timer-manager.js')
const expect = require('chai').expect

describe('TimerManager and Timer Classes', function() {

    let timer
    let tm
    let registryKey
    let timerId

    let timer2
    let timer3
    let t1
    let t2
    let t3

    beforeEach(function() {
        tm = new TimerManager()

        /* eslint-disable no-undef */
        let keys = Reflect.ownKeys(tm)
        /* eslint-enable no-undef */
        keys.forEach((key) => {
            if (typeof key === 'symbol') {
                let prop = tm[key]
                if (prop.constructor && prop.constructor.name) {
                    registryKey = key
                }
            }
        })

        timer = new Timer({onEach: () => 'each'}, 3)
        timerId = tm.registerTimer(timer)
    })

    /*
     ██████ ██████  ███████  █████  ████████ ███████
    ██      ██   ██ ██      ██   ██    ██    ██
    ██      ██████  █████   ███████    ██    █████
    ██      ██   ██ ██      ██   ██    ██    ██
     ██████ ██   ██ ███████ ██   ██    ██    ███████
    */

    describe('On the subject of creating a TimerManager instance, it ', function() {

        it('should result private list', function() {
            let tm2 = new TimerManager()
            expect(tm2.timerRegistry).to.be.undefined
        })

        it('should result in empty list', function() {
            let tm2 = new TimerManager()
            expect(tm2[registryKey]).to.have.property('size').equal(0)
        })

    })

    /*
    ██████  ███████  ██████  ██ ███████ ████████ ███████ ██████
    ██   ██ ██      ██       ██ ██         ██    ██      ██   ██
    ██████  █████   ██   ███ ██ ███████    ██    █████   ██████
    ██   ██ ██      ██    ██ ██      ██    ██    ██      ██   ██
    ██   ██ ███████  ██████  ██ ███████    ██    ███████ ██   ██
    */

    describe('On the subject of registering a timer, it ', function() {

        it('should result in expected ids', function() {
            expect(tm[registryKey].keys().next().value).to.equal(10)
        })

        it('should search for free ids if max reached', function() {
            tm.lowestFreeId = tm.maxId

            expect(tm.registerTimer(new Timer({}, 0))).to.equal(0)
            expect(tm.registerTimer(new Timer({}, 0))).to.equal(1)
        })

        it('should throw if no ids available', function() {
            tm.maxId = 0

            expect(() => {
                tm.registerTimer(new Timer({}, 0))
            }).to.throw(RangeError)
        })

        it('should not allow duplicate entries for a timer', function() {
            expect(tm.registerTimer(timer)).to.equal(timerId)
            expect(tm[registryKey].size).to.equal(1)
        })

        it('should not allow non instance of timer class', function() {
            expect(() => {
                tm.registerTimer([])
            }).to.throw(TypeError, /timer/i)

            expect(tm[registryKey].size).to.equal(1)
        })

    })

    /*
    ██████  ███████ ███    ███  ██████  ██    ██ ███████
    ██   ██ ██      ████  ████ ██    ██ ██    ██ ██
    ██████  █████   ██ ████ ██ ██    ██ ██    ██ █████
    ██   ██ ██      ██  ██  ██ ██    ██  ██  ██  ██
    ██   ██ ███████ ██      ██  ██████    ████   ███████
    */

    describe('On the subject of removing a registered timer, it ', function() {

        it('should result in empty list', function() {
            tm.removeTimer(timerId)
            expect(tm[registryKey]).to.have.property('size').equals(0)
        })

        it('should allow timer instance to be passed instead of id', function() {
            expect(() => {
                tm.removeTimer(timer)
            }).to.not.throw()
            expect(tm[registryKey].size).equal(0)
        })

        it('should not allow non instance of timer class', function() {
            expect(() => {
                tm.removeTimer([])
            }).to.throw(TypeError, /timer/i)

            expect(tm[registryKey].size).equal(1)
        })

        it('should return false if timer is not registered', function() {
            expect(tm.removeTimer(new Timer({}, 1))).to.be.false
        })

        it('should clear all', function() {
            tm.removeAllTimers()
            expect(tm[registryKey].size).equal(0)
        })

    })

    /*
    ██████  ███████ ████████ ██████  ██ ███████ ██    ██ ███████
    ██   ██ ██         ██    ██   ██ ██ ██      ██    ██ ██
    ██████  █████      ██    ██████  ██ █████   ██    ██ █████
    ██   ██ ██         ██    ██   ██ ██ ██       ██  ██  ██
    ██   ██ ███████    ██    ██   ██ ██ ███████   ████   ███████
    */

    describe('On the subject of retrieving a timer, it ', function() {

        it('should return timer object if found', function() {
            let t = tm.getTimer(timerId)
            expect(t).to.eql(timer)
        })

        it('should allow timer instance to be passed instead of id', function() {
            let t
            expect(() => {
                t = tm.getTimer(timer)
            }).to.not.throw()
            expect(t).to.equal(timer)
        })

        it('should return false if not found', function() {
            let t = tm.getTimer('asdfasdf')
            expect(t).to.be.false
        })

        it('should return false if object not found', function() {
            let t = tm.getTimer(new Timer({}, 1))
            expect(t).to.be.false
        })

    })

    /*
    ████████ ██  ██████ ██   ██
       ██    ██ ██      ██  ██
       ██    ██ ██      █████
       ██    ██ ██      ██  ██
       ██    ██  ██████ ██   ██
    */

    describe('On the subject of creating a TimerManager instance, it ', function() {

        beforeEach(function() {
            t1 = Math.ceil(Math.random() * 3)
            t2 = Math.ceil(Math.random() * 7)
            t3 = Math.ceil(Math.random() * 2)

            tm.removeAllTimers()

            timer = new Timer({}, t1)
            timer2 = new Timer({}, t2)
            timer3 = new Timer({}, t3)
            tm.registerTimer(timer)
            tm.registerTimer(timer2)
            tm.registerTimer(timer3)

            timer.start()
            timer2.start()
        })

        it('should tick all running timers', function() {
            tm.tick()
            expect(timer.ticks).to.equal(t1 - 1)
            expect(timer2.ticks).to.equal(t2 - 1)
        })

        it('should not tick paused timers', function() {
            tm.tick()
            expect(timer3.ticks).to.equal(t3)
        })
    })

})
