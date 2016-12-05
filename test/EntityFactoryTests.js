const ava = require('ava').default;
const EntityFactory = require('../src/EntityFactory.js').default;

let ef;
let registrySymbol;

ava.beforeEach((test) => {
    ef = new EntityFactory();
    /* eslint-disable no-undef */
    let keys = Reflect.ownKeys(ef);
    /* eslint-enable no-undef */
    keys.forEach((key) => {
        if (typeof key === 'symbol') {
            let prop = ef[key];
            if (prop.constructor && prop.constructor.name === 'Map') {
                registrySymbol = key;
            }
        }
    });

    if (!registrySymbol) {
        test.fail();
    }
});

/*
 ██████ ██████  ███████  █████  ████████ ███████
██      ██   ██ ██      ██   ██    ██    ██
██      ██████  █████   ███████    ██    █████
██      ██   ██ ██      ██   ██    ██    ██
 ██████ ██   ██ ███████ ██   ██    ██    ███████
*/

ava('should result private variable constructorRegistry', test => {
    test.is(ef.constructorRegistry, undefined);
    test.truthy(registrySymbol);
});

/*
 ██████  ██████  ███    ██ ███████ ████████ ██████  ██    ██  ██████ ████████  ██████  ██████  ███████
██      ██    ██ ████   ██ ██         ██    ██   ██ ██    ██ ██         ██    ██    ██ ██   ██ ██
██      ██    ██ ██ ██  ██ ███████    ██    ██████  ██    ██ ██         ██    ██    ██ ██████  ███████
██      ██    ██ ██  ██ ██      ██    ██    ██   ██ ██    ██ ██         ██    ██    ██ ██   ██      ██
 ██████  ██████  ██   ████ ███████    ██    ██   ██  ██████   ██████    ██     ██████  ██   ██ ███████
*/

ava('should throw if passed invalid parameters', test => {
    test.throws(() => {
        ef.registerConstructor(1, () => {});
    }, /parameter/i);

    test.throws(() => {
        ef.registerConstructor('foo', 'constructorName');
    }, /parameter/i);
});

ava('should store function in registry', test => {
    ef.registerConstructor('test', () => {
        return 'abc';
    });

    test.is(ef[registrySymbol].size, 1);
});

ava('should result in a map entry keyed properly', test => {
    let constructorName = 'test';

    ef.registerConstructor(constructorName, () => {
        return 'abc';
    });

    let constructorKey = constructorName.charAt(0).toUpperCase() + constructorName.slice(1);

    test.true(ef[registrySymbol].has(constructorKey));
});

ava('should result proxy function calls similar to "createTest" to the stored constructor', test => {
    ef.registerConstructor('test', () => {
        return 'abc';
    });

    test.is(ef.createTest(), 'abc');
});

ava('should execute in proper scope', test => {
    ef.registerConstructor('thisTest', function() {
        return this.constructor.name;
    });

    let context = ef.createThisTest();
    test.is(context, EntityFactory.name);
});

ava('should not trap access to functions that are not stored', test => {
    test.throws(() => {
        ef.createOtherTest();
    }, TypeError);
});
