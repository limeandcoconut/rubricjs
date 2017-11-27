/* eslint-env es6 */
/**
 * A module for creating timers synchronized with Rubric's engine.
 * @module
 */

/**
 * Class for performing action synchronized with Rubric's engine.
 */
// * @class Timer
class Timer {

    /**
     * @constructor
     * @param {object}      config      A config object containing optional onFirst, onLast, and onEach callbacks as
     *                                  well as an optional syntax for duration.
     * @param {object}      duration    The number of ticks that this timer should run for (relative to Rubric's
     *                                  engine).
     * @throws {TypeError}              Throws if any of the parameters are not of the expected types.
     */
    constructor(config, duration) {
        if ((config.onFirst && typeof config.onFirst !== 'function') ||
            (config.onEach && typeof config.onEach !== 'function') ||
            (config.onLast && typeof config.onLast !== 'function')) {
            throw new TypeError('Timer configuration functions "onEach", "onFirst", and "onLast" must be functions')
        }

        this.duration = (typeof duration === 'number') ? duration : config.duration

        if (typeof this.duration !== 'number') {
            throw new TypeError('Duration is required')
        }

        this.ticks = this.duration

        if (config.context && typeof config.context === 'object') {
            let context = config.context
            context.ticks = this.duration

            if (config.onEach) {
                this.onEach = () => {
                    config.onEach.apply(context)
                }
            }
            if (config.onFirst) {
                this.onFirst = () => {
                    config.onFirst.apply(context)
                }
            }
            if (config.onLast) {
                this.onLast = () => {
                    config.onLast.apply(context)
                }
            }

            this.context = context
        } else {
            this.onFirst = config.onFirst || null
            this.onLast = config.onLast || null
            this.onEach = config.onEach || null
        }

        this.running = false
    }

    /**
     * Set the timer to running and if it has not been started yet call the onFirst callback if one was provided.
     * @method start
     */
    start() {
        if (this.ticks === this.duration && this.onFirst) {
            this.onFirst()
        }
        this.running = true
    }

    /**
     * Runs given user callbacks at the appropriate times for each tick of the Rubric engine. Adjusts the ticks property
     * if and assigns it to the user provided context (if one was given)
     * @method tick
     */
    tick() {
        if (this.onEach) {
            this.onEach()
        }

        if (this.ticks === 0) {
            if (this.onLast) {
                this.onLast()
            }
            this.running = false
        }

        this.ticks -= 1

        if (this.context) {
            this.context.ticks = this.ticks
        }
    }

    /**
     * Stop the timer if it is running.
     * @method pause
     */
    pause() {
        this.running = false
    }
}

module.exports = Timer
