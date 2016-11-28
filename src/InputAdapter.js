import AbstractConstructError from 'abstract-class-error';

class InputAdapter {
    constructor() {
        if (new.target === InputAdapter) {
            throw new AbstractConstructError('Cannot construct class InputAdapter instances directly');
        }

        if (this.init === InputAdapter.prototype.init) {
            throw new AbstractConstructError('Method "init" must be overridden in class InputAdapter');
        }
    }

    init() {
    }
}

export default InputAdapter;
