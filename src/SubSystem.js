import AbstractConstructError from 'abstract-class-error';
import System from './System';

export default class SubSystem extends System {
    constructor() {
        super();

        this.inputQueue = [];

        let userUpdate = this.update;

        this.update = () => {
            if (this.publisher) {
                this.inputQueue = this.publisher.events.slice();
            } else if (this.inputQueue.length) {
                this.inputQueue = [];
            }

            userUpdate.call(this, arguments);
        };
    }

    init() {}

    subscribe(system) {
        if (!(system instanceof System)) {
            throw new TypeError('Argument must be instance of class System');
        }

        this.publisher = system;
    }

    unsubscribe() {
        this.publisher = null;
    }

    clearQueue() {
        this.inputQueue = [];
    }
}
