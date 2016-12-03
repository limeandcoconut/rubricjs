let registryKey = Symbol();

export default class TimerManager {
    constructor() {
        // FIXME: Generate uids
        this.lowestFreeId = 10;
        this[registryKey] = new Map();
    }

    getNewId() {
        if (this.lowestFreeId < this.maxId) {
            let id = this.lowestFreeId;
            this.lowestFreeId += 1;
            return id;
        }

        let timerRegistry = this[registryKey];
        for (let i = 0, iLen = this.maxId; i < iLen; i++) {
            if (!timerRegistry.has(i)) {
                return i;
            }
        }

        throw new RangeError('Maximum timer ids registered, approaching unsafe value');
    }

    registerTimer(timer) {
        if (!timer.constructor || timer.constructor.name !== 'Timer') {
            throw Error('Argument must be instance of class Timer');
        }

        let timerRegistry = this[registryKey];
        if (timer.id && timerRegistry.has(timer.id)) {
            return timer.id;
        }

        let id = this.getNewId();
        timerRegistry.set(id, timer);
        timer.id = id;
        return id;
    }

    removeTimer(timerId) {
        if (typeof timerId === 'object') {
            if (timerId.constructor.name !== 'Timer') {
                throw TypeError('Argument of type object must be instance of class Timer');
            }

            timerId = timerId.id;
        }

        let registry = this[registryKey];

        if (registry.has(timerId)) {
            registry.delete(timerId);
            return timerId;
        }

        return false;
    }

    removeAllTimers() {
        this[registryKey] = new Map();
    }

    getTimer(timerId) {
        if (typeof timerId === 'object') {

            timerId = timerId.id;
            if (typeof timerId === 'undefined') {
                return false;
            }
        }

        let registry = this[registryKey];
        if (registry.has(timerId)) {
            return registry.get(timerId);
        }

        return false;
    }

    tick() {
        this[registryKey].forEach((timer, id) => {
            if (timer.running) {
                timer.tick();
            }
        });
    }
}

TimerManager.prototype.maxId = Number.MAX_SAFE_INTEGER;
