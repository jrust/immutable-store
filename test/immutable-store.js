var Store = require('./../src/Store.js');

exports['throws if passing wrong argument'] = function (test) {
  test.throws(function () {
    new Store();
  });
  test.done();
};

exports['does not throw is passing an object'] = function (test) {
  test.doesNotThrow(function () {
    new Store({});
  });
  test.done();
};

exports['can not mutate the store by native mutation'] = function (test) {
  var store = new Store({});
  store.foo = 'bar';
  test.equal(Object.keys(store).length, 0);
  test.done();
};

exports['can mutate the store by using set'] = function (test) {
  var store = new Store({});
  var newStore = store.set('foo', 'bar');
  test.ok(!store.foo);
  test.equal(newStore.foo, 'bar');
  test.done();
};

exports['does nested converting of objects'] = function (test) {
  var store = new Store({
    foo: {}
  });
  test.ok(store.foo.__);
  test.done();
};

exports['does nested converting of arrays'] = function (test) {
  var store = new Store({
    foo: [{
      list: []
    }]
  });
  test.ok(store.foo[0].list.__);
  test.done();
};

exports['does not change value on existing store'] = function (test) {
  var store = new Store({
    foo: {}
  });
  store.foo.set('foo', 'bar');
  test.ok(!store.foo.foo);
  test.done();
};

exports['new store returned has change'] = function (test) {
  var store = new Store({
    foo: {}
  });
  store = store.foo.set('foo', 'bar');
  test.equal(store.foo.foo, 'bar');
  test.done();
};

exports['Changes reference on store and object changed'] = function (test) {
  var store = new Store({
    foo: {}
  });
  var newStore = store.foo.set('foo', 'bar');
  test.notEqual(store, newStore);
  test.notEqual(store.foo, newStore.foo);
  test.done();
};

exports['Changes reference on store and array changed'] = function (test) {
  var store = new Store({
    list: []
  });
  var newStore = store.list.push('foo');
  test.notEqual(store, newStore);
  test.notEqual(store.list, newStore.list);
  test.done();
};

exports['PUSH should add an object to a list with the correct path'] = function (test) {
  var store = new Store({
    list: []
  });
  var newStore = store.list.push({});
  test.ok(newStore.list.length, 1);
  test.deepEqual(newStore.list[0].__.path, ['list', 0]);
  test.done();
};

exports['SPLICE should remove an item by index and count'] = function (test) {
  var store = new Store({
    list: [1, 2, 3, 4, 5]
  });
  var newStore = store.list.splice(0, 1);
  test.deepEqual(newStore.list, [2, 3, 4, 5]);
  newStore = newStore.list.splice(2, 2);
  test.deepEqual(newStore.list, [2, 3]);
  test.done();
};

exports['SPLICE should add items from index in converted format with correct path'] = function (test) {
  var store = new Store({
    list: ['foo']
  });
  var newStore = store.list.splice(0, 0, {});
  test.deepEqual(newStore.list[0].__.path, ['list', 0]);
  test.done();
};

exports['SPLICE should fix paths of later items and insert additions with correct path'] = function (test) {
  var store = new Store({
    list: [{}, {}, {}, {}]
  });
  var newStore = store.list.splice(1, 1, {});
  test.deepEqual(newStore.list[1].__.path, ['list', 1]);
  test.deepEqual(newStore.list[2].__.path, ['list', 2]);
  test.deepEqual(newStore.list[3].__.path, ['list', 3]);
  test.done();
};

exports['CONCAT should add converted items to existing array with correct path'] = function (test) {
  var store = new Store({
    list: []
  });
  var newStore = store.list.concat({});
  test.ok(newStore.list[0].__);
  test.deepEqual(newStore.list[0].__.path, ['list', 0])
  test.done();
};

exports['CONCAT should split arrays into arguments'] = function (test) {
  var store = new Store({
    list: []
  });
  var newStore = store.list.concat(['foo'], ['bar']);
  test.deepEqual(newStore.list, ['foo', 'bar']);
  test.done();
};

exports['UNSHIFT should add converted item to top of array and adjust paths'] = function (test) {
  var store = new Store({
    list: [{}, {}]
  });
  var newStore = store.list.unshift({});
  test.ok(newStore.list[0].__);
  test.deepEqual(newStore.list[1].__.path, ['list', 1]);
  test.deepEqual(newStore.list[2].__.path, ['list', 2]);
  test.done();
};

exports['SHIFT should remove top item of array and adjust paths'] = function (test) {
  var store = new Store({
    list: [{}, {}]
  });
  var newStore = store.list.shift();
  test.deepEqual(newStore.list[0].__.path, ['list', 0]);
  test.done();
};

exports['UNSHIFT should add converted item to top of array and adjust paths'] = function (test) {
  var store = new Store({
    list: [{}, {}]
  });
  var newStore = store.list.unshift({});
  test.ok(newStore.list[0].__);
  test.deepEqual(newStore.list[1].__.path, ['list', 1]);
  test.deepEqual(newStore.list[2].__.path, ['list', 2]);
  test.done();
};

exports['SHIFT should remove top item of array and adjust paths'] = function (test) {
  var store = new Store({
    list: [{}, {}]
  });
  var newStore = store.list.shift();
  test.deepEqual(newStore.list[0].__.path, ['list', 0]);
  test.done();
};

exports['should allow for array to be set, going through items to fix paths'] = function (test) {
  var store = new Store({
    foo: {
      list: [{}, {}]
    }
  });
  store = store.foo.set('list', store.foo.list.filter(function (item, index) { return index === 1}));
  test.deepEqual(store.foo.list[0].__.path, ['foo', 'list', 0]);
  test.done();
};

exports['should convert to plain array when using toJS'] = function (test) {
  var store = new Store({
    foo: {
      list: []
    }
  });
  var array = store.foo.list.toJS();
  test.equal(array.__proto__, [].__proto__);
  test.done();
};

exports['should convert to plain object when using toJS'] = function (test) {
  var store = new Store({
    foo: {
      bar: {}
    }
  });
  var object = store.foo.bar.toJS();
  test.equal(object.__proto__, {}.__proto__);
  test.done();
};

exports['should convert deeply when using toJS'] = function (test) {
  var store = new Store({
    foo: {
      list: [{
        foo: []
      }, {
        bar: 'foo'
      }]
    }
  });
  var array = store.foo.list.toJS();
  test.equal(array.__proto__, [].__proto__);
  test.equal(array[0].__proto__, {}.__proto__);
  test.equal(array[0].foo.__proto__, [].__proto__);
  test.equal(array[1].__proto__, {}.__proto__);
  test.done();
};

exports['should merge object'] = function (test) {
  var store = new Store({
    foo: {
      bar: {
        foo: 'bar'
      }
    }
  });
  var store = store.foo.bar.merge({test: 123});
  test.equal(store.foo.bar.foo, 'bar');
  test.equal(store.foo.bar.test, 123);
  test.done();
};

exports['should convert objects and arrays when merging'] = function (test) {
  var store = new Store({
    foo: {
      bar: {
        foo: 'bar'
      }
    }
  });
  var store = store.foo.bar.merge({obj: {}, array: []});
  test.ok(store.foo.bar.obj.__);
  test.ok(store.foo.bar.array.__);
  test.done();
};

exports['should throw when trying to merge a non object'] = function (test) {
  var store = new Store({
    foo: {
      bar: {}
    }
  });
  test.throws(function () {
    store = store.foo.bar.merge([]);
  });
  test.done();
};

exports['should work with number primitives in array'] = function (test) {
  var store = new Store({
    items: [0]
  });
  test.equal(store.items[0], 0);
  test.done();
};

exports['the path to a store should be empty'] = function (test) {
  var store = new Store({
    items: [0]
  });
  test.equal(store.__.path.length, 0);
  store = store.items.push('foo');
  test.equal(store.__.path.length, 0);
  test.done();
};

exports['the path to a store should be empty after deep set'] = function (test) {
  var store = new Store({
    foo: {
      bar: {
        foo: 'bar'
      }
    }
  });
  test.equal(store.__.path.length, 0);
  var store = store.foo.bar.set('test', 123);
  test.equal(store.__.path.length, 0);
  test.done();
};

exports['the path to a store should be empty after deep merge'] = function (test) {
  var store = new Store({
    foo: {
      bar: {
        foo: 'bar'
      }
    }
  });
  test.equal(store.__.path.length, 0);
  var store = store.foo.bar.merge({test: 123});
  test.equal(store.__.path.length, 0);
  test.done();
};