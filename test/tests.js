(function() {

module('nuit');

function isFunction(obj) {
  return Object.prototype.toString.call(obj) == '[object Function]';
}

test('stub: object', function() {
  var obj = { child: { name: 'A' } };
  var stub = nuit.stub(obj, 'child', { name: 'B' });

  equal(obj.child.name, 'B');
});

test('reset: object stub', function() {
  var obj = { child: { name: 'A' } };
  var stub = nuit.stub(obj, 'child', { name: 'B' });
  stub.reset();

  equal(obj.child.name, 'A');
});

test('stub: function', function() {
  var obj = { child: function() { return 'A'; } };
  var stub = nuit.stub(obj, 'child', function() { return 'B'; });

  equal(obj.child(), 'B');
});

test('reset: function stub', function() {
  var obj = { child: function() { return 'A'; } };
  var stub = nuit.stub(obj, 'child', function() { return 'B'; });
  stub.reset();

  equal(obj.child(), 'A');
});

test('stub: should trap calls for function', function() {
  var obj = { child: function() { return 'A'; } };
  var stub = nuit.stub(obj, 'child', function() { return 'B'; });
  obj.child('a', 'b');
  obj.child('c', 'd');
  deepEqual(obj.child.calls, [['a', 'b'], ['c', 'd']]);
});

test('empty function stub', function() {
  var obj = { child: function() { return 'A'; } };
  var stub = nuit.stub(obj, 'child');

  // Default returns undefined.
  ok(!obj.child());
});

test('reset empty stub function', function() {
  var obj = { child: function() { return 'A'; } };
  var stub = nuit.stub(obj, 'child');
  stub.reset();

  equal(obj.child(), 'A');
});

test('stub a function returning a value', function() {
  var obj = { child: function() { return 'A' } };
  var stub = nuit.stub(obj, 'child').returns('B');

  equal(obj.child(), 'B');
});

test('reset a stub a function returning a value', function() {
  var obj = { child: function() { return 'A' } };
  var stub = nuit.stub(obj, 'child').returns('B');  
  stub.reset();
  equal(obj.child(), 'A');
});

test('stubAll: with one argument should empty stub all functions', function() {
  var obj = {
    a: 'a',
    b: function() { return 'b'; },
    c: function() { return 'c'; }
  };

  var stub = nuit.stubAll(obj);

  equal(obj.a, 'a');
  equal(obj.b(), undefined);
  equal(obj.c(), undefined);

  stub.reset();
  equal(obj.a, 'a');
  equal(obj.b(), 'b');
  equal(obj.c(), 'c');
});

test('stubAll: with map should only stub those specified', function() {
  var obj = {
    a: function() { return 'a'; },
    b: function() { return 'b'; },
    c: function() { return 'c'; },
    d: function() { return 'd'; },
  };

  var stub = nuit.stubAll(obj, {
    b: function() { return 'x'; },
    c: function() { return 'y'; },
    d: 'z'
  });

  equal(obj.a(), 'a');
  equal(obj.b(), 'x');
  equal(obj.c(), 'y');
  equal(obj.d(), 'z');

  stub.reset();

  equal(obj.a(), 'a');
  equal(obj.b(), 'b');
  equal(obj.c(), 'c');
  equal(obj.d(), 'd');
});

test('stubAll: with array of names should empty stub those with specified name', function() {
  var obj = {
    a: function() { return 'a'; },
    b: function() { return 'b'; },
    c: function() { return 'c'; }
  };

  var stub = nuit.stubAll(obj, ['b', 'c']);

  equal(obj.a(), 'a');
  equal(obj.b(), undefined);
  equal(obj.c(), undefined);

  stub.reset();

  equal(obj.a(), 'a');
  equal(obj.b(), 'b');
  equal(obj.c(), 'c');
});

})();
