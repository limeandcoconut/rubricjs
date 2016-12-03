export default class Timer {
    constructor(config, duration) {
        if ((config.onFirst && typeof config.onFirst !== 'function') ||
            (config.onEach && typeof config.onEach !== 'function') ||
            (config.onLast && typeof config.onLast !== 'function')) {
            throw new TypeError('Timer configuration functions "onEach", "onFirst", and "onLast" must be functions');
        }

        this.duration = (typeof duration === 'number') ? duration : config.duration;

        if (typeof this.duration !== 'number') {
            throw new TypeError('Duration is required');
        }

        this.ticks = this.duration;

        if (config.context && typeof config.context === 'object') {
            let context = config.context;
            context.ticks = this.duration;

            if (config.onEach) {
                this.onEach = () => {
                    config.onEach.apply(context);
                };
            }
            if (config.onFirst) {
                this.onFirst = () => {
                    config.onFirst.apply(context);
                };
            }
            if (config.onLast) {
                this.onLast = () => {
                    config.onLast.apply(context);
                };
            }

            this.context = context;
        } else {
            this.onFirst = config.onFirst || null;
            this.onLast = config.onLast || null;
            this.onEach = config.onEach || null;
        }

        this.running = false;

        // this.ownId = V.tm.registerTimer(this);
        // console.log(this);

    }

    start() {
        if (this.ticks === this.duration && this.onFirst) {
            this.onFirst();
        }
        this.running = true;
    }

    tick() {
        if (this.onEach) {
            this.onEach();
        }

        if (this.ticks === 0) {
            if (this.onLast) {
                this.onLast();
            }
            this.running = false;
        }

        this.ticks -= 1;

        if (this.context) {
            this.context.ticks = this.ticks;
        }
    }

    pause() {
        this.running = false;
    }
}
