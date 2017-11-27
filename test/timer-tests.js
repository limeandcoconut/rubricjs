/* eslint-env mocha, es6 */
const Timer = require('../dist/timer.js')
const expect = require('chai').expect

describe('Timer Class', function() {

    let msg
    let timer
    let context
    let ticks

    beforeEach(function() {
        msg = ''
        context = {}
        ticks = Math.floor((Math.random() * 5) + 4)
        timer = new Timer({
            onFirst: () => {
                msg = 'first'
            },
            onEach: function() {
                msg = this.ticks
            },
            onLast: () => {
                msg = 'last'
            },
            context,
        }, ticks)
    })

    /*
     ██████ ██████  ███████  █████  ████████ ███████
    ██      ██   ██ ██      ██   ██    ██    ██
    ██      ██████  █████   ███████    ██    █████
    ██      ██   ██ ██      ██   ██    ██    ██
     ██████ ██   ██ ███████ ██   ██    ██    ███████
    */

    describe('On the subject of creating a timer instance, it ', function() {

        it('should throw if constructed with non function methods in config', function() {
            expect(() => {
                /* eslint-disable no-new */
                new Timer({onEach: 'asdfasdf'}, 100)
            }).to.throw(TypeError, /function/i)
        })

        it('should throw if constructed without duration', function() {
            expect(() => {
                /* eslint-disable no-new */
                new Timer({})
            }).to.throw(Error, /duration/i)
        })

        it('should allow 0 duration', function() {
            expect(() => {
                /* eslint-disable no-new */
                new Timer({}, 0)
            }).to.not.throw()
        })

        it('should allow duration in config', function() {
            expect(new Timer({duration: 100})).to.have.property('duration').equal(100)
        })

        it('should override config duration with duration parameter if both are passed', function() {
            expect(new Timer({duration: 100}, 200)).to.have.property('duration').equal(200)
        })

        it('should assign passed callbacks correctly', function() {
            timer = new Timer({
                onFirst: () => 'first',
                onLast: () => 'last',
                onEach: () => 'each',
            }, 100)

            expect(timer.onFirst()).to.equal('first')
            expect(timer.onLast()).to.equal('last')
            expect(timer.onEach()).to.equal('each')
        })

        it('should attach ticks to context if passed', function() {
            expect(context.ticks).to.be.a('number')
            expect(context.ticks).to.equal(ticks)
        })

    })

    /*
    ███████ ████████  █████  ██████  ████████
    ██         ██    ██   ██ ██   ██    ██
    ███████    ██    ███████ ██████     ██
         ██    ██    ██   ██ ██   ██    ██
    ███████    ██    ██   ██ ██   ██    ██
    */

    describe('On the subject of starting a timer, it ', function() {

        it('should toggle running flag when "start()" is called', function() {
            timer.start()
            expect(timer.running).to.be.true
        })

        it('should execute "onFirst" when "start()" is called', function() {
            timer.start()
            expect(msg).to.equal('first')
        })

    })

    /*
    ██████   █████  ██    ██ ███████ ███████
    ██   ██ ██   ██ ██    ██ ██      ██
    ██████  ███████ ██    ██ ███████ █████
    ██      ██   ██ ██    ██      ██ ██
    ██      ██   ██  ██████  ███████ ███████
    */

    describe('On the subject of pausing a timer, it ', function() {

        it('should toggle running flag when "pause()" is called', function() {
            timer.start()
            timer.pause()
            expect(timer.running).to.be.false
        })

    })

    /*
    ████████ ██  ██████ ██   ██
       ██    ██ ██      ██  ██
       ██    ██ ██      █████
       ██    ██ ██      ██  ██
       ██    ██  ██████ ██   ██
    */

    describe('On the subject of creating a timer instance, it ', function() {

        it('should execute "onEach" when "tick()" is called', function() {
            timer.tick()
            expect(/\d/.test(msg)).to.be.ok
        })

        it('should update context with ticks when "tick()" is called', function() {
            timer.tick()
            expect(context.ticks).to.equal(ticks - 1)
            timer.tick()
            expect(context.ticks).to.equal(ticks - 2)
        })

        it('should execute "onLast" when final "tick()" is called', function() {
            timer.start()
            timer.tick()

            /* eslint-disable no-unmodified-loop-condition */
            while (msg !== 'last') {
                timer.tick()
            }

            expect(timer.ticks).to.equal(-1)
            expect(msg).to.equal('last')
        })

    })
})
