(function(root) {

  var previousNuit = root.nuit;
  var nuit = {};
  root.nuit = nuit;

  nuit.noConflict = function() {
    root.nuit = previousNuit;
    return this;
  };

  var has = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };

  var isUndefined = function(obj) {
    return obj === void 0;
  };

  var isFunction = function(obj) {
    return Object.prototype.toString.call(obj) == '[object Function]';
  };

  var isArray = function(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
  };

  var toArray = function(obj) {
    return Array.prototype.slice.apply(obj);
  };

  var emptyFuncStub = function() { return function() { }; };
  var valueFuncStub = function(value) { return function() { return value; } };
  var noOriginal = {};

  var setStub = function(context, name, stub) {
    if (isFunction(stub)) {
      setFuncStub(context, name, stub);
    }
    else {
      setObjectStub(context, name, stub);
    }
  };

  var setObjectStub = function(context, name, stubObj) {
    context[name] = stubObj;
  };

  var setFuncStub = function(context, name, stubFunc) {
    var calls = [];
    context[name] = function() {
      var args = toArray(arguments);
      calls.push(args);
      return stubFunc.apply(this, args);
    };
    context[name].calls = calls;
  };

  var getOriginal = function(context, key) {
    if (key in context) {
      return context[key];
    }
    else {
      return noOriginal;
    }
  };

  var setOriginal = function(context, key, originals) {
    if (originals[key] === noOriginal) {
      delete context[key];
    }
    else {
      context[key] = originals[key];
    }
  };

  nuit.stub = function(context, name, stub) {

    var originals = {};
    originals[name] = getOriginal(context, name);

    // Set the default empty stub.
    if (arguments.length === 2) {
      stub = emptyFuncStub();
    }

    setStub(context, name, stub);

    return {
      returns: function(value) {
        setStub(context, name, function() { return value; });
        return this;
      },

      reset: function() {
        setOriginal(context, name, originals);
        return this;
      }
    };
  };

  nuit.pstub = function(context, name, stub) {
    return nuit.stub(context.prototype, name, stub);
  };

  nuit.stubAll = function(context, stubs) {
    var originals = {};

    // No stubs should empty stub all functions.
    if (!stubs) { 
      stubs = [];

      for (var key in context) {
        stubs.push(key);
      }
    }

    if (isArray(stubs)) {
      for (var i = 0; i < stubs.length; i++) {
        var key = stubs[i];
        originals[key] = getOriginal(context, key);
        setStub(context, key, emptyFuncStub());
      }
    }
    else {
      for (var key in stubs) {
        var stub;

        // Stub with a custom function.
        if (isFunction(stubs[key])) {
          stub = stubs[key];
        }
        // Stub with an value.
        else {
          stub = valueFuncStub(stubs[key]);
        }

        originals[key] = getOriginal(context, key);
        setStub(context, key, stub);
      }
    }

    return {
      reset: function() {
        for (var key in originals) {
          setOriginal(context, key, originals);
        }

        return this;
      }
    };
  };

  nuit.pstubAll = function(context, stubs) {
    return nuit.stubAll(context.prototype, stubs);
  };

})(this);