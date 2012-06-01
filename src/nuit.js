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

  var toArray = function(obj) {
    return Array.prototype.slice.apply(obj);
  };

  var emptyFuncStub = function(){ return function() { }; };
  var emptyObjStub = function(){ return {}; };

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
      stub = isFunction(original) ? emptyFuncStub() : emptyObjStub();
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

  nuit.stubAll = function(object) {
    var originals = {};

    for (var key in object) {
      if (has(object, key)) {
        originals[key] = object[key];

        var stub = isFunction(originals[key]) ? emptyFuncStub() : emptyObjStub();
        setStub(object, key, stub);
      }
    }

    return {
      reset: function() {
        for (var key in originals) {
          setStub(object, key, originals[key]);
        }

        return this;
      }
    };
  };

})(this);