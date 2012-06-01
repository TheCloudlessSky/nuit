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

  nuit.stub = function (object, name, stub) {

    var original = object[name];

    if (isUndefined(original)) {
      throw Error("The property '" + name + "' does not exist and can therefore not be stubbed.");
    }

    // Set the default empty stub.
    if (arguments.length === 2) {
      stub = emptyFuncStub();
    }

    setStub(object, name, stub);

    return {
      returns: function(value) {
        setStub(object, name, function() { return value; });
        return this;
      },

      reset: function() {
        object[name] = original;
        return this;
      }
    };
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

        if (!has(context, key) || !isFunction(context[key])) {
          continue;
        }

        originals[key] = context[key];
        setStub(context, key, emptyFuncStub());
      }
    }
    else {
      for (var key in stubs) {

        if (!has(context, key) || !isFunction(context[key])) {
          continue;
        }

        var stub;

        // Stub with a custom function.
        if (isFunction(stubs[key])) {
          stub = stubs[key];
        }
        // Stub with an value.
        else {
          stub = valueFuncStub(stubs[key]);
        }

        originals[key] = context[key];
        setStub(context, key, stub);
      }
    }

    return {
      reset: function() {
        for (var key in originals) {
          setStub(context, key, originals[key]);
        }

        return this;
      }
    };
  };

})(this);