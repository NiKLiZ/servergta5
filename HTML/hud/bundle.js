(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":1,"timers":2}],3:[function(require,module,exports){
var Vue // late bind
var version
var map = Object.create(null)
if (typeof window !== 'undefined') {
  window.__VUE_HOT_MAP__ = map
}
var installed = false
var isBrowserify = false
var initHookName = 'beforeCreate'

exports.install = function (vue, browserify) {
  if (installed) { return }
  installed = true

  Vue = vue.__esModule ? vue.default : vue
  version = Vue.version.split('.').map(Number)
  isBrowserify = browserify

  // compat with < 2.0.0-alpha.7
  if (Vue.config._lifecycleHooks.indexOf('init') > -1) {
    initHookName = 'init'
  }

  exports.compatible = version[0] >= 2
  if (!exports.compatible) {
    console.warn(
      '[HMR] You are using a version of vue-hot-reload-api that is ' +
        'only compatible with Vue.js core ^2.0.0.'
    )
    return
  }
}

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  if(map[id]) { return }

  var Ctor = null
  if (typeof options === 'function') {
    Ctor = options
    options = Ctor.options
  }
  makeOptionsHot(id, options)
  map[id] = {
    Ctor: Ctor,
    options: options,
    instances: []
  }
}

/**
 * Check if module is recorded
 *
 * @param {String} id
 */

exports.isRecorded = function (id) {
  return typeof map[id] !== 'undefined'
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot(id, options) {
  if (options.functional) {
    var render = options.render
    options.render = function (h, ctx) {
      var instances = map[id].instances
      if (ctx && instances.indexOf(ctx.parent) < 0) {
        instances.push(ctx.parent)
      }
      return render(h, ctx)
    }
  } else {
    injectHook(options, initHookName, function() {
      var record = map[id]
      if (!record.Ctor) {
        record.Ctor = this.constructor
      }
      record.instances.push(this)
    })
    injectHook(options, 'beforeDestroy', function() {
      var instances = map[id].instances
      instances.splice(instances.indexOf(this), 1)
    })
  }
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook(options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing) ? existing.concat(hook) : [existing, hook]
    : [hook]
}

function tryWrap(fn) {
  return function (id, arg) {
    try {
      fn(id, arg)
    } catch (e) {
      console.error(e)
      console.warn(
        'Something went wrong during Vue component hot-reload. Full reload required.'
      )
    }
  }
}

function updateOptions (oldOptions, newOptions) {
  for (var key in oldOptions) {
    if (!(key in newOptions)) {
      delete oldOptions[key]
    }
  }
  for (var key$1 in newOptions) {
    oldOptions[key$1] = newOptions[key$1]
  }
}

exports.rerender = tryWrap(function (id, options) {
  var record = map[id]
  if (!options) {
    record.instances.slice().forEach(function (instance) {
      instance.$forceUpdate()
    })
    return
  }
  if (typeof options === 'function') {
    options = options.options
  }
  if (record.Ctor) {
    record.Ctor.options.render = options.render
    record.Ctor.options.staticRenderFns = options.staticRenderFns
    record.instances.slice().forEach(function (instance) {
      instance.$options.render = options.render
      instance.$options.staticRenderFns = options.staticRenderFns
      // reset static trees
      // pre 2.5, all static trees are cached together on the instance
      if (instance._staticTrees) {
        instance._staticTrees = []
      }
      // 2.5.0
      if (Array.isArray(record.Ctor.options.cached)) {
        record.Ctor.options.cached = []
      }
      // 2.5.3
      if (Array.isArray(instance.$options.cached)) {
        instance.$options.cached = []
      }

      // post 2.5.4: v-once trees are cached on instance._staticTrees.
      // Pure static trees are cached on the staticRenderFns array
      // (both already reset above)

      // 2.6: temporarily mark rendered scoped slots as unstable so that
      // child components can be forced to update
      var restore = patchScopedSlots(instance)
      instance.$forceUpdate()
      instance.$nextTick(restore)
    })
  } else {
    // functional or no instance created yet
    record.options.render = options.render
    record.options.staticRenderFns = options.staticRenderFns

    // handle functional component re-render
    if (record.options.functional) {
      // rerender with full options
      if (Object.keys(options).length > 2) {
        updateOptions(record.options, options)
      } else {
        // template-only rerender.
        // need to inject the style injection code for CSS modules
        // to work properly.
        var injectStyles = record.options._injectStyles
        if (injectStyles) {
          var render = options.render
          record.options.render = function (h, ctx) {
            injectStyles.call(ctx)
            return render(h, ctx)
          }
        }
      }
      record.options._Ctor = null
      // 2.5.3
      if (Array.isArray(record.options.cached)) {
        record.options.cached = []
      }
      record.instances.slice().forEach(function (instance) {
        instance.$forceUpdate()
      })
    }
  }
})

exports.reload = tryWrap(function (id, options) {
  var record = map[id]
  if (options) {
    if (typeof options === 'function') {
      options = options.options
    }
    makeOptionsHot(id, options)
    if (record.Ctor) {
      if (version[1] < 2) {
        // preserve pre 2.2 behavior for global mixin handling
        record.Ctor.extendOptions = options
      }
      var newCtor = record.Ctor.super.extend(options)
      record.Ctor.options = newCtor.options
      record.Ctor.cid = newCtor.cid
      record.Ctor.prototype = newCtor.prototype
      if (newCtor.release) {
        // temporary global mixin strategy used in < 2.0.0-alpha.6
        newCtor.release()
      }
    } else {
      updateOptions(record.options, options)
    }
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$vnode && instance.$vnode.context) {
      instance.$vnode.context.$forceUpdate()
    } else {
      console.warn(
        'Root or manually mounted instance modified. Full reload required.'
      )
    }
  })
})

// 2.6 optimizes template-compiled scoped slots and skips updates if child
// only uses scoped slots. We need to patch the scoped slots resolving helper
// to temporarily mark all scoped slots as unstable in order to force child
// updates.
function patchScopedSlots (instance) {
  if (!instance._u) { return }
  // https://github.com/vuejs/vue/blob/dev/src/core/instance/render-helpers/resolve-scoped-slots.js
  var original = instance._u
  instance._u = function (slots) {
    try {
      // 2.6.4 ~ 2.6.6
      return original(slots, true)
    } catch (e) {
      // 2.5 / >= 2.6.7
      return original(slots, null, true)
    }
  }
  return function () {
    instance._u = original
  }
}

},{}],4:[function(require,module,exports){
(function (process,global,setImmediate){
/*!
 * Vue.js v2.5.22
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
'use strict';

/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: process.env.NODE_ENV !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (process.env.NODE_ENV !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if (process.env.NODE_ENV !== 'production' && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null;
var targetStack = [];

function pushTarget (target) {
  targetStack.push(target);
  Dep.target = target;
}

function popTarget () {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      protoAugment(value, arrayMethods);
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'can only contain alphanumeric characters and the hyphen, ' +
      'and must start with a letter.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    process.env.NODE_ENV !== 'production' &&
    // skip validation for weex recycle-list child component props
    !(false)
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (process.env.NODE_ENV !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  if (vm) {
    var cur = vm;
    while ((cur = cur.$parent)) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (process.env.NODE_ENV !== 'production') {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both microtasks and (macro) tasks.
// In < 2.4 we used microtasks everywhere, but there are some scenarios where
// microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using (macro) tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use microtask by default, but expose a way to force (macro) task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a (macro) task instead of a microtask.
 */
function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    try {
      return fn.apply(null, arguments)
    } finally {
      useMacroTask = false;    
    }
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (process.env.NODE_ENV !== 'production') {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (process.env.NODE_ENV !== 'production') {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      process.env.NODE_ENV !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (process.env.NODE_ENV !== 'production') {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }

      if (renderCompleted) {
        contexts.length = 0;
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        contexts.length = 0;
      }
    });

    var reject = once(function (reason) {
      process.env.NODE_ENV !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                process.env.NODE_ENV !== 'production'
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (process.env.NODE_ENV !== 'production') {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (process.env.NODE_ENV !== 'production') {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$1 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$1; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = process.env.NODE_ENV !== 'production'
    ? expOrFn.toString()
    : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
      process.env.NODE_ENV !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {
      defineReactive$$1(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {
        defineReactive$$1(vm, key, result[key]);
      }
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject).filter(function (key) {
        /* istanbul ignore next */
        return Object.getOwnPropertyDescriptor(inject, key).enumerable
      })
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (process.env.NODE_ENV !== 'production') {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if (process.env.NODE_ENV !== 'production' && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        if (!(key in hash) && !(camelizedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + camelizedKey)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () { return resolveSlots(children, parent); };

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (process.env.NODE_ENV !== 'production') {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, null, true);
  }
}

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject;
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if (process.env.NODE_ENV !== 'production' && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.5.22';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setStyleScope (node, scopeId) {
  node.setAttribute(scopeId, '');
}

var nodeOps = /*#__PURE__*/Object.freeze({
  createElement: createElement$1,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  createComment: createComment,
  insertBefore: insertBefore,
  removeChild: removeChild,
  appendChild: appendChild,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent,
  setStyleScope: setStyleScope
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!isDef(key)) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  var creatingElmInVPre = 0;

  function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (process.env.NODE_ENV !== 'production') {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }

      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if (process.env.NODE_ENV !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        insert(parentElm, vnode.elm, refElm);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (nodeOps.parentNode(ref$$1) === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if (process.env.NODE_ENV !== 'production') {
        checkDuplicateKeys(children);
      }
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setStyleScope(vnode.elm, i);
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setStyleScope(vnode.elm, i);
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys (children) {
    var seenKeys = {};
    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn(
            ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
            vnode.context
          );
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
  ) {
    if (oldVnode === vnode) {
      return
    }

    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (process.env.NODE_ENV !== 'production') {
          checkDuplicateKeys(ch);
        }
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    if (process.env.NODE_ENV !== 'production') {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false
      }
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || (
        !isUnknownElement$$1(vnode, inVPre) &&
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm)) {
          removeVnodes(parentElm, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    // $flow-disable-line
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  // $flow-disable-line
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (el.tagName.indexOf('-') > -1) {
    baseSetAttr(el, key, value);
  } else if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    baseSetAttr(el, key, value);
  }
}

function baseSetAttr (el, key, value) {
  if (isFalsyAttrValue(value)) {
    el.removeAttribute(key);
  } else {
    // #7138: IE10 & 11 fires input event when setting placeholder on
    // <textarea>... block the first input event and remove the blocker
    // immediately.
    /* istanbul ignore if */
    if (
      isIE && !isIE9 &&
      (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') &&
      key === 'placeholder' && !el.__ieph
    ) {
      var blocker = function (e) {
        e.stopImmediatePropagation();
        el.removeEventListener('input', blocker);
      };
      el.addEventListener('input', blocker);
      // $flow-disable-line
      el.__ieph = true; /* IE placeholder patched */
    }
    el.setAttribute(key, value);
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

/*  */

/*  */

/*  */

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler$1 (event, handler, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

function add$1 (
  event,
  handler,
  capture,
  passive
) {
  handler = withMacroTask(handler);
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isNotInFocusAndDirty(elm, checkVal) ||
    isDirtyWithModifiers(elm, checkVal)
  ))
}

function isNotInFocusAndDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isDirtyWithModifiers (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.lazy) {
      // inputs with lazy should only be updated when not in focus
      return false
    }
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal)
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim()
    }
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (
        childNode && childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

var whitespaceRE = /\s+/;

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  // JSDOM may return undefined for transition properties
  var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
  var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
  var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

// Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
// in a locale-dependent way, using a comma instead of a dot.
// If comma is not replaced with a dot, the input will be rounded down (i.e. acting
// as a floor function) causing unexpected behaviors
function toMs (s) {
  return Number(s.slice(0, -1).replace(',', '.')) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);
      if (!cb.cancelled) {
        addTransitionClass(el, toClass);
        if (!userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show && el.parentNode) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled) {
          addTransitionClass(el, leaveToClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd);
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    process.env.NODE_ENV !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (!value === !oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: directive,
  show: show
};

/*  */

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };

var isVShowDirective = function (d) { return d.name === 'show'; };

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(isNotTextNode);
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if (process.env.NODE_ENV !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if (process.env.NODE_ENV !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(isVShowDirective)) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  beforeMount: function beforeMount () {
    var this$1 = this;

    var update = this._update;
    this._update = function (vnode, hydrating) {
      var restoreActiveInstance = setActiveInstance(this$1);
      // force removing pass
      this$1.__patch__(
        this$1._vnode,
        this$1.kept,
        false, // hydrating
        true // removeOnly (!important, avoids unnecessary moves)
      );
      this$1._vnode = this$1.kept;
      restoreActiveInstance();
      update.call(this$1, vnode, hydrating);
    };
  },

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (process.env.NODE_ENV !== 'production') {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (e && e.target !== el) {
            return
          }
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue);
      } else if (
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test' &&
        isChrome
      ) {
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        );
      }
    }
    if (process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'test' &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        "You are running Vue in development mode.\n" +
        "Make sure to turn on production mode when deploying for production.\n" +
        "See more tips at https://vuejs.org/guide/deployment.html"
      );
    }
  }, 0);
}

/*  */

module.exports = Vue;

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)
},{"_process":1,"timers":2}],5:[function(require,module,exports){
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../vue/hud/index.vue');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    data: function data() {
        return {};
    },
    created: function created() {},

    components: {
        'hud': _index2.default
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('hud')],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-af9a8c44", __vue__options__)
  } else {
    hotAPI.reload("data-v-af9a8c44", __vue__options__)
  }
})()}
},{"../../vue/hud/index.vue":7,"vue":4,"vue-hot-reload-api":3}],6:[function(require,module,exports){
(function (process){
'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _App = require('./App.vue');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof mp == 'undefined') {
    window.mp = {};
    mp.trigger = function () {
        var _console;

        (_console = console).log.apply(_console, arguments);
    };
}
var events = {};
mp.on = function (call, calback) {
    events[call] = calback;
};
mp.call = function (call) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    var event = events[call];
    if (event) event.apply(undefined, args);
};
new _vue2.default({
    el: '#app',
    data: {
        cdn: process.env.NODE_ENV == 'production' ? "https://cdn.westrp.ru/westrp/HTML/" : "http://localhost:7896/"
    },
    render: function render(h) {
        return h(_App2.default);
    }

});

}).call(this,require('_process'))
},{"./App.vue":5,"_process":1,"vue":4}],7:[function(require,module,exports){
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    data: function data() {
        return {
            show: false,
            money: 2,
            bank: null,
            date: 0,
            time: 0,
            speed: null,
            speedHealth: 100,
            speedLigh: true,
            showSpeed: false,
            showTips: true,
            speedText: 300,
            speedType: 'км/ч',
            speedLocked: false,
            voice: true,
            tansactionCash: 0,
            tansactionBank: 0,
            keyTipShow: false,
            players: 1,
            keyName: 'e',
            fuel: 0,
            cartridges: null,
            vehicleTips: false,
            data: '',
            education: false,
            educationTitle: '',
            educationTasks: []
        };
    },

    methods: {},
    watch: {},
    computed: {
        textBank: function textBank() {
            if (!this.bank) return '0';
            var n = this.bank + "";
            n = n.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');;
            return '' + n;
        },
        textCash: function textCash() {
            if (!this.money) return '0';
            var n = this.money + "";
            n = n.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');;
            return '' + n;
        },
        speedPercent: function speedPercent() {
            return 100 / 400 * parseInt(this.speedText) + "%";
        }
    },
    created: function created() {
        var _this = this;

        window.hud = this;
        mp.on("HUD::CHANGE_MONEY", function (money) {
            hud.money = money;
        });
        window.keyTip = function (is) {
            var keyName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'e';

            _this.keyTipShow = is;
            _this.keyName = keyName;
        };
        var timer = setInterval(updateTime, 1000);
        updateTime();

        function updateTime() {
            if (!hud.show) return;
            var cd = new Date();
            cd.setHours(cd.getHours() + 3, cd.getMinutes() + cd.getTimezoneOffset());
            var hours = cd.getHours();
            if (hours == 24) hours = 0;
            hud.time = zeroPadding(hours, 2) + ':' + zeroPadding(cd.getUTCMinutes(), 2);
            hud.date = zeroPadding(cd.getDate(), 2) + '.' + zeroPadding(cd.getUTCMonth() + 1, 2) + '.' + zeroPadding(cd.getFullYear(), 4);
        };

        function zeroPadding(num, digit) {
            var zero = Array(digit).fill('0').join('');
            return (zero + num).slice(-digit);
        }
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.show)?_c('div',{staticClass:"hud"},[_c('div',{staticClass:"topLeft"},[_c('span',[_vm._v("WESTRP.RU - 1")]),_vm._v(" "),_c('span',[_vm._v("Онлайн: "+_vm._s(_vm.players))]),_vm._v(" "),_c('span',[_vm._v(_vm._s(_vm.time))]),_vm._v(" "),_c('span',[_vm._v(_vm._s(_vm.date))])]),_vm._v(" "),_c('div',{staticClass:"microfon"},[(!_vm.voice)?_c('div',{staticClass:"on"},[_c('svg',{attrs:{"width":"44","height":"44","viewBox":"0 0 44 44","fill":"none","xmlns":"http://www.w3.org/2000/svg"}},[_c('circle',{attrs:{"opacity":"0.5","cx":"22","cy":"22","r":"21","fill":"black"}}),_vm._v(" "),_c('circle',{attrs:{"opacity":"0.5","cx":"22","cy":"22","r":"22","fill":"black"}}),_vm._v(" "),_c('circle',{attrs:{"cx":"22","cy":"22","r":"21","stroke":"#37D462","stroke-width":"2"}}),_vm._v(" "),_c('path',{attrs:{"d":"M26.0098 21.7769V14.9733C26.0098 12.7791 24.214 11 21.9995 11C19.7844 11 17.9896 12.7791 17.9896 14.9733V21.7765C17.9896 23.9704 19.7844 25.7495 21.9995 25.7495C24.214 25.7494 26.0098 23.9712 26.0098 21.7769Z","fill":"#37D462"}}),_vm._v(" "),_c('path',{attrs:{"d":"M29.1194 22.1841V18.9142C29.5272 18.6237 30.0351 18.1882 30.065 17.8037C30.1122 17.1946 29.1194 16.612 29.1194 16.612H27.7169V22.1846C27.7169 25.3052 25.1541 27.8434 22.0046 27.8434C18.8557 27.8434 16.2939 25.3052 16.2939 22.1846V16.612H14.8902C14.8902 16.612 13.885 17.1579 13.9351 17.8037C13.9647 18.1909 14.4811 18.6306 14.8902 18.9213V22.184C14.8902 25.4955 17.2079 28.2803 20.321 29.032V31.5101H19.0183V33H24.9819V31.5101H23.6791V29.0346C26.7966 28.2867 29.1194 25.5001 29.1194 22.1841Z","fill":"#37D462"}})])]):_c('div',{staticClass:"off"},[_c('svg',{attrs:{"width":"44","height":"44","viewBox":"0 0 44 44","fill":"none","xmlns":"http://www.w3.org/2000/svg"}},[_c('circle',{attrs:{"opacity":"0.5","cx":"22","cy":"22","r":"22","fill":"black"}}),_vm._v(" "),_c('circle',{attrs:{"cx":"22","cy":"22","r":"21","stroke":"#939393","stroke-width":"2"}}),_vm._v(" "),_c('path',{attrs:{"d":"M25.6229 13.2686C24.9787 11.9273 23.5982 11 21.9995 11C19.7844 11 17.9896 12.7791 17.9896 14.9733V21.7765C17.9896 22.327 18.1026 22.8514 18.3069 23.3281L25.6229 13.2686Z","fill":"#939393"}}),_vm._v(" "),_c('path',{attrs:{"d":"M17.0694 25.0296C16.5765 24.1933 16.2939 23.2211 16.2939 22.1847V16.612H14.8902C14.8902 16.612 13.885 17.1579 13.9351 17.8037C13.9647 18.1909 14.4811 18.6306 14.8902 18.9213V22.1841C14.8902 23.6927 15.3713 25.0921 16.1894 26.2396L17.0694 25.0296Z","fill":"#939393"}}),_vm._v(" "),_c('path',{attrs:{"d":"M17.5935 27.7093L18.4136 26.5817C19.3953 27.3704 20.6452 27.8435 22.0046 27.8435C25.1541 27.8435 27.7169 25.3052 27.7169 22.1847V16.612H29.1194C29.1194 16.612 30.1122 17.1947 30.065 17.8038C30.0351 18.1883 29.5272 18.6237 29.1194 18.9143V22.1841C29.1194 25.5001 26.7966 28.2867 23.6791 29.0346V31.5101H24.9819V33H19.0183V31.5101H20.3209V29.032C19.3107 28.7881 18.3842 28.33 17.5935 27.7093Z","fill":"#939393"}}),_vm._v(" "),_c('path',{attrs:{"d":"M19.5954 24.9567L26.0098 16.1369V21.777C26.0098 23.9713 24.214 25.7495 21.9995 25.7495C21.0975 25.7495 20.2652 25.4545 19.5954 24.9567Z","fill":"#939393"}}),_vm._v(" "),_c('path',{attrs:{"fill-rule":"evenodd","clip-rule":"evenodd","d":"M30.8087 11.5882L14.8087 33.5882L13.1913 32.4119L29.1913 10.4119L30.8087 11.5882Z","fill":"#939393"}})])])]),_vm._v(" "),_c('div',{staticClass:"hud-top"},[_c('div',{staticClass:"money"},[(_vm.money != null)?_c('div',{staticClass:"cash"},[(_vm.tansactionCash != 0)?_c('div',{staticClass:"tansaction"},[_vm._v("+ "+_vm._s(_vm.tansactionCash))]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"content"},[_c('svg',{attrs:{"width":"16","height":"13","viewBox":"0 0 16 13","fill":"none","xmlns":"http://www.w3.org/2000/svg"}},[_c('mask',{attrs:{"id":"path-1-outside-1","maskUnits":"userSpaceOnUse","x":"0","y":"0","width":"16","height":"13","fill":"black"}},[_c('rect',{attrs:{"fill":"white","width":"16","height":"13"}}),_vm._v(" "),_c('path',{attrs:{"d":"M15 5.47253C15 5.10536 14.6908 4.80769 14.3094 4.80769H10.3543C9.97287 4.80769 9.66368 5.10536 9.66368 5.47253V7.46703C9.66368 7.8342 9.97287 8.13187 10.3543 8.13187H14.3094C14.6908 8.13187 15 7.8342 15 7.46703V5.47253ZM11.6422 7.2535C11.1976 7.2535 10.8372 6.90652 10.8372 6.47848C10.8372 6.05045 11.1976 5.70347 11.6422 5.70347C12.0868 5.70347 12.4472 6.05045 12.4472 6.47848C12.4472 6.90646 12.0868 7.2535 11.6422 7.2535Z"}}),_vm._v(" "),_c('path',{attrs:{"d":"M8.75393 3.9011H13.87V1.90659C13.87 1.4067 13.4685 1 12.9492 1H1.96261C1.44335 1 1 1.4067 1 1.90659V11.0934C1 11.5933 1.44335 12 1.96261 12H12.9492C13.4684 12 13.87 11.5933 13.87 11.0934V9.03846H8.76328L8.75393 3.9011Z"}})]),_vm._v(" "),_c('path',{attrs:{"d":"M15 5.47253C15 5.10536 14.6908 4.80769 14.3094 4.80769H10.3543C9.97287 4.80769 9.66368 5.10536 9.66368 5.47253V7.46703C9.66368 7.8342 9.97287 8.13187 10.3543 8.13187H14.3094C14.6908 8.13187 15 7.8342 15 7.46703V5.47253ZM11.6422 7.2535C11.1976 7.2535 10.8372 6.90652 10.8372 6.47848C10.8372 6.05045 11.1976 5.70347 11.6422 5.70347C12.0868 5.70347 12.4472 6.05045 12.4472 6.47848C12.4472 6.90646 12.0868 7.2535 11.6422 7.2535Z","fill":"#37D462"}}),_vm._v(" "),_c('path',{attrs:{"d":"M8.75393 3.9011H13.87V1.90659C13.87 1.4067 13.4685 1 12.9492 1H1.96261C1.44335 1 1 1.4067 1 1.90659V11.0934C1 11.5933 1.44335 12 1.96261 12H12.9492C13.4684 12 13.87 11.5933 13.87 11.0934V9.03846H8.76328L8.75393 3.9011Z","fill":"#37D462"}}),_vm._v(" "),_c('path',{attrs:{"d":"M8.75393 3.9011V2.9011H7.75211L7.75393 3.90292L8.75393 3.9011ZM13.87 3.9011V4.9011H14.87V3.9011H13.87ZM13.87 9.03846H14.87V8.03846H13.87V9.03846ZM8.76328 9.03846L7.76328 9.04028L7.7651 10.0385H8.76328V9.03846ZM16 5.47253C16 4.5176 15.2069 3.80769 14.3094 3.80769V5.80769C14.1747 5.80769 14 5.69311 14 5.47253H16ZM14.3094 3.80769H10.3543V5.80769H14.3094V3.80769ZM10.3543 3.80769C9.45674 3.80769 8.66368 4.5176 8.66368 5.47253H10.6637C10.6637 5.69311 10.489 5.80769 10.3543 5.80769V3.80769ZM8.66368 5.47253V7.46703H10.6637V5.47253H8.66368ZM8.66368 7.46703C8.66368 8.42196 9.45674 9.13187 10.3543 9.13187V7.13187C10.489 7.13187 10.6637 7.24645 10.6637 7.46703H8.66368ZM10.3543 9.13187H14.3094V7.13187H10.3543V9.13187ZM14.3094 9.13187C15.2069 9.13187 16 8.42196 16 7.46703H14C14 7.24645 14.1747 7.13187 14.3094 7.13187V9.13187ZM16 7.46703V5.47253H14V7.46703H16ZM11.6422 6.2535C11.7137 6.2535 11.8372 6.31876 11.8372 6.47848H9.83717C9.83717 7.49427 10.6815 8.2535 11.6422 8.2535V6.2535ZM11.8372 6.47848C11.8372 6.63821 11.7137 6.70347 11.6422 6.70347V4.70347C10.6815 4.70347 9.83717 5.46269 9.83717 6.47848H11.8372ZM11.6422 6.70347C11.5707 6.70347 11.4472 6.63821 11.4472 6.47848H13.4472C13.4472 5.46269 12.6029 4.70347 11.6422 4.70347V6.70347ZM11.4472 6.47848C11.4472 6.31875 11.5706 6.2535 11.6422 6.2535V8.2535C12.603 8.2535 13.4472 7.49416 13.4472 6.47848H11.4472ZM8.75393 4.9011H13.87V2.9011H8.75393V4.9011ZM14.87 3.9011V1.90659H12.87V3.9011H14.87ZM14.87 1.90659C14.87 0.847994 14.0143 0 12.9492 0V2C12.9412 2 12.9191 1.99474 12.8996 1.97535C12.8809 1.9568 12.87 1.93008 12.87 1.90659H14.87ZM12.9492 0H1.96261V2H12.9492V0ZM1.96261 0C0.956389 0 0 0.791282 0 1.90659H2C2 1.93134 1.99418 1.95383 1.98651 1.97058C1.97934 1.98623 1.97201 1.99399 1.9692 1.99662C1.96568 1.9999 1.96442 2 1.96261 2V0ZM0 1.90659V11.0934H2V1.90659H0ZM0 11.0934C0 12.2087 0.956389 13 1.96261 13V11C1.96442 11 1.96568 11.0001 1.9692 11.0034C1.97201 11.006 1.97934 11.0138 1.98651 11.0294C1.99418 11.0462 2 11.0687 2 11.0934H0ZM1.96261 13H12.9492V11H1.96261V13ZM12.9492 13C14.0142 13 14.87 12.1521 14.87 11.0934H12.87C12.87 11.0699 12.881 11.0432 12.8996 11.0246C12.9191 11.0053 12.9412 11 12.9492 11V13ZM14.87 11.0934V9.03846H12.87V11.0934H14.87ZM13.87 8.03846H8.76328V10.0385H13.87V8.03846ZM9.76328 9.03664L9.75393 3.89928L7.75393 3.90292L7.76328 9.04028L9.76328 9.03664Z","fill":"black","fill-opacity":"0.25","mask":"url(#path-1-outside-1)"}})]),_vm._v(" "),_c('span',[_vm._v(_vm._s(_vm.textCash))])])]):_vm._e(),_vm._v(" "),(_vm.bank != null)?_c('div',{staticClass:"bank"},[(_vm.tansactionBank != 0)?_c('div',{staticClass:"tansaction"},[_vm._v("+ "+_vm._s(_vm.tansactionBank))]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"content"},[_c('svg',{attrs:{"width":"14","height":"14","viewBox":"0 0 14 14","fill":"none","xmlns":"http://www.w3.org/2000/svg"}},[_c('mask',{attrs:{"id":"path-1-outside-1","maskUnits":"userSpaceOnUse","x":"0","y":"0","width":"14","height":"14","fill":"black"}},[_c('rect',{attrs:{"fill":"white","width":"14","height":"14"}}),_vm._v(" "),_c('path',{attrs:{"d":"M2.48498 10.4774H11.515V2.58756H2.48498V10.4774ZM5.54174 5.28941C6.10858 5.28941 6.58597 5.68849 6.71962 6.22633H9.37428V6.83856H6.71962C6.58594 7.37643 6.10858 7.77554 5.54174 7.77554C4.87163 7.77554 4.32648 7.21786 4.32648 6.53244C4.32645 5.84706 4.87163 5.28941 5.54174 5.28941Z"}}),_vm._v(" "),_c('path',{attrs:{"d":"M1 1V12.065H1.87532V13H2.92275V12.065H11.0773V13H12.1247V12.065H13V1H1ZM1.88645 11.0897V1.97534H12.1135V11.0897H1.88645Z"}})]),_vm._v(" "),_c('path',{attrs:{"d":"M2.48498 10.4774H11.515V2.58756H2.48498V10.4774ZM5.54174 5.28941C6.10858 5.28941 6.58597 5.68849 6.71962 6.22633H9.37428V6.83856H6.71962C6.58594 7.37643 6.10858 7.77554 5.54174 7.77554C4.87163 7.77554 4.32648 7.21786 4.32648 6.53244C4.32645 5.84706 4.87163 5.28941 5.54174 5.28941Z","fill":"#37D462"}}),_vm._v(" "),_c('path',{attrs:{"d":"M1 1V12.065H1.87532V13H2.92275V12.065H11.0773V13H12.1247V12.065H13V1H1ZM1.88645 11.0897V1.97534H12.1135V11.0897H1.88645Z","fill":"#37D462"}}),_vm._v(" "),_c('path',{attrs:{"d":"M2.48498 10.4774H1.48498V11.4774H2.48498V10.4774ZM11.515 10.4774V11.4774H12.515V10.4774H11.515ZM11.515 2.58756H12.515V1.58756H11.515V2.58756ZM2.48498 2.58756V1.58756H1.48498V2.58756H2.48498ZM6.71962 6.22633L5.74913 6.46749L5.9377 7.22633H6.71962V6.22633ZM9.37428 6.22633H10.3743V5.22633H9.37428V6.22633ZM9.37428 6.83856V7.83856H10.3743V6.83856H9.37428ZM6.71962 6.83856V5.83856H5.93773L5.74914 6.59735L6.71962 6.83856ZM4.32648 6.53244H5.32648V6.5324L4.32648 6.53244ZM1 1V0H0V1H1ZM1 12.065H0V13.065H1V12.065ZM1.87532 12.065H2.87532V11.065H1.87532V12.065ZM1.87532 13H0.875321V14H1.87532V13ZM2.92275 13V14H3.92275V13H2.92275ZM2.92275 12.065V11.065H1.92275V12.065H2.92275ZM11.0773 12.065H12.0773V11.065H11.0773V12.065ZM11.0773 13H10.0773V14H11.0773V13ZM12.1247 13V14H13.1247V13H12.1247ZM12.1247 12.065V11.065H11.1247V12.065H12.1247ZM13 12.065V13.065H14V12.065H13ZM13 1H14V0H13V1ZM1.88645 11.0897H0.886454V12.0897H1.88645V11.0897ZM1.88645 1.97534V0.975337H0.886454V1.97534H1.88645ZM12.1135 1.97534H13.1135V0.975337H12.1135V1.97534ZM12.1135 11.0897V12.0897H13.1135V11.0897H12.1135ZM2.48498 11.4774H11.515V9.47744H2.48498V11.4774ZM12.515 10.4774V2.58756H10.515V10.4774H12.515ZM11.515 1.58756H2.48498V3.58756H11.515V1.58756ZM1.48498 2.58756V10.4774H3.48498V2.58756H1.48498ZM5.54174 6.28941C5.62329 6.28941 5.7199 6.34986 5.74913 6.46749L7.6901 5.98517C7.45203 5.02712 6.59387 4.28941 5.54174 4.28941V6.28941ZM6.71962 7.22633H9.37428V5.22633H6.71962V7.22633ZM8.37428 6.22633V6.83856H10.3743V6.22633H8.37428ZM9.37428 5.83856H6.71962V7.83856H9.37428V5.83856ZM5.74914 6.59735C5.71987 6.71514 5.6232 6.77554 5.54174 6.77554V8.77554C6.59396 8.77554 7.452 8.03771 7.69009 7.07976L5.74914 6.59735ZM5.54174 6.77554C5.44517 6.77554 5.32648 6.68707 5.32648 6.53244H3.32648C3.32648 7.74865 4.29809 8.77554 5.54174 8.77554V6.77554ZM5.32648 6.5324C5.32648 6.37792 5.44508 6.28941 5.54174 6.28941V4.28941C4.29817 4.28941 3.32643 5.31619 3.32648 6.53249L5.32648 6.5324ZM0 1V12.065H2V1H0ZM1 13.065H1.87532V11.065H1V13.065ZM0.875321 12.065V13H2.87532V12.065H0.875321ZM1.87532 14H2.92275V12H1.87532V14ZM3.92275 13V12.065H1.92275V13H3.92275ZM2.92275 13.065H11.0773V11.065H2.92275V13.065ZM10.0773 12.065V13H12.0773V12.065H10.0773ZM11.0773 14H12.1247V12H11.0773V14ZM13.1247 13V12.065H11.1247V13H13.1247ZM12.1247 13.065H13V11.065H12.1247V13.065ZM14 12.065V1H12V12.065H14ZM13 0H1V2H13V0ZM2.88645 11.0897V1.97534H0.886454V11.0897H2.88645ZM1.88645 2.97534H12.1135V0.975337H1.88645V2.97534ZM11.1135 1.97534V11.0897H13.1135V1.97534H11.1135ZM12.1135 10.0897H1.88645V12.0897H12.1135V10.0897Z","fill":"black","fill-opacity":"0.25","mask":"url(#path-1-outside-1)"}})]),_vm._v(" "),_c('span',[_vm._v(_vm._s(_vm.textBank))])])]):_vm._e(),_vm._v(" "),(_vm.cartridges != null)?_c('div',{staticClass:"cartridges"},[_c('svg',{attrs:{"width":"8","height":"18","viewBox":"0 0 8 18","fill":"none","xmlns":"http://www.w3.org/2000/svg"}},[_c('mask',{attrs:{"id":"path-1-outside-1","maskUnits":"userSpaceOnUse","x":"0","y":"-1","width":"8","height":"19","fill":"black"}},[_c('rect',{attrs:{"fill":"white","y":"-1","width":"8","height":"19"}}),_vm._v(" "),_c('path',{attrs:{"d":"M7 14.8667V6.86667C7 6.71919 6.86589 6.60001 6.70001 6.60001H1.29999C1.13407 6.60001 1 6.71922 1 6.86667V14.8667C1 15.0142 1.13411 15.1334 1.29999 15.1334V15.4C1.13407 15.4 1 15.5192 1 15.6667V16.7333C1 16.8808 1.13411 17 1.29999 17H6.70001C6.86593 17 7 16.8808 7 16.7333V15.6667C7 15.5192 6.86589 15.4001 6.70001 15.4001V15.1334C6.86589 15.1334 7 15.0142 7 14.8667Z"}}),_vm._v(" "),_c('path',{attrs:{"d":"M1.59997 6.06674H6.39999C6.56591 6.06674 6.69998 5.94753 6.69998 5.80008V5.53343C6.69998 3.78037 5.75767 2.10569 4.17996 1.0534C4.07316 0.9822 3.92676 0.9822 3.81997 1.0534C2.24226 2.10569 1.29995 3.78034 1.29995 5.53343V5.80008C1.29999 5.94753 1.43406 6.06674 1.59997 6.06674Z"}})]),_vm._v(" "),_c('path',{attrs:{"d":"M7 14.8667V6.86667C7 6.71919 6.86589 6.60001 6.70001 6.60001H1.29999C1.13407 6.60001 1 6.71922 1 6.86667V14.8667C1 15.0142 1.13411 15.1334 1.29999 15.1334V15.4C1.13407 15.4 1 15.5192 1 15.6667V16.7333C1 16.8808 1.13411 17 1.29999 17H6.70001C6.86593 17 7 16.8808 7 16.7333V15.6667C7 15.5192 6.86589 15.4001 6.70001 15.4001V15.1334C6.86589 15.1334 7 15.0142 7 14.8667Z","fill":"white"}}),_vm._v(" "),_c('path',{attrs:{"d":"M1.59997 6.06674H6.39999C6.56591 6.06674 6.69998 5.94753 6.69998 5.80008V5.53343C6.69998 3.78037 5.75767 2.10569 4.17996 1.0534C4.07316 0.9822 3.92676 0.9822 3.81997 1.0534C2.24226 2.10569 1.29995 3.78034 1.29995 5.53343V5.80008C1.29999 5.94753 1.43406 6.06674 1.59997 6.06674Z","fill":"white"}}),_vm._v(" "),_c('path',{attrs:{"d":"M1.29999 15.1334H2.29999V14.1334H1.29999V15.1334ZM1.29999 15.4V16.4H2.29999V15.4H1.29999ZM6.70001 15.4001H5.70001V16.4001H6.70001V15.4001ZM6.70001 15.1334L6.69982 14.1334L5.70001 14.1336V15.1334H6.70001ZM4.17996 1.0534L4.73484 0.221467L4.73466 0.221349L4.17996 1.0534ZM3.81997 1.0534L3.26526 0.221349L3.26509 0.221467L3.81997 1.0534ZM1.29995 5.80008H0.29995L0.29995 5.80033L1.29995 5.80008ZM8 14.8667V6.86667H6V14.8667H8ZM8 6.86667C8 6.05936 7.30412 5.60001 6.70001 5.60001V7.60001C6.42767 7.60001 6 7.37902 6 6.86667H8ZM6.70001 5.60001H1.29999V7.60001H6.70001V5.60001ZM1.29999 5.60001C0.695684 5.60001 0 6.05953 0 6.86667H2C2 7.3789 1.57246 7.60001 1.29999 7.60001V5.60001ZM0 6.86667V14.8667H2V6.86667H0ZM0 14.8667C0 15.674 0.695888 16.1334 1.29999 16.1334V14.1334C1.57232 14.1334 2 14.3544 2 14.8667H0ZM0.299986 15.1334V15.4H2.29999V15.1334H0.299986ZM1.29999 14.4C0.695684 14.4 0 14.8595 0 15.6667H2C2 16.1789 1.57246 16.4 1.29999 16.4V14.4ZM0 15.6667V16.7333H2V15.6667H0ZM0 16.7333C0 17.5407 0.695883 18 1.29999 18V16C1.57233 16 2 16.221 2 16.7333H0ZM1.29999 18H6.70001V16H1.29999V18ZM6.70001 18C7.30432 18 8 17.5405 8 16.7333H6C6 16.2211 6.42754 16 6.70001 16V18ZM8 16.7333V15.6667H6V16.7333H8ZM8 15.6667C8 14.8594 7.30412 14.4001 6.70001 14.4001V16.4001C6.42767 16.4001 6 16.1791 6 15.6667H8ZM7.70001 15.4001V15.1334H5.70001V15.4001H7.70001ZM6.70021 16.1334C7.30429 16.1333 8 15.6739 8 14.8667H6C6 14.3545 6.42749 14.1335 6.69982 14.1334L6.70021 16.1334ZM1.59997 7.06674H6.39999V5.06674H1.59997V7.06674ZM6.39999 7.06674C7.00429 7.06674 7.69998 6.60722 7.69998 5.80008H5.69998C5.69998 5.28785 6.12752 5.06674 6.39999 5.06674V7.06674ZM7.69998 5.80008V5.53343H5.69998V5.80008H7.69998ZM7.69998 5.53343C7.69998 3.41476 6.56353 1.44115 4.73484 0.221467L3.62508 1.88533C4.95181 2.77022 5.69998 4.14597 5.69998 5.53343H7.69998ZM4.73466 0.221349C4.29197 -0.073783 3.70796 -0.073783 3.26526 0.221349L4.37467 1.88545C4.14556 2.03818 3.85436 2.03818 3.62526 1.88545L4.73466 0.221349ZM3.26509 0.221467C1.4364 1.44115 0.29995 3.41473 0.29995 5.53343H2.29995C2.29995 4.14595 3.04812 2.77022 4.37484 1.88533L3.26509 0.221467ZM0.29995 5.53343V5.80008H2.29995V5.53343H0.29995ZM0.29995 5.80033C0.300146 6.60721 0.995595 7.06674 1.59997 7.06674V5.06674C1.87252 5.06674 2.29983 5.28785 2.29995 5.79984L0.29995 5.80033Z","fill":"black","fill-opacity":"0.25","mask":"url(#path-1-outside-1)"}})]),_vm._v(" "),_c('span',[_vm._v(_vm._s(_vm.cartridges))])]):_vm._e()])]),_vm._v(" "),(_vm.showSpeed)?_c('div',{staticClass:"speed"},[_c('div',{staticClass:"textSpeed"},[_c('svg',{attrs:{"width":"19","height":"12","viewBox":"0 0 19 12","fill":"none","xmlns":"http://www.w3.org/2000/svg"}},[_c('path',{attrs:{"d":"M13.5607 4.13955C13.5567 4.08448 13.5772 4.03019 13.6176 3.98874L15.4443 2.11257C15.4846 2.07112 15.5416 2.04584 15.6027 2.04228C15.664 2.03875 15.7238 2.05722 15.7697 2.09365C16.6091 2.75975 17.3058 3.54529 17.8407 4.42845C17.87 4.47691 17.8768 4.53389 17.8596 4.58684C17.8424 4.63981 17.8026 4.68446 17.749 4.71091L15.321 5.90902C15.2859 5.92637 15.248 5.93458 15.2106 5.93458C15.129 5.93458 15.05 5.8954 15.0081 5.82623C14.6546 5.24248 14.1938 4.7231 13.6385 4.28249C13.5925 4.24611 13.5645 4.19468 13.5607 4.13955Z","fill":"white"}}),_vm._v(" "),_c('path',{attrs:{"d":"M12.7455 3.44474C12.7041 3.51523 12.6242 3.55539 12.5416 3.55539C12.5051 3.55539 12.4681 3.54757 12.4338 3.53109C11.783 3.21951 11.0829 3.0162 10.3529 2.9268C10.2267 2.91135 10.1383 2.80648 10.1554 2.69255L10.5273 0.217298C10.5444 0.103395 10.6609 0.0236578 10.7868 0.0389887C11.8954 0.174724 12.9584 0.483416 13.9464 0.956486C14.0588 1.01035 14.1016 1.13631 14.042 1.23791L12.7455 3.44474Z","fill":"white"}}),_vm._v(" "),_c('path',{attrs:{"d":"M15.7158 6.79442L18.3863 6.14032C18.4453 6.12592 18.5083 6.13318 18.5613 6.16065C18.6144 6.18811 18.6532 6.23346 18.6692 6.28674C18.8887 7.01724 19 7.77437 19 8.5371C19 8.66762 18.9966 8.79856 18.9894 8.93744C18.9836 9.04902 18.8817 9.13596 18.7592 9.13596C18.7556 9.13596 18.7519 9.1359 18.7483 9.13573L15.9843 9.02046C15.9233 9.01793 15.8657 8.99355 15.8246 8.95277C15.7834 8.91199 15.7618 8.85804 15.7647 8.80291C15.7695 8.70927 15.7718 8.6223 15.7718 8.5371C15.7718 8.03205 15.6984 7.53168 15.5536 7.04981C15.5203 6.93888 15.593 6.82455 15.7158 6.79442Z","fill":"white"}}),_vm._v(" "),_c('path',{attrs:{"d":"M5.37931 0.807824C6.38553 0.369899 7.46061 0.098512 8.57469 0.00103346C8.63591 -0.00451592 8.69632 0.0124684 8.74354 0.0475304C8.79076 0.0826205 8.82057 0.133182 8.82646 0.188171L9.09324 2.67452C9.10554 2.78892 9.01271 2.89069 8.88595 2.90176C8.15166 2.96597 7.44347 3.14473 6.78105 3.43299C6.74954 3.44672 6.7153 3.45367 6.68093 3.45367C6.65529 3.45367 6.62958 3.44978 6.60487 3.44201C6.54715 3.42382 6.49978 3.38562 6.47324 3.3359L5.27177 1.08569C5.21641 0.982153 5.26457 0.857712 5.37931 0.807824Z","fill":"white"}}),_vm._v(" "),_c('path',{attrs:{"d":"M1.3151 4.29978C1.3002 4.24622 1.30939 4.18958 1.34081 4.14216C1.91304 3.27794 2.64264 2.51706 3.50928 1.88076C3.55675 1.84595 3.61732 1.82963 3.67839 1.83516C3.73921 1.84084 3.79506 1.86806 3.83361 1.91089L5.57953 3.8488C5.61809 3.89165 5.63628 3.94656 5.62998 4.00146C5.62374 4.05637 5.59356 4.10679 5.54609 4.14165C4.97268 4.56259 4.49008 5.06585 4.11163 5.63744C4.06841 5.70263 3.99195 5.73884 3.91347 5.73884C3.8732 5.73884 3.83244 5.72931 3.7954 5.7093L1.42038 4.42767C1.36794 4.39933 1.33006 4.35334 1.3151 4.29978Z","fill":"white"}}),_vm._v(" "),_c('path',{attrs:{"d":"M0.433336 5.97026C0.47146 5.86054 0.600888 5.79941 0.722308 5.83385L3.36268 6.58072C3.48422 6.61508 3.55184 6.73187 3.51378 6.84154C3.32428 7.38768 3.22819 7.95812 3.22819 8.53702C3.22819 8.62225 3.23055 8.70922 3.23533 8.80283C3.23819 8.85796 3.21664 8.91191 3.17541 8.95269C3.13422 8.9935 3.07675 9.01785 3.01568 9.02037L0.251657 9.13565C0.247993 9.13579 0.244393 9.13587 0.240791 9.13587C0.118347 9.13587 0.0163934 9.04891 0.0106189 8.93736C0.00350943 8.79848 0 8.66754 0 8.53702C6.20913e-05 7.66218 0.145791 6.7986 0.433336 5.97026Z","fill":"white"}}),_vm._v(" "),_c('path',{attrs:{"d":"M9.50819 8.09517C9.54796 8.09517 9.58751 8.09635 9.62691 8.09825L13.3726 6.10314C13.4642 6.05423 13.5806 6.06648 13.6574 6.13299C13.7343 6.19944 13.7528 6.30393 13.7026 6.38862L11.6594 9.84592C11.6669 9.91251 11.6709 9.97975 11.6709 10.0476C11.6709 10.5691 11.4459 11.0594 11.0375 11.4281C10.629 11.7969 10.0859 12 9.50816 12C8.93046 12 8.38738 11.7969 7.97892 11.4281C7.57042 11.0594 7.34549 10.5691 7.34549 10.0476C7.34549 9.52604 7.57045 9.03576 7.97892 8.66701C8.38738 8.29825 8.93053 8.09517 9.50819 8.09517Z","fill":"white"}})]),_vm._v(" "),_c('span',[_vm._v(_vm._s(_vm.speedText)+" "+_vm._s(_vm.speedType))])]),_vm._v(" "),_c('div',{staticClass:"progresbar"},[_c('div',{staticClass:"status"},[(parseInt(_vm.speedText) != 0)?_c('div',{staticClass:"bar",style:({width: _vm.speedPercent})}):_vm._e()])]),_vm._v(" "),_c('div',{staticClass:"bottom"},[_c('div',{staticClass:"locked stat"},[_c('svg',{attrs:{"width":"14","height":"18","viewBox":"0 0 14 18","fill":"none","xmlns":"http://www.w3.org/2000/svg"}},[_c('mask',{attrs:{"id":"path-1-outside-1","maskUnits":"userSpaceOnUse","x":"0","y":"0","width":"14","height":"18","fill":"black"}},[_c('rect',{attrs:{"fill":"white","width":"14","height":"18"}}),_vm._v(" "),_c('path',{attrs:{"fill-rule":"evenodd","clip-rule":"evenodd","d":"M11.9345 5.84434C11.9345 3.17363 9.69925 1 6.95053 1C4.20181 1 1.96867 3.17363 1.96867 5.84434V7.99468H1V17H13V7.99468H11.9345H10.1221H3.78101V5.84434C3.78101 4.14452 5.2038 2.76158 6.95261 2.76158C8.70037 2.76158 10.1232 4.14452 10.1232 5.84434H11.9345ZM8.12438 14.5591V12.6548C8.44623 12.3956 8.65559 12.0089 8.65454 11.5705C8.65454 10.7889 8.0046 10.1562 7.2005 10.1562C6.39641 10.1562 5.74438 10.7889 5.74438 11.5705C5.74438 12.0078 5.95374 12.3956 6.27558 12.6548V14.5591C6.27558 15.0562 6.68909 15.4571 7.2005 15.4571C7.71088 15.4571 8.12438 15.0552 8.12438 14.5591Z"}})]),_vm._v(" "),_c('path',{attrs:{"fill-rule":"evenodd","clip-rule":"evenodd","d":"M11.9345 5.84434C11.9345 3.17363 9.69925 1 6.95053 1C4.20181 1 1.96867 3.17363 1.96867 5.84434V7.99468H1V17H13V7.99468H11.9345H10.1221H3.78101V5.84434C3.78101 4.14452 5.2038 2.76158 6.95261 2.76158C8.70037 2.76158 10.1232 4.14452 10.1232 5.84434H11.9345ZM8.12438 14.5591V12.6548C8.44623 12.3956 8.65559 12.0089 8.65454 11.5705C8.65454 10.7889 8.0046 10.1562 7.2005 10.1562C6.39641 10.1562 5.74438 10.7889 5.74438 11.5705C5.74438 12.0078 5.95374 12.3956 6.27558 12.6548V14.5591C6.27558 15.0562 6.68909 15.4571 7.2005 15.4571C7.71088 15.4571 8.12438 15.0552 8.12438 14.5591Z","fill":_vm.speedLocked  ? '#FF0000' : '#61FF00'}}),_vm._v(" "),_c('path',{attrs:{"d":"M11.9345 5.84434V6.84434H12.9345V5.84434H11.9345ZM1.96867 7.99468V8.99468H2.96867V7.99468H1.96867ZM1 7.99468V6.99468H0V7.99468H1ZM1 17H0V18H1V17ZM13 17V18H14V17H13ZM13 7.99468H14V6.99468H13V7.99468ZM8.12438 12.6548L7.49719 11.8759L7.12438 12.1761V12.6548H8.12438ZM6.27558 12.6548H7.27558V12.1761L6.90278 11.8759L6.27558 12.6548ZM8.65454 11.5705H7.65454L7.65455 11.5729L8.65454 11.5705ZM3.78101 7.99468H2.78101V8.99468H3.78101V7.99468ZM10.1232 5.84434H9.12317V6.84434H10.1232V5.84434ZM12.9345 5.84434C12.9345 2.59489 10.2247 0 6.95053 0V2C9.17379 2 10.9345 3.75237 10.9345 5.84434H12.9345ZM6.95053 0C3.6758 0 0.968666 2.59542 0.968666 5.84434H2.96867C2.96867 3.75183 4.72781 2 6.95053 2V0ZM0.968666 5.84434V7.99468H2.96867V5.84434H0.968666ZM1.96867 6.99468H1V8.99468H1.96867V6.99468ZM0 7.99468V17H2V7.99468H0ZM1 18H13V16H1V18ZM14 17V7.99468H12V17H14ZM13 6.99468H11.9345V8.99468H13V6.99468ZM7.12438 12.6548V14.5591H9.12438V12.6548H7.12438ZM7.12438 14.5591C7.12438 14.5219 7.14138 14.4921 7.15684 14.477C7.1718 14.4625 7.18915 14.4571 7.2005 14.4571V16.4571C8.23619 16.4571 9.12438 15.6341 9.12438 14.5591H7.12438ZM7.2005 14.4571C7.21009 14.4571 7.22721 14.4619 7.2427 14.4769C7.25881 14.4925 7.27558 14.5228 7.27558 14.5591H5.27558C5.27558 15.6365 6.16527 16.4571 7.2005 16.4571V14.4571ZM7.27558 14.5591V12.6548H5.27558V14.5591H7.27558ZM6.90278 11.8759C6.79353 11.7879 6.74438 11.6767 6.74438 11.5705H4.74438C4.74438 12.339 5.11394 13.0033 5.64839 13.4336L6.90278 11.8759ZM6.74438 11.5705C6.74438 11.3687 6.92078 11.1562 7.2005 11.1562V9.15616C5.87204 9.15616 4.74438 10.2091 4.74438 11.5705H6.74438ZM7.2005 11.1562C7.47834 11.1562 7.65454 11.3669 7.65454 11.5705H9.65454C9.65454 10.211 8.53086 9.15616 7.2005 9.15616V11.1562ZM7.65455 11.5729C7.6548 11.6779 7.60688 11.7876 7.49719 11.8759L8.75158 13.4336C9.28558 13.0036 9.65637 12.3398 9.65454 11.5681L7.65455 11.5729ZM10.1221 6.99468H3.78101V8.99468H10.1221V6.99468ZM4.78101 7.99468V5.84434H2.78101V7.99468H4.78101ZM4.78101 5.84434C4.78101 4.7234 5.72912 3.76158 6.95261 3.76158V1.76158C4.67849 1.76158 2.78101 3.56565 2.78101 5.84434H4.78101ZM6.95261 3.76158C8.17484 3.76158 9.12317 4.72318 9.12317 5.84434H11.1232C11.1232 3.56586 9.2259 1.76158 6.95261 1.76158V3.76158ZM11.9345 6.99468H10.1221V8.99468H11.9345V6.99468ZM11.9345 4.84434H10.1232V6.84434H11.9345V4.84434Z","fill":"black","fill-opacity":"0.25","mask":"url(#path-1-outside-1)"}})])]),_vm._v(" "),_c('div',{staticClass:"ligh stat"},[_c('svg',{attrs:{"width":"21","height":"17","viewBox":"0 0 21 17","fill":"none","xmlns":"http://www.w3.org/2000/svg"}},[_c('mask',{attrs:{"id":"path-1-outside-1","maskUnits":"userSpaceOnUse","x":"0.00012207","y":"0","width":"21","height":"17","fill":"black"}},[_c('rect',{attrs:{"fill":"white","x":"0.00012207","width":"21","height":"17"}}),_vm._v(" "),_c('path',{attrs:{"d":"M17.3872 2.80343C15.9058 1.67413 14.0613 1 12.4529 1C10.8341 1 9.63778 1.67956 8.8971 3.01968C8.31676 4.06972 8.03455 5.50136 8.03455 7.3964C8.03455 9.29134 8.31667 10.723 8.8971 11.7731C9.63787 13.1132 10.8342 13.7928 12.4529 13.7928C14.0613 13.7928 15.9058 13.1186 17.3872 11.9893C19.0722 10.7047 20.0001 9.07359 20.0001 7.3964C20.0001 5.71902 19.0721 4.08787 17.3872 2.80343ZM16.5907 10.8566C15.3508 11.8018 13.7652 12.389 12.4528 12.389C11.0234 12.389 9.38262 11.8216 9.38262 7.3963C9.38262 2.97112 11.0234 2.40357 12.4528 2.40357C13.7653 2.40357 15.3508 2.99077 16.5907 3.9359C17.9007 4.93447 18.652 6.1957 18.652 7.3963C18.652 8.59681 17.9007 9.85805 16.5907 10.8566Z"}}),_vm._v(" "),_c('path',{attrs:{"d":"M16.5907 10.8566C15.3508 11.8018 13.7652 12.389 12.4528 12.389C11.0234 12.389 9.38262 11.8216 9.38262 7.3963C9.38262 2.97112 11.0234 2.40357 12.4528 2.40357C13.7653 2.40357 15.3508 2.99077 16.5907 3.9359C17.9007 4.93447 18.652 6.1957 18.652 7.3963C18.652 8.59681 17.9007 9.85805 16.5907 10.8566Z"}}),_vm._v(" "),_c('path',{attrs:{"d":"M6.45594 1.78521L1.37291 4.4313C1.03991 4.6046 0.904919 5.02617 1.07146 5.37288C1.18956 5.6188 1.42756 5.76094 1.6749 5.76094C1.77619 5.76094 1.87901 5.73708 1.97581 5.68664L7.05892 3.04055C7.39192 2.86724 7.52692 2.44558 7.36037 2.09897C7.19383 1.75227 6.78893 1.61162 6.45594 1.78521Z"}}),_vm._v(" "),_c('path',{attrs:{"d":"M6.45594 4.34492L1.37291 6.99111C1.03991 7.16441 0.904919 7.58598 1.07146 7.93269C1.18956 8.17861 1.42756 8.32075 1.6749 8.32075C1.77619 8.32075 1.87901 8.29689 1.97581 8.24655L7.05892 5.60036C7.39192 5.42705 7.52692 5.00549 7.36037 4.65878C7.19383 4.31198 6.78893 4.17143 6.45594 4.34492Z"}}),_vm._v(" "),_c('path',{attrs:{"d":"M6.45594 6.90464L1.37291 9.55073C1.03991 9.72404 0.904919 10.1456 1.07146 10.4923C1.18956 10.7382 1.42756 10.8804 1.6749 10.8804C1.77619 10.8804 1.87901 10.8565 1.97581 10.8062L7.05892 8.16007C7.39192 7.98677 7.52692 7.5652 7.36037 7.2185C7.19383 6.8717 6.78893 6.73124 6.45594 6.90464Z"}}),_vm._v(" "),_c('path',{attrs:{"d":"M6.45594 9.46438L1.37291 12.1107C1.03991 12.284 0.904919 12.7055 1.07146 13.0522C1.18956 13.2982 1.42756 13.4403 1.6749 13.4403C1.77619 13.4403 1.87901 13.4164 1.97581 13.3661L7.05892 10.7199C7.39192 10.5466 7.52692 10.125 7.36037 9.77833C7.19383 9.43153 6.78893 9.29098 6.45594 9.46438Z"}}),_vm._v(" "),_c('path',{attrs:{"d":"M6.45594 12.0242L1.37291 14.6704C1.03991 14.8437 0.904919 15.2652 1.07146 15.6119C1.18956 15.8579 1.42756 16 1.6749 16C1.77619 16 1.87901 15.9761 1.97581 15.9258L7.05892 13.2796C7.39192 13.1063 7.52692 12.6847 7.36037 12.338C7.19383 11.9913 6.78893 11.8507 6.45594 12.0242Z"}})]),_vm._v(" "),_c('path',{attrs:{"d":"M17.3872 2.80343C15.9058 1.67413 14.0613 1 12.4529 1C10.8341 1 9.63778 1.67956 8.8971 3.01968C8.31676 4.06972 8.03455 5.50136 8.03455 7.3964C8.03455 9.29134 8.31667 10.723 8.8971 11.7731C9.63787 13.1132 10.8342 13.7928 12.4529 13.7928C14.0613 13.7928 15.9058 13.1186 17.3872 11.9893C19.0722 10.7047 20.0001 9.07359 20.0001 7.3964C20.0001 5.71902 19.0721 4.08787 17.3872 2.80343ZM16.5907 10.8566C15.3508 11.8018 13.7652 12.389 12.4528 12.389C11.0234 12.389 9.38262 11.8216 9.38262 7.3963C9.38262 2.97112 11.0234 2.40357 12.4528 2.40357C13.7653 2.40357 15.3508 2.99077 16.5907 3.9359C17.9007 4.93447 18.652 6.1957 18.652 7.3963C18.652 8.59681 17.9007 9.85805 16.5907 10.8566Z","fill":_vm.speedLigh ? '#F2C94C' : '#A6A6A6'}}),_vm._v(" "),_c('path',{attrs:{"d":"M16.5907 10.8566C15.3508 11.8018 13.7652 12.389 12.4528 12.389C11.0234 12.389 9.38262 11.8216 9.38262 7.3963C9.38262 2.97112 11.0234 2.40357 12.4528 2.40357C13.7653 2.40357 15.3508 2.99077 16.5907 3.9359C17.9007 4.93447 18.652 6.1957 18.652 7.3963C18.652 8.59681 17.9007 9.85805 16.5907 10.8566Z","fill":"#F2C94C"}}),_vm._v(" "),_c('path',{attrs:{"d":"M6.45594 1.78521L1.37291 4.4313C1.03991 4.6046 0.904919 5.02617 1.07146 5.37288C1.18956 5.6188 1.42756 5.76094 1.6749 5.76094C1.77619 5.76094 1.87901 5.73708 1.97581 5.68664L7.05892 3.04055C7.39192 2.86724 7.52692 2.44558 7.36037 2.09897C7.19383 1.75227 6.78893 1.61162 6.45594 1.78521Z","fill":"#F2C94C"}}),_vm._v(" "),_c('path',{attrs:{"d":"M6.45594 4.34492L1.37291 6.99111C1.03991 7.16441 0.904919 7.58598 1.07146 7.93269C1.18956 8.17861 1.42756 8.32075 1.6749 8.32075C1.77619 8.32075 1.87901 8.29689 1.97581 8.24655L7.05892 5.60036C7.39192 5.42705 7.52692 5.00549 7.36037 4.65878C7.19383 4.31198 6.78893 4.17143 6.45594 4.34492Z","fill":"#F2C94C"}}),_vm._v(" "),_c('path',{attrs:{"d":"M6.45594 6.90464L1.37291 9.55073C1.03991 9.72404 0.904919 10.1456 1.07146 10.4923C1.18956 10.7382 1.42756 10.8804 1.6749 10.8804C1.77619 10.8804 1.87901 10.8565 1.97581 10.8062L7.05892 8.16007C7.39192 7.98677 7.52692 7.5652 7.36037 7.2185C7.19383 6.8717 6.78893 6.73124 6.45594 6.90464Z","fill":"#F2C94C"}}),_vm._v(" "),_c('path',{attrs:{"d":"M6.45594 9.46438L1.37291 12.1107C1.03991 12.284 0.904919 12.7055 1.07146 13.0522C1.18956 13.2982 1.42756 13.4403 1.6749 13.4403C1.77619 13.4403 1.87901 13.4164 1.97581 13.3661L7.05892 10.7199C7.39192 10.5466 7.52692 10.125 7.36037 9.77833C7.19383 9.43153 6.78893 9.29098 6.45594 9.46438Z","fill":"#F2C94C"}}),_vm._v(" "),_c('path',{attrs:{"d":"M6.45594 12.0242L1.37291 14.6704C1.03991 14.8437 0.904919 15.2652 1.07146 15.6119C1.18956 15.8579 1.42756 16 1.6749 16C1.77619 16 1.87901 15.9761 1.97581 15.9258L7.05892 13.2796C7.39192 13.1063 7.52692 12.6847 7.36037 12.338C7.19383 11.9913 6.78893 11.8507 6.45594 12.0242Z","fill":"#F2C94C"}}),_vm._v(" "),_c('path',{attrs:{"d":"M16.5907 10.8566L16.2876 10.459L16.2876 10.459L16.5907 10.8566ZM16.5907 3.9359L16.2876 4.33354L16.2876 4.33354L16.5907 3.9359ZM16.2876 10.459C15.1179 11.3507 13.6362 11.889 12.4528 11.889V12.889C13.8943 12.889 15.5838 12.253 16.8938 11.2542L16.2876 10.459ZM12.4528 11.889C11.8021 11.889 11.214 11.7611 10.7632 11.2289C10.2892 10.6695 9.88262 9.56787 9.88262 7.3963H8.88262C8.88262 9.65002 9.29646 11.0448 10.0002 11.8754C10.7271 12.7333 11.6742 12.889 12.4528 12.889V11.889ZM9.88262 7.3963C9.88262 5.22479 10.2892 4.12317 10.7632 3.56371C11.2141 3.03155 11.8021 2.90357 12.4528 2.90357V1.90357C11.6741 1.90357 10.7271 2.05936 10.0002 2.91727C9.29646 3.74789 8.88262 5.14263 8.88262 7.3963H9.88262ZM12.4528 2.90357C13.6363 2.90357 15.1179 3.4419 16.2876 4.33354L16.8938 3.53826C15.5838 2.53963 13.8944 1.90357 12.4528 1.90357V2.90357ZM16.2876 4.33354C17.5229 5.27518 18.152 6.40479 18.152 7.3963H19.152C19.152 5.98662 18.2785 4.59375 16.8938 3.53826L16.2876 4.33354ZM18.152 7.3963C18.152 8.38772 17.5229 9.51733 16.2876 10.459L16.8938 11.2543C18.2785 10.1988 19.152 8.8059 19.152 7.3963H18.152ZM17.3872 2.80343L16.7809 3.59869L16.781 3.5987L17.3872 2.80343ZM8.8971 3.01968L8.02188 2.53595L8.02188 2.53596L8.8971 3.01968ZM8.8971 11.7731L8.02189 12.2569L8.02191 12.2569L8.8971 11.7731ZM17.3872 11.9893L16.7809 11.194L16.7809 11.194L17.3872 11.9893ZM6.45594 1.78521L6.91769 2.67222L6.91819 2.67196L6.45594 1.78521ZM1.37291 4.4313L1.83457 5.31835L1.83466 5.31831L1.37291 4.4313ZM1.07146 5.37288L1.9729 4.93998L1.97286 4.93988L1.07146 5.37288ZM1.97581 5.68664L1.51406 4.79963L1.51371 4.79981L1.97581 5.68664ZM7.05892 3.04055L6.59726 2.15349L6.59718 2.15354L7.05892 3.04055ZM7.36037 2.09897L6.45898 2.53197L6.45902 2.53206L7.36037 2.09897ZM6.45594 4.34492L6.9177 5.23193L6.91799 5.23177L6.45594 4.34492ZM1.37291 6.99111L1.83457 7.87816L1.83468 7.87811L1.37291 6.99111ZM1.07146 7.93269L1.9729 7.49979L1.97286 7.49969L1.07146 7.93269ZM1.97581 8.24655L2.43723 9.13373L2.43757 9.13355L1.97581 8.24655ZM7.05892 5.60036L6.59726 4.7133L6.59716 4.71335L7.05892 5.60036ZM7.36037 4.65878L6.45893 5.09168L6.45898 5.09178L7.36037 4.65878ZM6.45594 6.90464L6.91769 7.79165L6.91779 7.79159L6.45594 6.90464ZM1.37291 9.55073L1.83457 10.4378L1.83466 10.4377L1.37291 9.55073ZM1.07146 10.4923L1.9729 10.0594L1.97286 10.0593L1.07146 10.4923ZM1.97581 10.8062L2.43723 11.6933L2.43756 11.6932L1.97581 10.8062ZM7.05892 8.16007L6.59726 7.27302L6.59718 7.27306L7.05892 8.16007ZM7.36037 7.2185L6.45893 7.6514L6.45898 7.65149L7.36037 7.2185ZM6.45594 9.46438L6.91771 10.3514L6.91779 10.3513L6.45594 9.46438ZM1.37291 12.1107L1.83457 12.9977L1.83469 12.9977L1.37291 12.1107ZM1.07146 13.0522L1.9729 12.6193L1.97286 12.6192L1.07146 13.0522ZM1.97581 13.3661L2.43723 14.2533L2.43757 14.2531L1.97581 13.3661ZM7.05892 10.7199L6.59726 9.83285L6.59716 9.8329L7.05892 10.7199ZM7.36037 9.77833L6.45893 10.2112L6.45898 10.2113L7.36037 9.77833ZM6.45594 12.0242L6.9177 12.9112L6.91799 12.911L6.45594 12.0242ZM1.37291 14.6704L1.83457 15.5574L1.83468 15.5574L1.37291 14.6704ZM1.07146 15.6119L1.9729 15.179L1.97286 15.1789L1.07146 15.6119ZM1.97581 15.9258L2.43723 16.813L2.43757 16.8128L1.97581 15.9258ZM7.05892 13.2796L6.59726 12.3926L6.59716 12.3926L7.05892 13.2796ZM17.9935 2.00816C16.3666 0.767929 14.3139 0 12.4529 0V2C13.8087 2 15.4451 2.58034 16.7809 3.59869L17.9935 2.00816ZM12.4529 0C10.4959 0 8.95072 0.855405 8.02188 2.53595L9.77232 3.50341C10.3248 2.50371 11.1724 2 12.4529 2V0ZM8.02188 2.53596C7.3255 3.79595 7.03455 5.42071 7.03455 7.3964H9.03454C9.03454 5.58201 9.30802 4.34348 9.77232 3.50341L8.02188 2.53596ZM7.03455 7.3964C7.03455 9.37195 7.3254 10.9967 8.02189 12.2569L9.77231 11.2894C9.30795 10.4492 9.03454 9.21073 9.03454 7.3964H7.03455ZM8.02191 12.2569C8.95082 13.9374 10.496 14.7928 12.4529 14.7928V12.7928C11.1725 12.7928 10.3249 12.2891 9.77229 11.2893L8.02191 12.2569ZM12.4529 14.7928C14.3139 14.7928 16.3666 14.0248 17.9935 12.7845L16.7809 11.194C15.4451 12.2124 13.8087 12.7928 12.4529 12.7928V14.7928ZM17.9935 12.7845C19.8546 11.3657 21.0001 9.46613 21.0001 7.3964H19.0001C19.0001 8.68104 18.2898 10.0438 16.7809 11.194L17.9935 12.7845ZM21.0001 7.3964C21.0001 5.32647 19.8546 3.42689 17.9935 2.00815L16.781 3.5987C18.2897 4.74885 19.0001 6.11157 19.0001 7.3964H21.0001ZM5.99418 0.898199L0.911157 3.54429L1.83466 5.31831L6.91769 2.67222L5.99418 0.898199ZM0.911249 3.54424C0.0802734 3.97672 -0.220755 4.99227 0.170065 5.80587L1.97286 4.93988C2.03059 5.06007 1.99956 5.23249 1.83457 5.31835L0.911249 3.54424ZM0.17002 5.80578C0.454077 6.39728 1.04188 6.76094 1.6749 6.76094V4.76094C1.81323 4.76094 1.92504 4.84032 1.9729 4.93998L0.17002 5.80578ZM1.6749 6.76094C1.93479 6.76094 2.1964 6.69931 2.43791 6.57347L1.51371 4.79981C1.56162 4.77485 1.6176 4.76094 1.6749 4.76094V6.76094ZM2.43756 6.57365L7.52067 3.92756L6.59718 2.15354L1.51406 4.79963L2.43756 6.57365ZM7.52059 3.92761C8.35154 3.49514 8.65264 2.47946 8.26172 1.66588L6.45902 2.53206C6.40119 2.41171 6.43229 2.23935 6.59726 2.15349L7.52059 3.92761ZM8.26177 1.66598C7.86125 0.832187 6.84945 0.452357 5.99368 0.898458L6.91819 2.67196C6.72841 2.77088 6.52641 2.67235 6.45898 2.53197L8.26177 1.66598ZM5.99417 3.45792L0.911144 6.10411L1.83468 7.87811L6.9177 5.23193L5.99417 3.45792ZM0.911249 6.10405C0.0802727 6.53653 -0.220755 7.55208 0.170065 8.36568L1.97286 7.49969C2.03059 7.61988 1.99956 7.7923 1.83457 7.87816L0.911249 6.10405ZM0.17002 8.36559C0.454078 8.95709 1.04188 9.32075 1.6749 9.32075V7.32075C1.81323 7.32075 1.92504 7.40013 1.9729 7.49979L0.17002 8.36559ZM1.6749 9.32075C1.93476 9.32075 2.19609 9.25914 2.43723 9.13373L1.51439 7.35936C1.56193 7.33464 1.61763 7.32075 1.6749 7.32075V9.32075ZM2.43757 9.13355L7.52068 6.48736L6.59716 4.71335L1.51405 7.35954L2.43757 9.13355ZM7.52059 6.48742C8.35156 6.05494 8.65259 5.03939 8.26177 4.22579L6.45898 5.09178C6.40124 4.97159 6.43228 4.79917 6.59726 4.7133L7.52059 6.48742ZM8.26181 4.22588C7.86123 3.39173 6.84939 3.01234 5.99388 3.45807L6.91799 5.23177C6.72847 5.33052 6.52643 5.23224 6.45893 5.09168L8.26181 4.22588ZM5.99418 6.01763L0.911157 8.66372L1.83466 10.4377L6.91769 7.79165L5.99418 6.01763ZM0.911249 8.66368C0.0802735 9.09615 -0.220755 10.1117 0.170065 10.9253L1.97286 10.0593C2.03059 10.1795 1.99956 10.3519 1.83457 10.4378L0.911249 8.66368ZM0.17002 10.9252C0.454078 11.5167 1.04188 11.8804 1.6749 11.8804V9.88037C1.81323 9.88037 1.92504 9.95975 1.9729 10.0594L0.17002 10.9252ZM1.6749 11.8804C1.93475 11.8804 2.19609 11.8188 2.43723 11.6933L1.51439 9.91899C1.56193 9.89426 1.61763 9.88037 1.6749 9.88037V11.8804ZM2.43756 11.6932L7.52067 9.04709L6.59718 7.27306L1.51406 9.91916L2.43756 11.6932ZM7.52059 9.04713C8.35156 8.61465 8.65259 7.5991 8.26177 6.7855L6.45898 7.65149C6.40124 7.5313 6.43228 7.35888 6.59726 7.27302L7.52059 9.04713ZM8.26181 6.7856C7.86112 5.95121 6.84928 5.57236 5.99408 6.01768L6.91779 7.79159C6.72859 7.89012 6.52654 7.79218 6.45893 7.6514L8.26181 6.7856ZM5.99416 8.57738L0.911132 11.2237L1.83469 12.9977L6.91771 10.3514L5.99416 8.57738ZM0.911249 11.2236C0.0802733 11.6561 -0.220755 12.6716 0.170065 13.4852L1.97286 12.6192C2.03059 12.7394 1.99956 12.9118 1.83457 12.9977L0.911249 11.2236ZM0.17002 13.4851C0.454077 14.0766 1.04188 14.4403 1.6749 14.4403V12.4403C1.81323 12.4403 1.92504 12.5197 1.9729 12.6193L0.17002 13.4851ZM1.6749 14.4403C1.93476 14.4403 2.19609 14.3787 2.43723 14.2533L1.51439 12.4789C1.56193 12.4542 1.61763 12.4403 1.6749 12.4403V14.4403ZM2.43757 14.2531L7.52068 11.6069L6.59716 9.8329L1.51405 12.4791L2.43757 14.2531ZM7.52059 11.607C8.35156 11.1745 8.65259 10.1589 8.26177 9.34534L6.45898 10.2113C6.40124 10.0911 6.43228 9.91872 6.59726 9.83285L7.52059 11.607ZM8.26181 9.34543C7.86123 8.51127 6.84949 8.13199 5.99408 8.57742L6.91779 10.3513C6.72837 10.45 6.52643 10.3518 6.45893 10.2112L8.26181 9.34543ZM5.99417 11.1372L0.911144 13.7834L1.83468 15.5574L6.9177 12.9112L5.99417 11.1372ZM0.911249 13.7833C0.0802739 14.2158 -0.220756 15.2313 0.170065 16.0449L1.97286 15.1789C2.03059 15.2991 1.99956 15.4715 1.83457 15.5574L0.911249 13.7833ZM0.17002 16.0448C0.454078 16.6363 1.04188 17 1.6749 17V15C1.81323 15 1.92504 15.0794 1.9729 15.179L0.17002 16.0448ZM1.6749 17C1.93475 17 2.19609 16.9384 2.43723 16.813L1.51439 15.0386C1.56193 15.0139 1.61763 15 1.6749 15V17ZM2.43757 16.8128L7.52068 14.1666L6.59716 12.3926L1.51405 15.0388L2.43757 16.8128ZM7.52059 14.1667C8.35156 13.7342 8.65259 12.7186 8.26177 11.905L6.45898 12.771C6.40124 12.6508 6.43228 12.4784 6.59726 12.3926L7.52059 14.1667ZM8.26177 11.905C7.86125 11.0712 6.84955 10.6915 5.99388 11.1373L6.91799 12.911C6.72831 13.0098 6.52641 12.9114 6.45898 12.771L8.26177 11.905Z","fill":"black","fill-opacity":"0.25","mask":"url(#path-1-outside-1)"}})])]),_vm._v(" "),_c('div',{staticClass:"fuel stat"},[_c('svg',{attrs:{"width":"15","height":"18","viewBox":"0 0 15 18","fill":"none","xmlns":"http://www.w3.org/2000/svg"}},[_c('mask',{attrs:{"id":"path-1-outside-1","maskUnits":"userSpaceOnUse","x":"0","y":"0","width":"16","height":"18","fill":"black"}},[_c('rect',{attrs:{"fill":"white","width":"16","height":"18"}}),_vm._v(" "),_c('path',{attrs:{"d":"M13.7936 5.24756H13.6157L13.1642 3.97637C13.1212 3.85543 13.0242 3.76128 12.9019 3.72191L12.32 3.53427C12.1028 3.46421 11.8702 3.58319 11.8002 3.79987C11.7301 4.0166 11.8492 4.24899 12.0662 4.3189L12.454 4.44397L12.7394 5.24753H12.6168C12.5356 5.24753 12.4619 5.29506 12.4285 5.36907L12.0938 6.11132C12.0802 6.14141 12.074 6.17438 12.0759 6.20732L12.2018 8.47493C12.2079 8.58416 12.2983 8.66965 12.4079 8.66965H12.5366V13.5855C12.5366 14.134 12.2247 14.6109 11.7688 14.8493V11.783C11.7688 11.4812 11.6597 11.2044 11.4792 10.9894V2.53639C11.4792 1.68923 10.789 1 9.94055 1H2.82833C1.9799 1 1.28969 1.68923 1.28969 2.53639V10.9893C1.10908 11.2042 1 11.4811 1 11.783V15.7631C1 16.4451 1.55573 17 2.23884 17H10.53C11.1473 17 11.6605 16.5468 11.7536 15.9561C12.7983 15.6722 13.569 14.7173 13.569 13.5855V8.6697H13.7935C13.9075 8.6697 14 8.57741 14 8.46356V5.45375C14 5.3399 13.9076 5.24756 13.7936 5.24756ZM6.38441 12.2418C5.41732 12.2418 4.63332 11.459 4.63332 10.4933C4.63332 9.52771 6.38441 7.68013 6.38441 7.68013C6.38441 7.68013 8.13545 9.52774 8.13545 10.4933C8.13545 11.459 7.35142 12.2418 6.38441 12.2418ZM9.82757 5.41166H2.94136V2.6492H9.82757V5.41166Z"}})]),_vm._v(" "),_c('path',{attrs:{"d":"M13.7936 5.24756H13.6157L13.1642 3.97637C13.1212 3.85543 13.0242 3.76128 12.9019 3.72191L12.32 3.53427C12.1028 3.46421 11.8702 3.58319 11.8002 3.79987C11.7301 4.0166 11.8492 4.24899 12.0662 4.3189L12.454 4.44397L12.7394 5.24753H12.6168C12.5356 5.24753 12.4619 5.29506 12.4285 5.36907L12.0938 6.11132C12.0802 6.14141 12.074 6.17438 12.0759 6.20732L12.2018 8.47493C12.2079 8.58416 12.2983 8.66965 12.4079 8.66965H12.5366V13.5855C12.5366 14.134 12.2247 14.6109 11.7688 14.8493V11.783C11.7688 11.4812 11.6597 11.2044 11.4792 10.9894V2.53639C11.4792 1.68923 10.789 1 9.94055 1H2.82833C1.9799 1 1.28969 1.68923 1.28969 2.53639V10.9893C1.10908 11.2042 1 11.4811 1 11.783V15.7631C1 16.4451 1.55573 17 2.23884 17H10.53C11.1473 17 11.6605 16.5468 11.7536 15.9561C12.7983 15.6722 13.569 14.7173 13.569 13.5855V8.6697H13.7935C13.9075 8.6697 14 8.57741 14 8.46356V5.45375C14 5.3399 13.9076 5.24756 13.7936 5.24756ZM6.38441 12.2418C5.41732 12.2418 4.63332 11.459 4.63332 10.4933C4.63332 9.52771 6.38441 7.68013 6.38441 7.68013C6.38441 7.68013 8.13545 9.52774 8.13545 10.4933C8.13545 11.459 7.35142 12.2418 6.38441 12.2418ZM9.82757 5.41166H2.94136V2.6492H9.82757V5.41166Z","fill":_vm.fuel < 20  ? '#FF0000' : '#61FF00'}}),_vm._v(" "),_c('path',{attrs:{"d":"M13.6157 5.24756L12.6734 5.5823L12.9098 6.24756H13.6157V5.24756ZM13.1642 3.97637L14.1065 3.64162L14.1064 3.64142L13.1642 3.97637ZM12.9019 3.72191L12.595 4.67365L12.5955 4.67382L12.9019 3.72191ZM12.32 3.53427L12.013 4.486L12.0131 4.48602L12.32 3.53427ZM11.8002 3.79987L12.7517 4.10758L12.7517 4.10734L11.8002 3.79987ZM12.0662 4.3189L12.3731 3.36718L12.3729 3.3671L12.0662 4.3189ZM12.454 4.44397L13.3963 4.10924L13.231 3.64385L12.7609 3.49225L12.454 4.44397ZM12.7394 5.24753V6.24753H14.1559L13.6817 4.91279L12.7394 5.24753ZM12.4285 5.36907L13.3401 5.78019L13.3402 5.77996L12.4285 5.36907ZM12.0938 6.11132L11.1822 5.7002L11.1821 5.70041L12.0938 6.11132ZM12.0759 6.20732L13.0744 6.15188L13.0743 6.15098L12.0759 6.20732ZM12.2018 8.47493L11.2033 8.53037L11.2034 8.53069L12.2018 8.47493ZM12.5366 8.66965H13.5366V7.66965H12.5366V8.66965ZM11.7688 14.8493H10.7688V16.5008L12.2322 15.7354L11.7688 14.8493ZM11.4792 10.9894H10.4792V11.3536L10.7134 11.6325L11.4792 10.9894ZM11.4792 2.53639L10.4792 2.53636V2.53639H11.4792ZM1.28969 10.9893L2.05535 11.6325L2.28969 11.3536V10.9893H1.28969ZM11.7536 15.9561L11.4914 14.991L10.8666 15.1608L10.7658 15.8004L11.7536 15.9561ZM13.569 8.6697V7.6697H12.569V8.6697H13.569ZM14 5.45375L13 5.45352V5.45375H14ZM6.38441 7.68013L7.11023 6.99225L6.38443 6.22641L5.65861 6.99223L6.38441 7.68013ZM9.82757 5.41166V6.41166H10.8276V5.41166H9.82757ZM2.94136 5.41166H1.94136V6.41166H2.94136V5.41166ZM2.94136 2.6492V1.6492H1.94136V2.6492H2.94136ZM9.82757 2.6492H10.8276V1.6492H9.82757V2.6492ZM13.7936 4.24756H13.6157V6.24756H13.7936V4.24756ZM14.558 4.91281L14.1065 3.64162L12.2219 4.31111L12.6734 5.5823L14.558 4.91281ZM14.1064 3.64142C13.9591 3.22712 13.6272 2.90482 13.2083 2.77L12.5955 4.67382C12.4213 4.61774 12.2832 4.48373 12.2219 4.31131L14.1064 3.64142ZM13.2088 2.77017L12.6269 2.58253L12.0131 4.48602L12.595 4.67365L13.2088 2.77017ZM12.627 2.58255C11.8854 2.34337 11.0887 2.7493 10.8486 3.4924L12.7517 4.10734C12.6517 4.41708 12.3201 4.58504 12.013 4.486L12.627 2.58255ZM10.8487 3.49216C10.6083 4.23562 11.0173 5.03156 11.7595 5.27071L12.3729 3.3671C12.6811 3.46643 12.8519 3.79758 12.7517 4.10758L10.8487 3.49216ZM11.7592 5.27063L12.147 5.3957L12.7609 3.49225L12.3731 3.36718L11.7592 5.27063ZM11.5117 4.77871L11.7971 5.58227L13.6817 4.91279L13.3963 4.10924L11.5117 4.77871ZM12.7394 4.24753H12.6168V6.24753H12.7394V4.24753ZM12.6168 4.24753C12.1431 4.24753 11.7121 4.52482 11.5168 4.95818L13.3402 5.77996C13.2116 6.0653 12.928 6.24753 12.6168 6.24753V4.24753ZM11.5169 4.95796L11.1822 5.7002L13.0053 6.52244L13.3401 5.78019L11.5169 4.95796ZM11.1821 5.70041C11.1028 5.87636 11.0665 6.06954 11.0775 6.26366L13.0743 6.15098C13.0815 6.27922 13.0576 6.40646 13.0054 6.52223L11.1821 5.70041ZM11.0774 6.26276L11.2033 8.53037L13.2003 8.41949L13.0744 6.15188L11.0774 6.26276ZM11.2034 8.53069C11.2391 9.17057 11.7686 9.66965 12.4079 9.66965V7.66965C12.8281 7.66965 13.1767 7.99775 13.2003 8.41916L11.2034 8.53069ZM12.4079 9.66965H12.5366V7.66965H12.4079V9.66965ZM11.5366 8.66965V13.5855H13.5366V8.66965H11.5366ZM11.5366 13.5855C11.5366 13.7451 11.4464 13.8894 11.3053 13.9632L12.2322 15.7354C13.0029 15.3323 13.5366 14.5229 13.5366 13.5855H11.5366ZM12.7688 14.8493V11.783H10.7688V14.8493H12.7688ZM12.7688 11.783C12.7688 11.2358 12.5701 10.7335 12.245 10.3463L10.7134 11.6325C10.7493 11.6753 10.7688 11.7266 10.7688 11.783H12.7688ZM12.4792 10.9894V2.53639H10.4792V10.9894H12.4792ZM12.4792 2.53642C12.4792 1.13558 11.3399 0 9.94055 0V2C10.2381 2 10.4792 2.24288 10.4792 2.53636L12.4792 2.53642ZM9.94055 0H2.82833V2H9.94055V0ZM2.82833 0C1.42898 0 0.289688 1.13558 0.289688 2.53639H2.28969C2.28969 2.24288 2.53081 2 2.82833 2V0ZM0.289688 2.53639V10.9893H2.28969V2.53639H0.289688ZM0.524029 10.346C0.198691 10.7333 0 11.2357 0 11.783H2C2 11.7265 2.01947 11.6752 2.05535 11.6325L0.524029 10.346ZM0 11.783V15.7631H2V11.783H0ZM0 15.7631C0 16.9989 1.0049 18 2.23884 18V16C2.10656 16 2 15.8914 2 15.7631H0ZM2.23884 18H10.53V16H2.23884V18ZM10.53 18C11.6469 18 12.5729 17.1814 12.7414 16.1117L10.7658 15.8004C10.7482 15.9122 10.6478 16 10.53 16V18ZM12.0158 16.9211C13.4827 16.5225 14.569 15.1823 14.569 13.5855H12.569C12.569 14.2523 12.1139 14.8219 11.4914 14.991L12.0158 16.9211ZM14.569 13.5855V8.6697H12.569V13.5855H14.569ZM13.569 9.6697H13.7935V7.6697H13.569V9.6697ZM13.7935 9.6697C14.4583 9.6697 15 9.13118 15 8.46356H13C13 8.02364 13.3568 7.6697 13.7935 7.6697V9.6697ZM15 8.46356V5.45375H13V8.46356H15ZM15 5.45398C15.0002 4.78654 14.4588 4.24756 13.7936 4.24756V6.24756C13.3564 6.24756 12.9999 5.89325 13 5.45352L15 5.45398ZM6.38441 11.2418C5.96819 11.2418 5.63332 10.9053 5.63332 10.4933H3.63332C3.63332 12.0127 4.86644 13.2418 6.38441 13.2418V11.2418ZM5.63332 10.4933C5.63332 10.5068 5.64363 10.3912 5.79004 10.1156C5.92021 9.87056 6.10541 9.59539 6.30833 9.32535C6.50847 9.059 6.71093 8.81727 6.86456 8.64105C6.94091 8.55348 7.00409 8.48336 7.04743 8.43593C7.06907 8.41224 7.08569 8.39429 7.09645 8.38273C7.10183 8.37696 7.10574 8.37279 7.10807 8.37031C7.10924 8.36907 7.11001 8.36826 7.11037 8.36787C7.11055 8.36768 7.11063 8.3676 7.1106 8.36762C7.11059 8.36764 7.11055 8.36768 7.11049 8.36774C7.11046 8.36778 7.11039 8.36785 7.11037 8.36787C7.1103 8.36795 7.11022 8.36803 6.38441 7.68013C5.65861 6.99223 5.65851 6.99233 5.65841 6.99244C5.65837 6.99248 5.65826 6.9926 5.65817 6.99269C5.658 6.99287 5.6578 6.99308 5.65758 6.99331C5.65713 6.99379 5.65658 6.99438 5.65592 6.99508C5.6546 6.99648 5.65285 6.99832 5.65071 7.00061C5.64641 7.00518 5.64048 7.0115 5.63304 7.0195C5.61815 7.03548 5.59715 7.05817 5.57091 7.08689C5.51849 7.14427 5.44486 7.22603 5.35704 7.32675C5.18235 7.52713 4.94704 7.80766 4.70941 8.1239C4.47455 8.43646 4.22199 8.80423 4.02382 9.17723C3.84191 9.51964 3.63332 9.99703 3.63332 10.4933H5.63332ZM6.38441 7.68013C5.65859 8.36801 5.65851 8.36793 5.65843 8.36785C5.65842 8.36783 5.65835 8.36776 5.65832 8.36773C5.65825 8.36766 5.65822 8.36762 5.6582 8.36761C5.65818 8.36758 5.65826 8.36766 5.65844 8.36786C5.6588 8.36824 5.65957 8.36906 5.66074 8.3703C5.66307 8.37278 5.66698 8.37695 5.67235 8.38272C5.68311 8.39427 5.69974 8.41222 5.72138 8.43591C5.76472 8.48334 5.82789 8.55347 5.90424 8.64104C6.05786 8.81726 6.26033 9.05899 6.46046 9.32534C6.66337 9.59538 6.84857 9.87056 6.97873 10.1156C7.12514 10.3912 7.13545 10.5068 7.13545 10.4933H9.13545C9.13545 9.99704 8.92687 9.51966 8.74496 9.17725C8.5468 8.80426 8.29425 8.43649 8.0594 8.12393C7.82177 7.80768 7.58648 7.52716 7.41178 7.32677C7.32397 7.22605 7.25035 7.14428 7.19792 7.0869C7.17169 7.05819 7.15069 7.0355 7.1358 7.01951C7.12835 7.01152 7.12243 7.0052 7.11813 7.00063C7.11598 6.99834 7.11424 6.99649 7.11292 6.99509C7.11226 6.99439 7.11171 6.9938 7.11126 6.99333C7.11103 6.99309 7.11084 6.99288 7.11066 6.9927C7.11058 6.99261 7.11047 6.9925 7.11043 6.99245C7.11033 6.99235 7.11023 6.99225 6.38441 7.68013ZM7.13545 10.4933C7.13545 10.9053 6.80054 11.2418 6.38441 11.2418V13.2418C7.90231 13.2418 9.13545 12.0127 9.13545 10.4933H7.13545ZM9.82757 4.41166H2.94136V6.41166H9.82757V4.41166ZM3.94136 5.41166V2.6492H1.94136V5.41166H3.94136ZM2.94136 3.6492H9.82757V1.6492H2.94136V3.6492ZM8.82757 2.6492V5.41166H10.8276V2.6492H8.82757Z","fill":"black","fill-opacity":"0.25","mask":"url(#path-1-outside-1)"}})]),_vm._v(" "),_c('span',[_vm._v(_vm._s(_vm.fuel)+" л.")])]),_vm._v(" "),_c('div',{staticClass:"health stat"},[_c('svg',{attrs:{"width":"19","height":"19","viewBox":"0 0 19 19","fill":"none","xmlns":"http://www.w3.org/2000/svg"}},[_c('mask',{attrs:{"id":"path-1-outside-1","maskUnits":"userSpaceOnUse","x":"0","y":"0","width":"19","height":"19","fill":"black"}},[_c('rect',{attrs:{"fill":"white","width":"19","height":"19"}}),_vm._v(" "),_c('path',{attrs:{"d":"M17.9466 8.55634C17.9198 8.3174 17.6411 8.13765 17.4001 8.13765C16.6212 8.13765 15.9299 7.68051 15.6401 6.97296C15.3441 6.24843 15.5351 5.40363 16.1154 4.87128C16.2981 4.70417 16.3204 4.42435 16.1672 4.23012C15.7684 3.72387 15.3154 3.2665 14.8206 2.87016C14.627 2.71489 14.3426 2.73651 14.1746 2.92243C13.668 3.48353 12.7579 3.69203 12.0546 3.39862C11.323 3.09079 10.8612 2.34921 10.9066 1.55322C10.9215 1.30303 10.7386 1.08564 10.4893 1.0566C9.85426 0.983078 9.21368 0.980946 8.57685 1.0516C8.33071 1.0788 8.14794 1.29105 8.1561 1.53807C8.18367 2.32627 7.71667 3.05477 6.99213 3.35157C6.29729 3.63542 5.39351 3.42847 4.88791 2.87229C4.7208 2.68909 4.44135 2.66659 4.24645 2.81855C3.73711 3.21828 3.27386 3.67593 2.87141 4.17807C2.71459 4.37326 2.73775 4.65616 2.92206 4.82386C3.51383 5.35974 3.70461 6.21182 3.39737 6.94481C3.10403 7.6436 2.37846 8.09376 1.5479 8.09376C1.27838 8.08508 1.08656 8.26616 1.05679 8.51127C0.982092 9.14964 0.981283 9.80043 1.05319 10.444C1.08002 10.684 1.36697 10.8622 1.61061 10.8622C2.35096 10.8434 3.06131 11.3014 3.35973 12.0268C3.65667 12.7513 3.46552 13.5958 2.88427 14.1289C2.70246 14.296 2.67923 14.5751 2.83274 14.7691C3.22747 15.2722 3.68094 15.7299 4.1772 16.1296C4.37202 16.2865 4.65537 16.2645 4.82425 16.0784C5.33286 15.5159 6.24281 15.3078 6.94324 15.6018C7.67697 15.9088 8.13853 16.6503 8.09346 17.4465C8.07868 17.6967 8.26204 17.9148 8.51046 17.9432C8.83542 17.9812 9.16207 18 9.48975 18C9.80074 18 10.1118 17.983 10.4229 17.9484C10.6693 17.9212 10.8518 17.7087 10.8435 17.4616C10.815 16.6738 11.283 15.9452 12.0067 15.649C12.7062 15.3633 13.6059 15.5724 14.1118 16.1278C14.2798 16.3106 14.5576 16.3328 14.7533 16.1814C15.2617 15.7827 15.7241 15.3253 16.1283 14.8218C16.2853 14.627 16.263 14.3438 16.0777 14.1758C15.486 13.6403 15.2942 12.7878 15.6015 12.0556C15.8902 11.3662 16.5888 10.9033 17.3402 10.9033L17.4453 10.9061C17.6893 10.9259 17.9134 10.738 17.9429 10.4892C18.018 9.8502 18.0188 9.20015 17.9466 8.55634ZM9.49997 14.4004C6.79348 14.4004 4.59957 12.2065 4.59957 9.5001C4.59957 6.79372 6.79355 4.59984 9.49997 4.59984C12.2064 4.59984 14.4004 6.79372 14.4004 9.5001C14.4004 10.4187 14.1471 11.2779 13.7072 12.0127L11.5615 9.86689C11.7168 9.50062 11.7989 9.10354 11.7988 8.69375C11.7988 7.89129 11.4863 7.13691 10.9188 6.56956C10.3514 6.00222 9.59701 5.68976 8.79469 5.68976C8.52693 5.68976 8.26042 5.72535 8.00259 5.79556C7.88966 5.82636 7.79732 5.91944 7.76725 6.03258C7.73652 6.1483 7.77115 6.26689 7.86158 6.35739C7.86158 6.35739 8.92092 7.42488 9.27536 7.77925C9.31249 7.81637 9.31242 7.90496 9.3072 7.93687L9.30389 7.96018C9.26816 8.34983 9.19927 8.81755 9.14244 8.99731C9.13479 9.00488 9.12759 9.01128 9.1198 9.01907C9.11164 9.02723 9.10414 9.0351 9.09627 9.04318C8.91416 9.10163 8.43922 9.17133 8.04339 9.20676L8.04346 9.20463L8.02567 9.20912C8.02251 9.20948 8.01663 9.20992 8.00884 9.20992C7.96605 9.20992 7.90311 9.19794 7.84592 9.14082C7.47699 8.7719 6.45918 7.76138 6.45918 7.76138C6.36787 7.67036 6.27421 7.65125 6.21179 7.65125C6.06629 7.65125 5.93601 7.75638 5.89499 7.90717C5.61481 8.94401 5.91183 10.0593 6.67033 10.8179C7.23783 11.3853 7.99229 11.6977 8.79476 11.6977C9.20457 11.6977 9.60165 11.6158 9.96785 11.4604L12.1369 13.6294C11.3754 14.1167 10.4711 14.4004 9.49997 14.4004Z"}})]),_vm._v(" "),_c('path',{attrs:{"d":"M17.9466 8.55634C17.9198 8.3174 17.6411 8.13765 17.4001 8.13765C16.6212 8.13765 15.9299 7.68051 15.6401 6.97296C15.3441 6.24843 15.5351 5.40363 16.1154 4.87128C16.2981 4.70417 16.3204 4.42435 16.1672 4.23012C15.7684 3.72387 15.3154 3.2665 14.8206 2.87016C14.627 2.71489 14.3426 2.73651 14.1746 2.92243C13.668 3.48353 12.7579 3.69203 12.0546 3.39862C11.323 3.09079 10.8612 2.34921 10.9066 1.55322C10.9215 1.30303 10.7386 1.08564 10.4893 1.0566C9.85426 0.983078 9.21368 0.980946 8.57685 1.0516C8.33071 1.0788 8.14794 1.29105 8.1561 1.53807C8.18367 2.32627 7.71667 3.05477 6.99213 3.35157C6.29729 3.63542 5.39351 3.42847 4.88791 2.87229C4.7208 2.68909 4.44135 2.66659 4.24645 2.81855C3.73711 3.21828 3.27386 3.67593 2.87141 4.17807C2.71459 4.37326 2.73775 4.65616 2.92206 4.82386C3.51383 5.35974 3.70461 6.21182 3.39737 6.94481C3.10403 7.6436 2.37846 8.09376 1.5479 8.09376C1.27838 8.08508 1.08656 8.26616 1.05679 8.51127C0.982092 9.14964 0.981283 9.80043 1.05319 10.444C1.08002 10.684 1.36697 10.8622 1.61061 10.8622C2.35096 10.8434 3.06131 11.3014 3.35973 12.0268C3.65667 12.7513 3.46552 13.5958 2.88427 14.1289C2.70246 14.296 2.67923 14.5751 2.83274 14.7691C3.22747 15.2722 3.68094 15.7299 4.1772 16.1296C4.37202 16.2865 4.65537 16.2645 4.82425 16.0784C5.33286 15.5159 6.24281 15.3078 6.94324 15.6018C7.67697 15.9088 8.13853 16.6503 8.09346 17.4465C8.07868 17.6967 8.26204 17.9148 8.51046 17.9432C8.83542 17.9812 9.16207 18 9.48975 18C9.80074 18 10.1118 17.983 10.4229 17.9484C10.6693 17.9212 10.8518 17.7087 10.8435 17.4616C10.815 16.6738 11.283 15.9452 12.0067 15.649C12.7062 15.3633 13.6059 15.5724 14.1118 16.1278C14.2798 16.3106 14.5576 16.3328 14.7533 16.1814C15.2617 15.7827 15.7241 15.3253 16.1283 14.8218C16.2853 14.627 16.263 14.3438 16.0777 14.1758C15.486 13.6403 15.2942 12.7878 15.6015 12.0556C15.8902 11.3662 16.5888 10.9033 17.3402 10.9033L17.4453 10.9061C17.6893 10.9259 17.9134 10.738 17.9429 10.4892C18.018 9.8502 18.0188 9.20015 17.9466 8.55634ZM9.49997 14.4004C6.79348 14.4004 4.59957 12.2065 4.59957 9.5001C4.59957 6.79372 6.79355 4.59984 9.49997 4.59984C12.2064 4.59984 14.4004 6.79372 14.4004 9.5001C14.4004 10.4187 14.1471 11.2779 13.7072 12.0127L11.5615 9.86689C11.7168 9.50062 11.7989 9.10354 11.7988 8.69375C11.7988 7.89129 11.4863 7.13691 10.9188 6.56956C10.3514 6.00222 9.59701 5.68976 8.79469 5.68976C8.52693 5.68976 8.26042 5.72535 8.00259 5.79556C7.88966 5.82636 7.79732 5.91944 7.76725 6.03258C7.73652 6.1483 7.77115 6.26689 7.86158 6.35739C7.86158 6.35739 8.92092 7.42488 9.27536 7.77925C9.31249 7.81637 9.31242 7.90496 9.3072 7.93687L9.30389 7.96018C9.26816 8.34983 9.19927 8.81755 9.14244 8.99731C9.13479 9.00488 9.12759 9.01128 9.1198 9.01907C9.11164 9.02723 9.10414 9.0351 9.09627 9.04318C8.91416 9.10163 8.43922 9.17133 8.04339 9.20676L8.04346 9.20463L8.02567 9.20912C8.02251 9.20948 8.01663 9.20992 8.00884 9.20992C7.96605 9.20992 7.90311 9.19794 7.84592 9.14082C7.47699 8.7719 6.45918 7.76138 6.45918 7.76138C6.36787 7.67036 6.27421 7.65125 6.21179 7.65125C6.06629 7.65125 5.93601 7.75638 5.89499 7.90717C5.61481 8.94401 5.91183 10.0593 6.67033 10.8179C7.23783 11.3853 7.99229 11.6977 8.79476 11.6977C9.20457 11.6977 9.60165 11.6158 9.96785 11.4604L12.1369 13.6294C11.3754 14.1167 10.4711 14.4004 9.49997 14.4004Z","fill":"white"}}),_vm._v(" "),_c('path',{attrs:{"d":"M17.9466 8.55634L18.9403 8.44491L18.9403 8.44474L17.9466 8.55634ZM15.6401 6.97296L14.7144 7.35105L14.7148 7.35206L15.6401 6.97296ZM16.1154 4.87128L15.4406 4.1333L15.4394 4.13443L16.1154 4.87128ZM16.1672 4.23012L15.3817 4.84887L15.3821 4.8494L16.1672 4.23012ZM14.8206 2.87016L14.1949 3.65018L14.1955 3.6506L14.8206 2.87016ZM14.1746 2.92243L13.4326 2.25206L13.4324 2.25231L14.1746 2.92243ZM12.0546 3.39862L11.6668 4.3203L11.6696 4.32147L12.0546 3.39862ZM10.9066 1.55322L9.90838 1.49367L9.90823 1.49633L10.9066 1.55322ZM10.4893 1.0566L10.6049 0.0633688L10.6043 0.0632889L10.4893 1.0566ZM8.57685 1.0516L8.68669 2.04549L8.68711 2.04544L8.57685 1.0516ZM8.1561 1.53807L7.1567 1.57109L7.15676 1.57303L8.1561 1.53807ZM6.99213 3.35157L7.37029 4.27724L7.37117 4.27688L6.99213 3.35157ZM4.88791 2.87229L5.62782 2.19967L5.62669 2.19843L4.88791 2.87229ZM4.24645 2.81855L3.6316 2.02997L3.62912 2.03192L4.24645 2.81855ZM2.87141 4.17807L3.65094 4.80434L3.65167 4.80343L2.87141 4.17807ZM2.92206 4.82386L2.24912 5.56348L2.25086 5.56505L2.92206 4.82386ZM3.39737 6.94481L4.31937 7.33185L4.31957 7.33136L3.39737 6.94481ZM1.5479 8.09376L1.51573 9.09319L1.53181 9.0937H1.5479V8.09376ZM1.05679 8.51127L0.0641327 8.39069L0.063621 8.39506L1.05679 8.51127ZM1.05319 10.444L0.0594253 10.555L0.0594369 10.5551L1.05319 10.444ZM1.61061 10.8622V11.8621H1.62332L1.63603 11.8618L1.61061 10.8622ZM3.35973 12.0268L4.28498 11.6476L4.28448 11.6464L3.35973 12.0268ZM2.88427 14.1289L2.2084 13.3919L2.20761 13.3926L2.88427 14.1289ZM2.83274 14.7691L3.61944 14.1519L3.61691 14.1487L2.83274 14.7691ZM4.1772 16.1296L3.54994 16.9083L3.55004 16.9084L4.1772 16.1296ZM4.82425 16.0784L5.56484 16.7502L5.5659 16.7491L4.82425 16.0784ZM6.94324 15.6018L6.55622 16.5238L6.55726 16.5243L6.94324 15.6018ZM8.09346 17.4465L9.09166 17.5055L9.0918 17.5031L8.09346 17.4465ZM8.51046 17.9432L8.62663 16.95L8.62395 16.9497L8.51046 17.9432ZM10.4229 17.9484L10.3132 16.9545L10.3122 16.9546L10.4229 17.9484ZM10.8435 17.4616L11.8429 17.428L11.8428 17.4255L10.8435 17.4616ZM12.0067 15.649L11.6286 14.7233L11.6279 14.7236L12.0067 15.649ZM14.1118 16.1278L13.3726 16.8011L13.3755 16.8043L14.1118 16.1278ZM14.7533 16.1814L15.3651 16.9724L15.3703 16.9683L14.7533 16.1814ZM16.1283 14.8218L15.3496 14.1945L15.3486 14.1958L16.1283 14.8218ZM16.0777 14.1758L16.7492 13.4349L16.7487 13.4344L16.0777 14.1758ZM15.6015 12.0556L16.5235 12.4424L16.5238 12.4419L15.6015 12.0556ZM17.3402 10.9033L17.3668 9.9037L17.3535 9.90335H17.3402V10.9033ZM17.4453 10.9061L17.5261 9.90941L17.4991 9.90721L17.4719 9.90649L17.4453 10.9061ZM17.9429 10.4892L18.9359 10.6068L18.936 10.6058L17.9429 10.4892ZM13.7072 12.0127L13.0001 12.7197L13.9067 13.6263L14.5652 12.5263L13.7072 12.0127ZM11.5615 9.86689L10.6409 9.47645L10.3776 10.0972L10.8544 10.5739L11.5615 9.86689ZM11.7988 8.69375H10.7988V8.69393L11.7988 8.69375ZM10.9188 6.56956L10.2117 7.27664L10.2118 7.27673L10.9188 6.56956ZM8.00259 5.79556L7.73986 4.83074L7.73943 4.83086L8.00259 5.79556ZM7.76725 6.03258L6.80085 5.77575L6.80081 5.77592L7.76725 6.03258ZM7.86158 6.35739L8.57135 5.65303L8.56892 5.6506L7.86158 6.35739ZM9.27536 7.77925L9.98243 7.07217L9.98235 7.0721L9.27536 7.77925ZM9.3072 7.93687L8.32037 7.77543L8.31867 7.78585L8.31719 7.7963L9.3072 7.93687ZM9.30389 7.96018L8.31388 7.8196L8.31039 7.84416L8.30812 7.86886L9.30389 7.96018ZM9.14244 8.99731L9.84608 9.70779L10.0215 9.53409L10.0959 9.29874L9.14244 8.99731ZM9.1198 9.01907L9.82686 9.72614L9.1198 9.01907ZM9.09627 9.04318L9.40185 9.99529L9.63921 9.91911L9.81304 9.74041L9.09627 9.04318ZM8.04339 9.20676L7.04404 9.17235L7.00508 10.3037L8.13255 10.2027L8.04339 9.20676ZM8.04346 9.20463L9.04281 9.23905L9.08858 7.90994L7.79903 8.23502L8.04346 9.20463ZM8.02567 9.20912L8.14116 10.2024L8.20641 10.1948L8.2701 10.1787L8.02567 9.20912ZM7.84592 9.14082L7.13885 9.84789L7.13931 9.84834L7.84592 9.14082ZM6.45918 7.76138L5.75326 8.46959L5.75466 8.47098L6.45918 7.76138ZM5.89499 7.90717L4.93012 7.64466L4.92967 7.64631L5.89499 7.90717ZM6.67033 10.8179L5.96324 11.5249L5.96332 11.525L6.67033 10.8179ZM9.96785 11.4604L10.6749 10.7533L10.1981 10.2765L9.57735 10.5399L9.96785 11.4604ZM12.1369 13.6294L12.6759 14.4717L13.7232 13.8016L12.844 12.9224L12.1369 13.6294ZM18.9403 8.44474C18.8863 7.96379 18.5948 7.63217 18.3407 7.44789C18.0837 7.26156 17.7514 7.13771 17.4001 7.13771V9.13759C17.2897 9.13759 17.2173 9.10362 17.1666 9.0669C17.1188 9.03223 16.9801 8.90995 16.9529 8.66794L18.9403 8.44474ZM17.4001 7.13771C17.0166 7.13771 16.6975 6.91631 16.5654 6.59386L14.7148 7.35206C15.1624 8.44471 16.2258 9.13759 17.4001 9.13759V7.13771ZM16.5658 6.59488C16.4293 6.26067 16.5169 5.85988 16.7913 5.60813L15.4394 4.13443C14.5532 4.94737 14.259 6.23619 14.7144 7.35105L16.5658 6.59488ZM16.7901 5.60925C17.3607 5.08751 17.4291 4.21532 16.9523 3.61083L15.3821 4.8494C15.2117 4.63339 15.2355 4.32082 15.4406 4.1333L16.7901 5.60925ZM16.9527 3.61137C16.5075 3.04614 16.0008 2.53436 15.4458 2.08973L14.1955 3.6506C14.63 3.99865 15.0294 4.40159 15.3817 4.84887L16.9527 3.61137ZM15.4463 2.09014C14.8408 1.60446 13.9565 1.67225 13.4326 2.25206L14.9165 3.59281C14.7286 3.80076 14.4133 3.82532 14.1949 3.65018L15.4463 2.09014ZM13.4324 2.25231C13.2081 2.50073 12.7491 2.60488 12.4396 2.47577L11.6696 4.32147C12.7667 4.77918 14.1278 4.46633 14.9168 3.59256L13.4324 2.25231ZM12.4424 2.47694C12.1026 2.33398 11.8835 1.98549 11.9049 1.61011L9.90823 1.49633C9.8389 2.71293 10.5433 3.8476 11.6668 4.3203L12.4424 2.47694ZM11.9047 1.61276C11.9514 0.830597 11.3785 0.153476 10.6049 0.063369L10.3736 2.04982C10.0986 2.0178 9.89157 1.77547 9.90838 1.49367L11.9047 1.61276ZM10.6043 0.0632889C9.89498 -0.0188309 9.17883 -0.021266 8.46659 0.0577518L8.68711 2.04544C9.24853 1.98316 9.81354 1.98499 10.3742 2.0499L10.6043 0.0632889ZM8.46701 0.057705C7.69905 0.142574 7.13137 0.804543 7.1567 1.57109L9.15549 1.50506C9.1645 1.77755 8.96236 2.01502 8.68669 2.04549L8.46701 0.057705ZM7.15676 1.57303C7.16987 1.94784 6.94563 2.29003 6.61309 2.42625L7.37117 4.27688C8.48771 3.81951 9.19746 2.7047 9.15543 1.50312L7.15676 1.57303ZM6.61397 2.42589C6.31056 2.54984 5.85275 2.4471 5.62782 2.19967L4.14801 3.54492C4.93427 4.40983 6.28403 4.72101 7.37029 4.27724L6.61397 2.42589ZM5.62669 2.19843C5.10521 1.62671 4.23564 1.55902 3.6316 2.02998L4.8613 3.60713C4.64707 3.77416 4.3364 3.75146 4.14913 3.54616L5.62669 2.19843ZM3.62912 2.03192C3.06015 2.47843 2.54209 2.99006 2.09114 3.5527L3.65167 4.80343C4.00562 4.3618 4.41406 3.95812 4.86378 3.60518L3.62912 2.03192ZM2.09188 3.55179C1.60246 4.16097 1.6759 5.04194 2.24913 5.56348L3.595 4.08423C3.7996 4.27038 3.82672 4.58554 3.65094 4.80434L2.09188 3.55179ZM2.25086 5.56505C2.52998 5.81782 2.61758 6.21849 2.47516 6.55825L4.31957 7.33136C4.79164 6.20515 4.49767 4.90166 3.59327 4.08266L2.25086 5.56505ZM2.47537 6.55776C2.35663 6.84062 2.02645 7.09382 1.5479 7.09382V9.0937C2.73047 9.0937 3.85142 8.44659 4.31937 7.33185L2.47537 6.55776ZM1.58007 7.09433C0.773471 7.06837 0.154004 7.65095 0.0641423 8.39069L2.04943 8.63186C2.03658 8.7377 1.98301 8.86162 1.87155 8.95932C1.75636 9.06028 1.62105 9.09657 1.51573 9.09319L1.58007 7.09433ZM0.063621 8.39506C-0.0200473 9.1101 -0.0207796 9.83714 0.0594253 10.555L2.04695 10.333C1.98335 9.76372 1.98423 9.18917 2.04996 8.62749L0.063621 8.39506ZM0.0594369 10.5551C0.114526 11.0478 0.419201 11.3801 0.673715 11.5598C0.932572 11.7427 1.26406 11.8621 1.61061 11.8621V9.86225C1.71353 9.86225 1.77971 9.8926 1.82748 9.92633C1.8709 9.957 2.01868 10.0802 2.04693 10.3329L0.0594369 10.5551ZM1.63603 11.8618C1.95281 11.8538 2.2908 12.0567 2.43498 12.4072L4.28448 11.6464C3.83182 10.546 2.74911 9.83298 1.5852 9.86257L1.63603 11.8618ZM2.43448 12.406C2.57094 12.739 2.48418 13.139 2.2084 13.3919L3.56015 14.8658C4.44687 14.0526 4.74241 12.7637 4.28498 11.6476L2.43448 12.406ZM2.20761 13.3926C1.64306 13.9115 1.56783 14.782 2.04856 15.3896L3.61691 14.1487C3.79062 14.3682 3.76186 14.6804 3.56094 14.8651L2.20761 13.3926ZM2.04604 15.3864C2.48828 15.95 2.99543 16.4617 3.54994 16.9083L4.80445 15.3509C4.36645 14.9981 3.96665 14.5944 3.61943 14.1519L2.04604 15.3864ZM3.55004 16.9084C4.15793 17.3979 5.04087 17.3278 5.56484 16.7502L4.08365 15.4065C4.26987 15.2012 4.58612 15.175 4.80436 15.3508L3.55004 16.9084ZM5.5659 16.7491C5.79331 16.4976 6.25207 16.3962 6.55622 16.5238L7.33025 14.6798C6.23356 14.2195 4.8724 14.5343 4.08259 15.4077L5.5659 16.7491ZM6.55726 16.5243C6.89753 16.6666 7.11638 17.0142 7.09511 17.39L9.0918 17.5031C9.16067 16.2865 8.4564 15.151 7.32922 14.6794L6.55726 16.5243ZM7.09525 17.3876C7.0492 18.1672 7.62036 18.8479 8.39697 18.9367L8.62395 16.9497C8.90372 16.9816 9.10816 17.2263 9.09166 17.5055L7.09525 17.3876ZM8.39429 18.9363C8.75828 18.9789 9.12372 18.9999 9.48975 18.9999V17.0001C9.20041 17.0001 8.91256 16.9834 8.62663 16.95L8.39429 18.9363ZM9.48975 18.9999C9.83722 18.9999 10.1852 18.981 10.5335 18.9422L10.3122 16.9546C10.0384 16.9851 9.76426 17.0001 9.48975 17.0001V18.9999ZM10.5326 18.9423C11.302 18.8574 11.8686 18.194 11.8428 17.428L9.84409 17.4952C9.83495 17.2234 10.0366 16.985 10.3132 16.9545L10.5326 18.9423ZM11.8428 17.4255C11.8293 17.0527 12.0534 16.7104 12.3855 16.5744L11.6279 14.7236C10.5127 15.1801 9.80074 16.2949 9.84418 17.4977L11.8428 17.4255ZM12.3848 16.5747C12.6914 16.4495 13.1461 16.5525 13.3726 16.8011L14.851 15.4544C14.0658 14.5923 12.721 14.2771 11.6286 14.7233L12.3848 16.5747ZM13.3755 16.8043C13.8977 17.3727 14.7618 17.439 15.365 16.9724L14.1415 15.3905C14.3533 15.2266 14.6618 15.2485 14.8481 15.4512L13.3755 16.8043ZM15.3703 16.9683C15.9391 16.5223 16.4561 16.0108 16.908 15.4479L15.3486 14.1958C14.9921 14.6398 14.5843 15.0432 14.1363 15.3946L15.3703 16.9683ZM16.907 15.4492C17.3965 14.8417 17.3268 13.9584 16.7492 13.4349L15.4061 14.9167C15.1992 14.7291 15.1741 14.4124 15.3496 14.1945L16.907 15.4492ZM16.7487 13.4344C16.4691 13.1813 16.3818 12.7803 16.5235 12.4424L14.6794 11.6687C14.2067 12.7953 14.503 14.0992 15.4066 14.9171L16.7487 13.4344ZM16.5238 12.4419C16.6557 12.1269 16.9889 11.9032 17.3402 11.9032V9.90335C16.1888 9.90335 15.1248 10.6054 14.6792 11.6692L16.5238 12.4419ZM17.3137 11.9029L17.4188 11.9057L17.4719 9.90649L17.3668 9.9037L17.3137 11.9029ZM17.3645 11.9028C18.1656 11.9677 18.8457 11.3686 18.9359 10.6068L16.9499 10.3715C16.9812 10.1074 17.213 9.88402 17.5261 9.90941L17.3645 11.9028ZM18.936 10.6058C19.0201 9.88992 19.0209 9.16332 18.9403 8.44491L16.9529 8.66778C17.0167 9.23698 17.0158 9.81049 16.9498 10.3725L18.936 10.6058ZM9.49997 13.4004C7.34571 13.4004 5.59951 11.6542 5.59951 9.5001H3.59963C3.59963 12.7588 6.24125 15.4003 9.49997 15.4003V13.4004ZM5.59951 9.5001C5.59951 7.34601 7.34577 5.59979 9.49997 5.59979V3.5999C6.24133 3.5999 3.59963 6.24144 3.59963 9.5001H5.59951ZM9.49997 5.59979C11.6542 5.59979 13.4004 7.34601 13.4004 9.5001H15.4003C15.4003 6.24144 12.7586 3.5999 9.49997 3.5999V5.59979ZM13.4004 9.5001C13.4004 10.2324 13.199 10.9148 12.8493 11.4991L14.5652 12.5263C15.0951 11.641 15.4003 10.605 15.4003 9.5001H13.4004ZM14.4143 11.3056L12.2685 9.15983L10.8544 10.5739L13.0001 12.7197L14.4143 11.3056ZM12.482 10.2573C12.6897 9.76772 12.7988 9.23782 12.7987 8.69357L10.7988 8.69393C10.7989 8.96927 10.7439 9.23352 10.6409 9.47645L12.482 10.2573ZM12.7987 8.69375C12.7987 7.62604 12.3808 6.61728 11.6257 5.8624L10.2118 7.27673C10.5917 7.65654 10.7988 8.15654 10.7988 8.69375H12.7987ZM11.6258 5.86249C10.8709 5.10762 9.8622 4.68982 8.79469 4.68982V6.68971C9.33183 6.68971 9.83187 6.89682 10.2117 7.27664L11.6258 5.86249ZM8.79469 4.68982C8.43841 4.68982 8.08354 4.73716 7.73986 4.83074L8.26531 6.76037C8.4373 6.71353 8.61545 6.68971 8.79469 6.68971V4.68982ZM7.73943 4.83086C7.2821 4.95561 6.92229 5.3188 6.80085 5.77575L8.73365 6.28941C8.67235 6.52007 8.49722 6.69711 8.26574 6.76025L7.73943 4.83086ZM6.80081 5.77592C6.67074 6.26569 6.83443 6.74412 7.15423 7.06417L8.56892 5.6506C8.70786 5.78965 8.8023 6.03091 8.73369 6.28924L6.80081 5.77592ZM7.86158 6.35739C7.15181 7.06174 7.15181 7.06175 7.15182 7.06175C7.15183 7.06176 7.15184 7.06178 7.15186 7.06179C7.15189 7.06183 7.15194 7.06187 7.152 7.06194C7.15213 7.06207 7.15233 7.06227 7.15258 7.06252C7.1531 7.06304 7.15386 7.06381 7.15487 7.06483C7.15689 7.06687 7.15989 7.06989 7.16382 7.07385C7.17168 7.08176 7.18324 7.09341 7.19808 7.10837C7.22776 7.13827 7.27056 7.18138 7.32301 7.23422C7.42792 7.33989 7.5715 7.48449 7.72618 7.64018C8.03499 7.95102 8.38972 8.30777 8.56838 8.48639L9.98235 7.0721C9.80657 6.89635 9.4544 6.54218 9.14493 6.23068C8.99046 6.0752 8.84706 5.93078 8.74226 5.82522C8.68987 5.77244 8.64713 5.72939 8.61749 5.69953C8.60267 5.6846 8.59113 5.67297 8.5833 5.66508C8.57938 5.66113 8.57639 5.65812 8.57438 5.65609C8.57338 5.65508 8.57262 5.65431 8.57211 5.6538C8.57185 5.65355 8.57166 5.65335 8.57154 5.65323C8.57147 5.65316 8.57142 5.65311 8.57139 5.65308C8.57138 5.65307 8.57136 5.65305 8.57136 5.65305C8.57135 5.65304 8.57135 5.65304 7.86158 6.35739ZM8.5683 8.48632C8.44147 8.35948 8.38335 8.22878 8.3577 8.15871C8.33032 8.08388 8.31993 8.02281 8.31544 7.98795C8.30786 7.92921 8.30628 7.86161 8.32037 7.77543L10.294 8.09831C10.3133 7.98023 10.3144 7.85237 10.2989 7.73208C10.2887 7.65295 10.2463 7.33601 9.98243 7.07217L8.5683 8.48632ZM8.31719 7.7963L8.31388 7.8196L10.2939 8.10075L10.2972 8.07744L8.31719 7.7963ZM8.30812 7.86886C8.29206 8.04406 8.26832 8.2384 8.24265 8.40616C8.22982 8.48993 8.21729 8.56198 8.20601 8.61855C8.19344 8.68152 8.18683 8.70277 8.18901 8.69587L10.0959 9.29874C10.1891 9.00373 10.2644 8.43618 10.2997 8.05149L8.30812 7.86886ZM8.4388 8.28683C8.44262 8.28305 8.44546 8.28033 8.44654 8.27929C8.44718 8.27869 8.44774 8.27816 8.445 8.28074C8.4415 8.28405 8.4281 8.29664 8.41273 8.312L9.82686 9.72614C9.82271 9.73029 9.81948 9.73341 9.81778 9.73504C9.81635 9.73641 9.81552 9.73719 9.81734 9.73547C9.81834 9.73453 9.82262 9.7305 9.827 9.72632C9.83183 9.72171 9.83844 9.71535 9.84608 9.70779L8.4388 8.28683ZM8.41273 8.312C8.4035 8.32124 8.39561 8.32933 8.39023 8.33488C8.38155 8.34383 8.38429 8.34103 8.3795 8.34595L9.81304 9.74041C9.81605 9.73732 9.81882 9.73446 9.82083 9.73238C9.8231 9.73003 9.82433 9.72875 9.82562 9.72743C9.82799 9.72498 9.82793 9.72506 9.82686 9.72614L8.41273 8.312ZM8.79069 8.09108C8.79854 8.08856 8.77768 8.09522 8.71396 8.108C8.65685 8.11945 8.58394 8.13215 8.49905 8.14512C8.32902 8.17108 8.13193 8.19489 7.95423 8.2108L8.13255 10.2027C8.52318 10.1678 9.1011 10.0918 9.40185 9.99529L8.79069 8.09108ZM9.04274 9.24118L9.04281 9.23905L7.04411 9.17022L7.04404 9.17235L9.04274 9.24118ZM7.79903 8.23502L7.78124 8.23951L8.2701 10.1787L8.28789 10.1742L7.79903 8.23502ZM7.91018 8.21586C7.93167 8.21337 7.94985 8.21201 7.96406 8.21123C7.97915 8.21039 7.99405 8.20998 8.00884 8.20998V10.2099C8.05123 10.2099 8.09589 10.2076 8.14116 10.2024L7.91018 8.21586ZM8.00884 8.20998C8.15831 8.20998 8.37639 8.25739 8.55252 8.43329L7.13931 9.84834C7.42984 10.1385 7.77378 10.2099 8.00884 10.2099V8.20998ZM8.55298 8.43375C8.36724 8.24801 8.01944 7.90204 7.71911 7.60354C7.56873 7.45406 7.42988 7.31613 7.32864 7.21558C7.27802 7.1653 7.2368 7.12436 7.20822 7.09598C7.19393 7.08179 7.18281 7.07075 7.17525 7.06325C7.17147 7.05949 7.16859 7.05663 7.16665 7.0547C7.16568 7.05374 7.16494 7.05301 7.16445 7.05252C7.1642 7.05227 7.16402 7.05209 7.16389 7.05196C7.16383 7.0519 7.16378 7.05186 7.16375 7.05182C7.16373 7.05181 7.16372 7.0518 7.16371 7.05179C7.16371 7.05178 7.1637 7.05178 6.45918 7.76138C5.75466 8.47098 5.75467 8.47099 5.75467 8.471C5.75468 8.471 5.75469 8.47101 5.75471 8.47103C5.75474 8.47106 5.75478 8.4711 5.75484 8.47117C5.75497 8.47129 5.75515 8.47147 5.75539 8.47171C5.75588 8.4722 5.75661 8.47292 5.75758 8.47388C5.75951 8.4758 5.76238 8.47865 5.76615 8.48239C5.77369 8.48987 5.78479 8.5009 5.79905 8.51506C5.82758 8.54339 5.86875 8.58428 5.91931 8.6345C6.02044 8.73494 6.15911 8.8727 6.30929 9.02197C6.6101 9.32096 6.95566 9.6647 7.13885 9.84789L8.55298 8.43375ZM7.1651 7.05317C6.85715 6.74622 6.49454 6.65131 6.21179 6.65131V8.65119C6.14077 8.65119 6.05726 8.64019 5.9703 8.60724C5.88061 8.57325 5.80715 8.52331 5.75326 8.46959L7.1651 7.05317ZM6.21179 6.65131C5.57101 6.65131 5.07758 7.10264 4.93012 7.64466L6.85986 8.16968C6.79444 8.41012 6.56158 8.65119 6.21179 8.65119V6.65131ZM4.92967 7.64631C4.55626 9.02815 4.95117 10.5127 5.96324 11.5249L7.37743 10.1108C6.87248 9.60583 6.67335 8.85986 6.86031 8.16803L4.92967 7.64631ZM5.96332 11.525C6.71835 12.2799 7.72713 12.6977 8.79476 12.6977V10.6978C8.25746 10.6978 7.75732 10.4907 7.37735 10.1107L5.96332 11.525ZM8.79476 12.6977C9.33876 12.6977 9.86864 12.5887 10.3583 12.381L9.57735 10.5399C9.33465 10.6428 9.07037 10.6978 8.79476 10.6978V12.6977ZM9.26079 12.1675L11.4298 14.3365L12.844 12.9224L10.6749 10.7533L9.26079 12.1675ZM11.598 12.7872C10.9917 13.1751 10.2734 13.4004 9.49997 13.4004V15.4003C10.6688 15.4003 11.7591 15.0583 12.6759 14.4717L11.598 12.7872Z","fill":"black","fill-opacity":"0.25","mask":"url(#path-1-outside-1)"}})]),_vm._v(" "),_c('span',[_vm._v(_vm._s(_vm.speedHealth)+"%")])])])]):_vm._e(),_vm._v(" "),(_vm.showTips)?_c('div',{staticClass:"tips"},[_vm._m(0),_vm._v(" "),_vm._m(1),_vm._v(" "),_vm._m(2),_vm._v(" "),_vm._m(3),_vm._v(" "),_vm._m(4),_vm._v(" "),_vm._m(5),_vm._v(" "),_vm._m(6),_vm._v(" "),_vm._m(7),_vm._v(" "),(_vm.vehicleTips)?_c('div',{staticClass:"vehicle"},[_vm._m(8),_vm._v(" "),_vm._m(9)]):_vm._e()]):_vm._e(),_vm._v(" "),(_vm.keyTipShow)?_c('div',{staticClass:"keytip"},[_vm._v("Для взаимодействия нажмите "),_c('div',{staticClass:"key"},[_vm._v(_vm._s(_vm.keyName.toUpperCase()))])]):_vm._e(),_vm._v(" "),(_vm.education)?_c('div',{staticClass:"education"},[_c('div',{staticClass:"education-title"},[_c('span',[_vm._v(_vm._s(_vm.educationTitle))]),_vm._v(" "),_c('svg',{staticClass:"education-svg",attrs:{"width":"24","height":"24","viewBox":"0 0 24 24","fill":"none","xmlns":"http://www.w3.org/2000/svg"}},[_c('path',{attrs:{"fill-rule":"evenodd","clip-rule":"evenodd","d":"M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z","fill":"#F2C94C"}}),_vm._v(" "),_c('path',{attrs:{"d":"M19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z","stroke":"black","stroke-opacity":"0.25","stroke-width":"2"}}),_vm._v(" "),_c('mask',{attrs:{"id":"path-3-outside-1","maskUnits":"userSpaceOnUse","x":"4.33337","y":"4.33337","width":"15","height":"14","fill":"black"}},[_c('rect',{attrs:{"fill":"white","x":"4.33337","y":"4.33337","width":"15","height":"14"}}),_vm._v(" "),_c('path',{attrs:{"fill-rule":"evenodd","clip-rule":"evenodd","d":"M12 14.6936L9.11588 16.2099L9.66671 12.9983L7.33337 10.7239L10.558 10.2553L12 7.33337L13.4421 10.2553L16.6667 10.7239L14.3334 12.9983L14.8842 16.2099L12 14.6936Z"}})]),_vm._v(" "),_c('path',{attrs:{"fill-rule":"evenodd","clip-rule":"evenodd","d":"M12 14.6936L9.11588 16.2099L9.66671 12.9983L7.33337 10.7239L10.558 10.2553L12 7.33337L13.4421 10.2553L16.6667 10.7239L14.3334 12.9983L14.8842 16.2099L12 14.6936Z","fill":"#F2C94C"}}),_vm._v(" "),_c('path',{attrs:{"d":"M12 14.6936L12.4654 13.8085L12 13.5638L11.5347 13.8085L12 14.6936ZM9.11588 16.2099L8.13027 16.0409L7.78775 18.0379L9.58122 17.095L9.11588 16.2099ZM9.66671 12.9983L10.6523 13.1674L10.7412 12.6492L10.3647 12.2823L9.66671 12.9983ZM7.33337 10.7239L7.18958 9.7343L5.18441 10.0257L6.63536 11.44L7.33337 10.7239ZM10.558 10.2553L10.7018 11.245L11.222 11.1694L11.4547 10.6979L10.558 10.2553ZM12 7.33337L12.8968 6.89081L12 5.07382L11.1033 6.89081L12 7.33337ZM13.4421 10.2553L12.5454 10.6979L12.7781 11.1694L13.2983 11.245L13.4421 10.2553ZM16.6667 10.7239L17.3647 11.44L18.8157 10.0257L16.8105 9.7343L16.6667 10.7239ZM14.3334 12.9983L13.6354 12.2823L13.2589 12.6492L13.3478 13.1674L14.3334 12.9983ZM14.8842 16.2099L14.4189 17.095L16.2123 18.0379L15.8698 16.0409L14.8842 16.2099ZM11.5347 13.8085L8.65054 15.3248L9.58122 17.095L12.4654 15.5787L11.5347 13.8085ZM10.1015 16.3789L10.6523 13.1674L8.6811 12.8293L8.13027 16.0409L10.1015 16.3789ZM10.3647 12.2823L8.03139 10.0078L6.63536 11.44L8.9687 13.7144L10.3647 12.2823ZM7.47717 11.7135L10.7018 11.245L10.4142 9.26574L7.18958 9.7343L7.47717 11.7135ZM11.4547 10.6979L12.8968 7.77594L11.1033 6.89081L9.66123 9.81278L11.4547 10.6979ZM11.1033 7.77594L12.5454 10.6979L14.3389 9.81278L12.8968 6.89081L11.1033 7.77594ZM13.2983 11.245L16.5229 11.7135L16.8105 9.7343L13.5859 9.26574L13.2983 11.245ZM15.9687 10.0078L13.6354 12.2823L15.0314 13.7144L17.3647 11.44L15.9687 10.0078ZM13.3478 13.1674L13.8986 16.3789L15.8698 16.0409L15.319 12.8293L13.3478 13.1674ZM15.3495 15.3248L12.4654 13.8085L11.5347 15.5787L14.4189 17.095L15.3495 15.3248Z","fill":"black","fill-opacity":"0.25","mask":"url(#path-3-outside-1)"}})])]),_vm._v(" "),_c('div',{staticClass:"education-tasks"},_vm._l((_vm.educationTasks),function(task){return _c('span',{key:task.name,class:[task.completed ? 'strike' : '']},[_vm._v(_vm._s(task.description))])}),0)]):_vm._e()]):_vm._e()}
__vue__options__.staticRenderFns = [function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tip"},[_c('span',[_vm._v("Меню персонажа")]),_vm._v(" "),_c('div',{staticClass:"key"},[_vm._v("M")])])},function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tip"},[_c('span',[_vm._v("Инвентарь")]),_vm._v(" "),_c('div',{staticClass:"key"},[_vm._v("I")])])},function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tip"},[_c('span',[_vm._v("Меню аккаунта")]),_vm._v(" "),_c('div',{staticClass:"key"},[_vm._v("F2")])])},function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tip"},[_c('span',[_vm._v("Голосовой чат")]),_vm._v(" "),_c('div',{staticClass:"key"},[_vm._v("N")])])},function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tip"},[_c('span',[_vm._v("Телефон")]),_vm._v(" "),_c('div',{staticClass:"key"},[_vm._v("ALT")])])},function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tip"},[_c('span',[_vm._v("Скрыть подсказки")]),_vm._v(" "),_c('div',{staticClass:"key"},[_vm._v("F3")])])},function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tip"},[_c('span',[_vm._v("Рефералы")]),_vm._v(" "),_c('div',{staticClass:"key"},[_vm._v("F4")])])},function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tip"},[_c('span',[_vm._v("Скрыть ники")]),_vm._v(" "),_c('div',{staticClass:"key"},[_vm._v("F6")])])},function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tip"},[_c('span',[_vm._v("Заглушить машину")]),_vm._v(" "),_c('div',{staticClass:"key"},[_vm._v("B")])])},function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tip"},[_c('span',[_vm._v("Закрыть машину")]),_vm._v(" "),_c('div',{staticClass:"key"},[_vm._v("L")])])}]
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-72c4f414", __vue__options__)
  } else {
    hotAPI.reload("data-v-72c4f414", __vue__options__)
  }
})()}
},{"vue":4,"vue-hot-reload-api":3}]},{},[6]);
