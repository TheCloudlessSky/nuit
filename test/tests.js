(function() {

module('nuit');

function isFunction(obj) {
  return Object.prototype.toString.call(obj) == '[object Function]';
}

test('stub an object', function() {
  var obj = { child: { name: 'A' } };
  var stub = nuit.stub(obj, 'child', { name: 'B' });

  equal(obj.child.name, 'B');
});

test('reset an object stub', function() {
  var obj = { child: { name: 'A' } };
  var stub = nuit.stub(obj, 'child', { name: 'B' });
  stub.reset();

  equal(obj.child.name, 'A');
});

test('stub a function', function() {
  var obj = { child: function() { return 'A'; } };
  var stub = nuit.stub(obj, 'child', function() { return 'B'; });

  equal(obj.child(), 'B');
});

test('reset a function stub', function() {
  var obj = { child: function() { return 'A'; } };
  var stub = nuit.stub(obj, 'child', function() { return 'B'; });
  stub.reset();

  equal(obj.child(), 'A');
});

test('empty object stub', function() {
  var obj = { child: { name: 'A' } };
  var stub = nuit.stub(obj, 'child');

  ok(!obj.child.name);
});

test('reset an empty object stub', function() {
  var obj = { child: { name: 'A' } };
  var stub = nuit.stub(obj, 'child');
  stub.reset();

  equal(obj.child.name, 'A');
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

test('stub all', function() {
  var obj = {
    A: 'A',
    B: { child: 'A' },
    C: function() { return 'A'; }
  };

  var stub = nuit.stubAll(obj);

  notEqual(obj.A, 'A');
  ok(!isFunction(obj.A));
  notDeepEqual(obj.B, { child: 'A' });
  ok(!isFunction(obj.B));
  notEqual(obj.C(), 'A');
});

test('reset stub all', function() {
  var obj = {
    A: 'A',
    B: { child: 'A' },
    C: function() { return 'A'; }
  };

  var stub = nuit.stubAll(obj);
  stub.reset();

  equal(obj.A, 'A');
  deepEqual(obj.B, { child: 'A' });
  equal(obj.C(), 'A');
});

})();