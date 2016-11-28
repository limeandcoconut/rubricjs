import AbstractConstructError from 'abstract-class-error';

export default class System {
    constructor() {
        if (new.target === System) {
            throw new AbstractConstructError('Cannot construct class System instances directly');
        }

        if (this.update === System.prototype.update) {
            throw new AbstractConstructError('Method "update" must be overridden in class System');
        }

        this.events = [];

        let userUpdate = this.update;

        this.update = () => {
            this.clearEvents();

            userUpdate.call(this, arguments);
        };
    }

    update() {}

    init() {}

    publish(event) {
        this.events.push(event);
    }

    clearEvents() {
        this.events = [];
    }
}
