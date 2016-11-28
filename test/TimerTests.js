import Timer from '../src/Timer.js';
import TimerManager from '../src/TimerManager.js';
var expect = require('chai').expect;

/* eslint-disable no-undef */
describe('Timer class', function() {

    describe('Creating Class', function() {

        it('should throw if constructed with non function methods in config', function() {
            expect(() => {
                /* eslint-disable no-new */
                new Timer({onEach: 'asdfasdf'}, 100);
            }).to.throw(Error, /function/i);
        });

        it('should throw if constructed without duration', function() {
            expect(() => {
                /* eslint-disable no-new */
                new Timer({});
            }).to.throw(Error, /duration/i);
        });

        it('should allow duration in config', function() {
            expect(new Timer({duration: 100})).to.have.property('duration').equal(100);
        });

        it('should override config duration with duration parameter if both are passed', function() {
            expect(new Timer({duration: 100}, 200)).to.have.property('duration').equal(200);
        });

        it('should assign passed callbacks correctly', function() {
            let timer = new Timer({
                onFirst: () => 'first',
                onLast: () => 'last',
                onEach: () => 'each',
            }, 100);

            expect(timer.onFirst()).to.equal('first');
            expect(timer.onLast()).to.equal('last');
            expect(timer.onEach()).to.equal('each');
        });

        it('should attach ticks to context if passed', function() {
            let context = {};
            /* eslint-disable no-new */
            new Timer({
                onFirst: () => 'first',
                context,
            }, 300);

            expect(context).to.have.property('ticks');
            expect(context.ticks).to.equal(300);
        });

    });

    describe('Running Timer', function() {
        let msg = '';
        let timer = new Timer({
            onFirst: () => {msg = 'first';},
            onEach: function() {msg = this.ticks;},
            onLast: () => {msg = 'last';},
            context: {},
        }, Math.floor((Math.random() * 5) + 4) );

        it('should toggle funning flag when "start()" is called', function() {
            timer.start()
            expect(timer.running).to.equal(true);
        });

        it('should execute "onFirst" when "start()" is called', function() {
            expect(msg).to.equal('first');
        });

        it('should execute "onEach" when "tick()" is called', function() {
            timer.tick();
            expect(/\d/.test(msg)).to.equal(true);
        });

        it('should toggle running flag when "pause()" is called', function() {
            timer.pause();
            expect(timer.running).to.equal(false);
        });

        it('should execute "onLast" when final "tick()" is called', function() {
            do {
                expect(/\d/.test(msg)).to.equal(true);
                timer.tick();
            } while (msg !== 'last')

            expect(timer.ticks).to.equal(-1);
            expect(msg).to.equal('last');
        });

    });

});

describe('Timer Manager class', function() {
    let tm;
    let registryKey;
    let timer;

    before(function() {
        tm = new TimerManager();

        let keys = Reflect.ownKeys(tm);
        keys.forEach((key) => {
            if (typeof key === 'symbol') {
                let prop = tm[key];
                if (prop.constructor && prop.constructor.name) {
                    registryKey = key;
                }
            }
        });

        timer = new Timer({onEach: () => 'each'}, 3);
    });

    /*
     ██████ ██████  ███████  █████  ████████ ███████
    ██      ██   ██ ██      ██   ██    ██    ██
    ██      ██████  █████   ███████    ██    █████
    ██      ██   ██ ██      ██   ██    ██    ██
     ██████ ██   ██ ███████ ██   ██    ██    ███████
    */

    describe('Creating Manager', function() {

        it('should result private list', function() {
            // expect(tm.timerIds).to.be.undefined;
            expect(tm.timerRegistry).to.be.undefined;
        });

        it('should result in empty list', function() {
            // expect(tm[idsKey]).to.have.length(0);
            expect(tm[registryKey]).to.have.property('size').equal(0);
        });

    });

    /*
    ██████  ███████  ██████  ██ ███████ ████████ ███████ ██████
    ██   ██ ██      ██       ██ ██         ██    ██      ██   ██
    ██████  █████   ██   ███ ██ ███████    ██    █████   ██████
    ██   ██ ██      ██    ██ ██      ██    ██    ██      ██   ██
    ██   ██ ███████  ██████  ██ ███████    ██    ███████ ██   ██
    */

    describe('On the subject of registering timers, it ', function() {
        let timerId;

        before(function() {
            timerId = tm.registerTimer(timer);
        });

        it('should result in expected ids', function() {
            expect(tm[registryKey].keys().next().value).to.equal(10);
        });

        it('should not allow duplicate entries for a timer', function() {
            expect(tm.registerTimer(timer)).to.equal(timerId);
            expect(tm[registryKey]).to.have.property('size').equal(1);
        });

        it('should not allow non instance of timer class', function() {
            expect(() => {
                tm.registerTimer([]);
            }).to.throw(Error, /timer/i);

            expect(tm[registryKey]).to.have.property('size').equal(1);
        });
    });

    /*
    ██████  ███████ ███    ███  ██████  ██    ██ ███████
    ██   ██ ██      ████  ████ ██    ██ ██    ██ ██
    ██████  █████   ██ ████ ██ ██    ██ ██    ██ █████
    ██   ██ ██      ██  ██  ██ ██    ██  ██  ██  ██
    ██   ██ ███████ ██      ██  ██████    ████   ███████
    */

    describe('onthe subject of removing timers, it ', function() {

        it('should result in empty list', function() {
            tm.removeTimer(timer.id);
            expect(tm[registryKey]).to.have.property('size').equal(0);
        });

        it('should allow timer instance to be passed instead of id', function() {
            tm.registerTimer(timer);

            expect(() => {
                tm.removeTimer(timer);
            }).to.not.throw();
            expect(tm[registryKey]).to.have.property('size').equal(0);
        });

        it('should not allow non instance of timer class', function() {
            tm.registerTimer(timer);

            expect(() => {
                tm.removeTimer([]);
            }).to.throw(Error, /timer/i);

            expect(tm[registryKey]).to.have.property('size').equal(1);
        });

        it('should not return false if timer is not registered', function() {
            expect(tm.removeTimer(new Timer({}, 1))).to.equal(false);
        });

        it('should clear all', function() {
            tm.registerTimer(timer);
            tm.removeAllTimers();

            expect(tm[registryKey]).to.have.property('size').equal(0);
        });
    });

    /*
    ██████  ███████ ████████ ██████  ██ ███████ ██    ██ ███████
    ██   ██ ██         ██    ██   ██ ██ ██      ██    ██ ██
    ██████  █████      ██    ██████  ██ █████   ██    ██ █████
    ██   ██ ██         ██    ██   ██ ██ ██       ██  ██  ██
    ██   ██ ███████    ██    ██   ██ ██ ███████   ████   ███████
    */

    describe('On the subject of retrieving timers, it ', function() {

        before(function() {
            tm.registerTimer(timer);
        });

        it('should return timer object if found', function() {
            let t = tm.getTimer(timer.id);
            expect(t).to.equal(timer);
        });

        it('should return false if not found', function() {
            let t = tm.getTimer('asdfasdf');
            expect(t).to.equal(false);
        });

        it('should allow timer instance to be passed instead of id', function() {
            tm.registerTimer(timer);
            let t;
            expect(() => {
                t = tm.getTimer(timer);
            }).to.not.throw();
            expect(t).to.equal(timer);
        });

        it('should return false if object not found', function() {
            let t = tm.getTimer(new Timer({}, 1));
            expect(t).to.equal(false);
        });

    });

    /*
    ████████ ██  ██████ ██   ██
       ██    ██ ██      ██  ██
       ██    ██ ██      █████
       ██    ██ ██      ██  ██
       ██    ██  ██████ ██   ██
    */

    describe('On the subject of thie tick method, it ', function() {
        let timer2;
        let timer3;
        let t1 = Math.ceil(Math.random() * 3);
        let t2 = Math.ceil(Math.random() * 7);
        let t3 = Math.ceil(Math.random() * 2);

        before(function() {
            tm.removeAllTimers();
            timer = new Timer({}, t1);
            timer2 = new Timer({}, t2);
            timer3 = new Timer({}, t3);
            tm.registerTimer(timer);
            tm.registerTimer(timer2);
            tm.registerTimer(timer3);
            timer.start();
            timer2.start();
        });

        it('should tick all running timers', function() {
            tm.tick();
            expect(timer).to.have.property('ticks').equal(t1 - 1);
            expect(timer2).to.have.property('ticks').equal(t2 - 1);
        });

        it('should not tick paused timers', function() {
            tm.tick();
            expect(timer3).to.have.property('ticks').equal(t3);
        });

    });

});
