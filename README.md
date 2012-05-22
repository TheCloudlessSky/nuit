nuit.js - A JavaScript Stub Library
===================================

Stub an Object
--------------

    var obj = {
      child: { name: 'A' }
    };

    var objStub = nuit.stub(obj, 'child', { name: 'B' });

    // obj.child.name === 'B'

    objStub.reset();

    // obj.child.name === 'A'

Stub a Function
---------------

    var obj = {
      child: function() { return 'A'; }
    };

    var objStub = nuit.stub(obj, 'child', function() { return 'B'; });
    // or nuit.stub(obj, 'child').returns('B');

    // obj.child() === 'B'

    objStub.reset();

    // obj.child() === 'A'
