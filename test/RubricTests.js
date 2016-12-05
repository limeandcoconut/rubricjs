const ava = require('ava').default;
const Rubric = require('../src/Rubric.js').default;
const InputAdapter = require('../src/InputAdapter.js').default;

let config = {
    engine: {},
};

let rubric;
let testAdapter;
let flag;

class TestAdapter extends InputAdapter {
    init() {
        flag = 'yes';
    }
}

ava.beforeEach((/* test */) => {
    rubric = new Rubric(config);
    testAdapter = new TestAdapter();
});

/*
 ██████ ██████  ███████  █████  ████████ ███████
██      ██   ██ ██      ██   ██    ██    ██
██      ██████  █████   ███████    ██    █████
██      ██   ██ ██      ██   ██    ██    ██
 ██████ ██   ██ ███████ ██   ██    ██    ███████
*/

ava('should result private variable engine', t => {
    t.is(rubric.engine, undefined);
});

ava('should result in private Engine instance', t => {
    let found = false;
    /* eslint-disable no-undef */
    let keys = Reflect.ownKeys(rubric);
    /* eslint-enable no-undef */
    keys.forEach((key) => {
        if (typeof key === 'symbol') {
            let privateData = rubric[key];
            if (privateData.engine &&
                privateData.engine.constructor &&
                /powertrain/i.test(privateData.engine.constructor.name)
            ) {
                t.truthy(privateData.engine, 'start');
                found = true;
            }
        }
    });
    t.true(found);
});

/*
██ ███    ██ ██████  ██    ██ ████████  █████  ██████   █████  ██████  ████████ ███████ ██████  ███████
██ ████   ██ ██   ██ ██    ██    ██    ██   ██ ██   ██ ██   ██ ██   ██    ██    ██      ██   ██ ██
██ ██ ██  ██ ██████  ██    ██    ██    ███████ ██   ██ ███████ ██████     ██    █████   ██████  ███████
██ ██  ██ ██ ██      ██    ██    ██    ██   ██ ██   ██ ██   ██ ██         ██    ██      ██   ██      ██
██ ██   ████ ██       ██████     ██    ██   ██ ██████  ██   ██ ██         ██    ███████ ██   ██ ███████
*/

ava('should throw if argument is not class instance of InputAdapter', test => {
    test.throws(() => {
        rubric.addInputAdapter('a');
    }, TypeError);
});

ava('should result in a map entry by constructor name', test => {
    rubric.addInputAdapter(testAdapter);

    test.truthy(rubric, 'inputAdapters');
    test.is(rubric.inputAdapters.size, 1);
    test.is(rubric.inputAdapters.get(TestAdapter.name), testAdapter);
});

ava('should alias primary adapter for ease', test => {
    rubric.addPrimaryInputAdapter(testAdapter);

    test.is(rubric.primaryInput, testAdapter);
});

ava('should throw if argument is not class instance of InputAdapter', test => {
    test.throws(() => {
        rubric.addPrimaryInputAdapter('a');
    }, TypeError);
});

ava('should result in a map entry by constructor name', test => {
    rubric.addPrimaryInputAdapter(testAdapter);

    test.truthy(rubric.inputAdapters);
    test.is(rubric.inputAdapters.size, 1);
    test.is(rubric.inputAdapters.get(TestAdapter.name), testAdapter);
});

ava('should init all input adapters when init is called', test => {
    rubric.addInputAdapter(testAdapter);
    rubric.init();
    test.is(flag, 'yes');
});
