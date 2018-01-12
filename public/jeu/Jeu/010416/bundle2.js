(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],3:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],4:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":3,"_process":1,"inherits":2}],5:[function(require,module,exports){
(function (process){
'use strict';

function invokeCB(o, name) {
	if ( !(name in o ) ) return;
	var args = Array.prototype.slice.call(arguments, 2);
	o[name].apply(o, args);
}

function detectStrict(body) {
	if ( !body || body.length < 1 ) return;
	let first = body[0];
	if ( first.type === 'ExpressionStatement' ) {
		let exp = first.expression;
		if ( exp.type === 'Literal' && exp.value === 'use strict' ) {
			return true;
		}
	}
}


class ASTNode {
	constructor(o) {
		if ( typeof o === 'object' ) {
			for ( var k in o ) this[k] = o[k];
		}
	}

	addHiddenProperty(name, value) {
		Object.defineProperty(this, name, {
			value: value,
			configurable: true
		});
	}

	source() {
		if ( !this._source ) return;
		if ( !this.range ) return;
		return this._source.substring(this.range[0], this.range[1]);
	}

	toString() {
		let extra = Object.keys(this).map((k) => {
			let v = this[k];
			if ( v === null || typeof v === 'function' ) return;
			if ( k == 'range' || k == 'loc' || k == 'nodeID') return;
			if ( v instanceof ASTNode ) return `${k}: [ASTNode: ${v.type}]`;
			if ( Array.isArray(v) ) return '[...]';
			else return `${k}: ${JSON.stringify(v)}`;
		}).filter((v) => !!v).join(', ');
		return `[ASTNode: ${this.type} ${extra}]`;
	}

}

class ASTPreprocessor {

	static process(ast, extra) {
		if ( typeof ast !== 'object' ) throw new TypeError('Provided AST is invalid (type is ' + typeof ast + ')');
		let nast = JSON.parse(JSON.stringify(ast), function(n, o) {
			if ( o === null ) return null;
			if ( typeof o !== 'object' ) return o;
			if ( o.type ) {
				let z = new ASTNode(o);
				if ( extra && extra.source ) z.addHiddenProperty('_source', extra.source);
				return z;
			}
			return o;
		});
		new ASTPreprocessor(nast, extra).start();
		return nast;
	}

	static *walker(ast, cbs, parent) {
		var me = (a) => ASTPreprocessor.walker(a, cbs, ast);
		invokeCB(cbs, 'enter', ast);
		invokeCB(cbs, 'enter' + ast.type, ast);
		if ( parent && ast instanceof ASTNode ) ast.addHiddenProperty('parent', parent);
		switch ( ast.type ) {
			case 'Program':
				for ( let e of ast.body ) yield * me(e);
				break;
			case 'BlockStatement':
				for ( let e of ast.body ) yield * me(e);
				break;
			case 'NewExpression':
			case 'CallExpression':
				for ( let e of ast.arguments ) yield * me(e);
				yield * me(ast.callee);
				break;
			case 'WhileStatement':
			case 'DoWhileStatement':
				if ( ast.test ) yield * me(ast.test);
				yield * me(ast.body);
				break;
			case 'VariableDeclaration':
				for ( let e of ast.declarations ) yield * me(e);
				break;
			case 'VariableDeclarator':
				invokeCB(cbs, 'decl', ast);
				if ( ast.init ) yield * me(ast.init);
				break;
			case 'FunctionDeclaration':
				invokeCB(cbs, 'decl', ast);
				invokeCB(cbs, 'enterFunction', ast);
				yield * me(ast.body);
				invokeCB(cbs, 'exitFunction', ast);
				break;

			case 'ArrowFunctionExpression':
			case 'FunctionExpression':
				invokeCB(cbs, 'enterFunction', ast);
				yield * me(ast.body);
				invokeCB(cbs, 'exitFunction', ast);
				break;
			case 'Identifier':
				break;
			case 'ArrayExpression':
				if ( ast.elements ) {
					for ( let e of ast.elements ) {
						if ( e ) yield * me(e);
					}
				}
				break;
			case 'ObjectExpression':
				if ( ast.properties ) {
					for ( let e of ast.properties ) {
						if ( e ) yield * me(e);
					}
				}
				break;
			case 'Property':
				yield * me(ast.key);
				yield * me(ast.value);
				break;
			default:
				for (var p in ast) {
					let n = ast[p];
					if ( p === 'parent' ) continue;
					if ( p === 'loc' ) continue;
					if ( p === 'type' ) continue;
					if ( p === 'nodeID' ) continue;
					if ( p === 'parentFunction' ) continue;
					if ( p === 'funcs' ) continue;
					if ( n === null ) continue;
					if ( typeof n.type !== 'string' ) {
						continue;
					}
					yield * me(n);
				}
		}


		invokeCB(cbs, 'exit' + ast.type, ast);
		invokeCB(cbs, 'exit', ast);
	}


	constructor(ast, options) {
		this.options = options || {};
		this.ast = ast;
		this.gen = ASTPreprocessor.walker(ast, this);
	}

	start() {
		this.counter = 0;
		this.depth = 0;

		let globalScope = Object.create(null);
		let globalVars = Object.create(null);
		let globalFuncs = Object.create(null);

		this.scopeStack = [globalScope];
		this.varStack = [globalVars];
		this.funcStack = [globalFuncs];
		for ( var x of this.gen ) {

		}
	}

	log() {
		let str = Array.prototype.join.call(arguments, ', ');
		let indent = new Array(this.depth).join('  ');
		//console.log(indent + str);
	}

	enter(a) {
		++this.depth;
		a.nodeID = this.counter++;
		this.log('Entering', a.type);
	}

	enterIdentifier(a) {
		let fn = this.funcStack[0];
		fn.refs[a.name] = true;
	}

	decl(a) {
		if ( a.parent.type == 'VariableDeclaration' && a.parent.kind != 'var' ) return;
		let stack = this.varStack[0];
		stack[a.id.name] = a;
	}

	enterProgram(a) {
		let scope = Object.create(null);

		a.addHiddenProperty('refs', Object.create(null));
		a.addHiddenProperty('vars', Object.create(null));
		a.addHiddenProperty('funcs', Object.create(null));

		this.funcStack.unshift(a);
		this.scopeStack.unshift(scope);
		this.varStack.unshift(a.vars);

		this.mangleBody(a);

		let strict = detectStrict(a.body);
		if ( strict !== undefined ) a.strict = strict;
	}

	enterThisExpression(a) {
		a.srcName = 'this';
	}

	enterLabeledStatement(a) {
		a.body.label = a.label.name;
	}

	exitArrayExpression(a) {
		a.srcName = '[' + a.elements.map((e) => e ? e.srcName : '').join() + ']';
	}

	mangleBody(a) {
		function prehoist(s) {
			if ( s.type === 'VariableDeclaration' && s.kind == 'var' ) {
				for ( var decl of s.declarations ) {
					a.vars[decl.id.name] = decl;
				}

			} else if ( s.type === 'FunctionDeclaration' ) {
				a.vars[s.id.name] = s;
			}
		}

		if ( a.body.type === 'BlockStatement' ) {
			for ( let stmt of a.body.body ) prehoist(stmt);
		} else if ( Array.isArray(a.body) ) {
			for ( let stmt of a.body ) prehoist(stmt);
		} else {
			prehoist(a.body);
		}

	}

	enterFunction(a) {
		this.funcStack.unshift(a);
		let scope = Object.create(this.scopeStack[0]);
		this.scopeStack.unshift(scope);

		a.addHiddenProperty('refs', Object.create(null));
		a.addHiddenProperty('vars', Object.create(null));
		a.addHiddenProperty('funcs', Object.create(null));

		if ( this.options.nonUserCode ) {
			a.addHiddenProperty('nonUserCode', true);
		}

		for ( let o of a.params ) {
			a.vars[o.name] = a;
		}

		this.mangleBody(a);

		let strict = detectStrict(a.body.body);
		if ( strict !== undefined ) a.strict = strict;

		this.varStack.unshift(a.vars);
	}

	enterFunctionDeclaration(a) {
		let parent = this.funcStack[0];
		//a.parentFunction = parent.nodeID;
		a.srcName = 'function ' + a.id.name + ' {';
		parent.funcs[a.id.name] = a;
	}

	exitIdentifier(a) {
		a.srcName = a.name;
	}

	exitLiteral(a) {
		if ( a.regex ) {
			a.srcName = '/' + a.regex.pattern + '/' + a.regex.flags;
		} else if ( typeof a.value === 'string' ) {
			a.srcName = a.raw;
		} else if ( typeof a.value === 'undefined' ) {
			a.srcName = 'undefiend';
		} else {
			a.srcName = a.raw;
		}
	}


	exitBinaryExpression(a) {
		a.srcName = a.left.srcName + ' ' + a.operator + ' ' + a.right.srcName;
	}

	exitMemberExpression(a) {
		let left = a.object.srcName || '??';
		let right = a.property.srcName || '(intermediate value)';
		if (!a.computed) a.srcName = left + '.' + right;
		else a.srcName = a.srcName = left + '[' + right + ']';
	}

	exitCallExpression(a) {
		a.srcName = a.callee.srcName + '(...)';
	}


	exitFunction(a) {
		var vars = this.varStack.shift();
		var free = {};
		var upvars = {};
		for ( var r in a.refs ) {
			if ( r in vars ) {
				//Local refrence
			} else if ( r in this.varStack[0] ) {
				upvars[r] = true;
			} else {
				free[r] = true;
			}
		}
		a.upvars = upvars;
		a.freevars = free;

		this.scopeStack.shift();
		this.funcStack.shift();
		delete a.refs;
		//this.log("VARS:", Object.getOwnPropertyNames(a.vars).join(', '));
	}

	exitProgram(a) {
		this.scopeStack.shift();
		var vars = this.varStack.shift();
		//this.log("VARS:", Object.getOwnPropertyNames(a.vars).join(', '));
	}

	exit(a) {
		this.log('Exiting', a.type);
		--this.depth;
	}

}

module.exports = ASTPreprocessor;

}).call(this,require('_process'))
},{"_process":1}],6:[function(require,module,exports){
'use strict';

let Value = require('./Value');

class CompletionRecord {
	constructor(type, value, target) {
		if ( value === undefined ) {
			value = type;
			type = CompletionRecord.NORMAL;
		}

		this.type = type;
		this.value = value;
		this.target = target;
	}

	get abrupt() { return this.type !== CompletionRecord.NORMAL; }

	static makeTypeError(realm, msg) {
		let err;
		if ( msg instanceof Error ) err = realm.TypeError.makeFrom(msg);
		else err = realm.TypeError.make(msg);
		return new CompletionRecord(CompletionRecord.THROW, err);
	}

	static makeReferenceError(realm, msg) {
		let err;
		if ( msg instanceof Error ) err = realm.ReferenceError.makeFrom(msg);
		else err = realm.ReferenceError.make(msg);
		return new CompletionRecord(CompletionRecord.THROW, err);
	}

	static makeSyntaxError(realm, msg) {
		let err;
		if ( msg instanceof Error ) err = realm.SyntaxError.makeFrom(msg);
		else err = realm.SyntaxError.make(msg);
		return new CompletionRecord(CompletionRecord.THROW, err);
	}

	static makeRangeError(realm, msg) {
		let err;
		if ( msg instanceof Error ) err = realm.RangeError.makeFrom(msg);
		else err = realm.RangeError.make(msg);
		return new CompletionRecord(CompletionRecord.THROW, err);
	}

	/**
	 * Easy access to value.addExtra.
	 * Note: Returns a generator.
	 * @param {Object} obj - Extra properties
	 */
	addExtra(obj) {
		return this.value.addExtra(obj);
	}

}
module.exports = CompletionRecord;



CompletionRecord.NORMAL = 0;
CompletionRecord.BREAK = 1;
CompletionRecord.CONTINUE = 2;
CompletionRecord.RETURN = 3;
CompletionRecord.THROW = 4;



},{"./Value":14}],7:[function(require,module,exports){
'use strict';

const Evaluator = require('./Evaluator');
const Realm = require('./Realm');
const Scope = require('./Scope');
const Value = require('./Value');
const BridgeValue = require('./values/BridgeValue');
const ASTPreprocessor = require('./ASTPreprocessor');
const FutureValue = require('./values/FutureValue');
const EasyNativeFunction = require('./values/EasyNativeFunction');
const ClosureValue = require('./values/ClosureValue');

let defaultOptions = {
	strict: false,
	foreignObjectMode: 'link',
	addInternalStack: false,
	executionLimit: Infinity,
	exposeEsperGlobal: true,
	extraErrorInfo: false,
	addExtraErrorInfoToStacks: false,
	bookmarkInvocationMode: 'error',
	yieldPower: 5,
	debug: false
};

/**
 * Container class for all of esper.
 */
class Engine {

	constructor(options) {
		options = options || {};
		this.options = {};
		for ( var k in defaultOptions ) {
			if ( k in options ) this.options[k] = options[k];
			else this.options[k] = defaultOptions[k];
		}
		this.realm = new Realm(this.options);
		this.evaluator = new Evaluator(this.realm, null, this.globalScope);
		if ( this.options.debug ) {
			this.evaluator.debug = true;
		}

		this.evaluator.defaultYieldPower = this.options.yieldPower;
		this.evaluator.yieldPower = this.options.yieldPower;
	}

	/**
	 * Evalute `code` and return a promise for the result.
	 *
	 * @access public
	 * @param {string} code - String of code to evaulate
	 * @return {Promise<Value>} - The result of execution, as a promise.
	 */
	eval(code) {
		let ast = this.realm.parser(code);
		return this.evalAST(ast, {source: code});
	}

	/**
	 * Evalute `code` and return a the result.
	 *
	 * @access public
	 * @param {string} code - String of code to evaulate
	 * @return {Value} - The result of execution
	 */
	evalSync(code) {
		let ast = this.realm.parser(code);
		return this.evalASTSync(ast, {source: code});
	}

	/**
	 * Evalute `ast` and return a promise for the result.
	 *
	 * @access public
	 * @param {Node} ast - ESTree AST representing the code to run.
	 * @param {string} codeRef - The code that was used to generate the AST.
	 * @return {Value} - The result of execution, as a promise.
	 */
	evalAST(ast, opts) {
		//console.log(escodegen.generate(ast));
		this.loadAST(ast, opts);
		let p = this.run();
		p.then(() => delete this.generator);
		return p;
	}

	evalASTSync(ast, opts) {
		this.loadAST(ast, opts);
		let value = this.runSync();
		delete this.generator;
		return value;
	}

	loadAST(ast, opts) {
		let past = ASTPreprocessor.process(ast, opts);
		this.evaluator.frames = [];
		this.evaluator.pushAST(past, this.globalScope);
		this.evaluator.ast = past;
		this.generator = this.evaluator.generator();
	}

	load(code) {
		let ast = this.realm.parser(code);
		this.loadAST(ast, code);
	}

	step() {
		if ( !this.generator ) throw new Error('No code loaded to step');
		let value = this.generator.next();
		return value.done;
	}

	run() {
		let that = this;
		let steps = 0;
		function handler(value) {
			while ( !value.done ) {
				value = that.generator.next();
				if ( value.value && value.value.then ) {
					return value.value.then((v) => {
						return {done: false, value: v};
					});
				}
				if ( ++steps > that.options.executionLimit ) throw new Error('Execution Limit Reached');
			}
			return value;
		}
		return new Promise(function(resolve, reject) {
			try {
				let  value = that.generator.next();
				resolve(value);
			} catch ( e ) {
				reject(e);
			}
		}).then(handler).then((v) => v.value);
	}

	runSync() {
		let steps = 0;
		let value = this.generator.next();
		while ( !value.done ) {
			value = this.generator.next();
			if ( value.value && value.value.then ) throw new Error('Can\'t deal with futures when running in sync mode');
			if ( ++steps > this.options.executionLimit ) throw new Error('Execution Limit Reached');
		}
		return value.value;
	}



	/**
	 * Refrence to the global scope.
	 * @return {Scope}
	 */
	get globalScope() {
		return this.realm.globalScope;
	}

	compte() {
		console.log("comptecompte");
		return 1;
	}


	addGlobal(name, what, opts) {
		opts = opts || {};
		if ( !(what instanceof Value) ) what = this.realm.makeForForeignObject(what);
		if ( !opts.const ) this.globalScope.add(name, what);
		else this.globalScope.addConst(name, what);
	}

	addGlobalFx(name, what, opts) {
		var x  = EasyNativeFunction.makeForNative(this.realm, what);
		this.addGlobal(name, x, opts);
	}

	addGlobalValue(name, what, opts) {
		this.addGlobal(name, Value.fromNative(what, this.realm), opts);
	}

	addGlobalBridge(name, what, opts) {
		this.addGlobal(name, new BridgeValue(what, this.realm), opts);
	}

	fetchFunctionSync(name, shouldYield) {
		var genfx = this.fetchFunction(name, shouldYield);
		return function() {
			let gen = genfx.apply(this, arguments);
			let val = gen.next();
			//TODO: Make sure we dont await as it will loop FOREVER.
			while (!val.done) val = gen.next();
			return val.value;
		};
	}

	fetchFunction(name, shouldYield) {
		var val = this.globalScope.get(name);
		return this.makeFunctionFromClosure(val, shouldYield);
	}

	functionFromSource(source, shouldYield) {
		let code = source;
		let ast = this.realm.parser(code, {inFunctionBody: true});
		return this.functionFromAST(ast, shouldYield);
	}

	functionFromAST(ast, shouldYield, source) {
		let past = {
			type: 'FunctionExpression',
			body: {type: 'BlockStatement', body: ast.body},
			params: [],
		};
		past = ASTPreprocessor.process(past, {source: source});
		let fx = new ClosureValue(past, this.globalScope);
		return this.makeFunctionFromClosure(fx, shouldYield, this.evaluator);
	}

	functionFromSourceSync(source, shouldYield) {
		let genfx = this.functionFromSource(source, shouldYield);
		return function() {
			let gen = genfx.apply(this, arguments);
			let val = gen.next();
			//TODO: Make sure we dont await as it will loop FOREVER.
			while (!val.done) val = gen.next();
			return val.value;
		};
	}

	functionFromASTSync(ast, shouldYield, source) {
		let genfx = this.functionFromAST(ast, shouldYield, source);
		return function() {
			let gen = genfx.apply(this, arguments);
			let val = gen.next();
			//TODO: Make sure we dont await as it will loop FOREVER.
			while (!val.done) val = gen.next();
			return val.value;
		};
	}

	makeFunctionFromClosure(val, shouldYield, evalu) {

		var realm = this.realm;
		var scope = this.globalScope;
		var that = this;
		let evaluator = evalu || this.evaluator;
		if ( !evaluator ) throw new Error("Evaluator is falsey");
		if ( !val ) return;

		return function*() {
			var realThis = realm.makeForForeignObject(this);
			var realArgs = new Array(arguments.length);
			for ( let i = 0; i < arguments.length; ++i ) {
				realArgs[i] = realm.makeForForeignObject(arguments[i]);
			}


			let c = val.call(realThis, realArgs, scope);
			evaluator.pushFrame({type: 'program', generator: c, scope: scope});
			let gen = evaluator.generator();

			let last = yield * that.filterGenerator(gen, shouldYield, evaluator);
			if ( last ) return last.toNative();
		};
	}

	/**
	 * Returns a new engine that executes in the same Realm.  Useful
	 * for creating threads / coroutines
	 * @return {Engine}
	 */
	fork() {
		let engine = new Engine(this.options);
		var scope = this.globalScope;

		engine.realm = this.realm;

		engine.evaluator = this.makeEvaluatorClone();
		return engine;
	}



	makeEvaluatorClone() {
		let evaluator = new Evaluator(this.realm, this.evaluator.ast, this.globalScope);
		evaluator.frames = [];
		if ( this.evaluator.insturment ) {
			evaluator.insturment = this.evaluator.insturment;
		}
		if ( this.evaluator.debug ) {
			evaluator.debug = true;
		}
		return evaluator;
	}

	*filterGenerator(gen, shouldYield, evaluator) {
		let value = gen.next();
		let steps = 0;
		if ( !evaluator ) throw new Error("Evaluator is falsey");
		while ( !value.done ) {
			if ( !shouldYield ) yield;
			else if ( evaluator.topFrame.type == 'await' ) {
				if ( !value.value.resolved ) yield;
			} else {
				var yieldValue = shouldYield(this, evaluator, value.value);
				if ( yieldValue !== false ) yield yieldValue;
			}
			value = gen.next(value.value);
			if ( ++steps > this.options.executionLimit ) throw new Error('Execution Limit Reached');
		}
		return value.value;
	}
}

module.exports = Engine;

},{"./ASTPreprocessor":5,"./Evaluator":8,"./Realm":12,"./Scope":13,"./Value":14,"./values/BridgeValue":37,"./values/ClosureValue":38,"./values/EasyNativeFunction":39,"./values/FutureValue":43}],8:[function(require,module,exports){
'use strict';

const Value = require('./Value');
const CompletionRecord = require('./CompletionRecord');
const ClosureValue = require('./values/ClosureValue');
const ObjectValue = require('./values/ObjectValue');
const FutureValue = require('./values/FutureValue');
const RegExpValue = require('./values/RegExpValue');
const PropertyDescriptor = require('./values/PropertyDescriptor');
const ErrorValue = require('./values/ErrorValue');
const ArrayValue = require('./values/ArrayValue');
const EvaluatorInstruction = require('./EvaluatorInstruction');

class Frame {
	constructor(type, o) {
		this.type = type;
		for ( var k in o ) this[k] = o[k];
	}
}

class Evaluator {
	constructor(realm, n, s) {
		this.realm = realm;
		let that = this;
		this.lastValue = null;
		this.ast = n;
		this.defaultYieldPower = 5;
		this.yieldPower = this.defaultYieldPower;
		this.debug = false;
		this.profile = false;
		this.lastASTNodeProcessed = null;
		/**
		 * @type {Object[]}
		 * @property {Generator} generator
		 * @property {string} type
		 * @property {ast} ast
		 */
		this.frames = [];
		if ( n ) this.pushAST(n, s);
	}

	pushAST(n, s) {
		let that = this;
		let gen = n ? this.branch(n,s) : (function*() {
			return yield EvaluatorInstruction.stepMinor;
		})();
		this.pushFrame({generator: gen, type: 'program', scope: s, ast: n});
	}
	processLostFrames(frames) {
		for ( let f of frames ) {
			if ( f.profileName ) {
				this.incrCtr('fxTime', f.profileName, Date.now() - f.entered);
			}
		}
	}
	unwindStack(target, canCrossFxBounds, label) {
		let finallyFrames = [];
		for ( let i = 0; i < this.frames.length; ++i ) {
			let t = this.frames[i].type;
			let match = t == target || (target == 'return' && t == 'function' );
			if ( match && label ) {
				match = label == this.frames[i].label;
			}

			if ( match ) {
				let j = i + 1;
				for (; j < this.frames.length; ++j ) if ( this.frames[j].type != 'finally' ) break;
				let fr = this.frames[j];
				this.processLostFrames(this.frames.splice(0,i + 1));
				this.saveFrameShortcuts();
				Array.prototype.unshift.apply(this.frames, finallyFrames);
				return fr;
			} else if ( target == 'return' && this.frames[i].retValue ) {
				let fr = this.frames[i];
				this.processLostFrames(this.frames.splice(0, i));
				this.saveFrameShortcuts();
				Array.prototype.unshift.apply(this.frames, finallyFrames);
				return fr;
			} else if ( !canCrossFxBounds && this.frames[i].type == 'function' ) {
				break;
			} else if ( t == 'finally' ) {
				finallyFrames.push(this.frames[i]);
			}
		}
		return false;
	}

	next(lastValueOveride) {
		let frames = this.frames;

		//Implement proper tailcalls by hand.
		do {
			let top = frames[0];
			let result;
			//console.log(top.type, top.ast && top.ast.type);

			if ( top.exception ) {
				this.lastValue = top.exception;
				delete top.exception;
			} else if ( top.retValue ) {
				this.lastValue = top.retValue;
				delete top.retValue;
			}

			result = top.generator.next(lastValueOveride || this.lastValue);
			lastValueOveride = undefined;
			let val = result.value;

			if ( val instanceof EvaluatorInstruction ) {
				switch ( val.type ) {
					case 'branch':
						this.branchFrame(val.kind, val.ast, val.scope, val.extra);
						continue;
					case 'getEvaluator':
						//lastValueOveride = this;
						//continue;
						return this.next(this);
					case 'waitForFramePop':
						continue;
					case 'framePushed':
						continue;
					case 'event':
					case 'step':
						if ( this.instrument ) this.instrument(this, val);
						return {done: false, value: val};
				}
			}

			if ( val instanceof CompletionRecord ) {
				this.processCompletionValueMeaning(val);
				this.lastValue = val.value;
				continue;
			}
			//if ( !val ) console.log("Bad val somewhere around", this.topFrame.type);
			if ( this.instrument ) this.instrument(this, val);

			if ( val && val.then ) {
				if ( top && top.type !== 'await' ) {
					this.pushFrame({generator: (function *(f) {
						while ( !f.resolved ) yield f;
						if ( f.successful ) {
							return f.value;
						} else {
							return new CompletionRecord(CompletionRecord.THROW, f.value);
						}
					})(val), type: 'await'});
				}
				return {done: false, value: val};
			}

			this.lastValue = val;
			if ( result.done ) {
				let lastFrame = this.popFrame();

				if ( lastFrame.profileName ) {
					this.processLostFrames([lastFrame]);
				}

				// Latient values can't cross function calls.
				// Dont do this, and you get coffeescript mode.
				if ( lastFrame.type === 'function' && !lastFrame.returnLastValue ) {
					this.lastValue = Value.undef;
				}

				if ( frames.length === 0 ) {
					if ( this.debug ) {
						this.dumpProfilingInformation();
					}
					return {done: true, value: result.value};
				} else continue;
			}
		} while ( false );

		return {done: false, value: this.lastValue};
	}

	processCompletionValueMeaning(val) {
		if ( !(val.value instanceof Value) ) {
			if ( val.value instanceof Error ) {
				throw new Error('Value was an error: ' + val.value.stack);
			}
			throw new Error('Value isnt of type Value, its' + val.value.toString());
		}

		switch ( val.type ) {
			case CompletionRecord.CONTINUE:
				if ( this.unwindStack('continue', false, val.target) ) return true;
				throw new Error('Cant find matching loop frame for continue');
			case CompletionRecord.BREAK:
				if ( this.unwindStack('loop', false, val.target) ) return true;
				throw new Error('Cant find matching loop frame for break');
			case CompletionRecord.RETURN:
				let rfr = this.unwindStack('return', false);
				if ( !rfr ) throw new Error('Cant find function bounds.');
				rfr.retValue = val.value;
				return true;
			case CompletionRecord.THROW:
				//TODO: Fix this nonsense:
				let e = val.value.toNative();
				//val.value.native = e;

				let smallStack;
				if ( e && e.stack ) smallStack = e.stack.split(/\n/).slice(0,4).join('\n');
				let stk = this.buildStacktrace(e).join('\n    ');
				let bestFrame;
				for ( let i = 0; i < this.frames.length; ++i ) {
					if ( this.frames[i].ast ) {
						bestFrame = this.frames[i];
						break;
					}
				}

				if ( val.value instanceof ErrorValue ) {
					if ( this.realm.options.addExtraErrorInfoToStacks && val.value.extra ) {
						stk += '\n-------------';
						for ( let key in val.value.extra ) {
							let vv = val.value.extra[key];
							if ( vv instanceof Value ) stk += `\n${key} => ${vv.debugString}`;
							else stk += `\n${key} => ${vv}`;
						}
					}
				}

				if ( e instanceof Error ) {
					e.stack = stk;
					if ( smallStack && this.realm.options.addInternalStack ) e.stack += '\n-------------\n' + smallStack;
					if ( bestFrame ) {
						e.range = bestFrame.ast.range;
						e.loc = bestFrame.ast.loc;
					}
				}

				if ( val.value instanceof ErrorValue ) {
					if ( !val.value.has('stack') ) {
						val.value.setImmediate('stack', Value.fromNative(stk));
						val.value.properties['stack'].enumerable = false;
					}
				}

				let tfr = this.unwindStack('catch', true);
				if ( tfr ) {
					tfr.exception = val;
					this.lastValue = val;
					return true;
				}
				let line = -1;
				if ( this.topFrame.ast && this.topFrame.ast.attr) {
					line = this.topFrame.ast.attr.pos.start_line;
				}
				//console.log(this.buildStacktrace(val.value.toNative()));
				throw val.value.toNative();
			case CompletionRecord.NORMAL:
				return false;
		}
	}

	buildStacktrace(e) {
		let lines = e ? [e.toString()] : [];
		for ( var f of this.frames ) {
			//if ( f.type !== 'function' ) continue;
			if ( f.ast ) {
				let line = 'at ' + (f.ast.srcName || f.ast.type) + ' ';
				if ( f.ast.loc ) line += '(<src>:' + f.ast.loc.start.line + ':' + f.ast.loc.start.column + ')';
				lines.push(line);
			}
		}
		return lines;
	}
	pushFrame(frame) {
		frame.srcAst = frame.ast;
		if ( frame.yieldPower === undefined ) frame.yieldPower = this.defaultYieldPower;
		this.frames.unshift(new Frame(frame.type, frame));
		this.saveFrameShortcuts();
	}

	popFrame() {
		let frame = this.frames.shift();
		this.saveFrameShortcuts();
		return frame;
	}

	saveFrameShortcuts() {
		let prev = this.yieldPower;
		if ( this.frames.length == 0 ) {
			this.topFrame = undefined;
			this.yieldPower = this.defaultYieldPower;
		} else {
			this.topFrame = this.frames[0];
			this.yieldPower = this.topFrame.yieldPower;
		}
	}

	fromNative(native) {
		return this.realm.valueFromNative(native);
	}

	generator() {
		return {next: this.next.bind(this), throw: (e) => { throw e; }};
	}

	breakFrames() {

	}


	*resolveRef(n, s, create) {
		let oldAST = this.topFrame.ast;
		this.topFrame.ast = n;
		switch (n.type) {
			case 'Identifier':
				let iref = s.ref(n.name, s.realm);
				if ( !iref ) {
					iref = {
						getValue: function*() {
							let err = CompletionRecord.makeReferenceError(s.realm, `${n.name} is not defined`);
							yield * err.addExtra({code: 'UndefinedVariable', when: 'read', ident: n.name, strict: s.strict});
							return yield err;
						},
						del: function() {
							return true;
						}
					};
					if ( !create || s.strict ) {
						iref.setValue = function *() {
							let err = CompletionRecord.makeReferenceError(s.realm, `${n.name} is not defined`);
							yield * err.addExtra({code: 'UndefinedVariable', when: 'write', ident: n.name, strict: s.strict});
							return yield err;
						};
					} else {
						iref.setValue = function *(value) {
							s.global.set(n.name, value, s);
							let aref = s.global.ref(n.name, s.realm);
							this.setValue = aref.setValue;
							this.getValue = aref.getValue;
							this.del = aref.delete;
						};
					}
				}
				this.topFrame.ast = oldAST;
				return iref;
			case 'MemberExpression':
				let idx;
				let ref = yield * this.branch(n.object, s);
				if ( n.computed ) {
					idx = (yield * this.branch(n.property, s)).toNative();
				} else {
					idx = n.property.name;
				}

				if ( !ref ) {
					return yield CompletionRecord.makeTypeError(s.realm, `Can't write property of undefined: ${idx}`);
				}

				if ( !ref.ref ) {
					return yield CompletionRecord.makeTypeError(s.realm, `Can't write property of non-object type: ${idx}`);
				}

				this.topFrame.ast = oldAST;
				return ref.ref(idx, s.realm);

			default:
				return yield CompletionRecord.makeTypeError(s.realm, `Couldnt resolve ref component: ${n.type}`);
		}
	}

	*partialMemberExpression(left, n, s) {
		if ( n.computed ) {
			let right = yield * this.branch(n.property,s);
			return yield * left.get(right.toNative(), s.realm);
		} else if ( n.property.type == 'Identifier') {
			if ( !left ) throw `Cant index ${n.property.name} of undefined`;
			return yield * left.get(n.property.name, s.realm);
		} else {
			if ( !left ) throw `Cant index ${n.property.value.toString()} of undefined`;
			return yield * left.get(n.property.value.toString(), s.realm);
		}
	}

	//NOTE: Returns generator, fast return yield *;
	doBinaryEvaluation(operator, left, right, realm) {
		switch ( operator ) {
			case '==': return left.doubleEquals(right, realm);
			case '!=': return left.notEquals(right, realm);
			case '===': return left.tripleEquals(right, realm);
			case '!==': return left.doubleNotEquals(right, realm);
			case '+': return left.add(right, realm);
			case '-': return left.subtract(right, realm);
			case '*': return left.multiply(right, realm);
			case '/': return left.divide(right, realm);
			case '%': return left.mod(right, realm);
			case '|': return left.bitOr(right, realm);
			case '^': return left.bitXor(right, realm);
			case '&': return left.bitAnd(right, realm);
			case 'in': return right.inOperator(left, realm);
			case 'instanceof': return left.instanceOf(right, realm);
			case '>': return left.gt(right, realm);
			case '<': return left.lt(right, realm);
			case '>=': return left.gte(right, realm);
			case '<=': return left.lte(right, realm);
			case '<<': return left.shiftLeft(right, realm);
			case '>>': return left.shiftRight(right, realm);
			case '>>>': return left.shiftRightZF(right, realm);
			default:
				throw new Error('Unknown binary operator: ' + operator);
		}
	}

	branchFrame(type, n, s, extra) {
		let frame = {generator: this.branch(n,s), type: type, scope: s, ast: n};

		if ( extra ) {
			for ( var k in extra ) {
				frame[k] = extra[k];
			}
			if ( extra.profileName ) {
				frame.entered = Date.now();
			}
		}
		this.pushFrame(frame);
		return EvaluatorInstruction.framePushed;
	}

	beforeNode(n) {
		let tf = this.topFrame;
		let state = {top: tf, ast: tf.ast, node: n};
		this.lastASTNodeProcessed = n;
		if ( this.debug ) this.incrCtr('astInvocationCount', n.type);
		tf.ast = n;
		return state;
	}

	afterNode(state, r) {
		let tf = this.topFrame;
		tf.value = r;
		tf.ast = state.ast;
	}

	/**
	 * @private
	 * @param {object} n - AST Node to dispatch
	 * @param {Scope} s - Current evaluation scope
	 */
	branch(n, s) {
		if ( !n.dispatch ) {
			let nextStep = this.findNextStep(n.type);

			n.dispatch = function*(that, n, s) {
				let state = that.beforeNode(n);

				let result = yield * nextStep(that, n,s);
				if ( result instanceof CompletionRecord ) result = yield result;
				if ( result && result.then ) result = yield result;

				that.afterNode(state, result);

				return result;
			};
		}
		return n.dispatch(this, n, s);
	}

	incrCtr(n, c, v) {
		if ( v === undefined ) v = 1;
		if ( !this.profile ) this.profile = {};
		let o = this.profile[n];
		if ( !o ) {
			o = {};
			this.profile[n] = o;
		}
		c = c || '???';
		if ( c in o ) o[c] += v
		else o[c] = v;
	}


	dumpProfilingInformation() {
		function lpad(s, l) { return s + new Array(Math.max(l - s.length,1)).join(' '); }

		if ( !this.profile ) {
			console.log("===== Profile: None collected =====");
			return;
		}

		console.log('===== Profile =====');
		for ( let  sec in this.profile ) {
			console.log(sec + ' Stats:');
			let o = this.profile[sec];
			let okeys = Object.keys(o).sort((a,b) => o[b] - o[a]);
			for ( let name of okeys ) {
				console.log(`  ${lpad(name, 20)}: ${o[name]}`);
			}
		}
		console.log('=================');
	}

	get insterment() { return this.instrument; }
	set insterment(v) { this.instrument = v; }
}

Evaluator.prototype.findNextStep = require('./EvaluatorHandlers');

module.exports = Evaluator;

},{"./CompletionRecord":6,"./EvaluatorHandlers":9,"./EvaluatorInstruction":10,"./Value":14,"./values/ArrayValue":36,"./values/ClosureValue":38,"./values/ErrorValue":42,"./values/FutureValue":43,"./values/ObjectValue":47,"./values/PropertyDescriptor":49,"./values/RegExpValue":50}],9:[function(require,module,exports){
'use strict';

const Value = require('./Value');
const CompletionRecord = require('./CompletionRecord');
const ClosureValue = require('./values/ClosureValue');
const ObjectValue = require('./values/ObjectValue');
const FutureValue = require('./values/FutureValue');
const RegExpValue = require('./values/RegExpValue');
const PropertyDescriptor = require('./values/PropertyDescriptor');
const ErrorValue = require('./values/ErrorValue');
const ArrayValue = require('./values/ArrayValue');
const EvaluatorInstruction = require('./EvaluatorInstruction');



function *evaluateArrayExpression(e, n, s) {
	//let result = new ObjectValue();
	let result = new Array(n.elements.length);
	for ( let i = 0; i < n.elements.length; ++i ) {
		if ( n.elements[i] ) {
			result[i] = yield * e.branch(n.elements[i],s);
		}
	}
	if ( e.yieldPower >= 3 ) yield EvaluatorInstruction.stepMinor;
	return ArrayValue.make(result, e.realm);
}

function *evaluateAssignmentExpression(e, n, s) {
	//TODO: Account for not-strict mode
	var realm = s.realm;
	let ref = yield * e.resolveRef(n.left, s, n.operator === '=');

	if ( !ref && s.strict ) {
		return CompletionRecord.makeReferenceError(s.realm, `Invalid refrence in assignment.`);
	}

	let argument = yield * e.branch(n.right, s);
	let value;
	let cur;
	if ( e.yieldPower >= 3 ) yield EvaluatorInstruction.stepMinor;
	switch ( n.operator ) {
		case '=':
			value = argument;
			break;
		case '+=':
			cur = yield * ref.getValue();
			value = yield * cur.add(argument, realm);
			break;
		case '-=':
			cur = yield * ref.getValue();
			value = yield * cur.subtract(argument, realm);
			break;
		case '*=':
			cur = yield * ref.getValue();
			value = yield * cur.multiply(argument, realm);
			break;
		case '/=':
			cur = yield * ref.getValue();
			value = yield * cur.divide(argument, realm);
			break;
		case '%=':
			cur = yield * ref.getValue();
			value = yield * cur.mod(argument, realm);
			break;
		case '<<=':
			cur = yield * ref.getValue();
			value = yield * cur.shiftLeft(argument, realm);
			break;
		case '>>=':
			cur = yield * ref.getValue();
			value = yield * cur.shiftRight(argument, realm);
			break;
		case '>>>=':
			cur = yield * ref.getValue();
			value = yield * cur.shiftRightZF(argument, realm);
			break;
		case '|=':
			cur = yield * ref.getValue();
			value = yield * cur.bitOr(argument, realm);
			break;
		case '&=':
			cur = yield * ref.getValue();
			value = yield * cur.bitAnd(argument, realm);
			break;
		case '^=':
			cur = yield * ref.getValue();
			value = yield * cur.bitXor(argument, realm);
			break;
		default:
			throw new Error('Unknown assignment operator: ' + n.operator);
	}

	if ( ref ) {
		yield * ref.setValue(value, s);
	} else {
		yield * s.put(n.left.name, value, s);
	}

	return value;
}

function *evaulateBinaryExpression(e, n, s) {
	let left = yield * e.branch(n.left,s);
	let right = yield * e.branch(n.right,s);
	if ( e.yieldPower >= 4 ) yield EvaluatorInstruction.stepMinor;
	return yield * e.doBinaryEvaluation(n.operator, left, right, s);
}

function *evaluateBlockStatement(e, n, s) {
	let result = Value.undef;
	for ( let statement of n.body ) {
		result = yield * e.branch(statement,s);
	}
	return result;
}


function *evaluateBreakStatement(e, n, s) {
	let label = n.label ? n.label.name : undefined;
	if ( e.yieldPower >= 1 ) yield EvaluatorInstruction.stepMinor;
	return new CompletionRecord(CompletionRecord.BREAK, Value.undef, label);
}


function *evaluateCallExpression(e, n, s) {
	let thiz = Value.undef;

	let callee, base;

	if ( n.callee.type === 'MemberExpression' ) {
		thiz = base = yield * e.branch(n.callee.object, s);
		callee = yield * e.partialMemberExpression(thiz, n.callee, s);
		if ( callee instanceof CompletionRecord ) {
			if ( callee.type == CompletionRecord.THROW ) return callee;
			callee = callee.value;
		}
	} else {
		callee = yield * e.branch(n.callee, s);
	}

	if ( n.type === 'NewExpression' ) {
		thiz = yield * callee.makeThisForNew(s.realm);
		if ( thiz instanceof CompletionRecord ) {
			if ( thiz.type == CompletionRecord.THROW ) return thiz;
			thiz = thiz.value;
		}
	}

	if ( typeof callee.rawCall === 'function' ) {
		return yield * callee.rawCall(n, e, s);
	}

	//console.log("Calling", callee, callee.call);

	let args = new Array(n.arguments.length);
	for ( let i = 0; i < n.arguments.length; ++i ) {
		args[i] = yield * e.branch(n.arguments[i],s);
	}

	let name = n.callee.srcName || callee.jsTypeName;

	if ( e.yieldPower >= 1 ) yield EvaluatorInstruction.stepMajor;

	if ( !callee.isCallable ) {
		let err = CompletionRecord.makeTypeError(e.realm, '' + name + ' is not a function');
		yield * err.addExtra({
			code: 'CallNonFunction',
			target: callee,
			targetAst: n.callee,
			targetName: name,
			base: base
		});
		return err;
	}

	if ( e.debug ) {
		e.incrCtr('fxInvocationCount', n.callee.srcName);
	}

	let callResult = callee.call(thiz, args, s, {
		asConstructor: n.type === 'NewExpression',
		callNode: n,
		evaluator: e
	});

	if ( callResult instanceof CompletionRecord ) return callResult;

	if ( typeof callResult.next !== 'function' ) {
		console.log('Generator Failure', callResult);
		return CompletionRecord.makeTypeError(e.realm, '' + name + ' didnt make a generator');
	}

	let result = yield * callResult;
	if ( n.type === 'NewExpression' ) {
		//TODO: If a constructor returns, you actually use that value
		if ( result instanceof Value ) {
			if ( result.specTypeName === 'undefined' ) return thiz;
			return result;
		}
		return thiz;
	} else {
		return result;
	}
}

function *evaluateClassExpression(e, n, s) {
	let clazz = new ObjectValue(e.realm);
	clazz.call = function*() { return Value.undef; };

	let proto = new ObjectValue(e.realm);
	yield * clazz.set('prototype', proto);
	yield * proto.set('constructor', clazz);

	if ( e.yieldPower >= 3 ) yield EvaluatorInstruction.stepMinor;
	for ( let m of n.body.body ) {
		let fx = yield * e.branch(m.value, s);

		//TODO: Support getters and setters
		if ( m.kind == 'constructor' ) {
			clazz.call = function*(thiz, args, s) { return yield * fx.call(thiz,args,s); };

		} else {
			let ks;
			if ( m.computed ) {
				let k = yield * e.branch(m.key, s);
				ks = yield * k.toStringNative(e.realm);
			} else {
				ks = m.key.name;
			}

			if ( m.static ) clazz.setImmediate(ks, fx);
			else proto.setImmediate(ks, fx);
		}
	}
	return clazz;
}

function *evaluateClassDeclaration(e, n, s) {
	let clazz = yield * evaluateClassExpression(e, n, s);
	yield * s.put(n.id.name, clazz);
	return clazz;
}

function *evaluateConditionalExpression(e, n, s) {
	let test = yield * e.branch(n.test, s);
	if ( e.yieldPower >= 4 ) yield EvaluatorInstruction.stepMinor;
	if ( test.truthy ) {
		return yield * e.branch(n.consequent, s);
	} else {
		if ( n.alternate ) {
			return yield * e.branch(n.alternate, s);
		}
	}
	return Value.undef;
}


function *evaluateContinueStatement(e, n, s) {
	let label = n.label ? n.label.name : undefined;
	let val = new CompletionRecord(CompletionRecord.CONTINUE, Value.undef, label);
	if ( e.yieldPower >= 1 ) yield EvaluatorInstruction.stepMinor;
	return val;
}

function *evaluateDoWhileStatement(e, n, s) {
	let last = Value.undef;
	let that = e;
	var gen = function*() {
		do {
			last = yield that.branchFrame('continue', n.body, s, {label: n.label});
		} while ( (yield * that.branch(n.test,s)).truthy );
	};
	if ( e.yieldPower > 0 ) yield EvaluatorInstruction.stepMinor;
	e.pushFrame({generator: gen(), type: 'loop', label: n.label, ast: n});


	let finished = yield EvaluatorInstruction.waitForFramePop;
	return Value.undef;
}

function *evaluateEmptyStatement(e, n, s) {
	if ( e.yieldPower >= 5 ) yield EvaluatorInstruction.stepMinor;
	return Value.undef;
}

function *evaluateExpressionStatement(e, n, s) {
	if ( e.yieldPower > 4 ) yield EvaluatorInstruction.stepMinor;
	return yield * e.branch(n.expression,s);
}

function *evaluateIdentifier(e, n, s) {
	if ( e.yieldPower >= 4 ) yield EvaluatorInstruction.stepMinor;
	if ( n.name === 'undefined' ) return Value.undef;
	if ( !s.has(n.name) ) {
		// Allow undeclared varibles to be null?
		if ( false ) return Value.undef;
		let err = CompletionRecord.makeReferenceError(e.realm, `${n.name} is not defined`);
		yield * err.addExtra({code: 'UndefinedVariable', when: 'read', ident: n.name, strict: s.strict});
		return yield err;
	}
	return s.get(n.name);
}

function *evaluateIfStatement(e, n, s) {
	if ( e.yieldPower >= 2 ) yield EvaluatorInstruction.stepStatement;
	let test = yield * e.branch(n.test, s);
	if ( test.truthy ) {
		return yield * e.branch(n.consequent, s);
	} else {
		if ( n.alternate ) {
			return yield * e.branch(n.alternate, s);
		}
	}
	return Value.undef;
}

function* genForLoop(e, n, s) {
	let test = Value.true;
	if ( n.test ) test = yield * e.branch(n.test,s);
	let last = Value.undef;
	while ( test.truthy ) {
		e.topFrame.ast = n;
		if ( e.yieldPower > 0 ) yield EvaluatorInstruction.eventLoopBodyStart;
		last = yield e.branchFrame('continue', n.body, s, {label: n.label});
		if ( n.update ) yield * e.branch(n.update,s);
		if ( n.test ) test = yield * e.branch(n.test,s);
	}
};

function *evaluateForStatement(e, n, s) {
	if ( e.yieldPower > 0 ) yield EvaluatorInstruction.stepStatement;
	if ( n.init ) yield * e.branch(n.init,s);

	e.pushFrame({generator: genForLoop(e, n, s), type: 'loop', label: n.label, ast: n});


	let finished = yield EvaluatorInstruction.waitForFramePop;
	return Value.undef;
}

function *evaluateForInStatement(e, n, s) {
	if ( e.yieldPower > 0 ) yield EvaluatorInstruction.stepStatement;
	let last = Value.undef;
	let object = yield * e.branch(n.right,s);
	let names = object.observableProperties(s.realm);
	let that = e;
	let ref;

	if ( n.left.type === 'VariableDeclaration' ) {
		s.add(n.left.declarations[0].id.name, Value.undef);
		ref = s.ref(n.left.declarations[0].id.name, s.realm);
	} else {
		ref = s.ref(n.left.name, s.realm);
	}

	var gen = function*() {
		for ( let name of names ) {
			yield * ref.setValue(name);
			last = yield that.branchFrame('continue', n.body, s, {label: n.label});
		}
	};
	e.pushFrame({generator: gen(), type: 'loop', label: n.label, ast: n});


	let finished = yield EvaluatorInstruction.waitForFramePop;
	return Value.undef;
}

//TODO: For of does more crazy Symbol iterator stuff
function *evaluateForOfStatement(e, n, s) {
	if ( e.yieldPower > 0 ) yield EvaluatorInstruction.stepStatement;
	let last = Value.undef;
	let object = yield * e.branch(n.right,s);
	let names = object.observableProperties(s.realm);
	let that = e;
	let ref;

	if ( n.left.type === 'VariableDeclaration' ) {
		yield * s.put(n.left.declarations[0].id.name, Value.undef);
		ref = s.ref(n.left.declarations[0].id.name, s.realm);
	} else {
		ref = s.ref(n.left.name, s.realm);
	}

	var gen = function*() {
		for ( let name of names ) {
			yield * ref.setValue(yield * object.get(yield * name.toStringNative()));
			last = yield that.branchFrame('continue', n.body, s, {label: n.label});
		}
	};
	e.pushFrame({generator: gen(), type: 'loop', label: n.label});


	let finished = yield EvaluatorInstruction.waitForFramePop;
	return Value.undef;
}

function *evaluateFunctionDeclaration(e, n, s) {
	if ( e.yieldPower > 0 ) yield EvaluatorInstruction.stepMajor;
	let closure = new ClosureValue(n, s);
	s.add(n.id.name, closure);
	return Value.undef;
}

function *evaluateFunctionExpression(e, n, s) {
	if ( e.yieldPower > 0 ) yield EvaluatorInstruction.stepMajor;
	let value = new ClosureValue(n, s);
	if ( n.type === 'ArrowFunctionExpression' ) {
		value.thiz = s.thiz;
		if ( n.expression ) value.returnLastValue = true;
	}
	return value;
}

function *evaluateLabeledStatement(e, n, s) {
	if ( e.yieldPower >= 5 ) yield EvaluatorInstruction.stepMinor;
	return yield * e.branch(n.body, s);
}

function *evaulateLiteral(e, n, s) {
	if ( e.yieldPower >= 5 ) yield EvaluatorInstruction.stepMinor;
	if ( n.regex ) {
		return RegExpValue.make(new RegExp(n.regex.pattern, n.regex.flags), s.realm);
	} else if ( n.value === null ) {
		if ( e.raw === 'null' ) return Value.null;

		//Work around Esprima turning Infinity into null. =\
		let tryFloat = parseFloat(n.raw);
		if ( !isNaN(tryFloat) ) return e.fromNative(tryFloat);
		return e.fromNative(null);
	} else {
		return e.fromNative(n.value);
	}
}

function *evaluateLogicalExpression(e, n, s) {
	let left = yield * e.branch(n.left,s);
	if ( e.yieldPower >= 4 ) yield EvaluatorInstruction.stepMajor;
	switch ( n.operator ) {
		case '&&':
			if ( left.truthy ) return yield * e.branch(n.right,s);
			return left;
		case '||':
			if ( left.truthy ) return left;
			return yield * e.branch(n.right,s);
		default:
			throw new Error('Unknown logical operator: ' + n.operator);
	}

}

function *evaluateMemberExpression(e, n, s) {
	if ( e.yieldPower >= 4 ) yield EvaluatorInstruction.stepMinor;
	let left = yield * e.branch(n.object,s);
	return yield * e.partialMemberExpression(left, n, s);
}

function *evaluateObjectExpression(e, n, s) {
	//TODO: Need to wire up native prototype
	var nat = new ObjectValue(s.realm);
	for ( let i = 0; i < n.properties.length; ++i ) {
		let prop = n.properties[i];
		let key;
		if ( n.computed ) {
			key = (yield * e.branch(prop.key, s)).toNative().toString();
		} else if ( prop.key.type == 'Identifier') {
			key = prop.key.name;
		} else if ( prop.key.type == 'Literal' ) {
			key = prop.key.value.toString();
		}

		let value = yield * e.branch(prop.value, s);
		let pd;

		if ( Object.prototype.hasOwnProperty.call(nat.properties, key) ) {
			pd = nat.properties[key];
		} else {
			pd = new PropertyDescriptor(Value.undef);
			nat.rawSetProperty(key, pd);
		}

		switch ( prop.kind  ) {
			case 'init':
			default:
				pd.value = value;
				break;
			case 'get':
				pd.getter = value;
				break;
			case 'set':
				pd.setter = value;
				break;
		}

	}
	if ( e.yieldPower > 0 ) yield EvaluatorInstruction.stepMajor;
	return nat;
}

function *evaluateProgram(e, n, s) {
	let result = Value.undef;
	if ( n.vars )
	for ( var v in n.vars ) {
		s.add(v, Value.undef);
	}
	if ( n.strict === true ) s.strict = true;
	if ( e.yieldPower >= 4 ) yield EvaluatorInstruction.stepMajor;
	for ( let statement of n.body ) {
		result = yield * e.branch(statement, s);
	}
	return result;
}

function *evaluateReturnStatement(e, n, s) {
	let retVal = Value.undef;
	if ( n.argument ) retVal = yield * e.branch(n.argument,s);
	if ( e.yieldPower >= 2 ) yield EvaluatorInstruction.stepMajor;
	return new CompletionRecord(CompletionRecord.RETURN, retVal);
}

function *evaluateSequenceExpression(e, n, s) {
	let last = Value.undef;
	if ( e.yieldPower >= 4 ) yield EvaluatorInstruction.stepMajor;
	for ( let expr of n.expressions ) {
		last = yield * e.branch(expr,s);
	}
	return last;
}

function *evaluateSwitchStatement(e, n, s) {
	if ( e.yieldPower >= 2 ) yield EvaluatorInstruction.stepMajor;
	let discriminant = yield * e.branch(n.discriminant, s);
	let last = Value.undef;
	let matches = 0;
	let matchVals = new Array(n.cases.length);
	let matched = false;

	for ( let i = 0; i < n.cases.length; ++i ) {
		let cas = n.cases[i];
		if ( cas.test ) {
			let testval = yield * e.branch(cas.test, s);
			let equality = yield * testval.tripleEquals(discriminant);
			if ( equality.truthy ) ++matches;
			matchVals[i] = equality.truthy;
		}
	}


	let genSwitch = function*(e, n) {

		for ( let i = 0; i < n.cases.length; ++i ) {
			let cas = n.cases[i];
			if ( !matched ) {
				if ( cas.test ) {
					if ( !matchVals[i] ) continue;
				} else {
					if ( matches !== 0 ) continue;
				}
				matched = true;
			}
			for ( let statement of cas.consequent ) {
				last = yield * e.branch(statement, s);
			}
		}
	};

	e.pushFrame({generator: genSwitch(e, n), type: 'loop', label: n.label});
	let finished = yield EvaluatorInstruction.waitForFramePop;

	return last;
}

function *evaluateThisExpression(e, n, s) {
	if ( e.yieldPower >= 4 ) yield EvaluatorInstruction.stepMajor;
	if ( s.thiz ) return s.thiz;
	else return Value.undef;
}

function *evaluateThrowStatement(e, n, s) {
	let value = yield * e.branch(n.argument, s);
	if ( e.yieldPower >= 2 ) yield EvaluatorInstruction.stepMajor;
	return new CompletionRecord(CompletionRecord.THROW, value);
}

function *evaluateTryStatement(e, n, s) {
	if ( e.yieldPower >= 2 ) yield EvaluatorInstruction.stepMajor;
	if ( n.finalizer ) e.pushFrame({generator: e.branch(n.finalizer,s), type: 'finally', scope: s});
	let result = yield e.branchFrame('catch', n.block, s);
	if ( result instanceof CompletionRecord && result.type == CompletionRecord.THROW ) {
		if ( !n.handler ) {
			//console.log("No catch..., throwing", result.obj);
			return result;
		}
		let handlerScope = s.createChild();
		handlerScope.add(n.handler.param.name, result.value);
		return yield * e.branch(n.handler.body, handlerScope);
	}
	return result;
}

function *evaluateUpdateExpression(e, n, s) {
	//TODO: Need to support something like ++x[1];
	let nue;
	if ( e.yieldPower >= 3 ) yield EvaluatorInstruction.stepMajor;
	let ref = yield * e.resolveRef(n.argument, s, true);
	let old = Value.nan;

	if ( ref ) old = yield * ref.getValue();
	if ( old === undefined ) old = Value.nan;
	switch (n.operator) {
		case '++': nue = yield * old.add(e.fromNative(1)); break;
		case '--': nue = yield * old.subtract(e.fromNative(1)); break;
		default: throw new Error('Unknown update expression type: ' + n.operator);
	}
	if ( ref ) yield * ref.setValue(nue, s);

	if ( n.prefix ) return nue;
	return old;
}

function *evaulateUnaryExpression(e, n, s) {
	if ( e.yieldPower >= 4 ) yield EvaluatorInstruction.stepMajor;
	if ( n.operator === 'delete' ) {
		if ( n.argument.type !== 'MemberExpression' && n.argument.type !== 'Identifier' ) {
			//e isnt something you can delete?
			return Value.true;
		}

		let ref = yield * e.resolveRef(n.argument, s);
		if ( !ref ) return Value.false;
		if ( ref.isVariable ) { return Value.false; }
		let worked = ref.del(s);
		if ( worked instanceof CompletionRecord ) return yield worked;
		return Value.fromNative(worked);
	}

	if ( n.operator === 'typeof' ) {
		if ( n.argument.type == 'Identifier' ) {
			if ( !s.has(n.argument.name) ) return yield * Value.undef.typeOf();
		}
	}

	let left = yield * e.branch(n.argument,s);
	switch ( n.operator ) {
		case '-': return yield * left.unaryMinus();
		case '+': return yield * left.unaryPlus();
		case '!': return yield * left.not();
		case '~': return yield * left.bitNot();
		case 'typeof': return yield * left.typeOf();
		case 'void': return Value.undef;
		default:
			throw new Error('Unknown binary operator: ' + n.operator);
	}
}

function *evaluateVariableDeclaration(e, n, s) {
	let kind = n.kind;
	if ( e.yieldPower >= 3 ) yield EvaluatorInstruction.stepMajor;
	for ( let decl of n.declarations ) {
		let value = Value.undef;
		if ( decl.init ) value = yield * e.branch(decl.init,s);
		else if ( s.has(decl.id.name) ) continue;

		if ( kind === 'const' ) {
			s.addConst(decl.id.name, value);
		} else {
			s.add(decl.id.name, value);
		}
	}
	return Value.undef;
}

function* genWhileLoop(e, n, s) {
	let last = Value.undef;
	while ( (yield * e.branch(n.test,s)).truthy ) {
		e.topFrame.ast = n;
		if ( e.yieldPower > 0 ) yield EvaluatorInstruction.eventLoopBodyStart;
		last = yield e.branchFrame('continue', n.body, s);
	}
}

function *evaluateWhileStatement(e, n, s) {
	if ( e.yieldPower > 0 ) yield EvaluatorInstruction.stepMajor;
	e.pushFrame({generator: genWhileLoop(e, n, s), type: 'loop', label: n.label, ast: n});
	let finished = yield EvaluatorInstruction.waitForFramePop;
	return Value.undef;
}

function *evaluateWithStatement(e, n, s) {
	if ( e.yieldPower > 0 ) yield EvaluatorInstruction.stepMajor;
	if ( s.strict ) return CompletionRecord.makeSyntaxError(e.realm, 'Strict mode code may not include a with statement');
	return CompletionRecord.makeSyntaxError(e.realm, 'With statement not supported by esper');
}

function findNextStep(type) {
	switch ( type ) {
		case 'ArrayExpression': return evaluateArrayExpression;
		case 'ArrowFunctionExpression': return evaluateFunctionExpression;
		case 'AssignmentExpression': return evaluateAssignmentExpression;
		case 'BinaryExpression': return evaulateBinaryExpression;
		case 'BreakStatement': return evaluateBreakStatement;
		case 'BlockStatement': return evaluateBlockStatement;
		case 'CallExpression': return evaluateCallExpression;
		case 'ClassDeclaration': return evaluateClassDeclaration;
		case 'ClassExpression': return evaluateClassExpression;
		case 'ConditionalExpression': return evaluateConditionalExpression;
		case 'DebuggerStatement': return evaluateEmptyStatement;
		case 'DoWhileStatement': return evaluateDoWhileStatement;
		case 'ContinueStatement': return evaluateContinueStatement;
		case 'EmptyStatement': return evaluateEmptyStatement;
		case 'ExpressionStatement': return evaluateExpressionStatement;
		case 'ForStatement': return evaluateForStatement;
		case 'ForInStatement': return evaluateForInStatement;
		case 'ForOfStatement': return evaluateForOfStatement;
		case 'FunctionDeclaration': return evaluateFunctionDeclaration;
		case 'FunctionExpression': return evaluateFunctionExpression;
		case 'Identifier': return evaluateIdentifier;
		case 'IfStatement': return evaluateIfStatement;
		case 'LabeledStatement': return evaluateLabeledStatement;
		case 'Literal': return evaulateLiteral;
		case 'LogicalExpression': return evaluateLogicalExpression;
		case 'MemberExpression': return evaluateMemberExpression;
		case 'NewExpression': return evaluateCallExpression;
		case 'ObjectExpression': return evaluateObjectExpression;
		case 'Program': return evaluateProgram;
		case 'ReturnStatement': return evaluateReturnStatement;
		case 'SequenceExpression': return evaluateSequenceExpression;
		case 'SwitchStatement': return evaluateSwitchStatement;
		case 'ThisExpression': return evaluateThisExpression;
		case 'ThrowStatement': return evaluateThrowStatement;
		case 'TryStatement': return evaluateTryStatement;
		case 'UnaryExpression': return evaulateUnaryExpression;
		case 'UpdateExpression': return evaluateUpdateExpression;
		case 'VariableDeclaration': return evaluateVariableDeclaration;
		case 'WhileStatement': return evaluateWhileStatement;
		case 'WithStatement': return evaluateWithStatement;
		default:
			throw new Error('Unknown AST Node Type: ' + type);
	}
}

module.exports = findNextStep;


},{"./CompletionRecord":6,"./EvaluatorInstruction":10,"./Value":14,"./values/ArrayValue":36,"./values/ClosureValue":38,"./values/ErrorValue":42,"./values/FutureValue":43,"./values/ObjectValue":47,"./values/PropertyDescriptor":49,"./values/RegExpValue":50}],10:[function(require,module,exports){
'use strict';


class EvaluatorInstruction {
	static branch(kind, ast, scope, extra) {
		let ei = new EvaluatorInstruction('branch');
		ei.kind = kind;
		ei.ast = ast;
		ei.scope = scope;
		ei.extra = extra;
		return ei;
	}

	static getEvaluator() {
		return new EvaluatorInstruction('getEvaluator');
	}

	constructor(type) {
		this.type = type;
	}

	mark(o) {
		for ( let k in o ) this[k] = o[k];
		return this;
	}
}

EvaluatorInstruction.stepMinor = new EvaluatorInstruction('step');
EvaluatorInstruction.stepMajor = new EvaluatorInstruction('step');
EvaluatorInstruction.stepStatement = new EvaluatorInstruction('step');
EvaluatorInstruction.waitForFramePop = new EvaluatorInstruction('waitForFramePop');
EvaluatorInstruction.framePushed = new EvaluatorInstruction('framePushed');

EvaluatorInstruction.eventLoopBodyStart = new EvaluatorInstruction('event').mark({event: 'loopBodyStart'});
module.exports = EvaluatorInstruction;

},{}],11:[function(require,module,exports){
'use strict';

function *sortValArray(arr, comp) {
	if ( arr.length < 2 ) return arr;
	let mid = Math.floor(arr.length / 2);
	let left = yield * sortValArray(arr.slice(0,mid), comp);
	let right = yield * sortValArray(arr.slice(mid, arr.length), comp);
	return yield * mergeValArray(left, right, comp);
}

function *mergeValArray(l, r, comp) {
	var result = [];
	while ( l.length && r.length ) {
		if ( yield * comp(l[0], r[0]) ) result.push(l.shift());
		else result.push(r.shift());
	}

	while (l.length) result.push(l.shift());
	while (r.length) result.push(r.shift());
	return result;
}

class GenDash {
	static *identify(value) {
		return value;
	}


	static *map(what, fx) {
		fx = fx || GenDash.identify;
		var out = new Array(what.length);
		for ( let i = 0; i < what.length; ++i ) {
			out[i] = yield * fx(what[i], i, what);
		}
		return out;
	}

	static *each(what, fx) {
		if ( what == null ) return what;
		for ( let i = 0; i < what.length; ++i ) {
			if ( false === (yield * fx(what[i], i, what)) ) break;
		}
		return what;
	}

	static *noop() { }

	static *sort(what, comp) {
		comp = comp || function *(left, right) { return left < right; };
		return yield * sortValArray(what, comp);
	}

	static *values(what) {
		var out = [];
		for ( let o in what ) {
			if ( !Object.hasOwnProperty(o) ) continue;
			out.push(what[o]);
		}
		return out;
	}

	static *keys(what) {
		var out = [];
		for ( let o in what ) {
			if ( !Object.hasOwnProperty(o) ) continue;
			out.push(o);
		}
		return out;
	}

	static *identity(value) {
		return value;
	}

	static syncGenHelper(gen) {
		var val = gen.next();
		if ( !val.done ) {
			console.log('This code path uses a helper, but the actual method yielded...');
			throw new Error('This code path uses a helper, but the actual method yielded...');
		}
		return val.value;
	}
}

module.exports = GenDash;

},{}],12:[function(require,module,exports){
'use strict';

const Scope = require('./Scope');
const Value = require('./Value');
const esprima = require('esprima');
const CompletionRecord = require('./CompletionRecord');
const ObjectValue = require('./values/ObjectValue');
const PrimitiveValue = require('./values/PrimitiveValue.js');
const StringValue = require('./values/StringValue');
const LinkValue = require('./values/LinkValue');
const SmartLinkValue = require('./values/SmartLinkValue');
const BridgeValue = require('./values/BridgeValue');
const ASTPreprocessor = require('./ASTPreprocessor');
const EasyNativeFunction = require('./values/EasyNativeFunction');
const PropertyDescriptor = require('./values/PropertyDescriptor');
const EvaluatorInstruction = require('./EvaluatorInstruction');

const ObjectPrototype = require('./stdlib/ObjectPrototype');
const FunctionPrototype = require('./stdlib/FunctionPrototype');
const ObjectClass = require('./stdlib/Object');
const FunctionClass = require('./stdlib/Function');
const NumberPrototype = require('./stdlib/NumberPrototype');

const StringPrototype = require('./stdlib/StringPrototype');

const ArrayPrototype = require('./stdlib/ArrayPrototype');
const ArrayClass = require('./stdlib/Array');
const StringClass = require('./stdlib/String');
const NumberClass = require('./stdlib/Number');


const BooleanPrototype = require('./stdlib/BooleanPrototype');
const BooleanClass = require('./stdlib/Boolean');
const RegExpPrototype = require('./stdlib/RegExpPrototype');
const RegExpClass = require('./stdlib/RegExp');
const EsperClass = require('./stdlib/Esper');
const ErrorPrototype = require('./stdlib/ErrorPrototype');
const ErrorClass = require('./stdlib/Error');

const AssertClass = require('./stdlib/Assert');
const MathClass = require('./stdlib/Math.js');
const ConsoleClass = require('./stdlib/Console');
const JSONClass = require('./stdlib/JSON');

class EvalFunction extends ObjectValue {

	constructor(realm) {
		super(realm);
		this.setPrototype(realm.FunctionPrototype);
	}

	*call(thiz, args, scope) {
		let cv = Value.undef;
		if ( args.length > 0 ) cv = args[0];
		if ( !(cv instanceof StringValue) ) return cv;
		let code = yield * cv.toStringNative();
		let ast;
		try {
			let oast = scope.realm.parser(code, {loc: true});
			ast = ASTPreprocessor.process(oast);
		} catch ( e ) {
			var eo;

			if ( e.description == 'Invalid left-hand side in assignment' ) eo = new ReferenceError(e.description, e.fileName, e.lineNumber);
			else eo = new SyntaxError(e.description, e.fileName, e.lineNumber);

			if ( e.stack ) eo.stack = e.stack;
			return new CompletionRecord(CompletionRecord.THROW, Value.fromNative(eo, scope.realm));
		}

		//TODO: Dont run in the parent scope if we are called indirectly
		let bak = yield EvaluatorInstruction.branch('eval', ast, scope.parent ? scope.parent : scope);
		//console.log("EVALED: ", bak);
		return bak;
	}
}


/**
 * Represents a javascript execution environment including
 * it's scopes and standard libraries.
 */
class Realm {
	print() {
		console.log.apply(console, arguments);
	}

	parser(code, options) {
		options = options || {};
		let opts = {loc: true, range: true};
		if ( options.inFunctionBody ) {
			opts.tolerant = true;
			opts.allowReturnOutsideFunction = true;
		}

		let ast = esprima.parse(code, opts);
		let errors = [];
		if ( ast.errors ) {
			errors = ast.errors.filter((x) => {
				if ( options.inFunctionBody && x.message === 'Illegal return statement' ) return false;
			});
		}
		delete ast.errors;
		if ( errors.length > 0 ) throw errors[0];
		return ast;
	}

	constructor(options) {
		this.options = options || {};
		/** @type {Value} */
		this.ObjectPrototype =  new ObjectPrototype(this);
		this.FunctionPrototype = new FunctionPrototype(this);
		this.Object = new ObjectClass(this);
		this.ObjectPrototype._init(this);
		this.FunctionPrototype._init(this);
		this.Object.setPrototype(this.ObjectPrototype);
		this.FunctionPrototype.setPrototype(this.ObjectPrototype);

		//TODO: Do this when we can make the property non enumerable.
		this.ObjectPrototype.rawSetProperty('constructor', new PropertyDescriptor(this.Object, false));

		this.Function = new FunctionClass(this);

		/** @type {Math} */
		this.Math = new MathClass(this);

		/** @type {NumberPrototype} */
		this.NumberPrototype = new NumberPrototype(this);

		/** @type {StringPrototype} */
		this.StringPrototype = new StringPrototype(this);

		this.ArrayPrototype = new ArrayPrototype(this);
		this.Array = new ArrayClass(this);
		this.String = new StringClass(this);
		this.Number = new NumberClass(this);


		this.BooleanPrototype = new BooleanPrototype(this);
		this.Boolean = new BooleanClass(this);

		this.RegExpPrototype = new RegExpPrototype(this);
		this.RegExp = new RegExpClass(this);

		this.Esper = new EsperClass(this);
		this.ErrorPrototype = new ErrorPrototype(this);
		this.Error = new ErrorClass(this);
		this.ErrorPrototype.rawSetProperty('constructor', new PropertyDescriptor(this.Error, false));

		/** @type {Value} */
		this.console = new ConsoleClass(this);

		let scope = new Scope(this);
		scope.object.clazz = 'global';
		scope.strict = options.strict || false;
		let that = this;
		var printer = EasyNativeFunction.makeForNative(this, function() {
			that.print.apply(that, arguments);
		});
		scope.set('print', printer);
		scope.set('log', printer);

		scope.addConst('NaN', this.fromNative(NaN));
		scope.addConst('Infinity', this.fromNative(Infinity));

		scope.set('console', this.console);
		scope.set('JSON', new JSONClass(this));

		if ( options.exposeEsperGlobal ) {
			scope.set('Esper', this.Esper);
		}

		scope.set('Math', this.Math);

		scope.set('Number', this.Number);
		scope.set('Boolean', this.Boolean);
		scope.set('Object', this.Object);
		scope.set('Function', this.Function);
		scope.set('Array', this.Array);
		scope.set('String', this.String);
		scope.set('RegExp', this.RegExp);

		scope.set('Error', this.Error);
		scope.set('TypeError', this.TypeError = this.Error.makeErrorType(TypeError));
		scope.set('SyntaxError', this.SyntaxError = this.Error.makeErrorType(SyntaxError));
		scope.set('ReferenceError', this.ReferenceError = this.Error.makeErrorType(ReferenceError));
		scope.set('RangeError', this.RangeError = this.Error.makeErrorType(RangeError));
		scope.set('EvalError', this.EvalError = this.Error.makeErrorType(EvalError));
		scope.set('URIError', this.URIError = this.Error.makeErrorType(URIError));


		scope.set('parseInt', EasyNativeFunction.makeForNative(this, parseInt));
		scope.set('parseFloat', EasyNativeFunction.makeForNative(this, parseFloat));
		scope.set('isNaN', EasyNativeFunction.makeForNative(this, isNaN));
		scope.set('isFinite', EasyNativeFunction.makeForNative(this, isFinite));

		//scope.set('Date', this.fromNative(Date));
		scope.set('eval', new EvalFunction(this));
		scope.set('assert', new AssertClass(this));

		scope.thiz = scope.object;
		this.importCache = new WeakMap();
		/** @type {Scope} */
		this.globalScope = scope;
	}

	lookupWellKnown(v) {
		if ( v === Object ) return this.Object;
		if ( v === Object.prototype ) return this.ObjectPrototype;
		if ( v === Function ) return this.Function;
		if ( v === Function.prototype ) return this.FunctionPrototype;
		if ( v === Math ) return this.Math;
		if ( v === Number ) return this.Number;
		if ( v === Number.prototype ) return this.NumberPrototype;
		if ( v === String ) return this.String;
		if ( v === String.prototype ) return this.StringPrototype;
		if ( v === Array ) return this.Array;
		if ( v === Array.prototype ) return this.ArrayPrototype;
		if ( v === RegExp ) return this.RegExp;
		if ( v === RegExp.prototype ) return this.RegExpPrototype;
		if ( typeof console !== 'undefined' && v === console ) return this.console;

	}

	valueFromNative(native) {
		return Value.fromNative(native, this);
	}

	fromNative(native) {
		return Value.fromNative(native, this);
	}

	import(native, modeHint) {
		if ( native instanceof Value ) return native;
		if ( native === undefined ) return Value.undef;

		let prim = Value.fromPrimativeNative(native);
		if ( prim ) return prim;

		//if ( this.importCache.has(native) ) {
		//	return this.importCache.get(native);
		//}

		if ( Value.hasBookmark(native) ) {
			return Value.getBookmark(native);
		}

		let result;
		switch ( modeHint || this.options.foreignObjectMode ) {
			case 'bridge':
				result = BridgeValue.make(native, this);
				break;
			case 'smart':
				result = SmartLinkValue.make(native, this);
				break;
			case 'link':
			default:
				result = LinkValue.make(native, this);
				break;
		}

		//this.importCache.set(native, result);
		return result;
	}
}

Realm.prototype.makeForForeignObject = Realm.prototype.import;

module.exports = Realm;

},{"./ASTPreprocessor":5,"./CompletionRecord":6,"./EvaluatorInstruction":10,"./Scope":13,"./Value":14,"./stdlib/Array":15,"./stdlib/ArrayPrototype":16,"./stdlib/Assert":17,"./stdlib/Boolean":18,"./stdlib/BooleanPrototype":19,"./stdlib/Console":20,"./stdlib/Error":21,"./stdlib/ErrorPrototype":22,"./stdlib/Esper":23,"./stdlib/Function":24,"./stdlib/FunctionPrototype":25,"./stdlib/JSON":26,"./stdlib/Math.js":27,"./stdlib/Number":28,"./stdlib/NumberPrototype":29,"./stdlib/Object":30,"./stdlib/ObjectPrototype":31,"./stdlib/RegExp":32,"./stdlib/RegExpPrototype":33,"./stdlib/String":34,"./stdlib/StringPrototype":35,"./values/BridgeValue":37,"./values/EasyNativeFunction":39,"./values/LinkValue":44,"./values/ObjectValue":47,"./values/PrimitiveValue.js":48,"./values/PropertyDescriptor":49,"./values/SmartLinkValue":51,"./values/StringValue":52,"esprima":54}],13:[function(require,module,exports){
'use strict';

const PropertyDescriptor = require('./values/PropertyDescriptor');

const Value = require('./Value');
const ObjectValue = require('./values/ObjectValue');

class Scope {
	constructor(realm) {
		this.parent = null;
		this.object = new ObjectValue(realm);
		this.strict = false;
		this.realm = realm;
		this.global = this;
		this.writeTo = this.object;
	}

	/**
	 * @param {string} name - Identifier to retreive
	 * @returns {Value}
	 */
	get(name) {
		//Fast property access in the common case.
		let prop = this.object.properties[name];
		if ( !prop ) return Value.undef;
		if ( !prop.getter ) return prop.value;
		return this.object.getImmediate(name);
	}

	ref(name) {
		var vhar = this.object.properties[name];
		if (!vhar) return undefined;
		var that = this;
		var o = {
			setValue: vhar.setValue.bind(vhar, this),
			getValue: vhar.getValue.bind(vhar, this),
			isVariable: true
		};
		return o;
	}

	add(name, value) {
		this.writeTo.setImmediate(name, value);
	}

	addConst(name, value) {
		this.set(name, value);
		this.writeTo.properties[name].writable = false;
		this.writeTo.properties[name].configurable = false;
	}

	/**
	 * Sets an identifier in the scope to some value.
	 *
	 * @param {string} name - Identifier to set
	 * @param {Value} value - Value to set
	 */
	set(name, value) {
		this.writeTo.setImmediate(name, value);
	}

	has(name) {
		return this.object.has(name);
	}

	/**
	 * Set the identifier in its nearest scope, or create a global.
	 * @param {string} name - Identifier to retreive
	 * @param {Value} value - New vaalue of variable
	 * @param {Scope} s - Code scope to run setter functions in
	 */
	put(name, value, s) {
		let variable = this.object.properties[name];
		if ( variable ) {
			return variable.setValue(this.object, value, s);
		}
		var v = new PropertyDescriptor(value, this);
		this.writeTo.properties[name] = v;
		return Value.undef.fastGen();
	}

	createChild() {
		let child = new Scope(this.realm);
		child.object.eraseAndSetPrototype(this.object);
		child.parent = this;
		child.strict = this.strict;
		child.global = this.global;
		child.realm = this.realm;
		return child;
	}

	fromNative(value) {
		return this.realm.fromNative(value);
	}

	getVariableNames() {
		let list = [];
		for ( var o in this.object.properties ) list.push(o);
		return list;
	}

}

module.exports = Scope;

},{"./Value":14,"./values/ObjectValue":47,"./values/PropertyDescriptor":49}],14:[function(require,module,exports){
'use strict';
/* @flow */

const CompletionRecord = require('./CompletionRecord');
const GenDash = require('./GenDash');

let undef, nil, tru, fals, nan, emptyString, zero, one, negone, negzero, smallIntValues;
let cache = new WeakMap();
let bookmarks = new WeakMap();
let ObjectValue, PrimitiveValue, StringValue, NumberValue, BridgeValue, Evaluator;



let serial = 0;
/**
 * Represents a value a variable could take.
 */
class Value {
	/**
	 * Convert a native javascript primative value to a Value
	 * @param {any} value - The value to convert
	 */
	static fromPrimativeNative(value) {
		if ( !value )  {
			if ( value === undefined ) return undef;
			if ( value === null ) return nil;
			if ( value === false ) return fals;
			if ( value === '' ) return emptyString;
		}

		if ( value === true ) return tru;

		if ( typeof value === 'number' ) {
			if ( value === 0 ) {
				return 1/value > 0 ? zero : negzero;
			}
			if ( value|0 === value ) {
				let snv = smallIntValues[value+1];
				if ( snv ) return snv;
			}
			return new NumberValue(value);
		}
		if ( typeof value === 'string' ) return new StringValue(value);
		if ( typeof value === 'boolean' ) return new PrimitiveValue(value);
	}

	static hasBookmark(native) { return bookmarks.has(native); }
	static getBookmark(native) { return bookmarks.get(native); }

	/**
	 * Convert a native javascript value to a Value
	 *
	 * @param {any} value - The value to convert
	 * @param {Realm} realm - The realm of the new value.
	 */
	static fromNative(value, realm) {
		if ( value instanceof Value ) return value;
		let prim = Value.fromPrimativeNative(value);
		if ( prim ) return prim;

		if ( value instanceof Error ) {
			if ( !realm ) throw new Error('We needed a realm, but we didnt have one.  We were sad :(');
			if ( value instanceof TypeError ) return realm.TypeError.makeFrom(value);
			if ( value instanceof ReferenceError ) return realm.ReferenceError.makeFrom(value);
			if ( value instanceof SyntaxError ) return realm.SyntaxError.makeFrom(value);
			else return realm.Error.makeFrom(value);
		}

		if ( Value.hasBookmark(value) ) {
			return Value.getBookmark(value);
		}

		throw new TypeError('Tried to load an unsafe native value into the interperter:' + typeof value + ' / ' + value);
		//TODO: Is this cache dangerous?
		if ( !cache.has(value) ) {
			let nue = new BridgeValue(realm, value);
			cache.set(value, nue);
			return nue;
		}
		return cache.get(value);
	}

	/**
	 * Holds a value representing `undefined`
	 *
	 * @returns {UndefinedValue}
	 */
	static get undef() {
		return undef;
	}

	/**
	 * Holds a value representing `null`
	 *
	 * @returns {NullValue}
	 */
	static get null() {
		return nil;
	}

	/**
	 * Holds a value representing `true`
	 *
	 * @returns {BooleanValue} true
	 */
	static get true() {
		return tru;
	}

	/**
	 * Holds a value representing `fasle`
	 *
	 * @returns {BooleanValue} false
	 */
	static get false() {
		return fals;
	}

	/**
	 * Holds a value representing `NaN`
	 *
	 * @returns {NumberValue} NaN
	 */
	static get nan() {
		return nan;
	}

	/**
	 * Holds a value representing `''`
	 *
	 * @returns {StringValue} ''
	 */
	static get emptyString() {
		return emptyString;
	}

	/**
	 * Holds a value representing `0`
	 *
	 * @returns {NumberValue} 0
	 */
	static get zero() { return zero; }

	static createNativeBookmark(v, realm) {
		var out;
		let thiz = this;
		if ( typeof v.call === 'function' ) {
			switch ( realm.options.bookmarkInvocationMode ) {
				case 'loop':

				out = function Bookmark() {
					let Evaluator = require('./Evaluator');
					let cthis = realm.makeForForeignObject(this);
					let c = v.call(cthis, [], realm.globalScope);
					let evalu = new Evaluator(realm, null, realm.globalScope);
					evalu.pushFrame({type: 'program', generator: c, scope: realm.globalScope});
					let gen = evalu.generator();
					let result;
					do {
						result = gen.next();
					} while ( !result.done );
					return result.value.toNative();
				};
				break;
				default:
				out = function Bookmark() { throw new Error('Atempted to invoke bookmark for ' + v.debugString); };
			}
		} else {
			out = {};
		}
		Object.defineProperties(out, {
			toString: {value: function() { return v.debugString; }, writable: true},
			inspect: {value: function() { return v.debugString; }, writable: true},
		});
		bookmarks.set(out, v);
		return out;
	}

	constructor() {
		this.serial = serial++;
	}


	/**
	 * Converts this value to a native javascript value.
	 *
	 * @abstract
	 * @returns {*}
	 */
	toNative() {
		throw new Error('Unimplemented: Value#toNative');
	}

	/**
	 * A string representation of this Value suitable for display when
	 * debugging.
	 * @abstract
	 * @returns {string}
	 */
	get debugString() {
		let native = this.toNative();
		return native ? native.toString() : '???';
	}

	inspect() { return this.debugString; }

	//TODO: Kill this
	fromNative(other, realm) {
		return Value.fromNative(other, realm);
	}

	/**
	 * Indexes the value to get the value of a property.
	 * i.e. `value[name]`
	 * @param {String} name
	 * @param {Realm} realm
	 * @abstract
	 * @returns {Value}
	 */
	*get(name, realm) {
		let err = "Can't access get " + name + ' of that type: ' + require('util').inspect(this);
		return CompletionRecord.makeTypeError(realm, err);
	}

	getImmediate(name) {
		return GenDash.syncGenHelper(this.get(name));
	}

	/**
	 * Computes the javascript expression `!value`
	 * @returns {Value}
	 */
	*not() {
		return !this.truthy ? Value.true : Value.false;
	}

	/**
	 * Computes the javascript expression `+value`
	 * @returns {Value}
	 */
	*unaryPlus() {
		return Value.fromNative(+(yield * this.toNumberValue()));
	}

	/**
	 * Computes the javascript expression `-value`
	 * @returns {Value}
	 */
	*unaryMinus() {
		return Value.fromNative(-(yield * this.toNumberValue()));
	}

	/**
	 * Computes the javascript expression `typeof value`
	 * @returns {Value}
	 */
	*typeOf() {
		return Value.fromNative(this.jsTypeName);
	}

	/**
	 * Computes the javascript expression `!(value == other)`
	 * @param {Value} other - The other value
	 * @param {Realm} realm - The realm to use when creating resuls.
	 * @returns {Value}
	 */
	*notEquals(other, realm) {
		var result = yield * this.doubleEquals(other, realm);
		return yield * result.not();
	}

	/**
	 * Computes the javascript expression `!(value === other)`
	 * @param {Value} other - The other value
	 * @param {Realm} realm - The realm to use when creating resuls.
	 * @returns {Value}
	 */
	*doubleNotEquals(other, realm) {
		var result = yield * this.tripleEquals(other, realm);
		return yield * result.not();
	}

	/**
	 * Computes the javascript expression `value === other`
	 * @param {Value} other - The other value
	 * @param {Realm} realm - The realm to use when creating resuls.
	 * @returns {Value}
	 */
	*tripleEquals(other, realm) {
		return other === this ? Value.true : Value.false;
	}

	*makeThisForNew(realm) {
		var nue = new ObjectValue(realm);
		var p = this.properties['prototype'];
		if ( p ) nue.setPrototype(p.value);
		return nue;
	}

	/**
	 * Computes the javascript expression `value > other`
	 * @param {Value} other - The other value
	 * @returns {Value}
	 */
	*gt(other) { return this.fromNative((yield * this.toNumberNative()) > (yield * other.toNumberNative())); }

	/**
	 * Computes the javascript expression `value < other`
	 * @param {Value} other - The other value
	 * @returns {Value}
	 */
	*lt(other) { return this.fromNative((yield * this.toNumberNative()) < (yield * other.toNumberNative())); }

	/**
	 * Computes the javascript expression `value >= other`
	 * @param {Value} other - The other value
	 * @returns {Value}
	 */
	*gte(other) { return this.fromNative((yield * this.toNumberNative()) >= (yield * other.toNumberNative())); }

	/**
	 * Computes the javascript expression `value <= other`
	 * @param {Value} other - The other value
	 * @returns {Value}
	 */
	*lte(other) { return this.fromNative((yield * this.toNumberNative()) <= (yield * other.toNumberNative())); }

	/**
	 * Computes the javascript expression `value - other`
	 * @param {Value} other - The other value
	 * @returns {Value}
	 */
	*subtract(other) { return this.fromNative((yield * this.toNumberNative()) - (yield * other.toNumberNative())); }

	/**
	 * Computes the javascript expression `value / other`
	 * @param {Value} other - The other value
	 * @returns {Value}
	 */
	*divide(other) { return this.fromNative((yield * this.toNumberNative()) / (yield * other.toNumberNative())); }

	/**
	 * Computes the javascript expression `value * other`
	 * @param {Value} other - The other value
	 * @returns {Value}
	 */
	*multiply(other) { return this.fromNative((yield * this.toNumberNative()) * (yield * other.toNumberNative())); }

	/**
	 * Computes the javascript expression `value % other`
	 * @param {Value} other - The other value
	 * @returns {Value}
	 */
	*mod(other) { return this.fromNative((yield * this.toNumberNative()) % (yield * other.toNumberNative())); }

	*bitNot() { return this.fromNative(~(yield * this.toNumberNative())); }

	*shiftLeft(other) { return this.fromNative((yield * this.toNumberNative()) << (yield * other.toNumberNative())); }
	*shiftRight(other) { return this.fromNative((yield * this.toNumberNative()) >> (yield * other.toNumberNative())); }
	*shiftRightZF(other) { return this.fromNative((yield * this.toNumberNative()) >>> (yield * other.toNumberNative())); }

	*bitAnd(other) { return this.fromNative((yield * this.toNumberNative()) & (yield * other.toNumberNative())); }
	*bitOr(other) { return this.fromNative((yield * this.toNumberNative()) | (yield * other.toNumberNative())); }
	*bitXor(other) { return this.fromNative((yield * this.toNumberNative()) ^ (yield * other.toNumberNative())); }

	/**
	 * Is the value is truthy, i.e. `!!value`
	 *
	 * @abstract
	 * @type {boolean}
	 */
	get truthy() {
		throw new Error('Unimplemented: Value#truthy');
	}

	get jsTypeName() {
		throw new Error('Unimplemented: Value#jsTypeName');
	}

	get specTypeName() {
		return this.jsTypeName;
	}

	get isCallable() {
		return ( typeof this.call === 'function' );
	}

	*toNumberValue() { throw new Error('Unimplemented: Value#toNumberValue'); }
	*toStringValue() { throw new Error('Unimplemented: Value#StringValue'); }
	*toStringNative() { return (yield * this.toStringValue()).native; }

	*toBooleanValue() { return this.truthy ? tru : fals; }

	*toUIntNative() {
		let nv = yield * this.toNumberValue();
		return Math.floor(nv.native);
	}

	*toIntNative() {
		let nv = yield * this.toNumberValue();
		return Math.floor(nv.native);
	}

	*toNumberNative() {
		let nv = yield * this.toNumberValue();
		return nv.native;
	}

	*toPrimitiveValue(preferedType) { throw new Error('Unimplemented: Value#toPrimitiveValue'); }
	*toPrimitiveNative(preferedType) { return (yield * this.toPrimitiveValue(preferedType)).native; }

	/**
	 * Quickly make a generator for this value
	 */
	*fastGen() { return this; }

}
module.exports = Value;

ObjectValue = require('./values/ObjectValue');
PrimitiveValue = require('./values/PrimitiveValue');
StringValue = require('./values/StringValue');
NumberValue = require('./values/NumberValue');
const UndefinedValue = require('./values/UndefinedValue');
const NullValue = require('./values/NullValue');

undef = new UndefinedValue();
nil = new NullValue();
tru = new PrimitiveValue(true);
fals = new PrimitiveValue(false);
nan = new PrimitiveValue(NaN);
emptyString = new StringValue('');

zero = new NumberValue(0);
negzero = new NumberValue(-0);
one = new NumberValue(1);
negone = new NumberValue(-1);
smallIntValues = [
	negone, zero,
	one, new NumberValue(2), new NumberValue(3), new NumberValue(4), new NumberValue(5),
	new NumberValue(6), new NumberValue(7), new NumberValue(8), new NumberValue(9)
	]

},{"./CompletionRecord":6,"./Evaluator":8,"./GenDash":11,"./values/NullValue":45,"./values/NumberValue":46,"./values/ObjectValue":47,"./values/PrimitiveValue":48,"./values/StringValue":52,"./values/UndefinedValue":53,"util":4}],15:[function(require,module,exports){
'use strict';

const EasyObjectValue = require('../values/EasyObjectValue');
const ObjectValue = require('../values/ObjectValue');
const ArrayValue = require('../values/ArrayValue');

class ArrayObject extends EasyObjectValue {
	*call(thiz, args, s) {
		if ( args.length === 1 && args[0].jsTypeName === 'number' ) {
			let result = ArrayValue.make([], s.realm);
			yield * result.set('length', args[0]);
			return result;
		}
		return ArrayValue.make(args, s.realm);
	}

	callPrototype(realm) { return realm.ArrayPrototype; }
	//objPrototype(realm) { return realm.Function; }



	static *isArray(thiz, args) {
		if ( args.length < 1 ) return EasyObjectValue.false;
		return EasyObjectValue.fromNative(args[0] instanceof ArrayValue);
	}
}

module.exports = ArrayObject;

},{"../values/ArrayValue":36,"../values/EasyObjectValue":40,"../values/ObjectValue":47}],16:[function(require,module,exports){
'use strict';

const EasyObjectValue = require('../values/EasyObjectValue');
const ObjectValue = require('../values/ObjectValue');
const ArrayValue = require('../values/ArrayValue');
const PrimitiveValue = require('../values/PrimitiveValue');
const CompletionRecord = require('../CompletionRecord');
const Value = require('../Value');
const _g = require('../GenDash');

function *forceArrayness(v) {
	if ( !v.has('length') ) {
		yield * v.set('length', Value.zero);
	}
}

function *getLength(v) {
	let m = yield * v.get('length');
	return yield * m.toUIntNative();
}

var defaultSeperator = Value.fromNative(',');

function *shiftRight(arr, start, amt) {
	amt = amt || 1;
	let len = yield * getLength(arr);
	for ( let i = len - 1; i >= start; --i ) {
		let cur = yield * arr.get(i);
		yield * arr.set(i + amt, cur);
	}
	yield * arr.set(start, Value.undef);
}

function *shiftLeft(arr, start, amt) {
	let len = yield * getLength(arr);
	for ( let i = start; i < len; ++i ) {
		let cur = yield * arr.get(i);
		yield * arr.set(i - amt, cur);
	}
	for ( let i = len - amt; i < len; ++i ) {
		delete arr.properties[i];
	}
	yield * arr.set('length', Value.fromNative(len - amt));
}


class ArrayPrototype extends EasyObjectValue {

	static *concat$e(thiz, args, s) {
		let fx = Value.undef;
		let targ = Value.undef;
		if ( args.length > 0 ) fx = args[0];
		if ( args.length > 1 ) targ = args[1];

		var out = [];
		var toCopy = [thiz].concat(args);

		let idx = 0;
		for ( let arr of toCopy ) {
			if ( arr instanceof PrimitiveValue ) {
				out[idx++] = arr;
			} else if ( !arr.has('length') ) {
				out[idx++] = arr;
			} else {
				let l = yield * getLength(arr);
				for ( let i = 0; i < l; ++i ) {
					let tv = yield * arr.get(i, s.realm);
					out[idx++] = tv;
				}
			}
		}

		return ArrayValue.make(out, s.realm);
	}

	static *filter$e(thiz, args, s) {
		let fx = Value.undef;
		let targ = Value.undef;
		if ( args.length > 0 ) fx = args[0];
		if ( args.length > 1 ) targ = args[1];

		let test = function *(v, i) {
			let res = yield * fx.call(targ, [v, Value.fromNative(i), thiz], s);
			return res.truthy;
		};

		var out = [];

		let l = yield * getLength(thiz);
		for ( let i = 0; i < l; ++i ) {
			let tv = yield * thiz.get(i);
			let tru = yield * test(tv, i);
			if ( tru ) out.push(tv);
		}

		return ArrayValue.make(out, s.realm);
	}

	static *every$e(thiz, args, s) {
		let fx = Value.undef;
		let targ = Value.undef;
		if ( args.length > 0 ) fx = args[0];
		if ( args.length > 1 ) targ = args[1];

		let test = function *(v, i) {
			let res = yield * fx.call(targ, [v, Value.fromNative(i), thiz], s);
			return res.truthy;
		};

		let l = yield * getLength(thiz);
		for ( let i = 0; i < l; ++i ) {
			let tv = yield * thiz.get(i);
			let tru = yield * test(tv, i);
			if ( !tru ) return Value.false;
		}

		return Value.true;
	}

	static *some$e(thiz, args, s) {
		let fx = Value.undef;
		let targ = Value.undef;
		if ( args.length > 0 ) fx = args[0];
		if ( args.length > 1 ) targ = args[1];

		let test = function *(v, i) {
			let res = yield * fx.call(targ, [v, Value.fromNative(i), thiz], s);
			return res.truthy;
		};

		let l = yield * getLength(thiz);
		for ( let i = 0; i < l; ++i ) {
			let tv = yield * thiz.get(i);
			let tru = yield * test(tv, i);
			if ( tru ) return Value.true;
		}

		return Value.false;
	}

	static *map$e(thiz, args, s) {
		let fx = Value.undef;
		let targ = Value.undef;
		if ( args.length > 0 ) fx = args[0];
		if ( !fx.isCallable ) return yield CompletionRecord.makeTypeError(s.realm, 'Arg2 not calalble.');

		if ( args.length > 1 ) targ = args[1];

		let l = yield * getLength(thiz);
		let out = new Array(l);
		for ( let i = 0; i < l; ++i ) {
			if ( !thiz.has(i) ) continue;
			let tv = yield * thiz.get(i);
			let v = yield yield * fx.call(targ, [tv, Value.fromNative(i), thiz], s);
			out[i] = v;
		}

		return ArrayValue.make(out, s.realm);
	}

	static *forEach$e(thiz, args, s) {
		let fx = Value.undef;
		let targ = Value.undef;
		if ( args.length > 0 ) fx = args[0];
		if ( args.length > 1 ) targ = args[1];

		let l = yield * getLength(thiz);
		for ( let i = 0; i < l; ++i ) {
			if ( !thiz.has(i) ) continue;
			let v = yield * thiz.get(i);
			let res = yield * fx.call(targ, [v, Value.fromNative(i), thiz], s);
		}

		return Value.undef;
	}

	static *indexOf$e(thiz, args) {
		//TODO: Call ToObject() on thisz;
		let l = yield * getLength(thiz);
		let match = args[0] || Value.undef;
		let start = args[1] || Value.zero;
		let startn = (yield * start.toNumberValue()).native;

		if ( isNaN(startn) ) startn = 0;
		else if ( startn < 0 ) startn = 0;

		if ( l > startn ) {
			for ( let i = startn; i < l; ++i ) {
				let v = yield * thiz.get(i);
				if ( !v ) v = Value.undef;
				if ( (yield * v.tripleEquals(match)).truthy ) return Value.fromNative(i);

			}
		}
		return Value.fromNative(-1);
	}

	static *lastIndexOf$e(thiz, args) {
		//TODO: Call ToObject() on thisz;
		let l = yield * getLength(thiz);
		let match = args[0] || Value.undef;
		let startn = l - 1;

		if ( args.length > 1 ) startn = yield * args[1].toIntNative();
		if ( isNaN(startn) ) startn = 0;
		if ( startn < 0 ) startn += l;
		if ( startn > l ) startn = l;
		if ( startn < 0 ) return Value.fromNative(-1);


		//if ( isNaN(startn) ) startn = l - 1;

		for ( let i = startn; i >= 0; --i ) {
			if ( !thiz.has(i) ) continue;
			let v = yield * thiz.get(i);
			if ( !v ) v = Value.undef;
			if ( (yield * v.tripleEquals(match)).truthy ) return Value.fromNative(i);

		}

		return Value.fromNative(-1);
	}

	static *join$e(thiz, args) {
		//TODO: Call ToObject() on thisz;
		let l = yield * getLength(thiz);
		let seperator = args[0] || defaultSeperator;
		let sepstr = (yield * seperator.toStringValue()).native;
		let strings = new Array(l);
		for ( let i = 0; i < l; ++i ) {
			if ( !thiz.has(i) ) continue;
			let v = yield * thiz.get(i);
			if ( !v ) strings[i] = '';
			else {
				if ( v.jsTypeName == 'undefined' ) {
					continue;
				}
				let sv = (yield * v.toStringValue());
				if ( sv ) strings[i] = sv.native;
				else strings[i] = undefined; //TODO: THROW HERE?
			}
		}
		return Value.fromNative(strings.join(sepstr));
	}

	static *push$e(thiz, args) {
		let l = yield * getLength(thiz);

		for ( let i = 0; i < args.length; ++i ) {
			yield * thiz.set(l + i, args[i]);
		}

		let nl = Value.fromNative(l + args.length);
		yield * thiz.set('length', nl);
		return Value.fromNative(l + args.length);
	}

	static *pop$e(thiz, args) {
		yield * forceArrayness(thiz);
		let l = yield * getLength(thiz);
		if ( l < 1 ) return Value.undef;
		let val = yield * thiz.get(l - 1);
		yield * thiz.set('length', Value.fromNative(l - 1));
		return val;
	}

	static *reverse$e(thiz, args, s) {
		let l = yield * getLength(thiz);
		for ( let i = 0; i < Math.floor(l / 2); ++i ) {
			let lv = yield * thiz.get(i);
			let rv = yield * thiz.get(l - i - 1);
			yield * thiz.set(l - i - 1, lv, s);
			yield * thiz.set(i, rv, s);
		}

		return thiz;
	}

	static *reduce$e(thiz, args, s) {
		let l = yield * getLength(thiz);
		let acc;
		let fx = args[0];

		if ( args.length < 1 || !fx.isCallable ) {
			return yield CompletionRecord.makeTypeError(s.realm, 'First argument to reduce must be a function.');
		}

		if ( args.length > 1 ) {
			acc = args[1];
		}

		for ( let i = 0; i < l; ++i ) {
			if ( !thiz.has(i) ) continue;
			let lv = yield * thiz.get(i);
			if ( !acc ) {
				acc = lv;
				continue;
			}
			acc = yield * fx.call(thiz, [acc, lv], s);
		}
		if ( !acc ) return yield CompletionRecord.makeTypeError(s.realm, 'Reduce an empty array with no initial value.');
		return acc;
	}

	//TODO: Factor some stuff out of reduce and reduce right into a common function.
	static *reduceRight$e(thiz, args, s) {
		let l = yield * getLength(thiz);
		let acc;
		let fx = args[0];

		if ( args.length < 1 || !fx.isCallable ) {
			return yield CompletionRecord.makeTypeError(s.realm, 'First argument to reduceRight must be a function.');
		}

		if ( args.length > 1 ) {
			acc = args[1];
		}

		for ( let i = l - 1; i >= 0; --i ) {
			if ( !thiz.has(i) ) continue;
			let lv = yield * thiz.get(i);
			if ( !acc ) {
				acc = lv;
				continue;
			}
			acc = yield * fx.call(thiz, [acc, lv], s);
		}

		if ( !acc ) return yield CompletionRecord.makeTypeError(s.realm, 'Reduce an empty array with no initial value.');
		return acc;
	}

	static *shift$e(thiz, args) {
		yield * forceArrayness(thiz);
		let l = yield * getLength(thiz);
		if ( l < 1 ) return Value.undef;

		let val = yield * thiz.get(0);
		yield * shiftLeft(thiz, 1, 1);
		return val;
	}

	static *slice$e(thiz, args, s) {
		//TODO: Call ToObject() on thisz;
		let length = yield * getLength(thiz);
		let result = [];

		let start = 0;
		let end = length;


		if ( args.length > 0 ) start = ( yield * args[0].toIntNative() );
		if ( args.length > 1 ) end = ( yield * args[1].toIntNative() );

		if ( start < 0 ) start = length + start;
		if ( end < 0 ) end = length + end;

		if ( end > length ) end = length;
		if ( start < 0 ) start = 0;


		for ( let i = start; i < end; ++i ) {
			result.push(yield * thiz.get('' + i ));
		}


		return ArrayValue.make(result, s.realm);
	}

	static *splice$e(thiz, args, s) {
		//TODO: Call ToObject() on thisz;


		let result = [];


		let deleteCount;
		let len = yield * getLength(thiz);
		let start = len;

		if ( isNaN(len) ) return thiz;

		if ( args.length > 0 ) start = yield * args[0].toIntNative();

		if ( start > len ) start = len;
		else if ( start < 0 ) start = len - start;

		if ( args.length > 1 ) deleteCount = yield * args[1].toIntNative();
		else deleteCount = len - start;

		if ( deleteCount > (len - start) ) deleteCount = len - start;
		if ( deleteCount < 0 ) deleteCount = 0;

		let deleted = [];
		let toAdd = args.slice(2);
		let delta = toAdd.length - deleteCount;

		for ( let i = start; i < start + deleteCount; ++i ) {
			deleted.push(yield * thiz.get(i));
		}

		if ( delta > 0 ) yield * shiftRight(thiz, start, delta);
		if ( delta < 0 ) yield * shiftLeft(thiz, start - delta, -delta);

		for ( let i = 0; i < toAdd.length; ++i ) {
			yield * thiz.set(start + i, toAdd[i]);
		}

		yield * thiz.set('length', Value.fromNative(len + delta));


		return ArrayValue.make(deleted, s.realm);
	}

	static *sort$e(thiz, args, s) {
		let length = yield * getLength(thiz);
		let vals = new Array(length);
		for ( let i = 0; i < length; ++i ) {
			vals[i] = yield * thiz.get(i);
		}

		let comp = function *(left, right) {
			let l = yield * left.toStringValue();
			if ( !l ) return false;
			let r = yield * right.toStringValue();
			if ( !r ) return true;
			return (yield * l.lt(r)).truthy;
		};

		if ( args.length > 0 ) {
			let fx = args[0];
			if ( !fx.isCallable ) return yield CompletionRecord.makeTypeError(s.realm, 'Arg2 not calalble.');
			comp = function *(left, right) {
				let res = yield * fx.call(Value.undef, [left, right], s);
				return ( yield * res.lt(Value.fromNative(0)) ).truthy;
			};
		}

		let nue = yield * _g.sort(vals, comp);

		for ( let i = 0; i < length; ++i ) {
			yield * thiz.set(i, nue[i]);
		}
		return thiz;
	}

	static *toString$e(thiz, args, s) {
		let joinfn = yield * thiz.get('join');
		if ( !joinfn || !joinfn.isCallable ) {
			let ots = yield * s.realm.ObjectPrototype.get('toString');
			return yield * ots.call(thiz, []);
		} else {
			return yield * joinfn.call(thiz, [defaultSeperator]);
		}

	}

	static *unshift$e(thiz, args, s) {
		let amt = args.length;
		let len = yield * getLength(thiz);
		if ( isNaN(len) ) len = 0;
		yield * shiftRight(thiz, 0, amt);
		for ( let i = 0; i < amt; ++i ) {
			yield * thiz.set(i, args[i]);
		}

		let nl = Value.fromNative(len + amt);
		yield * thiz.set('length', nl, s);
		return nl;
	}

}

ArrayPrototype.prototype.wellKnownName = '%ArrayPrototype%';

module.exports = ArrayPrototype;


},{"../CompletionRecord":6,"../GenDash":11,"../Value":14,"../values/ArrayValue":36,"../values/EasyObjectValue":40,"../values/ObjectValue":47,"../values/PrimitiveValue":48}],17:[function(require,module,exports){
'use strict';

const Value = require('../Value');
const CompletionRecord = require('../CompletionRecord');

const ObjectValue = require('../values/ObjectValue');

class AssertFunction extends ObjectValue {

	*rawCall(n, evalu, scope) {
		if ( n.arguments.length == 0 ) return Value.undef;
		let args = new Array(n.arguments.length);
		let why = '';
		let check = n.arguments[0];
		switch ( check.type ) {
			case 'BinaryExpression':
				let left = yield * evalu.branch(check.left, scope);
				let right = yield * evalu.branch(check.right, scope);
				args[0] = yield * evalu.doBinaryEvaluation(check.operator, left, right, scope);
				why = n.arguments[0].srcName + ' (' + left.debugString + ' ' + check.operator + ' ' + right.debugString + ')';
				break;
			default:
				why = (n.arguments[0].srcName || '???');
				args[0] = yield * evalu.branch(n.arguments[0], scope);
		}


		for ( let i = 1; i < args.length; ++i ) {
			args[i] = yield * evalu.branch(n.arguments[i], scope);
		}

		if ( args[0].truthy ) return Value.undef;
		if ( args.length > 1 ) why = yield * args[1].toStringNative();
		let err = scope.realm.Error.make(why, 'AssertionError');
		return new CompletionRecord(CompletionRecord.THROW, err);
	}

	*call(thiz, args, scope, ext) {
		let val = Value.undef;
		if ( args.length > 0 ) return Value.undef;
		if ( val.truthy ) return Value.undef;
		let reason = '';
		if ( args.length > 1 ) {
			reason = ( yield * args[1].toStringValue() ).toNative();
		} else if ( ext.callNode && ext.callNode.arguments[0] ) {
			reason = (ext.callNode.arguments[0].srcName || '???');
		}
		let err = scope.realm.Error.make(reason, 'AssertionError');
		return new CompletionRecord(CompletionRecord.THROW, err);
	}
}

module.exports = AssertFunction;

},{"../CompletionRecord":6,"../Value":14,"../values/ObjectValue":47}],18:[function(require,module,exports){
'use strict';

const Value = require('../Value');
const EasyObjectValue = require('../values/EasyObjectValue');


class Boolean extends EasyObjectValue {
	*call(thiz, args, scope, ext) {
		let asConstructor = ext && ext.asConstructor;
		if ( !asConstructor ) {
			if ( args.length < 1 ) return Value.false;
			return args[0].truthy ? Value.true : Value.false;
		}
		if ( args.length > 0 ) {
			let pv = args[0].truthy ? Value.true : Value.false;
			thiz.primativeValue = pv;
		} else {
			thiz.primativeValue = false;
		}
	}

	callPrototype(realm) { return realm.BooleanPrototype; }
	constructorFor(realm) { return realm.BooleanPrototype; }
}

module.exports = Boolean;

},{"../Value":14,"../values/EasyObjectValue":40}],19:[function(require,module,exports){
'use strict';

const EasyObjectValue = require('../values/EasyObjectValue');
const Value = require('../Value');

class BooleanPrototype extends EasyObjectValue {
	static *toString$e(thiz, argz) {
		if ( thiz.primativeValue.truthy ) return Value.fromNative('true');
		else return Value.fromNative('false');
	}
}

module.exports = BooleanPrototype;

},{"../Value":14,"../values/EasyObjectValue":40}],20:[function(require,module,exports){
'use strict';

const Value = require('../Value');
const CompletionRecord = require('../CompletionRecord');

const EasyObjectValue = require('../values/EasyObjectValue');

function *proxy(op, thiz, args, s) {
	let realm = s.realm;
	let printer = realm.print;
	let strings = new Array(args.length);
	for ( let i = 0; i < args.length; ++i ) {
		strings[i] = yield * args[i].toStringNative();
	}
	//console[op].apply(console, strings);
	printer.apply(realm, strings);
	return Value.undef;
}

class Console extends EasyObjectValue {
	static *log(thiz, argz, s) { return yield * proxy('log', thiz, argz, s); }
	static *info(thiz, argz, s) { return yield * proxy('info', thiz, argz, s); }
	static *warn(thiz, argz, s) { return yield * proxy('warn', thiz, argz, s); }
	static *error(thiz, argz, s) { return yield * proxy('error', thiz, argz, s); }
	static *trace(thiz, argz, s) { return yield * proxy('trace', thiz, argz, s); }
}

module.exports = Console;

},{"../CompletionRecord":6,"../Value":14,"../values/EasyObjectValue":40}],21:[function(require,module,exports){
'use strict';

const EasyObjectValue = require('../values/EasyObjectValue');
const ObjectValue = require('../values/ObjectValue');
const ArrayValue = require('../values/ArrayValue');
const PrimitiveValue = require('../values/PrimitiveValue');
const EmptyValue = require('../values/EmptyValue');
const ErrorValue = require('../values/ErrorValue');
const CompletionRecord = require('../CompletionRecord');
const PropertyDescriptor = require('../values/PropertyDescriptor');
const Value = require('../Value');



class ErrorObject extends EasyObjectValue {
	constructor(realm) {
		super(realm);
		this.realm = realm;
	}
	makeOne() {
		let nue = new ErrorValue(this.realm);
		let p = this.properties['prototype'];
		if ( p ) nue.setPrototype(p.value);
		return nue;
	}

	make(message, name) {
		let nue = this.makeOne();
		if ( message ) {
			nue.setImmediate('message', Value.fromNative(message));
			nue.properties['message'].enumerable = false;
			nue.createNativeAnalog().message = message;
		}

		if ( name ) {
			nue.setImmediate('name', Value.fromNative(name));
			nue.properties['name'].enumerable = false;
			nue.createNativeAnalog().name = name;
		}

		return nue;
	}

	makeFrom(err) {
		let nue = this.makeOne();
		if ( err.message ) nue.setImmediate('message', Value.fromNative(err.message));
		if ( err.name ) nue.setImmediate('name', Value.fromNative(err.name));
		err.native = err;
		return nue;
	}

	*makeThisForNew() {
		return this.makeOne();
	}

	*call(thiz, args, s, e) {

		if ( thiz instanceof EmptyValue ) {
			thiz = this.makeOne();
		}

		if ( args.length > 0 ) yield * thiz.set('message', args[0], s, {enumerable: false});
		if ( args.length > 1 ) yield * thiz.set('fileName', args[1], s, {enumerable: false});
		if ( args.length > 2 ) yield * thiz.set('lineNumber', args[2], s, {enumerable: false});

		return thiz;
	}

	makeErrorType(type) {
		let proto = new ObjectValue(this.realm);
		proto.setPrototype(this.realm.ErrorPrototype);
		proto.setImmediate('name', Value.fromNative(type.name));
		proto.properties.name.enumerable = false;
		proto.wellKnownName = `%${type.name}Prototype%`;
		proto.nativeClass = type;

		let obj = new ErrorObject(this.realm);
		obj.setPrototype(proto);
		obj.properties.prototype.value = proto;
		obj.wellKnownName = `%${type.name}%`;
		proto.rawSetProperty('constructor', new PropertyDescriptor(obj, false));
		return obj;

	}

	callPrototype(realm) { return realm.ErrorPrototype; }

}

ErrorObject.prototype.wellKnownName = '%Error%';

module.exports = ErrorObject;


},{"../CompletionRecord":6,"../Value":14,"../values/ArrayValue":36,"../values/EasyObjectValue":40,"../values/EmptyValue":41,"../values/ErrorValue":42,"../values/ObjectValue":47,"../values/PrimitiveValue":48,"../values/PropertyDescriptor":49}],22:[function(require,module,exports){
'use strict';

const EasyObjectValue = require('../values/EasyObjectValue');
const ObjectValue = require('../values/ObjectValue');
const ArrayValue = require('../values/ArrayValue');
const PrimitiveValue = require('../values/PrimitiveValue');
const CompletionRecord = require('../CompletionRecord');
const Value = require('../Value');




class ErrorPrototype extends EasyObjectValue {

	static get message() { return Value.emptyString; }
	static get name$() { return Value.fromNative('Error'); }

	static *toString(thiz, argz, s) {
		let name = yield * (yield * thiz.get('name')).toStringNative();
		let message = yield * (yield * thiz.get('message')).toStringNative();
		if ( name && message ) return Value.fromNative(`${name}: ${message}`);
		else if ( message ) return Value.fromNative(message);
		else return Value.fromNative(name);
	}

}

ErrorPrototype.prototype.wellKnownName = '%ErrorPrototype%';

module.exports = ErrorPrototype;


},{"../CompletionRecord":6,"../Value":14,"../values/ArrayValue":36,"../values/EasyObjectValue":40,"../values/ObjectValue":47,"../values/PrimitiveValue":48}],23:[function(require,module,exports){
'use strict';

const EasyObjectValue = require('../values/EasyObjectValue');
const EasyNativeFunction = require('../values/EasyNativeFunction');
const Value = require('../Value');


class EsperObject extends EasyObjectValue {
	static *dump$cew(thiz, args) {
		console.log('Esper#dump:', args);
		if ( typeof window !== 'undefined' ) window.dumped = args[0];
		return Value.undef;
	}

	static *str$cew(thiz, args) {
		var t = Value.undef;
		if ( args.length > 0 ) t = args[0];
		return this.fromNative(t.debugString);
	}

	static *stack$cew(thiz, args, scope, extra) {
		return Value.fromNative(extra.evaluator.buildStacktrace().join('\n'));
	}

	static *globals$cew(thiz, args, scope, extra) {
		return scope.global.object;
	}

	static *scope$cew(thiz, args, scope, extra) {
		return scope.object;
	}


}



module.exports = EsperObject;

},{"../Value":14,"../values/EasyNativeFunction":39,"../values/EasyObjectValue":40}],24:[function(require,module,exports){
'use strict';

const EasyObjectValue = require('../values/EasyObjectValue');
const ClosureValue = require('../values/ClosureValue');
const CompletionRecord = require('../CompletionRecord');
const ASTPreprocessor = require('../ASTPreprocessor');
const PropertyDescriptor = require('../values/PropertyDescriptor');

class FunctionObject extends EasyObjectValue {
	*call(thiz, args, scope) {
		let an = new Array(args.length - 1);
		for ( let i = 0; i < args.length - 1; ++i ) {
			an[i] = (yield * args[i].toStringValue()).toNative();
		}
		let code = 'function name(' + an.join(', ') + ') {\n' + args[args.length - 1].toNative().toString() + '\n}';
		let ast;
		try {
			let oast = scope.realm.parser(code, {loc: true});
			ast = ASTPreprocessor.process(oast);
		} catch ( e ) {
			return new CompletionRecord(CompletionRecord.THROW, e);
		}

		let fn = new ClosureValue(ast.body[0], scope.global);
		fn.boundScope = scope.global;
		return fn;
	}

	_init(realm) {
		super._init(realm);
		let cs = new PropertyDescriptor(this);
		cs.configurable = false;
		cs.enumerable = false;
		this.properties['constructor'] = cs;
	}

	callPrototype(realm) { return realm.FunctionPrototype; }
	get callLength() { return 1; }
	//objPrototype(realm) { return realm.Function; }
}

module.exports = FunctionObject;

},{"../ASTPreprocessor":5,"../CompletionRecord":6,"../values/ClosureValue":38,"../values/EasyObjectValue":40,"../values/PropertyDescriptor":49}],25:[function(require,module,exports){
'use strict';

const EasyObjectValue = require('../values/EasyObjectValue');
const ClosureValue = require('../values/ClosureValue');
const Value = require('../Value');
const ObjectValue = require('../values/ObjectValue');
const CompletionRecord = require('../CompletionRecord');
const PropertyDescriptor = require('../values/PropertyDescriptor');

class BoundFunction extends ObjectValue {
	constructor(func, realm) {
		super(realm);
		this.setPrototype(realm.FunctionPrototype);
		this.func = func;
		this.boundArgs = [];
	}

	*call(thiz, args, s, ext) {
		let tt = thiz;
		let asConstructor = ext && ext.asConstructor;

		if ( !asConstructor ) {
			tt = this.boundThis;
		}

		let rargs = [].concat(this.boundArgs, args);
		return yield * this.func.call(tt, rargs, s, ext);
	}


	*constructorOf(other, realm) {
		return yield * this.func.constructorOf(other, realm);
	}


	*makeThisForNew(realm) {
		return yield * this.func.makeThisForNew(realm);
	}

}

class FunctionPrototype extends EasyObjectValue {
	static get caller$cew() { return null; }
	static get length$ew() { return '?'; }
	static get name$ew() { return ''; }

	static *apply(thiz, args, s) {
		let vthis = args[0];
		let arga = [];
		if ( args.length > 1 ) {
			let arr = args[1];
			let length = yield * arr.get('length');
			length = (yield * length.toNumberValue()).toNative();
			for ( let i = 0; i < length; ++i ) {
				arga[i] = yield * arr.get(i);
			}
		}
		return yield * thiz.call(vthis, arga, s);
	}

	static *bind(thiz, args, s) {
		let bthis = s.realm.globalScope.object; //TODO: is this actually null in scrict mode?
		if ( args.length > 0 ) {
			if ( args[0].jsTypeName !== 'undefined') bthis = args[0];
		}
		var out = new BoundFunction(thiz, s.realm);
		if ( args.length > 1 ) out.boundArgs = args.slice(1);
		out.boundThis = bthis;

		if ( thiz.properties['length'] ) {
			let newlen = thiz.properties['length'].value.toNative() - out.boundArgs.length;
			out.properties['length'] = new PropertyDescriptor(this.fromNative(newlen));
		}
		return out;
	}

	static *call(thiz, args, s) {
		let vthis = Value.undef;
		if ( args.length > 0 ) vthis = args.shift();
		return yield * thiz.call(vthis, args, s);
	}
	static *toString(thiz, args, s) {
		if ( thiz instanceof ClosureValue ) {
			let astsrc = thiz.func.source();
			if ( astsrc ) return this.fromNative(astsrc);
			return this.fromNative('function() { [AST] }');
		} else if ( thiz instanceof BoundFunction ) {
			return this.fromNative('function() { [bound function] }');
		} else if ( thiz instanceof EasyObjectValue.EasyNativeFunction ) {
			return this.fromNative('function() { [native code] }');
		}
		return CompletionRecord.makeTypeError(s.realm, 'Function.prototype.toString is not generic');

	}

	*call(thiz, args, s) {
		return EasyObjectValue.undef;
	}

}

FunctionPrototype.prototype.wellKnownName = '%FunctionPrototype%';


module.exports = FunctionPrototype;

},{"../CompletionRecord":6,"../Value":14,"../values/ClosureValue":38,"../values/EasyObjectValue":40,"../values/ObjectValue":47,"../values/PropertyDescriptor":49}],26:[function(require,module,exports){
'use strict';

const Value = require('../Value');
const EasyObjectValue = require('../values/EasyObjectValue');
const ObjectValue = require('../values/ObjectValue');
const PrimitiveValue = require('../values/PrimitiveValue');
const ArrayValue = require('../values/ArrayValue');
const CompletionRecord = require('../CompletionRecord');

class JSONUtils {
	static *genJSONTokens(arr, o, map, str, strincr) {
		let str2 = str !== undefined ? str + strincr : undefined;

		if ( o instanceof PrimitiveValue ) {
			return arr.push(JSON.stringify(o.native));
		}


		if ( map.has(o) ) {
			return arr.push('[Circular]');
		}
		map.set(o, true);

		if ( o instanceof ArrayValue ) {
			arr.push('[');
			let length = yield * (yield * o.get('length')).toIntNative();
			for ( let i = 0; i < length; ++i ) {
				if ( i > 0 ) arr.push(',');
				if ( str !== undefined  ) arr.push('\n');
				let m = yield * o.get(i);
				if ( str !== undefined ) arr.push(str2);
				if ( m ) {
					if ( m.jsTypeName == 'undefined' ) arr.push('null');
					else yield * JSONUtils.genJSONTokens(arr, m, map, str2, strincr);
				}
			}
			if ( str !== undefined  ) arr.push('\n');
			if ( str !== undefined  ) arr.push(str);
			arr.push(']');
			return;
		}

		arr.push('{');

		let first = true;
		for ( let p of Object.keys(o.properties)) {
			let po = o.properties[p];
			if ( !po.enumerable ) continue;
			let v = yield * o.get(p);
			if ( v.jsTypeName === 'function' ) continue;

			if ( first ) first = false;
			else arr.push(',');
			if ( str !== undefined ) arr.push('\n', str2);



			arr.push(JSON.stringify(p), ':');
			if ( str !== undefined ) arr.push(' ');
			yield * JSONUtils.genJSONTokens(arr, v, map, str2, strincr);


		}
		if ( str !== undefined  ) arr.push('\n');
		arr.push('}');
	}
}

class JSONObject extends EasyObjectValue {
	static *parse(thiz, args, s) {
		let str = Value.emptyString;
		if ( args.length > 0 ) str = yield * args[0].toStringNative();
		try {
			var out = JSON.parse(str, (k, o) => {
				if ( o === undefined ) return Value.undef;
				if ( o === null ) return Value.null;

				let prim = Value.fromPrimativeNative(o);
				if ( prim ) return prim;


				if ( Array.isArray(o) ) {
					return ArrayValue.make(o, s.realm);
				}

				let v = new ObjectValue(s.realm);
				for ( var p in o ) {
					v.setImmediate(p, o[p]);
				}
				return v;
			});
			return out;
		} catch ( e ) {
			yield new CompletionRecord(CompletionRecord.THROW, Value.fromNative(e, s.realm));
		}
	}

	static *stringify(thiz, args, s) {
		let arr = [];
		let v = Value.undef;
		let replacer = null;
		let str;
		let strincr;

		if ( args.length > 0 ) v = args[0];
		if ( args.length > 1 ) replacer = args[1];
		if ( args.length > 2 ) {
			str = '';
			if ( args[2].jsTypeName === 'number' ) {
				let len = yield * args[2].toIntNative();
				strincr = new Array(1 + len).join(' ');
			} else {
				strincr = yield * args[2].toStringNative();
			}

		}
		if ( v.jsTypeName === 'undefined' ) return Value.undef;

		yield * JSONUtils.genJSONTokens(arr, v, new WeakMap(), str, strincr);
		return Value.fromNative(arr.join(''));
	}


}

module.exports = JSONObject;

},{"../CompletionRecord":6,"../Value":14,"../values/ArrayValue":36,"../values/EasyObjectValue":40,"../values/ObjectValue":47,"../values/PrimitiveValue":48}],27:[function(require,module,exports){
'use strict';

const EasyObjectValue = require('../values/EasyObjectValue');
const Value = require('../Value');

function makeNumber(num) {
	return 0 + num.toNative();
}

function wrapMathFunction(name) {
	let fn = Math[name];
	return function*(thiz, args, realm) {
		let length = args.length;
		let argz = new Array(length);
		for ( let i = 0; i < length; ++i ) {
			if ( i < args.length ) argz[i] = args[i].toNative();
			else argz[i] = undefined;
		}

		let result = fn.apply(Math, argz);
		return Value.fromPrimativeNative(result);
	};

}

class MathObject extends EasyObjectValue {


	static get E$cew() { return Math.E; }
	static get LN10$cew() { return Math.LN10; }
	static get LN2$cew() { return Math.LN2; }
	static get LOG10E$cew() { return Math.LOG10E; }
	static get LOG2E$cew() { return Math.LOG2E; }
	static get PI$cew() { return Math.PI; }
	static get SQRT1_2$cew() { return Math.SQRT1_2; }
	static get SQRT2$cew() { return Math.SQRT2; }
}

MathObject.sqrt = wrapMathFunction('sqrt');
MathObject.atanh = wrapMathFunction('atanh');
MathObject.log2 = wrapMathFunction('log2');
MathObject.asinh = wrapMathFunction('asinh');
MathObject.log = wrapMathFunction('log');
MathObject.trunc = wrapMathFunction('trunc');
MathObject.max = wrapMathFunction('max');
MathObject.log10 = wrapMathFunction('log10');
MathObject.atan2 = wrapMathFunction('atan2');
MathObject.round = wrapMathFunction('round');
MathObject.exp = wrapMathFunction('exp');
MathObject.tan = wrapMathFunction('tan');
MathObject.floor = wrapMathFunction('floor');
MathObject.sign = wrapMathFunction('sign');
MathObject.fround = wrapMathFunction('fround');
MathObject.sin = wrapMathFunction('sin');
MathObject.tanh = wrapMathFunction('tanh');
MathObject.expm1 = wrapMathFunction('expm1');
MathObject.cbrt = wrapMathFunction('cbrt');
MathObject.cos = wrapMathFunction('cos');
MathObject.abs = wrapMathFunction('abs');
MathObject.acosh = wrapMathFunction('acosh');
MathObject.asin = wrapMathFunction('asin');
MathObject.ceil = wrapMathFunction('ceil');
MathObject.atan = wrapMathFunction('atan');
MathObject.cosh = wrapMathFunction('cosh');
MathObject.random = wrapMathFunction('random');
MathObject.log1p = wrapMathFunction('log1p');
MathObject.imul = wrapMathFunction('imul');
MathObject.hypot = wrapMathFunction('hypot');
MathObject.pow = wrapMathFunction('pow');
MathObject.sinh = wrapMathFunction('sinh');
MathObject.acos = wrapMathFunction('acos');
MathObject.min = wrapMathFunction('min');
MathObject.max = wrapMathFunction('max');


MathObject.prototype.clazz = 'Math';

module.exports = MathObject;

},{"../Value":14,"../values/EasyObjectValue":40}],28:[function(require,module,exports){
'use strict';

const EasyObjectValue = require('../values/EasyObjectValue');
const CompletionRecord = require('../CompletionRecord');


class NumberObject extends EasyObjectValue {
	*call(thiz, args, scope, ext) {
		let asConstructor = ext && ext.asConstructor;
		if ( !asConstructor ) {
			if ( args.length < 1 ) return EasyObjectValue.zero;
			return yield * args[0].toNumberValue();
		}
		let pv = EasyObjectValue.zero;
		if ( args.length > 0 ) pv = yield * args[0].toNumberValue();
		thiz.primativeValue = pv;
	}

	callPrototype(realm) { return realm.NumberPrototype; }
	constructorFor(realm) { return realm.NumberPrototype; }

	static get MAX_VALUE$cew() { return Number.MAX_VALUE; }
	static get MIN_VALUE$cew() { return Number.MIN_VALUE; }
	static get POSITIVE_INFINITY$cew() { return Number.POSITIVE_INFINITY; }
	static get NEGATIVE_INFINITY$cew() { return Number.NEGATIVE_INFINITY; }
	static get NaN$cew() { return EasyObjectValue.nan; }

}

NumberObject.prototype.wellKnownName = '%Number%';
module.exports = NumberObject;


},{"../CompletionRecord":6,"../values/EasyObjectValue":40}],29:[function(require,module,exports){
'use strict';

const EasyObjectValue = require('../values/EasyObjectValue');


class NumberPrototype extends EasyObjectValue {

	static *valueOf(thiz) {
		if ( thiz.specTypeName === 'number' ) return thiz;
		if ( thiz.specTypeName === 'object' ) {
			let pv = thiz.primativeValue;
			if ( pv.specTypeName === 'number' ) return pv;
		}
		throw new TypeError('Couldnt get there.');
	}


	static *toExponential(thiz, argz) {
		let a;
		if ( argz.length > 0 ) {
			a = yield * argz[0].toNumberNative();
		}
		let num = yield * thiz.toNumberNative(thiz);
		return this.fromNative(num.toExponential(a));
	}

	static *toFixed(thiz, argz) {
		let a;
		if ( argz.length > 0 ) {
			a = yield * argz[0].toNumberNative();
		}
		let num = yield * thiz.toNumberNative(thiz);
		return this.fromNative(num.toFixed(a));
	}

	static *toPrecision(thiz, argz) {
		let a;
		if ( argz.length > 0 ) {
			a = yield * argz[0].toNumberNative();
		}
		let num = yield * thiz.toNumberNative(thiz);
		return this.fromNative(num.toPrecision(a));
	}

	static *toString(thiz, argz) {
		let a;
		if ( argz.length > 0 ) {
			a = yield * argz[0].toNumberNative();
		}
		let num = yield * thiz.toNumberNative(thiz);
		return this.fromNative(num.toString(a));
	}


}


NumberPrototype.prototype.wellKnownName = '%NumberPrototype%';
module.exports = NumberPrototype;

},{"../values/EasyObjectValue":40}],30:[function(require,module,exports){
'use strict';

const EasyObjectValue = require('../values/EasyObjectValue');
const ObjectValue = require('../values/ObjectValue');
const ArrayValue = require('../values/ArrayValue');
const CompletionRecord = require('../CompletionRecord');
const Value = require('../Value');
const PropertyDescriptor = require('../values/PropertyDescriptor');
const EmptyValue = require('../values/EmptyValue');

function *defObjectProperty(obj, name, desc, realm) {
	if ( name instanceof Value ) {
		name = (yield * name.toStringNative());
	}

	let value = yield * desc.get('value', realm);


	let v = new PropertyDescriptor(value);


	if ( desc.has('enumerable') ) {
		let enu = yield * desc.get('enumerable', realm);
		if ( !(enu instanceof EmptyValue) ) {
			v.enumerable = enu.truthy;
		}
	} else {
		v.enumerable = false;
	}

	if ( desc.has('writable') ) {
		let wri = yield * desc.get('writable', realm);
		if ( !(wri instanceof EmptyValue) ) {
			v.writable = wri.truthy;
		}
	} else {
		v.writable = false;
	}

	if ( desc.has('configurable') ) {
		let conf = yield * desc.get('configurable', realm);
		if ( !(conf instanceof EmptyValue) ) {
			v.writable = conf.truthy;
		}
	} else {
		v.writable = false;
	}


	if ( desc.has('get') ) {
		let get = yield * desc.get('get', realm);
		if ( !(get instanceof EmptyValue) ) {
			v.getter = get;
		}
	}

	if ( desc.has('set') ) {
		let set = yield * desc.get('set', realm);
		if ( !(set instanceof EmptyValue) ) {
			v.setter = set;
		}
	}

	obj.rawSetProperty(name, v);
	return true;
}

function *getDescriptor(target, name, realm) {
	if ( !Object.hasOwnProperty.call(target.properties, name) ) {
		return Value.undef;
	}

	let pdesc = target.properties[name];
	let out = new ObjectValue(realm);

	if ( pdesc.value  ) yield * out.set('value', pdesc.value);
	if ( pdesc.getter ) yield * out.set('get', pdesc.getter);
	if ( pdesc.setter ) yield * out.set('set', pdesc.setter);

	yield * out.set('writable', Value.fromNative(pdesc.writable));
	yield * out.set('enumerable', Value.fromNative(pdesc.enumerable));
	yield * out.set('configurable', Value.fromNative(pdesc.configurable));
	return out;
}

function *objOrThrow(i, realm) {
	let val = i ? i : Value.undef;

	if ( val instanceof EmptyValue ) {
		return yield CompletionRecord.makeTypeError(realm, 'Cannot convert undefined or null to object');
	}

	if ( !(val instanceof ObjectValue) ) {
		return yield CompletionRecord.makeTypeError(realm, 'Need an object');
	}
	return val;
}

class ObjectObject extends EasyObjectValue {
	*call(thiz, args, s, ext) {
		let asConstructor = ext && ext.asConstructor;
		if ( asConstructor ) {
			return new ObjectValue(s.realm);
		}
	}

	callPrototype(realm) { return realm.ObjectPrototype; }
	//objPrototype(realm) { return realm.Function; }

	static *create$e(thiz, args, s) {
		let v = new ObjectValue(s.realm);
		let p = Value.undef;
		if ( args.length > 0 ) {
			p = args[0];
		}

		if ( p.jsTypeName !== 'object' && p.jsTypeName !== 'function' ) {
			return yield CompletionRecord.makeTypeError(s.realm, 'Object prototype may only be an Object or null');
		}

		v.setPrototype(p);

		if ( args.length > 1 ) {
			let propsobj = args[1];
			for ( let p of propsobj.observableProperties(s.realm) ) {
				let strval = p.native;
				let podesc = yield * propsobj.get(strval, s.realm);
				yield * defObjectProperty(v, p, podesc, s.realm);
			}
		}
		return v;
	}

	static *defineProperty(thiz, args, s) {
		let target = yield * objOrThrow(args[0], s.realm);
		let name = yield * args[1].toStringNative();
		let desc = args[2];
		yield * defObjectProperty(target, name, desc, s.realm);
		return Value.true;
	}

	static *defineProperties(thiz, args, s) {

		let target = yield * objOrThrow(args[0], s.realm);
		//let props = yield * objOrThrow(args[1], s.realm);

		let propsobj = yield * objOrThrow(args[1], s.realm);

		for ( let p of propsobj.observableProperties(s.realm) ) {
			let strval = p.native;
			let podesc = yield * propsobj.get(strval, s.realm);
			yield * defObjectProperty(target, p, podesc, s.realm);
		}
		return Value.true;
	}

	static *seal$e(thiz, args, s) {
		let target = yield * objOrThrow(args[0], s.realm);

		target.extensable = false;
		for ( let p of Object.keys(target.properties) ) {
			target.properties[p].configurable = false;
		}
		return target;
	}

	static *isSealed(thiz, args, s) {
		let target = yield * objOrThrow(args[0], s.realm);
		if ( target.extensable ) return Value.false;
		for ( let p of Object.keys(target.properties) ) {
			let ps = target.properties[p];
			if ( ps.configurable ) return Value.false;
		}
		return Value.true;
	}

	static *freeze$e(thiz, args, s) {
		let target = yield * objOrThrow(args[0], s.realm);
		target.extensable = false;
		for ( let p in target.properties ) {
			if ( !Object.prototype.hasOwnProperty.call(target.properties, p) ) continue;
			target.properties[p].configurable = false;
			target.properties[p].writable = false;
		}
		return target;
	}

	static *isFrozen(thiz, args, s) {
		let target = yield * objOrThrow(args[0], s.realm);
		if ( target.extensable ) return Value.false;
		for ( let p of Object.keys(target.properties) ) {
			let ps = target.properties[p];
			if ( ps.configurable ) return Value.false;
			if ( ps.writable ) return Value.false;
		}
		return Value.true;
	}

	static *preventExtensions$e(thiz, args, s) {
		let target = yield * objOrThrow(args[0], s.realm);
		target.extensable = false;
		return target;
	}

	static *isExtensible$e(thiz, args, s) {
		let target = yield * objOrThrow(args[0], s.realm);
		return this.fromNative(target.extensable);
	}

	static *keys$e(thiz, args, s) {
		let target = yield * objOrThrow(args[0], s.realm);
		let result = [];
		for ( let p of Object.keys(target.properties) ) {
			if ( !target.properties[p].enumerable ) continue;
			result.push(p);
		}
		return ArrayValue.make(result, s.realm);
	}

	static *getOwnPropertyNames$e(thiz, args, s) {
		let target = yield * objOrThrow(args[0], s.realm);
		return ArrayValue.make(Object.getOwnPropertyNames(target.properties), s.realm);
	}

	static *getOwnPropertyDescriptor(thiz, args, s) {
		let target = yield * objOrThrow(args[0], s.realm);
		let name = yield * args[1].toStringNative();
		return yield * getDescriptor(target, name, s.realm);
	}

	static *getPrototypeOf(thiz, args, s) {
		let target = EasyObjectValue.undef;
		if ( args.length > 0 ) target = args[0];
		if ( !target.getPrototype ) return yield CompletionRecord.makeTypeError(s.realm, 'No prototype.');
		let proto = target.getPrototype(s.realm);
		if ( proto ) return proto;
		return EasyObjectValue.null;
	}

	toNativeCounterpart() { return Object; }
}

ObjectObject.prototype.wellKnownName = '%Object%';

module.exports = ObjectObject;

},{"../CompletionRecord":6,"../Value":14,"../values/ArrayValue":36,"../values/EasyObjectValue":40,"../values/EmptyValue":41,"../values/ObjectValue":47,"../values/PropertyDescriptor":49}],31:[function(require,module,exports){
'use strict';

const ObjectValue = require('../values/ObjectValue');
const EasyObjectValue = require('../values/EasyObjectValue');
const Value = require('../Value');
const NullValue = require('../values/NullValue');
const UndefinedValue = require('../values/UndefinedValue');

class ObjectPrototype extends EasyObjectValue {
	constructor(realm) {
		super(realm);
		this.setPrototype(null);
	}

	static *hasOwnProperty$e(thiz, args) {
		let name = yield * args[0].toStringNative();
		if ( !(thiz instanceof ObjectValue) ) return Value.false;
		else if ( thiz.hasOwnProperty(name) ) return Value.true;
		return Value.false;
	}


	static *isPrototypeOf$e(thiz, args, s) {
		if ( args.length < 1 ) return Value.false;
		let target = args[0]; //TODO: Call ToObject();
		if ( !target.getPrototype ) return yield CompletionRecord.makeTypeError(s.realm, 'No prototype.');
		let pt = target.getPrototype(s.realm);
		let checked = [pt];
		while ( pt ) {
			if ( pt === thiz ) return Value.true;
			pt = pt.getPrototype(s.realm);
			if ( checked.indexOf(pt) !== -1 ) break;
			checked.push(pt);
		}
		return Value.false;
	}

	static *propertyIsEnumerable$e(thiz, args) {
		let nam = yield * args[0].toStringNative();
		let pd = thiz.properties[nam];
		return this.fromNative(pd.enumerable);
	}
	static *toLocaleString$e(thiz, args) { return yield * ObjectPrototype.toString$e(thiz, args); }

	static *toString$e(thiz, args) {
		if ( thiz instanceof UndefinedValue ) return this.fromNative('[object Undefined]');
		if ( thiz instanceof NullValue ) return this.fromNative('[object Null]');
		return this.fromNative('[object ' + thiz.clazz + ']');
	}

	static *valueOf$e(thiz, args) {
		if ( thiz.specTypeName === 'object' ) return thiz;
		//TODO: Need to follow the ToObject() conversion
		return thiz;
	}

}
ObjectPrototype.prototype.wellKnownName = '%ObjectPrototype%';

module.exports = ObjectPrototype;

},{"../Value":14,"../values/EasyObjectValue":40,"../values/NullValue":45,"../values/ObjectValue":47,"../values/UndefinedValue":53}],32:[function(require,module,exports){
'use strict';

const Value = require('../Value');
const CompletionRecord = require('../CompletionRecord');

const EasyObjectValue = require('../values/EasyObjectValue');
const RegExpValue = require('../values/RegExpValue');


class RegExpObject extends EasyObjectValue {

	*call(thiz, args, s) {
		let pattern = '';
		let flags = '';

		if ( (args.length > 0) && (args[0] instanceof RegExpValue) ) {
			if ( args.length > 1 && args[1].truthy ) return yield CompletionRecord.makeTypeError(s.realm, 'Cannot supply flags when constructing one RegExp from another');
			return RegExpValue.make(new RegExp(args[0].regexp), s.realm);
		}

		if ( args.length > 0 && args[0].jsTypeName !== 'undefined' ) pattern = yield * args[0].toStringNative();
		if ( args.length > 1 && args[1].jsTypeName !== 'undefined' ) flags = yield * args[1].toStringNative();

		let rx;
		try {
			rx = new RegExp(pattern, flags);
		} catch ( ex ) {
			return yield new CompletionRecord(CompletionRecord.THROW, Value.fromNative(ex, s.realm));
		}

		return RegExpValue.make(rx, s.realm);
	}

	callPrototype(realm) { return realm.RegExpPrototype; }
	get callLength() { return 2; }
}

RegExpObject.prototype.wellKnownName = '%RegExp%';

module.exports = RegExpObject;

},{"../CompletionRecord":6,"../Value":14,"../values/EasyObjectValue":40,"../values/RegExpValue":50}],33:[function(require,module,exports){
'use strict';

const Value = require('../Value');
const ArrayValue = require('../values/ArrayValue');

const CompletionRecord = require('../CompletionRecord');

const EasyObjectValue = require('../values/EasyObjectValue');
const _g = require('../GenDash');

function *toRegexp(x, realm) {
	if ( !x.regexp ) {
		return yield CompletionRecord.makeTypeError(realm, 'Calling regex method on non regex.');
	}
	return x.regexp;
}

class RegExpProtoype extends EasyObjectValue {
	constructor(realm) {
		super(realm);
		this.regexp = new RegExp();
	}
	static *test(thiz, args, s) {
		var rx = yield * toRegexp(thiz, s.realm);
		var str = undefined;
		if ( args.length > 0 ) str = yield * args[0].toStringNative();
		return this.fromNative(rx.test(str));
	}

	static *exec(thiz, args, s) {
		var rx = yield * toRegexp(thiz, s.realm);
		let li = yield * thiz.get('lastIndex');
		li = yield * li.toIntNative();
		if ( li < 0 ) li = 0; //Work around incorrect V8 behavior.
		rx.lastIndex = li;
		var str = undefined;
		if ( args.length > 0 ) str = yield * args[0].toStringNative();

		var result = rx.exec(str);
		yield * thiz.set('lastIndex', Value.fromNative(rx.lastIndex));
		if ( result === null ) return Value.null;

		let wraped = yield * _g.map(result, function *(c) { return Value.fromNative(c, s.realm); });

		let out = ArrayValue.make(wraped, s.realm);
		yield * out.set('index', Value.fromNative(result.index));
		yield * out.set('input', Value.fromNative(result.input));
		return out;
	}

	static *compile(thiz, args, s) {
		yield * toRegexp(thiz, s.realm);
		let rv = yield * s.realm.RegExp.call(Value.null, args, s);
		let regexp = rv.regexp;
		thiz.regexp = regexp;
		yield * thiz.set('source', Value.fromNative(regexp.source));
		yield * thiz.set('global', Value.fromNative(regexp.global));
		yield * thiz.set('ignoreCase', Value.fromNative(regexp.ignoreCase));
		yield * thiz.set('multiline', Value.fromNative(regexp.multiline));
		yield * thiz.set('lastIndex', Value.zero);
		return Value.undef;
	}

	static get source$cw() { return Value.fromNative('(?:)'); }
	static get global$cw() { return Value.fromNative(false); }
	static get ignoreCase$cw() { return Value.fromNative(false); }
	static get multiline$cw() { return Value.fromNative(false); }

	static *toString(thiz, args, s) {
		var rx = yield * toRegexp(thiz, s.realm);
		return Value.fromNative(rx.toString());
	}


	static get lastIndex() { return Value.fromNative(0); }
}

RegExpProtoype.prototype.wellKnownName = '%RegExpProtoype%';
RegExpProtoype.prototype.clazz = 'RegExp';

module.exports = RegExpProtoype;

},{"../CompletionRecord":6,"../GenDash":11,"../Value":14,"../values/ArrayValue":36,"../values/EasyObjectValue":40}],34:[function(require,module,exports){
'use strict';

const EasyObjectValue = require('../values/EasyObjectValue');
const CompletionRecord = require('../CompletionRecord');
const PropertyDescriptor = require('../values/PropertyDescriptor');

class StringObject extends EasyObjectValue {
	*call(thiz, args, scope, ext) {
		let asConstructor = ext && ext.asConstructor;
		if ( !asConstructor ) {
			//Called as a function...
			return yield * args[0].toStringValue();
		}
		let len = 0;
		if ( args.length > 0 ) {
			let pv = yield * args[0].toStringValue();
			len = pv.native.length;
			thiz.primativeValue = pv;
		} else {
			thiz.primativeValue = EasyObjectValue.emptyString;
		}

		var plen = new PropertyDescriptor(scope.realm.fromNative(len));
		plen.enumerable = false;
		plen.configurable = false;
		plen.writable = false;
		thiz.rawSetProperty('length', plen);
		return thiz;
	}

	callPrototype(realm) { return realm.StringPrototype; }
	constructorFor(realm) { return realm.StringPrototype; }

	static *fromCharCode(thiz, args) {
		let argz = new Array(args.length);
		for ( let i = 0; i < args.length; ++i ) {
			argz[i] = (yield * args[i].toNumberValue()).toNative();
		}

		return this.fromNative(String.fromCharCode.apply(String, argz));
	}

}

module.exports = StringObject;

},{"../CompletionRecord":6,"../values/EasyObjectValue":40,"../values/PropertyDescriptor":49}],35:[function(require,module,exports){
'use strict';

const EasyObjectValue = require('../values/EasyObjectValue');
const CompletionRecord = require('../CompletionRecord');
const EmptyValue = require('../values/EmptyValue');
const ArrayValue = require('../values/ArrayValue');
const _g = require('../GenDash');

function wrapStringPrototype(name) {
	let fx = String.prototype[name];
	let genfx = function *(thiz, args, s) {
		if ( thiz instanceof EmptyValue ) {
			return yield CompletionRecord.makeTypeError(s.realm, 'called String function on null or undefined?');
		}
		let sv = yield * thiz.toStringValue(s.realm);
		var argz = new Array(args.length);
		for ( let i = 0; i < args.length; ++i ) {
			argz[i] = args[i].toNative();
		}

		let result = fx.apply(sv.toNative(), argz);

		if ( Array.isArray(result) ) {
			var vals = new Array(result.length);
			for ( let i = 0; i < vals.length; ++i ) {
				vals[i] = s.realm.fromNative(result[i]);
			}
			return ArrayValue.make(vals, s.realm);
		} else {
			let nv = s.realm.fromNative(result);
			return nv;
		}
	};
	genfx.esperLength = fx.length;
	return genfx;
}

class StringPrototype extends EasyObjectValue {
	static get length$cew() { return StringPrototype.fromNative(0); }

	static *valueOf(thiz) {
		if ( thiz.specTypeName === 'string' ) return thiz;
		if ( thiz.specTypeName === 'object' ) {
			let pv = thiz.primativeValue;
			if ( pv.specTypeName == 'string' ) return pv;
		}
		throw new TypeError('Couldnt get there.');
	}

	static *concat(thiz, args, realm) {
		let base = yield * thiz.toStringNative();
		let realArgs = yield * _g.map(args, function*(v) { return yield * v.toStringNative(); });
		let out = String.prototype.concat.apply(base, realArgs);
		return realm.fromNative(out);
	}

	static *toString(thiz) {
		return yield * StringPrototype.valueOf(thiz);
	}
}


StringPrototype.prototype.wellKnownName = '%StringProtoype%';
StringPrototype.prototype.clazz = 'String';

StringPrototype.charAt = wrapStringPrototype('charAt');
StringPrototype.charCodeAt = wrapStringPrototype('charCodeAt');
StringPrototype.substring = wrapStringPrototype('substring');
StringPrototype.substr = wrapStringPrototype('substr');
StringPrototype.split = wrapStringPrototype('split');
StringPrototype.slice = wrapStringPrototype('slice');
StringPrototype.lastIndexOf = wrapStringPrototype('lastIndexOf');
StringPrototype.indexOf = wrapStringPrototype('indexOf');
StringPrototype.search = wrapStringPrototype('search');
StringPrototype.trim = wrapStringPrototype('trim');
StringPrototype.toUpperCase = wrapStringPrototype('toUpperCase');
StringPrototype.toLocaleUpperCase = wrapStringPrototype('toLocaleUpperCase');
StringPrototype.toLowerCase = wrapStringPrototype('toLowerCase');
StringPrototype.toLocaleLowerCase = wrapStringPrototype('toLocaleLowerCase');
StringPrototype.localeCompare = wrapStringPrototype('localeCompare');


module.exports = StringPrototype;

},{"../CompletionRecord":6,"../GenDash":11,"../values/ArrayValue":36,"../values/EasyObjectValue":40,"../values/EmptyValue":41}],36:[function(require,module,exports){
'use strict';


const PrimitiveValue = require('./PrimitiveValue');
const ObjectValue = require('./ObjectValue');
const Value = require('../Value');
let NumberValue;


class ArrayValue extends ObjectValue {

	constructor(realm) {
		super(realm, realm.ArrayPrototype);
	}

	*get(name, realm) {
		return yield * super.get(name, realm);
	}

	adjustLength(name) {
		if ( !isNaN(parseInt(name)) ) {
			let length = this.properties.length.value.native;
			if ( name >= length ) {
				this.properties.length.value = Value.fromNative(name + 1);
			}
		}
	}

	set(name, v) {
		this.adjustLength(name);
		return super.set(name, v);
	}

	setImmediate(name, v) {
		this.adjustLength(name);
		return super.setImmediate(name, v);
	}


	toNative() {
		let out = new Array();

		for ( let i of Object.keys(this.properties)) {
			let po = this.properties[i];
			if ( po && po.value ) out[i] = po.value.toNative();
		}
		return out;
	}

	static make(vals, realm) {

		let av = new ArrayValue(realm);

		av.setImmediate('length', Value.fromNative(0));
		av.properties.length.enumerable = false;

		for ( let i = 0; i < vals.length; ++i ) {
			let v = vals[i];
			if ( !(v instanceof Value) ) v = realm.fromNative(v);
			av.setImmediate(i, v);
		}
		return av;
	}

	get debugString() {
		if ( !this.properties.length ) return super.debugString;
		let length = this.properties.length.value.native;

		let loop = Math.min(length, 20);
		let r = new Array(loop);
		for ( let i = 0; i < loop; ++i ) {
			let po = this.properties[i];
			if ( po && po.value ) r[i] = po.value.debugString;
			else r[i] = '';
		}
		return '[' + r.join(', ') + ( loop < length ? '...' : '' ) + ']';
	}
}

ArrayValue.prototype.clazz = 'Array';

module.exports = ArrayValue;

NumberValue = require('./NumberValue');

},{"../Value":14,"./NumberValue":46,"./ObjectValue":47,"./PrimitiveValue":48}],37:[function(require,module,exports){
'use strict';
/* @flow */

const Value = require('../Value');
const CompletionRecord = require('../CompletionRecord');
/**
 * Represents a value that maps directly to an untrusted local value.
 */
class BridgeValue extends Value {

	constructor(value) {
		super();
		this.native = value;
	}

	makeBridge(value) {
		return BridgeValue.make(value);
	}

	static make(native) {
		if ( native === undefined ) return Value.undef;
		let prim = Value.fromPrimativeNative(native);
		if ( prim ) return prim;

		if ( Value.hasBookmark(native) ) {
			return Value.getBookmark(native);
		}

		return new BridgeValue(native);
	}

	ref(name) {
		let that = this;
		let out = Object.create(null);
		let str = (value) => that.native[name] = value.toNative();
		out.getValue = function *() { return that.native[name]; };
		out.setValue = function *(to) { return str(to); };

		return out;
	}

	toNative() {
		return this.native;
	}

	*asString() {
		return this.native.toString();
	}

	*doubleEquals(other) { return this.makeBridge(this.native == other.toNative()); }
	*tripleEquals(other) { return this.makeBridge(this.native === other.toNative()); }

	*add(other) { return this.makeBridge(this.native + other.toNative()); }
	*subtract(other) { return this.makeBridge(this.native - other.toNative()); }
	*multiply(other) { return this.makeBridge(this.native * other.toNative()); }
	*divide(other) { return this.makeBridge(this.native / other.toNative()); }
	*mod(other) { return this.makeBridge(this.native % other.toNative()); }

	*shiftLeft(other) { return this.makeBridge(this.native << other.toNative()); }
	*shiftRight(other) { return this.makeBridge(this.native >> other.toNative()); }
	*shiftRightZF(other) { return this.makeBridge(this.native >>> other.toNative()); }

	*bitAnd(other) { return this.makeBridge(this.native & other.toNative()); }
	*bitOr(other) { return this.makeBridge(this.native | other.toNative()); }
	*bitXor(other) { return this.makeBridge(this.native ^ other.toNative()); }

	*gt(other) { return this.makeBridge(this.native > other.toNative()); }
	*lt(other) { return this.makeBridge(this.native < other.toNative()); }
	*gte(other) { return this.makeBridge(this.native >= other.toNative()); }
	*lte(other) { return this.makeBridge(this.native <= other.toNative()); }

	*inOperator(other) { return this.makeBridge(this.native in other.toNative()); }
	*instanceOf(other) { return this.makeBridge(this.native instanceof other.toNative()); }

	*unaryPlus() { return this.makeBridge(+this.native); }
	*unaryMinus() { return this.makeBridge(-this.native); }
	*not() { return this.makeBridge(!this.native); }



	*get(name) {
		return this.makeBridge(this.native[name]);
	}

	*set(name, value) {
		this.native[name] = value.toNative();
	}

	*observableProperties(realm) {
		for ( let p in this.native ) {
			yield this.makeBridge(p);
		}
		return;
	}

	/**
	 *
	 * @param {Value} thiz
	 * @param {Value[]} args
	 */
	*call(thiz, args) {
		let realArgs = new Array(args.length);
		for ( let i = 0; i < args.length; ++i ) {
			realArgs[i] = args[i].toNative();
		}
		try {
			let result = this.native.apply(thiz ? thiz.toNative() : undefined, realArgs);
			return this.makeBridge(result);
		} catch ( e ) {
			let result = this.makeBridge(e);
			return new CompletionRecord(CompletionRecord.THROW, result);
		}

	}

	*makeThisForNew() {
		return this.makeBridge(Object.create(this.native.prototype));
	}

	get debugString() {
		return '[Bridge: ' + this.native + ']';
	}

	get truthy() {
		return !!this.native;
	}

	get jsTypeName() {
		return typeof this.native;
	}
}

module.exports = BridgeValue;

},{"../CompletionRecord":6,"../Value":14}],38:[function(require,module,exports){
'use strict';
/* @flow */

const Value = require('../Value');
const PropertyDescriptor = require('./PropertyDescriptor');
const ObjectValue = require('./ObjectValue');
const EvaluatorInstruction = require('../EvaluatorInstruction');

/**
 * Represents a value that maps directly to an untrusted local value.
 */
class ClosureValue extends ObjectValue {

	/**
	 * @param {object} func - AST Node for function
	 * @param {Scope} scope - Functions up-values.
	 */
	constructor(func, scope) {
		let realm = scope.realm;
		super(realm, realm.FunctionPrototype);
		this.realm = scope.realm;
		this.func = func;
		this.scope = scope;
		this.returnLastValue = false;
		this.properties['prototype'] = new PropertyDescriptor(new ObjectValue(realm));
		this.properties['name'] = new PropertyDescriptor(this.fromNative(func.id ? func.id.name : undefined));
		this.properties['length'] = new PropertyDescriptor(this.fromNative(func.params.length));


	}

	toNative() {
		return Value.createNativeBookmark(this, this.realm);
	}

	get debugString() {
		if ( this.func && this.func.id ) return `[Function ${this.func.id.name}]`;
		return '[Function]';
	}

	get truthy() {
		return !true;
	}

	*doubleEquals(other) {
		return other === this ? Value.true : Value.false;
	}

	/**
	 *
	 * @param {Value} thiz
	 * @param {Value[]} args
	 * @param {Scope} scope
	 */
	*call(thiz, args, scope, extra) {
		//TODO: This way of scoping is entirelly wrong.
		if ( !scope ) scope = this.scope;
		let invokeScope;
		if ( this.boundScope ) {
			invokeScope = this.boundScope.createChild();
			invokeScope.writeTo = this.boundScope.object;
			invokeScope.thiz = this.thiz || /* thiz ||*/ this.boundScope.thiz;
		} else {
			invokeScope = scope.createChild();
			invokeScope.thiz = this.thiz || thiz;
		}

		if ( this.func.strict === true ) invokeScope.strict = true;

		let obj = this.scope.object;
		if ( this.func.upvars ) {
			for ( let n in this.func.upvars ) {
				//TODO: There should be a method that does this.
				invokeScope.object.rawSetProperty(n, obj.properties[n]);
			}
		}

		//Do Var Hoisting
		if ( this.func.vars ) {
			for ( let v in this.func.vars ) {
				invokeScope.add(v, Value.undef);
				invokeScope.object.properties[v].isVariable = true;
			}
		}

		if ( this.func.funcs ) {
			for ( let fn in this.func.funcs ) {
				let n = this.func.funcs[fn];
				let closure = new ClosureValue(n, scope);
				invokeScope.add(n.id.name, closure);
			}
		}

		let argn = Math.max(args.length, this.func.params.length);
		let argvars = new Array(argn);
		let argsObj = new ObjectValue(scope.realm);

		for ( let i = 0; i < argn; ++i ) {
			let vv = Value.undef;
			if ( i < args.length ) vv = args[i];

			let v = new PropertyDescriptor(vv);
			argvars[i] = v;

			if ( invokeScope.strict ) {
				yield * argsObj.set(i, vv);
			} else {
				argsObj.rawSetProperty(i, v);
			}
		}

		if ( !invokeScope.strict ) {
			yield * argsObj.set('callee', this);
		}

		yield * argsObj.set('length', this.fromNative(args.length));

		invokeScope.add('arguments', argsObj);

		for ( let i = 0; i < this.func.params.length; ++i ) {
			let name = this.func.params[i].name;
			if ( scope.strict ) {
				//Scope is strict, so we make a copy for the args variable
				invokeScope.add(name, i < args.length ? args[i] : Value.undef);
			} else {
				//Scope isnt strict, magic happens.
				invokeScope.object.rawSetProperty(name, argvars[i]);
			}
		}
		let opts = {returnLastValue: this.returnLastValue};
		if ( extra && extra.evaluator && extra.evaluator.debug ) {
			opts['profileName'] = extra.callNode.callee.srcName;
		}
		if ( this.func.nonUserCode ) {
			opts.yieldPower = -1;
		}
		var result = yield EvaluatorInstruction.branch('function', this.func.body, invokeScope, opts);
		return result;
	}

	get jsTypeName() { return 'function'; }
	get specTypeName() { return 'object'; }

}
ClosureValue.prototype.clazz = 'Function';

module.exports = ClosureValue;

},{"../EvaluatorInstruction":10,"../Value":14,"./ObjectValue":47,"./PropertyDescriptor":49}],39:[function(require,module,exports){
'use strict';
/* @flow */

const Value = require('../Value');
const ObjectValue = require('./ObjectValue');
const CompletionRecord = require('../CompletionRecord');

class EasyNativeFunction extends ObjectValue {
	constructor(realm) {
		super(realm, realm.FunctionPrototype);
	}

	static make(realm, fx, binding) {
		let out = new EasyNativeFunction(realm);
		out.fn = fx;
		out.binding = binding;
		return out;
	}

	static makeForNative(realm, fx) {
		let out = new EasyNativeFunction(realm);
		out.fn = function *(thiz, args) {
			let rargs = new Array(args.length);
			for ( let i = 0; i < args.length; ++i ) {
				rargs[i] = args[i].toNative();
			}
			let nt = thiz.toNative();
			let nr = fx.apply(nt, rargs);
			return Value.fromNative(nr);
		};
		return out;
	}

	*call(thiz, argz, scope, extra) {
		let profile = false;
		let start = 0;
		try {
			if ( extra && extra.evaluator && extra.evaluator.debug ) {
				profile = true;
				start = Date.now();
			}
			let s = scope ? scope.createChild() : scope;
			if ( s ) s.strict = true;
			let o = yield * this.fn.apply(this.binding, arguments, s, extra);
			if ( o instanceof CompletionRecord ) return o;
			if ( !(o instanceof Value) ) o = scope.realm.makeForForeignObject(o);
			if ( profile ) extra.evaluator.incrCtr('fxTime', extra.callNode.callee.srcName, Date.now() - start);
			return new CompletionRecord(CompletionRecord.NORMAL, o);

		} catch ( e ) {
			if ( profile ) extra.evaluator.incrCtr('fxTime', extra.callNode.callee.srcName, Date.now() - start);
			return new CompletionRecord(CompletionRecord.THROW, scope.realm.makeForForeignObject(e));
		}
	}

	*makeThisForNew(realm) {
		return yield CompletionRecord.makeTypeError(realm, 'function is not a constructor');
	}

	get debugString() {
		return 'function() { [Native Code] }';
	}
}
EasyNativeFunction.prototype.clazz = 'Function';

module.exports = EasyNativeFunction;

},{"../CompletionRecord":6,"../Value":14,"./ObjectValue":47}],40:[function(require,module,exports){
'use strict';
/* @flow */

const Value = require('../Value');
const PropertyDescriptor = require('./PropertyDescriptor');
const ObjectValue = require('./ObjectValue');
const CompletionRecord = require('../CompletionRecord');
const EasyNativeFunction = require('./EasyNativeFunction');

class EasyObjectValue extends ObjectValue {
	constructor(realm) {
		super(realm);

		let objProto = realm.ObjectPrototype;
		if ( typeof this.objPrototype === 'function' ) {
			objProto = this.objPrototype(realm);
		} else if ( typeof this.call === 'function' ) {
			objProto = realm.FunctionPrototype;
		}
		if ( this.call == 'function' ) this.clazz = 'Function';
		this.setPrototype(objProto);

		this._init(realm);
	}

	_init(realm) {
		var clazz = Object.getPrototypeOf(this);
		for ( let p of Object.getOwnPropertyNames(clazz.constructor) ) {
			if ( p === 'length' ) continue;
			if ( p === 'name' ) continue;
			if ( p === 'prototype' ) continue;
			if ( p === 'constructor' ) continue;
			if ( p === 'caller' ) continue;
			if ( p === 'callee') continue;
			if ( p === 'arguments' ) continue;
			let parts = p.split(/\$/);
			let name = parts[0];
			let flags = parts[1] || '';
			let d = Object.getOwnPropertyDescriptor(clazz.constructor, p);
			let v = new PropertyDescriptor();
			let length = 1;

			if ( d.get ) {
				//Its a property
				let val = d.get();
				if ( val instanceof Value ) v.value = val;
				else v.value = this.fromNative(val);
			} else {
				if ( d.value.esperLength !== undefined ) length = d.value.esperLength;
				let rb = EasyNativeFunction.make(realm, d.value, this);
				let rblen = new PropertyDescriptor(Value.fromNative(length));
				rblen.configurable = false;
				rblen.writable = false;
				rblen.enumerable = false;
				rb.properties['length'] = rblen;
				v.value = rb;
			}
			if ( flags.indexOf('e') !== -1 ) v.enumerable = false;
			if ( flags.indexOf('w') !== -1 ) v.writable = false;
			if ( flags.indexOf('c') !== -1 ) v.configurable = false;
			if ( flags.indexOf('g') !== -1 ) {
				v.getter = v.value;
				delete v.value;
			}
			this.properties[name] = v;
		}

		if ( this.callPrototype ) {
			let pt = new PropertyDescriptor(this.callPrototype(realm));
			pt.configurable = false;
			pt.enumerable = false;
			pt.writable = false;
			this.properties['prototype'] = pt;
		}

		if ( this.callLength !== undefined ) {
			let rblen = new PropertyDescriptor(Value.fromNative(this.callLength));
			rblen.configurable = false;
			rblen.writable = false;
			rblen.enumerable = false;
			this.properties['length'] = rblen;
		}

		if ( this.constructorFor ) {
			let target = this.constructorFor(realm);
			if ( target ) {
				let cs = new PropertyDescriptor(this);
				cs.configurable = false;
				cs.enumerable = false;
				target.properties['constructor'] = cs;
			}
		}

		if ( realm.Function ) {
			let cs = new PropertyDescriptor(realm.Function);
			cs.configurable = false;
			cs.enumerable = false;
			this.properties['constructor'] = cs;
		}

	}

	get jsTypeName() { return typeof this.call === 'function' ? 'function' : 'object'; }
}

EasyObjectValue.EasyNativeFunction = EasyNativeFunction;

module.exports = EasyObjectValue;

},{"../CompletionRecord":6,"../Value":14,"./EasyNativeFunction":39,"./ObjectValue":47,"./PropertyDescriptor":49}],41:[function(require,module,exports){
'use strict';

const Value = require('../Value');
const BridgeValue = require('./BridgeValue');
const CompletionRecord = require('../CompletionRecord');

class EmptyValue extends Value {
	constructor() {
		super(null);
	}

	get truthy() { return false; }

	*not() { return Value.fromNative(true); }

	*doubleEquals(other) {
		if ( other instanceof EmptyValue ) return Value.true;
		else if ( other instanceof BridgeValue ) return this.fromNative(this.toNative() == other.toNative());
		else return Value.false;
	}

	*observableProperties(realm) {
		return;
	}

	*instanceOf() {
		return Value.false;
	}

	/**
	 * @param {String} name
	 * @param {Realm} realm
	 * @returns {CompletionRecord} Indexing empty values is a type error.
	 */
	*get(name, realm) {
		let str = 'Cannot read property \'' + name + '\' of ' + this.specTypeName;
		let err = CompletionRecord.makeTypeError(realm, str);
		yield * err.addExtra({code: 'IndexEmpty', target: this, prop: name});
		return err;
	}

}

module.exports = EmptyValue;

},{"../CompletionRecord":6,"../Value":14,"./BridgeValue":37}],42:[function(require,module,exports){
'use strict';


const PrimitiveValue = require('./PrimitiveValue');
const ObjectValue = require('./ObjectValue');
const Value = require('../Value');
const EvaluatorInstruction = require('../EvaluatorInstruction');

class ErrorInstance extends ObjectValue {
	createNativeAnalog() {
		if ( !this.native ) {
			let NativeClass = this.proto.nativeClass || Error;
			this.native = new NativeClass();

			let frames = this.native.stack.split(/\n/);
			let header = frames.shift();
			while ( /at (ErrorInstance.createNativeAnalog|ErrorObject.make|Function.makeTypeError)/.test(frames[0]) ) {
				frames.shift();
			}
			this.native.stack = header + '\n' + frames.join('\n');
			for ( var k in this.extra ) this.native[k] = this.extra[k];

		}
		return this.native;
	}
	toNative() {
		let out = this.createNativeAnalog();
		let msg = this.properties['message'].value;
		if ( msg ) out.message = msg.toNative();

		if ( this.properties['stack'] ) {
			msg.stack = this.properties['stack'].value.native;
		}

		return out;
	}

	*addExtra(extra) {
		if ( !this.realm.options.extraErrorInfo ) return;
		let evaluator = yield EvaluatorInstruction.getEvaluator();
		if ( evaluator ) {
			let scope = evaluator.topFrame.scope;
			let ast = extra.ast = evaluator.topFrame.ast;
			extra.scope = scope;

			if ( extra.ast.loc ) {
				extra.line = extra.ast.loc.start.line;
			}

			switch ( extra.code ) {
				case 'UndefinedVariable':
				case 'SmartAccessDenied':
					extra.candidates = scope.getVariableNames();
					break;
				case 'CallNonFunction':
					let list;
					if ( extra.base && extra.base.getPropertyValueMap ) {
						list = extra.base.getPropertyValueMap();
					} else {
						list = scope.object.getPropertyValueMap();
					}

					extra.candidates = [];
					for ( let k in list ) {
						let v = list[k];
						if ( v && v.isCallable ) {
							extra.candidates.push(k);
						}
					}
					break;
				case 'IndexEmpty':
					break;
			}
		}
		if ( this.native ) {
			for ( var k in extra ) {
				if ( ['ast', 'scope', 'candidates', 'targetAst'].indexOf(k) !== -1 ) {
					Object.defineProperty(this.native, k, {
						value: extra[k],
						enumerable: false
					});
				} else {
					this.native[k] = extra[k];
				}
			}
		}
		this.extra = extra;
	}
}

module.exports = ErrorInstance;

},{"../EvaluatorInstruction":10,"../Value":14,"./ObjectValue":47,"./PrimitiveValue":48}],43:[function(require,module,exports){
'use strict';
const EmptyValue = require('./EmptyValue');
const Value = require('../Value');

function defer() {
	var resolve, reject;
	var promise = new Promise(function(a, b) {
		resolve = a;
		reject = b;
	});
	return {
		resolve: resolve,
		reject: reject,
		promise: promise
	};
}

class FutureValue extends Value {

	constructor(realm) {
		super(realm);
		this.resolved = false;
		this.successful = undefined;
		this.value = undefined;
		this.defered = defer();
	}

	/**
	 * Creates a new future value wraping the promise p.
	 * @param {Promise} promise
	 */
	static make(promise) {
		var fv = new FutureValue(null);
		promise.then(function(resolved) {
			fv.resolve(Value.fromNative(resolved));
		}, function(caught) {
			fv.reject(Value.fromNative(caught));
		});
		return fv;
	}

	resolve(value) {
		this.value = value;
		this.resolved = true;
		this.successful = true;
		this.defered.resolve(value);
	}

	reject(value) {
		this.value = value;
		this.resolved = true;
		this.successful = false;
		this.defered.resolve(value);
	}

	then() {
		var p = this.defered.promise;
		return p.then.apply(p, arguments);
	}

	get jsTypeName() { return 'internal:future'; }
	get debugString() { return '[Future]'; }
}

module.exports = FutureValue;

},{"../Value":14,"./EmptyValue":41}],44:[function(require,module,exports){
'use strict';
/* @flow */

const Value = require('../Value');
const CompletionRecord = require('../CompletionRecord');
const ArrayValue = require('./ArrayValue');

function invoke(target, thiz, args) {
	return Function.prototype.apply.call(target, thiz, args);
}

/**
 * Represents a value that maps directly to an untrusted local value.
 */
class LinkValue extends Value {

	constructor(value, realm) {
		super();
		this.native = value;
		this.realm = realm;
	}

	static make(native, realm) {
		let wellKnown = realm.lookupWellKnown(native);
		if ( wellKnown ) return wellKnown;

		if ( Array.isArray(native) ) {
			var ia = new Array(native.length);
			for ( let i = 0; i < native.length; ++i ) {
				ia[i] = LinkValue.make(native[i], realm);
			}
			return ArrayValue.make(ia, realm);
		}

		return new LinkValue(native, realm);
	}

	ref(name, realm) {

		let that = this;
		let out = Object.create(null);

		let getter;
		if ( this.native.hasOwnProperty(name) ) {
			getter = () => realm.import(this.native[name], this.linkKind);
		} else {
			getter = () => realm.import(this.native, this.linkKind).ref(name, realm).value;
		}

		out.getValue = function *() { return getter(); };
		out.setValue = function *(to) { return yield * that.set(name, to); };
		out.del = function() { return false; };

		return out;
	}

	*set(name, value, s, extra) {
		this.native[name] = value.toNative();
	}

	toNative() {
		return this.native;
	}

	*asString() {
		return this.native.toString();
	}

	makeLink(value) {
		return this.realm.import(value, this.linkKind);
	}

	*doubleEquals(other) { return this.makeLink(this.native == other.toNative()); }
	*tripleEquals(other) { return this.makeLink(this.native === other.toNative()); }

	*add(other) { return this.makeLink(this.native + other.toNative()); }
	*subtract(other) { return this.makeLink(this.native - other.toNative()); }
	*multiply(other) { return this.makeLink(this.native * other.toNative()); }
	*divide(other) { return this.makeLink(this.native / other.toNative()); }
	*mod(other) { return this.makeLink(this.native % other.toNative()); }

	*shiftLeft(other) { return this.makeLink(this.native << other.toNative()); }
	*shiftRight(other) { return this.makeLink(this.native >> other.toNative()); }
	*shiftRightZF(other) { return this.makeLink(this.native >>> other.toNative()); }

	*bitAnd(other) { return this.makeLink(this.native & other.toNative()); }
	*bitOr(other) { return this.makeLink(this.native | other.toNative()); }
	*bitXor(other) { return this.makeLink(this.native ^ other.toNative()); }

	*gt(other) { return this.makeLink(this.native > other.toNative()); }
	*lt(other) { return this.makeLink(this.native < other.toNative()); }
	*gte(other) { return this.makeLink(this.native >= other.toNative()); }
	*lte(other) { return this.makeLink(this.native <= other.toNative()); }

	*inOperator(other) { return this.makeLink(other.toNative() in this.native); }
	*instanceOf(other) { return this.makeLink(this.native instanceof other.toNative()); }

	*unaryPlus() { return this.makeLink(+this.native); }
	*unaryMinus() { return this.makeLink(-this.native); }
	*not() { return this.makeLink(!this.native); }



	*get(name, realm) {
		if ( this.native.hasOwnProperty(name) ) {
			return this.makeLink(this.native[name], realm);
		}

		return yield * this.makeLink(Object.getPrototypeOf(this.native), realm).get(name, realm);
	}


	*observableProperties(realm) {
		for ( let p in this.native ) {
			yield this.makeLink(p);
		}
		return;
	}

	/**
	 *
	 * @param {Value} thiz
	 * @param {Value[]} args
	 * @param {Scope} s
	 */
	*call(thiz, args, s) {
		let realArgs = new Array(args.length);
		for ( let i = 0; i < args.length; ++i ) {
			realArgs[i] = args[i].toNative();
		}
		try {
			let result = invoke(this.native, thiz ? thiz.toNative() : undefined, realArgs);
			let val = this.makeLink(result, s.realm);
			if ( typeof s.realm.options.linkValueCallReturnValueWrapper === 'function' ) {
				val = s.realm.options.linkValueCallReturnValueWrapper(val);
			}
			return val;
		} catch ( e ) {
			let result = this.makeLink(e, s.realm);
			return new CompletionRecord(CompletionRecord.THROW, result);
		}

	}

	get isCallable() {
		return ( typeof this.native === 'function' );
	}

	getPropertyValueMap() {
		let list  = {};
		for ( let p in this.native ) {
			let v = this.native[p];
			list[p] = this.makeLink(v);
		}
		return list;
	}

	*toNumberValue() { return Value.fromNative((Number(this.native))); }
	*toStringValue() { return Value.fromNative((String(this.native))); }

	getPrototype(realm) {
		return realm.ObjectPrototype;
	}

	*makeThisForNew() {
		return Value.undef;
	}

	get debugString() {
		return '[Link: ' + this.native + ']';
	}

	get truthy() {
		return !!this.native;
	}

	get jsTypeName() {
		return typeof this.native;
	}

	*toPrimitiveValue(preferedType) {
		switch ( preferedType ) {
			case 'string':
				return Value.fromNative(this.native.toString());
			default:
				return Value.fromNative(this.native.valueOf());
		}
	}

	get linkKind() { return 'link'; }
}

module.exports = LinkValue;

},{"../CompletionRecord":6,"../Value":14,"./ArrayValue":36}],45:[function(require,module,exports){
'use strict';

const EmptyValue = require('./EmptyValue');
const Value = require('../Value');

class NullValue extends EmptyValue {
	toNative() { return null; }

	get jsTypeName() { return 'object'; }
	get specTypeName() { return 'null'; }

	*tripleEquals(other, realm) {
		return other instanceof NullValue ? Value.true : Value.false;
	}

	*asString() {
		return 'null';
	}

	*toPrimitiveValue(preferedType) { return this; }
	*toNumberValue() { return Value.zero; }
	*toStringValue() { return Value.fromNative('null'); }

	get debugString() { return 'null'; }
}

module.exports = NullValue;

},{"../Value":14,"./EmptyValue":41}],46:[function(require,module,exports){
'use strict';

const PrimitiveValue = require('./PrimitiveValue');
const Value = require('../Value');
let StringValue;

class NumberValue extends PrimitiveValue {


	*doubleEquals(other) {
		if ( other instanceof NumberValue) {
			return Value.fromNative(this.native == other.native);
		} else if ( other instanceof StringValue ) {
			let on = yield * other.toNumberValue();
			return yield * this.doubleEquals(on);
		} else {
			let on = yield * other.toNumberValue();
			return yield * this.doubleEquals(on);
		}

		return Value.false;

	}

	*add(other) { return this.fromNative(this.native + (yield * other.toPrimitiveNative())); }
}

module.exports = NumberValue;

StringValue = require('./StringValue');

},{"../Value":14,"./PrimitiveValue":48,"./StringValue":52}],47:[function(require,module,exports){
'use strict';
/* @flow */

const Value = require('../Value');
const PropertyDescriptor = require('./PropertyDescriptor');
const CompletionRecord = require('../CompletionRecord');
const PrimitiveValue = require('./PrimitiveValue');
const NullValue = require('./NullValue');
const GenDash = require('../GenDash');

let alwaysFalse = () => false;
let undefinedReturningGenerator = function*() { return Value.undef; }

class ObjRefrence {
	constructor(object, name, ctxthis) {
		this.object = object;
		this.name = name;
		this.ctxthis = ctxthis;
	}
	del(s) { return this.object.delete(this.name, s); }
	getValue(s) { return this.object.get(this.name, this.ctxthis || this.object, s) }
	setValue(value, s) { return this.object.set(this.name, value, s); }
}

/**
 * Represents an Object.
 */
class ObjectValue extends Value {

	constructor(realm, proto) {
		super();
		this.extensable = true;
		this.realm = realm;
		if ( proto ) this.eraseAndSetPrototype(proto);
		else if ( realm ) this.eraseAndSetPrototype(realm.ObjectPrototype);
		else this.properties = Object.create(null);
	}

	ref(name, ctxthis) {
		var existing = this.properties[name];
		let thiz = this;

		let get;
		if ( existing ) {
			return new ObjRefrence(this, name, ctxthis);
		} else {
			return {
				name: name,
				object: thiz,
				isVariable: false,
				del: alwaysFalse,
				getValue:  undefinedReturningGenerator,
				setValue: function (to, s) { return this.object.set(this.name, to, s); }
			};

		}
	}

	//Note: Returns generator by tailcall.
	set(name, value, s, extra) {
		let thiz = this;
		extra = extra || {};
		if ( !Object.prototype.hasOwnProperty.call(this.properties, name) ) {
			if ( !this.extensable ) {
				//TODO: Should we throw here in strict mode?
				return Value.undef.fastGen();
			}
			let v = new PropertyDescriptor(value);
			v.enumerable = 'enumerable' in extra ? extra.enumerable : true;
			this.properties[name] = v;

			return v.setValue(this, value, s);
		}

		return this.properties[name].setValue(this, value, s);

	}

	rawSetProperty(name, value) {
		this.properties[name] = value;
	}

	setImmediate(name, value) {
		if ( name in this.properties ) {
			if ( Object.prototype.hasOwnProperty.call(this.properties, name) ) {
				if ( this.properties[name].direct ) {
					this.properties[name].value = value;
					return;
				}
			}
		} else if ( this.extensable ) {
			let v = new PropertyDescriptor(value);
			v.del = this.delete.bind(this, name);
			this.properties[name] = v;
			return;
		}
		return GenDash.syncGenHelper(this.set(name, value, this.realm));
	}



	has(name) {
		return name in this.properties;
	}

	delete(name, s) {
		let po = this.properties[name];
		if ( !po.configurable ) {
			if ( s.strict ) return CompletionRecord.makeTypeError(s.realm, "Can't delete nonconfigurable object");
			else return false;
		}
		return delete this.properties[name];
	}

	toNative() {

		//TODO: This is really a mess and should maybe be somewhere else.
		var bk = Value.createNativeBookmark(this, this.realm);
		if ( this.jsTypeName === 'function' ) return bk;

		for ( let p in this.properties ) {
			let name = p; //work around bug in FF where the scope of p is incorrect
			let po = this.properties[name];
			if ( Object.prototype.hasOwnProperty.call(bk, name) ) continue;
			if ( bk[p] !== undefined ) continue;

			Object.defineProperty(bk, p, {
				get: () => {
					var c = this.properties[name].value;
					return c === undefined ? undefined : c.toNative();
				},
				set: (v) => { this.properties[name].value = Value.fromNative(v, this.realm); },
				enumerable: po.enumerable,
				configurable: po.configurable
			});
		}
		return bk;

	}


	*add(other) { return yield * (yield * this.toPrimitiveValue()).add(other); }
	*doubleEquals(other) {
		if ( other instanceof PrimitiveValue ) {
			let hint = ( other.jsTypeName == 'string' ? 'string' : 'number' );
			let pv = yield * this.toPrimitiveValue(hint);
			return yield * pv.doubleEquals(other);
		}
		let pthis = yield * this.toPrimitiveValue('string');
		return yield * pthis.doubleEquals(other);
	}
	*inOperator(str) {
		let svalue = yield * str.toStringValue();
		return this.has(svalue.toNative()) ? Value.true : Value.false;
	}

	*get(name, realm, ctxthis) {
		var existing = this.properties[name];
		if ( !existing ) return Value.undef;
		if ( existing.direct ) return existing.value;
		return yield * existing.getValue(ctxthis || this);
	}

	getImmediate(name, realm, ctxthis) {
		var existing = this.properties[name];
		if ( !existing ) return Value.undef;
		if ( existing.direct ) return existing.value;
		return GenDash.syncGenHelper(existing.getValue(ctxthis || this));
	}

	*instanceOf(other, realm) {
		return yield * other.constructorOf(this, realm);
	}

	*constructorOf(what, realm) {
		let target = yield * this.get('prototype');
		let pt = what.getPrototype(realm);
		let checked = [];

		while ( pt ) {
			if ( pt === target ) return Value.true;
			checked.push(pt);
			pt = pt.getPrototype(realm);
			if ( checked.indexOf(pt) !== -1 ) return Value.false;
		}
		return Value.false;
	}

	*observableProperties(realm) {
		for ( let p in this.properties ) {
			if ( !this.properties[p].enumerable ) continue;
			yield this.fromNative(p);
		}
		return;
	}

	getPropertyValueMap() {
		let list  = {};
		for ( let p in this.properties ) {
			let v = this.properties[p];
			if ( v.value ) {
				list[p] = v.value;
			}
		}
		return list;
	}

	hasOwnProperty(name) {
		return Object.prototype.hasOwnProperty.call(this.properties, name);
	}

	setPrototype(val) {
		if ( !this.properties ) return this.eraseAndSetPrototype(val);
		if ( val === null || val === undefined || val instanceof NullValue ) {
			Object.setPrototypeOf(this.properties, null);
			this.proto = null;
			return;
		}
		this.proto = val;
		Object.setPrototypeOf(this.properties, val.properties);
	}

	eraseAndSetPrototype(val) {
		if ( val === null || val === undefined || val instanceof NullValue ) {
			this.proto = null;
			this.properties = Object.create(null);
		} else {
			this.proto = val;
			this.properties = Object.create(val.properties);
		}
	}

	getPrototype() {
		return this.proto;
	}

	get debugString() {
		let strProps = ['{','[', this.clazz,']'];
		let delim = [];
		if ( this.wellKnownName ) {
			strProps.push('(', this.wellKnownName , ')');
		}
		if ( this.proto ) {
			delim.push('[[Prototype]]: ' + (this.proto.wellKnownName || this.proto.clazz || this.proto.jsTypeName) );
		}
		for ( let n in this.properties ) {
			if ( !Object.prototype.hasOwnProperty.call(this.properties, n) ) continue;
			let  val = this.properties[n].value;
			if ( this.properties[n].getter || this.properties[n].setter ) delim.push(n + ': [Getter/Setter]');
			else if ( val.specTypeName === 'object' ) delim.push(n + ': [Object]');
			else if ( val.specTypeName === 'function' ) delim.push(n + ': [Function]');
			else delim.push(n + ': ' + val.debugString);
		}
		strProps.push(delim.join(', '));
		strProps.push('} ]');
		return strProps.join(' ');
	}

	*toPrimitiveValue(preferedType) {
		let methodNames;
		if ( preferedType == 'string') {
			methodNames = ['toString', 'valueOf'];
		} else {
			methodNames = ['valueOf', 'toString'];
		}

		for ( let name of methodNames ) {
			let method = yield * this.get(name);
			if ( method && method.call ) {
				let rescr = yield (yield * method.call(this, [], this.realm.globalScope)); //TODO: There should be more aruments here
				let res = Value.undef;
				if ( !(rescr instanceof CompletionRecord) ) res = rescr;
				else if ( rescr.type == CompletionRecord.RETURN ) res = rescr.value;
				else if ( rescr.type != CompletionRecord.NORMAL ) continue;
				if ( res.specTypeName !== 'object' ) return res;
			}
		}
		return yield CompletionRecord.makeTypeError(this.realm, 'Cannot convert object to primitive value');
	}

	*toNumberValue() {
		let prim = yield * this.toPrimitiveValue('number');
		return yield * prim.toNumberValue();
	}

	*toObjectValue(realm) { return this; }

	*toStringValue() {
		let prim = yield * this.toPrimitiveValue('string');
		let gen = prim.toStringValue();
		return yield * gen;
	}

	get truthy() {
		return true;
	}

	get jsTypeName() {
		if ( typeof this.call !== 'function' ) return 'object';
		return 'function';
	}

	get specTypeName() {
		return 'object';
	}
}

ObjectValue.prototype.clazz = 'Object';

module.exports = ObjectValue;

},{"../CompletionRecord":6,"../GenDash":11,"../Value":14,"./NullValue":45,"./PrimitiveValue":48,"./PropertyDescriptor":49}],48:[function(require,module,exports){
'use strict';
/* @flow */

const Value = require('../Value');
const CompletionRecord = require('../CompletionRecord');
let StringValue;

/**
 * Represents a primitive value.
 */
class PrimitiveValue extends Value {

	constructor(value) {
		super(null);
		this.native = value;
		//Object.defineProperty(this, 'native', {
		//	'value': value,
		//	'enumerable': true
		//});
	}

	ref(name, realm) {
		var that = this;
		let out = Object.create(null);
		out.getValue = function *() { return yield * that.get(name, realm); };
		out.setValue = function *(to) { yield * that.set(name, to, realm); };
		return out;
	}

	*get(what, realm) {
		return yield * this.derivePrototype(realm).get(what, realm);
	}

	*set(what, to, realm) {
		//Can't set primative properties.
	}


	derivePrototype(realm) {
		switch ( typeof this.native ) {
			case 'string': return realm.StringPrototype;
			case 'number': return realm.NumberPrototype;
			case 'boolean': return realm.BooleanPrototype;
		}
	}

	toNative() {
		return this.native;
	}

	get debugString() {
		if ( typeof this.native === 'object' ) return '[native object]';
		else if ( typeof this.native === 'function' ) return '[native function]';
		else if ( typeof this.native === 'string' ) return JSON.stringify(this.native);
		else return '' + this.native;

	}

	*asString() {
		return this.native.toString();
	}

	*doubleEquals(other) {
		let native = this.native;
		if ( other instanceof PrimitiveValue) {
			return Value.fromNative(this.native == other.native);
		} else if ( typeof native === 'number' ) {
			if ( other instanceof StringValue ) {
				let num = yield * other.toNumberValue();
				return Value.from(native === num.toNative());
			} else {
				return Value.false;
			}
		} else if ( typeof native == 'boolean' ) {
			return yield * this.toNumberValue().doubleEquals(other);
		}

		return Value.false;

	}
	*tripleEquals(other) { return this.native === other.toNative() ? Value.true : Value.false; }

	*add(other) { return this.fromNative(this.native + (yield * other.toPrimitiveNative())); }

	*inOperator(other) { return this.fromNative(this.native in other.toNative()); }
	*instanceOf(other) { return Value.false; }

	*unaryPlus() { return this.fromNative(+this.native); }
	*unaryMinus() { return this.fromNative(-this.native); }
	*not() { return this.fromNative(!this.native); }



	*get(name, realm) {
		let pt = this.derivePrototype(realm);
		return yield * pt.get(name, realm, this);
	}

	*observableProperties(realm) {
		yield * this.derivePrototype(realm).observableProperties(realm);
	}

	*makeThisForNew() {
		throw new Error('Naw');
	}

	getPrototype(realm) {
		return this.derivePrototype(realm);
	}

	get truthy() {
		return !!this.native;
	}

	get jsTypeName() {
		return typeof this.native;
	}

	*toPrimitiveValue(preferedType) { return this; }
	*toStringValue() {
		if ( typeof this.native === 'string' ) return this;
		return this.fromNative(String(this.native));
	}

	*toNumberValue() {
		if ( typeof this.native === 'number' ) return this;
		return this.fromNative(Number(this.native));
	}


}
module.exports = PrimitiveValue;

StringValue = require('./StringValue');



},{"../CompletionRecord":6,"../Value":14,"./StringValue":52}],49:[function(require,module,exports){
'use strict';
/* @flow */

const Value = require('../Value');
const CompletionRecord = require('../CompletionRecord');

let serial = 0;

//TODO: We should call this a PropertyDescriptor, not a variable.

class PropertyDescriptor {
	constructor(value, enumerable) {
		this.value = value;
		this.serial = serial++;
		this.configurable = true;
		this.enumerable = enumerable !== undefined ? !!enumerable : true;
		this.writable = true;
		this.getter = undefined;
		this.setter = undefined;
	}

	get direct() {
		return !this.getter && !this.setter && this.writable;
	}

	*getValue(thiz) {
		thiz = thiz || Value.null;
		if ( this.getter ) {
			return yield * this.getter.call(thiz, []);
		}
		return this.value;
	}

	*setValue(thiz, to, s) {
		thiz = thiz || Value.null;
		if ( this.setter ) {
			return yield * this.setter.call(thiz, [to], s);
		}
		if ( !this.writable ) {
			if ( !s || !s.strict ) {
				return this.value;
			}
			return yield CompletionRecord.makeTypeError(s.realm, "Can't write to non-writable value.");
		}
		this.value = to;
		return this.value;
	}
}

module.exports = PropertyDescriptor;

},{"../CompletionRecord":6,"../Value":14}],50:[function(require,module,exports){
'use strict';


const PrimitiveValue = require('./PrimitiveValue');
const ObjectValue = require('./ObjectValue');
const Value = require('../Value');


class RegExpValue extends ObjectValue {

	constructor(realm) {
		super(realm, realm.RegExpPrototype);
	}

	static make(regexp, realm) {

		let av = new RegExpValue(realm);
		av.regexp = regexp;
		av.setImmediate('source', Value.fromNative(regexp.source));
		av.properties['source'].enumerable = false;
		av.setImmediate('global', Value.fromNative(regexp.global));
		av.properties['global'].enumerable = false;
		av.setImmediate('ignoreCase', Value.fromNative(regexp.ignoreCase));
		av.properties['ignoreCase'].enumerable = false;
		av.setImmediate('multiline', Value.fromNative(regexp.multiline));
		av.properties['multiline'].enumerable = false;
		return av;
	}

	toNative() { return this.regexp; }

	get debugString() {
		return this.regexp.toString();
	}
}

RegExpValue.prototype.clazz = 'RegExp';

module.exports = RegExpValue;

},{"../Value":14,"./ObjectValue":47,"./PrimitiveValue":48}],51:[function(require,module,exports){
'use strict';
/* @flow */

const Value = require('../Value');
const LinkValue = require('./LinkValue');
const CompletionRecord = require('../CompletionRecord');
const ArrayValue = require('./ArrayValue');
/**
 * Represents a value that maps directly to an untrusted local value.
 */
class SmartLinkValue extends LinkValue {

	constructor(value, realm) {
		super(value, realm);
	}

	allowRead(name) {
		//if ( name === 'call' ) return true;
		//return true;
		if ( name.indexOf('esper_') === 0 ) return true;
		if ( name === 'hasOwnProperty' ) return true;
		let props = this.apiProperties;
		if ( props === null ) return true;
		return props.indexOf(name) !== -1;
	}

	allowWrite(name) {
		var allowed = [];
		var native = this.native;
		if ( native.apiUserProperties ) {
			Array.prototype.push.apply(allowed, native.apiUserProperties);
		}

		return allowed.indexOf(name) != -1;
	}

	getPropertyValueMap() {
		let list  = {};
		for ( let p in this.native ) {
			let v = this.native[p];
			if ( this.allowRead(p) ) {
				list[p] = this.makeLink(v);
			}
		}
		return list;
	}

	static make(native, realm) {
		let wellKnown = realm.lookupWellKnown(native);
		if ( wellKnown ) return wellKnown;

		if ( Array.isArray(native) ) {
			var ia = new Array(native.length);
			for ( let i = 0; i < native.length; ++i ) {
				ia[i] = realm.import(native[i], 'smart');
			}
			return ArrayValue.make(ia, realm);
		}

		return new SmartLinkValue(native, realm);
	}

	makeLink(value) {
		return this.realm.import(value, 'smart');
	}


	ref(name, realm) {
		let out = super.ref(name, realm);
		let native = this.native;
		if ( name in native ) {
			let noWrite = function *() {
				let err = CompletionRecord.makeTypeError(realm, "Can't write to protected property: " + name);
				yield * err.addExtra({code: 'SmartAccessDenied', when: 'write', ident: name});
				return yield err;
			};
			let noRead = function *() {
				let err = CompletionRecord.makeTypeError(realm, "Can't read protected property: " + name);
				yield * err.addExtra({code: 'SmartAccessDenied', when: 'read', ident: name});
				return yield err;
			};
			if ( !this.allowRead(name) ) {
				return {
					getValue: noRead,
					setValue: noWrite,
					del: () => false
				};
			} else if ( !this.allowWrite(name) ) {
				out.setValue = noWrite;
			}

		} else {
			let defaultAction = out.setValue;
			if ( !native.apiUserProperties ) native.apiUserProperties = [];

			if ( native.apiUserProperties.indexOf(name) == -1 ) {
				out.setValue = function *() {
					let ret = yield * defaultAction.apply(this, arguments);
					native.apiUserProperties.push(name);
					return ret;
				};
			}
		}

		return out;
	}

	*set(name, value, s, extra) {

		if ( name in this.native ) {
			if ( !this.allowWrite(name) ) return yield CompletionRecord.makeTypeError(s.realm, "Can't write to protected property: " + name);
		} else {
			//TODO: Mark value as having been written by user so they retain write permissions to it.
		}

		return yield * super.set(name, value, s, extra);

	}

	*get(name, realm) {
		if ( !(name in this.native) ) {
			return Value.undef;
		}

		if ( ('esper_' + name) in this.native ) name = 'esper_' + name;

		if ( !this.allowRead(name) ) {
			return yield CompletionRecord.makeTypeError(realm, "Can't read protected property: " + name);
		}

		return yield * super.get(name, realm);
	}

	get apiProperties() {
		let allowed = [];
		let native = this.native;

		if ( native.apiProperties === undefined && native.apiMethods === undefined ) return null;

		if ( native.apiProperties ) {
			Array.prototype.push.apply(allowed, native.apiProperties);
		}

		if ( native.apiUserProperties ) {
			Array.prototype.push.apply(allowed, native.apiUserProperties);
		}

		if ( native.apiMethods ) {
			Array.prototype.push.apply(allowed, native.apiMethods);
		}


		if ( native.apiOwnMethods ) {
			Array.prototype.push.apply(allowed, native.apiOwnMethods);
		}


		if ( native.programmableProperties ) {
			Array.prototype.push.apply(allowed, native.programmableProperties);
		}

		return allowed;
	}

	get debugString() {
		let props = this.apiProperties;
		return '[SmartLink: ' + this.native + ', props: ' + (props ? props.join(',') : '[none]') + ']';
	}

}

module.exports = SmartLinkValue;

},{"../CompletionRecord":6,"../Value":14,"./ArrayValue":36,"./LinkValue":44}],52:[function(require,module,exports){
'use strict';

const PrimitiveValue = require('./PrimitiveValue');
const Value = require('../Value');
let NumberValue;


class StringValue extends PrimitiveValue {
	*get(name, realm) {
		let idx = Number(name);
		if ( !isNaN(idx) ) {
			return StringValue.fromNative(this.native[idx]);
		}
		if ( name === 'length' ) return StringValue.fromNative(this.native.length);
		return yield * super.get(name, realm);
	}

	*doubleEquals(other) {

		if ( other instanceof StringValue) {
			return Value.fromNative(this.native == other.native);
		} else if ( other instanceof NumberValue ) {
			let rv = yield * this.toNumberValue();
			return yield * rv.doubleEquals(other);
		}

		return Value.false;

	}

	*gt(other) { return this.fromNative(this.native > (yield * other.toStringNative())); }
	*lt(other) { return this.fromNative(this.native < (yield * other.toStringNative())); }
	*gte(other) { return this.fromNative(this.native >= (yield * other.toStringNative())); }
	*lte(other) { return this.fromNative(this.native <= (yield * other.toStringNative())); }
	*add(other) { return this.fromNative(this.native + (yield * other.toPrimitiveNative('string'))); }

}

module.exports = StringValue;

NumberValue = require('./NumberValue');

},{"../Value":14,"./NumberValue":46,"./PrimitiveValue":48}],53:[function(require,module,exports){
'use strict';
const EmptyValue = require('./EmptyValue');
const Value = require('../Value');

class UndefinedValue extends EmptyValue {
	toNative() { return undefined; }
	get jsTypeName() { return 'undefined'; }
	*tripleEquals(other, realm) {
		return other instanceof UndefinedValue ? Value.true : Value.false;
	}

	*add(other) { return this.fromNative(undefined + other.toNative()); }

	*asString() {
		return 'undefined';
	}

	*toPrimitiveValue(preferedType) { return this; }
	*toNumberValue() { return Value.nan; }
	*toStringValue() { return Value.fromNative('undefined'); }

	get debugString() { return 'undefined'; }
}

module.exports = UndefinedValue;

},{"../Value":14,"./EmptyValue":41}],54:[function(require,module,exports){
/*
  Copyright (c) jQuery Foundation, Inc. and Contributors, All Rights Reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function (root, factory) {
    'use strict';

    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
    // Rhino, and plain browser loading.

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.esprima = {}));
    }
}(this, function (exports) {
    'use strict';

    var Token,
        TokenName,
        FnExprTokens,
        Syntax,
        PlaceHolders,
        Messages,
        Regex,
        source,
        strict,
        index,
        lineNumber,
        lineStart,
        hasLineTerminator,
        lastIndex,
        lastLineNumber,
        lastLineStart,
        startIndex,
        startLineNumber,
        startLineStart,
        scanning,
        length,
        lookahead,
        state,
        extra,
        isBindingElement,
        isAssignmentTarget,
        firstCoverInitializedNameError;

    Token = {
        BooleanLiteral: 1,
        EOF: 2,
        Identifier: 3,
        Keyword: 4,
        NullLiteral: 5,
        NumericLiteral: 6,
        Punctuator: 7,
        StringLiteral: 8,
        RegularExpression: 9,
        Template: 10
    };

    TokenName = {};
    TokenName[Token.BooleanLiteral] = 'Boolean';
    TokenName[Token.EOF] = '<end>';
    TokenName[Token.Identifier] = 'Identifier';
    TokenName[Token.Keyword] = 'Keyword';
    TokenName[Token.NullLiteral] = 'Null';
    TokenName[Token.NumericLiteral] = 'Numeric';
    TokenName[Token.Punctuator] = 'Punctuator';
    TokenName[Token.StringLiteral] = 'String';
    TokenName[Token.RegularExpression] = 'RegularExpression';
    TokenName[Token.Template] = 'Template';

    // A function following one of those tokens is an expression.
    FnExprTokens = ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new',
                    'return', 'case', 'delete', 'throw', 'void',
                    // assignment operators
                    '=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=',
                    '&=', '|=', '^=', ',',
                    // binary/unary operators
                    '+', '-', '*', '/', '%', '++', '--', '<<', '>>', '>>>', '&',
                    '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=',
                    '<=', '<', '>', '!=', '!=='];

    Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        AssignmentPattern: 'AssignmentPattern',
        ArrayExpression: 'ArrayExpression',
        ArrayPattern: 'ArrayPattern',
        ArrowFunctionExpression: 'ArrowFunctionExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ClassBody: 'ClassBody',
        ClassDeclaration: 'ClassDeclaration',
        ClassExpression: 'ClassExpression',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DoWhileStatement: 'DoWhileStatement',
        DebuggerStatement: 'DebuggerStatement',
        EmptyStatement: 'EmptyStatement',
        ExportAllDeclaration: 'ExportAllDeclaration',
        ExportDefaultDeclaration: 'ExportDefaultDeclaration',
        ExportNamedDeclaration: 'ExportNamedDeclaration',
        ExportSpecifier: 'ExportSpecifier',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForOfStatement: 'ForOfStatement',
        ForInStatement: 'ForInStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        ImportDeclaration: 'ImportDeclaration',
        ImportDefaultSpecifier: 'ImportDefaultSpecifier',
        ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
        ImportSpecifier: 'ImportSpecifier',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        MetaProperty: 'MetaProperty',
        MethodDefinition: 'MethodDefinition',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        ObjectPattern: 'ObjectPattern',
        Program: 'Program',
        Property: 'Property',
        RestElement: 'RestElement',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SpreadElement: 'SpreadElement',
        Super: 'Super',
        SwitchCase: 'SwitchCase',
        SwitchStatement: 'SwitchStatement',
        TaggedTemplateExpression: 'TaggedTemplateExpression',
        TemplateElement: 'TemplateElement',
        TemplateLiteral: 'TemplateLiteral',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement',
        YieldExpression: 'YieldExpression'
    };

    PlaceHolders = {
        ArrowParameterPlaceHolder: 'ArrowParameterPlaceHolder'
    };

    // Error messages should be identical to V8.
    Messages = {
        UnexpectedToken: 'Unexpected token %0',
        UnexpectedNumber: 'Unexpected number',
        UnexpectedString: 'Unexpected string',
        UnexpectedIdentifier: 'Unexpected identifier',
        UnexpectedReserved: 'Unexpected reserved word',
        UnexpectedTemplate: 'Unexpected quasi %0',
        UnexpectedEOS: 'Unexpected end of input',
        NewlineAfterThrow: 'Illegal newline after throw',
        InvalidRegExp: 'Invalid regular expression',
        UnterminatedRegExp: 'Invalid regular expression: missing /',
        InvalidLHSInAssignment: 'Invalid left-hand side in assignment',
        InvalidLHSInForIn: 'Invalid left-hand side in for-in',
        InvalidLHSInForLoop: 'Invalid left-hand side in for-loop',
        MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
        NoCatchOrFinally: 'Missing catch or finally after try',
        UnknownLabel: 'Undefined label \'%0\'',
        Redeclaration: '%0 \'%1\' has already been declared',
        IllegalContinue: 'Illegal continue statement',
        IllegalBreak: 'Illegal break statement',
        IllegalReturn: 'Illegal return statement',
        StrictModeWith: 'Strict mode code may not include a with statement',
        StrictCatchVariable: 'Catch variable may not be eval or arguments in strict mode',
        StrictVarName: 'Variable name may not be eval or arguments in strict mode',
        StrictParamName: 'Parameter name eval or arguments is not allowed in strict mode',
        StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
        StrictFunctionName: 'Function name may not be eval or arguments in strict mode',
        StrictOctalLiteral: 'Octal literals are not allowed in strict mode.',
        StrictDelete: 'Delete of an unqualified identifier in strict mode.',
        StrictLHSAssignment: 'Assignment to eval or arguments is not allowed in strict mode',
        StrictLHSPostfix: 'Postfix increment/decrement may not have eval or arguments operand in strict mode',
        StrictLHSPrefix: 'Prefix increment/decrement may not have eval or arguments operand in strict mode',
        StrictReservedWord: 'Use of future reserved word in strict mode',
        TemplateOctalLiteral: 'Octal literals are not allowed in template strings.',
        ParameterAfterRestParameter: 'Rest parameter must be last formal parameter',
        DefaultRestParameter: 'Unexpected token =',
        ObjectPatternAsRestParameter: 'Unexpected token {',
        DuplicateProtoProperty: 'Duplicate __proto__ fields are not allowed in object literals',
        ConstructorSpecialMethod: 'Class constructor may not be an accessor',
        DuplicateConstructor: 'A class may only have one constructor',
        StaticPrototype: 'Classes may not have static property named prototype',
        MissingFromClause: 'Unexpected token',
        NoAsAfterImportNamespace: 'Unexpected token',
        InvalidModuleSpecifier: 'Unexpected token',
        IllegalImportDeclaration: 'Unexpected token',
        IllegalExportDeclaration: 'Unexpected token',
        DuplicateBinding: 'Duplicate binding %0'
    };

    // See also tools/generate-unicode-regex.js.
    Regex = {
        // ECMAScript 6/Unicode v7.0.0 NonAsciiIdentifierStart:
        NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDE00-\uDE11\uDE13-\uDE2B\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDE00-\uDE2F\uDE44\uDE80-\uDEAA]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]/,

        // ECMAScript 6/Unicode v7.0.0 NonAsciiIdentifierPart:
        NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDD0-\uDDDA\uDE00-\uDE11\uDE13-\uDE37\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF01-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
    };

    // Ensure the condition is true, otherwise throw an error.
    // This is only to have a better contract semantic, i.e. another safety net
    // to catch a logic error. The condition shall be fulfilled in normal case.
    // Do NOT use this to enforce a certain condition on any user input.

    function assert(condition, message) {
        /* istanbul ignore if */
        if (!condition) {
            throw new Error('ASSERT: ' + message);
        }
    }

    function isDecimalDigit(ch) {
        return (ch >= 0x30 && ch <= 0x39);   // 0..9
    }

    function isHexDigit(ch) {
        return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
    }

    function isOctalDigit(ch) {
        return '01234567'.indexOf(ch) >= 0;
    }

    function octalToDecimal(ch) {
        // \0 is not octal escape sequence
        var octal = (ch !== '0'), code = '01234567'.indexOf(ch);

        if (index < length && isOctalDigit(source[index])) {
            octal = true;
            code = code * 8 + '01234567'.indexOf(source[index++]);

            // 3 digits are only allowed when string starts
            // with 0, 1, 2, 3
            if ('0123'.indexOf(ch) >= 0 &&
                    index < length &&
                    isOctalDigit(source[index])) {
                code = code * 8 + '01234567'.indexOf(source[index++]);
            }
        }

        return {
            code: code,
            octal: octal
        };
    }

    // ECMA-262 11.2 White Space

    function isWhiteSpace(ch) {
        return (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
            (ch >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(ch) >= 0);
    }

    // ECMA-262 11.3 Line Terminators

    function isLineTerminator(ch) {
        return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029);
    }

    // ECMA-262 11.6 Identifier Names and Identifiers

    function fromCodePoint(cp) {
        return (cp < 0x10000) ? String.fromCharCode(cp) :
            String.fromCharCode(0xD800 + ((cp - 0x10000) >> 10)) +
            String.fromCharCode(0xDC00 + ((cp - 0x10000) & 1023));
    }

    function isIdentifierStart(ch) {
        return (ch === 0x24) || (ch === 0x5F) ||  // $ (dollar) and _ (underscore)
            (ch >= 0x41 && ch <= 0x5A) ||         // A..Z
            (ch >= 0x61 && ch <= 0x7A) ||         // a..z
            (ch === 0x5C) ||                      // \ (backslash)
            ((ch >= 0x80) && Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch)));
    }

    function isIdentifierPart(ch) {
        return (ch === 0x24) || (ch === 0x5F) ||  // $ (dollar) and _ (underscore)
            (ch >= 0x41 && ch <= 0x5A) ||         // A..Z
            (ch >= 0x61 && ch <= 0x7A) ||         // a..z
            (ch >= 0x30 && ch <= 0x39) ||         // 0..9
            (ch === 0x5C) ||                      // \ (backslash)
            ((ch >= 0x80) && Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch)));
    }

    // ECMA-262 11.6.2.2 Future Reserved Words

    function isFutureReservedWord(id) {
        switch (id) {
        case 'enum':
        case 'export':
        case 'import':
        case 'super':
            return true;
        default:
            return false;
        }
    }

    function isStrictModeReservedWord(id) {
        switch (id) {
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public':
        case 'static':
        case 'yield':
        case 'let':
            return true;
        default:
            return false;
        }
    }

    function isRestrictedWord(id) {
        return id === 'eval' || id === 'arguments';
    }

    // ECMA-262 11.6.2.1 Keywords

    function isKeyword(id) {
        switch (id.length) {
        case 2:
            return (id === 'if') || (id === 'in') || (id === 'do');
        case 3:
            return (id === 'var') || (id === 'for') || (id === 'new') ||
                (id === 'try') || (id === 'let');
        case 4:
            return (id === 'this') || (id === 'else') || (id === 'case') ||
                (id === 'void') || (id === 'with') || (id === 'enum');
        case 5:
            return (id === 'while') || (id === 'break') || (id === 'catch') ||
                (id === 'throw') || (id === 'const') || (id === 'yield') ||
                (id === 'class') || (id === 'super');
        case 6:
            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
                (id === 'switch') || (id === 'export') || (id === 'import');
        case 7:
            return (id === 'default') || (id === 'finally') || (id === 'extends');
        case 8:
            return (id === 'function') || (id === 'continue') || (id === 'debugger');
        case 10:
            return (id === 'instanceof');
        default:
            return false;
        }
    }

    // ECMA-262 11.4 Comments

    function addComment(type, value, start, end, loc) {
        var comment;

        assert(typeof start === 'number', 'Comment must have valid position');

        state.lastCommentStart = start;

        comment = {
            type: type,
            value: value
        };
        if (extra.range) {
            comment.range = [start, end];
        }
        if (extra.loc) {
            comment.loc = loc;
        }
        extra.comments.push(comment);
        if (extra.attachComment) {
            extra.leadingComments.push(comment);
            extra.trailingComments.push(comment);
        }
        if (extra.tokenize) {
            comment.type = comment.type + 'Comment';
            if (extra.delegate) {
                comment = extra.delegate(comment);
            }
            extra.tokens.push(comment);
        }
    }

    function skipSingleLineComment(offset) {
        var start, loc, ch, comment;

        start = index - offset;
        loc = {
            start: {
                line: lineNumber,
                column: index - lineStart - offset
            }
        };

        while (index < length) {
            ch = source.charCodeAt(index);
            ++index;
            if (isLineTerminator(ch)) {
                hasLineTerminator = true;
                if (extra.comments) {
                    comment = source.slice(start + offset, index - 1);
                    loc.end = {
                        line: lineNumber,
                        column: index - lineStart - 1
                    };
                    addComment('Line', comment, start, index - 1, loc);
                }
                if (ch === 13 && source.charCodeAt(index) === 10) {
                    ++index;
                }
                ++lineNumber;
                lineStart = index;
                return;
            }
        }

        if (extra.comments) {
            comment = source.slice(start + offset, index);
            loc.end = {
                line: lineNumber,
                column: index - lineStart
            };
            addComment('Line', comment, start, index, loc);
        }
    }

    function skipMultiLineComment() {
        var start, loc, ch, comment;

        if (extra.comments) {
            start = index - 2;
            loc = {
                start: {
                    line: lineNumber,
                    column: index - lineStart - 2
                }
            };
        }

        while (index < length) {
            ch = source.charCodeAt(index);
            if (isLineTerminator(ch)) {
                if (ch === 0x0D && source.charCodeAt(index + 1) === 0x0A) {
                    ++index;
                }
                hasLineTerminator = true;
                ++lineNumber;
                ++index;
                lineStart = index;
            } else if (ch === 0x2A) {
                // Block comment ends with '*/'.
                if (source.charCodeAt(index + 1) === 0x2F) {
                    ++index;
                    ++index;
                    if (extra.comments) {
                        comment = source.slice(start + 2, index - 2);
                        loc.end = {
                            line: lineNumber,
                            column: index - lineStart
                        };
                        addComment('Block', comment, start, index, loc);
                    }
                    return;
                }
                ++index;
            } else {
                ++index;
            }
        }

        // Ran off the end of the file - the whole thing is a comment
        if (extra.comments) {
            loc.end = {
                line: lineNumber,
                column: index - lineStart
            };
            comment = source.slice(start + 2, index);
            addComment('Block', comment, start, index, loc);
        }
        tolerateUnexpectedToken();
    }

    function skipComment() {
        var ch, start;
        hasLineTerminator = false;

        start = (index === 0);
        while (index < length) {
            ch = source.charCodeAt(index);

            if (isWhiteSpace(ch)) {
                ++index;
            } else if (isLineTerminator(ch)) {
                hasLineTerminator = true;
                ++index;
                if (ch === 0x0D && source.charCodeAt(index) === 0x0A) {
                    ++index;
                }
                ++lineNumber;
                lineStart = index;
                start = true;
            } else if (ch === 0x2F) { // U+002F is '/'
                ch = source.charCodeAt(index + 1);
                if (ch === 0x2F) {
                    ++index;
                    ++index;
                    skipSingleLineComment(2);
                    start = true;
                } else if (ch === 0x2A) {  // U+002A is '*'
                    ++index;
                    ++index;
                    skipMultiLineComment();
                } else {
                    break;
                }
            } else if (start && ch === 0x2D) { // U+002D is '-'
                // U+003E is '>'
                if ((source.charCodeAt(index + 1) === 0x2D) && (source.charCodeAt(index + 2) === 0x3E)) {
                    // '-->' is a single-line comment
                    index += 3;
                    skipSingleLineComment(3);
                } else {
                    break;
                }
            } else if (ch === 0x3C) { // U+003C is '<'
                if (source.slice(index + 1, index + 4) === '!--') {
                    ++index; // `<`
                    ++index; // `!`
                    ++index; // `-`
                    ++index; // `-`
                    skipSingleLineComment(4);
                } else {
                    break;
                }
            } else {
                break;
            }
        }
    }

    function scanHexEscape(prefix) {
        var i, len, ch, code = 0;

        len = (prefix === 'u') ? 4 : 2;
        for (i = 0; i < len; ++i) {
            if (index < length && isHexDigit(source[index])) {
                ch = source[index++];
                code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
            } else {
                return '';
            }
        }
        return String.fromCharCode(code);
    }

    function scanUnicodeCodePointEscape() {
        var ch, code;

        ch = source[index];
        code = 0;

        // At least, one hex digit is required.
        if (ch === '}') {
            throwUnexpectedToken();
        }

        while (index < length) {
            ch = source[index++];
            if (!isHexDigit(ch)) {
                break;
            }
            code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
        }

        if (code > 0x10FFFF || ch !== '}') {
            throwUnexpectedToken();
        }

        return fromCodePoint(code);
    }

    function codePointAt(i) {
        var cp, first, second;

        cp = source.charCodeAt(i);
        if (cp >= 0xD800 && cp <= 0xDBFF) {
            second = source.charCodeAt(i + 1);
            if (second >= 0xDC00 && second <= 0xDFFF) {
                first = cp;
                cp = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
            }
        }

        return cp;
    }

    function getComplexIdentifier() {
        var cp, ch, id;

        cp = codePointAt(index);
        id = fromCodePoint(cp);
        index += id.length;

        // '\u' (U+005C, U+0075) denotes an escaped character.
        if (cp === 0x5C) {
            if (source.charCodeAt(index) !== 0x75) {
                throwUnexpectedToken();
            }
            ++index;
            if (source[index] === '{') {
                ++index;
                ch = scanUnicodeCodePointEscape();
            } else {
                ch = scanHexEscape('u');
                cp = ch.charCodeAt(0);
                if (!ch || ch === '\\' || !isIdentifierStart(cp)) {
                    throwUnexpectedToken();
                }
            }
            id = ch;
        }

        while (index < length) {
            cp = codePointAt(index);
            if (!isIdentifierPart(cp)) {
                break;
            }
            ch = fromCodePoint(cp);
            id += ch;
            index += ch.length;

            // '\u' (U+005C, U+0075) denotes an escaped character.
            if (cp === 0x5C) {
                id = id.substr(0, id.length - 1);
                if (source.charCodeAt(index) !== 0x75) {
                    throwUnexpectedToken();
                }
                ++index;
                if (source[index] === '{') {
                    ++index;
                    ch = scanUnicodeCodePointEscape();
                } else {
                    ch = scanHexEscape('u');
                    cp = ch.charCodeAt(0);
                    if (!ch || ch === '\\' || !isIdentifierPart(cp)) {
                        throwUnexpectedToken();
                    }
                }
                id += ch;
            }
        }

        return id;
    }

    function getIdentifier() {
        var start, ch;

        start = index++;
        while (index < length) {
            ch = source.charCodeAt(index);
            if (ch === 0x5C) {
                // Blackslash (U+005C) marks Unicode escape sequence.
                index = start;
                return getComplexIdentifier();
            } else if (ch >= 0xD800 && ch < 0xDFFF) {
                // Need to handle surrogate pairs.
                index = start;
                return getComplexIdentifier();
            }
            if (isIdentifierPart(ch)) {
                ++index;
            } else {
                break;
            }
        }

        return source.slice(start, index);
    }

    function scanIdentifier() {
        var start, id, type;

        start = index;

        // Backslash (U+005C) starts an escaped character.
        id = (source.charCodeAt(index) === 0x5C) ? getComplexIdentifier() : getIdentifier();

        // There is no keyword or literal with only one character.
        // Thus, it must be an identifier.
        if (id.length === 1) {
            type = Token.Identifier;
        } else if (isKeyword(id)) {
            type = Token.Keyword;
        } else if (id === 'null') {
            type = Token.NullLiteral;
        } else if (id === 'true' || id === 'false') {
            type = Token.BooleanLiteral;
        } else {
            type = Token.Identifier;
        }

        return {
            type: type,
            value: id,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }


    // ECMA-262 11.7 Punctuators

    function scanPunctuator() {
        var token, str;

        token = {
            type: Token.Punctuator,
            value: '',
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: index,
            end: index
        };

        // Check for most common single-character punctuators.
        str = source[index];
        switch (str) {

        case '(':
            if (extra.tokenize) {
                extra.openParenToken = extra.tokenValues.length;
            }
            ++index;
            break;

        case '{':
            if (extra.tokenize) {
                extra.openCurlyToken = extra.tokenValues.length;
            }
            state.curlyStack.push('{');
            ++index;
            break;

        case '.':
            ++index;
            if (source[index] === '.' && source[index + 1] === '.') {
                // Spread operator: ...
                index += 2;
                str = '...';
            }
            break;

        case '}':
            ++index;
            state.curlyStack.pop();
            break;
        case ')':
        case ';':
        case ',':
        case '[':
        case ']':
        case ':':
        case '?':
        case '~':
            ++index;
            break;

        default:
            // 4-character punctuator.
            str = source.substr(index, 4);
            if (str === '>>>=') {
                index += 4;
            } else {

                // 3-character punctuators.
                str = str.substr(0, 3);
                if (str === '===' || str === '!==' || str === '>>>' ||
                    str === '<<=' || str === '>>=') {
                    index += 3;
                } else {

                    // 2-character punctuators.
                    str = str.substr(0, 2);
                    if (str === '&&' || str === '||' || str === '==' || str === '!=' ||
                        str === '+=' || str === '-=' || str === '*=' || str === '/=' ||
                        str === '++' || str === '--' || str === '<<' || str === '>>' ||
                        str === '&=' || str === '|=' || str === '^=' || str === '%=' ||
                        str === '<=' || str === '>=' || str === '=>') {
                        index += 2;
                    } else {

                        // 1-character punctuators.
                        str = source[index];
                        if ('<>=!+-*%&|^/'.indexOf(str) >= 0) {
                            ++index;
                        }
                    }
                }
            }
        }

        if (index === token.start) {
            throwUnexpectedToken();
        }

        token.end = index;
        token.value = str;
        return token;
    }

    // ECMA-262 11.8.3 Numeric Literals

    function scanHexLiteral(start) {
        var number = '';

        while (index < length) {
            if (!isHexDigit(source[index])) {
                break;
            }
            number += source[index++];
        }

        if (number.length === 0) {
            throwUnexpectedToken();
        }

        if (isIdentifierStart(source.charCodeAt(index))) {
            throwUnexpectedToken();
        }

        return {
            type: Token.NumericLiteral,
            value: parseInt('0x' + number, 16),
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    function scanBinaryLiteral(start) {
        var ch, number;

        number = '';

        while (index < length) {
            ch = source[index];
            if (ch !== '0' && ch !== '1') {
                break;
            }
            number += source[index++];
        }

        if (number.length === 0) {
            // only 0b or 0B
            throwUnexpectedToken();
        }

        if (index < length) {
            ch = source.charCodeAt(index);
            /* istanbul ignore else */
            if (isIdentifierStart(ch) || isDecimalDigit(ch)) {
                throwUnexpectedToken();
            }
        }

        return {
            type: Token.NumericLiteral,
            value: parseInt(number, 2),
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    function scanOctalLiteral(prefix, start) {
        var number, octal;

        if (isOctalDigit(prefix)) {
            octal = true;
            number = '0' + source[index++];
        } else {
            octal = false;
            ++index;
            number = '';
        }

        while (index < length) {
            if (!isOctalDigit(source[index])) {
                break;
            }
            number += source[index++];
        }

        if (!octal && number.length === 0) {
            // only 0o or 0O
            throwUnexpectedToken();
        }

        if (isIdentifierStart(source.charCodeAt(index)) || isDecimalDigit(source.charCodeAt(index))) {
            throwUnexpectedToken();
        }

        return {
            type: Token.NumericLiteral,
            value: parseInt(number, 8),
            octal: octal,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    function isImplicitOctalLiteral() {
        var i, ch;

        // Implicit octal, unless there is a non-octal digit.
        // (Annex B.1.1 on Numeric Literals)
        for (i = index + 1; i < length; ++i) {
            ch = source[i];
            if (ch === '8' || ch === '9') {
                return false;
            }
            if (!isOctalDigit(ch)) {
                return true;
            }
        }

        return true;
    }

    function scanNumericLiteral() {
        var number, start, ch;

        ch = source[index];
        assert(isDecimalDigit(ch.charCodeAt(0)) || (ch === '.'),
            'Numeric literal must start with a decimal digit or a decimal point');

        start = index;
        number = '';
        if (ch !== '.') {
            number = source[index++];
            ch = source[index];

            // Hex number starts with '0x'.
            // Octal number starts with '0'.
            // Octal number in ES6 starts with '0o'.
            // Binary number in ES6 starts with '0b'.
            if (number === '0') {
                if (ch === 'x' || ch === 'X') {
                    ++index;
                    return scanHexLiteral(start);
                }
                if (ch === 'b' || ch === 'B') {
                    ++index;
                    return scanBinaryLiteral(start);
                }
                if (ch === 'o' || ch === 'O') {
                    return scanOctalLiteral(ch, start);
                }

                if (isOctalDigit(ch)) {
                    if (isImplicitOctalLiteral()) {
                        return scanOctalLiteral(ch, start);
                    }
                }
            }

            while (isDecimalDigit(source.charCodeAt(index))) {
                number += source[index++];
            }
            ch = source[index];
        }

        if (ch === '.') {
            number += source[index++];
            while (isDecimalDigit(source.charCodeAt(index))) {
                number += source[index++];
            }
            ch = source[index];
        }

        if (ch === 'e' || ch === 'E') {
            number += source[index++];

            ch = source[index];
            if (ch === '+' || ch === '-') {
                number += source[index++];
            }
            if (isDecimalDigit(source.charCodeAt(index))) {
                while (isDecimalDigit(source.charCodeAt(index))) {
                    number += source[index++];
                }
            } else {
                throwUnexpectedToken();
            }
        }

        if (isIdentifierStart(source.charCodeAt(index))) {
            throwUnexpectedToken();
        }

        return {
            type: Token.NumericLiteral,
            value: parseFloat(number),
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    // ECMA-262 11.8.4 String Literals

    function scanStringLiteral() {
        var str = '', quote, start, ch, unescaped, octToDec, octal = false;

        quote = source[index];
        assert((quote === '\'' || quote === '"'),
            'String literal must starts with a quote');

        start = index;
        ++index;

        while (index < length) {
            ch = source[index++];

            if (ch === quote) {
                quote = '';
                break;
            } else if (ch === '\\') {
                ch = source[index++];
                if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
                    switch (ch) {
                    case 'u':
                    case 'x':
                        if (source[index] === '{') {
                            ++index;
                            str += scanUnicodeCodePointEscape();
                        } else {
                            unescaped = scanHexEscape(ch);
                            if (!unescaped) {
                                throw throwUnexpectedToken();
                            }
                            str += unescaped;
                        }
                        break;
                    case 'n':
                        str += '\n';
                        break;
                    case 'r':
                        str += '\r';
                        break;
                    case 't':
                        str += '\t';
                        break;
                    case 'b':
                        str += '\b';
                        break;
                    case 'f':
                        str += '\f';
                        break;
                    case 'v':
                        str += '\x0B';
                        break;
                    case '8':
                    case '9':
                        str += ch;
                        tolerateUnexpectedToken();
                        break;

                    default:
                        if (isOctalDigit(ch)) {
                            octToDec = octalToDecimal(ch);

                            octal = octToDec.octal || octal;
                            str += String.fromCharCode(octToDec.code);
                        } else {
                            str += ch;
                        }
                        break;
                    }
                } else {
                    ++lineNumber;
                    if (ch === '\r' && source[index] === '\n') {
                        ++index;
                    }
                    lineStart = index;
                }
            } else if (isLineTerminator(ch.charCodeAt(0))) {
                break;
            } else {
                str += ch;
            }
        }

        if (quote !== '') {
            index = start;
            throwUnexpectedToken();
        }

        return {
            type: Token.StringLiteral,
            value: str,
            octal: octal,
            lineNumber: startLineNumber,
            lineStart: startLineStart,
            start: start,
            end: index
        };
    }

    // ECMA-262 11.8.6 Template Literal Lexical Components

    function scanTemplate() {
        var cooked = '', ch, start, rawOffset, terminated, head, tail, restore, unescaped;

        terminated = false;
        tail = false;
        start = index;
        head = (source[index] === '`');
        rawOffset = 2;

        ++index;

        while (index < length) {
            ch = source[index++];
            if (ch === '`') {
                rawOffset = 1;
                tail = true;
                terminated = true;
                break;
            } else if (ch === '$') {
                if (source[index] === '{') {
                    state.curlyStack.push('${');
                    ++index;
                    terminated = true;
                    break;
                }
                cooked += ch;
            } else if (ch === '\\') {
                ch = source[index++];
                if (!isLineTerminator(ch.charCodeAt(0))) {
                    switch (ch) {
                    case 'n':
                        cooked += '\n';
                        break;
                    case 'r':
                        cooked += '\r';
                        break;
                    case 't':
                        cooked += '\t';
                        break;
                    case 'u':
                    case 'x':
                        if (source[index] === '{') {
                            ++index;
                            cooked += scanUnicodeCodePointEscape();
                        } else {
                            restore = index;
                            unescaped = scanHexEscape(ch);
                            if (unescaped) {
                                cooked += unescaped;
                            } else {
                                index = restore;
                                cooked += ch;
                            }
                        }
                        break;
                    case 'b':
                        cooked += '\b';
                        break;
                    case 'f':
                        cooked += '\f';
                        break;
                    case 'v':
                        cooked += '\v';
                        break;

                    default:
                        if (ch === '0') {
                            if (isDecimalDigit(source.charCodeAt(index))) {
                                // Illegal: \01 \02 and so on
                                throwError(Messages.TemplateOctalLiteral);
                            }
                            cooked += '\0';
                        } else if (isOctalDigit(ch)) {
                            // Illegal: \1 \2
                            throwError(Messages.TemplateOctalLiteral);
                        } else {
                            cooked += ch;
                        }
                        break;
                    }
                } else {
                    ++lineNumber;
                    if (ch === '\r' && source[index] === '\n') {
                        ++index;
                    }
                    lineStart = index;
                }
            } else if (isLineTerminator(ch.charCodeAt(0))) {
                ++lineNumber;
                if (ch === '\r' && source[index] === '\n') {
                    ++index;
                }
                lineStart = index;
                cooked += '\n';
            } else {
                cooked += ch;
            }
        }

        if (!terminated) {
            throwUnexpectedToken();
        }

        if (!head) {
            state.curlyStack.pop();
        }

        return {
            type: Token.Template,
            value: {
                cooked: cooked,
                raw: source.slice(start + 1, index - rawOffset)
            },
            head: head,
            tail: tail,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    // ECMA-262 11.8.5 Regular Expression Literals

    function testRegExp(pattern, flags) {
        // The BMP character to use as a replacement for astral symbols when
        // translating an ES6 "u"-flagged pattern to an ES5-compatible
        // approximation.
        // Note: replacing with '\uFFFF' enables false positives in unlikely
        // scenarios. For example, `[\u{1044f}-\u{10440}]` is an invalid
        // pattern that would not be detected by this substitution.
        var astralSubstitute = '\uFFFF',
            tmp = pattern;

        if (flags.indexOf('u') >= 0) {
            tmp = tmp
                // Replace every Unicode escape sequence with the equivalent
                // BMP character or a constant ASCII code point in the case of
                // astral symbols. (See the above note on `astralSubstitute`
                // for more information.)
                .replace(/\\u\{([0-9a-fA-F]+)\}|\\u([a-fA-F0-9]{4})/g, function ($0, $1, $2) {
                    var codePoint = parseInt($1 || $2, 16);
                    if (codePoint > 0x10FFFF) {
                        throwUnexpectedToken(null, Messages.InvalidRegExp);
                    }
                    if (codePoint <= 0xFFFF) {
                        return String.fromCharCode(codePoint);
                    }
                    return astralSubstitute;
                })
                // Replace each paired surrogate with a single ASCII symbol to
                // avoid throwing on regular expressions that are only valid in
                // combination with the "u" flag.
                .replace(
                    /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
                    astralSubstitute
                );
        }

        // First, detect invalid regular expressions.
        try {
            RegExp(tmp);
        } catch (e) {
            throwUnexpectedToken(null, Messages.InvalidRegExp);
        }

        // Return a regular expression object for this pattern-flag pair, or
        // `null` in case the current environment doesn't support the flags it
        // uses.
        try {
            return new RegExp(pattern, flags);
        } catch (exception) {
            /* istanbul ignore next */
            return null;
        }
    }

    function scanRegExpBody() {
        var ch, str, classMarker, terminated, body;

        ch = source[index];
        assert(ch === '/', 'Regular expression literal must start with a slash');
        str = source[index++];

        classMarker = false;
        terminated = false;
        while (index < length) {
            ch = source[index++];
            str += ch;
            if (ch === '\\') {
                ch = source[index++];
                // ECMA-262 7.8.5
                if (isLineTerminator(ch.charCodeAt(0))) {
                    throwUnexpectedToken(null, Messages.UnterminatedRegExp);
                }
                str += ch;
            } else if (isLineTerminator(ch.charCodeAt(0))) {
                throwUnexpectedToken(null, Messages.UnterminatedRegExp);
            } else if (classMarker) {
                if (ch === ']') {
                    classMarker = false;
                }
            } else {
                if (ch === '/') {
                    terminated = true;
                    break;
                } else if (ch === '[') {
                    classMarker = true;
                }
            }
        }

        if (!terminated) {
            throwUnexpectedToken(null, Messages.UnterminatedRegExp);
        }

        // Exclude leading and trailing slash.
        body = str.substr(1, str.length - 2);
        return {
            value: body,
            literal: str
        };
    }

    function scanRegExpFlags() {
        var ch, str, flags, restore;

        str = '';
        flags = '';
        while (index < length) {
            ch = source[index];
            if (!isIdentifierPart(ch.charCodeAt(0))) {
                break;
            }

            ++index;
            if (ch === '\\' && index < length) {
                ch = source[index];
                if (ch === 'u') {
                    ++index;
                    restore = index;
                    ch = scanHexEscape('u');
                    if (ch) {
                        flags += ch;
                        for (str += '\\u'; restore < index; ++restore) {
                            str += source[restore];
                        }
                    } else {
                        index = restore;
                        flags += 'u';
                        str += '\\u';
                    }
                    tolerateUnexpectedToken();
                } else {
                    str += '\\';
                    tolerateUnexpectedToken();
                }
            } else {
                flags += ch;
                str += ch;
            }
        }

        return {
            value: flags,
            literal: str
        };
    }

    function scanRegExp() {
        var start, body, flags, value;
        scanning = true;

        lookahead = null;
        skipComment();
        start = index;

        body = scanRegExpBody();
        flags = scanRegExpFlags();
        value = testRegExp(body.value, flags.value);
        scanning = false;
        if (extra.tokenize) {
            return {
                type: Token.RegularExpression,
                value: value,
                regex: {
                    pattern: body.value,
                    flags: flags.value
                },
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: start,
                end: index
            };
        }

        return {
            literal: body.literal + flags.literal,
            value: value,
            regex: {
                pattern: body.value,
                flags: flags.value
            },
            start: start,
            end: index
        };
    }

    function collectRegex() {
        var pos, loc, regex, token;

        skipComment();

        pos = index;
        loc = {
            start: {
                line: lineNumber,
                column: index - lineStart
            }
        };

        regex = scanRegExp();

        loc.end = {
            line: lineNumber,
            column: index - lineStart
        };

        /* istanbul ignore next */
        if (!extra.tokenize) {
            // Pop the previous token, which is likely '/' or '/='
            if (extra.tokens.length > 0) {
                token = extra.tokens[extra.tokens.length - 1];
                if (token.range[0] === pos && token.type === 'Punctuator') {
                    if (token.value === '/' || token.value === '/=') {
                        extra.tokens.pop();
                    }
                }
            }

            extra.tokens.push({
                type: 'RegularExpression',
                value: regex.literal,
                regex: regex.regex,
                range: [pos, index],
                loc: loc
            });
        }

        return regex;
    }

    function isIdentifierName(token) {
        return token.type === Token.Identifier ||
            token.type === Token.Keyword ||
            token.type === Token.BooleanLiteral ||
            token.type === Token.NullLiteral;
    }

    // Using the following algorithm:
    // https://github.com/mozilla/sweet.js/wiki/design

    function advanceSlash() {
        var regex, previous, check;

        function testKeyword(value) {
            return value && (value.length > 1) && (value[0] >= 'a') && (value[0] <= 'z');
        }

        previous = extra.tokenValues[extra.tokenValues.length - 1];
        regex = (previous !== null);

        switch (previous) {
        case 'this':
        case ']':
            regex = false;
            break;

        case ')':
            check = extra.tokenValues[extra.openParenToken - 1];
            regex = (check === 'if' || check === 'while' || check === 'for' || check === 'with');
            break;

        case '}':
            // Dividing a function by anything makes little sense,
            // but we have to check for that.
            regex = false;
            if (testKeyword(extra.tokenValues[extra.openCurlyToken - 3])) {
                // Anonymous function, e.g. function(){} /42
                check = extra.tokenValues[extra.openCurlyToken - 4];
                regex = check ? (FnExprTokens.indexOf(check) < 0) : false;
            } else if (testKeyword(extra.tokenValues[extra.openCurlyToken - 4])) {
                // Named function, e.g. function f(){} /42/
                check = extra.tokenValues[extra.openCurlyToken - 5];
                regex = check ? (FnExprTokens.indexOf(check) < 0) : true;
            }
        }

        return regex ? collectRegex() : scanPunctuator();
    }

    function advance() {
        var cp, token;

        if (index >= length) {
            return {
                type: Token.EOF,
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: index,
                end: index
            };
        }

        cp = source.charCodeAt(index);

        if (isIdentifierStart(cp)) {
            token = scanIdentifier();
            if (strict && isStrictModeReservedWord(token.value)) {
                token.type = Token.Keyword;
            }
            return token;
        }

        // Very common: ( and ) and ;
        if (cp === 0x28 || cp === 0x29 || cp === 0x3B) {
            return scanPunctuator();
        }

        // String literal starts with single quote (U+0027) or double quote (U+0022).
        if (cp === 0x27 || cp === 0x22) {
            return scanStringLiteral();
        }

        // Dot (.) U+002E can also start a floating-point number, hence the need
        // to check the next character.
        if (cp === 0x2E) {
            if (isDecimalDigit(source.charCodeAt(index + 1))) {
                return scanNumericLiteral();
            }
            return scanPunctuator();
        }

        if (isDecimalDigit(cp)) {
            return scanNumericLiteral();
        }

        // Slash (/) U+002F can also start a regex.
        if (extra.tokenize && cp === 0x2F) {
            return advanceSlash();
        }

        // Template literals start with ` (U+0060) for template head
        // or } (U+007D) for template middle or template tail.
        if (cp === 0x60 || (cp === 0x7D && state.curlyStack[state.curlyStack.length - 1] === '${')) {
            return scanTemplate();
        }

        // Possible identifier start in a surrogate pair.
        if (cp >= 0xD800 && cp < 0xDFFF) {
            cp = codePointAt(index);
            if (isIdentifierStart(cp)) {
                return scanIdentifier();
            }
        }

        return scanPunctuator();
    }

    function collectToken() {
        var loc, token, value, entry;

        loc = {
            start: {
                line: lineNumber,
                column: index - lineStart
            }
        };

        token = advance();
        loc.end = {
            line: lineNumber,
            column: index - lineStart
        };

        if (token.type !== Token.EOF) {
            value = source.slice(token.start, token.end);
            entry = {
                type: TokenName[token.type],
                value: value,
                range: [token.start, token.end],
                loc: loc
            };
            if (token.regex) {
                entry.regex = {
                    pattern: token.regex.pattern,
                    flags: token.regex.flags
                };
            }
            if (extra.tokenValues) {
                extra.tokenValues.push((entry.type === 'Punctuator' || entry.type === 'Keyword') ? entry.value : null);
            }
            if (extra.tokenize) {
                if (!extra.range) {
                    delete entry.range;
                }
                if (!extra.loc) {
                    delete entry.loc;
                }
                if (extra.delegate) {
                    entry = extra.delegate(entry);
                }
            }
            extra.tokens.push(entry);
        }

        return token;
    }

    function lex() {
        var token;
        scanning = true;

        lastIndex = index;
        lastLineNumber = lineNumber;
        lastLineStart = lineStart;

        skipComment();

        token = lookahead;

        startIndex = index;
        startLineNumber = lineNumber;
        startLineStart = lineStart;

        lookahead = (typeof extra.tokens !== 'undefined') ? collectToken() : advance();
        scanning = false;
        return token;
    }

    function peek() {
        scanning = true;

        skipComment();

        lastIndex = index;
        lastLineNumber = lineNumber;
        lastLineStart = lineStart;

        startIndex = index;
        startLineNumber = lineNumber;
        startLineStart = lineStart;

        lookahead = (typeof extra.tokens !== 'undefined') ? collectToken() : advance();
        scanning = false;
    }

    function Position() {
        this.line = startLineNumber;
        this.column = startIndex - startLineStart;
    }

    function SourceLocation() {
        this.start = new Position();
        this.end = null;
    }

    function WrappingSourceLocation(startToken) {
        this.start = {
            line: startToken.lineNumber,
            column: startToken.start - startToken.lineStart
        };
        this.end = null;
    }

    function Node() {
        if (extra.range) {
            this.range = [startIndex, 0];
        }
        if (extra.loc) {
            this.loc = new SourceLocation();
        }
    }

    function WrappingNode(startToken) {
        if (extra.range) {
            this.range = [startToken.start, 0];
        }
        if (extra.loc) {
            this.loc = new WrappingSourceLocation(startToken);
        }
    }

    WrappingNode.prototype = Node.prototype = {

        processComment: function () {
            var lastChild,
                innerComments,
                leadingComments,
                trailingComments,
                bottomRight = extra.bottomRightStack,
                i,
                comment,
                last = bottomRight[bottomRight.length - 1];

            if (this.type === Syntax.Program) {
                if (this.body.length > 0) {
                    return;
                }
            }
            /**
             * patch innnerComments for properties empty block
             * `function a() {/** comments **\/}`
             */

            if (this.type === Syntax.BlockStatement && this.body.length === 0) {
                innerComments = [];
                for (i = extra.leadingComments.length - 1; i >= 0; --i) {
                    comment = extra.leadingComments[i];
                    if (this.range[1] >= comment.range[1]) {
                        innerComments.unshift(comment);
                        extra.leadingComments.splice(i, 1);
                        extra.trailingComments.splice(i, 1);
                    }
                }
                if (innerComments.length) {
                    this.innerComments = innerComments;
                    //bottomRight.push(this);
                    return;
                }
            }

            if (extra.trailingComments.length > 0) {
                trailingComments = [];
                for (i = extra.trailingComments.length - 1; i >= 0; --i) {
                    comment = extra.trailingComments[i];
                    if (comment.range[0] >= this.range[1]) {
                        trailingComments.unshift(comment);
                        extra.trailingComments.splice(i, 1);
                    }
                }
                extra.trailingComments = [];
            } else {
                if (last && last.trailingComments && last.trailingComments[0].range[0] >= this.range[1]) {
                    trailingComments = last.trailingComments;
                    delete last.trailingComments;
                }
            }

            // Eating the stack.
            while (last && last.range[0] >= this.range[0]) {
                lastChild = bottomRight.pop();
                last = bottomRight[bottomRight.length - 1];
            }

            if (lastChild) {
                if (lastChild.leadingComments) {
                    leadingComments = [];
                    for (i = lastChild.leadingComments.length - 1; i >= 0; --i) {
                        comment = lastChild.leadingComments[i];
                        if (comment.range[1] <= this.range[0]) {
                            leadingComments.unshift(comment);
                            lastChild.leadingComments.splice(i, 1);
                        }
                    }

                    if (!lastChild.leadingComments.length) {
                        lastChild.leadingComments = undefined;
                    }
                }
            } else if (extra.leadingComments.length > 0) {
                leadingComments = [];
                for (i = extra.leadingComments.length - 1; i >= 0; --i) {
                    comment = extra.leadingComments[i];
                    if (comment.range[1] <= this.range[0]) {
                        leadingComments.unshift(comment);
                        extra.leadingComments.splice(i, 1);
                    }
                }
            }


            if (leadingComments && leadingComments.length > 0) {
                this.leadingComments = leadingComments;
            }
            if (trailingComments && trailingComments.length > 0) {
                this.trailingComments = trailingComments;
            }

            bottomRight.push(this);
        },

        finish: function () {
            if (extra.range) {
                this.range[1] = lastIndex;
            }
            if (extra.loc) {
                this.loc.end = {
                    line: lastLineNumber,
                    column: lastIndex - lastLineStart
                };
                if (extra.source) {
                    this.loc.source = extra.source;
                }
            }

            if (extra.attachComment) {
                this.processComment();
            }
        },

        finishArrayExpression: function (elements) {
            this.type = Syntax.ArrayExpression;
            this.elements = elements;
            this.finish();
            return this;
        },

        finishArrayPattern: function (elements) {
            this.type = Syntax.ArrayPattern;
            this.elements = elements;
            this.finish();
            return this;
        },

        finishArrowFunctionExpression: function (params, defaults, body, expression) {
            this.type = Syntax.ArrowFunctionExpression;
            this.id = null;
            this.params = params;
            this.defaults = defaults;
            this.body = body;
            this.generator = false;
            this.expression = expression;
            this.finish();
            return this;
        },

        finishAssignmentExpression: function (operator, left, right) {
            this.type = Syntax.AssignmentExpression;
            this.operator = operator;
            this.left = left;
            this.right = right;
            this.finish();
            return this;
        },

        finishAssignmentPattern: function (left, right) {
            this.type = Syntax.AssignmentPattern;
            this.left = left;
            this.right = right;
            this.finish();
            return this;
        },

        finishBinaryExpression: function (operator, left, right) {
            this.type = (operator === '||' || operator === '&&') ? Syntax.LogicalExpression : Syntax.BinaryExpression;
            this.operator = operator;
            this.left = left;
            this.right = right;
            this.finish();
            return this;
        },

        finishBlockStatement: function (body) {
            this.type = Syntax.BlockStatement;
            this.body = body;
            this.finish();
            return this;
        },

        finishBreakStatement: function (label) {
            this.type = Syntax.BreakStatement;
            this.label = label;
            this.finish();
            return this;
        },

        finishCallExpression: function (callee, args) {
            this.type = Syntax.CallExpression;
            this.callee = callee;
            this.arguments = args;
            this.finish();
            return this;
        },

        finishCatchClause: function (param, body) {
            this.type = Syntax.CatchClause;
            this.param = param;
            this.body = body;
            this.finish();
            return this;
        },

        finishClassBody: function (body) {
            this.type = Syntax.ClassBody;
            this.body = body;
            this.finish();
            return this;
        },

        finishClassDeclaration: function (id, superClass, body) {
            this.type = Syntax.ClassDeclaration;
            this.id = id;
            this.superClass = superClass;
            this.body = body;
            this.finish();
            return this;
        },

        finishClassExpression: function (id, superClass, body) {
            this.type = Syntax.ClassExpression;
            this.id = id;
            this.superClass = superClass;
            this.body = body;
            this.finish();
            return this;
        },

        finishConditionalExpression: function (test, consequent, alternate) {
            this.type = Syntax.ConditionalExpression;
            this.test = test;
            this.consequent = consequent;
            this.alternate = alternate;
            this.finish();
            return this;
        },

        finishContinueStatement: function (label) {
            this.type = Syntax.ContinueStatement;
            this.label = label;
            this.finish();
            return this;
        },

        finishDebuggerStatement: function () {
            this.type = Syntax.DebuggerStatement;
            this.finish();
            return this;
        },

        finishDoWhileStatement: function (body, test) {
            this.type = Syntax.DoWhileStatement;
            this.body = body;
            this.test = test;
            this.finish();
            return this;
        },

        finishEmptyStatement: function () {
            this.type = Syntax.EmptyStatement;
            this.finish();
            return this;
        },

        finishExpressionStatement: function (expression) {
            this.type = Syntax.ExpressionStatement;
            this.expression = expression;
            this.finish();
            return this;
        },

        finishForStatement: function (init, test, update, body) {
            this.type = Syntax.ForStatement;
            this.init = init;
            this.test = test;
            this.update = update;
            this.body = body;
            this.finish();
            return this;
        },

        finishForOfStatement: function (left, right, body) {
            this.type = Syntax.ForOfStatement;
            this.left = left;
            this.right = right;
            this.body = body;
            this.finish();
            return this;
        },

        finishForInStatement: function (left, right, body) {
            this.type = Syntax.ForInStatement;
            this.left = left;
            this.right = right;
            this.body = body;
            this.each = false;
            this.finish();
            return this;
        },

        finishFunctionDeclaration: function (id, params, defaults, body, generator) {
            this.type = Syntax.FunctionDeclaration;
            this.id = id;
            this.params = params;
            this.defaults = defaults;
            this.body = body;
            this.generator = generator;
            this.expression = false;
            this.finish();
            return this;
        },

        finishFunctionExpression: function (id, params, defaults, body, generator) {
            this.type = Syntax.FunctionExpression;
            this.id = id;
            this.params = params;
            this.defaults = defaults;
            this.body = body;
            this.generator = generator;
            this.expression = false;
            this.finish();
            return this;
        },

        finishIdentifier: function (name) {
            this.type = Syntax.Identifier;
            this.name = name;
            this.finish();
            return this;
        },

        finishIfStatement: function (test, consequent, alternate) {
            this.type = Syntax.IfStatement;
            this.test = test;
            this.consequent = consequent;
            this.alternate = alternate;
            this.finish();
            return this;
        },

        finishLabeledStatement: function (label, body) {
            this.type = Syntax.LabeledStatement;
            this.label = label;
            this.body = body;
            this.finish();
            return this;
        },

        finishLiteral: function (token) {
            this.type = Syntax.Literal;
            this.value = token.value;
            this.raw = source.slice(token.start, token.end);
            if (token.regex) {
                this.regex = token.regex;
            }
            this.finish();
            return this;
        },

        finishMemberExpression: function (accessor, object, property) {
            this.type = Syntax.MemberExpression;
            this.computed = accessor === '[';
            this.object = object;
            this.property = property;
            this.finish();
            return this;
        },

        finishMetaProperty: function (meta, property) {
            this.type = Syntax.MetaProperty;
            this.meta = meta;
            this.property = property;
            this.finish();
            return this;
        },

        finishNewExpression: function (callee, args) {
            this.type = Syntax.NewExpression;
            this.callee = callee;
            this.arguments = args;
            this.finish();
            return this;
        },

        finishObjectExpression: function (properties) {
            this.type = Syntax.ObjectExpression;
            this.properties = properties;
            this.finish();
            return this;
        },

        finishObjectPattern: function (properties) {
            this.type = Syntax.ObjectPattern;
            this.properties = properties;
            this.finish();
            return this;
        },

        finishPostfixExpression: function (operator, argument) {
            this.type = Syntax.UpdateExpression;
            this.operator = operator;
            this.argument = argument;
            this.prefix = false;
            this.finish();
            return this;
        },

        finishProgram: function (body, sourceType) {
            this.type = Syntax.Program;
            this.body = body;
            this.sourceType = sourceType;
            this.finish();
            return this;
        },

        finishProperty: function (kind, key, computed, value, method, shorthand) {
            this.type = Syntax.Property;
            this.key = key;
            this.computed = computed;
            this.value = value;
            this.kind = kind;
            this.method = method;
            this.shorthand = shorthand;
            this.finish();
            return this;
        },

        finishRestElement: function (argument) {
            this.type = Syntax.RestElement;
            this.argument = argument;
            this.finish();
            return this;
        },

        finishReturnStatement: function (argument) {
            this.type = Syntax.ReturnStatement;
            this.argument = argument;
            this.finish();
            return this;
        },

        finishSequenceExpression: function (expressions) {
            this.type = Syntax.SequenceExpression;
            this.expressions = expressions;
            this.finish();
            return this;
        },

        finishSpreadElement: function (argument) {
            this.type = Syntax.SpreadElement;
            this.argument = argument;
            this.finish();
            return this;
        },

        finishSwitchCase: function (test, consequent) {
            this.type = Syntax.SwitchCase;
            this.test = test;
            this.consequent = consequent;
            this.finish();
            return this;
        },

        finishSuper: function () {
            this.type = Syntax.Super;
            this.finish();
            return this;
        },

        finishSwitchStatement: function (discriminant, cases) {
            this.type = Syntax.SwitchStatement;
            this.discriminant = discriminant;
            this.cases = cases;
            this.finish();
            return this;
        },

        finishTaggedTemplateExpression: function (tag, quasi) {
            this.type = Syntax.TaggedTemplateExpression;
            this.tag = tag;
            this.quasi = quasi;
            this.finish();
            return this;
        },

        finishTemplateElement: function (value, tail) {
            this.type = Syntax.TemplateElement;
            this.value = value;
            this.tail = tail;
            this.finish();
            return this;
        },

        finishTemplateLiteral: function (quasis, expressions) {
            this.type = Syntax.TemplateLiteral;
            this.quasis = quasis;
            this.expressions = expressions;
            this.finish();
            return this;
        },

        finishThisExpression: function () {
            this.type = Syntax.ThisExpression;
            this.finish();
            return this;
        },

        finishThrowStatement: function (argument) {
            this.type = Syntax.ThrowStatement;
            this.argument = argument;
            this.finish();
            return this;
        },

        finishTryStatement: function (block, handler, finalizer) {
            this.type = Syntax.TryStatement;
            this.block = block;
            this.guardedHandlers = [];
            this.handlers = handler ? [handler] : [];
            this.handler = handler;
            this.finalizer = finalizer;
            this.finish();
            return this;
        },

        finishUnaryExpression: function (operator, argument) {
            this.type = (operator === '++' || operator === '--') ? Syntax.UpdateExpression : Syntax.UnaryExpression;
            this.operator = operator;
            this.argument = argument;
            this.prefix = true;
            this.finish();
            return this;
        },

        finishVariableDeclaration: function (declarations) {
            this.type = Syntax.VariableDeclaration;
            this.declarations = declarations;
            this.kind = 'var';
            this.finish();
            return this;
        },

        finishLexicalDeclaration: function (declarations, kind) {
            this.type = Syntax.VariableDeclaration;
            this.declarations = declarations;
            this.kind = kind;
            this.finish();
            return this;
        },

        finishVariableDeclarator: function (id, init) {
            this.type = Syntax.VariableDeclarator;
            this.id = id;
            this.init = init;
            this.finish();
            return this;
        },

        finishWhileStatement: function (test, body) {
            this.type = Syntax.WhileStatement;
            this.test = test;
            this.body = body;
            this.finish();
            return this;
        },

        finishWithStatement: function (object, body) {
            this.type = Syntax.WithStatement;
            this.object = object;
            this.body = body;
            this.finish();
            return this;
        },

        finishExportSpecifier: function (local, exported) {
            this.type = Syntax.ExportSpecifier;
            this.exported = exported || local;
            this.local = local;
            this.finish();
            return this;
        },

        finishImportDefaultSpecifier: function (local) {
            this.type = Syntax.ImportDefaultSpecifier;
            this.local = local;
            this.finish();
            return this;
        },

        finishImportNamespaceSpecifier: function (local) {
            this.type = Syntax.ImportNamespaceSpecifier;
            this.local = local;
            this.finish();
            return this;
        },

        finishExportNamedDeclaration: function (declaration, specifiers, src) {
            this.type = Syntax.ExportNamedDeclaration;
            this.declaration = declaration;
            this.specifiers = specifiers;
            this.source = src;
            this.finish();
            return this;
        },

        finishExportDefaultDeclaration: function (declaration) {
            this.type = Syntax.ExportDefaultDeclaration;
            this.declaration = declaration;
            this.finish();
            return this;
        },

        finishExportAllDeclaration: function (src) {
            this.type = Syntax.ExportAllDeclaration;
            this.source = src;
            this.finish();
            return this;
        },

        finishImportSpecifier: function (local, imported) {
            this.type = Syntax.ImportSpecifier;
            this.local = local || imported;
            this.imported = imported;
            this.finish();
            return this;
        },

        finishImportDeclaration: function (specifiers, src) {
            this.type = Syntax.ImportDeclaration;
            this.specifiers = specifiers;
            this.source = src;
            this.finish();
            return this;
        },

        finishYieldExpression: function (argument, delegate) {
            this.type = Syntax.YieldExpression;
            this.argument = argument;
            this.delegate = delegate;
            this.finish();
            return this;
        }
    };


    function recordError(error) {
        var e, existing;

        for (e = 0; e < extra.errors.length; e++) {
            existing = extra.errors[e];
            // Prevent duplicated error.
            /* istanbul ignore next */
            if (existing.index === error.index && existing.message === error.message) {
                return;
            }
        }

        extra.errors.push(error);
    }

    function constructError(msg, column) {
        var error = new Error(msg);
        try {
            throw error;
        } catch (base) {
            /* istanbul ignore else */
            if (Object.create && Object.defineProperty) {
                error = Object.create(base);
                Object.defineProperty(error, 'column', { value: column });
            }
        } finally {
            return error;
        }
    }

    function createError(line, pos, description) {
        var msg, column, error;

        msg = 'Line ' + line + ': ' + description;
        column = pos - (scanning ? lineStart : lastLineStart) + 1;
        error = constructError(msg, column);
        error.lineNumber = line;
        error.description = description;
        error.index = pos;
        return error;
    }

    // Throw an exception

    function throwError(messageFormat) {
        var args, msg;

        args = Array.prototype.slice.call(arguments, 1);
        msg = messageFormat.replace(/%(\d)/g,
            function (whole, idx) {
                assert(idx < args.length, 'Message reference must be in range');
                return args[idx];
            }
        );

        throw createError(lastLineNumber, lastIndex, msg);
    }

    function tolerateError(messageFormat) {
        var args, msg, error;

        args = Array.prototype.slice.call(arguments, 1);
        /* istanbul ignore next */
        msg = messageFormat.replace(/%(\d)/g,
            function (whole, idx) {
                assert(idx < args.length, 'Message reference must be in range');
                return args[idx];
            }
        );

        error = createError(lineNumber, lastIndex, msg);
        if (extra.errors) {
            recordError(error);
        } else {
            throw error;
        }
    }

    // Throw an exception because of the token.

    function unexpectedTokenError(token, message) {
        var value, msg = message || Messages.UnexpectedToken;

        if (token) {
            if (!message) {
                msg = (token.type === Token.EOF) ? Messages.UnexpectedEOS :
                    (token.type === Token.Identifier) ? Messages.UnexpectedIdentifier :
                    (token.type === Token.NumericLiteral) ? Messages.UnexpectedNumber :
                    (token.type === Token.StringLiteral) ? Messages.UnexpectedString :
                    (token.type === Token.Template) ? Messages.UnexpectedTemplate :
                    Messages.UnexpectedToken;

                if (token.type === Token.Keyword) {
                    if (isFutureReservedWord(token.value)) {
                        msg = Messages.UnexpectedReserved;
                    } else if (strict && isStrictModeReservedWord(token.value)) {
                        msg = Messages.StrictReservedWord;
                    }
                }
            }

            value = (token.type === Token.Template) ? token.value.raw : token.value;
        } else {
            value = 'ILLEGAL';
        }

        msg = msg.replace('%0', value);

        return (token && typeof token.lineNumber === 'number') ?
            createError(token.lineNumber, token.start, msg) :
            createError(scanning ? lineNumber : lastLineNumber, scanning ? index : lastIndex, msg);
    }

    function throwUnexpectedToken(token, message) {
        throw unexpectedTokenError(token, message);
    }

    function tolerateUnexpectedToken(token, message) {
        var error = unexpectedTokenError(token, message);
        if (extra.errors) {
            recordError(error);
        } else {
            throw error;
        }
    }

    // Expect the next token to match the specified punctuator.
    // If not, an exception will be thrown.

    function expect(value) {
        var token = lex();
        if (token.type !== Token.Punctuator || token.value !== value) {
            throwUnexpectedToken(token);
        }
    }

    /**
     * @name expectCommaSeparator
     * @description Quietly expect a comma when in tolerant mode, otherwise delegates
     * to <code>expect(value)</code>
     * @since 2.0
     */
    function expectCommaSeparator() {
        var token;

        if (extra.errors) {
            token = lookahead;
            if (token.type === Token.Punctuator && token.value === ',') {
                lex();
            } else if (token.type === Token.Punctuator && token.value === ';') {
                lex();
                tolerateUnexpectedToken(token);
            } else {
                tolerateUnexpectedToken(token, Messages.UnexpectedToken);
            }
        } else {
            expect(',');
        }
    }

    // Expect the next token to match the specified keyword.
    // If not, an exception will be thrown.

    function expectKeyword(keyword) {
        var token = lex();
        if (token.type !== Token.Keyword || token.value !== keyword) {
            throwUnexpectedToken(token);
        }
    }

    // Return true if the next token matches the specified punctuator.

    function match(value) {
        return lookahead.type === Token.Punctuator && lookahead.value === value;
    }

    // Return true if the next token matches the specified keyword

    function matchKeyword(keyword) {
        return lookahead.type === Token.Keyword && lookahead.value === keyword;
    }

    // Return true if the next token matches the specified contextual keyword
    // (where an identifier is sometimes a keyword depending on the context)

    function matchContextualKeyword(keyword) {
        return lookahead.type === Token.Identifier && lookahead.value === keyword;
    }

    // Return true if the next token is an assignment operator

    function matchAssign() {
        var op;

        if (lookahead.type !== Token.Punctuator) {
            return false;
        }
        op = lookahead.value;
        return op === '=' ||
            op === '*=' ||
            op === '/=' ||
            op === '%=' ||
            op === '+=' ||
            op === '-=' ||
            op === '<<=' ||
            op === '>>=' ||
            op === '>>>=' ||
            op === '&=' ||
            op === '^=' ||
            op === '|=';
    }

    function consumeSemicolon() {
        // Catch the very common case first: immediately a semicolon (U+003B).
        if (source.charCodeAt(startIndex) === 0x3B || match(';')) {
            lex();
            return;
        }

        if (hasLineTerminator) {
            return;
        }

        // FIXME(ikarienator): this is seemingly an issue in the previous location info convention.
        lastIndex = startIndex;
        lastLineNumber = startLineNumber;
        lastLineStart = startLineStart;

        if (lookahead.type !== Token.EOF && !match('}')) {
            throwUnexpectedToken(lookahead);
        }
    }

    // Cover grammar support.
    //
    // When an assignment expression position starts with an left parenthesis, the determination of the type
    // of the syntax is to be deferred arbitrarily long until the end of the parentheses pair (plus a lookahead)
    // or the first comma. This situation also defers the determination of all the expressions nested in the pair.
    //
    // There are three productions that can be parsed in a parentheses pair that needs to be determined
    // after the outermost pair is closed. They are:
    //
    //   1. AssignmentExpression
    //   2. BindingElements
    //   3. AssignmentTargets
    //
    // In order to avoid exponential backtracking, we use two flags to denote if the production can be
    // binding element or assignment target.
    //
    // The three productions have the relationship:
    //
    //   BindingElements ⊆ AssignmentTargets ⊆ AssignmentExpression
    //
    // with a single exception that CoverInitializedName when used directly in an Expression, generates
    // an early error. Therefore, we need the third state, firstCoverInitializedNameError, to track the
    // first usage of CoverInitializedName and report it when we reached the end of the parentheses pair.
    //
    // isolateCoverGrammar function runs the given parser function with a new cover grammar context, and it does not
    // effect the current flags. This means the production the parser parses is only used as an expression. Therefore
    // the CoverInitializedName check is conducted.
    //
    // inheritCoverGrammar function runs the given parse function with a new cover grammar context, and it propagates
    // the flags outside of the parser. This means the production the parser parses is used as a part of a potential
    // pattern. The CoverInitializedName check is deferred.
    function isolateCoverGrammar(parser) {
        var oldIsBindingElement = isBindingElement,
            oldIsAssignmentTarget = isAssignmentTarget,
            oldFirstCoverInitializedNameError = firstCoverInitializedNameError,
            result;
        isBindingElement = true;
        isAssignmentTarget = true;
        firstCoverInitializedNameError = null;
        result = parser();
        if (firstCoverInitializedNameError !== null) {
            throwUnexpectedToken(firstCoverInitializedNameError);
        }
        isBindingElement = oldIsBindingElement;
        isAssignmentTarget = oldIsAssignmentTarget;
        firstCoverInitializedNameError = oldFirstCoverInitializedNameError;
        return result;
    }

    function inheritCoverGrammar(parser) {
        var oldIsBindingElement = isBindingElement,
            oldIsAssignmentTarget = isAssignmentTarget,
            oldFirstCoverInitializedNameError = firstCoverInitializedNameError,
            result;
        isBindingElement = true;
        isAssignmentTarget = true;
        firstCoverInitializedNameError = null;
        result = parser();
        isBindingElement = isBindingElement && oldIsBindingElement;
        isAssignmentTarget = isAssignmentTarget && oldIsAssignmentTarget;
        firstCoverInitializedNameError = oldFirstCoverInitializedNameError || firstCoverInitializedNameError;
        return result;
    }

    // ECMA-262 13.3.3 Destructuring Binding Patterns

    function parseArrayPattern(params, kind) {
        var node = new Node(), elements = [], rest, restNode;
        expect('[');

        while (!match(']')) {
            if (match(',')) {
                lex();
                elements.push(null);
            } else {
                if (match('...')) {
                    restNode = new Node();
                    lex();
                    params.push(lookahead);
                    rest = parseVariableIdentifier(kind);
                    elements.push(restNode.finishRestElement(rest));
                    break;
                } else {
                    elements.push(parsePatternWithDefault(params, kind));
                }
                if (!match(']')) {
                    expect(',');
                }
            }

        }

        expect(']');

        return node.finishArrayPattern(elements);
    }

    function parsePropertyPattern(params, kind) {
        var node = new Node(), key, keyToken, computed = match('['), init;
        if (lookahead.type === Token.Identifier) {
            keyToken = lookahead;
            key = parseVariableIdentifier();
            if (match('=')) {
                params.push(keyToken);
                lex();
                init = parseAssignmentExpression();

                return node.finishProperty(
                    'init', key, false,
                    new WrappingNode(keyToken).finishAssignmentPattern(key, init), false, true);
            } else if (!match(':')) {
                params.push(keyToken);
                return node.finishProperty('init', key, false, key, false, true);
            }
        } else {
            key = parseObjectPropertyKey();
        }
        expect(':');
        init = parsePatternWithDefault(params, kind);
        return node.finishProperty('init', key, computed, init, false, false);
    }

    function parseObjectPattern(params, kind) {
        var node = new Node(), properties = [];

        expect('{');

        while (!match('}')) {
            properties.push(parsePropertyPattern(params, kind));
            if (!match('}')) {
                expect(',');
            }
        }

        lex();

        return node.finishObjectPattern(properties);
    }

    function parsePattern(params, kind) {
        if (match('[')) {
            return parseArrayPattern(params, kind);
        } else if (match('{')) {
            return parseObjectPattern(params, kind);
        } else if (matchKeyword('let')) {
            if (kind === 'const' || kind === 'let') {
                tolerateUnexpectedToken(lookahead, Messages.UnexpectedToken);
            }
        }

        params.push(lookahead);
        return parseVariableIdentifier(kind);
    }

    function parsePatternWithDefault(params, kind) {
        var startToken = lookahead, pattern, previousAllowYield, right;
        pattern = parsePattern(params, kind);
        if (match('=')) {
            lex();
            previousAllowYield = state.allowYield;
            state.allowYield = true;
            right = isolateCoverGrammar(parseAssignmentExpression);
            state.allowYield = previousAllowYield;
            pattern = new WrappingNode(startToken).finishAssignmentPattern(pattern, right);
        }
        return pattern;
    }

    // ECMA-262 12.2.5 Array Initializer

    function parseArrayInitializer() {
        var elements = [], node = new Node(), restSpread;

        expect('[');

        while (!match(']')) {
            if (match(',')) {
                lex();
                elements.push(null);
            } else if (match('...')) {
                restSpread = new Node();
                lex();
                restSpread.finishSpreadElement(inheritCoverGrammar(parseAssignmentExpression));

                if (!match(']')) {
                    isAssignmentTarget = isBindingElement = false;
                    expect(',');
                }
                elements.push(restSpread);
            } else {
                elements.push(inheritCoverGrammar(parseAssignmentExpression));

                if (!match(']')) {
                    expect(',');
                }
            }
        }

        lex();

        return node.finishArrayExpression(elements);
    }

    // ECMA-262 12.2.6 Object Initializer

    function parsePropertyFunction(node, paramInfo, isGenerator) {
        var previousStrict, body;

        isAssignmentTarget = isBindingElement = false;

        previousStrict = strict;
        body = isolateCoverGrammar(parseFunctionSourceElements);

        if (strict && paramInfo.firstRestricted) {
            tolerateUnexpectedToken(paramInfo.firstRestricted, paramInfo.message);
        }
        if (strict && paramInfo.stricted) {
            tolerateUnexpectedToken(paramInfo.stricted, paramInfo.message);
        }

        strict = previousStrict;
        return node.finishFunctionExpression(null, paramInfo.params, paramInfo.defaults, body, isGenerator);
    }

    function parsePropertyMethodFunction() {
        var params, method, node = new Node(),
            previousAllowYield = state.allowYield;

        state.allowYield = false;
        params = parseParams();
        state.allowYield = previousAllowYield;

        state.allowYield = false;
        method = parsePropertyFunction(node, params, false);
        state.allowYield = previousAllowYield;

        return method;
    }

    function parseObjectPropertyKey() {
        var token, node = new Node(), expr;

        token = lex();

        // Note: This function is called only from parseObjectProperty(), where
        // EOF and Punctuator tokens are already filtered out.

        switch (token.type) {
        case Token.StringLiteral:
        case Token.NumericLiteral:
            if (strict && token.octal) {
                tolerateUnexpectedToken(token, Messages.StrictOctalLiteral);
            }
            return node.finishLiteral(token);
        case Token.Identifier:
        case Token.BooleanLiteral:
        case Token.NullLiteral:
        case Token.Keyword:
            return node.finishIdentifier(token.value);
        case Token.Punctuator:
            if (token.value === '[') {
                expr = isolateCoverGrammar(parseAssignmentExpression);
                expect(']');
                return expr;
            }
            break;
        }
        throwUnexpectedToken(token);
    }

    function lookaheadPropertyName() {
        switch (lookahead.type) {
        case Token.Identifier:
        case Token.StringLiteral:
        case Token.BooleanLiteral:
        case Token.NullLiteral:
        case Token.NumericLiteral:
        case Token.Keyword:
            return true;
        case Token.Punctuator:
            return lookahead.value === '[';
        }
        return false;
    }

    // This function is to try to parse a MethodDefinition as defined in 14.3. But in the case of object literals,
    // it might be called at a position where there is in fact a short hand identifier pattern or a data property.
    // This can only be determined after we consumed up to the left parentheses.
    //
    // In order to avoid back tracking, it returns `null` if the position is not a MethodDefinition and the caller
    // is responsible to visit other options.
    function tryParseMethodDefinition(token, key, computed, node) {
        var value, options, methodNode, params,
            previousAllowYield = state.allowYield;

        if (token.type === Token.Identifier) {
            // check for `get` and `set`;

            if (token.value === 'get' && lookaheadPropertyName()) {
                computed = match('[');
                key = parseObjectPropertyKey();
                methodNode = new Node();
                expect('(');
                expect(')');

                state.allowYield = false;
                value = parsePropertyFunction(methodNode, {
                    params: [],
                    defaults: [],
                    stricted: null,
                    firstRestricted: null,
                    message: null
                }, false);
                state.allowYield = previousAllowYield;

                return node.finishProperty('get', key, computed, value, false, false);
            } else if (token.value === 'set' && lookaheadPropertyName()) {
                computed = match('[');
                key = parseObjectPropertyKey();
                methodNode = new Node();
                expect('(');

                options = {
                    params: [],
                    defaultCount: 0,
                    defaults: [],
                    firstRestricted: null,
                    paramSet: {}
                };
                if (match(')')) {
                    tolerateUnexpectedToken(lookahead);
                } else {
                    state.allowYield = false;
                    parseParam(options);
                    state.allowYield = previousAllowYield;
                    if (options.defaultCount === 0) {
                        options.defaults = [];
                    }
                }
                expect(')');

                state.allowYield = false;
                value = parsePropertyFunction(methodNode, options, false);
                state.allowYield = previousAllowYield;

                return node.finishProperty('set', key, computed, value, false, false);
            }
        } else if (token.type === Token.Punctuator && token.value === '*' && lookaheadPropertyName()) {
            computed = match('[');
            key = parseObjectPropertyKey();
            methodNode = new Node();

            state.allowYield = true;
            params = parseParams();
            state.allowYield = previousAllowYield;

            state.allowYield = false;
            value = parsePropertyFunction(methodNode, params, true);
            state.allowYield = previousAllowYield;

            return node.finishProperty('init', key, computed, value, true, false);
        }

        if (key && match('(')) {
            value = parsePropertyMethodFunction();
            return node.finishProperty('init', key, computed, value, true, false);
        }

        // Not a MethodDefinition.
        return null;
    }

    function parseObjectProperty(hasProto) {
        var token = lookahead, node = new Node(), computed, key, maybeMethod, proto, value;

        computed = match('[');
        if (match('*')) {
            lex();
        } else {
            key = parseObjectPropertyKey();
        }
        maybeMethod = tryParseMethodDefinition(token, key, computed, node);
        if (maybeMethod) {
            return maybeMethod;
        }

        if (!key) {
            throwUnexpectedToken(lookahead);
        }

        // Check for duplicated __proto__
        if (!computed) {
            proto = (key.type === Syntax.Identifier && key.name === '__proto__') ||
                (key.type === Syntax.Literal && key.value === '__proto__');
            if (hasProto.value && proto) {
                tolerateError(Messages.DuplicateProtoProperty);
            }
            hasProto.value |= proto;
        }

        if (match(':')) {
            lex();
            value = inheritCoverGrammar(parseAssignmentExpression);
            return node.finishProperty('init', key, computed, value, false, false);
        }

        if (token.type === Token.Identifier) {
            if (match('=')) {
                firstCoverInitializedNameError = lookahead;
                lex();
                value = isolateCoverGrammar(parseAssignmentExpression);
                return node.finishProperty('init', key, computed,
                    new WrappingNode(token).finishAssignmentPattern(key, value), false, true);
            }
            return node.finishProperty('init', key, computed, key, false, true);
        }

        throwUnexpectedToken(lookahead);
    }

    function parseObjectInitializer() {
        var properties = [], hasProto = {value: false}, node = new Node();

        expect('{');

        while (!match('}')) {
            properties.push(parseObjectProperty(hasProto));

            if (!match('}')) {
                expectCommaSeparator();
            }
        }

        expect('}');

        return node.finishObjectExpression(properties);
    }

    function reinterpretExpressionAsPattern(expr) {
        var i;
        switch (expr.type) {
        case Syntax.Identifier:
        case Syntax.MemberExpression:
        case Syntax.RestElement:
        case Syntax.AssignmentPattern:
            break;
        case Syntax.SpreadElement:
            expr.type = Syntax.RestElement;
            reinterpretExpressionAsPattern(expr.argument);
            break;
        case Syntax.ArrayExpression:
            expr.type = Syntax.ArrayPattern;
            for (i = 0; i < expr.elements.length; i++) {
                if (expr.elements[i] !== null) {
                    reinterpretExpressionAsPattern(expr.elements[i]);
                }
            }
            break;
        case Syntax.ObjectExpression:
            expr.type = Syntax.ObjectPattern;
            for (i = 0; i < expr.properties.length; i++) {
                reinterpretExpressionAsPattern(expr.properties[i].value);
            }
            break;
        case Syntax.AssignmentExpression:
            expr.type = Syntax.AssignmentPattern;
            reinterpretExpressionAsPattern(expr.left);
            break;
        default:
            // Allow other node type for tolerant parsing.
            break;
        }
    }

    // ECMA-262 12.2.9 Template Literals

    function parseTemplateElement(option) {
        var node, token;

        if (lookahead.type !== Token.Template || (option.head && !lookahead.head)) {
            throwUnexpectedToken();
        }

        node = new Node();
        token = lex();

        return node.finishTemplateElement({ raw: token.value.raw, cooked: token.value.cooked }, token.tail);
    }

    function parseTemplateLiteral() {
        var quasi, quasis, expressions, node = new Node();

        quasi = parseTemplateElement({ head: true });
        quasis = [quasi];
        expressions = [];

        while (!quasi.tail) {
            expressions.push(parseExpression());
            quasi = parseTemplateElement({ head: false });
            quasis.push(quasi);
        }

        return node.finishTemplateLiteral(quasis, expressions);
    }

    // ECMA-262 12.2.10 The Grouping Operator

    function parseGroupExpression() {
        var expr, expressions, startToken, i, params = [];

        expect('(');

        if (match(')')) {
            lex();
            if (!match('=>')) {
                expect('=>');
            }
            return {
                type: PlaceHolders.ArrowParameterPlaceHolder,
                params: [],
                rawParams: []
            };
        }

        startToken = lookahead;
        if (match('...')) {
            expr = parseRestElement(params);
            expect(')');
            if (!match('=>')) {
                expect('=>');
            }
            return {
                type: PlaceHolders.ArrowParameterPlaceHolder,
                params: [expr]
            };
        }

        isBindingElement = true;
        expr = inheritCoverGrammar(parseAssignmentExpression);

        if (match(',')) {
            isAssignmentTarget = false;
            expressions = [expr];

            while (startIndex < length) {
                if (!match(',')) {
                    break;
                }
                lex();

                if (match('...')) {
                    if (!isBindingElement) {
                        throwUnexpectedToken(lookahead);
                    }
                    expressions.push(parseRestElement(params));
                    expect(')');
                    if (!match('=>')) {
                        expect('=>');
                    }
                    isBindingElement = false;
                    for (i = 0; i < expressions.length; i++) {
                        reinterpretExpressionAsPattern(expressions[i]);
                    }
                    return {
                        type: PlaceHolders.ArrowParameterPlaceHolder,
                        params: expressions
                    };
                }

                expressions.push(inheritCoverGrammar(parseAssignmentExpression));
            }

            expr = new WrappingNode(startToken).finishSequenceExpression(expressions);
        }


        expect(')');

        if (match('=>')) {
            if (expr.type === Syntax.Identifier && expr.name === 'yield') {
                return {
                    type: PlaceHolders.ArrowParameterPlaceHolder,
                    params: [expr]
                };
            }

            if (!isBindingElement) {
                throwUnexpectedToken(lookahead);
            }

            if (expr.type === Syntax.SequenceExpression) {
                for (i = 0; i < expr.expressions.length; i++) {
                    reinterpretExpressionAsPattern(expr.expressions[i]);
                }
            } else {
                reinterpretExpressionAsPattern(expr);
            }

            expr = {
                type: PlaceHolders.ArrowParameterPlaceHolder,
                params: expr.type === Syntax.SequenceExpression ? expr.expressions : [expr]
            };
        }
        isBindingElement = false;
        return expr;
    }


    // ECMA-262 12.2 Primary Expressions

    function parsePrimaryExpression() {
        var type, token, expr, node;

        if (match('(')) {
            isBindingElement = false;
            return inheritCoverGrammar(parseGroupExpression);
        }

        if (match('[')) {
            return inheritCoverGrammar(parseArrayInitializer);
        }

        if (match('{')) {
            return inheritCoverGrammar(parseObjectInitializer);
        }

        type = lookahead.type;
        node = new Node();

        if (type === Token.Identifier) {
            if (state.sourceType === 'module' && lookahead.value === 'await') {
                tolerateUnexpectedToken(lookahead);
            }
            expr = node.finishIdentifier(lex().value);
        } else if (type === Token.StringLiteral || type === Token.NumericLiteral) {
            isAssignmentTarget = isBindingElement = false;
            if (strict && lookahead.octal) {
                tolerateUnexpectedToken(lookahead, Messages.StrictOctalLiteral);
            }
            expr = node.finishLiteral(lex());
        } else if (type === Token.Keyword) {
            if (!strict && state.allowYield && matchKeyword('yield')) {
                return parseNonComputedProperty();
            }
            if (!strict && matchKeyword('let')) {
                return node.finishIdentifier(lex().value);
            }
            isAssignmentTarget = isBindingElement = false;
            if (matchKeyword('function')) {
                return parseFunctionExpression();
            }
            if (matchKeyword('this')) {
                lex();
                return node.finishThisExpression();
            }
            if (matchKeyword('class')) {
                return parseClassExpression();
            }
            throwUnexpectedToken(lex());
        } else if (type === Token.BooleanLiteral) {
            isAssignmentTarget = isBindingElement = false;
            token = lex();
            token.value = (token.value === 'true');
            expr = node.finishLiteral(token);
        } else if (type === Token.NullLiteral) {
            isAssignmentTarget = isBindingElement = false;
            token = lex();
            token.value = null;
            expr = node.finishLiteral(token);
        } else if (match('/') || match('/=')) {
            isAssignmentTarget = isBindingElement = false;
            index = startIndex;

            if (typeof extra.tokens !== 'undefined') {
                token = collectRegex();
            } else {
                token = scanRegExp();
            }
            lex();
            expr = node.finishLiteral(token);
        } else if (type === Token.Template) {
            expr = parseTemplateLiteral();
        } else {
            throwUnexpectedToken(lex());
        }

        return expr;
    }

    // ECMA-262 12.3 Left-Hand-Side Expressions

    function parseArguments() {
        var args = [], expr;

        expect('(');

        if (!match(')')) {
            while (startIndex < length) {
                if (match('...')) {
                    expr = new Node();
                    lex();
                    expr.finishSpreadElement(isolateCoverGrammar(parseAssignmentExpression));
                } else {
                    expr = isolateCoverGrammar(parseAssignmentExpression);
                }
                args.push(expr);
                if (match(')')) {
                    break;
                }
                expectCommaSeparator();
            }
        }

        expect(')');

        return args;
    }

    function parseNonComputedProperty() {
        var token, node = new Node();

        token = lex();

        if (!isIdentifierName(token)) {
            throwUnexpectedToken(token);
        }

        return node.finishIdentifier(token.value);
    }

    function parseNonComputedMember() {
        expect('.');

        return parseNonComputedProperty();
    }

    function parseComputedMember() {
        var expr;

        expect('[');

        expr = isolateCoverGrammar(parseExpression);

        expect(']');

        return expr;
    }

    // ECMA-262 12.3.3 The new Operator

    function parseNewExpression() {
        var callee, args, node = new Node();

        expectKeyword('new');

        if (match('.')) {
            lex();
            if (lookahead.type === Token.Identifier && lookahead.value === 'target') {
                if (state.inFunctionBody) {
                    lex();
                    return node.finishMetaProperty('new', 'target');
                }
            }
            throwUnexpectedToken(lookahead);
        }

        callee = isolateCoverGrammar(parseLeftHandSideExpression);
        args = match('(') ? parseArguments() : [];

        isAssignmentTarget = isBindingElement = false;

        return node.finishNewExpression(callee, args);
    }

    // ECMA-262 12.3.4 Function Calls

    function parseLeftHandSideExpressionAllowCall() {
        var quasi, expr, args, property, startToken, previousAllowIn = state.allowIn;

        startToken = lookahead;
        state.allowIn = true;

        if (matchKeyword('super') && state.inFunctionBody) {
            expr = new Node();
            lex();
            expr = expr.finishSuper();
            if (!match('(') && !match('.') && !match('[')) {
                throwUnexpectedToken(lookahead);
            }
        } else {
            expr = inheritCoverGrammar(matchKeyword('new') ? parseNewExpression : parsePrimaryExpression);
        }

        for (;;) {
            if (match('.')) {
                isBindingElement = false;
                isAssignmentTarget = true;
                property = parseNonComputedMember();
                expr = new WrappingNode(startToken).finishMemberExpression('.', expr, property);
            } else if (match('(')) {
                isBindingElement = false;
                isAssignmentTarget = false;
                args = parseArguments();
                expr = new WrappingNode(startToken).finishCallExpression(expr, args);
            } else if (match('[')) {
                isBindingElement = false;
                isAssignmentTarget = true;
                property = parseComputedMember();
                expr = new WrappingNode(startToken).finishMemberExpression('[', expr, property);
            } else if (lookahead.type === Token.Template && lookahead.head) {
                quasi = parseTemplateLiteral();
                expr = new WrappingNode(startToken).finishTaggedTemplateExpression(expr, quasi);
            } else {
                break;
            }
        }
        state.allowIn = previousAllowIn;

        return expr;
    }

    // ECMA-262 12.3 Left-Hand-Side Expressions

    function parseLeftHandSideExpression() {
        var quasi, expr, property, startToken;
        assert(state.allowIn, 'callee of new expression always allow in keyword.');

        startToken = lookahead;

        if (matchKeyword('super') && state.inFunctionBody) {
            expr = new Node();
            lex();
            expr = expr.finishSuper();
            if (!match('[') && !match('.')) {
                throwUnexpectedToken(lookahead);
            }
        } else {
            expr = inheritCoverGrammar(matchKeyword('new') ? parseNewExpression : parsePrimaryExpression);
        }

        for (;;) {
            if (match('[')) {
                isBindingElement = false;
                isAssignmentTarget = true;
                property = parseComputedMember();
                expr = new WrappingNode(startToken).finishMemberExpression('[', expr, property);
            } else if (match('.')) {
                isBindingElement = false;
                isAssignmentTarget = true;
                property = parseNonComputedMember();
                expr = new WrappingNode(startToken).finishMemberExpression('.', expr, property);
            } else if (lookahead.type === Token.Template && lookahead.head) {
                quasi = parseTemplateLiteral();
                expr = new WrappingNode(startToken).finishTaggedTemplateExpression(expr, quasi);
            } else {
                break;
            }
        }
        return expr;
    }

    // ECMA-262 12.4 Postfix Expressions

    function parsePostfixExpression() {
        var expr, token, startToken = lookahead;

        expr = inheritCoverGrammar(parseLeftHandSideExpressionAllowCall);

        if (!hasLineTerminator && lookahead.type === Token.Punctuator) {
            if (match('++') || match('--')) {
                // ECMA-262 11.3.1, 11.3.2
                if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                    tolerateError(Messages.StrictLHSPostfix);
                }

                if (!isAssignmentTarget) {
                    tolerateError(Messages.InvalidLHSInAssignment);
                }

                isAssignmentTarget = isBindingElement = false;

                token = lex();
                expr = new WrappingNode(startToken).finishPostfixExpression(token.value, expr);
            }
        }

        return expr;
    }

    // ECMA-262 12.5 Unary Operators

    function parseUnaryExpression() {
        var token, expr, startToken;

        if (lookahead.type !== Token.Punctuator && lookahead.type !== Token.Keyword) {
            expr = parsePostfixExpression();
        } else if (match('++') || match('--')) {
            startToken = lookahead;
            token = lex();
            expr = inheritCoverGrammar(parseUnaryExpression);
            // ECMA-262 11.4.4, 11.4.5
            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                tolerateError(Messages.StrictLHSPrefix);
            }

            if (!isAssignmentTarget) {
                tolerateError(Messages.InvalidLHSInAssignment);
            }
            expr = new WrappingNode(startToken).finishUnaryExpression(token.value, expr);
            isAssignmentTarget = isBindingElement = false;
        } else if (match('+') || match('-') || match('~') || match('!')) {
            startToken = lookahead;
            token = lex();
            expr = inheritCoverGrammar(parseUnaryExpression);
            expr = new WrappingNode(startToken).finishUnaryExpression(token.value, expr);
            isAssignmentTarget = isBindingElement = false;
        } else if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
            startToken = lookahead;
            token = lex();
            expr = inheritCoverGrammar(parseUnaryExpression);
            expr = new WrappingNode(startToken).finishUnaryExpression(token.value, expr);
            if (strict && expr.operator === 'delete' && expr.argument.type === Syntax.Identifier) {
                tolerateError(Messages.StrictDelete);
            }
            isAssignmentTarget = isBindingElement = false;
        } else {
            expr = parsePostfixExpression();
        }

        return expr;
    }

    function binaryPrecedence(token, allowIn) {
        var prec = 0;

        if (token.type !== Token.Punctuator && token.type !== Token.Keyword) {
            return 0;
        }

        switch (token.value) {
        case '||':
            prec = 1;
            break;

        case '&&':
            prec = 2;
            break;

        case '|':
            prec = 3;
            break;

        case '^':
            prec = 4;
            break;

        case '&':
            prec = 5;
            break;

        case '==':
        case '!=':
        case '===':
        case '!==':
            prec = 6;
            break;

        case '<':
        case '>':
        case '<=':
        case '>=':
        case 'instanceof':
            prec = 7;
            break;

        case 'in':
            prec = allowIn ? 7 : 0;
            break;

        case '<<':
        case '>>':
        case '>>>':
            prec = 8;
            break;

        case '+':
        case '-':
            prec = 9;
            break;

        case '*':
        case '/':
        case '%':
            prec = 11;
            break;

        default:
            break;
        }

        return prec;
    }

    // ECMA-262 12.6 Multiplicative Operators
    // ECMA-262 12.7 Additive Operators
    // ECMA-262 12.8 Bitwise Shift Operators
    // ECMA-262 12.9 Relational Operators
    // ECMA-262 12.10 Equality Operators
    // ECMA-262 12.11 Binary Bitwise Operators
    // ECMA-262 12.12 Binary Logical Operators

    function parseBinaryExpression() {
        var marker, markers, expr, token, prec, stack, right, operator, left, i;

        marker = lookahead;
        left = inheritCoverGrammar(parseUnaryExpression);

        token = lookahead;
        prec = binaryPrecedence(token, state.allowIn);
        if (prec === 0) {
            return left;
        }
        isAssignmentTarget = isBindingElement = false;
        token.prec = prec;
        lex();

        markers = [marker, lookahead];
        right = isolateCoverGrammar(parseUnaryExpression);

        stack = [left, token, right];

        while ((prec = binaryPrecedence(lookahead, state.allowIn)) > 0) {

            // Reduce: make a binary expression from the three topmost entries.
            while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
                right = stack.pop();
                operator = stack.pop().value;
                left = stack.pop();
                markers.pop();
                expr = new WrappingNode(markers[markers.length - 1]).finishBinaryExpression(operator, left, right);
                stack.push(expr);
            }

            // Shift.
            token = lex();
            token.prec = prec;
            stack.push(token);
            markers.push(lookahead);
            expr = isolateCoverGrammar(parseUnaryExpression);
            stack.push(expr);
        }

        // Final reduce to clean-up the stack.
        i = stack.length - 1;
        expr = stack[i];
        markers.pop();
        while (i > 1) {
            expr = new WrappingNode(markers.pop()).finishBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
            i -= 2;
        }

        return expr;
    }


    // ECMA-262 12.13 Conditional Operator

    function parseConditionalExpression() {
        var expr, previousAllowIn, consequent, alternate, startToken;

        startToken = lookahead;

        expr = inheritCoverGrammar(parseBinaryExpression);
        if (match('?')) {
            lex();
            previousAllowIn = state.allowIn;
            state.allowIn = true;
            consequent = isolateCoverGrammar(parseAssignmentExpression);
            state.allowIn = previousAllowIn;
            expect(':');
            alternate = isolateCoverGrammar(parseAssignmentExpression);

            expr = new WrappingNode(startToken).finishConditionalExpression(expr, consequent, alternate);
            isAssignmentTarget = isBindingElement = false;
        }

        return expr;
    }

    // ECMA-262 14.2 Arrow Function Definitions

    function parseConciseBody() {
        if (match('{')) {
            return parseFunctionSourceElements();
        }
        return isolateCoverGrammar(parseAssignmentExpression);
    }

    function checkPatternParam(options, param) {
        var i;
        switch (param.type) {
        case Syntax.Identifier:
            validateParam(options, param, param.name);
            break;
        case Syntax.RestElement:
            checkPatternParam(options, param.argument);
            break;
        case Syntax.AssignmentPattern:
            checkPatternParam(options, param.left);
            break;
        case Syntax.ArrayPattern:
            for (i = 0; i < param.elements.length; i++) {
                if (param.elements[i] !== null) {
                    checkPatternParam(options, param.elements[i]);
                }
            }
            break;
        case Syntax.YieldExpression:
            break;
        default:
            assert(param.type === Syntax.ObjectPattern, 'Invalid type');
            for (i = 0; i < param.properties.length; i++) {
                checkPatternParam(options, param.properties[i].value);
            }
            break;
        }
    }
    function reinterpretAsCoverFormalsList(expr) {
        var i, len, param, params, defaults, defaultCount, options, token;

        defaults = [];
        defaultCount = 0;
        params = [expr];

        switch (expr.type) {
        case Syntax.Identifier:
            break;
        case PlaceHolders.ArrowParameterPlaceHolder:
            params = expr.params;
            break;
        default:
            return null;
        }

        options = {
            paramSet: {}
        };

        for (i = 0, len = params.length; i < len; i += 1) {
            param = params[i];
            switch (param.type) {
            case Syntax.AssignmentPattern:
                params[i] = param.left;
                if (param.right.type === Syntax.YieldExpression) {
                    if (param.right.argument) {
                        throwUnexpectedToken(lookahead);
                    }
                    param.right.type = Syntax.Identifier;
                    param.right.name = 'yield';
                    delete param.right.argument;
                    delete param.right.delegate;
                }
                defaults.push(param.right);
                ++defaultCount;
                checkPatternParam(options, param.left);
                break;
            default:
                checkPatternParam(options, param);
                params[i] = param;
                defaults.push(null);
                break;
            }
        }

        if (strict || !state.allowYield) {
            for (i = 0, len = params.length; i < len; i += 1) {
                param = params[i];
                if (param.type === Syntax.YieldExpression) {
                    throwUnexpectedToken(lookahead);
                }
            }
        }

        if (options.message === Messages.StrictParamDupe) {
            token = strict ? options.stricted : options.firstRestricted;
            throwUnexpectedToken(token, options.message);
        }

        if (defaultCount === 0) {
            defaults = [];
        }

        return {
            params: params,
            defaults: defaults,
            stricted: options.stricted,
            firstRestricted: options.firstRestricted,
            message: options.message
        };
    }

    function parseArrowFunctionExpression(options, node) {
        var previousStrict, previousAllowYield, body;

        if (hasLineTerminator) {
            tolerateUnexpectedToken(lookahead);
        }
        expect('=>');

        previousStrict = strict;
        previousAllowYield = state.allowYield;
        state.allowYield = true;

        body = parseConciseBody();

        if (strict && options.firstRestricted) {
            throwUnexpectedToken(options.firstRestricted, options.message);
        }
        if (strict && options.stricted) {
            tolerateUnexpectedToken(options.stricted, options.message);
        }

        strict = previousStrict;
        state.allowYield = previousAllowYield;

        return node.finishArrowFunctionExpression(options.params, options.defaults, body, body.type !== Syntax.BlockStatement);
    }

    // ECMA-262 14.4 Yield expression

    function parseYieldExpression() {
        var argument, expr, delegate, previousAllowYield;

        argument = null;
        expr = new Node();
        delegate = false;

        expectKeyword('yield');

        if (!hasLineTerminator) {
            previousAllowYield = state.allowYield;
            state.allowYield = false;
            delegate = match('*');
            if (delegate) {
                lex();
                argument = parseAssignmentExpression();
            } else {
                if (!match(';') && !match('}') && !match(')') && lookahead.type !== Token.EOF) {
                    argument = parseAssignmentExpression();
                }
            }
            state.allowYield = previousAllowYield;
        }

        return expr.finishYieldExpression(argument, delegate);
    }

    // ECMA-262 12.14 Assignment Operators

    function parseAssignmentExpression() {
        var token, expr, right, list, startToken;

        startToken = lookahead;
        token = lookahead;

        if (!state.allowYield && matchKeyword('yield')) {
            return parseYieldExpression();
        }

        expr = parseConditionalExpression();

        if (expr.type === PlaceHolders.ArrowParameterPlaceHolder || match('=>')) {
            isAssignmentTarget = isBindingElement = false;
            list = reinterpretAsCoverFormalsList(expr);

            if (list) {
                firstCoverInitializedNameError = null;
                return parseArrowFunctionExpression(list, new WrappingNode(startToken));
            }

            return expr;
        }

        if (matchAssign()) {
            if (!isAssignmentTarget) {
                tolerateError(Messages.InvalidLHSInAssignment);
            }

            // ECMA-262 12.1.1
            if (strict && expr.type === Syntax.Identifier) {
                if (isRestrictedWord(expr.name)) {
                    tolerateUnexpectedToken(token, Messages.StrictLHSAssignment);
                }
                if (isStrictModeReservedWord(expr.name)) {
                    tolerateUnexpectedToken(token, Messages.StrictReservedWord);
                }
            }

            if (!match('=')) {
                isAssignmentTarget = isBindingElement = false;
            } else {
                reinterpretExpressionAsPattern(expr);
            }

            token = lex();
            right = isolateCoverGrammar(parseAssignmentExpression);
            expr = new WrappingNode(startToken).finishAssignmentExpression(token.value, expr, right);
            firstCoverInitializedNameError = null;
        }

        return expr;
    }

    // ECMA-262 12.15 Comma Operator

    function parseExpression() {
        var expr, startToken = lookahead, expressions;

        expr = isolateCoverGrammar(parseAssignmentExpression);

        if (match(',')) {
            expressions = [expr];

            while (startIndex < length) {
                if (!match(',')) {
                    break;
                }
                lex();
                expressions.push(isolateCoverGrammar(parseAssignmentExpression));
            }

            expr = new WrappingNode(startToken).finishSequenceExpression(expressions);
        }

        return expr;
    }

    // ECMA-262 13.2 Block

    function parseStatementListItem() {
        if (lookahead.type === Token.Keyword) {
            switch (lookahead.value) {
            case 'export':
                if (state.sourceType !== 'module') {
                    tolerateUnexpectedToken(lookahead, Messages.IllegalExportDeclaration);
                }
                return parseExportDeclaration();
            case 'import':
                if (state.sourceType !== 'module') {
                    tolerateUnexpectedToken(lookahead, Messages.IllegalImportDeclaration);
                }
                return parseImportDeclaration();
            case 'const':
                return parseLexicalDeclaration({inFor: false});
            case 'function':
                return parseFunctionDeclaration(new Node());
            case 'class':
                return parseClassDeclaration();
            }
        }

        if (matchKeyword('let') && isLexicalDeclaration()) {
            return parseLexicalDeclaration({inFor: false});
        }

        return parseStatement();
    }

    function parseStatementList() {
        var list = [];
        while (startIndex < length) {
            if (match('}')) {
                break;
            }
            list.push(parseStatementListItem());
        }

        return list;
    }

    function parseBlock() {
        var block, node = new Node();

        expect('{');

        block = parseStatementList();

        expect('}');

        return node.finishBlockStatement(block);
    }

    // ECMA-262 13.3.2 Variable Statement

    function parseVariableIdentifier(kind) {
        var token, node = new Node();

        token = lex();

        if (token.type === Token.Keyword && token.value === 'yield') {
            if (strict) {
                tolerateUnexpectedToken(token, Messages.StrictReservedWord);
            } if (!state.allowYield) {
                throwUnexpectedToken(token);
            }
        } else if (token.type !== Token.Identifier) {
            if (strict && token.type === Token.Keyword && isStrictModeReservedWord(token.value)) {
                tolerateUnexpectedToken(token, Messages.StrictReservedWord);
            } else {
                if (strict || token.value !== 'let' || kind !== 'var') {
                    throwUnexpectedToken(token);
                }
            }
        } else if (state.sourceType === 'module' && token.type === Token.Identifier && token.value === 'await') {
            tolerateUnexpectedToken(token);
        }

        return node.finishIdentifier(token.value);
    }

    function parseVariableDeclaration(options) {
        var init = null, id, node = new Node(), params = [];

        id = parsePattern(params, 'var');

        // ECMA-262 12.2.1
        if (strict && isRestrictedWord(id.name)) {
            tolerateError(Messages.StrictVarName);
        }

        if (match('=')) {
            lex();
            init = isolateCoverGrammar(parseAssignmentExpression);
        } else if (id.type !== Syntax.Identifier && !options.inFor) {
            expect('=');
        }

        return node.finishVariableDeclarator(id, init);
    }

    function parseVariableDeclarationList(options) {
        var opt, list;

        opt = { inFor: options.inFor };
        list = [parseVariableDeclaration(opt)];

        while (match(',')) {
            lex();
            list.push(parseVariableDeclaration(opt));
        }

        return list;
    }

    function parseVariableStatement(node) {
        var declarations;

        expectKeyword('var');

        declarations = parseVariableDeclarationList({ inFor: false });

        consumeSemicolon();

        return node.finishVariableDeclaration(declarations);
    }

    // ECMA-262 13.3.1 Let and Const Declarations

    function parseLexicalBinding(kind, options) {
        var init = null, id, node = new Node(), params = [];

        id = parsePattern(params, kind);

        // ECMA-262 12.2.1
        if (strict && id.type === Syntax.Identifier && isRestrictedWord(id.name)) {
            tolerateError(Messages.StrictVarName);
        }

        if (kind === 'const') {
            if (!matchKeyword('in') && !matchContextualKeyword('of')) {
                expect('=');
                init = isolateCoverGrammar(parseAssignmentExpression);
            }
        } else if ((!options.inFor && id.type !== Syntax.Identifier) || match('=')) {
            expect('=');
            init = isolateCoverGrammar(parseAssignmentExpression);
        }

        return node.finishVariableDeclarator(id, init);
    }

    function parseBindingList(kind, options) {
        var list = [parseLexicalBinding(kind, options)];

        while (match(',')) {
            lex();
            list.push(parseLexicalBinding(kind, options));
        }

        return list;
    }


    function tokenizerState() {
        return {
            index: index,
            lineNumber: lineNumber,
            lineStart: lineStart,
            hasLineTerminator: hasLineTerminator,
            lastIndex: lastIndex,
            lastLineNumber: lastLineNumber,
            lastLineStart: lastLineStart,
            startIndex: startIndex,
            startLineNumber: startLineNumber,
            startLineStart: startLineStart,
            lookahead: lookahead,
            tokenCount: extra.tokens ? extra.tokens.length : 0
        };
    }

    function resetTokenizerState(ts) {
        index = ts.index;
        lineNumber = ts.lineNumber;
        lineStart = ts.lineStart;
        hasLineTerminator = ts.hasLineTerminator;
        lastIndex = ts.lastIndex;
        lastLineNumber = ts.lastLineNumber;
        lastLineStart = ts.lastLineStart;
        startIndex = ts.startIndex;
        startLineNumber = ts.startLineNumber;
        startLineStart = ts.startLineStart;
        lookahead = ts.lookahead;
        if (extra.tokens) {
            extra.tokens.splice(ts.tokenCount, extra.tokens.length);
        }
    }

    function isLexicalDeclaration() {
        var lexical, ts;

        ts = tokenizerState();

        lex();
        lexical = (lookahead.type === Token.Identifier) || match('[') || match('{') ||
            matchKeyword('let') || matchKeyword('yield');

        resetTokenizerState(ts);

        return lexical;
    }

    function parseLexicalDeclaration(options) {
        var kind, declarations, node = new Node();

        kind = lex().value;
        assert(kind === 'let' || kind === 'const', 'Lexical declaration must be either let or const');

        declarations = parseBindingList(kind, options);

        consumeSemicolon();

        return node.finishLexicalDeclaration(declarations, kind);
    }

    function parseRestElement(params) {
        var param, node = new Node();

        lex();

        if (match('{')) {
            throwError(Messages.ObjectPatternAsRestParameter);
        }

        params.push(lookahead);

        param = parseVariableIdentifier();

        if (match('=')) {
            throwError(Messages.DefaultRestParameter);
        }

        if (!match(')')) {
            throwError(Messages.ParameterAfterRestParameter);
        }

        return node.finishRestElement(param);
    }

    // ECMA-262 13.4 Empty Statement

    function parseEmptyStatement(node) {
        expect(';');
        return node.finishEmptyStatement();
    }

    // ECMA-262 12.4 Expression Statement

    function parseExpressionStatement(node) {
        var expr = parseExpression();
        consumeSemicolon();
        return node.finishExpressionStatement(expr);
    }

    // ECMA-262 13.6 If statement

    function parseIfStatement(node) {
        var test, consequent, alternate;

        expectKeyword('if');

        expect('(');

        test = parseExpression();

        expect(')');

        consequent = parseStatement();

        if (matchKeyword('else')) {
            lex();
            alternate = parseStatement();
        } else {
            alternate = null;
        }

        return node.finishIfStatement(test, consequent, alternate);
    }

    // ECMA-262 13.7 Iteration Statements

    function parseDoWhileStatement(node) {
        var body, test, oldInIteration;

        expectKeyword('do');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = parseStatement();

        state.inIteration = oldInIteration;

        expectKeyword('while');

        expect('(');

        test = parseExpression();

        expect(')');

        if (match(';')) {
            lex();
        }

        return node.finishDoWhileStatement(body, test);
    }

    function parseWhileStatement(node) {
        var test, body, oldInIteration;

        expectKeyword('while');

        expect('(');

        test = parseExpression();

        expect(')');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = parseStatement();

        state.inIteration = oldInIteration;

        return node.finishWhileStatement(test, body);
    }

    function parseForStatement(node) {
        var init, forIn, initSeq, initStartToken, test, update, left, right, kind, declarations,
            body, oldInIteration, previousAllowIn = state.allowIn;

        init = test = update = null;
        forIn = true;

        expectKeyword('for');

        expect('(');

        if (match(';')) {
            lex();
        } else {
            if (matchKeyword('var')) {
                init = new Node();
                lex();

                state.allowIn = false;
                declarations = parseVariableDeclarationList({ inFor: true });
                state.allowIn = previousAllowIn;

                if (declarations.length === 1 && matchKeyword('in')) {
                    init = init.finishVariableDeclaration(declarations);
                    lex();
                    left = init;
                    right = parseExpression();
                    init = null;
                } else if (declarations.length === 1 && declarations[0].init === null && matchContextualKeyword('of')) {
                    init = init.finishVariableDeclaration(declarations);
                    lex();
                    left = init;
                    right = parseAssignmentExpression();
                    init = null;
                    forIn = false;
                } else {
                    init = init.finishVariableDeclaration(declarations);
                    expect(';');
                }
            } else if (matchKeyword('const') || matchKeyword('let')) {
                init = new Node();
                kind = lex().value;

                if (!strict && lookahead.value === 'in') {
                    init = init.finishIdentifier(kind);
                    lex();
                    left = init;
                    right = parseExpression();
                    init = null;
                } else {
                    state.allowIn = false;
                    declarations = parseBindingList(kind, {inFor: true});
                    state.allowIn = previousAllowIn;

                    if (declarations.length === 1 && declarations[0].init === null && matchKeyword('in')) {
                        init = init.finishLexicalDeclaration(declarations, kind);
                        lex();
                        left = init;
                        right = parseExpression();
                        init = null;
                    } else if (declarations.length === 1 && declarations[0].init === null && matchContextualKeyword('of')) {
                        init = init.finishLexicalDeclaration(declarations, kind);
                        lex();
                        left = init;
                        right = parseAssignmentExpression();
                        init = null;
                        forIn = false;
                    } else {
                        consumeSemicolon();
                        init = init.finishLexicalDeclaration(declarations, kind);
                    }
                }
            } else {
                initStartToken = lookahead;
                state.allowIn = false;
                init = inheritCoverGrammar(parseAssignmentExpression);
                state.allowIn = previousAllowIn;

                if (matchKeyword('in')) {
                    if (!isAssignmentTarget) {
                        tolerateError(Messages.InvalidLHSInForIn);
                    }

                    lex();
                    reinterpretExpressionAsPattern(init);
                    left = init;
                    right = parseExpression();
                    init = null;
                } else if (matchContextualKeyword('of')) {
                    if (!isAssignmentTarget) {
                        tolerateError(Messages.InvalidLHSInForLoop);
                    }

                    lex();
                    reinterpretExpressionAsPattern(init);
                    left = init;
                    right = parseAssignmentExpression();
                    init = null;
                    forIn = false;
                } else {
                    if (match(',')) {
                        initSeq = [init];
                        while (match(',')) {
                            lex();
                            initSeq.push(isolateCoverGrammar(parseAssignmentExpression));
                        }
                        init = new WrappingNode(initStartToken).finishSequenceExpression(initSeq);
                    }
                    expect(';');
                }
            }
        }

        if (typeof left === 'undefined') {

            if (!match(';')) {
                test = parseExpression();
            }
            expect(';');

            if (!match(')')) {
                update = parseExpression();
            }
        }

        expect(')');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = isolateCoverGrammar(parseStatement);

        state.inIteration = oldInIteration;

        return (typeof left === 'undefined') ?
                node.finishForStatement(init, test, update, body) :
                forIn ? node.finishForInStatement(left, right, body) :
                    node.finishForOfStatement(left, right, body);
    }

    // ECMA-262 13.8 The continue statement

    function parseContinueStatement(node) {
        var label = null, key;

        expectKeyword('continue');

        // Optimize the most common form: 'continue;'.
        if (source.charCodeAt(startIndex) === 0x3B) {
            lex();

            if (!state.inIteration) {
                throwError(Messages.IllegalContinue);
            }

            return node.finishContinueStatement(null);
        }

        if (hasLineTerminator) {
            if (!state.inIteration) {
                throwError(Messages.IllegalContinue);
            }

            return node.finishContinueStatement(null);
        }

        if (lookahead.type === Token.Identifier) {
            label = parseVariableIdentifier();

            key = '$' + label.name;
            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
                throwError(Messages.UnknownLabel, label.name);
            }
        }

        consumeSemicolon();

        if (label === null && !state.inIteration) {
            throwError(Messages.IllegalContinue);
        }

        return node.finishContinueStatement(label);
    }

    // ECMA-262 13.9 The break statement

    function parseBreakStatement(node) {
        var label = null, key;

        expectKeyword('break');

        // Catch the very common case first: immediately a semicolon (U+003B).
        if (source.charCodeAt(lastIndex) === 0x3B) {
            lex();

            if (!(state.inIteration || state.inSwitch)) {
                throwError(Messages.IllegalBreak);
            }

            return node.finishBreakStatement(null);
        }

        if (hasLineTerminator) {
            if (!(state.inIteration || state.inSwitch)) {
                throwError(Messages.IllegalBreak);
            }
        } else if (lookahead.type === Token.Identifier) {
            label = parseVariableIdentifier();

            key = '$' + label.name;
            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
                throwError(Messages.UnknownLabel, label.name);
            }
        }

        consumeSemicolon();

        if (label === null && !(state.inIteration || state.inSwitch)) {
            throwError(Messages.IllegalBreak);
        }

        return node.finishBreakStatement(label);
    }

    // ECMA-262 13.10 The return statement

    function parseReturnStatement(node) {
        var argument = null;

        expectKeyword('return');

        if (!state.inFunctionBody) {
            tolerateError(Messages.IllegalReturn);
        }

        // 'return' followed by a space and an identifier is very common.
        if (source.charCodeAt(lastIndex) === 0x20) {
            if (isIdentifierStart(source.charCodeAt(lastIndex + 1))) {
                argument = parseExpression();
                consumeSemicolon();
                return node.finishReturnStatement(argument);
            }
        }

        if (hasLineTerminator) {
            // HACK
            return node.finishReturnStatement(null);
        }

        if (!match(';')) {
            if (!match('}') && lookahead.type !== Token.EOF) {
                argument = parseExpression();
            }
        }

        consumeSemicolon();

        return node.finishReturnStatement(argument);
    }

    // ECMA-262 13.11 The with statement

    function parseWithStatement(node) {
        var object, body;

        if (strict) {
            tolerateError(Messages.StrictModeWith);
        }

        expectKeyword('with');

        expect('(');

        object = parseExpression();

        expect(')');

        body = parseStatement();

        return node.finishWithStatement(object, body);
    }

    // ECMA-262 13.12 The switch statement

    function parseSwitchCase() {
        var test, consequent = [], statement, node = new Node();

        if (matchKeyword('default')) {
            lex();
            test = null;
        } else {
            expectKeyword('case');
            test = parseExpression();
        }
        expect(':');

        while (startIndex < length) {
            if (match('}') || matchKeyword('default') || matchKeyword('case')) {
                break;
            }
            statement = parseStatementListItem();
            consequent.push(statement);
        }

        return node.finishSwitchCase(test, consequent);
    }

    function parseSwitchStatement(node) {
        var discriminant, cases, clause, oldInSwitch, defaultFound;

        expectKeyword('switch');

        expect('(');

        discriminant = parseExpression();

        expect(')');

        expect('{');

        cases = [];

        if (match('}')) {
            lex();
            return node.finishSwitchStatement(discriminant, cases);
        }

        oldInSwitch = state.inSwitch;
        state.inSwitch = true;
        defaultFound = false;

        while (startIndex < length) {
            if (match('}')) {
                break;
            }
            clause = parseSwitchCase();
            if (clause.test === null) {
                if (defaultFound) {
                    throwError(Messages.MultipleDefaultsInSwitch);
                }
                defaultFound = true;
            }
            cases.push(clause);
        }

        state.inSwitch = oldInSwitch;

        expect('}');

        return node.finishSwitchStatement(discriminant, cases);
    }

    // ECMA-262 13.14 The throw statement

    function parseThrowStatement(node) {
        var argument;

        expectKeyword('throw');

        if (hasLineTerminator) {
            throwError(Messages.NewlineAfterThrow);
        }

        argument = parseExpression();

        consumeSemicolon();

        return node.finishThrowStatement(argument);
    }

    // ECMA-262 13.15 The try statement

    function parseCatchClause() {
        var param, params = [], paramMap = {}, key, i, body, node = new Node();

        expectKeyword('catch');

        expect('(');
        if (match(')')) {
            throwUnexpectedToken(lookahead);
        }

        param = parsePattern(params);
        for (i = 0; i < params.length; i++) {
            key = '$' + params[i].value;
            if (Object.prototype.hasOwnProperty.call(paramMap, key)) {
                tolerateError(Messages.DuplicateBinding, params[i].value);
            }
            paramMap[key] = true;
        }

        // ECMA-262 12.14.1
        if (strict && isRestrictedWord(param.name)) {
            tolerateError(Messages.StrictCatchVariable);
        }

        expect(')');
        body = parseBlock();
        return node.finishCatchClause(param, body);
    }

    function parseTryStatement(node) {
        var block, handler = null, finalizer = null;

        expectKeyword('try');

        block = parseBlock();

        if (matchKeyword('catch')) {
            handler = parseCatchClause();
        }

        if (matchKeyword('finally')) {
            lex();
            finalizer = parseBlock();
        }

        if (!handler && !finalizer) {
            throwError(Messages.NoCatchOrFinally);
        }

        return node.finishTryStatement(block, handler, finalizer);
    }

    // ECMA-262 13.16 The debugger statement

    function parseDebuggerStatement(node) {
        expectKeyword('debugger');

        consumeSemicolon();

        return node.finishDebuggerStatement();
    }

    // 13 Statements

    function parseStatement() {
        var type = lookahead.type,
            expr,
            labeledBody,
            key,
            node;

        if (type === Token.EOF) {
            throwUnexpectedToken(lookahead);
        }

        if (type === Token.Punctuator && lookahead.value === '{') {
            return parseBlock();
        }
        isAssignmentTarget = isBindingElement = true;
        node = new Node();

        if (type === Token.Punctuator) {
            switch (lookahead.value) {
            case ';':
                return parseEmptyStatement(node);
            case '(':
                return parseExpressionStatement(node);
            default:
                break;
            }
        } else if (type === Token.Keyword) {
            switch (lookahead.value) {
            case 'break':
                return parseBreakStatement(node);
            case 'continue':
                return parseContinueStatement(node);
            case 'debugger':
                return parseDebuggerStatement(node);
            case 'do':
                return parseDoWhileStatement(node);
            case 'for':
                return parseForStatement(node);
            case 'function':
                return parseFunctionDeclaration(node);
            case 'if':
                return parseIfStatement(node);
            case 'return':
                return parseReturnStatement(node);
            case 'switch':
                return parseSwitchStatement(node);
            case 'throw':
                return parseThrowStatement(node);
            case 'try':
                return parseTryStatement(node);
            case 'var':
                return parseVariableStatement(node);
            case 'while':
                return parseWhileStatement(node);
            case 'with':
                return parseWithStatement(node);
            default:
                break;
            }
        }

        expr = parseExpression();

        // ECMA-262 12.12 Labelled Statements
        if ((expr.type === Syntax.Identifier) && match(':')) {
            lex();

            key = '$' + expr.name;
            if (Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
                throwError(Messages.Redeclaration, 'Label', expr.name);
            }

            state.labelSet[key] = true;
            labeledBody = parseStatement();
            delete state.labelSet[key];
            return node.finishLabeledStatement(expr, labeledBody);
        }

        consumeSemicolon();

        return node.finishExpressionStatement(expr);
    }

    // ECMA-262 14.1 Function Definition

    function parseFunctionSourceElements() {
        var statement, body = [], token, directive, firstRestricted,
            oldLabelSet, oldInIteration, oldInSwitch, oldInFunctionBody,
            node = new Node();

        expect('{');

        while (startIndex < length) {
            if (lookahead.type !== Token.StringLiteral) {
                break;
            }
            token = lookahead;

            statement = parseStatementListItem();
            body.push(statement);
            if (statement.expression.type !== Syntax.Literal) {
                // this is not directive
                break;
            }
            directive = source.slice(token.start + 1, token.end - 1);
            if (directive === 'use strict') {
                strict = true;
                if (firstRestricted) {
                    tolerateUnexpectedToken(firstRestricted, Messages.StrictOctalLiteral);
                }
            } else {
                if (!firstRestricted && token.octal) {
                    firstRestricted = token;
                }
            }
        }

        oldLabelSet = state.labelSet;
        oldInIteration = state.inIteration;
        oldInSwitch = state.inSwitch;
        oldInFunctionBody = state.inFunctionBody;

        state.labelSet = {};
        state.inIteration = false;
        state.inSwitch = false;
        state.inFunctionBody = true;

        while (startIndex < length) {
            if (match('}')) {
                break;
            }
            body.push(parseStatementListItem());
        }

        expect('}');

        state.labelSet = oldLabelSet;
        state.inIteration = oldInIteration;
        state.inSwitch = oldInSwitch;
        state.inFunctionBody = oldInFunctionBody;

        return node.finishBlockStatement(body);
    }

    function validateParam(options, param, name) {
        var key = '$' + name;
        if (strict) {
            if (isRestrictedWord(name)) {
                options.stricted = param;
                options.message = Messages.StrictParamName;
            }
            if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
                options.stricted = param;
                options.message = Messages.StrictParamDupe;
            }
        } else if (!options.firstRestricted) {
            if (isRestrictedWord(name)) {
                options.firstRestricted = param;
                options.message = Messages.StrictParamName;
            } else if (isStrictModeReservedWord(name)) {
                options.firstRestricted = param;
                options.message = Messages.StrictReservedWord;
            } else if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
                options.stricted = param;
                options.message = Messages.StrictParamDupe;
            }
        }
        options.paramSet[key] = true;
    }

    function parseParam(options) {
        var token, param, params = [], i, def;

        token = lookahead;
        if (token.value === '...') {
            param = parseRestElement(params);
            validateParam(options, param.argument, param.argument.name);
            options.params.push(param);
            options.defaults.push(null);
            return false;
        }

        param = parsePatternWithDefault(params);
        for (i = 0; i < params.length; i++) {
            validateParam(options, params[i], params[i].value);
        }

        if (param.type === Syntax.AssignmentPattern) {
            def = param.right;
            param = param.left;
            ++options.defaultCount;
        }

        options.params.push(param);
        options.defaults.push(def);

        return !match(')');
    }

    function parseParams(firstRestricted) {
        var options;

        options = {
            params: [],
            defaultCount: 0,
            defaults: [],
            firstRestricted: firstRestricted
        };

        expect('(');

        if (!match(')')) {
            options.paramSet = {};
            while (startIndex < length) {
                if (!parseParam(options)) {
                    break;
                }
                expect(',');
            }
        }

        expect(')');

        if (options.defaultCount === 0) {
            options.defaults = [];
        }

        return {
            params: options.params,
            defaults: options.defaults,
            stricted: options.stricted,
            firstRestricted: options.firstRestricted,
            message: options.message
        };
    }

    function parseFunctionDeclaration(node, identifierIsOptional) {
        var id = null, params = [], defaults = [], body, token, stricted, tmp, firstRestricted, message, previousStrict,
            isGenerator, previousAllowYield;

        previousAllowYield = state.allowYield;

        expectKeyword('function');

        isGenerator = match('*');
        if (isGenerator) {
            lex();
        }

        if (!identifierIsOptional || !match('(')) {
            token = lookahead;
            id = parseVariableIdentifier();
            if (strict) {
                if (isRestrictedWord(token.value)) {
                    tolerateUnexpectedToken(token, Messages.StrictFunctionName);
                }
            } else {
                if (isRestrictedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictFunctionName;
                } else if (isStrictModeReservedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictReservedWord;
                }
            }
        }

        state.allowYield = !isGenerator;
        tmp = parseParams(firstRestricted);
        params = tmp.params;
        defaults = tmp.defaults;
        stricted = tmp.stricted;
        firstRestricted = tmp.firstRestricted;
        if (tmp.message) {
            message = tmp.message;
        }


        previousStrict = strict;
        body = parseFunctionSourceElements();
        if (strict && firstRestricted) {
            throwUnexpectedToken(firstRestricted, message);
        }
        if (strict && stricted) {
            tolerateUnexpectedToken(stricted, message);
        }

        strict = previousStrict;
        state.allowYield = previousAllowYield;

        return node.finishFunctionDeclaration(id, params, defaults, body, isGenerator);
    }

    function parseFunctionExpression() {
        var token, id = null, stricted, firstRestricted, message, tmp,
            params = [], defaults = [], body, previousStrict, node = new Node(),
            isGenerator, previousAllowYield;

        previousAllowYield = state.allowYield;

        expectKeyword('function');

        isGenerator = match('*');
        if (isGenerator) {
            lex();
        }

        state.allowYield = !isGenerator;
        if (!match('(')) {
            token = lookahead;
            id = (!strict && !isGenerator && matchKeyword('yield')) ? parseNonComputedProperty() : parseVariableIdentifier();
            if (strict) {
                if (isRestrictedWord(token.value)) {
                    tolerateUnexpectedToken(token, Messages.StrictFunctionName);
                }
            } else {
                if (isRestrictedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictFunctionName;
                } else if (isStrictModeReservedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictReservedWord;
                }
            }
        }

        tmp = parseParams(firstRestricted);
        params = tmp.params;
        defaults = tmp.defaults;
        stricted = tmp.stricted;
        firstRestricted = tmp.firstRestricted;
        if (tmp.message) {
            message = tmp.message;
        }

        previousStrict = strict;
        body = parseFunctionSourceElements();
        if (strict && firstRestricted) {
            throwUnexpectedToken(firstRestricted, message);
        }
        if (strict && stricted) {
            tolerateUnexpectedToken(stricted, message);
        }
        strict = previousStrict;
        state.allowYield = previousAllowYield;

        return node.finishFunctionExpression(id, params, defaults, body, isGenerator);
    }

    // ECMA-262 14.5 Class Definitions

    function parseClassBody() {
        var classBody, token, isStatic, hasConstructor = false, body, method, computed, key;

        classBody = new Node();

        expect('{');
        body = [];
        while (!match('}')) {
            if (match(';')) {
                lex();
            } else {
                method = new Node();
                token = lookahead;
                isStatic = false;
                computed = match('[');
                if (match('*')) {
                    lex();
                } else {
                    key = parseObjectPropertyKey();
                    if (key.name === 'static' && (lookaheadPropertyName() || match('*'))) {
                        token = lookahead;
                        isStatic = true;
                        computed = match('[');
                        if (match('*')) {
                            lex();
                        } else {
                            key = parseObjectPropertyKey();
                        }
                    }
                }
                method = tryParseMethodDefinition(token, key, computed, method);
                if (method) {
                    method['static'] = isStatic; // jscs:ignore requireDotNotation
                    if (method.kind === 'init') {
                        method.kind = 'method';
                    }
                    if (!isStatic) {
                        if (!method.computed && (method.key.name || method.key.value.toString()) === 'constructor') {
                            if (method.kind !== 'method' || !method.method || method.value.generator) {
                                throwUnexpectedToken(token, Messages.ConstructorSpecialMethod);
                            }
                            if (hasConstructor) {
                                throwUnexpectedToken(token, Messages.DuplicateConstructor);
                            } else {
                                hasConstructor = true;
                            }
                            method.kind = 'constructor';
                        }
                    } else {
                        if (!method.computed && (method.key.name || method.key.value.toString()) === 'prototype') {
                            throwUnexpectedToken(token, Messages.StaticPrototype);
                        }
                    }
                    method.type = Syntax.MethodDefinition;
                    delete method.method;
                    delete method.shorthand;
                    body.push(method);
                } else {
                    throwUnexpectedToken(lookahead);
                }
            }
        }
        lex();
        return classBody.finishClassBody(body);
    }

    function parseClassDeclaration(identifierIsOptional) {
        var id = null, superClass = null, classNode = new Node(), classBody, previousStrict = strict;
        strict = true;

        expectKeyword('class');

        if (!identifierIsOptional || lookahead.type === Token.Identifier) {
            id = parseVariableIdentifier();
        }

        if (matchKeyword('extends')) {
            lex();
            superClass = isolateCoverGrammar(parseLeftHandSideExpressionAllowCall);
        }
        classBody = parseClassBody();
        strict = previousStrict;

        return classNode.finishClassDeclaration(id, superClass, classBody);
    }

    function parseClassExpression() {
        var id = null, superClass = null, classNode = new Node(), classBody, previousStrict = strict;
        strict = true;

        expectKeyword('class');

        if (lookahead.type === Token.Identifier) {
            id = parseVariableIdentifier();
        }

        if (matchKeyword('extends')) {
            lex();
            superClass = isolateCoverGrammar(parseLeftHandSideExpressionAllowCall);
        }
        classBody = parseClassBody();
        strict = previousStrict;

        return classNode.finishClassExpression(id, superClass, classBody);
    }

    // ECMA-262 15.2 Modules

    function parseModuleSpecifier() {
        var node = new Node();

        if (lookahead.type !== Token.StringLiteral) {
            throwError(Messages.InvalidModuleSpecifier);
        }
        return node.finishLiteral(lex());
    }

    // ECMA-262 15.2.3 Exports

    function parseExportSpecifier() {
        var exported, local, node = new Node(), def;
        if (matchKeyword('default')) {
            // export {default} from 'something';
            def = new Node();
            lex();
            local = def.finishIdentifier('default');
        } else {
            local = parseVariableIdentifier();
        }
        if (matchContextualKeyword('as')) {
            lex();
            exported = parseNonComputedProperty();
        }
        return node.finishExportSpecifier(local, exported);
    }

    function parseExportNamedDeclaration(node) {
        var declaration = null,
            isExportFromIdentifier,
            src = null, specifiers = [];

        // non-default export
        if (lookahead.type === Token.Keyword) {
            // covers:
            // export var f = 1;
            switch (lookahead.value) {
                case 'let':
                case 'const':
                    declaration = parseLexicalDeclaration({inFor: false});
                    return node.finishExportNamedDeclaration(declaration, specifiers, null);
                case 'var':
                case 'class':
                case 'function':
                    declaration = parseStatementListItem();
                    return node.finishExportNamedDeclaration(declaration, specifiers, null);
            }
        }

        expect('{');
        while (!match('}')) {
            isExportFromIdentifier = isExportFromIdentifier || matchKeyword('default');
            specifiers.push(parseExportSpecifier());
            if (!match('}')) {
                expect(',');
                if (match('}')) {
                    break;
                }
            }
        }
        expect('}');

        if (matchContextualKeyword('from')) {
            // covering:
            // export {default} from 'foo';
            // export {foo} from 'foo';
            lex();
            src = parseModuleSpecifier();
            consumeSemicolon();
        } else if (isExportFromIdentifier) {
            // covering:
            // export {default}; // missing fromClause
            throwError(lookahead.value ?
                    Messages.UnexpectedToken : Messages.MissingFromClause, lookahead.value);
        } else {
            // cover
            // export {foo};
            consumeSemicolon();
        }
        return node.finishExportNamedDeclaration(declaration, specifiers, src);
    }

    function parseExportDefaultDeclaration(node) {
        var declaration = null,
            expression = null;

        // covers:
        // export default ...
        expectKeyword('default');

        if (matchKeyword('function')) {
            // covers:
            // export default function foo () {}
            // export default function () {}
            declaration = parseFunctionDeclaration(new Node(), true);
            return node.finishExportDefaultDeclaration(declaration);
        }
        if (matchKeyword('class')) {
            declaration = parseClassDeclaration(true);
            return node.finishExportDefaultDeclaration(declaration);
        }

        if (matchContextualKeyword('from')) {
            throwError(Messages.UnexpectedToken, lookahead.value);
        }

        // covers:
        // export default {};
        // export default [];
        // export default (1 + 2);
        if (match('{')) {
            expression = parseObjectInitializer();
        } else if (match('[')) {
            expression = parseArrayInitializer();
        } else {
            expression = parseAssignmentExpression();
        }
        consumeSemicolon();
        return node.finishExportDefaultDeclaration(expression);
    }

    function parseExportAllDeclaration(node) {
        var src;

        // covers:
        // export * from 'foo';
        expect('*');
        if (!matchContextualKeyword('from')) {
            throwError(lookahead.value ?
                    Messages.UnexpectedToken : Messages.MissingFromClause, lookahead.value);
        }
        lex();
        src = parseModuleSpecifier();
        consumeSemicolon();

        return node.finishExportAllDeclaration(src);
    }

    function parseExportDeclaration() {
        var node = new Node();
        if (state.inFunctionBody) {
            throwError(Messages.IllegalExportDeclaration);
        }

        expectKeyword('export');

        if (matchKeyword('default')) {
            return parseExportDefaultDeclaration(node);
        }
        if (match('*')) {
            return parseExportAllDeclaration(node);
        }
        return parseExportNamedDeclaration(node);
    }

    // ECMA-262 15.2.2 Imports

    function parseImportSpecifier() {
        // import {<foo as bar>} ...;
        var local, imported, node = new Node();

        imported = parseNonComputedProperty();
        if (matchContextualKeyword('as')) {
            lex();
            local = parseVariableIdentifier();
        }

        return node.finishImportSpecifier(local, imported);
    }

    function parseNamedImports() {
        var specifiers = [];
        // {foo, bar as bas}
        expect('{');
        while (!match('}')) {
            specifiers.push(parseImportSpecifier());
            if (!match('}')) {
                expect(',');
                if (match('}')) {
                    break;
                }
            }
        }
        expect('}');
        return specifiers;
    }

    function parseImportDefaultSpecifier() {
        // import <foo> ...;
        var local, node = new Node();

        local = parseNonComputedProperty();

        return node.finishImportDefaultSpecifier(local);
    }

    function parseImportNamespaceSpecifier() {
        // import <* as foo> ...;
        var local, node = new Node();

        expect('*');
        if (!matchContextualKeyword('as')) {
            throwError(Messages.NoAsAfterImportNamespace);
        }
        lex();
        local = parseNonComputedProperty();

        return node.finishImportNamespaceSpecifier(local);
    }

    function parseImportDeclaration() {
        var specifiers = [], src, node = new Node();

        if (state.inFunctionBody) {
            throwError(Messages.IllegalImportDeclaration);
        }

        expectKeyword('import');

        if (lookahead.type === Token.StringLiteral) {
            // import 'foo';
            src = parseModuleSpecifier();
        } else {

            if (match('{')) {
                // import {bar}
                specifiers = specifiers.concat(parseNamedImports());
            } else if (match('*')) {
                // import * as foo
                specifiers.push(parseImportNamespaceSpecifier());
            } else if (isIdentifierName(lookahead) && !matchKeyword('default')) {
                // import foo
                specifiers.push(parseImportDefaultSpecifier());
                if (match(',')) {
                    lex();
                    if (match('*')) {
                        // import foo, * as foo
                        specifiers.push(parseImportNamespaceSpecifier());
                    } else if (match('{')) {
                        // import foo, {bar}
                        specifiers = specifiers.concat(parseNamedImports());
                    } else {
                        throwUnexpectedToken(lookahead);
                    }
                }
            } else {
                throwUnexpectedToken(lex());
            }

            if (!matchContextualKeyword('from')) {
                throwError(lookahead.value ?
                        Messages.UnexpectedToken : Messages.MissingFromClause, lookahead.value);
            }
            lex();
            src = parseModuleSpecifier();
        }

        consumeSemicolon();
        return node.finishImportDeclaration(specifiers, src);
    }

    // ECMA-262 15.1 Scripts

    function parseScriptBody() {
        var statement, body = [], token, directive, firstRestricted;

        while (startIndex < length) {
            token = lookahead;
            if (token.type !== Token.StringLiteral) {
                break;
            }

            statement = parseStatementListItem();
            body.push(statement);
            if (statement.expression.type !== Syntax.Literal) {
                // this is not directive
                break;
            }
            directive = source.slice(token.start + 1, token.end - 1);
            if (directive === 'use strict') {
                strict = true;
                if (firstRestricted) {
                    tolerateUnexpectedToken(firstRestricted, Messages.StrictOctalLiteral);
                }
            } else {
                if (!firstRestricted && token.octal) {
                    firstRestricted = token;
                }
            }
        }

        while (startIndex < length) {
            statement = parseStatementListItem();
            /* istanbul ignore if */
            if (typeof statement === 'undefined') {
                break;
            }
            body.push(statement);
        }
        return body;
    }

    function parseProgram() {
        var body, node;

        peek();
        node = new Node();

        body = parseScriptBody();
        return node.finishProgram(body, state.sourceType);
    }

    function filterTokenLocation() {
        var i, entry, token, tokens = [];

        for (i = 0; i < extra.tokens.length; ++i) {
            entry = extra.tokens[i];
            token = {
                type: entry.type,
                value: entry.value
            };
            if (entry.regex) {
                token.regex = {
                    pattern: entry.regex.pattern,
                    flags: entry.regex.flags
                };
            }
            if (extra.range) {
                token.range = entry.range;
            }
            if (extra.loc) {
                token.loc = entry.loc;
            }
            tokens.push(token);
        }

        extra.tokens = tokens;
    }

    function tokenize(code, options, delegate) {
        var toString,
            tokens;

        toString = String;
        if (typeof code !== 'string' && !(code instanceof String)) {
            code = toString(code);
        }

        source = code;
        index = 0;
        lineNumber = (source.length > 0) ? 1 : 0;
        lineStart = 0;
        startIndex = index;
        startLineNumber = lineNumber;
        startLineStart = lineStart;
        length = source.length;
        lookahead = null;
        state = {
            allowIn: true,
            allowYield: true,
            labelSet: {},
            inFunctionBody: false,
            inIteration: false,
            inSwitch: false,
            lastCommentStart: -1,
            curlyStack: []
        };

        extra = {};

        // Options matching.
        options = options || {};

        // Of course we collect tokens here.
        options.tokens = true;
        extra.tokens = [];
        extra.tokenValues = [];
        extra.tokenize = true;
        extra.delegate = delegate;

        // The following two fields are necessary to compute the Regex tokens.
        extra.openParenToken = -1;
        extra.openCurlyToken = -1;

        extra.range = (typeof options.range === 'boolean') && options.range;
        extra.loc = (typeof options.loc === 'boolean') && options.loc;

        if (typeof options.comment === 'boolean' && options.comment) {
            extra.comments = [];
        }
        if (typeof options.tolerant === 'boolean' && options.tolerant) {
            extra.errors = [];
        }

        try {
            peek();
            if (lookahead.type === Token.EOF) {
                return extra.tokens;
            }

            lex();
            while (lookahead.type !== Token.EOF) {
                try {
                    lex();
                } catch (lexError) {
                    if (extra.errors) {
                        recordError(lexError);
                        // We have to break on the first error
                        // to avoid infinite loops.
                        break;
                    } else {
                        throw lexError;
                    }
                }
            }

            tokens = extra.tokens;
            if (typeof extra.errors !== 'undefined') {
                tokens.errors = extra.errors;
            }
        } catch (e) {
            throw e;
        } finally {
            extra = {};
        }
        return tokens;
    }

    function parse(code, options) {
        var program, toString;

        toString = String;
        if (typeof code !== 'string' && !(code instanceof String)) {
            code = toString(code);
        }

        source = code;
        index = 0;
        lineNumber = (source.length > 0) ? 1 : 0;
        lineStart = 0;
        startIndex = index;
        startLineNumber = lineNumber;
        startLineStart = lineStart;
        length = source.length;
        lookahead = null;
        state = {
            allowIn: true,
            allowYield: true,
            labelSet: {},
            inFunctionBody: false,
            inIteration: false,
            inSwitch: false,
            lastCommentStart: -1,
            curlyStack: [],
            sourceType: 'script'
        };
        strict = false;

        extra = {};
        if (typeof options !== 'undefined') {
            extra.range = (typeof options.range === 'boolean') && options.range;
            extra.loc = (typeof options.loc === 'boolean') && options.loc;
            extra.attachComment = (typeof options.attachComment === 'boolean') && options.attachComment;

            if (extra.loc && options.source !== null && options.source !== undefined) {
                extra.source = toString(options.source);
            }

            if (typeof options.tokens === 'boolean' && options.tokens) {
                extra.tokens = [];
            }
            if (typeof options.comment === 'boolean' && options.comment) {
                extra.comments = [];
            }
            if (typeof options.tolerant === 'boolean' && options.tolerant) {
                extra.errors = [];
            }
            if (extra.attachComment) {
                extra.range = true;
                extra.comments = [];
                extra.bottomRightStack = [];
                extra.trailingComments = [];
                extra.leadingComments = [];
            }
            if (options.sourceType === 'module') {
                // very restrictive condition for now
                state.sourceType = options.sourceType;
                strict = true;
            }
        }

        try {
            program = parseProgram();
            if (typeof extra.comments !== 'undefined') {
                program.comments = extra.comments;
            }
            if (typeof extra.tokens !== 'undefined') {
                filterTokenLocation();
                program.tokens = extra.tokens;
            }
            if (typeof extra.errors !== 'undefined') {
                program.errors = extra.errors;
            }
        } catch (e) {
            throw e;
        } finally {
            extra = {};
        }

        return program;
    }

    // Sync with *.json manifests.
    exports.version = '2.7.3';

    exports.tokenize = tokenize;

    exports.parse = parse;

    // Deep copy.
    /* istanbul ignore next */
    exports.Syntax = (function () {
        var name, types = {};

        if (typeof Object.create === 'function') {
            types = Object.create(null);
        }

        for (name in Syntax) {
            if (Syntax.hasOwnProperty(name)) {
                types[name] = Syntax[name];
            }
        }

        if (typeof Object.freeze === 'function') {
            Object.freeze(types);
        }

        return types;
    }());

}));
/* vim: set sw=4 ts=4 et tw=80 : */

},{}]},{},[7]);
