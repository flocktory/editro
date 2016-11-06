(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["editro"] = factory();
	else
		root["editro"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 63);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

const EventEmitter = __webpack_require__(3);
const { createDocumentFragment } = __webpack_require__(1);


module.exports = class Component extends EventEmitter {
  constructor(initialValue, config={}) {
    super();
    this.value = initialValue;
    this.config = config;
    this._listeners = [];
    this.on('change', newValue => {
      this.value = newValue;
    });
    this.render();
  }

  template() {
    return '';
  }

  render() {
    this.el = createDocumentFragment(this.template());
    if (this.config.class) {
      this.el.firstChild.classList.add(this.config.class);
    }
    this.watch();
  }

  watch() {}

  addListener(element, event, listener) {
    if (!element) {
      return;
    }

    element.addEventListener(event, listener);
    this._listeners.push({ element, event, listener });
  }

  destroy() {
    this._listeners.forEach(({ element, event, listener }) => element.removeEventListener(event, listener));
  }
}


/***/ },
/* 1 */
/***/ function(module, exports) {

const toArray = module.exports.toArray = function(list) {
  return Array.prototype.slice.call(list);
};

module.exports.elem = function(instance, n) {
  if (!n) {
    return n => module.exports.elem(instance, n);
  }

  return instance.getNode()
    .querySelector('.' + instance.getPrefix() + '-' + n);
};
module.exports.elems = function(instance, n) {
  return toArray(instance.getNode()
    .querySelectorAll('.' + instance.getPrefix() + '-' + n));
};
module.exports.is = function(instance, mod) {
  return instance.getNode().classList.contains(instance.getPrefix() + '--' + mod);
};

/**
 * html create element from html
 *
 * @returns {Element}
 */
module.exports.html = function(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content;
};

module.exports.createDocumentFragment = function (html) {
  try {
    return document.createRange().createContextualFragment(html);
  } catch (e) {
    const div = document.createElement('div');
    div.innerHTML = html;

    const fragment = document.createDocumentFragment();
    toArray(div.children).forEach(child => fragment.appendChild(child));

    return fragment;
  }
};

module.exports.toKebabCase = function (str) {
  return str.replace(/([A-Z])/g, a => '-' + a.toLowerCase());
};
module.exports.toCamelCase = function (str) {
  return str.replace(/(-.)/g, a => a.slice(1).toUpperCase());
};

module.exports.capitalize = function(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
};
module.exports.px = function px(value, defaultValue = 'auto') {
  return value || value === 0 ? value + 'px' : defaultValue;
};

const combination = module.exports.combination = function(...colls) {
  if (colls.length === 1) {
    return colls[0].map(c => [c]);
  }

  return colls[0].reduce((acc, c0) => {
    // maybe better to calc once and then clone?
    const rest = combination(...colls.slice(1));

    rest.forEach(cr => {
      cr.unshift(c0);
      acc.push(cr);
    });

    return acc;
  }, []);
  
};

module.exports.num = function num(valueStr, defaultValue = null) {
  return valueStr === '' ? defaultValue : parseInt(valueStr, 10);
};

module.exports.emitDomEvent = function emitDomEvent(elements, eventName) {
  const eventInstance = document.createEvent('Event');
  eventInstance.initEvent(eventName, true, true);
  toArray(elements).forEach(element => element.dispatchEvent(eventInstance));
};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

const Component = __webpack_require__(0);


class BaseCompositeComponent extends Component {
  render() {
    this.el = document.createDocumentFragment();

    this.components = this.getSubComponentsFactories().map(({ component, onChange }) => {
      const componentInstance = component();

      componentInstance.on('change', data => {
        onChange(data);
        this.emit('change', this.value);
      });

      this.el.appendChild(componentInstance.el);

      return componentInstance;
    });
  }

  /**
   * @returns {Array} {component: () => new Component(...), onChange: () => {}}
   */
  getSubComponentsFactories() {
    return [];
  }

  destroy() {
    this.components.forEach(component => component.destroy());
  }
}

module.exports = BaseCompositeComponent;


/***/ },
/* 3 */
/***/ function(module, exports) {

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

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

const Component = __webpack_require__(0);


/**
 * config = {choices: [[key, value]]}
 */
module.exports = class SelectComponent extends Component {
  template() {
    return `<div class="EditroField">
              <div class="EditroField-label">
                <div class="EditroField-labelWrapper">
                  ${this.config.label}
                </div>
              </div>
              <div class="EditroField-control">
                <div class="EditroSelect EditroControl">
                  <select class="EditroSelect-select">
                    <option value=""></option>
                    ${this._buildOptionsHtml(this.config.choices)}
                  </select>
                </div>
              </div>
            </div>`;
  }

  watch() {
    this.addListener(this.el.querySelector('select'), 'change', e => {
      this.emit('change', e.target.value);
    });
  }

  _buildOptionsHtml(choices=[]) {
    return choices.map(c => {
      let name, val;
      if (Array.isArray(c)) {
        val = c[0];
        name = c[1] || c[0];
      } else {
        name = val = c;
      }

      return `<option value='${val}' ${val === this.value ? 'selected' : ''}>${name}</option>`;
    }).join('\n');
  }
};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

const Component = __webpack_require__(0);


function parseShortColor(color) {
  const match = /^#([0-9A-F])([0-9A-F])([0-9A-F])$/i.exec(color);
  if (!match) {
    return null;
  }

  return {
    components: [0, 1, 2].map(i => {
      const v = parseInt(match[i + 1], 16);

      return v * 16 + v;
    }),
    opacity: 1
  };
}


function parseLongColor(color) {
  const match = /^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i.exec(color);
  if (!match) {
    return null;
  }

  return {
    components: [0, 1, 2].map(i => parseInt(match[i + 1], 16)),
    opacity: 1
  };
}


function parseRgbColor(color) {
  const match = /^rgb\(([\d\s]+),([\d\s]+),([\d\s]+)\)$/i.exec(color);
  if (!match) {
    return null;
  }

  return {
    components: [0, 1, 2].map(i => parseInt(match[i + 1], 10)),
    opacity: 1
  };
}


function parseRgbaColor(color) {
  const match = /^rgba\(([\d\s]+),([\d\s]+),([\d\s]+),([\s\d.]+)\)$/i.exec(color);
  if (!match) {
    return null;
  }

  return {
    components: [0, 1, 2].map(i => parseInt(match[i + 1], 10)),
    opacity: parseFloat(match[4])
  };
}


function colorToPair(color) {
  let components = [255, 255, 255];
  let opacity = 1;

  const match = parseShortColor(color) || parseLongColor(color) || parseRgbColor(color) || parseRgbaColor(color);
  if (match) {
    components = match.components;
    opacity = parseInt(match.opacity * 100, 10);
  }

  const formatHex = num => {
    const hex = num.toString(16);

    return hex.length === 1 ? `0${hex}` : hex;
  };

  return {
    color: `#${formatHex(components[0])}${formatHex(components[1])}${formatHex(components[2])}`,
    opacity
  };
}


function pairToColor({ color, opacity }) {
  const { components } = parseLongColor(color);

  return `rgba(${components[0]}, ${components[1]}, ${components[2]}, ${opacity / 100})`;
}


module.exports = class ColorComponent extends Component {
  template() {
    const { color, opacity } = colorToPair(this.value);

    return `<div class="EditroField">
              <div class="EditroField-label">
                <div class="EditroField-labelWrapper">
                  ${this.config.label}
                </div>
              </div>
              <div class="EditroField-control EditroField-control--inline">
                <div class="EditroColor EditroControl">
                  <div class="EditroColor-colorWrapper">
                    <input class="EditroColor-color" type="color" value="${color}" style="opacity: ${opacity / 100}" />
                  </div>
                  <div class="EditroColor-panel">
                    <input class="EditroColor-opacity EditroRange" type="range" value="${opacity}" min="0" max="100">
                  </div>
                </div>
                <div class="EditroInputWrapper EditroInputWrapper--full EditroControl">
                  <input type="text" class="EditroInput" value="${color}" />
                </div>
              </div>
            </div>`;
  }

  watch() {
    const color = this.el.querySelector('input[type=color]');
    const opacity = this.el.querySelector('input[type=range]');
    const text = this.el.querySelector('input[type=text]');

    const collectColor = () => {
      const value = pairToColor({
        color: color.value,
        opacity: opacity.value
      });

      color.style.opacity = opacity.value / 100;
      text.value = value;
      this.emit('change', value);
    };

    this.addListener(color, 'change', collectColor);
    this.addListener(opacity, 'change', collectColor);

    const onTextChanged = () => {
      const newValues = colorToPair(text.value);

      color.value = newValues.color;
      opacity.opacity = newValues.opacity;

      color.style.opacity = opacity.value / 100;
      this.emit('change', pairToColor(newValues));
    };
    this.addListener(text, 'keyup', onTextChanged);
    this.addListener(text, 'change', onTextChanged);
  }
}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

const Component = __webpack_require__(0);


/**
 * config = {type: 'number', unit: 'px'}
 */
module.exports = class InputComponent extends Component {
  template() {
    return `<div class="EditroField ${!this.config.label ? 'EditroField--controlOnly' : ''}">
              <div class="EditroField-label">
                <div class="EditroField-labelWrapper">
                  ${this.config.label}
                </div>
              </div>
              <div class="EditroField-control">
                <div class="EditroInputWrapper EditroInputWrapper--full EditroControl"
                  ${this.config.unit ? `unit="${this.config.unit}"` : ``}>
                  <input type="${this.config.type || 'text'}" 
                         class="EditroInput" 
                         value="${this.value}"/>
                </div>
              </div>
            </div>`;
  }

  watch() {
    const input = this.el.querySelector('input');
    const onChanged = e => {
      this.emit('change', e.target.value);
    };

    this.addListener(input, 'change', onChanged);
    this.addListener(input, 'keyup', onChanged);
  }
}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {'use strict';

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = __webpack_require__(50);
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ },
/* 8 */
/***/ function(module, exports) {

var g;

// This works in non-strict mode
g = (function() { return this; })();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Component__);



class TogglerComponent extends __WEBPACK_IMPORTED_MODULE_0__Component___default.a {
  template() {
    return `<div class="EditroField">
              <div class="EditroField-label">
                <div class="EditroField-labelWrapper"></div>
              </div>
              <div class="EditroField-control">
                <div class="EditroBool" editro-toggler state="${this.value}"></div>
                <div class="EditroField-controlLabel">
                  ${this.config.label}
                </div>
              </div>
            </div>`;
  }

  watch() {
    this.addListener(this.el.querySelector('[editro-toggler]'), 'click', e => {
      e.target.setAttribute('state', !this.value);
      this.emit('change', !this.value);
    });
  }
}
/* harmony export (immutable) */ exports["default"] = TogglerComponent;



/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = __webpack_require__(43)
var ieee754 = __webpack_require__(44)
var isArray = __webpack_require__(45)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10).Buffer, __webpack_require__(8)))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Component__);



class ColorPlaceholderComponent extends __WEBPACK_IMPORTED_MODULE_0__Component___default.a {
  template() {
    return `<div class="EditroField">
              <div class="EditroField-label">
                <div class="EditroField-labelWrapper">
                  ${this.config.label}
                </div>
              </div>
              <div class="EditroField-control">
                <div class="EditroColor EditroControl">
                  <div class="EditroColor-placeholder" color-placeholder></div>
                </div>
              </div>
            </div>`;
  }

  watch() {
    this.addListener(this.el.querySelector('[color-placeholder]'), 'click', () => this.emit('change'));
  }
}
/* harmony export (immutable) */ exports["default"] = ColorPlaceholderComponent;



/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Component__);



module.exports = class ImageComponent extends __WEBPACK_IMPORTED_MODULE_0__Component___default.a {
  template() {
    return `<div class="EditroField">
              <div class="EditroField-label">
                <div class="EditroField-labelWrapper">
                  ${this.config.label}
                </div>
              </div>
              <div class="EditroField-control EditroField-control--inline">
                <div class="EditroFileInput">
                  <div class="EditroIcon EditroIcon--upload"></div>
                  <input class="EditroFileInput-control" type="file" />
                </div>
              </div>
            </div>`;
  }

  watch() {
    const fileInput = this.el.querySelector('input');

    this.addListener(fileInput, 'change', () => {
      const file = fileInput.files[0];

      this.config.upload([file]).then(url => {
        this.emit('change', url);
      });
    });
  }
}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__utils__);




/**
 * config = {arrowDirection: 'in', shapes: {inner: 'real', outer: 'imag'}}
 */
module.exports = class TBLRComponent extends __WEBPACK_IMPORTED_MODULE_0__Component___default.a {
  template() {
    return `<div class="EditroField">
              <div class="EditroField-label">
                <div class="EditroField-labelWrapper">
                  ${this.config.label}
                </div>
              </div>
              <div class="EditroField-control">
                <div class="EditroSelect EditroControl">
                  <div class="EditroFourInputs EditroControl" arrow-direction="${this.config.arrowDirection}">
                    <div class="EditroFourInputs-outer" shape="${this.config.shapes.outer}"></div>
                    <div class="EditroFourInputs-inner" shape="${this.config.shapes.inner}"></div>
                    <div class="EditroFourInputs-arrow EditroFourInputs-arrow--top"></div>
                    <div class="EditroFourInputs-arrow EditroFourInputs-arrow--bottom"></div>
                    <div class="EditroFourInputs-arrow EditroFourInputs-arrow--right"></div>
                    <div class="EditroFourInputs-arrow EditroFourInputs-arrow--left"></div>
                    <input class="EditroFourInputs-input EditroFourInputs-input--top" type="number" placeholder="auto" 
                           value="${this.value.top}" target-name="top" />
                    <input class="EditroFourInputs-input EditroFourInputs-input--bottom" type="number" placeholder="auto" 
                           value="${this.value.bottom}" target-name="bottom" />
                    <input class="EditroFourInputs-input EditroFourInputs-input--right" type="number" placeholder="auto" 
                           value="${this.value.right}" target-name="right" />
                    <input class="EditroFourInputs-input EditroFourInputs-input--left" type="number" placeholder="auto" 
                           value="${this.value.left}" target-name="left" />
                  </div>
                </div>
              </div>
            </div>`;
  }

  watch() {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["toArray"])(this.el.querySelectorAll('input')).forEach(input => {
      const onChange = () => {
        this.value[input.getAttribute('target-name')] = input.value;
        this.emit('change', this.value);
      };
      this.addListener(input, 'keyup', onChange);
      this.addListener(input, 'change', onChange);
    });
  }
}


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__utils__);




module.exports = class WidthHeightComponent extends __WEBPACK_IMPORTED_MODULE_0__Component___default.a {
  template() {
    return `<div class="EditroField">
              <div class="EditroField-label">
                <div class="EditroField-labelWrapper">
                  ${this.config.label}
                </div>
              </div>
              <div class="EditroField-control">
                <div class="EditroSize EditroControl">
                  <div class="EditroSize-input">
                    <div class="EditroInputWrapper" unit="px">
                      <input type="number" class="EditroInput" placeholder="auto" 
                             value="${this.value.width}" target-name="width" />
                    </div>
                  </div>
                  <div class="EditroSize-separator">&times;</div>
                  <div class="EditroSize-input">
                    <div class="EditroInputWrapper" unit="px">
                      <input type="number" class="EditroInput" placeholder="auto" 
                             value="${this.value.height}" target-name="height" />
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
  }

  watch() {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["toArray"])(this.el.querySelectorAll('input')).forEach(input => {
      const onChange = () => {
        this.value[input.getAttribute('target-name')] = input.value;
        this.emit('change', this.value);
      };
      this.addListener(input, 'keyup', onChange);
    });
  }
}


/***/ },
/* 15 */
/***/ function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNDExIDU0MWwtMzU1IDM1NSAzNTUgMzU1IDE0NC0xNDRxMjktMzEgNzAtMTQgMzkgMTcgMzkgNTl2NDQ4cTAgMjYtMTkgNDV0LTQ1IDE5aC00NDhxLTQyIDAtNTktNDAtMTctMzkgMTQtNjlsMTQ0LTE0NC0zNTUtMzU1LTM1NSAzNTUgMTQ0IDE0NHEzMSAzMCAxNCA2OS0xNyA0MC01OSA0MGgtNDQ4cS0yNiAwLTQ1LTE5dC0xOS00NXYtNDQ4cTAtNDIgNDAtNTkgMzktMTcgNjkgMTRsMTQ0IDE0NCAzNTUtMzU1LTM1NS0zNTUtMTQ0IDE0NHEtMTkgMTktNDUgMTktMTIgMC0yNC01LTQwLTE3LTQwLTU5di00NDhxMC0yNiAxOS00NXQ0NS0xOWg0NDhxNDIgMCA1OSA0MCAxNyAzOS0xNCA2OWwtMTQ0IDE0NCAzNTUgMzU1IDM1NS0zNTUtMTQ0LTE0NHEtMzEtMzAtMTQtNjkgMTctNDAgNTktNDBoNDQ4cTI2IDAgNDUgMTl0MTkgNDV2NDQ4cTAgNDItMzkgNTktMTMgNS0yNSA1LTI2IDAtNDUtMTl6Ii8+PC9zdmc+"

/***/ },
/* 16 */
/***/ function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNDQwIDg5M3EwLTE2MS04Ny0yOTVsLTc1NCA3NTNxMTM3IDg5IDI5NyA4OSAxMTEgMCAyMTEuNS00My41dDE3My41LTExNi41IDExNi0xNzQuNSA0My0yMTIuNXptLTk5OSAyOTlsNzU1LTc1NHEtMTM1LTkxLTMwMC05MS0xNDggMC0yNzMgNzN0LTE5OCAxOTktNzMgMjc0cTAgMTYyIDg5IDI5OXptMTIyMy0yOTlxMCAxNTctNjEgMzAwdC0xNjMuNSAyNDYtMjQ1IDE2NC0yOTguNSA2MS0yOTguNS02MS0yNDUtMTY0LTE2My41LTI0Ni02MS0zMDAgNjEtMjk5LjUgMTYzLjUtMjQ1LjUgMjQ1LTE2NCAyOTguNS02MSAyOTguNSA2MSAyNDUgMTY0IDE2My41IDI0NS41IDYxIDI5OS41eiIvPjwvc3ZnPg=="

/***/ },
/* 17 */
/***/ function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNjY0IDI1NnY0NDhxMCAyNi0xOSA0NXQtNDUgMTloLTQ0OHEtNDIgMC01OS00MC0xNy0zOSAxNC02OWwxMzgtMTM4cS0xNDgtMTM3LTM0OS0xMzctMTA0IDAtMTk4LjUgNDAuNXQtMTYzLjUgMTA5LjUtMTA5LjUgMTYzLjUtNDAuNSAxOTguNSA0MC41IDE5OC41IDEwOS41IDE2My41IDE2My41IDEwOS41IDE5OC41IDQwLjVxMTE5IDAgMjI1LTUydDE3OS0xNDdxNy0xMCAyMy0xMiAxNCAwIDI1IDlsMTM3IDEzOHE5IDggOS41IDIwLjV0LTcuNSAyMi41cS0xMDkgMTMyLTI2NCAyMDQuNXQtMzI3IDcyLjVxLTE1NiAwLTI5OC02MXQtMjQ1LTE2NC0xNjQtMjQ1LTYxLTI5OCA2MS0yOTggMTY0LTI0NSAyNDUtMTY0IDI5OC02MXExNDcgMCAyODQuNSA1NS41dDI0NC41IDE1Ni41bDEzMC0xMjlxMjktMzEgNzAtMTQgMzkgMTcgMzkgNTl6Ii8+PC9zdmc+"

/***/ },
/* 18 */
/***/ function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik00ODAgMTQwOHYxMjhoLTM1MnYtMTI4aDM1MnptMzUyLTEyOHEyNiAwIDQ1IDE5dDE5IDQ1djI1NnEwIDI2LTE5IDQ1dC00NSAxOWgtMjU2cS0yNiAwLTQ1LTE5dC0xOS00NXYtMjU2cTAtMjYgMTktNDV0NDUtMTloMjU2em0xNjAtMzg0djEyOGgtODY0di0xMjhoODY0em0tNjQwLTUxMnYxMjhoLTIyNHYtMTI4aDIyNHptMTMxMiAxMDI0djEyOGgtNzM2di0xMjhoNzM2em0tOTYwLTExNTJxMjYgMCA0NSAxOXQxOSA0NXYyNTZxMCAyNi0xOSA0NXQtNDUgMTloLTI1NnEtMjYgMC00NS0xOXQtMTktNDV2LTI1NnEwLTI2IDE5LTQ1dDQ1LTE5aDI1NnptNjQwIDUxMnEyNiAwIDQ1IDE5dDE5IDQ1djI1NnEwIDI2LTE5IDQ1dC00NSAxOWgtMjU2cS0yNiAwLTQ1LTE5dC0xOS00NXYtMjU2cTAtMjYgMTktNDV0NDUtMTloMjU2em0zMjAgMTI4djEyOGgtMjI0di0xMjhoMjI0em0wLTUxMnYxMjhoLTg2NHYtMTI4aDg2NHoiLz48L3N2Zz4="

/***/ },
/* 19 */
/***/ function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNjY0IDg5NnEwIDE1Ni02MSAyOTh0LTE2NCAyNDUtMjQ1IDE2NC0yOTggNjFxLTE3MiAwLTMyNy03Mi41dC0yNjQtMjA0LjVxLTctMTAtNi41LTIyLjV0OC41LTIwLjVsMTM3LTEzOHExMC05IDI1LTkgMTYgMiAyMyAxMiA3MyA5NSAxNzkgMTQ3dDIyNSA1MnExMDQgMCAxOTguNS00MC41dDE2My41LTEwOS41IDEwOS41LTE2My41IDQwLjUtMTk4LjUtNDAuNS0xOTguNS0xMDkuNS0xNjMuNS0xNjMuNS0xMDkuNS0xOTguNS00MC41cS05OCAwLTE4OCAzNS41dC0xNjAgMTAxLjVsMTM3IDEzOHEzMSAzMCAxNCA2OS0xNyA0MC01OSA0MGgtNDQ4cS0yNiAwLTQ1LTE5dC0xOS00NXYtNDQ4cTAtNDIgNDAtNTkgMzktMTcgNjkgMTRsMTMwIDEyOXExMDctMTAxIDI0NC41LTE1Ni41dDI4NC41LTU1LjVxMTU2IDAgMjk4IDYxdDI0NSAxNjQgMTY0IDI0NSA2MSAyOTh6Ii8+PC9zdmc+"

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

/*
 * Main class. Response for whole editor.
 * Provide static methods for extendind.
 *
 *
 */

const EventEmmiter = __webpack_require__(3);
const assert = __webpack_require__(7);
const Frame = __webpack_require__(52);
const Toolbox = __webpack_require__(53);

module.exports = function() {
  const initHooks = [];

  class Editro extends EventEmmiter {
    constructor(root, options) {
      super();

      Object.assign(this.options, options);
      const code = options.code;

      this.setMaxListeners(1000);

      this.node = document.createElement('div');
      this.node.className = 'Editro';

      // pass code through preprocessors
      const cp = Object.values(Editro.codePreprocessor);
      const prepared = cp.length ?
        cp.reduce((c, p) => p(c), code) :
        code;
      this.frame = new Frame({
        prefix: this.options.prefix + 'Frame',
        code: prepared
      });
      this.frame.on('selected', this._onElementSelected.bind(this));
      this.frame.on('deselected', () => this.emit('deselected'));
      this.frame.on('change', this._onFrameChanged.bind(this));

      this.toolbox = new Toolbox(this);

      // Build DOM
      // top
      const instruments = new Editro.type.Instruments(this);
      const topPanel = new Editro.type.Panel(this, {
        fixed: true,
        position: 'top',
        tag: 'instruments',
        child: instruments.getNode()
      });
      this.node.appendChild(topPanel.getNode());
      // center
      const center = document.createElement('div');
      center.className = 'Editro-center';
      center.appendChild(this.frame.getNode());
      // right
      const rightPanel = new Editro.type.Panel(this, {
        size: '400px',
        position: 'right',
        tag: 'toolbox',
        child: this.toolbox.getNode()
      });
      center.appendChild(rightPanel.getNode());
      this.node.appendChild(center);
      root.appendChild(this.node);

      initHooks.forEach(h => h(this, root, options));
    }

    setOption(name, val) {
      const old = this.options[name];
      if (old !== val) {
        this.options[name] = val;
        this.emit(`optionChanged:${name}`, val, old);

        if (this.optionsHandlers[name]) {
          this.optionsHandlers[name].call(null, this, val, old);
        }
      } else {
        return false;
      }
    }
    getOption(name) {
      return this.options[name];
    }

    getNode() {
      return this.node;
    }

    getToolbox() {
      return this.toolbox;
    }

    getHtml() {
      const raw = this.frame.getHtml();

      return this._postprocess(raw);
    }

    setHtml(code, o={}) {
      if (code === this.getHtml()) {
        return;
      }

      // pass code through preprocessors
      const cp = Object.values(Editro.codePreprocessor);
      const prepared = cp.length ?
        cp.reduce((c, p) => p(c), code) :
        code;

      this.frame.once('load', () => {
        this.emit('change', {
          html: code,
          sourceType: o.sourceType || 'setHtml',
          source: o.source
        });
      });
      this.frame.setHtml(prepared);
    }

    selectByQuery(q) {
      this.frame.selectByQuery(q);
    }

    _onElementSelected(element) {
      this.emit('selected', element);
    }

    _onFrameChanged(e) {
      this.emit('change', {
        html: this._postprocess(e.html),
        sourceType: 'frame',
        source: this.frame
      });
    }

    _postprocess(raw) {
      const cp = Object.values(Editro.codePostprocessor);
      return cp.length ?
        cp.reduce((c, p) => p(c), raw) :
        raw;
    }
  }

  Editro.prototype.options = { };
  Editro.prototype.optionsHandlers = {};

  Editro.defineOption = (name, d, f) => {
    Editro.prototype.options[name] = d;
    if (f) {
      assert(typeof f === 'function', 'Option handler should be falsy or function');
      Editro.prototype.optionsHandlers[name] = f;
    }
  };

  Editro.defineInitHook = (f) => {
    initHooks.push(f);
  };

  Editro.defineExtension = (name, value) => {
    Editro.prototype[name] = value;
  };

  Editro.helpers = [];
  Editro.defineHelper = (type, name, value) => {
    Editro.helpers[type] = Editro[type] = Editro.helpers[type] || {};
    Editro.helpers[type][name] = value;
  };

  return Editro;
};



/***/ },
/* 21 */
/***/ function(module, exports) {

// This addon prevent loading scripts in iframe.
// It change all scripts filetypes to "editro/noscript"

const sre = /<script[^>]*>/gmi;


module.exports = function(Editro) {
  Editro.defineHelper('codePreprocessor', 'scripts', module.exports.pre);
  Editro.defineHelper('codePostprocessor', 'scripts', module.exports.post);
};

module.exports.pre = function pre(code) {
  return code.replace(sre, (str) => str.indexOf('text/javascript') > -1 ?
    str.replace('text/javascript', 'editro/noscript') :
    str.replace(/<script/i, '<script type="editro/noscript" '));
};

module.exports.post = function post(code) {
  return code.replace(/type="editro\/noscript"/gmi, 'type="text/javascript"');
};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

var map = {
	"./ActionButtonComponent.js": 54,
	"./BackgroundComponent.js": 55,
	"./BaseCompositeComponent.js": 2,
	"./BorderComponent.js": 56,
	"./BorderRadiusComponent.js": 57,
	"./ColorComponent.js": 5,
	"./ColorPlaceholderComponent.js": 11,
	"./Component.js": 0,
	"./ContentComponent.js": 58,
	"./FontComponent.js": 59,
	"./IconRadioGroupComponent.js": 60,
	"./ImageComponent.js": 12,
	"./InputComponent.js": 6,
	"./PositionComponent.js": 61,
	"./SelectComponent.js": 4,
	"./SizeComponent.js": 62,
	"./TBLRComponent.js": 13,
	"./TogglerComponent.js": 9,
	"./WidthHeightComponent.js": 14
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 22;


/***/ },
/* 23 */
/***/ function(module, exports) {

module.exports = function(Editro) {
  const { tags, type: { Controller, BackgroundComponent } } = Editro;
  const enabledTags = [];

  enabledTags.push(
    ...tags.input,
    ...tags.list,
    ...tags.definition,
    ...tags.block,
    ...tags.headers,
    ...tags.content,
    ...tags.form
  );

  class Background extends Controller {
    constructor(editro) {
      super(editro);
      this.editro = editro;
    }

    onElementSelected(el) {
      const enabled = enabledTags.includes(el.getTag());
      this.toggle(enabled);

      if (!enabled) {
        return;
      }

      if (this.component) {
        this.component.removeAllListeners('change');
        this.component.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Background</h3>';

      this.component = new BackgroundComponent(this._getValue(el), {
        i18n: a => a,
        upload: this.editro.upload.bind(this.editro)
      });

      this.component.on('change', v => this._onChange(el, v));
      this.node.appendChild(this.component.el);
    }

    getPane() {
      return 'style';
    }

    _onChange(el, value) {
      const backgroundImages = [];

      if (value.backgroundImage) {
        backgroundImages.push(`url(${value.backgroundImage})`);
      }

      if (!value.hasGradient) {
        el.setStyle('backgroundColor', value.color1);
      } else {
        const direction = value.gradientDirection || 'to right';
        backgroundImages
          .push(`linear-gradient(${direction}, ${value.color1} 0%, ${value.color2} 100%)`);
      }

      if (backgroundImages.length) {
        el.setStyle('backgroundImage', backgroundImages.join(', '));
      }

      el.setStyle('backgroundSize', value.backgroundSize);
      el.setStyle('backgroundPosition', value.backgroundPosition);
      el.setStyle('backgroundRepeat', 'no-repeat');
    }

    _setElBg(url) {
      this.el.setStyle('backgroundImage', `url(${url})`);
    }

    _getValue(el) {
      const computedStyle = el.getStyles([
        'backgroundColor',
        'backgroundImage',
        'backgroundSize',
        'backgroundPosition'
      ]);

      let color1 = computedStyle.backgroundColor;
      let hasGradient = false;
      let color2;
      let backgroundImage;
      let gradientDirection;

      const gradientMatch = /linear-gradient\(([\s\w]+),\s*(#[\d\w]{3,6}|rgba?\([\s\d,]+\))\s*0%\s*,\s*(#[\d\w]{3,6}|rgba?\([\s\d,]+\))\s*100%\s*\)/i.exec(computedStyle.backgroundImage || '');
      if (gradientMatch) {
        hasGradient = true;
        gradientDirection = gradientMatch[1].trim();
        color1 = gradientMatch[2].trim();
        color2 = gradientMatch[3].trim();
      }

      const urlMatch = /url\(([^\)]+)\)/i.exec(computedStyle.backgroundImage || '');
      if (urlMatch) {
        backgroundImage = urlMatch[1];
      }

      return {
        color1,
        hasGradient,
        color2,
        gradientDirection,
        backgroundImage,
        backgroundSize: computedStyle.backgroundSize,
        backgroundPosition: computedStyle.backgroundPosition
      };
    }
  }

  Editro.defineHelper('controllers', 'Background', Background);
};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

const { combination, num, px } = __webpack_require__(1);

module.exports = function(Editro) {
  const { tags, type: { Controller, BorderComponent } } = Editro;

  const enabledTags = [
    ...tags.input,
    ...tags.list,
    ...tags.definition,
    ...tags.block,
    ...tags.headers,
    ...tags.content,
    ...tags.form
  ];

  class Border extends Controller {
    constructor(editro) {
      super(editro);
      this.editro = editro;
    }

    onElementSelected(el) {
      const enabled = enabledTags.includes(el.getTag());
      this.toggle(enabled);

      if (!enabled) {
        return;
      }

      if (this.component) {
        this.component.removeAllListeners('change');
        this.component.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Border</h3>';

      this.component = new BorderComponent(this._getValue(el), {
        i18n: a => a
      });

      this.component.on('change', v => this._onChange(el, v));
      this.node.appendChild(this.component.el);
    }

    getNode() {
      return this.node;
    }

    getPane() {
      return 'settings';
    }

    _onChange(el, value) {
      if (value.showComponents) {
        const sides = ['Top', 'Right', 'Bottom', 'Left'];
        sides.forEach((s, i) => {
          el.setStyle('border' + s + 'Width', px(value.components[i][0]));
          el.setStyle('border' + s + 'Color', value.components[i][1]);
        });
      } else {
        el.setStyle('borderWidth', px(value.oneValue[0]));
        el.setStyle('borderColor', value.oneValue[1]);
      }
      el.setStyle('borderStyle', 'solid');
    }

    _getValue(el) {
      const requiredProps = combination(['Top', 'Right', 'Bottom', 'Left'], ['Width', 'Color'])
        .map(c => 'border' + c.join(''));
      const computedStyle = el.getStyles(requiredProps);
      const components = ['Top', 'Right', 'Bottom', 'Left'].map(position =>
        ['Width', 'Color'].map((prop, i) =>
          i ? computedStyle[`border${position}${prop}`] : num(computedStyle[`border${position}${prop}`])));
      const showComponents = components.reduce(
        (condition, rad, i) => condition ||
          (i ? components[i][0] !== components[i - 1][0] || components[i][1] !== components[i - 1][1] : false),
        false
      );

      return {
        oneValue: components[0].slice(),
        showComponents,
        components
      };
    }
  }

  Editro.defineHelper('controllers', 'Border', Border);
};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

const { combination, num, px } = __webpack_require__(1);

const sides = ['TopRight', 'BottomRight', 'BottomLeft', 'TopLeft'];

module.exports = function(Editro) {
  const { tags, type: { Controller, BorderRadiusComponent } } = Editro;

  const enabledTags = [
    ...tags.input,
    ...tags.list,
    ...tags.definition,
    ...tags.block,
    ...tags.headers,
    ...tags.content,
    ...tags.form
  ];

  class BorderRadius extends Controller {
    onElementSelected(el) {
      const enabled = enabledTags.includes(el.getTag());
      this.toggle(enabled);

      if (!enabled) {
        return;
      }


      if (this.component) {
        this.component.removeAllListeners('change');
        this.component.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Border radius</h3>';

      this.component = new BorderRadiusComponent(this._getValue(el), {
        i18n: a => a
      });

      this.component.on('change', v => this._onChange(el, v));
      this.node.appendChild(this.component.el);
    }

    getNode() {
      return this.node;
    }

    getPane() {
      return 'settings';
    }

    _onChange(el, value) {
      if (value.showComponents) {
        sides.forEach((position, i) => {
          el.setStyle(`border${position}Radius`, px(value.components[i]));
        });
      } else {
        el.setStyle('borderRadius', px(value.oneValue));
      }
    }

    _getValue(el) {
      const computedStyle = el.getStyles(sides.map(s => 'border' + s + 'Radius'));
      const components = sides.map(position =>
        num(computedStyle[`border${position}Radius`]));

      // TODO refactor .some
      const showComponents = components.reduce(
        (condition, rad, i) => condition || (i ? components[i] !== components[i - 1] : false),
        false
      );

      return {
        oneValue: components[0],
        showComponents,
        components
      };
    }
  }

  Editro.defineHelper('controllers', 'BorderRadius', BorderRadius);
};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

const { px } = __webpack_require__(1);

module.exports = function(Editro) {
  const { tags } = Editro;
  const { Controller, FontComponent } = Editro.type;

  const enabledTags = [
    ...tags.input,
    ...tags.inline,
    ...tags.list,
    ...tags.definition,
    ...tags.block,
    ...tags.headers,
    ...tags.content,
    ...tags.form
  ];

  class FontController extends Controller {
    onElementSelected(el) {
      const enabled = enabledTags.includes(el.getTag());
      this.toggle(enabled);

      if (!enabled) {
        return;
      }

      this.el = el;
      if (this.select) {
        this.select.removeAllListeners('change');
        this.node.innerHTML = '';
        this.select.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Font</h3>';

      const value = {
        color: this.el.getStyle('color'),
        textAlign: this.el.getStyle('textAlign'),
        fontWeight: this.el.getStyle('fontWeight'),
        fontStyle: this.el.getStyle('fontStyle'),
        lineHeight: this.el.getStyle('lineHeight')
     };

      this.select = new FontComponent(value, {
        i18n: this.editro.i18n
      });
      this.select.on('change', v => this._onChange(v));

      this.node.appendChild(this.select.el);
    }

    getNode() {
      return this.node;
    }

    getPane() {
      return 'style';
    }

    _onChange({ textAlign, fontWeight, fontStyle, fontSize, lineHeight, color }) {
      this.el.setStyle('color', color);
      this.el.setStyle('textAlign', textAlign);
      this.el.setStyle('fontWeight', fontWeight);
      this.el.setStyle('fontStyle', fontStyle);
      this.el.setStyle('lineHeight', px(lineHeight));
      this.el.setStyle('fontSize', px(fontSize));
    }
  }

  Editro.defineHelper('controllers', 'FontController', FontController);
};



/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

const { createDocumentFragment } = __webpack_require__(1);

const defaultFonts = [
  {
    fontFamily: 'Helvetica, Arial, sans-serif'
  },
  {
    fontFamily: 'Verdana, sans-serif'
  },
  {
    fontFamily: 'Tahoma, sans-serif'
  },
  {
    fontFamily: '"Times new roman", serif'
  },
  {
    fontFamily: 'Georgia, serif'
  },
  {
    fontFamily: '"Open Sans", sans-serif',
    source: 'https://fonts.googleapis.com/css?family=Open+Sans:400,700&subset=latin,cyrillic'
  },
  {
    fontFamily: '"Open Sans Condensed", sans-serif',
    source: 'https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,700&subset=latin,cyrillic'
  },
  {
    fontFamily: 'Roboto, sans-serif',
    source: 'https://fonts.googleapis.com/css?family=Roboto:400,700&subset=latin,cyrillic'
  },
  {
    fontFamily: '"Roboto Condensed", sans-serif',
    source: 'https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700&subset=latin,cyrillic'
  },
  {
    fontFamily: '"Roboto Slab", serif',
    source: 'https://fonts.googleapis.com/css?family=Roboto+Slab:400,700&subset=latin,cyrillic'
  },
  {
    fontFamily: 'Lora, serif',
    source: 'https://fonts.googleapis.com/css?family=Lora:400,700&subset=latin,cyrillic'
  },
  {
    fontFamily: '"PT Sans", sans-serif',
    source: 'https://fonts.googleapis.com/css?family=PT+Sans:400,700&subset=latin,cyrillic'
  },
  {
    fontFamily: 'Lobster, cursive',
    source: 'https://fonts.googleapis.com/css?family=Lobster&subset=latin,cyrillic'
  }
];

module.exports = function(Editro) {
  const { tags } = Editro;
  const { Controller, SelectComponent } = Editro.type;

  const enabledTags = [
    ...tags.input,
    ...tags.list,
    ...tags.definition,
    ...tags.block,
    ...tags.headers,
    ...tags.content,
    ...tags.form
  ];

  defaultFonts.map(f => Editro.defineHelper('font', f.fontFamily, f));

  class FontFamilyController extends Controller {
    onElementSelected(el) {
      const enabled = enabledTags.includes(el.getTag());
      this.toggle(enabled);

      if (!enabled) {
        return;
      }

      this.el = el;
      if (this.select) {
        this.select.removeAllListeners('change');
        this.select.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Font family</h3>';

      this.select = new SelectComponent(el.getStyle('fontFamily'), {
        choices: Object.values(Editro.font)
          .map(font => [font.fontFamily, font.fontFamily]),
        label: this.editro.i18n('Font family')
      });
      this.select.on('change', v => this._onChange(v));

      this.node.appendChild(this.select.el);
    }

    getNode() {
      return this.node;
    }

    getPane() {
      return 'style';
    }

    _onChange(fontFamily) {
      this.el.setStyle('fontFamily', fontFamily);

      this.el.withNode(node => {
        const source = Editro.font[fontFamily].source;
        const linkToSource = node.querySelector('link[role=font-family]');

        if (source) {
          if (linkToSource) {
            linkToSource.setAttribute('href', source);
          } else {
            const link = createDocumentFragment(`<link rel="stylesheet" href="${source}" role="font-family" />`);
            node.appendChild(link);
          }
        } else if (linkToSource) {
          node.removeChild(linkToSource);
        }
      });
    }
  }

  Editro.defineHelper('controllers', 'FontFamilyController', FontFamilyController);
};



/***/ },
/* 28 */
/***/ function(module, exports) {

module.exports = function(Editro) {
  const { type: { Controller, InputComponent, SelectComponent } } = Editro;

  class Href extends Controller {
    onElementSelected(el) {
      const enabled = el.getTag() === 'a';
      this.toggle(enabled);
      if (!enabled) {
        return;
      }

      if (this.component) {
        this.component.removeAllListeners('change');
        this.component.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Href</h3>';

      this.component = new InputComponent(el.getAttribute('href') || '');

      this.component.on('change', v => this._onChange(el, v));
      this.node.appendChild(this.component.el);

      this.targetComponent = new SelectComponent(el.getAttribute('target'), {
        choices: [
          ['_top', 'Same tab'],
          ['_blank', 'New tab']
        ],
        label: 'Open in'
      });
      this.targetComponent.on('change', v => el.setAttribute('target', v) || '_top');
      this.getNode().appendChild(this.targetComponent.el);
    }

    getNode() {
      return this.node;
    }

    getPane() {
      return 'settings';
    }

    _onChange(el, value) {
      el.setAttribute('href', value);
    }
  }

  Editro.defineHelper('controllers', 'Href', Href);
};


/***/ },
/* 29 */
/***/ function(module, exports) {

module.exports = function(Editro) {
  const { type: { Controller, InputComponent } } = Editro;

  class Placeholder extends Controller {
    onElementSelected(el) {
      const enabled = ['input', 'textarea'].includes(el.getTag());
      this.toggle(enabled);
      if (!enabled) {
        return;
      }

      if (this.component) {
        this.component.removeAllListeners('change');
        this.component.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Placeholder</h3>';

      this.component = new InputComponent(el.getAttribute('placeholder') || '');

      this.component.on('change', v => this._onChange(el, v));
      this.node.appendChild(this.component.el);
    }

    getPane() {
      return 'content';
    }

    _onChange(el, value) {
      el.setAttribute('placeholder', value);
    }
  }

  Editro.defineHelper('controllers', 'Placeholder', Placeholder);
};


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

const { num, px } = __webpack_require__(1);
const directions = ['top', 'bottom', 'left', 'right'];

const getStyleName = (prefix, direction) =>
  prefix ? prefix + direction[0].toUpperCase() + direction.slice(1) : direction;

module.exports = function(Editro) {
  const { tags, type: { Controller, TBLRComponent, PositionComponent } } = Editro;

  const enabledTags = [
    ...tags.input,
    ...tags.list,
    ...tags.definition,
    ...tags.block,
    ...tags.headers,
    ...tags.content,
    ...tags.form,
    ...tags.embedded
  ];

  class BaseTBLRController extends Controller {
    constructor(editro) {
      super(editro);

      this.i18n = a => a;
    }

    onElementSelected(el) {
      const enabled = enabledTags.includes(el.getTag());
      this.toggle(enabled);
      if (!enabled) {
        return;
      }

      this.el = el;

      if (this.component) {
        this.component.removeAllListeners('change');
        this.component.destroy();
      }

      this.node.innerHTML = `<h3 class="EditroController-title">${this.title}</h3>`;

      this.component = this.createComponent(this.normalize(this.get()), {
        i18n: a => a
      });
      this.component.on('change', v => this._onChange(el, v));
      this.node.appendChild(this.component.el);
    }

    getNode() {
      return this.node;
    }

    getPane() {
      return 'settings';
    }

    get() {
      const value = {};

      directions.forEach(direction => {
        value[direction] = this.el.getStyle(getStyleName(this.stylesPrefix, direction));
      });

      return value;
    }

    normalize(value) {
      const result = Object.assign({}, value);

      directions.forEach(direction => {
        result[direction] = num(result[direction]);
      });

      return result;
    }

    _onChange(el, value) {
      directions.forEach(direction => {
        el.setStyle(getStyleName(this.stylesPrefix, direction), px(value[direction]));
      });
    }
  }

  class Margin extends BaseTBLRController {
    get stylesPrefix() {
      return 'margin';
    }

    createComponent(value) {
      return new TBLRComponent(value, {
        arrowDirection: 'out',
        shapes: {
          inner: 'real',
          outer: 'imag'
        },
        label: this.i18n('Space between element and others')
      });
    }

    get title() {
      return 'Margin';
    }
  }

  class Padding extends BaseTBLRController {
    get stylesPrefix() {
      return 'padding';
    }

    createComponent(value) {
      return new TBLRComponent(value, {
        arrowDirection: 'in',
        shapes: {
          inner: 'imag',
          outer: 'real'
        },
        label: this.i18n('Space between borders and content')
      });
    }

    get title() {
      return 'Padding';
    }
  }

  class Position extends BaseTBLRController {
    createComponent(value) {
      return new PositionComponent(value, {
        i18n: this.i18n
      });
    }

    get() {
      const value = super.get();
      value.position = this.el.getStyle('position');
      return value;
    }

    set(value) {
      super.set(value);

      this.el.setStyle('position', value.position);
    }

    normalize(value) {
      const normalizedValue = super.normalize(value);

      if (['static', 'relative', 'absolute', 'fixed'].indexOf(normalizedValue.position) === -1) {
        normalizedValue.position = 'static';
      }

      return normalizedValue;
    }

    _onChange(el, value) {
      directions.forEach(direction => {
        el.setStyle(getStyleName(this.stylesPrefix, direction), px(value[direction]));
      });
      el.setStyle('position', value.position);
    }

    get title() {
      return 'Position';
    }
  }


  Editro.defineHelper('controllers', 'Margin', Margin);
  Editro.defineHelper('controllers', 'Padding', Padding);
  Editro.defineHelper('controllers', 'Position', Position);
};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

const { combination, num, px } = __webpack_require__(1);

module.exports = function(Editro) {
  const { type: { Controller, SizeComponent } } = Editro;

  class Size extends Controller {
    constructor(editro) {
      super(editro);
      this.editro = editro;
    }

    onElementSelected(el) {
      this.el = el;

      if (this.component) {
        this.component.removeAllListeners('change');
        this.component.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Size</h3>';

      this.component = new SizeComponent(this._getValue(el), {
        i18n: a => a
      });

      this.component.on('change', v => this._onChange(el, v));
      this.node.appendChild(this.component.el);
    }

    getNode() {
      return this.node;
    }

    getPane() {
      return 'settings';
    }

    _onChange(el, { width, height, float }) {
      el.setStyle('width', px(width));
      el.setStyle('height', px(height));
      el.setStyle('float', float);
    }

    _getValue(el) {
      return el.getStyles(['width', 'heigth', 'float']);
    }
  }

  Editro.defineHelper('controllers', 'Size', Size);
};


/***/ },
/* 32 */
/***/ function(module, exports) {

module.exports = function(Editro) {
  const { type: { Controller, ImageComponent } } = Editro;

  class Src extends Controller {
    constructor(editro) {
      super(editro);
      this.editro = editro;
    }

    onElementSelected(el) {
      const enabled = el.getTag() === 'img';
      this.toggle(enabled);
      if (!enabled) {
        return;
      }

      if (this.component) {
        this.component.removeAllListeners('change');
        this.component.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Image</h3>';

      this.component = new ImageComponent(el.getAttribute('src'), {
        label: 'Upload new image',
        upload: this.editro.upload.bind(this.editro)
      });

      this.component.on('change', v => this._onChange(el, v));
      this.node.appendChild(this.component.el);
    }

    getNode() {
      return this.node;
    }

    getPane() {
      return 'content';
    }

    _onChange(el, value) {
      el.setAttribute('src', value);
    }
  }

  Editro.defineHelper('controllers', 'Src', Src);
};


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

const Quill = __webpack_require__(47);

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  ['clean']
];

module.exports = function(Editro) {
  const { type: { Controller }, tags } = Editro;

  class Wysiwyg extends Controller {
    constructor(editro) {
      super(editro);

      this.getNode().classList.add('EditroWysiwyg');
    }


    getPane() {
      return 'content';
    }

    onElementSelected(el) {
      if (!this._canEdit(el)) {
        this.node.dataset.enabled = 'no';
        return;
      }

      this.node.dataset.enabled = 'yes';
      this.node.innerHTML = '';
      this.temp = document.createElement('div');
      this.node.appendChild(this.temp);
      this.temp.innerHTML = el.getHtml();

      this.quill = new Quill(this.temp, {
        modules: {
          toolbar: toolbarOptions
        },
        theme: 'snow'
      });
      this.quill.on('text-change', () => {
        el.setHtml(this.node.querySelector('.ql-editor').innerHTML);
      });
    }

    _canEdit(el) {
      // allow: list header content inline
      const banned = [
        ...tags.input,
        ...tags.definition,
        ...tags.block,
        ...tags.form,
        ...tags.embedded
      ];
      const fake = document.createElement('div');
      fake.innerHTML = el.getHtml();
      return !banned.includes(el.getTag()) && !fake.querySelector(banned.join(' '));
    }
  }

  Editro.defineHelper('controllers', 'Wysiwyg', Wysiwyg);
};


/***/ },
/* 34 */
/***/ function(module, exports) {

module.exports = function(Editro) {
  Editro.defineOption('fullScreen', false, (editro, val) => {
    editro.getNode().classList.toggle('Editro--fullScreen', val);
  });
};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

/*
 * Simple linear history.
 * You can move forward and backward.
 * If you move backward and push new state you loose items.
 *
 * Upper case - current
 * Push states      a b c D
 * Move basck       a b C d
 * Push new         a b c F
 */

const EventEmitter = __webpack_require__(3);

class History extends EventEmitter {
  constructor(size) {
    super();

    this._size = size || 100;
    this._history = [];
    this._pointer = -1;
  }

  push(data) {
    // return if new data the same as current
    if (this._history[this._pointer] === data) {
      return;
    }

    this._pointer++;
    this._history.length = this._pointer + 1; // Remove tail if we move back and push
    this._history[this._pointer] = data;
    // Shorten by size
    while (this._history.length > this._size) {
      this._history.shift();
      this._pointer--;
    }
  }

  forward() {
    if (this._pointer < this._history.length - 1) {
      this._pointer++;
      this._emitChange();
    }
    return this._current();
  }

  backward() {
    if (this._pointer > 0) {
      this._pointer--;
      this._emitChange();
    }
    return this._current();
  }

  _emitChange() {
    this.emit('change', {
      current: this._current()
    });
  }

  _current() {
    return this._history[this._pointer];
  }
}

module.exports = function(Editro) {
  const key = Symbol('history');

  Editro.defineOption('historySize', 100);
  Editro.defineHelper('type', 'History', History);

  Editro.defineInitHook((editro, root, code) => {
    editro[key] = new Editro.type.History(editro.getOption('historySize'));
    editro[key].push(code);
    editro.on('change', e => {
      editro[key].push(e.html);
    });
  });

  Editro.defineExtension('forward', function() {
    const html = this[key].forward();
    this.setHtml(html);
  });
  Editro.defineExtension('backward', function() {
    const html = this[key].backward();
    this.setHtml(html);
  });
};


/***/ },
/* 36 */
/***/ function(module, exports) {

const key = Symbol('instruments');

module.exports = function(Editro) {
  class Instrument {
    constructor(editro, { icon, title, onClick, group }) {
      this.group = group || 'none';
      const i = document.createElement('div');
      i.className = 'EditroInstruments-item';
      i.innerHTML = `
        <img class="EditroInstruments-icon" src="${icon}" alt="${title}">
        <div class="EditroInstruments-title">${title}</div>
      `;
      i.addEventListener('click', onClick);
      this.node = i;
    }
    getNode() {
      return this.node;
    }
    getGroup() {
      return this.group;
    }
  }

  class Instruments {
    constructor(editro) {
      editro[key] = this;

      this.node = document.createElement('div');
      this.node.className = 'EditroInstruments';

      Object.values(Editro.instrument || {}).forEach(I => {
        this.addInstrument(new I(editro));
      });
    }

    getNode() {
      return this.node;
    }

    /**
     * Add new instrument into panel
     * @param Object opts options
     */
    addInstrument(instrument) {
      const group = instrument.getGroup();

      let gEl = this.node.querySelector(`[data-group="${group}"]`);
      if (!gEl) {
        gEl = document.createElement('div');
        gEl.className = 'EditroInstruments-group';
        gEl.dataset.group = group;
        this.node.appendChild(gEl);
      }
      gEl.appendChild(instrument.getNode());
    }


    _createWrapper(node) {
      const w = document.createElement('div');
      w.className = 'Instruments-item';
      w.appendChild(node);
      return w;
    }
  }


  Editro.defineHelper('type', 'Instrument', Instrument);
  Editro.defineHelper('type', 'Instruments', Instruments);

  Editro.defineExtension('addInstrument', function(i) {
    this[key].addInstrument(i);
  });
};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

const assert = __webpack_require__(7);
const { elem } = __webpack_require__(1);

/*
 * Visual pane.
 * Can be slided from left, right, up, bottom or floated
 */
const positions = ['left', 'right', 'top', 'bottom'];

class Panel {
  constructor(editro, opts) {
    assert(positions.includes(opts.position),
      'Panel position should be in ' + positions.join(', '));
    this.editro = editro;

    this.position = opts.position;
    this.tag = opts.tag;

    this.node = document.createElement('div');
    this.node.className = 'EditroPanel';
    this.node.dataset.position = this.position;
    this.node.innerHTML = `
      <div class="EditroPanel-pick">
        <div class="EditroPanel-move">...</div>
        <div class="EditroPanel-collapse"></div>
      </div>
      <div class="EditroPanel-content"></div>`;

    this.node.dataset.fixed = opts.fixed ? 'yes' : 'no';

    if (!opts.fixed) {
      this.node
        .querySelector('.EditroPanel-content')
        .style[this._isRow() ? 'width' : 'height'] = opts.size || '300px';
      this._restoreSize();
    }

    this.elem = elem(this);

    this.node.lastChild.appendChild(opts.child);
    this.node.querySelector('.EditroPanel-move')
      .addEventListener('mousedown', this._startResize.bind(this));

    editro.on(`toggle-${this.position}-panel`, () => this._toggle());
  }

  getNode() {
    return this.node;
  }

  _toggle() {
    const size = this._getContentSize();

    if (size) {
      this._saveSize();
      this._setContentSize(0);
    } else {
      this._restoreSize();
    }
  }

  _startResize(e) {
    const isRow = this._isRow();
    const dim = isRow ? 'width' : 'height';
    const editro = this.editro;
    const old = editro.getNode().style.pointerEvents;
    editro.getNode().style.pointerEvents = 'none';

    const content = this.node.querySelector('.EditroPanel-content');
    const initialSize = this._getContentSize();
    const updated = (isRow ? e.clientX : e.clientY) + initialSize;
    const dragging = ({ clientY, clientX }) => {
      const size = updated - (isRow ? clientX : clientY);
      content.style[dim] = size + 'px';
      this._saveSize();
    };
    document.addEventListener('mousemove', dragging, false);
    const onUp = () => {
      document.removeEventListener('mousemove', dragging);
      document.removeEventListener('mouseup', onUp);
      editro.getNode().style.pointerEvents = old;
    };
    document.addEventListener('mouseup', onUp, false);
  }

  _isRow() {
    return ['left', 'right'].includes(this.position);
  }

  _getContentSize() {
    const isRow = this._isRow();
    const dim = isRow ? 'width' : 'height';
    const content = this.node.querySelector('.EditroPanel-content');
    return parseInt(getComputedStyle(content)[dim]);
  }
  _setContentSize(size) {
    const isRow = this._isRow();
    const dim = isRow ? 'width' : 'height';
    const content = this.node.querySelector('.EditroPanel-content');
    return content.style[dim] = size + 'px';
  }
  _restoreSize() {
    const key = `panel:${this.position}:size`;
    this._setContentSize(this.editro.getStorageItem(key) || 300);
  }
  _saveSize() {
    const key = `panel:${this.position}:size`;
    this.editro.setStorageItem(key, this._getContentSize());
  }
}

module.exports = function(Editro) {
  Editro.defineHelper('type', 'Panel', Panel);
};


/***/ },
/* 38 */
/***/ function(module, exports) {

module.exports = function(Editro) {
  Editro.defineOption('name', 'editro');

  Editro.defineExtension('getStorageItem', function(k) {
    try {
      return JSON.parse(localStorage.getItem(`editro:${this.getOption('name')}:${k}`));
    } catch(e) {
      return null;
    }
  });
  Editro.defineExtension('setStorageItem', function(k, v) {
    return localStorage.setItem(`editro:${this.getOption('name')}:${k}`, JSON.stringify(v));
  });
};


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

const assert = __webpack_require__(7);

const defaultTabs = [
  { name: 'content' },
  { name: 'style' },
  { name: 'settings' }
];

module.exports = function(Editro) {
  class Panes {
    constructor(editro) {
      this.editro = editro;
      this.toolbox = editro.getToolbox();
      this.defaultPanes = editro.getOption('defaultPanes');
      const tNode = this.toolbox.getNode();

      this.node = document.createElement('div');
      this.node.className = 'EditroPanes';

      const tabs = editro.getOption('tabs') || defaultTabs;
      this.panes = tabs.map(t => this._createPane(t));
      this.panes.forEach(p => {
        this.node.appendChild(p);
      });

      Object.values(Editro.controllers)
        .forEach(C => this._addController(C));

      this._switchPane(editro.getOption('pane'));
      editro.on('option-pane-changed', p => this._switchPane(p));

      tNode.appendChild(this.node);

      this.defaultPanes.forEach(name => this._createPane({ name }));

      this._toggleTabbed(editro.getOption('toolboxTabsEnabled'));
      editro.on('optionChanged:toolboxTabsEnabled', v => this._toggleTabbed(v));
    }

    getNode() {
      return this.node;
    }


    // setting false value makes panes flat with scroll
    // setting true makes them work with tabs
    _toggleTabbed(toggle) {
      this.node.classList.toggle('EditroPanes--tabbed', toggle);
    }

    _createPane(config) {
      const pane = document.createElement('div');
      pane.classList.add('EditroPane');
      pane.dataset.pane = config.name;
      return pane;
    }

    _switchPane(paneName) {
      this.panes.forEach(p => {
        p.dataset.active = p.dataset.pane === paneName ? 'yes' : 'no';
      });
    }

    _addController(Controller) {
      const c = new Controller(this.editro);
      const pane = c.getPane();
      const paneNode = this.node.querySelector(`[data-pane="${pane}"]`);
      if (paneNode) {
        paneNode.appendChild(c.getNode());
        c.getNode().classList.add('EditroPane-section');
      } else {
        throw new Error('controller.getPane() should return name for existed pane');
      }
    }
  }

  class Controller {
    constructor(editro, node) {
      if (!editro) {
        throw new Error('class Controler: constructor expect first param - editro. ' +
          'You probably forgot super(editro)');
      }

      assert(node ? node instanceof Element : true, 'Node should be Element or nul');

      this.editro = editro;
      if (node) {
        this.node = node;
      } else {
        this.node = document.createElement('div');
        this.node.classList.add('EditroController');
      }

      editro.on('selected', e => this.onElementSelected(e));
    }

    onElementSelected() {
      throw new Error('controller.onElementSelected should be overriden');
    }

    toggle(toggle) {
      this.getNode().dataset.enabled = toggle ? 'yes' : 'no';
    }

    getNode() {
      return this.node;
    }

    getPane() {
      throw new Error('controller.getPane should return pane name ' +
        'you probably forgot to override method');
    }
  }


  Editro.defineHelper('type', 'Controller', Controller);

  Editro.defineOption('defaultPanes', ['settings', 'content', 'style']);

  Editro.defineInitHook(editro => {
    new Panes(editro);
  });
};


/***/ },
/* 40 */
/***/ function(module, exports) {

const defaultTabs = [
  { name: 'content' },
  { name: 'style' },
  { name: 'settings' }
];

class Tabs {
  constructor(editro) {
    this.editro = editro;
    this.toolbox = editro.getToolbox();
    const tNode = this.toolbox.getNode();

    this.node = document.createElement('div');
    this.node.className = 'EditroTabs';

    const tabs = editro.getOption('tabs') || defaultTabs;
    this.tabs = tabs.map(c => this._createTab(c));
    this.tabs.forEach(t => this.node.appendChild(t));

    this.node.addEventListener('click', e => {
      const pane = e.target.dataset.pane;
      if (pane) {
        this._switchTab(pane);
      }
    });

    tNode.appendChild(this.node);

    let current = localStorage.getItem('EditroTabs-current');
    if (!tabs.find(t => t.name === current)) {
      current = tabs[0].name;
    }
    this._switchTab(current);

    this._toggle(editro.getOption('toolboxTabsEnabled'));
    editro.on('optionChanged:toolboxTabsEnabled', v => this._toggle(v));
  }


  _toggle(toggle) {
    this.node.style.display = toggle ? 'flex' : 'none';
  }

  _createTab(config) {
    const paneName = config.name;
    const title = config.title;
    const tab = document.createElement('button');
    tab.className = 'EditroTabs-tab';
    tab.dataset.pane = config.name;
    tab.setAttribute('data-pane', paneName);
    tab.innerHTML = title || paneName;
    return tab;
  }

  _switchTab(paneName) {
    this.tabs.forEach(t => {
      t.dataset.active = t.dataset.pane === paneName ? 'yes' : 'no';
    });
    this.editro.setOption('pane', paneName);
    try {
      localStorage.setItem('EditroTabs-current', paneName);
    } catch(e) {
      // do nothing
    }
  }
}

module.exports = function(Editro) {
  Editro.defineOption('toolboxTabsEnabled', true);

  Editro.defineInitHook(editro => {
    new Tabs(editro);
  });
};


/***/ },
/* 41 */
/***/ function(module, exports) {

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    let loaded = false;
    reader.addEventListener('load', function () {
      resolve(reader.result);
      loaded = true;
    }, false);
    reader.readAsDataURL(file);

    setTimeout(() => {
      if (!loaded) {
        reject(new Error('File base64 load fail.'));
      }
    }, 10000);
  });
}

module.exports = function(Editro) {
  Editro.defineExtension('upload', function(files) {
    return Promise.all(files.map(toBase64));
  });
};


/***/ },
/* 42 */
/***/ function(module, exports) {

module.exports.input = ['button', 'textarea', 'select', 'input'];
module.exports.inline = ['span', 'a', 'b', 'i', 'strike', 'strong', 'sub', 'em',
                           'sup', 'small', 's', 'u', 'font', 'del'];
module.exports.list = ['ul', 'li', 'ol'];
module.exports.definition = ['dt', 'dd', 'dl'];
module.exports.block = ['body', 'section', 'article', 'aside', 'center', 'header',
                          'footer', 'nav', 'figure', 'figcaption', 'div'];
module.exports.headers = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
module.exports.content = ['p', 'address', 'blockquote', 'cite', 'code', 'pre'];
module.exports.form = ['form', 'caption', 'fieldset', 'legend', 'label', 'td', 'th'];
module.exports.embedded = ['img', 'object'];


/***/ },
/* 43 */
/***/ function(module, exports) {

"use strict";
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ },
/* 44 */
/***/ function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ },
/* 45 */
/***/ function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ },
/* 46 */
/***/ function(module, exports) {

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

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/*!
 * Quill Editor v1.1.5
 * https://quilljs.com/
 * Copyright (c) 2014, Jason Chen
 * Copyright (c) 2013, salesforce.com
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Quill"] = factory();
	else
		root["Quill"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(57);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _quill = __webpack_require__(18);

	var _quill2 = _interopRequireDefault(_quill);

	var _block = __webpack_require__(29);

	var _block2 = _interopRequireDefault(_block);

	var _break = __webpack_require__(31);

	var _break2 = _interopRequireDefault(_break);

	var _container = __webpack_require__(46);

	var _container2 = _interopRequireDefault(_container);

	var _cursor = __webpack_require__(35);

	var _cursor2 = _interopRequireDefault(_cursor);

	var _embed = __webpack_require__(32);

	var _embed2 = _interopRequireDefault(_embed);

	var _inline = __webpack_require__(33);

	var _inline2 = _interopRequireDefault(_inline);

	var _scroll = __webpack_require__(47);

	var _scroll2 = _interopRequireDefault(_scroll);

	var _text = __webpack_require__(34);

	var _text2 = _interopRequireDefault(_text);

	var _clipboard = __webpack_require__(48);

	var _clipboard2 = _interopRequireDefault(_clipboard);

	var _history = __webpack_require__(55);

	var _history2 = _interopRequireDefault(_history);

	var _keyboard = __webpack_require__(56);

	var _keyboard2 = _interopRequireDefault(_keyboard);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_quill2.default.register({
	  'blots/block': _block2.default,
	  'blots/block/embed': _block.BlockEmbed,
	  'blots/break': _break2.default,
	  'blots/container': _container2.default,
	  'blots/cursor': _cursor2.default,
	  'blots/embed': _embed2.default,
	  'blots/inline': _inline2.default,
	  'blots/scroll': _scroll2.default,
	  'blots/text': _text2.default,

	  'modules/clipboard': _clipboard2.default,
	  'modules/history': _history2.default,
	  'modules/keyboard': _keyboard2.default
	});

	_parchment2.default.register(_block2.default, _break2.default, _cursor2.default, _inline2.default, _scroll2.default, _text2.default);

	module.exports = _quill2.default;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var container_1 = __webpack_require__(3);
	var format_1 = __webpack_require__(7);
	var leaf_1 = __webpack_require__(12);
	var scroll_1 = __webpack_require__(13);
	var inline_1 = __webpack_require__(14);
	var block_1 = __webpack_require__(15);
	var embed_1 = __webpack_require__(16);
	var text_1 = __webpack_require__(17);
	var attributor_1 = __webpack_require__(8);
	var class_1 = __webpack_require__(10);
	var style_1 = __webpack_require__(11);
	var store_1 = __webpack_require__(9);
	var Registry = __webpack_require__(6);
	var Parchment = {
	    Scope: Registry.Scope,
	    create: Registry.create,
	    find: Registry.find,
	    query: Registry.query,
	    register: Registry.register,
	    Container: container_1.default,
	    Format: format_1.default,
	    Leaf: leaf_1.default,
	    Embed: embed_1.default,
	    Scroll: scroll_1.default,
	    Block: block_1.default,
	    Inline: inline_1.default,
	    Text: text_1.default,
	    Attributor: {
	        Attribute: attributor_1.default,
	        Class: class_1.default,
	        Style: style_1.default,
	        Store: store_1.default
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Parchment;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var linked_list_1 = __webpack_require__(4);
	var shadow_1 = __webpack_require__(5);
	var Registry = __webpack_require__(6);
	var ContainerBlot = (function (_super) {
	    __extends(ContainerBlot, _super);
	    function ContainerBlot() {
	        _super.apply(this, arguments);
	    }
	    ContainerBlot.prototype.appendChild = function (other) {
	        this.insertBefore(other);
	    };
	    ContainerBlot.prototype.attach = function () {
	        var _this = this;
	        _super.prototype.attach.call(this);
	        this.children = new linked_list_1.default();
	        // Need to be reversed for if DOM nodes already in order
	        [].slice.call(this.domNode.childNodes).reverse().forEach(function (node) {
	            try {
	                var child = makeBlot(node);
	                _this.insertBefore(child, _this.children.head);
	            }
	            catch (err) {
	                if (err instanceof Registry.ParchmentError)
	                    return;
	                else
	                    throw err;
	            }
	        });
	    };
	    ContainerBlot.prototype.deleteAt = function (index, length) {
	        if (index === 0 && length === this.length()) {
	            return this.remove();
	        }
	        this.children.forEachAt(index, length, function (child, offset, length) {
	            child.deleteAt(offset, length);
	        });
	    };
	    ContainerBlot.prototype.descendant = function (criteria, index) {
	        var _a = this.children.find(index), child = _a[0], offset = _a[1];
	        if ((criteria.blotName == null && criteria(child)) ||
	            (criteria.blotName != null && child instanceof criteria)) {
	            return [child, offset];
	        }
	        else if (child instanceof ContainerBlot) {
	            return child.descendant(criteria, offset);
	        }
	        else {
	            return [null, -1];
	        }
	    };
	    ContainerBlot.prototype.descendants = function (criteria, index, length) {
	        if (index === void 0) { index = 0; }
	        if (length === void 0) { length = Number.MAX_VALUE; }
	        var descendants = [], lengthLeft = length;
	        this.children.forEachAt(index, length, function (child, index, length) {
	            if ((criteria.blotName == null && criteria(child)) ||
	                (criteria.blotName != null && child instanceof criteria)) {
	                descendants.push(child);
	            }
	            if (child instanceof ContainerBlot) {
	                descendants = descendants.concat(child.descendants(criteria, index, lengthLeft));
	            }
	            lengthLeft -= length;
	        });
	        return descendants;
	    };
	    ContainerBlot.prototype.detach = function () {
	        this.children.forEach(function (child) {
	            child.detach();
	        });
	        _super.prototype.detach.call(this);
	    };
	    ContainerBlot.prototype.formatAt = function (index, length, name, value) {
	        this.children.forEachAt(index, length, function (child, offset, length) {
	            child.formatAt(offset, length, name, value);
	        });
	    };
	    ContainerBlot.prototype.insertAt = function (index, value, def) {
	        var _a = this.children.find(index), child = _a[0], offset = _a[1];
	        if (child) {
	            child.insertAt(offset, value, def);
	        }
	        else {
	            var blot = (def == null) ? Registry.create('text', value) : Registry.create(value, def);
	            this.appendChild(blot);
	        }
	    };
	    ContainerBlot.prototype.insertBefore = function (childBlot, refBlot) {
	        if (this.statics.allowedChildren != null && !this.statics.allowedChildren.some(function (child) {
	            return childBlot instanceof child;
	        })) {
	            throw new Registry.ParchmentError("Cannot insert " + childBlot.statics.blotName + " into " + this.statics.blotName);
	        }
	        childBlot.insertInto(this, refBlot);
	    };
	    ContainerBlot.prototype.length = function () {
	        return this.children.reduce(function (memo, child) {
	            return memo + child.length();
	        }, 0);
	    };
	    ContainerBlot.prototype.moveChildren = function (targetParent, refNode) {
	        this.children.forEach(function (child) {
	            targetParent.insertBefore(child, refNode);
	        });
	    };
	    ContainerBlot.prototype.optimize = function () {
	        _super.prototype.optimize.call(this);
	        if (this.children.length === 0) {
	            if (this.statics.defaultChild != null) {
	                var child = Registry.create(this.statics.defaultChild);
	                this.appendChild(child);
	                child.optimize();
	            }
	            else {
	                this.remove();
	            }
	        }
	    };
	    ContainerBlot.prototype.path = function (index, inclusive) {
	        if (inclusive === void 0) { inclusive = false; }
	        var _a = this.children.find(index, inclusive), child = _a[0], offset = _a[1];
	        var position = [[this, index]];
	        if (child instanceof ContainerBlot) {
	            return position.concat(child.path(offset, inclusive));
	        }
	        else if (child != null) {
	            position.push([child, offset]);
	        }
	        return position;
	    };
	    ContainerBlot.prototype.removeChild = function (child) {
	        this.children.remove(child);
	    };
	    ContainerBlot.prototype.replace = function (target) {
	        if (target instanceof ContainerBlot) {
	            target.moveChildren(this);
	        }
	        _super.prototype.replace.call(this, target);
	    };
	    ContainerBlot.prototype.split = function (index, force) {
	        if (force === void 0) { force = false; }
	        if (!force) {
	            if (index === 0)
	                return this;
	            if (index === this.length())
	                return this.next;
	        }
	        var after = this.clone();
	        this.parent.insertBefore(after, this.next);
	        this.children.forEachAt(index, this.length(), function (child, offset, length) {
	            child = child.split(offset, force);
	            after.appendChild(child);
	        });
	        return after;
	    };
	    ContainerBlot.prototype.unwrap = function () {
	        this.moveChildren(this.parent, this.next);
	        this.remove();
	    };
	    ContainerBlot.prototype.update = function (mutations) {
	        var _this = this;
	        var addedNodes = [], removedNodes = [];
	        mutations.forEach(function (mutation) {
	            if (mutation.target === _this.domNode && mutation.type === 'childList') {
	                addedNodes.push.apply(addedNodes, mutation.addedNodes);
	                removedNodes.push.apply(removedNodes, mutation.removedNodes);
	            }
	        });
	        removedNodes.forEach(function (node) {
	            if (node.parentNode != null &&
	                (document.body.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY)) {
	                // Node has not actually been removed
	                return;
	            }
	            var blot = Registry.find(node);
	            if (blot == null)
	                return;
	            if (blot.domNode.parentNode == null || blot.domNode.parentNode === _this.domNode) {
	                blot.detach();
	            }
	        });
	        addedNodes.filter(function (node) {
	            return node.parentNode == _this.domNode;
	        }).sort(function (a, b) {
	            if (a === b)
	                return 0;
	            if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) {
	                return 1;
	            }
	            return -1;
	        }).forEach(function (node) {
	            var refBlot = null;
	            if (node.nextSibling != null) {
	                refBlot = Registry.find(node.nextSibling);
	            }
	            var blot = makeBlot(node);
	            if (blot.next != refBlot || blot.next == null) {
	                if (blot.parent != null) {
	                    blot.parent.removeChild(_this);
	                }
	                _this.insertBefore(blot, refBlot);
	            }
	        });
	    };
	    return ContainerBlot;
	}(shadow_1.default));
	function makeBlot(node) {
	    var blot = Registry.find(node);
	    if (blot == null) {
	        try {
	            blot = Registry.create(node);
	        }
	        catch (e) {
	            blot = Registry.create(Registry.Scope.INLINE);
	            [].slice.call(node.childNodes).forEach(function (child) {
	                blot.domNode.appendChild(child);
	            });
	            node.parentNode.replaceChild(blot.domNode, node);
	            blot.attach();
	        }
	    }
	    return blot;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ContainerBlot;


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	var LinkedList = (function () {
	    function LinkedList() {
	        this.head = this.tail = undefined;
	        this.length = 0;
	    }
	    LinkedList.prototype.append = function () {
	        var nodes = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            nodes[_i - 0] = arguments[_i];
	        }
	        this.insertBefore(nodes[0], undefined);
	        if (nodes.length > 1) {
	            this.append.apply(this, nodes.slice(1));
	        }
	    };
	    LinkedList.prototype.contains = function (node) {
	        var cur, next = this.iterator();
	        while (cur = next()) {
	            if (cur === node)
	                return true;
	        }
	        return false;
	    };
	    LinkedList.prototype.insertBefore = function (node, refNode) {
	        node.next = refNode;
	        if (refNode != null) {
	            node.prev = refNode.prev;
	            if (refNode.prev != null) {
	                refNode.prev.next = node;
	            }
	            refNode.prev = node;
	            if (refNode === this.head) {
	                this.head = node;
	            }
	        }
	        else if (this.tail != null) {
	            this.tail.next = node;
	            node.prev = this.tail;
	            this.tail = node;
	        }
	        else {
	            node.prev = undefined;
	            this.head = this.tail = node;
	        }
	        this.length += 1;
	    };
	    LinkedList.prototype.offset = function (target) {
	        var index = 0, cur = this.head;
	        while (cur != null) {
	            if (cur === target)
	                return index;
	            index += cur.length();
	            cur = cur.next;
	        }
	        return -1;
	    };
	    LinkedList.prototype.remove = function (node) {
	        if (!this.contains(node))
	            return;
	        if (node.prev != null)
	            node.prev.next = node.next;
	        if (node.next != null)
	            node.next.prev = node.prev;
	        if (node === this.head)
	            this.head = node.next;
	        if (node === this.tail)
	            this.tail = node.prev;
	        this.length -= 1;
	    };
	    LinkedList.prototype.iterator = function (curNode) {
	        if (curNode === void 0) { curNode = this.head; }
	        // TODO use yield when we can
	        return function () {
	            var ret = curNode;
	            if (curNode != null)
	                curNode = curNode.next;
	            return ret;
	        };
	    };
	    LinkedList.prototype.find = function (index, inclusive) {
	        if (inclusive === void 0) { inclusive = false; }
	        var cur, next = this.iterator();
	        while (cur = next()) {
	            var length_1 = cur.length();
	            if (index < length_1 || (inclusive && index === length_1 && (cur.next == null || cur.next.length() !== 0))) {
	                return [cur, index];
	            }
	            index -= length_1;
	        }
	        return [null, 0];
	    };
	    LinkedList.prototype.forEach = function (callback) {
	        var cur, next = this.iterator();
	        while (cur = next()) {
	            callback(cur);
	        }
	    };
	    LinkedList.prototype.forEachAt = function (index, length, callback) {
	        if (length <= 0)
	            return;
	        var _a = this.find(index), startNode = _a[0], offset = _a[1];
	        var cur, curIndex = index - offset, next = this.iterator(startNode);
	        while ((cur = next()) && curIndex < index + length) {
	            var curLength = cur.length();
	            if (index > curIndex) {
	                callback(cur, index - curIndex, Math.min(length, curIndex + curLength - index));
	            }
	            else {
	                callback(cur, 0, Math.min(curLength, index + length - curIndex));
	            }
	            curIndex += curLength;
	        }
	    };
	    LinkedList.prototype.map = function (callback) {
	        return this.reduce(function (memo, cur) {
	            memo.push(callback(cur));
	            return memo;
	        }, []);
	    };
	    LinkedList.prototype.reduce = function (callback, memo) {
	        var cur, next = this.iterator();
	        while (cur = next()) {
	            memo = callback(memo, cur);
	        }
	        return memo;
	    };
	    return LinkedList;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = LinkedList;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Registry = __webpack_require__(6);
	var ShadowBlot = (function () {
	    function ShadowBlot(domNode) {
	        this.domNode = domNode;
	        this.attach();
	    }
	    Object.defineProperty(ShadowBlot.prototype, "statics", {
	        // Hack for accessing inherited static methods
	        get: function () {
	            return this.constructor;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ShadowBlot.create = function (value) {
	        if (this.tagName == null) {
	            throw new Registry.ParchmentError('Blot definition missing tagName');
	        }
	        var node;
	        if (Array.isArray(this.tagName)) {
	            if (typeof value === 'string') {
	                value = value.toUpperCase();
	                if (parseInt(value).toString() === value) {
	                    value = parseInt(value);
	                }
	            }
	            if (typeof value === 'number') {
	                node = document.createElement(this.tagName[value - 1]);
	            }
	            else if (this.tagName.indexOf(value) > -1) {
	                node = document.createElement(value);
	            }
	            else {
	                node = document.createElement(this.tagName[0]);
	            }
	        }
	        else {
	            node = document.createElement(this.tagName);
	        }
	        if (this.className) {
	            node.classList.add(this.className);
	        }
	        return node;
	    };
	    ShadowBlot.prototype.attach = function () {
	        this.domNode[Registry.DATA_KEY] = { blot: this };
	    };
	    ShadowBlot.prototype.clone = function () {
	        var domNode = this.domNode.cloneNode();
	        return Registry.create(domNode);
	    };
	    ShadowBlot.prototype.detach = function () {
	        if (this.parent != null)
	            this.parent.removeChild(this);
	        delete this.domNode[Registry.DATA_KEY];
	    };
	    ShadowBlot.prototype.deleteAt = function (index, length) {
	        var blot = this.isolate(index, length);
	        blot.remove();
	    };
	    ShadowBlot.prototype.formatAt = function (index, length, name, value) {
	        var blot = this.isolate(index, length);
	        if (Registry.query(name, Registry.Scope.BLOT) != null && value) {
	            blot.wrap(name, value);
	        }
	        else if (Registry.query(name, Registry.Scope.ATTRIBUTE) != null) {
	            var parent_1 = Registry.create(this.statics.scope);
	            blot.wrap(parent_1);
	            parent_1.format(name, value);
	        }
	    };
	    ShadowBlot.prototype.insertAt = function (index, value, def) {
	        var blot = (def == null) ? Registry.create('text', value) : Registry.create(value, def);
	        var ref = this.split(index);
	        this.parent.insertBefore(blot, ref);
	    };
	    ShadowBlot.prototype.insertInto = function (parentBlot, refBlot) {
	        if (this.parent != null) {
	            this.parent.children.remove(this);
	        }
	        parentBlot.children.insertBefore(this, refBlot);
	        if (refBlot != null) {
	            var refDomNode = refBlot.domNode;
	        }
	        if (this.next == null || this.domNode.nextSibling != refDomNode) {
	            parentBlot.domNode.insertBefore(this.domNode, refDomNode);
	        }
	        this.parent = parentBlot;
	    };
	    ShadowBlot.prototype.isolate = function (index, length) {
	        var target = this.split(index);
	        target.split(length);
	        return target;
	    };
	    ShadowBlot.prototype.length = function () {
	        return 1;
	    };
	    ;
	    ShadowBlot.prototype.offset = function (root) {
	        if (root === void 0) { root = this.parent; }
	        if (this.parent == null || this == root)
	            return 0;
	        return this.parent.children.offset(this) + this.parent.offset(root);
	    };
	    ShadowBlot.prototype.optimize = function () {
	        // TODO clean up once we use WeakMap
	        if (this.domNode[Registry.DATA_KEY] != null) {
	            delete this.domNode[Registry.DATA_KEY].mutations;
	        }
	    };
	    ShadowBlot.prototype.remove = function () {
	        if (this.domNode.parentNode != null) {
	            this.domNode.parentNode.removeChild(this.domNode);
	        }
	        this.detach();
	    };
	    ShadowBlot.prototype.replace = function (target) {
	        if (target.parent == null)
	            return;
	        target.parent.insertBefore(this, target.next);
	        target.remove();
	    };
	    ShadowBlot.prototype.replaceWith = function (name, value) {
	        var replacement = typeof name === 'string' ? Registry.create(name, value) : name;
	        replacement.replace(this);
	        return replacement;
	    };
	    ShadowBlot.prototype.split = function (index, force) {
	        return index === 0 ? this : this.next;
	    };
	    ShadowBlot.prototype.update = function (mutations) {
	        if (mutations === void 0) { mutations = []; }
	        // Nothing to do by default
	    };
	    ShadowBlot.prototype.wrap = function (name, value) {
	        var wrapper = typeof name === 'string' ? Registry.create(name, value) : name;
	        if (this.parent != null) {
	            this.parent.insertBefore(wrapper, this.next);
	        }
	        wrapper.appendChild(this);
	        return wrapper;
	    };
	    ShadowBlot.blotName = 'abstract';
	    return ShadowBlot;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ShadowBlot;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ParchmentError = (function (_super) {
	    __extends(ParchmentError, _super);
	    function ParchmentError(message) {
	        message = '[Parchment] ' + message;
	        _super.call(this, message);
	        this.message = message;
	        this.name = this.constructor.name;
	    }
	    return ParchmentError;
	}(Error));
	exports.ParchmentError = ParchmentError;
	var attributes = {};
	var classes = {};
	var tags = {};
	var types = {};
	exports.DATA_KEY = '__blot';
	(function (Scope) {
	    Scope[Scope["TYPE"] = 3] = "TYPE";
	    Scope[Scope["LEVEL"] = 12] = "LEVEL";
	    Scope[Scope["ATTRIBUTE"] = 13] = "ATTRIBUTE";
	    Scope[Scope["BLOT"] = 14] = "BLOT";
	    Scope[Scope["INLINE"] = 7] = "INLINE";
	    Scope[Scope["BLOCK"] = 11] = "BLOCK";
	    Scope[Scope["BLOCK_BLOT"] = 10] = "BLOCK_BLOT";
	    Scope[Scope["INLINE_BLOT"] = 6] = "INLINE_BLOT";
	    Scope[Scope["BLOCK_ATTRIBUTE"] = 9] = "BLOCK_ATTRIBUTE";
	    Scope[Scope["INLINE_ATTRIBUTE"] = 5] = "INLINE_ATTRIBUTE";
	    Scope[Scope["ANY"] = 15] = "ANY";
	})(exports.Scope || (exports.Scope = {}));
	var Scope = exports.Scope;
	;
	function create(input, value) {
	    var match = query(input);
	    if (match == null) {
	        throw new ParchmentError("Unable to create " + input + " blot");
	    }
	    var BlotClass = match;
	    var node = input instanceof Node ? input : BlotClass.create(value);
	    return new BlotClass(node, value);
	}
	exports.create = create;
	function find(node, bubble) {
	    if (bubble === void 0) { bubble = false; }
	    if (node == null)
	        return null;
	    if (node[exports.DATA_KEY] != null)
	        return node[exports.DATA_KEY].blot;
	    if (bubble)
	        return find(node.parentNode, bubble);
	    return null;
	}
	exports.find = find;
	function query(query, scope) {
	    if (scope === void 0) { scope = Scope.ANY; }
	    var match;
	    if (typeof query === 'string') {
	        match = types[query] || attributes[query];
	    }
	    else if (query instanceof Text) {
	        match = types['text'];
	    }
	    else if (typeof query === 'number') {
	        if (query & Scope.LEVEL & Scope.BLOCK) {
	            match = types['block'];
	        }
	        else if (query & Scope.LEVEL & Scope.INLINE) {
	            match = types['inline'];
	        }
	    }
	    else if (query instanceof HTMLElement) {
	        var names = (query.getAttribute('class') || '').split(/\s+/);
	        for (var i in names) {
	            match = classes[names[i]];
	            if (match)
	                break;
	        }
	        match = match || tags[query.tagName];
	    }
	    if (match == null) {
	        if (query instanceof Node) {
	            console.log(query.nodeType);
	        }
	    }
	    if (match == null)
	        return null;
	    if ((scope & Scope.LEVEL & match.scope) && (scope & Scope.TYPE & match.scope))
	        return match;
	    return null;
	}
	exports.query = query;
	function register() {
	    var Definitions = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        Definitions[_i - 0] = arguments[_i];
	    }
	    if (Definitions.length > 1) {
	        return Definitions.map(function (d) {
	            return register(d);
	        });
	    }
	    var Definition = Definitions[0];
	    if (typeof Definition.blotName !== 'string' && typeof Definition.attrName !== 'string') {
	        throw new ParchmentError('Invalid definition');
	    }
	    else if (Definition.blotName === 'abstract') {
	        throw new ParchmentError('Cannot register abstract class');
	    }
	    types[Definition.blotName || Definition.attrName] = Definition;
	    if (typeof Definition.keyName === 'string') {
	        attributes[Definition.keyName] = Definition;
	    }
	    else {
	        if (Definition.className != null) {
	            classes[Definition.className] = Definition;
	        }
	        if (Definition.tagName != null) {
	            if (Array.isArray(Definition.tagName)) {
	                Definition.tagName = Definition.tagName.map(function (tagName) {
	                    return tagName.toUpperCase();
	                });
	            }
	            else {
	                Definition.tagName = Definition.tagName.toUpperCase();
	            }
	            var tagNames = Array.isArray(Definition.tagName) ? Definition.tagName : [Definition.tagName];
	            tagNames.forEach(function (tag) {
	                if (tags[tag] == null || Definition.className == null) {
	                    tags[tag] = Definition;
	                }
	            });
	        }
	    }
	    return Definition;
	}
	exports.register = register;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var attributor_1 = __webpack_require__(8);
	var store_1 = __webpack_require__(9);
	var container_1 = __webpack_require__(3);
	var Registry = __webpack_require__(6);
	var FormatBlot = (function (_super) {
	    __extends(FormatBlot, _super);
	    function FormatBlot() {
	        _super.apply(this, arguments);
	    }
	    FormatBlot.formats = function (domNode) {
	        if (typeof this.tagName === 'string') {
	            return true;
	        }
	        else if (Array.isArray(this.tagName)) {
	            return domNode.tagName.toLowerCase();
	        }
	        return undefined;
	    };
	    FormatBlot.prototype.attach = function () {
	        _super.prototype.attach.call(this);
	        this.attributes = new store_1.default(this.domNode);
	    };
	    FormatBlot.prototype.format = function (name, value) {
	        var format = Registry.query(name);
	        if (format instanceof attributor_1.default) {
	            this.attributes.attribute(format, value);
	        }
	        else if (value) {
	            if (format != null && (name !== this.statics.blotName || this.formats()[name] !== value)) {
	                this.replaceWith(name, value);
	            }
	        }
	    };
	    FormatBlot.prototype.formats = function () {
	        var formats = this.attributes.values();
	        var format = this.statics.formats(this.domNode);
	        if (format != null) {
	            formats[this.statics.blotName] = format;
	        }
	        return formats;
	    };
	    FormatBlot.prototype.replaceWith = function (name, value) {
	        var replacement = _super.prototype.replaceWith.call(this, name, value);
	        this.attributes.copy(replacement);
	        return replacement;
	    };
	    FormatBlot.prototype.update = function (mutations) {
	        var _this = this;
	        _super.prototype.update.call(this, mutations);
	        if (mutations.some(function (mutation) {
	            return mutation.target === _this.domNode && mutation.type === 'attributes';
	        })) {
	            this.attributes.build();
	        }
	    };
	    FormatBlot.prototype.wrap = function (name, value) {
	        var wrapper = _super.prototype.wrap.call(this, name, value);
	        if (wrapper instanceof FormatBlot && wrapper.statics.scope === this.statics.scope) {
	            this.attributes.move(wrapper);
	        }
	        return wrapper;
	    };
	    return FormatBlot;
	}(container_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = FormatBlot;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Registry = __webpack_require__(6);
	var Attributor = (function () {
	    function Attributor(attrName, keyName, options) {
	        if (options === void 0) { options = {}; }
	        this.attrName = attrName;
	        this.keyName = keyName;
	        var attributeBit = Registry.Scope.TYPE & Registry.Scope.ATTRIBUTE;
	        if (options.scope != null) {
	            // Ignore type bits, force attribute bit
	            this.scope = (options.scope & Registry.Scope.LEVEL) | attributeBit;
	        }
	        else {
	            this.scope = Registry.Scope.ATTRIBUTE;
	        }
	        if (options.whitelist != null)
	            this.whitelist = options.whitelist;
	    }
	    Attributor.keys = function (node) {
	        return [].map.call(node.attributes, function (item) {
	            return item.name;
	        });
	    };
	    Attributor.prototype.add = function (node, value) {
	        if (!this.canAdd(node, value))
	            return false;
	        node.setAttribute(this.keyName, value);
	        return true;
	    };
	    Attributor.prototype.canAdd = function (node, value) {
	        var match = Registry.query(node, Registry.Scope.BLOT & (this.scope | Registry.Scope.TYPE));
	        if (match != null && (this.whitelist == null || this.whitelist.indexOf(value) > -1)) {
	            return true;
	        }
	        return false;
	    };
	    Attributor.prototype.remove = function (node) {
	        node.removeAttribute(this.keyName);
	    };
	    Attributor.prototype.value = function (node) {
	        return node.getAttribute(this.keyName);
	    };
	    return Attributor;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Attributor;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var attributor_1 = __webpack_require__(8);
	var class_1 = __webpack_require__(10);
	var style_1 = __webpack_require__(11);
	var Registry = __webpack_require__(6);
	var AttributorStore = (function () {
	    function AttributorStore(domNode) {
	        this.attributes = {};
	        this.domNode = domNode;
	        this.build();
	    }
	    AttributorStore.prototype.attribute = function (attribute, value) {
	        if (value) {
	            if (attribute.add(this.domNode, value)) {
	                if (attribute.value(this.domNode) != null) {
	                    this.attributes[attribute.attrName] = attribute;
	                }
	                else {
	                    delete this.attributes[attribute.attrName];
	                }
	            }
	        }
	        else {
	            attribute.remove(this.domNode);
	            delete this.attributes[attribute.attrName];
	        }
	    };
	    AttributorStore.prototype.build = function () {
	        var _this = this;
	        this.attributes = {};
	        var attributes = attributor_1.default.keys(this.domNode);
	        var classes = class_1.default.keys(this.domNode);
	        var styles = style_1.default.keys(this.domNode);
	        attributes.concat(classes).concat(styles).forEach(function (name) {
	            var attr = Registry.query(name, Registry.Scope.ATTRIBUTE);
	            if (attr instanceof attributor_1.default) {
	                _this.attributes[attr.attrName] = attr;
	            }
	        });
	    };
	    AttributorStore.prototype.copy = function (target) {
	        var _this = this;
	        Object.keys(this.attributes).forEach(function (key) {
	            var value = _this.attributes[key].value(_this.domNode);
	            target.format(key, value);
	        });
	    };
	    AttributorStore.prototype.move = function (target) {
	        var _this = this;
	        this.copy(target);
	        Object.keys(this.attributes).forEach(function (key) {
	            _this.attributes[key].remove(_this.domNode);
	        });
	        this.attributes = {};
	    };
	    AttributorStore.prototype.values = function () {
	        var _this = this;
	        return Object.keys(this.attributes).reduce(function (attributes, name) {
	            attributes[name] = _this.attributes[name].value(_this.domNode);
	            return attributes;
	        }, {});
	    };
	    return AttributorStore;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = AttributorStore;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var attributor_1 = __webpack_require__(8);
	function match(node, prefix) {
	    var className = node.getAttribute('class') || '';
	    return className.split(/\s+/).filter(function (name) {
	        return name.indexOf(prefix + "-") === 0;
	    });
	}
	var ClassAttributor = (function (_super) {
	    __extends(ClassAttributor, _super);
	    function ClassAttributor() {
	        _super.apply(this, arguments);
	    }
	    ClassAttributor.keys = function (node) {
	        return (node.getAttribute('class') || '').split(/\s+/).map(function (name) {
	            return name.split('-').slice(0, -1).join('-');
	        });
	    };
	    ClassAttributor.prototype.add = function (node, value) {
	        if (!this.canAdd(node, value))
	            return false;
	        this.remove(node);
	        node.classList.add(this.keyName + "-" + value);
	        return true;
	    };
	    ClassAttributor.prototype.remove = function (node) {
	        var matches = match(node, this.keyName);
	        matches.forEach(function (name) {
	            node.classList.remove(name);
	        });
	        if (node.classList.length === 0) {
	            node.removeAttribute('class');
	        }
	    };
	    ClassAttributor.prototype.value = function (node) {
	        var result = match(node, this.keyName)[0] || '';
	        return result.slice(this.keyName.length + 1); // +1 for hyphen
	    };
	    return ClassAttributor;
	}(attributor_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ClassAttributor;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var attributor_1 = __webpack_require__(8);
	function camelize(name) {
	    var parts = name.split('-');
	    var rest = parts.slice(1).map(function (part) {
	        return part[0].toUpperCase() + part.slice(1);
	    }).join('');
	    return parts[0] + rest;
	}
	var StyleAttributor = (function (_super) {
	    __extends(StyleAttributor, _super);
	    function StyleAttributor() {
	        _super.apply(this, arguments);
	    }
	    StyleAttributor.keys = function (node) {
	        return (node.getAttribute('style') || '').split(';').map(function (value) {
	            var arr = value.split(':');
	            return arr[0].trim();
	        });
	    };
	    StyleAttributor.prototype.add = function (node, value) {
	        if (!this.canAdd(node, value))
	            return false;
	        node.style[camelize(this.keyName)] = value;
	        return true;
	    };
	    StyleAttributor.prototype.remove = function (node) {
	        node.style[camelize(this.keyName)] = '';
	        if (!node.getAttribute('style')) {
	            node.removeAttribute('style');
	        }
	    };
	    StyleAttributor.prototype.value = function (node) {
	        return node.style[camelize(this.keyName)];
	    };
	    return StyleAttributor;
	}(attributor_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = StyleAttributor;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var shadow_1 = __webpack_require__(5);
	var Registry = __webpack_require__(6);
	var LeafBlot = (function (_super) {
	    __extends(LeafBlot, _super);
	    function LeafBlot() {
	        _super.apply(this, arguments);
	    }
	    LeafBlot.value = function (domNode) {
	        return true;
	    };
	    LeafBlot.prototype.index = function (node, offset) {
	        if (node !== this.domNode)
	            return -1;
	        return Math.min(offset, 1);
	    };
	    LeafBlot.prototype.position = function (index, inclusive) {
	        var offset = [].indexOf.call(this.parent.domNode.childNodes, this.domNode);
	        if (index > 0)
	            offset += 1;
	        return [this.parent.domNode, offset];
	    };
	    LeafBlot.prototype.value = function () {
	        return (_a = {}, _a[this.statics.blotName] = this.statics.value(this.domNode) || true, _a);
	        var _a;
	    };
	    LeafBlot.scope = Registry.Scope.INLINE_BLOT;
	    return LeafBlot;
	}(shadow_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = LeafBlot;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var container_1 = __webpack_require__(3);
	var Registry = __webpack_require__(6);
	var OBSERVER_CONFIG = {
	    attributes: true,
	    characterData: true,
	    characterDataOldValue: true,
	    childList: true,
	    subtree: true
	};
	var MAX_OPTIMIZE_ITERATIONS = 100;
	var ScrollBlot = (function (_super) {
	    __extends(ScrollBlot, _super);
	    function ScrollBlot(node) {
	        var _this = this;
	        _super.call(this, node);
	        this.parent = null;
	        this.observer = new MutationObserver(function (mutations) {
	            _this.update(mutations);
	        });
	        this.observer.observe(this.domNode, OBSERVER_CONFIG);
	    }
	    ScrollBlot.prototype.detach = function () {
	        _super.prototype.detach.call(this);
	        this.observer.disconnect();
	    };
	    ScrollBlot.prototype.deleteAt = function (index, length) {
	        this.update();
	        if (index === 0 && length === this.length()) {
	            this.children.forEach(function (child) {
	                child.remove();
	            });
	        }
	        else {
	            _super.prototype.deleteAt.call(this, index, length);
	        }
	    };
	    ScrollBlot.prototype.formatAt = function (index, length, name, value) {
	        this.update();
	        _super.prototype.formatAt.call(this, index, length, name, value);
	    };
	    ScrollBlot.prototype.insertAt = function (index, value, def) {
	        this.update();
	        _super.prototype.insertAt.call(this, index, value, def);
	    };
	    ScrollBlot.prototype.optimize = function (mutations) {
	        var _this = this;
	        if (mutations === void 0) { mutations = []; }
	        _super.prototype.optimize.call(this);
	        mutations.push.apply(mutations, this.observer.takeRecords());
	        // TODO use WeakMap
	        var mark = function (blot, markParent) {
	            if (markParent === void 0) { markParent = true; }
	            if (blot == null || blot === _this)
	                return;
	            if (blot.domNode.parentNode == null)
	                return;
	            if (blot.domNode[Registry.DATA_KEY].mutations == null) {
	                blot.domNode[Registry.DATA_KEY].mutations = [];
	            }
	            if (markParent)
	                mark(blot.parent);
	        };
	        var optimize = function (blot) {
	            if (blot.domNode[Registry.DATA_KEY] == null || blot.domNode[Registry.DATA_KEY].mutations == null) {
	                return;
	            }
	            if (blot instanceof container_1.default) {
	                blot.children.forEach(optimize);
	            }
	            blot.optimize();
	        };
	        var remaining = mutations;
	        for (var i = 0; remaining.length > 0; i += 1) {
	            if (i >= MAX_OPTIMIZE_ITERATIONS) {
	                throw new Error('[Parchment] Maximum optimize iterations reached');
	            }
	            remaining.forEach(function (mutation) {
	                var blot = Registry.find(mutation.target, true);
	                if (blot == null)
	                    return;
	                if (blot.domNode === mutation.target) {
	                    if (mutation.type === 'childList') {
	                        mark(Registry.find(mutation.previousSibling, false));
	                        [].forEach.call(mutation.addedNodes, function (node) {
	                            var child = Registry.find(node, false);
	                            mark(child, false);
	                            if (child instanceof container_1.default) {
	                                child.children.forEach(function (grandChild) {
	                                    mark(grandChild, false);
	                                });
	                            }
	                        });
	                    }
	                    else if (mutation.type === 'attributes') {
	                        mark(blot.prev);
	                    }
	                }
	                mark(blot);
	            });
	            this.children.forEach(optimize);
	            remaining = this.observer.takeRecords();
	            mutations.push.apply(mutations, remaining);
	        }
	    };
	    ScrollBlot.prototype.update = function (mutations) {
	        var _this = this;
	        mutations = mutations || this.observer.takeRecords();
	        // TODO use WeakMap
	        mutations.map(function (mutation) {
	            var blot = Registry.find(mutation.target, true);
	            if (blot == null)
	                return;
	            if (blot.domNode[Registry.DATA_KEY].mutations == null) {
	                blot.domNode[Registry.DATA_KEY].mutations = [mutation];
	                return blot;
	            }
	            else {
	                blot.domNode[Registry.DATA_KEY].mutations.push(mutation);
	                return null;
	            }
	        }).forEach(function (blot) {
	            if (blot == null || blot === _this || blot.domNode[Registry.DATA_KEY] == null)
	                return;
	            blot.update(blot.domNode[Registry.DATA_KEY].mutations || []);
	        });
	        if (this.domNode[Registry.DATA_KEY].mutations != null) {
	            _super.prototype.update.call(this, this.domNode[Registry.DATA_KEY].mutations);
	        }
	        this.optimize(mutations);
	    };
	    ScrollBlot.blotName = 'scroll';
	    ScrollBlot.defaultChild = 'block';
	    ScrollBlot.scope = Registry.Scope.BLOCK_BLOT;
	    ScrollBlot.tagName = 'DIV';
	    return ScrollBlot;
	}(container_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ScrollBlot;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var format_1 = __webpack_require__(7);
	var Registry = __webpack_require__(6);
	// Shallow object comparison
	function isEqual(obj1, obj2) {
	    if (Object.keys(obj1).length !== Object.keys(obj2).length)
	        return false;
	    for (var prop in obj1) {
	        if (obj1[prop] !== obj2[prop])
	            return false;
	    }
	    return true;
	}
	var InlineBlot = (function (_super) {
	    __extends(InlineBlot, _super);
	    function InlineBlot() {
	        _super.apply(this, arguments);
	    }
	    InlineBlot.formats = function (domNode) {
	        if (domNode.tagName === InlineBlot.tagName)
	            return undefined;
	        return _super.formats.call(this, domNode);
	    };
	    InlineBlot.prototype.format = function (name, value) {
	        var _this = this;
	        if (name === this.statics.blotName && !value) {
	            this.children.forEach(function (child) {
	                if (!(child instanceof format_1.default)) {
	                    child = child.wrap(InlineBlot.blotName, true);
	                }
	                _this.attributes.copy(child);
	            });
	            this.unwrap();
	        }
	        else {
	            _super.prototype.format.call(this, name, value);
	        }
	    };
	    InlineBlot.prototype.formatAt = function (index, length, name, value) {
	        if (this.formats()[name] != null || Registry.query(name, Registry.Scope.ATTRIBUTE)) {
	            var blot = this.isolate(index, length);
	            blot.format(name, value);
	        }
	        else {
	            _super.prototype.formatAt.call(this, index, length, name, value);
	        }
	    };
	    InlineBlot.prototype.optimize = function () {
	        _super.prototype.optimize.call(this);
	        var formats = this.formats();
	        if (Object.keys(formats).length === 0) {
	            return this.unwrap(); // unformatted span
	        }
	        var next = this.next;
	        if (next instanceof InlineBlot && next.prev === this && isEqual(formats, next.formats())) {
	            next.moveChildren(this);
	            next.remove();
	        }
	    };
	    InlineBlot.blotName = 'inline';
	    InlineBlot.scope = Registry.Scope.INLINE_BLOT;
	    InlineBlot.tagName = 'SPAN';
	    return InlineBlot;
	}(format_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = InlineBlot;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var format_1 = __webpack_require__(7);
	var Registry = __webpack_require__(6);
	var BlockBlot = (function (_super) {
	    __extends(BlockBlot, _super);
	    function BlockBlot() {
	        _super.apply(this, arguments);
	    }
	    BlockBlot.formats = function (domNode) {
	        var tagName = Registry.query(BlockBlot.blotName).tagName;
	        if (domNode.tagName === tagName)
	            return undefined;
	        return _super.formats.call(this, domNode);
	    };
	    BlockBlot.prototype.format = function (name, value) {
	        if (Registry.query(name, Registry.Scope.BLOCK) == null) {
	            return;
	        }
	        else if (name === this.statics.blotName && !value) {
	            this.replaceWith(BlockBlot.blotName);
	        }
	        else {
	            _super.prototype.format.call(this, name, value);
	        }
	    };
	    BlockBlot.prototype.formatAt = function (index, length, name, value) {
	        if (Registry.query(name, Registry.Scope.BLOCK) != null) {
	            this.format(name, value);
	        }
	        else {
	            _super.prototype.formatAt.call(this, index, length, name, value);
	        }
	    };
	    BlockBlot.prototype.insertAt = function (index, value, def) {
	        if (def == null || Registry.query(value, Registry.Scope.INLINE) != null) {
	            // Insert text or inline
	            _super.prototype.insertAt.call(this, index, value, def);
	        }
	        else {
	            var after = this.split(index);
	            var blot = Registry.create(value, def);
	            after.parent.insertBefore(blot, after);
	        }
	    };
	    BlockBlot.blotName = 'block';
	    BlockBlot.scope = Registry.Scope.BLOCK_BLOT;
	    BlockBlot.tagName = 'P';
	    return BlockBlot;
	}(format_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = BlockBlot;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var leaf_1 = __webpack_require__(12);
	var EmbedBlot = (function (_super) {
	    __extends(EmbedBlot, _super);
	    function EmbedBlot() {
	        _super.apply(this, arguments);
	    }
	    EmbedBlot.formats = function (domNode) {
	        return undefined;
	    };
	    EmbedBlot.prototype.format = function (name, value) {
	        // super.formatAt wraps, which is what we want in general,
	        // but this allows subclasses to overwrite for formats
	        // that just apply to particular embeds
	        _super.prototype.formatAt.call(this, 0, this.length(), name, value);
	    };
	    EmbedBlot.prototype.formatAt = function (index, length, name, value) {
	        if (index === 0 && length === this.length()) {
	            this.format(name, value);
	        }
	        else {
	            _super.prototype.formatAt.call(this, index, length, name, value);
	        }
	    };
	    EmbedBlot.prototype.formats = function () {
	        return this.statics.formats(this.domNode);
	    };
	    return EmbedBlot;
	}(leaf_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = EmbedBlot;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var leaf_1 = __webpack_require__(12);
	var Registry = __webpack_require__(6);
	var TextBlot = (function (_super) {
	    __extends(TextBlot, _super);
	    function TextBlot(node) {
	        _super.call(this, node);
	        this.text = this.statics.value(this.domNode);
	    }
	    TextBlot.create = function (value) {
	        return document.createTextNode(value);
	    };
	    TextBlot.value = function (domNode) {
	        return domNode.data;
	    };
	    TextBlot.prototype.deleteAt = function (index, length) {
	        this.domNode.data = this.text = this.text.slice(0, index) + this.text.slice(index + length);
	    };
	    TextBlot.prototype.index = function (node, offset) {
	        if (this.domNode === node) {
	            return offset;
	        }
	        return -1;
	    };
	    TextBlot.prototype.insertAt = function (index, value, def) {
	        if (def == null) {
	            this.text = this.text.slice(0, index) + value + this.text.slice(index);
	            this.domNode.data = this.text;
	        }
	        else {
	            _super.prototype.insertAt.call(this, index, value, def);
	        }
	    };
	    TextBlot.prototype.length = function () {
	        return this.text.length;
	    };
	    TextBlot.prototype.optimize = function () {
	        _super.prototype.optimize.call(this);
	        this.text = this.statics.value(this.domNode);
	        if (this.text.length === 0) {
	            this.remove();
	        }
	        else if (this.next instanceof TextBlot && this.next.prev === this) {
	            this.insertAt(this.length(), this.next.value());
	            this.next.remove();
	        }
	    };
	    TextBlot.prototype.position = function (index, inclusive) {
	        if (inclusive === void 0) { inclusive = false; }
	        return [this.domNode, index];
	    };
	    TextBlot.prototype.split = function (index, force) {
	        if (force === void 0) { force = false; }
	        if (!force) {
	            if (index === 0)
	                return this;
	            if (index === this.length())
	                return this.next;
	        }
	        var after = Registry.create(this.domNode.splitText(index));
	        this.parent.insertBefore(after, this.next);
	        this.text = this.statics.value(this.domNode);
	        return after;
	    };
	    TextBlot.prototype.update = function (mutations) {
	        var _this = this;
	        if (mutations.some(function (mutation) {
	            return mutation.type === 'characterData' && mutation.target === _this.domNode;
	        })) {
	            this.text = this.statics.value(this.domNode);
	        }
	    };
	    TextBlot.prototype.value = function () {
	        return this.text;
	    };
	    TextBlot.blotName = 'text';
	    TextBlot.scope = Registry.Scope.INLINE_BLOT;
	    return TextBlot;
	}(leaf_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = TextBlot;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.overload = exports.expandConfig = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(19);

	var _quillDelta = __webpack_require__(20);

	var _quillDelta2 = _interopRequireDefault(_quillDelta);

	var _editor = __webpack_require__(27);

	var _editor2 = _interopRequireDefault(_editor);

	var _emitter3 = __webpack_require__(36);

	var _emitter4 = _interopRequireDefault(_emitter3);

	var _module = __webpack_require__(43);

	var _module2 = _interopRequireDefault(_module);

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _selection = __webpack_require__(44);

	var _selection2 = _interopRequireDefault(_selection);

	var _extend = __webpack_require__(30);

	var _extend2 = _interopRequireDefault(_extend);

	var _logger = __webpack_require__(38);

	var _logger2 = _interopRequireDefault(_logger);

	var _theme = __webpack_require__(45);

	var _theme2 = _interopRequireDefault(_theme);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var debug = (0, _logger2.default)('quill');

	var Quill = function () {
	  _createClass(Quill, null, [{
	    key: 'debug',
	    value: function debug(limit) {
	      if (limit === true) {
	        limit = 'log';
	      }
	      _logger2.default.level(limit);
	    }
	  }, {
	    key: 'import',
	    value: function _import(name) {
	      if (this.imports[name] == null) {
	        debug.error('Cannot import ' + name + '. Are you sure it was registered?');
	      }
	      return this.imports[name];
	    }
	  }, {
	    key: 'register',
	    value: function register(path, target) {
	      var _this = this;

	      var overwrite = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	      if (typeof path !== 'string') {
	        var name = path.attrName || path.blotName;
	        if (typeof name === 'string') {
	          // register(Blot | Attributor, overwrite)
	          this.register('formats/' + name, path, target);
	        } else {
	          Object.keys(path).forEach(function (key) {
	            _this.register(key, path[key], target);
	          });
	        }
	      } else {
	        if (this.imports[path] != null && !overwrite) {
	          debug.warn('Overwriting ' + path + ' with', target);
	        }
	        this.imports[path] = target;
	        if ((path.startsWith('blots/') || path.startsWith('formats/')) && target.blotName !== 'abstract') {
	          _parchment2.default.register(target);
	        }
	      }
	    }
	  }]);

	  function Quill(container) {
	    var _this2 = this;

	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    _classCallCheck(this, Quill);

	    this.options = expandConfig(container, options);
	    this.container = this.options.container;
	    if (this.container == null) {
	      return debug.error('Invalid Quill container', container);
	    }
	    if (this.options.debug) {
	      Quill.debug(this.options.debug);
	    }
	    var html = this.container.innerHTML.trim();
	    this.container.classList.add('ql-container');
	    this.container.innerHTML = '';
	    this.root = this.addContainer('ql-editor');
	    this.root.classList.add('ql-blank');
	    this.emitter = new _emitter4.default();
	    this.scroll = _parchment2.default.create(this.root, {
	      emitter: this.emitter,
	      whitelist: this.options.formats
	    });
	    this.editor = new _editor2.default(this.scroll);
	    this.selection = new _selection2.default(this.scroll, this.emitter);
	    this.theme = new this.options.theme(this, this.options);
	    this.keyboard = this.theme.addModule('keyboard');
	    this.clipboard = this.theme.addModule('clipboard');
	    this.history = this.theme.addModule('history');
	    this.theme.init();
	    this.emitter.on(_emitter4.default.events.EDITOR_CHANGE, function (type) {
	      if (type === _emitter4.default.events.TEXT_CHANGE) {
	        _this2.root.classList.toggle('ql-blank', _this2.editor.isBlank());
	      }
	    });
	    this.emitter.on(_emitter4.default.events.SCROLL_UPDATE, function (source, mutations) {
	      var range = _this2.selection.lastRange;
	      var index = range && range.length === 0 ? range.index : undefined;
	      modify.call(_this2, function () {
	        return _this2.editor.update(null, mutations, index);
	      }, source);
	    });
	    var contents = this.clipboard.convert('<div class=\'ql-editor\' style="white-space: normal;">' + html + '<p><br></p></div>');
	    this.setContents(contents);
	    this.history.clear();
	    if (this.options.placeholder) {
	      this.root.setAttribute('data-placeholder', this.options.placeholder);
	    }
	    if (this.options.readOnly) {
	      this.disable();
	    }
	  }

	  _createClass(Quill, [{
	    key: 'addContainer',
	    value: function addContainer(container) {
	      var refNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	      if (typeof container === 'string') {
	        var className = container;
	        container = document.createElement('div');
	        container.classList.add(className);
	      }
	      this.container.insertBefore(container, refNode);
	      return container;
	    }
	  }, {
	    key: 'blur',
	    value: function blur() {
	      this.selection.setRange(null);
	    }
	  }, {
	    key: 'deleteText',
	    value: function deleteText(index, length, source) {
	      var _this3 = this;

	      var _overload = overload(index, length, source);

	      var _overload2 = _slicedToArray(_overload, 4);

	      index = _overload2[0];
	      length = _overload2[1];
	      source = _overload2[3];

	      return modify.call(this, function () {
	        return _this3.editor.deleteText(index, length);
	      }, source, index, -1 * length);
	    }
	  }, {
	    key: 'disable',
	    value: function disable() {
	      this.enable(false);
	    }
	  }, {
	    key: 'enable',
	    value: function enable() {
	      var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

	      this.scroll.enable(enabled);
	      this.container.classList.toggle('ql-disabled', !enabled);
	      if (!enabled) {
	        this.blur();
	      }
	    }
	  }, {
	    key: 'focus',
	    value: function focus() {
	      this.selection.focus();
	      this.selection.scrollIntoView();
	    }
	  }, {
	    key: 'format',
	    value: function format(name, value) {
	      var _this4 = this;

	      var source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _emitter4.default.sources.API;

	      return modify.call(this, function () {
	        var range = _this4.getSelection(true);
	        var change = new _quillDelta2.default();
	        if (range == null) {
	          return change;
	        } else if (_parchment2.default.query(name, _parchment2.default.Scope.BLOCK)) {
	          change = _this4.editor.formatLine(range.index, range.length, _defineProperty({}, name, value));
	        } else if (range.length === 0) {
	          _this4.selection.format(name, value);
	          return change;
	        } else {
	          change = _this4.editor.formatText(range.index, range.length, _defineProperty({}, name, value));
	        }
	        _this4.setSelection(range, _emitter4.default.sources.SILENT);
	        return change;
	      }, source);
	    }
	  }, {
	    key: 'formatLine',
	    value: function formatLine(index, length, name, value, source) {
	      var _this5 = this;

	      var formats = void 0;

	      var _overload3 = overload(index, length, name, value, source);

	      var _overload4 = _slicedToArray(_overload3, 4);

	      index = _overload4[0];
	      length = _overload4[1];
	      formats = _overload4[2];
	      source = _overload4[3];

	      return modify.call(this, function () {
	        return _this5.editor.formatLine(index, length, formats);
	      }, source, index, 0);
	    }
	  }, {
	    key: 'formatText',
	    value: function formatText(index, length, name, value, source) {
	      var _this6 = this;

	      var formats = void 0;

	      var _overload5 = overload(index, length, name, value, source);

	      var _overload6 = _slicedToArray(_overload5, 4);

	      index = _overload6[0];
	      length = _overload6[1];
	      formats = _overload6[2];
	      source = _overload6[3];

	      return modify.call(this, function () {
	        return _this6.editor.formatText(index, length, formats);
	      }, source, index, 0);
	    }
	  }, {
	    key: 'getBounds',
	    value: function getBounds(index) {
	      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	      if (typeof index === 'number') {
	        return this.selection.getBounds(index, length);
	      } else {
	        return this.selection.getBounds(index.index, index.length);
	      }
	    }
	  }, {
	    key: 'getContents',
	    value: function getContents() {
	      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getLength() - index;

	      var _overload7 = overload(index, length);

	      var _overload8 = _slicedToArray(_overload7, 2);

	      index = _overload8[0];
	      length = _overload8[1];

	      return this.editor.getContents(index, length);
	    }
	  }, {
	    key: 'getFormat',
	    value: function getFormat() {
	      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getSelection();
	      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	      if (typeof index === 'number') {
	        return this.editor.getFormat(index, length);
	      } else {
	        return this.editor.getFormat(index.index, index.length);
	      }
	    }
	  }, {
	    key: 'getLength',
	    value: function getLength() {
	      return this.scroll.length();
	    }
	  }, {
	    key: 'getModule',
	    value: function getModule(name) {
	      return this.theme.modules[name];
	    }
	  }, {
	    key: 'getSelection',
	    value: function getSelection() {
	      var focus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	      if (focus) this.focus();
	      this.update(); // Make sure we access getRange with editor in consistent state
	      return this.selection.getRange()[0];
	    }
	  }, {
	    key: 'getText',
	    value: function getText() {
	      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getLength() - index;

	      var _overload9 = overload(index, length);

	      var _overload10 = _slicedToArray(_overload9, 2);

	      index = _overload10[0];
	      length = _overload10[1];

	      return this.editor.getText(index, length);
	    }
	  }, {
	    key: 'hasFocus',
	    value: function hasFocus() {
	      return this.selection.hasFocus();
	    }
	  }, {
	    key: 'insertEmbed',
	    value: function insertEmbed(index, embed, value) {
	      var _this7 = this;

	      var source = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Quill.sources.API;

	      return modify.call(this, function () {
	        return _this7.editor.insertEmbed(index, embed, value);
	      }, source, index);
	    }
	  }, {
	    key: 'insertText',
	    value: function insertText(index, text, name, value, source) {
	      var _this8 = this;

	      var formats = void 0;

	      var _overload11 = overload(index, 0, name, value, source);

	      var _overload12 = _slicedToArray(_overload11, 4);

	      index = _overload12[0];
	      formats = _overload12[2];
	      source = _overload12[3];

	      return modify.call(this, function () {
	        return _this8.editor.insertText(index, text, formats);
	      }, source, index, text.length);
	    }
	  }, {
	    key: 'isEnabled',
	    value: function isEnabled() {
	      return !this.container.classList.contains('ql-disabled');
	    }
	  }, {
	    key: 'off',
	    value: function off() {
	      return this.emitter.off.apply(this.emitter, arguments);
	    }
	  }, {
	    key: 'on',
	    value: function on() {
	      return this.emitter.on.apply(this.emitter, arguments);
	    }
	  }, {
	    key: 'once',
	    value: function once() {
	      return this.emitter.once.apply(this.emitter, arguments);
	    }
	  }, {
	    key: 'pasteHTML',
	    value: function pasteHTML(index, html, source) {
	      this.clipboard.dangerouslyPasteHTML(index, html, source);
	    }
	  }, {
	    key: 'removeFormat',
	    value: function removeFormat(index, length, source) {
	      var _this9 = this;

	      var _overload13 = overload(index, length, source);

	      var _overload14 = _slicedToArray(_overload13, 4);

	      index = _overload14[0];
	      length = _overload14[1];
	      source = _overload14[3];

	      return modify.call(this, function () {
	        return _this9.editor.removeFormat(index, length);
	      }, source, index);
	    }
	  }, {
	    key: 'setContents',
	    value: function setContents(delta) {
	      var _this10 = this;

	      var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _emitter4.default.sources.API;

	      return modify.call(this, function () {
	        delta = new _quillDelta2.default(delta);
	        var length = _this10.getLength();
	        var deleted = _this10.editor.deleteText(0, length);
	        var applied = _this10.editor.applyDelta(delta);
	        var lastOp = applied.ops[applied.ops.length - 1];
	        if (lastOp != null && typeof lastOp.insert === 'string' && lastOp.insert[lastOp.insert.length - 1] === '\n') {
	          _this10.editor.deleteText(_this10.getLength() - 1, 1);
	          applied.delete(1);
	        }
	        var ret = deleted.compose(applied);
	        return ret;
	      }, source);
	    }
	  }, {
	    key: 'setSelection',
	    value: function setSelection(index, length, source) {
	      if (index == null) {
	        this.selection.setRange(null, length || Quill.sources.API);
	      } else {
	        var _overload15 = overload(index, length, source);

	        var _overload16 = _slicedToArray(_overload15, 4);

	        index = _overload16[0];
	        length = _overload16[1];
	        source = _overload16[3];

	        this.selection.setRange(new _selection.Range(index, length), source);
	      }
	      this.selection.scrollIntoView();
	    }
	  }, {
	    key: 'setText',
	    value: function setText(text) {
	      var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _emitter4.default.sources.API;

	      var delta = new _quillDelta2.default().insert(text);
	      return this.setContents(delta, source);
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _emitter4.default.sources.USER;

	      var change = this.scroll.update(source); // Will update selection before selection.update() does if text changes
	      this.selection.update(source);
	      return change;
	    }
	  }, {
	    key: 'updateContents',
	    value: function updateContents(delta) {
	      var _this11 = this;

	      var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _emitter4.default.sources.API;

	      return modify.call(this, function () {
	        delta = new _quillDelta2.default(delta);
	        return _this11.editor.applyDelta(delta, source);
	      }, source, true);
	    }
	  }]);

	  return Quill;
	}();

	Quill.DEFAULTS = {
	  bounds: null,
	  formats: null,
	  modules: {},
	  placeholder: '',
	  readOnly: false,
	  strict: true,
	  theme: 'default'
	};
	Quill.events = _emitter4.default.events;
	Quill.sources = _emitter4.default.sources;
	// eslint-disable-next-line no-undef
	Quill.version =  false ? 'dev' : ("1.1.5");

	Quill.imports = {
	  'delta': _quillDelta2.default,
	  'parchment': _parchment2.default,
	  'core/module': _module2.default,
	  'core/theme': _theme2.default
	};

	function expandConfig(container, userConfig) {
	  userConfig = (0, _extend2.default)(true, {
	    container: container,
	    modules: {
	      clipboard: true,
	      keyboard: true,
	      history: true
	    }
	  }, userConfig);
	  if (!userConfig.theme || userConfig.theme === Quill.DEFAULTS.theme) {
	    userConfig.theme = _theme2.default;
	  } else {
	    userConfig.theme = Quill.import('themes/' + userConfig.theme);
	    if (userConfig.theme == null) {
	      throw new Error('Invalid theme ' + userConfig.theme + '. Did you register it?');
	    }
	  }
	  var themeConfig = (0, _extend2.default)(true, {}, userConfig.theme.DEFAULTS);
	  [themeConfig, userConfig].forEach(function (config) {
	    config.modules = config.modules || {};
	    Object.keys(config.modules).forEach(function (module) {
	      if (config.modules[module] === true) {
	        config.modules[module] = {};
	      }
	    });
	  });
	  var moduleNames = Object.keys(themeConfig.modules).concat(Object.keys(userConfig.modules));
	  var moduleConfig = moduleNames.reduce(function (config, name) {
	    var moduleClass = Quill.import('modules/' + name);
	    if (moduleClass == null) {
	      debug.error('Cannot load ' + name + ' module. Are you sure you registered it?');
	    } else {
	      config[name] = moduleClass.DEFAULTS || {};
	    }
	    return config;
	  }, {});
	  // Special case toolbar shorthand
	  if (userConfig.modules != null && userConfig.modules.toolbar && userConfig.modules.toolbar.constructor !== Object) {
	    userConfig.modules.toolbar = {
	      container: userConfig.modules.toolbar
	    };
	  }
	  userConfig = (0, _extend2.default)(true, {}, Quill.DEFAULTS, { modules: moduleConfig }, themeConfig, userConfig);
	  ['bounds', 'container'].forEach(function (key) {
	    if (typeof userConfig[key] === 'string') {
	      userConfig[key] = document.querySelector(userConfig[key]);
	    }
	  });
	  userConfig.modules = Object.keys(userConfig.modules).reduce(function (config, name) {
	    if (userConfig.modules[name]) {
	      config[name] = userConfig.modules[name];
	    }
	    return config;
	  }, {});
	  return userConfig;
	}

	// Handle selection preservation and TEXT_CHANGE emission
	// common to modification APIs
	function modify(modifier, source, index, shift) {
	  if (!this.options.strict && !this.isEnabled() && source === _emitter4.default.sources.USER) {
	    return new _quillDelta2.default();
	  }
	  var range = index == null ? null : this.getSelection();
	  var oldDelta = this.editor.delta;
	  var change = modifier();
	  if (range != null) {
	    if (index === true) index = range.index;
	    if (shift == null) {
	      range = shiftRange(range, change, source);
	    } else if (shift !== 0) {
	      range = shiftRange(range, index, shift, source);
	    }
	    this.setSelection(range, _emitter4.default.sources.SILENT);
	  }
	  if (change.length() > 0) {
	    var _emitter;

	    var args = [_emitter4.default.events.TEXT_CHANGE, change, oldDelta, source];
	    (_emitter = this.emitter).emit.apply(_emitter, [_emitter4.default.events.EDITOR_CHANGE].concat(args));
	    if (source !== _emitter4.default.sources.SILENT) {
	      var _emitter2;

	      (_emitter2 = this.emitter).emit.apply(_emitter2, args);
	    }
	  }
	  return change;
	}

	function overload(index, length, name, value, source) {
	  var formats = {};
	  if (typeof index.index === 'number' && typeof index.length === 'number') {
	    // Allow for throwaway end (used by insertText/insertEmbed)
	    if (typeof length !== 'number') {
	      source = value, value = name, name = length, length = index.length, index = index.index;
	    } else {
	      length = index.length, index = index.index;
	    }
	  } else if (typeof length !== 'number') {
	    source = value, value = name, name = length, length = 0;
	  }
	  // Handle format being object, two format name/value strings or excluded
	  if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
	    formats = name;
	    source = value;
	  } else if (typeof name === 'string') {
	    if (value != null) {
	      formats[name] = value;
	    } else {
	      source = name;
	    }
	  }
	  // Handle optional source
	  source = source || _emitter4.default.sources.API;
	  return [index, length, formats, source];
	}

	function shiftRange(range, index, length, source) {
	  if (range == null) return null;
	  var start = void 0,
	      end = void 0;
	  if (index instanceof _quillDelta2.default) {
	    var _map = [range.index, range.index + range.length].map(function (pos) {
	      return index.transformPosition(pos, source === _emitter4.default.sources.USER);
	    });

	    var _map2 = _slicedToArray(_map, 2);

	    start = _map2[0];
	    end = _map2[1];
	  } else {
	    var _map3 = [range.index, range.index + range.length].map(function (pos) {
	      if (pos < index || pos === index && source !== _emitter4.default.sources.USER) return pos;
	      if (length >= 0) {
	        return pos + length;
	      } else {
	        return Math.max(index, pos + length);
	      }
	    });

	    var _map4 = _slicedToArray(_map3, 2);

	    start = _map4[0];
	    end = _map4[1];
	  }
	  return new _selection.Range(start, end - start);
	}

	exports.expandConfig = expandConfig;
	exports.overload = overload;
	exports.default = Quill;

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';

	var elem = document.createElement('div');
	elem.classList.toggle('test-class', false);
	if (elem.classList.contains('test-class')) {
	  (function () {
	    var _toggle = DOMTokenList.prototype.toggle;
	    DOMTokenList.prototype.toggle = function (token, force) {
	      if (arguments.length > 1 && !this.contains(token) === !force) {
	        return force;
	      } else {
	        return _toggle.call(this, token);
	      }
	    };
	  })();
	}

	if (!String.prototype.startsWith) {
	  String.prototype.startsWith = function (searchString, position) {
	    position = position || 0;
	    return this.substr(position, searchString.length) === searchString;
	  };
	}

	if (!String.prototype.endsWith) {
	  String.prototype.endsWith = function (searchString, position) {
	    var subjectString = this.toString();
	    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
	      position = subjectString.length;
	    }
	    position -= searchString.length;
	    var lastIndex = subjectString.indexOf(searchString, position);
	    return lastIndex !== -1 && lastIndex === position;
	  };
	}

	if (!Array.prototype.find) {
	  Object.defineProperty(Array.prototype, "find", {
	    value: function value(predicate) {
	      if (this === null) {
	        throw new TypeError('Array.prototype.find called on null or undefined');
	      }
	      if (typeof predicate !== 'function') {
	        throw new TypeError('predicate must be a function');
	      }
	      var list = Object(this);
	      var length = list.length >>> 0;
	      var thisArg = arguments[1];
	      var value;

	      for (var i = 0; i < length; i++) {
	        value = list[i];
	        if (predicate.call(thisArg, value, i, list)) {
	          return value;
	        }
	      }
	      return undefined;
	    }
	  });
	}

	// Disable resizing in Firefox
	document.addEventListener("DOMContentLoaded", function () {
	  document.execCommand("enableObjectResizing", false, false);
	});

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var diff = __webpack_require__(21);
	var equal = __webpack_require__(22);
	var extend = __webpack_require__(25);
	var op = __webpack_require__(26);


	var NULL_CHARACTER = String.fromCharCode(0);  // Placeholder char for embed in diff()


	var Delta = function (ops) {
	  // Assume we are given a well formed ops
	  if (Array.isArray(ops)) {
	    this.ops = ops;
	  } else if (ops != null && Array.isArray(ops.ops)) {
	    this.ops = ops.ops;
	  } else {
	    this.ops = [];
	  }
	};


	Delta.prototype.insert = function (text, attributes) {
	  var newOp = {};
	  if (text.length === 0) return this;
	  newOp.insert = text;
	  if (attributes != null && typeof attributes === 'object' && Object.keys(attributes).length > 0) {
	    newOp.attributes = attributes;
	  }
	  return this.push(newOp);
	};

	Delta.prototype['delete'] = function (length) {
	  if (length <= 0) return this;
	  return this.push({ 'delete': length });
	};

	Delta.prototype.retain = function (length, attributes) {
	  if (length <= 0) return this;
	  var newOp = { retain: length };
	  if (attributes != null && typeof attributes === 'object' && Object.keys(attributes).length > 0) {
	    newOp.attributes = attributes;
	  }
	  return this.push(newOp);
	};

	Delta.prototype.push = function (newOp) {
	  var index = this.ops.length;
	  var lastOp = this.ops[index - 1];
	  newOp = extend(true, {}, newOp);
	  if (typeof lastOp === 'object') {
	    if (typeof newOp['delete'] === 'number' && typeof lastOp['delete'] === 'number') {
	      this.ops[index - 1] = { 'delete': lastOp['delete'] + newOp['delete'] };
	      return this;
	    }
	    // Since it does not matter if we insert before or after deleting at the same index,
	    // always prefer to insert first
	    if (typeof lastOp['delete'] === 'number' && newOp.insert != null) {
	      index -= 1;
	      lastOp = this.ops[index - 1];
	      if (typeof lastOp !== 'object') {
	        this.ops.unshift(newOp);
	        return this;
	      }
	    }
	    if (equal(newOp.attributes, lastOp.attributes)) {
	      if (typeof newOp.insert === 'string' && typeof lastOp.insert === 'string') {
	        this.ops[index - 1] = { insert: lastOp.insert + newOp.insert };
	        if (typeof newOp.attributes === 'object') this.ops[index - 1].attributes = newOp.attributes
	        return this;
	      } else if (typeof newOp.retain === 'number' && typeof lastOp.retain === 'number') {
	        this.ops[index - 1] = { retain: lastOp.retain + newOp.retain };
	        if (typeof newOp.attributes === 'object') this.ops[index - 1].attributes = newOp.attributes
	        return this;
	      }
	    }
	  }
	  if (index === this.ops.length) {
	    this.ops.push(newOp);
	  } else {
	    this.ops.splice(index, 0, newOp);
	  }
	  return this;
	};

	Delta.prototype.filter = function (predicate) {
	  return this.ops.filter(predicate);
	};

	Delta.prototype.forEach = function (predicate) {
	  this.ops.forEach(predicate);
	};

	Delta.prototype.map = function (predicate) {
	  return this.ops.map(predicate);
	};

	Delta.prototype.partition = function (predicate) {
	  var passed = [], failed = [];
	  this.forEach(function(op) {
	    var target = predicate(op) ? passed : failed;
	    target.push(op);
	  });
	  return [passed, failed];
	};

	Delta.prototype.reduce = function (predicate, initial) {
	  return this.ops.reduce(predicate, initial);
	};

	Delta.prototype.chop = function () {
	  var lastOp = this.ops[this.ops.length - 1];
	  if (lastOp && lastOp.retain && !lastOp.attributes) {
	    this.ops.pop();
	  }
	  return this;
	};

	Delta.prototype.length = function () {
	  return this.reduce(function (length, elem) {
	    return length + op.length(elem);
	  }, 0);
	};

	Delta.prototype.slice = function (start, end) {
	  start = start || 0;
	  if (typeof end !== 'number') end = Infinity;
	  var ops = [];
	  var iter = op.iterator(this.ops);
	  var index = 0;
	  while (index < end && iter.hasNext()) {
	    var nextOp;
	    if (index < start) {
	      nextOp = iter.next(start - index);
	    } else {
	      nextOp = iter.next(end - index);
	      ops.push(nextOp);
	    }
	    index += op.length(nextOp);
	  }
	  return new Delta(ops);
	};


	Delta.prototype.compose = function (other) {
	  var thisIter = op.iterator(this.ops);
	  var otherIter = op.iterator(other.ops);
	  var delta = new Delta();
	  while (thisIter.hasNext() || otherIter.hasNext()) {
	    if (otherIter.peekType() === 'insert') {
	      delta.push(otherIter.next());
	    } else if (thisIter.peekType() === 'delete') {
	      delta.push(thisIter.next());
	    } else {
	      var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
	      var thisOp = thisIter.next(length);
	      var otherOp = otherIter.next(length);
	      if (typeof otherOp.retain === 'number') {
	        var newOp = {};
	        if (typeof thisOp.retain === 'number') {
	          newOp.retain = length;
	        } else {
	          newOp.insert = thisOp.insert;
	        }
	        // Preserve null when composing with a retain, otherwise remove it for inserts
	        var attributes = op.attributes.compose(thisOp.attributes, otherOp.attributes, typeof thisOp.retain === 'number');
	        if (attributes) newOp.attributes = attributes;
	        delta.push(newOp);
	      // Other op should be delete, we could be an insert or retain
	      // Insert + delete cancels out
	      } else if (typeof otherOp['delete'] === 'number' && typeof thisOp.retain === 'number') {
	        delta.push(otherOp);
	      }
	    }
	  }
	  return delta.chop();
	};

	Delta.prototype.concat = function (other) {
	  var delta = new Delta(this.ops.slice());
	  if (other.ops.length > 0) {
	    delta.push(other.ops[0]);
	    delta.ops = delta.ops.concat(other.ops.slice(1));
	  }
	  return delta;
	};

	Delta.prototype.diff = function (other, index) {
	  if (this.ops === other.ops) {
	    return new Delta();
	  }
	  var strings = [this, other].map(function (delta) {
	    return delta.map(function (op) {
	      if (op.insert != null) {
	        return typeof op.insert === 'string' ? op.insert : NULL_CHARACTER;
	      }
	      var prep = (delta === other) ? 'on' : 'with';
	      throw new Error('diff() called ' + prep + ' non-document');
	    }).join('');
	  });
	  var delta = new Delta();
	  var diffResult = diff(strings[0], strings[1], index);
	  var thisIter = op.iterator(this.ops);
	  var otherIter = op.iterator(other.ops);
	  diffResult.forEach(function (component) {
	    var length = component[1].length;
	    while (length > 0) {
	      var opLength = 0;
	      switch (component[0]) {
	        case diff.INSERT:
	          opLength = Math.min(otherIter.peekLength(), length);
	          delta.push(otherIter.next(opLength));
	          break;
	        case diff.DELETE:
	          opLength = Math.min(length, thisIter.peekLength());
	          thisIter.next(opLength);
	          delta['delete'](opLength);
	          break;
	        case diff.EQUAL:
	          opLength = Math.min(thisIter.peekLength(), otherIter.peekLength(), length);
	          var thisOp = thisIter.next(opLength);
	          var otherOp = otherIter.next(opLength);
	          if (equal(thisOp.insert, otherOp.insert)) {
	            delta.retain(opLength, op.attributes.diff(thisOp.attributes, otherOp.attributes));
	          } else {
	            delta.push(otherOp)['delete'](opLength);
	          }
	          break;
	      }
	      length -= opLength;
	    }
	  });
	  return delta.chop();
	};

	Delta.prototype.eachLine = function (predicate, newline) {
	  newline = newline || '\n';
	  var iter = op.iterator(this.ops);
	  var line = new Delta();
	  while (iter.hasNext()) {
	    if (iter.peekType() !== 'insert') return;
	    var thisOp = iter.peek();
	    var start = op.length(thisOp) - iter.peekLength();
	    var index = typeof thisOp.insert === 'string' ?
	      thisOp.insert.indexOf(newline, start) - start : -1;
	    if (index < 0) {
	      line.push(iter.next());
	    } else if (index > 0) {
	      line.push(iter.next(index));
	    } else {
	      predicate(line, iter.next(1).attributes || {});
	      line = new Delta();
	    }
	  }
	  if (line.length() > 0) {
	    predicate(line, {});
	  }
	};

	Delta.prototype.transform = function (other, priority) {
	  priority = !!priority;
	  if (typeof other === 'number') {
	    return this.transformPosition(other, priority);
	  }
	  var thisIter = op.iterator(this.ops);
	  var otherIter = op.iterator(other.ops);
	  var delta = new Delta();
	  while (thisIter.hasNext() || otherIter.hasNext()) {
	    if (thisIter.peekType() === 'insert' && (priority || otherIter.peekType() !== 'insert')) {
	      delta.retain(op.length(thisIter.next()));
	    } else if (otherIter.peekType() === 'insert') {
	      delta.push(otherIter.next());
	    } else {
	      var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
	      var thisOp = thisIter.next(length);
	      var otherOp = otherIter.next(length);
	      if (thisOp['delete']) {
	        // Our delete either makes their delete redundant or removes their retain
	        continue;
	      } else if (otherOp['delete']) {
	        delta.push(otherOp);
	      } else {
	        // We retain either their retain or insert
	        delta.retain(length, op.attributes.transform(thisOp.attributes, otherOp.attributes, priority));
	      }
	    }
	  }
	  return delta.chop();
	};

	Delta.prototype.transformPosition = function (index, priority) {
	  priority = !!priority;
	  var thisIter = op.iterator(this.ops);
	  var offset = 0;
	  while (thisIter.hasNext() && offset <= index) {
	    var length = thisIter.peekLength();
	    var nextType = thisIter.peekType();
	    thisIter.next();
	    if (nextType === 'delete') {
	      index -= Math.min(length, index - offset);
	      continue;
	    } else if (nextType === 'insert' && (offset < index || !priority)) {
	      index += length;
	    }
	    offset += length;
	  }
	  return index;
	};


	module.exports = Delta;


/***/ },
/* 21 */
/***/ function(module, exports) {

	/**
	 * This library modifies the diff-patch-match library by Neil Fraser
	 * by removing the patch and match functionality and certain advanced
	 * options in the diff function. The original license is as follows:
	 *
	 * ===
	 *
	 * Diff Match and Patch
	 *
	 * Copyright 2006 Google Inc.
	 * http://code.google.com/p/google-diff-match-patch/
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */


	/**
	 * The data structure representing a diff is an array of tuples:
	 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
	 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
	 */
	var DIFF_DELETE = -1;
	var DIFF_INSERT = 1;
	var DIFF_EQUAL = 0;


	/**
	 * Find the differences between two texts.  Simplifies the problem by stripping
	 * any common prefix or suffix off the texts before diffing.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {Int} cursor_pos Expected edit position in text1 (optional)
	 * @return {Array} Array of diff tuples.
	 */
	function diff_main(text1, text2, cursor_pos) {
	  // Check for equality (speedup).
	  if (text1 == text2) {
	    if (text1) {
	      return [[DIFF_EQUAL, text1]];
	    }
	    return [];
	  }

	  // Check cursor_pos within bounds
	  if (cursor_pos < 0 || text1.length < cursor_pos) {
	    cursor_pos = null;
	  }

	  // Trim off common prefix (speedup).
	  var commonlength = diff_commonPrefix(text1, text2);
	  var commonprefix = text1.substring(0, commonlength);
	  text1 = text1.substring(commonlength);
	  text2 = text2.substring(commonlength);

	  // Trim off common suffix (speedup).
	  commonlength = diff_commonSuffix(text1, text2);
	  var commonsuffix = text1.substring(text1.length - commonlength);
	  text1 = text1.substring(0, text1.length - commonlength);
	  text2 = text2.substring(0, text2.length - commonlength);

	  // Compute the diff on the middle block.
	  var diffs = diff_compute_(text1, text2);

	  // Restore the prefix and suffix.
	  if (commonprefix) {
	    diffs.unshift([DIFF_EQUAL, commonprefix]);
	  }
	  if (commonsuffix) {
	    diffs.push([DIFF_EQUAL, commonsuffix]);
	  }
	  diff_cleanupMerge(diffs);
	  if (cursor_pos != null) {
	    diffs = fix_cursor(diffs, cursor_pos);
	  }
	  return diffs;
	};


	/**
	 * Find the differences between two texts.  Assumes that the texts do not
	 * have any common prefix or suffix.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @return {Array} Array of diff tuples.
	 */
	function diff_compute_(text1, text2) {
	  var diffs;

	  if (!text1) {
	    // Just add some text (speedup).
	    return [[DIFF_INSERT, text2]];
	  }

	  if (!text2) {
	    // Just delete some text (speedup).
	    return [[DIFF_DELETE, text1]];
	  }

	  var longtext = text1.length > text2.length ? text1 : text2;
	  var shorttext = text1.length > text2.length ? text2 : text1;
	  var i = longtext.indexOf(shorttext);
	  if (i != -1) {
	    // Shorter text is inside the longer text (speedup).
	    diffs = [[DIFF_INSERT, longtext.substring(0, i)],
	             [DIFF_EQUAL, shorttext],
	             [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
	    // Swap insertions for deletions if diff is reversed.
	    if (text1.length > text2.length) {
	      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
	    }
	    return diffs;
	  }

	  if (shorttext.length == 1) {
	    // Single character string.
	    // After the previous speedup, the character can't be an equality.
	    return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
	  }

	  // Check to see if the problem can be split in two.
	  var hm = diff_halfMatch_(text1, text2);
	  if (hm) {
	    // A half-match was found, sort out the return data.
	    var text1_a = hm[0];
	    var text1_b = hm[1];
	    var text2_a = hm[2];
	    var text2_b = hm[3];
	    var mid_common = hm[4];
	    // Send both pairs off for separate processing.
	    var diffs_a = diff_main(text1_a, text2_a);
	    var diffs_b = diff_main(text1_b, text2_b);
	    // Merge the results.
	    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
	  }

	  return diff_bisect_(text1, text2);
	};


	/**
	 * Find the 'middle snake' of a diff, split the problem in two
	 * and return the recursively constructed diff.
	 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @return {Array} Array of diff tuples.
	 * @private
	 */
	function diff_bisect_(text1, text2) {
	  // Cache the text lengths to prevent multiple calls.
	  var text1_length = text1.length;
	  var text2_length = text2.length;
	  var max_d = Math.ceil((text1_length + text2_length) / 2);
	  var v_offset = max_d;
	  var v_length = 2 * max_d;
	  var v1 = new Array(v_length);
	  var v2 = new Array(v_length);
	  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
	  // integers and undefined.
	  for (var x = 0; x < v_length; x++) {
	    v1[x] = -1;
	    v2[x] = -1;
	  }
	  v1[v_offset + 1] = 0;
	  v2[v_offset + 1] = 0;
	  var delta = text1_length - text2_length;
	  // If the total number of characters is odd, then the front path will collide
	  // with the reverse path.
	  var front = (delta % 2 != 0);
	  // Offsets for start and end of k loop.
	  // Prevents mapping of space beyond the grid.
	  var k1start = 0;
	  var k1end = 0;
	  var k2start = 0;
	  var k2end = 0;
	  for (var d = 0; d < max_d; d++) {
	    // Walk the front path one step.
	    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
	      var k1_offset = v_offset + k1;
	      var x1;
	      if (k1 == -d || (k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
	        x1 = v1[k1_offset + 1];
	      } else {
	        x1 = v1[k1_offset - 1] + 1;
	      }
	      var y1 = x1 - k1;
	      while (x1 < text1_length && y1 < text2_length &&
	             text1.charAt(x1) == text2.charAt(y1)) {
	        x1++;
	        y1++;
	      }
	      v1[k1_offset] = x1;
	      if (x1 > text1_length) {
	        // Ran off the right of the graph.
	        k1end += 2;
	      } else if (y1 > text2_length) {
	        // Ran off the bottom of the graph.
	        k1start += 2;
	      } else if (front) {
	        var k2_offset = v_offset + delta - k1;
	        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
	          // Mirror x2 onto top-left coordinate system.
	          var x2 = text1_length - v2[k2_offset];
	          if (x1 >= x2) {
	            // Overlap detected.
	            return diff_bisectSplit_(text1, text2, x1, y1);
	          }
	        }
	      }
	    }

	    // Walk the reverse path one step.
	    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
	      var k2_offset = v_offset + k2;
	      var x2;
	      if (k2 == -d || (k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
	        x2 = v2[k2_offset + 1];
	      } else {
	        x2 = v2[k2_offset - 1] + 1;
	      }
	      var y2 = x2 - k2;
	      while (x2 < text1_length && y2 < text2_length &&
	             text1.charAt(text1_length - x2 - 1) ==
	             text2.charAt(text2_length - y2 - 1)) {
	        x2++;
	        y2++;
	      }
	      v2[k2_offset] = x2;
	      if (x2 > text1_length) {
	        // Ran off the left of the graph.
	        k2end += 2;
	      } else if (y2 > text2_length) {
	        // Ran off the top of the graph.
	        k2start += 2;
	      } else if (!front) {
	        var k1_offset = v_offset + delta - k2;
	        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
	          var x1 = v1[k1_offset];
	          var y1 = v_offset + x1 - k1_offset;
	          // Mirror x2 onto top-left coordinate system.
	          x2 = text1_length - x2;
	          if (x1 >= x2) {
	            // Overlap detected.
	            return diff_bisectSplit_(text1, text2, x1, y1);
	          }
	        }
	      }
	    }
	  }
	  // Diff took too long and hit the deadline or
	  // number of diffs equals number of characters, no commonality at all.
	  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
	};


	/**
	 * Given the location of the 'middle snake', split the diff in two parts
	 * and recurse.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {number} x Index of split point in text1.
	 * @param {number} y Index of split point in text2.
	 * @return {Array} Array of diff tuples.
	 */
	function diff_bisectSplit_(text1, text2, x, y) {
	  var text1a = text1.substring(0, x);
	  var text2a = text2.substring(0, y);
	  var text1b = text1.substring(x);
	  var text2b = text2.substring(y);

	  // Compute both diffs serially.
	  var diffs = diff_main(text1a, text2a);
	  var diffsb = diff_main(text1b, text2b);

	  return diffs.concat(diffsb);
	};


	/**
	 * Determine the common prefix of two strings.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {number} The number of characters common to the start of each
	 *     string.
	 */
	function diff_commonPrefix(text1, text2) {
	  // Quick check for common null cases.
	  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
	    return 0;
	  }
	  // Binary search.
	  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
	  var pointermin = 0;
	  var pointermax = Math.min(text1.length, text2.length);
	  var pointermid = pointermax;
	  var pointerstart = 0;
	  while (pointermin < pointermid) {
	    if (text1.substring(pointerstart, pointermid) ==
	        text2.substring(pointerstart, pointermid)) {
	      pointermin = pointermid;
	      pointerstart = pointermin;
	    } else {
	      pointermax = pointermid;
	    }
	    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
	  }
	  return pointermid;
	};


	/**
	 * Determine the common suffix of two strings.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {number} The number of characters common to the end of each string.
	 */
	function diff_commonSuffix(text1, text2) {
	  // Quick check for common null cases.
	  if (!text1 || !text2 ||
	      text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
	    return 0;
	  }
	  // Binary search.
	  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
	  var pointermin = 0;
	  var pointermax = Math.min(text1.length, text2.length);
	  var pointermid = pointermax;
	  var pointerend = 0;
	  while (pointermin < pointermid) {
	    if (text1.substring(text1.length - pointermid, text1.length - pointerend) ==
	        text2.substring(text2.length - pointermid, text2.length - pointerend)) {
	      pointermin = pointermid;
	      pointerend = pointermin;
	    } else {
	      pointermax = pointermid;
	    }
	    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
	  }
	  return pointermid;
	};


	/**
	 * Do the two texts share a substring which is at least half the length of the
	 * longer text?
	 * This speedup can produce non-minimal diffs.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {Array.<string>} Five element Array, containing the prefix of
	 *     text1, the suffix of text1, the prefix of text2, the suffix of
	 *     text2 and the common middle.  Or null if there was no match.
	 */
	function diff_halfMatch_(text1, text2) {
	  var longtext = text1.length > text2.length ? text1 : text2;
	  var shorttext = text1.length > text2.length ? text2 : text1;
	  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
	    return null;  // Pointless.
	  }

	  /**
	   * Does a substring of shorttext exist within longtext such that the substring
	   * is at least half the length of longtext?
	   * Closure, but does not reference any external variables.
	   * @param {string} longtext Longer string.
	   * @param {string} shorttext Shorter string.
	   * @param {number} i Start index of quarter length substring within longtext.
	   * @return {Array.<string>} Five element Array, containing the prefix of
	   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
	   *     of shorttext and the common middle.  Or null if there was no match.
	   * @private
	   */
	  function diff_halfMatchI_(longtext, shorttext, i) {
	    // Start with a 1/4 length substring at position i as a seed.
	    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
	    var j = -1;
	    var best_common = '';
	    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
	    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
	      var prefixLength = diff_commonPrefix(longtext.substring(i),
	                                           shorttext.substring(j));
	      var suffixLength = diff_commonSuffix(longtext.substring(0, i),
	                                           shorttext.substring(0, j));
	      if (best_common.length < suffixLength + prefixLength) {
	        best_common = shorttext.substring(j - suffixLength, j) +
	            shorttext.substring(j, j + prefixLength);
	        best_longtext_a = longtext.substring(0, i - suffixLength);
	        best_longtext_b = longtext.substring(i + prefixLength);
	        best_shorttext_a = shorttext.substring(0, j - suffixLength);
	        best_shorttext_b = shorttext.substring(j + prefixLength);
	      }
	    }
	    if (best_common.length * 2 >= longtext.length) {
	      return [best_longtext_a, best_longtext_b,
	              best_shorttext_a, best_shorttext_b, best_common];
	    } else {
	      return null;
	    }
	  }

	  // First check if the second quarter is the seed for a half-match.
	  var hm1 = diff_halfMatchI_(longtext, shorttext,
	                             Math.ceil(longtext.length / 4));
	  // Check again based on the third quarter.
	  var hm2 = diff_halfMatchI_(longtext, shorttext,
	                             Math.ceil(longtext.length / 2));
	  var hm;
	  if (!hm1 && !hm2) {
	    return null;
	  } else if (!hm2) {
	    hm = hm1;
	  } else if (!hm1) {
	    hm = hm2;
	  } else {
	    // Both matched.  Select the longest.
	    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
	  }

	  // A half-match was found, sort out the return data.
	  var text1_a, text1_b, text2_a, text2_b;
	  if (text1.length > text2.length) {
	    text1_a = hm[0];
	    text1_b = hm[1];
	    text2_a = hm[2];
	    text2_b = hm[3];
	  } else {
	    text2_a = hm[0];
	    text2_b = hm[1];
	    text1_a = hm[2];
	    text1_b = hm[3];
	  }
	  var mid_common = hm[4];
	  return [text1_a, text1_b, text2_a, text2_b, mid_common];
	};


	/**
	 * Reorder and merge like edit sections.  Merge equalities.
	 * Any edit section can move as long as it doesn't cross an equality.
	 * @param {Array} diffs Array of diff tuples.
	 */
	function diff_cleanupMerge(diffs) {
	  diffs.push([DIFF_EQUAL, '']);  // Add a dummy entry at the end.
	  var pointer = 0;
	  var count_delete = 0;
	  var count_insert = 0;
	  var text_delete = '';
	  var text_insert = '';
	  var commonlength;
	  while (pointer < diffs.length) {
	    switch (diffs[pointer][0]) {
	      case DIFF_INSERT:
	        count_insert++;
	        text_insert += diffs[pointer][1];
	        pointer++;
	        break;
	      case DIFF_DELETE:
	        count_delete++;
	        text_delete += diffs[pointer][1];
	        pointer++;
	        break;
	      case DIFF_EQUAL:
	        // Upon reaching an equality, check for prior redundancies.
	        if (count_delete + count_insert > 1) {
	          if (count_delete !== 0 && count_insert !== 0) {
	            // Factor out any common prefixies.
	            commonlength = diff_commonPrefix(text_insert, text_delete);
	            if (commonlength !== 0) {
	              if ((pointer - count_delete - count_insert) > 0 &&
	                  diffs[pointer - count_delete - count_insert - 1][0] ==
	                  DIFF_EQUAL) {
	                diffs[pointer - count_delete - count_insert - 1][1] +=
	                    text_insert.substring(0, commonlength);
	              } else {
	                diffs.splice(0, 0, [DIFF_EQUAL,
	                                    text_insert.substring(0, commonlength)]);
	                pointer++;
	              }
	              text_insert = text_insert.substring(commonlength);
	              text_delete = text_delete.substring(commonlength);
	            }
	            // Factor out any common suffixies.
	            commonlength = diff_commonSuffix(text_insert, text_delete);
	            if (commonlength !== 0) {
	              diffs[pointer][1] = text_insert.substring(text_insert.length -
	                  commonlength) + diffs[pointer][1];
	              text_insert = text_insert.substring(0, text_insert.length -
	                  commonlength);
	              text_delete = text_delete.substring(0, text_delete.length -
	                  commonlength);
	            }
	          }
	          // Delete the offending records and add the merged ones.
	          if (count_delete === 0) {
	            diffs.splice(pointer - count_insert,
	                count_delete + count_insert, [DIFF_INSERT, text_insert]);
	          } else if (count_insert === 0) {
	            diffs.splice(pointer - count_delete,
	                count_delete + count_insert, [DIFF_DELETE, text_delete]);
	          } else {
	            diffs.splice(pointer - count_delete - count_insert,
	                count_delete + count_insert, [DIFF_DELETE, text_delete],
	                [DIFF_INSERT, text_insert]);
	          }
	          pointer = pointer - count_delete - count_insert +
	                    (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
	        } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
	          // Merge this equality with the previous one.
	          diffs[pointer - 1][1] += diffs[pointer][1];
	          diffs.splice(pointer, 1);
	        } else {
	          pointer++;
	        }
	        count_insert = 0;
	        count_delete = 0;
	        text_delete = '';
	        text_insert = '';
	        break;
	    }
	  }
	  if (diffs[diffs.length - 1][1] === '') {
	    diffs.pop();  // Remove the dummy entry at the end.
	  }

	  // Second pass: look for single edits surrounded on both sides by equalities
	  // which can be shifted sideways to eliminate an equality.
	  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
	  var changes = false;
	  pointer = 1;
	  // Intentionally ignore the first and last element (don't need checking).
	  while (pointer < diffs.length - 1) {
	    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
	        diffs[pointer + 1][0] == DIFF_EQUAL) {
	      // This is a single edit surrounded by equalities.
	      if (diffs[pointer][1].substring(diffs[pointer][1].length -
	          diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
	        // Shift the edit over the previous equality.
	        diffs[pointer][1] = diffs[pointer - 1][1] +
	            diffs[pointer][1].substring(0, diffs[pointer][1].length -
	                                        diffs[pointer - 1][1].length);
	        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
	        diffs.splice(pointer - 1, 1);
	        changes = true;
	      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ==
	          diffs[pointer + 1][1]) {
	        // Shift the edit over the next equality.
	        diffs[pointer - 1][1] += diffs[pointer + 1][1];
	        diffs[pointer][1] =
	            diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
	            diffs[pointer + 1][1];
	        diffs.splice(pointer + 1, 1);
	        changes = true;
	      }
	    }
	    pointer++;
	  }
	  // If shifts were made, the diff needs reordering and another shift sweep.
	  if (changes) {
	    diff_cleanupMerge(diffs);
	  }
	};


	var diff = diff_main;
	diff.INSERT = DIFF_INSERT;
	diff.DELETE = DIFF_DELETE;
	diff.EQUAL = DIFF_EQUAL;

	module.exports = diff;

	/*
	 * Modify a diff such that the cursor position points to the start of a change:
	 * E.g.
	 *   cursor_normalize_diff([[DIFF_EQUAL, 'abc']], 1)
	 *     => [1, [[DIFF_EQUAL, 'a'], [DIFF_EQUAL, 'bc']]]
	 *   cursor_normalize_diff([[DIFF_INSERT, 'new'], [DIFF_DELETE, 'xyz']], 2)
	 *     => [2, [[DIFF_INSERT, 'new'], [DIFF_DELETE, 'xy'], [DIFF_DELETE, 'z']]]
	 *
	 * @param {Array} diffs Array of diff tuples
	 * @param {Int} cursor_pos Suggested edit position. Must not be out of bounds!
	 * @return {Array} A tuple [cursor location in the modified diff, modified diff]
	 */
	function cursor_normalize_diff (diffs, cursor_pos) {
	  if (cursor_pos === 0) {
	    return [DIFF_EQUAL, diffs];
	  }
	  for (var current_pos = 0, i = 0; i < diffs.length; i++) {
	    var d = diffs[i];
	    if (d[0] === DIFF_DELETE || d[0] === DIFF_EQUAL) {
	      var next_pos = current_pos + d[1].length;
	      if (cursor_pos === next_pos) {
	        return [i + 1, diffs];
	      } else if (cursor_pos < next_pos) {
	        // copy to prevent side effects
	        diffs = diffs.slice();
	        // split d into two diff changes
	        var split_pos = cursor_pos - current_pos;
	        var d_left = [d[0], d[1].slice(0, split_pos)];
	        var d_right = [d[0], d[1].slice(split_pos)];
	        diffs.splice(i, 1, d_left, d_right);
	        return [i + 1, diffs];
	      } else {
	        current_pos = next_pos;
	      }
	    }
	  }
	  throw new Error('cursor_pos is out of bounds!')
	}

	/*
	 * Modify a diff such that the edit position is "shifted" to the proposed edit location (cursor_position).
	 *
	 * Case 1)
	 *   Check if a naive shift is possible:
	 *     [0, X], [ 1, Y] -> [ 1, Y], [0, X]    (if X + Y === Y + X)
	 *     [0, X], [-1, Y] -> [-1, Y], [0, X]    (if X + Y === Y + X) - holds same result
	 * Case 2)
	 *   Check if the following shifts are possible:
	 *     [0, 'pre'], [ 1, 'prefix'] -> [ 1, 'pre'], [0, 'pre'], [ 1, 'fix']
	 *     [0, 'pre'], [-1, 'prefix'] -> [-1, 'pre'], [0, 'pre'], [-1, 'fix']
	 *         ^            ^
	 *         d          d_next
	 *
	 * @param {Array} diffs Array of diff tuples
	 * @param {Int} cursor_pos Suggested edit position. Must not be out of bounds!
	 * @return {Array} Array of diff tuples
	 */
	function fix_cursor (diffs, cursor_pos) {
	  var norm = cursor_normalize_diff(diffs, cursor_pos);
	  var ndiffs = norm[1];
	  var cursor_pointer = norm[0];
	  var d = ndiffs[cursor_pointer];
	  var d_next = ndiffs[cursor_pointer + 1];

	  if (d == null) {
	    // Text was deleted from end of original string,
	    // cursor is now out of bounds in new string
	    return diffs;
	  } else if (d[0] !== DIFF_EQUAL) {
	    // A modification happened at the cursor location.
	    // This is the expected outcome, so we can return the original diff.
	    return diffs;
	  } else {
	    if (d_next != null && d[1] + d_next[1] === d_next[1] + d[1]) {
	      // Case 1)
	      // It is possible to perform a naive shift
	      ndiffs.splice(cursor_pointer, 2, d_next, d)
	      return merge_tuples(ndiffs, cursor_pointer, 2)
	    } else if (d_next != null && d_next[1].indexOf(d[1]) === 0) {
	      // Case 2)
	      // d[1] is a prefix of d_next[1]
	      // We can assume that d_next[0] !== 0, since d[0] === 0
	      // Shift edit locations..
	      ndiffs.splice(cursor_pointer, 2, [d_next[0], d[1]], [0, d[1]]);
	      var suffix = d_next[1].slice(d[1].length);
	      if (suffix.length > 0) {
	        ndiffs.splice(cursor_pointer + 2, 0, [d_next[0], suffix]);
	      }
	      return merge_tuples(ndiffs, cursor_pointer, 3)
	    } else {
	      // Not possible to perform any modification
	      return diffs;
	    }
	  }

	}

	/*
	 * Try to merge tuples with their neigbors in a given range.
	 * E.g. [0, 'a'], [0, 'b'] -> [0, 'ab']
	 *
	 * @param {Array} diffs Array of diff tuples.
	 * @param {Int} start Position of the first element to merge (diffs[start] is also merged with diffs[start - 1]).
	 * @param {Int} length Number of consecutive elements to check.
	 * @return {Array} Array of merged diff tuples.
	 */
	function merge_tuples (diffs, start, length) {
	  // Check from (start-1) to (start+length).
	  for (var i = start + length - 1; i >= 0 && i >= start - 1; i--) {
	    if (i + 1 < diffs.length) {
	      var left_d = diffs[i];
	      var right_d = diffs[i+1];
	      if (left_d[0] === right_d[1]) {
	        diffs.splice(i, 2, [left_d[0], left_d[1] + right_d[1]]);
	      }
	    }
	  }
	  return diffs;
	}


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var pSlice = Array.prototype.slice;
	var objectKeys = __webpack_require__(23);
	var isArguments = __webpack_require__(24);

	var deepEqual = module.exports = function (actual, expected, opts) {
	  if (!opts) opts = {};
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;

	  } else if (actual instanceof Date && expected instanceof Date) {
	    return actual.getTime() === expected.getTime();

	  // 7.3. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
	    return opts.strict ? actual === expected : actual == expected;

	  // 7.4. For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else {
	    return objEquiv(actual, expected, opts);
	  }
	}

	function isUndefinedOrNull(value) {
	  return value === null || value === undefined;
	}

	function isBuffer (x) {
	  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
	  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
	    return false;
	  }
	  if (x.length > 0 && typeof x[0] !== 'number') return false;
	  return true;
	}

	function objEquiv(a, b, opts) {
	  var i, key;
	  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
	    return false;
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) return false;
	  //~~~I've managed to break Object.keys through screwy arguments passing.
	  //   Converting to array solves the problem.
	  if (isArguments(a)) {
	    if (!isArguments(b)) {
	      return false;
	    }
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return deepEqual(a, b, opts);
	  }
	  if (isBuffer(a)) {
	    if (!isBuffer(b)) {
	      return false;
	    }
	    if (a.length !== b.length) return false;
	    for (i = 0; i < a.length; i++) {
	      if (a[i] !== b[i]) return false;
	    }
	    return true;
	  }
	  try {
	    var ka = objectKeys(a),
	        kb = objectKeys(b);
	  } catch (e) {//happens when one is a string literal and the other isn't
	    return false;
	  }
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length != kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!deepEqual(a[key], b[key], opts)) return false;
	  }
	  return typeof a === typeof b;
	}


/***/ },
/* 23 */
/***/ function(module, exports) {

	exports = module.exports = typeof Object.keys === 'function'
	  ? Object.keys : shim;

	exports.shim = shim;
	function shim (obj) {
	  var keys = [];
	  for (var key in obj) keys.push(key);
	  return keys;
	}


/***/ },
/* 24 */
/***/ function(module, exports) {

	var supportsArgumentsClass = (function(){
	  return Object.prototype.toString.call(arguments)
	})() == '[object Arguments]';

	exports = module.exports = supportsArgumentsClass ? supported : unsupported;

	exports.supported = supported;
	function supported(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	};

	exports.unsupported = unsupported;
	function unsupported(object){
	  return object &&
	    typeof object == 'object' &&
	    typeof object.length == 'number' &&
	    Object.prototype.hasOwnProperty.call(object, 'callee') &&
	    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
	    false;
	};


/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	var hasOwn = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;

	var isArray = function isArray(arr) {
		if (typeof Array.isArray === 'function') {
			return Array.isArray(arr);
		}

		return toStr.call(arr) === '[object Array]';
	};

	var isPlainObject = function isPlainObject(obj) {
		if (!obj || toStr.call(obj) !== '[object Object]') {
			return false;
		}

		var hasOwnConstructor = hasOwn.call(obj, 'constructor');
		var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
		// Not own constructor property must be Object
		if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		var key;
		for (key in obj) {/**/}

		return typeof key === 'undefined' || hasOwn.call(obj, key);
	};

	module.exports = function extend() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0],
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
			target = {};
		}

		for (; i < length; ++i) {
			options = arguments[i];
			// Only deal with non-null/undefined values
			if (options != null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target !== copy) {
						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && isArray(src) ? src : [];
							} else {
								clone = src && isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = extend(deep, clone, copy);

						// Don't bring in undefined values
						} else if (typeof copy !== 'undefined') {
							target[name] = copy;
						}
					}
				}
			}
		}

		// Return the modified object
		return target;
	};



/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var equal = __webpack_require__(22);
	var extend = __webpack_require__(25);


	var lib = {
	  attributes: {
	    compose: function (a, b, keepNull) {
	      if (typeof a !== 'object') a = {};
	      if (typeof b !== 'object') b = {};
	      var attributes = extend(true, {}, b);
	      if (!keepNull) {
	        attributes = Object.keys(attributes).reduce(function (copy, key) {
	          if (attributes[key] != null) {
	            copy[key] = attributes[key];
	          }
	          return copy;
	        }, {});
	      }
	      for (var key in a) {
	        if (a[key] !== undefined && b[key] === undefined) {
	          attributes[key] = a[key];
	        }
	      }
	      return Object.keys(attributes).length > 0 ? attributes : undefined;
	    },

	    diff: function(a, b) {
	      if (typeof a !== 'object') a = {};
	      if (typeof b !== 'object') b = {};
	      var attributes = Object.keys(a).concat(Object.keys(b)).reduce(function (attributes, key) {
	        if (!equal(a[key], b[key])) {
	          attributes[key] = b[key] === undefined ? null : b[key];
	        }
	        return attributes;
	      }, {});
	      return Object.keys(attributes).length > 0 ? attributes : undefined;
	    },

	    transform: function (a, b, priority) {
	      if (typeof a !== 'object') return b;
	      if (typeof b !== 'object') return undefined;
	      if (!priority) return b;  // b simply overwrites us without priority
	      var attributes = Object.keys(b).reduce(function (attributes, key) {
	        if (a[key] === undefined) attributes[key] = b[key];  // null is a valid value
	        return attributes;
	      }, {});
	      return Object.keys(attributes).length > 0 ? attributes : undefined;
	    }
	  },

	  iterator: function (ops) {
	    return new Iterator(ops);
	  },

	  length: function (op) {
	    if (typeof op['delete'] === 'number') {
	      return op['delete'];
	    } else if (typeof op.retain === 'number') {
	      return op.retain;
	    } else {
	      return typeof op.insert === 'string' ? op.insert.length : 1;
	    }
	  }
	};


	function Iterator(ops) {
	  this.ops = ops;
	  this.index = 0;
	  this.offset = 0;
	};

	Iterator.prototype.hasNext = function () {
	  return this.peekLength() < Infinity;
	};

	Iterator.prototype.next = function (length) {
	  if (!length) length = Infinity;
	  var nextOp = this.ops[this.index];
	  if (nextOp) {
	    var offset = this.offset;
	    var opLength = lib.length(nextOp)
	    if (length >= opLength - offset) {
	      length = opLength - offset;
	      this.index += 1;
	      this.offset = 0;
	    } else {
	      this.offset += length;
	    }
	    if (typeof nextOp['delete'] === 'number') {
	      return { 'delete': length };
	    } else {
	      var retOp = {};
	      if (nextOp.attributes) {
	        retOp.attributes = nextOp.attributes;
	      }
	      if (typeof nextOp.retain === 'number') {
	        retOp.retain = length;
	      } else if (typeof nextOp.insert === 'string') {
	        retOp.insert = nextOp.insert.substr(offset, length);
	      } else {
	        // offset should === 0, length should === 1
	        retOp.insert = nextOp.insert;
	      }
	      return retOp;
	    }
	  } else {
	    return { retain: Infinity };
	  }
	};

	Iterator.prototype.peek = function () {
	  return this.ops[this.index];
	};

	Iterator.prototype.peekLength = function () {
	  if (this.ops[this.index]) {
	    // Should never return 0 if our index is being managed correctly
	    return lib.length(this.ops[this.index]) - this.offset;
	  } else {
	    return Infinity;
	  }
	};

	Iterator.prototype.peekType = function () {
	  if (this.ops[this.index]) {
	    if (typeof this.ops[this.index]['delete'] === 'number') {
	      return 'delete';
	    } else if (typeof this.ops[this.index].retain === 'number') {
	      return 'retain';
	    } else {
	      return 'insert';
	    }
	  }
	  return 'retain';
	};


	module.exports = lib;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _quillDelta = __webpack_require__(20);

	var _quillDelta2 = _interopRequireDefault(_quillDelta);

	var _op = __webpack_require__(26);

	var _op2 = _interopRequireDefault(_op);

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _code = __webpack_require__(28);

	var _code2 = _interopRequireDefault(_code);

	var _cursor = __webpack_require__(35);

	var _cursor2 = _interopRequireDefault(_cursor);

	var _block = __webpack_require__(29);

	var _block2 = _interopRequireDefault(_block);

	var _clone = __webpack_require__(39);

	var _clone2 = _interopRequireDefault(_clone);

	var _deepEqual = __webpack_require__(40);

	var _deepEqual2 = _interopRequireDefault(_deepEqual);

	var _extend = __webpack_require__(30);

	var _extend2 = _interopRequireDefault(_extend);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Editor = function () {
	  function Editor(scroll) {
	    _classCallCheck(this, Editor);

	    this.scroll = scroll;
	    this.delta = this.getDelta();
	  }

	  _createClass(Editor, [{
	    key: 'applyDelta',
	    value: function applyDelta(delta) {
	      var _this = this;

	      var consumeNextNewline = false;
	      this.scroll.update();
	      var scrollLength = this.scroll.length();
	      this.scroll.batch = true;
	      delta = normalizeDelta(delta);
	      delta.reduce(function (index, op) {
	        var length = op.retain || op.delete || op.insert.length || 1;
	        var attributes = op.attributes || {};
	        if (op.insert != null) {
	          if (typeof op.insert === 'string') {
	            var text = op.insert;
	            if (text.endsWith('\n') && consumeNextNewline) {
	              consumeNextNewline = false;
	              text = text.slice(0, -1);
	            }
	            if (index >= scrollLength && !text.endsWith('\n')) {
	              consumeNextNewline = true;
	            }
	            _this.scroll.insertAt(index, text);

	            var _scroll$line = _this.scroll.line(index),
	                _scroll$line2 = _slicedToArray(_scroll$line, 2),
	                line = _scroll$line2[0],
	                offset = _scroll$line2[1];

	            var formats = (0, _extend2.default)({}, (0, _block.bubbleFormats)(line));
	            if (line instanceof _block2.default) {
	              var _line$descendant = line.descendant(_parchment2.default.Leaf, offset),
	                  _line$descendant2 = _slicedToArray(_line$descendant, 1),
	                  leaf = _line$descendant2[0];

	              formats = (0, _extend2.default)(formats, (0, _block.bubbleFormats)(leaf));
	            }
	            attributes = _op2.default.attributes.diff(formats, attributes) || {};
	          } else if (_typeof(op.insert) === 'object') {
	            var key = Object.keys(op.insert)[0]; // There should only be one key
	            if (key == null) return index;
	            _this.scroll.insertAt(index, key, op.insert[key]);
	          }
	          scrollLength += length;
	        }
	        Object.keys(attributes).forEach(function (name) {
	          _this.scroll.formatAt(index, length, name, attributes[name]);
	        });
	        return index + length;
	      }, 0);
	      delta.reduce(function (index, op) {
	        if (typeof op.delete === 'number') {
	          _this.scroll.deleteAt(index, op.delete);
	          return index;
	        }
	        return index + (op.retain || op.insert.length || 1);
	      }, 0);
	      this.scroll.batch = false;
	      this.scroll.optimize();
	      return this.update(delta);
	    }
	  }, {
	    key: 'deleteText',
	    value: function deleteText(index, length) {
	      this.scroll.deleteAt(index, length);
	      return this.update(new _quillDelta2.default().retain(index).delete(length));
	    }
	  }, {
	    key: 'formatLine',
	    value: function formatLine(index, length) {
	      var _this2 = this;

	      var formats = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	      this.scroll.update();
	      Object.keys(formats).forEach(function (format) {
	        var lines = _this2.scroll.lines(index, Math.max(length, 1));
	        var lengthRemaining = length;
	        lines.forEach(function (line) {
	          var lineLength = line.length();
	          if (!(line instanceof _code2.default)) {
	            line.format(format, formats[format]);
	          } else {
	            var codeIndex = index - line.offset(_this2.scroll);
	            var codeLength = line.newlineIndex(codeIndex + lengthRemaining) - codeIndex + 1;
	            line.formatAt(codeIndex, codeLength, format, formats[format]);
	          }
	          lengthRemaining -= lineLength;
	        });
	      });
	      this.scroll.optimize();
	      return this.update(new _quillDelta2.default().retain(index).retain(length, (0, _clone2.default)(formats)));
	    }
	  }, {
	    key: 'formatText',
	    value: function formatText(index, length) {
	      var _this3 = this;

	      var formats = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	      Object.keys(formats).forEach(function (format) {
	        _this3.scroll.formatAt(index, length, format, formats[format]);
	      });
	      return this.update(new _quillDelta2.default().retain(index).retain(length, (0, _clone2.default)(formats)));
	    }
	  }, {
	    key: 'getContents',
	    value: function getContents(index, length) {
	      return this.delta.slice(index, index + length);
	    }
	  }, {
	    key: 'getDelta',
	    value: function getDelta() {
	      return this.scroll.lines().reduce(function (delta, line) {
	        return delta.concat(line.delta());
	      }, new _quillDelta2.default());
	    }
	  }, {
	    key: 'getFormat',
	    value: function getFormat(index) {
	      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	      var lines = [],
	          leaves = [];
	      if (length === 0) {
	        this.scroll.path(index).forEach(function (path) {
	          var _path = _slicedToArray(path, 1),
	              blot = _path[0];

	          if (blot instanceof _block2.default) {
	            lines.push(blot);
	          } else if (blot instanceof _parchment2.default.Leaf) {
	            leaves.push(blot);
	          }
	        });
	      } else {
	        lines = this.scroll.lines(index, length);
	        leaves = this.scroll.descendants(_parchment2.default.Leaf, index, length);
	      }
	      var formatsArr = [lines, leaves].map(function (blots) {
	        if (blots.length === 0) return {};
	        var formats = (0, _block.bubbleFormats)(blots.shift());
	        while (Object.keys(formats).length > 0) {
	          var blot = blots.shift();
	          if (blot == null) return formats;
	          formats = combineFormats((0, _block.bubbleFormats)(blot), formats);
	        }
	        return formats;
	      });
	      return _extend2.default.apply(_extend2.default, formatsArr);
	    }
	  }, {
	    key: 'getText',
	    value: function getText(index, length) {
	      return this.getContents(index, length).filter(function (op) {
	        return typeof op.insert === 'string';
	      }).map(function (op) {
	        return op.insert;
	      }).join('');
	    }
	  }, {
	    key: 'insertEmbed',
	    value: function insertEmbed(index, embed, value) {
	      this.scroll.insertAt(index, embed, value);
	      return this.update(new _quillDelta2.default().retain(index).insert(_defineProperty({}, embed, value)));
	    }
	  }, {
	    key: 'insertText',
	    value: function insertText(index, text) {
	      var _this4 = this;

	      var formats = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	      text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
	      this.scroll.insertAt(index, text);
	      Object.keys(formats).forEach(function (format) {
	        _this4.scroll.formatAt(index, text.length, format, formats[format]);
	      });
	      return this.update(new _quillDelta2.default().retain(index).insert(text, (0, _clone2.default)(formats)));
	    }
	  }, {
	    key: 'isBlank',
	    value: function isBlank() {
	      if (this.scroll.children.length == 0) return true;
	      if (this.scroll.children.length > 1) return false;
	      var child = this.scroll.children.head;
	      return child.length() <= 1 && Object.keys(child.formats()).length == 0;
	    }
	  }, {
	    key: 'removeFormat',
	    value: function removeFormat(index, length) {
	      var text = this.getText(index, length);

	      var _scroll$line3 = this.scroll.line(index + length),
	          _scroll$line4 = _slicedToArray(_scroll$line3, 2),
	          line = _scroll$line4[0],
	          offset = _scroll$line4[1];

	      var suffixLength = 0,
	          suffix = new _quillDelta2.default();
	      if (line != null) {
	        if (!(line instanceof _code2.default)) {
	          suffixLength = line.length() - offset;
	        } else {
	          suffixLength = line.newlineIndex(offset) - offset + 1;
	        }
	        suffix = line.delta().slice(offset, offset + suffixLength - 1).insert('\n');
	      }
	      var contents = this.getContents(index, length + suffixLength);
	      var diff = contents.diff(new _quillDelta2.default().insert(text).concat(suffix));
	      var delta = new _quillDelta2.default().retain(index).concat(diff);
	      return this.applyDelta(delta);
	    }
	  }, {
	    key: 'update',
	    value: function update(change) {
	      var _this5 = this;

	      var mutations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	      var cursorIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

	      var oldDelta = this.delta;
	      if (mutations.length === 1 && mutations[0].type === 'characterData' && _parchment2.default.find(mutations[0].target)) {
	        (function () {
	          // Optimization for character changes
	          var textBlot = _parchment2.default.find(mutations[0].target);
	          var formats = (0, _block.bubbleFormats)(textBlot);
	          var index = textBlot.offset(_this5.scroll);
	          var oldValue = mutations[0].oldValue.replace(_cursor2.default.CONTENTS, '');
	          var oldText = new _quillDelta2.default().insert(oldValue);
	          var newText = new _quillDelta2.default().insert(textBlot.value());
	          var diffDelta = new _quillDelta2.default().retain(index).concat(oldText.diff(newText, cursorIndex));
	          change = diffDelta.reduce(function (delta, op) {
	            if (op.insert) {
	              return delta.insert(op.insert, formats);
	            } else {
	              return delta.push(op);
	            }
	          }, new _quillDelta2.default());
	          _this5.delta = oldDelta.compose(change);
	        })();
	      } else {
	        this.delta = this.getDelta();
	        if (!change || !(0, _deepEqual2.default)(oldDelta.compose(change), this.delta)) {
	          change = oldDelta.diff(this.delta, cursorIndex);
	        }
	      }
	      return change;
	    }
	  }]);

	  return Editor;
	}();

	function combineFormats(formats, combined) {
	  return Object.keys(combined).reduce(function (merged, name) {
	    if (formats[name] == null) return merged;
	    if (combined[name] === formats[name]) {
	      merged[name] = combined[name];
	    } else if (Array.isArray(combined[name])) {
	      if (combined[name].indexOf(formats[name]) < 0) {
	        merged[name] = combined[name].concat([formats[name]]);
	      }
	    } else {
	      merged[name] = [combined[name], formats[name]];
	    }
	    return merged;
	  }, {});
	}

	function normalizeDelta(delta) {
	  return delta.reduce(function (delta, op) {
	    if (op.insert === 1) {
	      var attributes = (0, _clone2.default)(op.attributes);
	      delete attributes['image'];
	      return delta.insert({ image: op.attributes.image }, attributes);
	    }
	    if (op.attributes != null && (op.attributes.list === true || op.attributes.bullet === true)) {
	      op = (0, _clone2.default)(op);
	      if (op.attributes.list) {
	        op.attributes.list = 'ordered';
	      } else {
	        op.attributes.list = 'bullet';
	        delete op.attributes.bullet;
	      }
	    }
	    if (typeof op.insert === 'string') {
	      var text = op.insert.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
	      return delta.insert(text, op.attributes);
	    }
	    return delta.push(op);
	  }, new _quillDelta2.default());
	}

	exports.default = Editor;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.Code = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _quillDelta = __webpack_require__(20);

	var _quillDelta2 = _interopRequireDefault(_quillDelta);

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _block = __webpack_require__(29);

	var _block2 = _interopRequireDefault(_block);

	var _inline = __webpack_require__(33);

	var _inline2 = _interopRequireDefault(_inline);

	var _text = __webpack_require__(34);

	var _text2 = _interopRequireDefault(_text);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Code = function (_Inline) {
	  _inherits(Code, _Inline);

	  function Code() {
	    _classCallCheck(this, Code);

	    return _possibleConstructorReturn(this, (Code.__proto__ || Object.getPrototypeOf(Code)).apply(this, arguments));
	  }

	  return Code;
	}(_inline2.default);

	Code.blotName = 'code';
	Code.tagName = 'CODE';

	var CodeBlock = function (_Block) {
	  _inherits(CodeBlock, _Block);

	  function CodeBlock() {
	    _classCallCheck(this, CodeBlock);

	    return _possibleConstructorReturn(this, (CodeBlock.__proto__ || Object.getPrototypeOf(CodeBlock)).apply(this, arguments));
	  }

	  _createClass(CodeBlock, [{
	    key: 'delta',
	    value: function delta() {
	      var _this3 = this;

	      var text = this.domNode.textContent;
	      if (text.endsWith('\n')) {
	        // Should always be true
	        text = text.slice(0, -1);
	      }
	      return text.split('\n').reduce(function (delta, frag) {
	        return delta.insert(frag).insert('\n', _this3.formats());
	      }, new _quillDelta2.default());
	    }
	  }, {
	    key: 'format',
	    value: function format(name, value) {
	      if (name === this.statics.blotName && value) return;

	      var _descendant = this.descendant(_text2.default, this.length() - 1),
	          _descendant2 = _slicedToArray(_descendant, 1),
	          text = _descendant2[0];

	      if (text != null) {
	        text.deleteAt(text.length() - 1, 1);
	      }
	      _get(CodeBlock.prototype.__proto__ || Object.getPrototypeOf(CodeBlock.prototype), 'format', this).call(this, name, value);
	    }
	  }, {
	    key: 'formatAt',
	    value: function formatAt(index, length, name, value) {
	      if (length === 0) return;
	      if (_parchment2.default.query(name, _parchment2.default.Scope.BLOCK) == null || name === this.statics.blotName && value === this.statics.formats(this.domNode)) {
	        return;
	      }
	      var nextNewline = this.newlineIndex(index);
	      if (nextNewline < 0 || nextNewline >= index + length) return;
	      var prevNewline = this.newlineIndex(index, true) + 1;
	      var isolateLength = nextNewline - prevNewline + 1;
	      var blot = this.isolate(prevNewline, isolateLength);
	      var next = blot.next;
	      blot.format(name, value);
	      if (next instanceof CodeBlock) {
	        next.formatAt(0, index - prevNewline + length - isolateLength, name, value);
	      }
	    }
	  }, {
	    key: 'insertAt',
	    value: function insertAt(index, value, def) {
	      if (def != null) return;

	      var _descendant3 = this.descendant(_text2.default, index),
	          _descendant4 = _slicedToArray(_descendant3, 2),
	          text = _descendant4[0],
	          offset = _descendant4[1];

	      text.insertAt(offset, value);
	    }
	  }, {
	    key: 'length',
	    value: function length() {
	      var length = this.domNode.textContent.length;
	      if (!this.domNode.textContent.endsWith('\n')) {
	        return length + 1;
	      }
	      return length;
	    }
	  }, {
	    key: 'newlineIndex',
	    value: function newlineIndex(searchIndex) {
	      var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	      if (!reverse) {
	        var offset = this.domNode.textContent.slice(searchIndex).indexOf('\n');
	        return offset > -1 ? searchIndex + offset : -1;
	      } else {
	        return this.domNode.textContent.slice(0, searchIndex).lastIndexOf('\n');
	      }
	    }
	  }, {
	    key: 'optimize',
	    value: function optimize() {
	      if (!this.domNode.textContent.endsWith('\n')) {
	        this.appendChild(_parchment2.default.create('text', '\n'));
	      }
	      _get(CodeBlock.prototype.__proto__ || Object.getPrototypeOf(CodeBlock.prototype), 'optimize', this).call(this);
	      var next = this.next;
	      if (next != null && next.prev === this && next.statics.blotName === this.statics.blotName && this.statics.formats(this.domNode) === next.statics.formats(next.domNode)) {
	        next.optimize();
	        next.moveChildren(this);
	        next.remove();
	      }
	    }
	  }, {
	    key: 'replace',
	    value: function replace(target) {
	      _get(CodeBlock.prototype.__proto__ || Object.getPrototypeOf(CodeBlock.prototype), 'replace', this).call(this, target);
	      [].slice.call(this.domNode.querySelectorAll('*')).forEach(function (node) {
	        var blot = _parchment2.default.find(node);
	        if (blot == null) {
	          node.parentNode.removeChild(node);
	        } else if (blot instanceof _parchment2.default.Embed) {
	          blot.remove();
	        } else {
	          blot.unwrap();
	        }
	      });
	    }
	  }], [{
	    key: 'create',
	    value: function create(value) {
	      var domNode = _get(CodeBlock.__proto__ || Object.getPrototypeOf(CodeBlock), 'create', this).call(this, value);
	      domNode.setAttribute('spellcheck', false);
	      return domNode;
	    }
	  }, {
	    key: 'formats',
	    value: function formats() {
	      return true;
	    }
	  }]);

	  return CodeBlock;
	}(_block2.default);

	CodeBlock.blotName = 'code-block';
	CodeBlock.tagName = 'PRE';
	CodeBlock.TAB = '  ';

	exports.Code = Code;
	exports.default = CodeBlock;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.BlockEmbed = exports.bubbleFormats = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _extend = __webpack_require__(30);

	var _extend2 = _interopRequireDefault(_extend);

	var _quillDelta = __webpack_require__(20);

	var _quillDelta2 = _interopRequireDefault(_quillDelta);

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _break = __webpack_require__(31);

	var _break2 = _interopRequireDefault(_break);

	var _embed = __webpack_require__(32);

	var _embed2 = _interopRequireDefault(_embed);

	var _inline = __webpack_require__(33);

	var _inline2 = _interopRequireDefault(_inline);

	var _text = __webpack_require__(34);

	var _text2 = _interopRequireDefault(_text);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var NEWLINE_LENGTH = 1;

	var BlockEmbed = function (_Embed) {
	  _inherits(BlockEmbed, _Embed);

	  function BlockEmbed() {
	    _classCallCheck(this, BlockEmbed);

	    return _possibleConstructorReturn(this, (BlockEmbed.__proto__ || Object.getPrototypeOf(BlockEmbed)).apply(this, arguments));
	  }

	  _createClass(BlockEmbed, [{
	    key: 'attach',
	    value: function attach() {
	      _get(BlockEmbed.prototype.__proto__ || Object.getPrototypeOf(BlockEmbed.prototype), 'attach', this).call(this);
	      this.attributes = new _parchment2.default.Attributor.Store(this.domNode);
	    }
	  }, {
	    key: 'delta',
	    value: function delta() {
	      return new _quillDelta2.default().insert(this.value(), (0, _extend2.default)(this.formats(), this.attributes.values()));
	    }
	  }, {
	    key: 'format',
	    value: function format(name, value) {
	      var attribute = _parchment2.default.query(name, _parchment2.default.Scope.BLOCK_ATTRIBUTE);
	      if (attribute != null) {
	        this.attributes.attribute(attribute, value);
	      }
	    }
	  }, {
	    key: 'formatAt',
	    value: function formatAt(index, length, name, value) {
	      this.format(name, value);
	    }
	  }, {
	    key: 'insertAt',
	    value: function insertAt(index, value, def) {
	      if (typeof value === 'string' && value.endsWith('\n')) {
	        var block = _parchment2.default.create(Block.blotName);
	        this.parent.insertBefore(block, index === 0 ? this : this.next);
	        block.insertAt(0, value.slice(0, -1));
	      } else {
	        _get(BlockEmbed.prototype.__proto__ || Object.getPrototypeOf(BlockEmbed.prototype), 'insertAt', this).call(this, index, value, def);
	      }
	    }
	  }]);

	  return BlockEmbed;
	}(_embed2.default);

	BlockEmbed.scope = _parchment2.default.Scope.BLOCK_BLOT;
	// It is important for cursor behavior BlockEmbeds use tags that are block level elements


	var Block = function (_Parchment$Block) {
	  _inherits(Block, _Parchment$Block);

	  function Block(domNode) {
	    _classCallCheck(this, Block);

	    var _this2 = _possibleConstructorReturn(this, (Block.__proto__ || Object.getPrototypeOf(Block)).call(this, domNode));

	    _this2.cache = {};
	    return _this2;
	  }

	  _createClass(Block, [{
	    key: 'delta',
	    value: function delta() {
	      if (this.cache.delta == null) {
	        this.cache.delta = this.descendants(_parchment2.default.Leaf).reduce(function (delta, leaf) {
	          if (leaf.length() === 0) {
	            return delta;
	          } else {
	            return delta.insert(leaf.value(), bubbleFormats(leaf));
	          }
	        }, new _quillDelta2.default()).insert('\n', bubbleFormats(this));
	      }
	      return this.cache.delta;
	    }
	  }, {
	    key: 'deleteAt',
	    value: function deleteAt(index, length) {
	      _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'deleteAt', this).call(this, index, length);
	      this.cache = {};
	    }
	  }, {
	    key: 'formatAt',
	    value: function formatAt(index, length, name, value) {
	      if (length <= 0) return;
	      if (_parchment2.default.query(name, _parchment2.default.Scope.BLOCK)) {
	        if (index + length === this.length()) {
	          this.format(name, value);
	        }
	      } else {
	        _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'formatAt', this).call(this, index, Math.min(length, this.length() - index - 1), name, value);
	      }
	      this.cache = {};
	    }
	  }, {
	    key: 'insertAt',
	    value: function insertAt(index, value, def) {
	      if (def != null) return _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'insertAt', this).call(this, index, value, def);
	      if (value.length === 0) return;
	      var lines = value.split('\n');
	      var text = lines.shift();
	      if (text.length > 0) {
	        if (index < this.length() - 1 || this.children.tail == null) {
	          _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'insertAt', this).call(this, Math.min(index, this.length() - 1), text);
	        } else {
	          this.children.tail.insertAt(this.children.tail.length(), text);
	        }
	        this.cache = {};
	      }
	      var block = this;
	      lines.reduce(function (index, line) {
	        block = block.split(index, true);
	        block.insertAt(0, line);
	        return line.length;
	      }, index + text.length);
	    }
	  }, {
	    key: 'insertBefore',
	    value: function insertBefore(blot, ref) {
	      var head = this.children.head;
	      _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'insertBefore', this).call(this, blot, ref);
	      if (head instanceof _break2.default) {
	        head.remove();
	      }
	      this.cache = {};
	    }
	  }, {
	    key: 'length',
	    value: function length() {
	      if (this.cache.length == null) {
	        this.cache.length = _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'length', this).call(this) + NEWLINE_LENGTH;
	      }
	      return this.cache.length;
	    }
	  }, {
	    key: 'moveChildren',
	    value: function moveChildren(target, ref) {
	      _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'moveChildren', this).call(this, target, ref);
	      this.cache = {};
	    }
	  }, {
	    key: 'optimize',
	    value: function optimize() {
	      _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'optimize', this).call(this);
	      this.cache = {};
	    }
	  }, {
	    key: 'path',
	    value: function path(index) {
	      return _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'path', this).call(this, index, true);
	    }
	  }, {
	    key: 'removeChild',
	    value: function removeChild(child) {
	      _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'removeChild', this).call(this, child);
	      this.cache = {};
	    }
	  }, {
	    key: 'split',
	    value: function split(index) {
	      var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	      if (force && (index === 0 || index >= this.length() - NEWLINE_LENGTH)) {
	        var clone = this.clone();
	        if (index === 0) {
	          this.parent.insertBefore(clone, this);
	          return this;
	        } else {
	          this.parent.insertBefore(clone, this.next);
	          return clone;
	        }
	      } else {
	        var next = _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'split', this).call(this, index, force);
	        this.cache = {};
	        return next;
	      }
	    }
	  }]);

	  return Block;
	}(_parchment2.default.Block);

	Block.blotName = 'block';
	Block.tagName = 'P';
	Block.defaultChild = 'break';
	Block.allowedChildren = [_inline2.default, _embed2.default, _text2.default];

	function bubbleFormats(blot) {
	  var formats = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  if (blot == null) return formats;
	  if (typeof blot.formats === 'function') {
	    formats = (0, _extend2.default)(formats, blot.formats());
	  }
	  if (blot.parent == null || blot.parent.blotName == 'scroll' || blot.parent.statics.scope !== blot.statics.scope) {
	    return formats;
	  }
	  return bubbleFormats(blot.parent, formats);
	}

	exports.bubbleFormats = bubbleFormats;
	exports.BlockEmbed = BlockEmbed;
	exports.default = Block;

/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';

	var hasOwn = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;

	var isArray = function isArray(arr) {
		if (typeof Array.isArray === 'function') {
			return Array.isArray(arr);
		}

		return toStr.call(arr) === '[object Array]';
	};

	var isPlainObject = function isPlainObject(obj) {
		if (!obj || toStr.call(obj) !== '[object Object]') {
			return false;
		}

		var hasOwnConstructor = hasOwn.call(obj, 'constructor');
		var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
		// Not own constructor property must be Object
		if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		var key;
		for (key in obj) {/**/}

		return typeof key === 'undefined' || hasOwn.call(obj, key);
	};

	module.exports = function extend() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0],
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
			target = {};
		}

		for (; i < length; ++i) {
			options = arguments[i];
			// Only deal with non-null/undefined values
			if (options != null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target !== copy) {
						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && isArray(src) ? src : [];
							} else {
								clone = src && isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = extend(deep, clone, copy);

						// Don't bring in undefined values
						} else if (typeof copy !== 'undefined') {
							target[name] = copy;
						}
					}
				}
			}
		}

		// Return the modified object
		return target;
	};



/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _embed = __webpack_require__(32);

	var _embed2 = _interopRequireDefault(_embed);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Break = function (_Embed) {
	  _inherits(Break, _Embed);

	  function Break() {
	    _classCallCheck(this, Break);

	    return _possibleConstructorReturn(this, (Break.__proto__ || Object.getPrototypeOf(Break)).apply(this, arguments));
	  }

	  _createClass(Break, [{
	    key: 'insertInto',
	    value: function insertInto(parent, ref) {
	      if (parent.children.length === 0) {
	        _get(Break.prototype.__proto__ || Object.getPrototypeOf(Break.prototype), 'insertInto', this).call(this, parent, ref);
	      } else {
	        this.remove();
	      }
	    }
	  }, {
	    key: 'length',
	    value: function length() {
	      return 0;
	    }
	  }, {
	    key: 'value',
	    value: function value() {
	      return '';
	    }
	  }], [{
	    key: 'value',
	    value: function value() {
	      return undefined;
	    }
	  }]);

	  return Break;
	}(_embed2.default);

	Break.blotName = 'break';
	Break.tagName = 'BR';

	exports.default = Break;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Embed = function (_Parchment$Embed) {
	  _inherits(Embed, _Parchment$Embed);

	  function Embed() {
	    _classCallCheck(this, Embed);

	    return _possibleConstructorReturn(this, (Embed.__proto__ || Object.getPrototypeOf(Embed)).apply(this, arguments));
	  }

	  return Embed;
	}(_parchment2.default.Embed);

	exports.default = Embed;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _embed = __webpack_require__(32);

	var _embed2 = _interopRequireDefault(_embed);

	var _text = __webpack_require__(34);

	var _text2 = _interopRequireDefault(_text);

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Inline = function (_Parchment$Inline) {
	  _inherits(Inline, _Parchment$Inline);

	  function Inline() {
	    _classCallCheck(this, Inline);

	    return _possibleConstructorReturn(this, (Inline.__proto__ || Object.getPrototypeOf(Inline)).apply(this, arguments));
	  }

	  _createClass(Inline, [{
	    key: 'formatAt',
	    value: function formatAt(index, length, name, value) {
	      if (Inline.compare(this.statics.blotName, name) < 0 && _parchment2.default.query(name, _parchment2.default.Scope.BLOT)) {
	        var blot = this.isolate(index, length);
	        if (value) {
	          blot.wrap(name, value);
	        }
	      } else {
	        _get(Inline.prototype.__proto__ || Object.getPrototypeOf(Inline.prototype), 'formatAt', this).call(this, index, length, name, value);
	      }
	    }
	  }, {
	    key: 'optimize',
	    value: function optimize() {
	      _get(Inline.prototype.__proto__ || Object.getPrototypeOf(Inline.prototype), 'optimize', this).call(this);
	      if (this.parent instanceof Inline && Inline.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
	        var parent = this.parent.isolate(this.offset(), this.length());
	        this.moveChildren(parent);
	        parent.wrap(this);
	      }
	    }
	  }], [{
	    key: 'compare',
	    value: function compare(self, other) {
	      var selfIndex = Inline.order.indexOf(self);
	      var otherIndex = Inline.order.indexOf(other);
	      if (selfIndex >= 0 || otherIndex >= 0) {
	        return selfIndex - otherIndex;
	      } else if (self === other) {
	        return 0;
	      } else if (self < other) {
	        return -1;
	      } else {
	        return 1;
	      }
	    }
	  }]);

	  return Inline;
	}(_parchment2.default.Inline);

	Inline.allowedChildren = [Inline, _embed2.default, _text2.default];
	// Lower index means deeper in the DOM tree, since not found (-1) is for embeds
	Inline.order = ['cursor', 'inline', // Must be lower
	'code', 'underline', 'strike', 'italic', 'bold', 'script', 'link' // Must be higher
	];

	exports.default = Inline;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TextBlot = function (_Parchment$Text) {
	  _inherits(TextBlot, _Parchment$Text);

	  function TextBlot() {
	    _classCallCheck(this, TextBlot);

	    return _possibleConstructorReturn(this, (TextBlot.__proto__ || Object.getPrototypeOf(TextBlot)).apply(this, arguments));
	  }

	  return TextBlot;
	}(_parchment2.default.Text);

	exports.default = TextBlot;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _embed = __webpack_require__(32);

	var _embed2 = _interopRequireDefault(_embed);

	var _text = __webpack_require__(34);

	var _text2 = _interopRequireDefault(_text);

	var _emitter = __webpack_require__(36);

	var _emitter2 = _interopRequireDefault(_emitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Cursor = function (_Embed) {
	  _inherits(Cursor, _Embed);

	  _createClass(Cursor, null, [{
	    key: 'value',
	    value: function value() {
	      return undefined;
	    }
	  }]);

	  function Cursor(domNode, selection) {
	    _classCallCheck(this, Cursor);

	    var _this = _possibleConstructorReturn(this, (Cursor.__proto__ || Object.getPrototypeOf(Cursor)).call(this, domNode));

	    _this.selection = selection;
	    _this.textNode = document.createTextNode(Cursor.CONTENTS);
	    _this.domNode.appendChild(_this.textNode);
	    _this._length = 0;
	    return _this;
	  }

	  _createClass(Cursor, [{
	    key: 'detach',
	    value: function detach() {
	      // super.detach() will also clear domNode.__blot
	      if (this.parent != null) this.parent.removeChild(this);
	    }
	  }, {
	    key: 'format',
	    value: function format(name, value) {
	      if (this._length !== 0) {
	        return _get(Cursor.prototype.__proto__ || Object.getPrototypeOf(Cursor.prototype), 'format', this).call(this, name, value);
	      }
	      var target = this,
	          index = 0;
	      while (target != null && target.statics.scope !== _parchment2.default.Scope.BLOCK_BLOT) {
	        index += target.offset(target.parent);
	        target = target.parent;
	      }
	      if (target != null) {
	        this._length = Cursor.CONTENTS.length;
	        target.optimize();
	        target.formatAt(index, Cursor.CONTENTS.length, name, value);
	        this._length = 0;
	      }
	    }
	  }, {
	    key: 'index',
	    value: function index(node, offset) {
	      if (node === this.textNode) return 0;
	      return _get(Cursor.prototype.__proto__ || Object.getPrototypeOf(Cursor.prototype), 'index', this).call(this, node, offset);
	    }
	  }, {
	    key: 'length',
	    value: function length() {
	      return this._length;
	    }
	  }, {
	    key: 'position',
	    value: function position() {
	      return [this.textNode, this.textNode.data.length];
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      _get(Cursor.prototype.__proto__ || Object.getPrototypeOf(Cursor.prototype), 'remove', this).call(this);
	      this.parent = null;
	    }
	  }, {
	    key: 'restore',
	    value: function restore() {
	      var _this2 = this;

	      if (this.selection.composing) return;
	      if (this.parent == null) return;
	      var textNode = this.textNode;
	      var range = this.selection.getNativeRange();
	      var restoreText = void 0,
	          start = void 0,
	          end = void 0;
	      if (range != null && range.start.node === textNode && range.end.node === textNode) {
	        var _ref = [textNode, range.start.offset, range.end.offset];
	        restoreText = _ref[0];
	        start = _ref[1];
	        end = _ref[2];
	      }
	      // Link format will insert text outside of anchor tag
	      while (this.domNode.lastChild != null && this.domNode.lastChild !== this.textNode) {
	        this.domNode.parentNode.insertBefore(this.domNode.lastChild, this.domNode);
	      }
	      if (this.textNode.data !== Cursor.CONTENTS) {
	        var text = this.textNode.data.split(Cursor.CONTENTS).join('');
	        if (this.next instanceof _text2.default) {
	          restoreText = this.next.domNode;
	          this.next.insertAt(0, text);
	          this.textNode.data = Cursor.CONTENTS;
	        } else {
	          this.textNode.data = text;
	          this.parent.insertBefore(_parchment2.default.create(this.textNode), this);
	          this.textNode = document.createTextNode(Cursor.CONTENTS);
	          this.domNode.appendChild(this.textNode);
	        }
	      }
	      this.remove();
	      if (start == null) return;
	      this.selection.emitter.once(_emitter2.default.events.SCROLL_OPTIMIZE, function () {
	        var _map = [start, end].map(function (offset) {
	          return Math.max(0, Math.min(restoreText.data.length, offset - 1));
	        });

	        var _map2 = _slicedToArray(_map, 2);

	        start = _map2[0];
	        end = _map2[1];

	        _this2.selection.setNativeRange(restoreText, start, restoreText, end);
	      });
	    }
	  }, {
	    key: 'update',
	    value: function update(mutations) {
	      var _this3 = this;

	      mutations.forEach(function (mutation) {
	        if (mutation.type === 'characterData' && mutation.target === _this3.textNode) {
	          _this3.restore();
	        }
	      });
	    }
	  }, {
	    key: 'value',
	    value: function value() {
	      return '';
	    }
	  }]);

	  return Cursor;
	}(_embed2.default);

	Cursor.blotName = 'cursor';
	Cursor.className = 'ql-cursor';
	Cursor.tagName = 'span';
	Cursor.CONTENTS = '\uFEFF'; // Zero width no break space


	exports.default = Cursor;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _eventemitter = __webpack_require__(37);

	var _eventemitter2 = _interopRequireDefault(_eventemitter);

	var _logger = __webpack_require__(38);

	var _logger2 = _interopRequireDefault(_logger);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var debug = (0, _logger2.default)('quill:events');

	var Emitter = function (_EventEmitter) {
	  _inherits(Emitter, _EventEmitter);

	  function Emitter() {
	    _classCallCheck(this, Emitter);

	    var _this = _possibleConstructorReturn(this, (Emitter.__proto__ || Object.getPrototypeOf(Emitter)).call(this));

	    _this.on('error', debug.error);
	    return _this;
	  }

	  _createClass(Emitter, [{
	    key: 'emit',
	    value: function emit() {
	      debug.log.apply(debug, arguments);
	      _get(Emitter.prototype.__proto__ || Object.getPrototypeOf(Emitter.prototype), 'emit', this).apply(this, arguments);
	    }
	  }]);

	  return Emitter;
	}(_eventemitter2.default);

	Emitter.events = {
	  EDITOR_CHANGE: 'editor-change',
	  SCROLL_BEFORE_UPDATE: 'scroll-before-update',
	  SCROLL_OPTIMIZE: 'scroll-optimize',
	  SCROLL_UPDATE: 'scroll-update',
	  SELECTION_CHANGE: 'selection-change',
	  TEXT_CHANGE: 'text-change'
	};
	Emitter.sources = {
	  API: 'api',
	  SILENT: 'silent',
	  USER: 'user'
	};

	exports.default = Emitter;

/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict';

	var has = Object.prototype.hasOwnProperty
	  , prefix = '~';

	/**
	 * Constructor to create a storage for our `EE` objects.
	 * An `Events` instance is a plain object whose properties are event names.
	 *
	 * @constructor
	 * @api private
	 */
	function Events() {}

	//
	// We try to not inherit from `Object.prototype`. In some engines creating an
	// instance in this way is faster than calling `Object.create(null)` directly.
	// If `Object.create(null)` is not supported we prefix the event names with a
	// character to make sure that the built-in object properties are not
	// overridden or used as an attack vector.
	//
	if (Object.create) {
	  Events.prototype = Object.create(null);

	  //
	  // This hack is needed because the `__proto__` property is still inherited in
	  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
	  //
	  if (!new Events().__proto__) prefix = false;
	}

	/**
	 * Representation of a single event listener.
	 *
	 * @param {Function} fn The listener function.
	 * @param {Mixed} context The context to invoke the listener with.
	 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
	 * @constructor
	 * @api private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}

	/**
	 * Minimal `EventEmitter` interface that is molded against the Node.js
	 * `EventEmitter` interface.
	 *
	 * @constructor
	 * @api public
	 */
	function EventEmitter() {
	  this._events = new Events();
	  this._eventsCount = 0;
	}

	/**
	 * Return an array listing the events for which the emitter has registered
	 * listeners.
	 *
	 * @returns {Array}
	 * @api public
	 */
	EventEmitter.prototype.eventNames = function eventNames() {
	  var names = []
	    , events
	    , name;

	  if (this._eventsCount === 0) return names;

	  for (name in (events = this._events)) {
	    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
	  }

	  if (Object.getOwnPropertySymbols) {
	    return names.concat(Object.getOwnPropertySymbols(events));
	  }

	  return names;
	};

	/**
	 * Return the listeners registered for a given event.
	 *
	 * @param {String|Symbol} event The event name.
	 * @param {Boolean} exists Only check if there are listeners.
	 * @returns {Array|Boolean}
	 * @api public
	 */
	EventEmitter.prototype.listeners = function listeners(event, exists) {
	  var evt = prefix ? prefix + event : event
	    , available = this._events[evt];

	  if (exists) return !!available;
	  if (!available) return [];
	  if (available.fn) return [available.fn];

	  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
	    ee[i] = available[i].fn;
	  }

	  return ee;
	};

	/**
	 * Calls each of the listeners registered for a given event.
	 *
	 * @param {String|Symbol} event The event name.
	 * @returns {Boolean} `true` if the event had listeners, else `false`.
	 * @api public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  var evt = prefix ? prefix + event : event;

	  if (!this._events[evt]) return false;

	  var listeners = this._events[evt]
	    , len = arguments.length
	    , args
	    , i;

	  if (listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

	    switch (len) {
	      case 1: return listeners.fn.call(listeners.context), true;
	      case 2: return listeners.fn.call(listeners.context, a1), true;
	      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }

	    for (i = 1, args = new Array(len -1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }

	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length
	      , j;

	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

	      switch (len) {
	        case 1: listeners[i].fn.call(listeners[i].context); break;
	        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
	        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
	        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
	        default:
	          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }

	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }

	  return true;
	};

	/**
	 * Add a listener for a given event.
	 *
	 * @param {String|Symbol} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {Mixed} [context=this] The context to invoke the listener with.
	 * @returns {EventEmitter} `this`.
	 * @api public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  var listener = new EE(fn, context || this)
	    , evt = prefix ? prefix + event : event;

	  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
	  else if (!this._events[evt].fn) this._events[evt].push(listener);
	  else this._events[evt] = [this._events[evt], listener];

	  return this;
	};

	/**
	 * Add a one-time listener for a given event.
	 *
	 * @param {String|Symbol} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {Mixed} [context=this] The context to invoke the listener with.
	 * @returns {EventEmitter} `this`.
	 * @api public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  var listener = new EE(fn, context || this, true)
	    , evt = prefix ? prefix + event : event;

	  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
	  else if (!this._events[evt].fn) this._events[evt].push(listener);
	  else this._events[evt] = [this._events[evt], listener];

	  return this;
	};

	/**
	 * Remove the listeners of a given event.
	 *
	 * @param {String|Symbol} event The event name.
	 * @param {Function} fn Only remove the listeners that match this function.
	 * @param {Mixed} context Only remove the listeners that have this context.
	 * @param {Boolean} once Only remove one-time listeners.
	 * @returns {EventEmitter} `this`.
	 * @api public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
	  var evt = prefix ? prefix + event : event;

	  if (!this._events[evt]) return this;
	  if (!fn) {
	    if (--this._eventsCount === 0) this._events = new Events();
	    else delete this._events[evt];
	    return this;
	  }

	  var listeners = this._events[evt];

	  if (listeners.fn) {
	    if (
	         listeners.fn === fn
	      && (!once || listeners.once)
	      && (!context || listeners.context === context)
	    ) {
	      if (--this._eventsCount === 0) this._events = new Events();
	      else delete this._events[evt];
	    }
	  } else {
	    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
	      if (
	           listeners[i].fn !== fn
	        || (once && !listeners[i].once)
	        || (context && listeners[i].context !== context)
	      ) {
	        events.push(listeners[i]);
	      }
	    }

	    //
	    // Reset the array, or remove it completely if we have no more listeners.
	    //
	    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
	    else if (--this._eventsCount === 0) this._events = new Events();
	    else delete this._events[evt];
	  }

	  return this;
	};

	/**
	 * Remove all listeners, or those of the specified event.
	 *
	 * @param {String|Symbol} [event] The event name.
	 * @returns {EventEmitter} `this`.
	 * @api public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  var evt;

	  if (event) {
	    evt = prefix ? prefix + event : event;
	    if (this._events[evt]) {
	      if (--this._eventsCount === 0) this._events = new Events();
	      else delete this._events[evt];
	    }
	  } else {
	    this._events = new Events();
	    this._eventsCount = 0;
	  }

	  return this;
	};

	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	//
	// This function doesn't apply anymore.
	//
	EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
	  return this;
	};

	//
	// Expose the prefix.
	//
	EventEmitter.prefixed = prefix;

	//
	// Allow `EventEmitter` to be imported as module namespace.
	//
	EventEmitter.EventEmitter = EventEmitter;

	//
	// Expose the module.
	//
	if ('undefined' !== typeof module) {
	  module.exports = EventEmitter;
	}


/***/ },
/* 38 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var levels = ['error', 'warn', 'log', 'info'];
	var level = 'warn';

	function debug(method) {
	  if (levels.indexOf(method) <= levels.indexOf(level)) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    console[method].apply(console, args); // eslint-disable-line no-console
	  }
	}

	function namespace(ns) {
	  return levels.reduce(function (logger, method) {
	    logger[method] = debug.bind(console, method, ns);
	    return logger;
	  }, {});
	}

	debug.level = namespace.level = function (newLevel) {
	  level = newLevel;
	};

	exports.default = namespace;

/***/ },
/* 39 */
/***/ function(module, exports) {

	var clone = (function() {
	'use strict';

	var nativeMap;
	try {
	  nativeMap = Map;
	} catch(_) {
	  // maybe a reference error because no `Map`. Give it a dummy value that no
	  // value will ever be an instanceof.
	  nativeMap = function() {};
	}

	var nativeSet;
	try {
	  nativeSet = Set;
	} catch(_) {
	  nativeSet = function() {};
	}

	var nativePromise;
	try {
	  nativePromise = Promise;
	} catch(_) {
	  nativePromise = function() {};
	}

	/**
	 * Clones (copies) an Object using deep copying.
	 *
	 * This function supports circular references by default, but if you are certain
	 * there are no circular references in your object, you can save some CPU time
	 * by calling clone(obj, false).
	 *
	 * Caution: if `circular` is false and `parent` contains circular references,
	 * your program may enter an infinite loop and crash.
	 *
	 * @param `parent` - the object to be cloned
	 * @param `circular` - set to true if the object to be cloned may contain
	 *    circular references. (optional - true by default)
	 * @param `depth` - set to a number if the object is only to be cloned to
	 *    a particular depth. (optional - defaults to Infinity)
	 * @param `prototype` - sets the prototype to be used when cloning an object.
	 *    (optional - defaults to parent prototype).
	*/
	function clone(parent, circular, depth, prototype) {
	  var filter;
	  if (typeof circular === 'object') {
	    depth = circular.depth;
	    prototype = circular.prototype;
	    filter = circular.filter;
	    circular = circular.circular;
	  }
	  // maintain two arrays for circular references, where corresponding parents
	  // and children have the same index
	  var allParents = [];
	  var allChildren = [];

	  var useBuffer = typeof Buffer != 'undefined';

	  if (typeof circular == 'undefined')
	    circular = true;

	  if (typeof depth == 'undefined')
	    depth = Infinity;

	  // recurse this function so we don't reset allParents and allChildren
	  function _clone(parent, depth) {
	    // cloning null always returns null
	    if (parent === null)
	      return null;

	    if (depth === 0)
	      return parent;

	    var child;
	    var proto;
	    if (typeof parent != 'object') {
	      return parent;
	    }

	    if (parent instanceof nativeMap) {
	      child = new nativeMap();
	    } else if (parent instanceof nativeSet) {
	      child = new nativeSet();
	    } else if (parent instanceof nativePromise) {
	      child = new nativePromise(function (resolve, reject) {
	        parent.then(function(value) {
	          resolve(_clone(value, depth - 1));
	        }, function(err) {
	          reject(_clone(err, depth - 1));
	        });
	      });
	    } else if (clone.__isArray(parent)) {
	      child = [];
	    } else if (clone.__isRegExp(parent)) {
	      child = new RegExp(parent.source, __getRegExpFlags(parent));
	      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
	    } else if (clone.__isDate(parent)) {
	      child = new Date(parent.getTime());
	    } else if (useBuffer && Buffer.isBuffer(parent)) {
	      child = new Buffer(parent.length);
	      parent.copy(child);
	      return child;
	    } else {
	      if (typeof prototype == 'undefined') {
	        proto = Object.getPrototypeOf(parent);
	        child = Object.create(proto);
	      }
	      else {
	        child = Object.create(prototype);
	        proto = prototype;
	      }
	    }

	    if (circular) {
	      var index = allParents.indexOf(parent);

	      if (index != -1) {
	        return allChildren[index];
	      }
	      allParents.push(parent);
	      allChildren.push(child);
	    }

	    if (parent instanceof nativeMap) {
	      var keyIterator = parent.keys();
	      while(true) {
	        var next = keyIterator.next();
	        if (next.done) {
	          break;
	        }
	        var keyChild = _clone(next.value, depth - 1);
	        var valueChild = _clone(parent.get(next.value), depth - 1);
	        child.set(keyChild, valueChild);
	      }
	    }
	    if (parent instanceof nativeSet) {
	      var iterator = parent.keys();
	      while(true) {
	        var next = iterator.next();
	        if (next.done) {
	          break;
	        }
	        var entryChild = _clone(next.value, depth - 1);
	        child.add(entryChild);
	      }
	    }

	    for (var i in parent) {
	      var attrs;
	      if (proto) {
	        attrs = Object.getOwnPropertyDescriptor(proto, i);
	      }

	      if (attrs && attrs.set == null) {
	        continue;
	      }
	      child[i] = _clone(parent[i], depth - 1);
	    }

	    if (Object.getOwnPropertySymbols) {
	      var symbols = Object.getOwnPropertySymbols(parent);
	      for (var i = 0; i < symbols.length; i++) {
	        // Don't need to worry about cloning a symbol because it is a primitive,
	        // like a number or string.
	        var symbol = symbols[i];
	        child[symbol] = _clone(parent[symbol], depth - 1);
	      }
	    }

	    return child;
	  }

	  return _clone(parent, depth);
	}

	/**
	 * Simple flat clone using prototype, accepts only objects, usefull for property
	 * override on FLAT configuration object (no nested props).
	 *
	 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
	 * works.
	 */
	clone.clonePrototype = function clonePrototype(parent) {
	  if (parent === null)
	    return null;

	  var c = function () {};
	  c.prototype = parent;
	  return new c();
	};

	// private utility functions

	function __objToStr(o) {
	  return Object.prototype.toString.call(o);
	}
	clone.__objToStr = __objToStr;

	function __isDate(o) {
	  return typeof o === 'object' && __objToStr(o) === '[object Date]';
	}
	clone.__isDate = __isDate;

	function __isArray(o) {
	  return typeof o === 'object' && __objToStr(o) === '[object Array]';
	}
	clone.__isArray = __isArray;

	function __isRegExp(o) {
	  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
	}
	clone.__isRegExp = __isRegExp;

	function __getRegExpFlags(re) {
	  var flags = '';
	  if (re.global) flags += 'g';
	  if (re.ignoreCase) flags += 'i';
	  if (re.multiline) flags += 'm';
	  return flags;
	}
	clone.__getRegExpFlags = __getRegExpFlags;

	return clone;
	})();

	if (typeof module === 'object' && module.exports) {
	  module.exports = clone;
	}


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var pSlice = Array.prototype.slice;
	var objectKeys = __webpack_require__(41);
	var isArguments = __webpack_require__(42);

	var deepEqual = module.exports = function (actual, expected, opts) {
	  if (!opts) opts = {};
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;

	  } else if (actual instanceof Date && expected instanceof Date) {
	    return actual.getTime() === expected.getTime();

	  // 7.3. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
	    return opts.strict ? actual === expected : actual == expected;

	  // 7.4. For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else {
	    return objEquiv(actual, expected, opts);
	  }
	}

	function isUndefinedOrNull(value) {
	  return value === null || value === undefined;
	}

	function isBuffer (x) {
	  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
	  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
	    return false;
	  }
	  if (x.length > 0 && typeof x[0] !== 'number') return false;
	  return true;
	}

	function objEquiv(a, b, opts) {
	  var i, key;
	  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
	    return false;
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) return false;
	  //~~~I've managed to break Object.keys through screwy arguments passing.
	  //   Converting to array solves the problem.
	  if (isArguments(a)) {
	    if (!isArguments(b)) {
	      return false;
	    }
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return deepEqual(a, b, opts);
	  }
	  if (isBuffer(a)) {
	    if (!isBuffer(b)) {
	      return false;
	    }
	    if (a.length !== b.length) return false;
	    for (i = 0; i < a.length; i++) {
	      if (a[i] !== b[i]) return false;
	    }
	    return true;
	  }
	  try {
	    var ka = objectKeys(a),
	        kb = objectKeys(b);
	  } catch (e) {//happens when one is a string literal and the other isn't
	    return false;
	  }
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length != kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!deepEqual(a[key], b[key], opts)) return false;
	  }
	  return typeof a === typeof b;
	}


/***/ },
/* 41 */
/***/ function(module, exports) {

	exports = module.exports = typeof Object.keys === 'function'
	  ? Object.keys : shim;

	exports.shim = shim;
	function shim (obj) {
	  var keys = [];
	  for (var key in obj) keys.push(key);
	  return keys;
	}


/***/ },
/* 42 */
/***/ function(module, exports) {

	var supportsArgumentsClass = (function(){
	  return Object.prototype.toString.call(arguments)
	})() == '[object Arguments]';

	exports = module.exports = supportsArgumentsClass ? supported : unsupported;

	exports.supported = supported;
	function supported(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	};

	exports.unsupported = unsupported;
	function unsupported(object){
	  return object &&
	    typeof object == 'object' &&
	    typeof object.length == 'number' &&
	    Object.prototype.hasOwnProperty.call(object, 'callee') &&
	    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
	    false;
	};


/***/ },
/* 43 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Module = function Module(quill) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  _classCallCheck(this, Module);

	  this.quill = quill;
	  this.options = options;
	};

	Module.DEFAULTS = {};

	exports.default = Module;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.Range = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _clone = __webpack_require__(39);

	var _clone2 = _interopRequireDefault(_clone);

	var _deepEqual = __webpack_require__(40);

	var _deepEqual2 = _interopRequireDefault(_deepEqual);

	var _emitter3 = __webpack_require__(36);

	var _emitter4 = _interopRequireDefault(_emitter3);

	var _logger = __webpack_require__(38);

	var _logger2 = _interopRequireDefault(_logger);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var debug = (0, _logger2.default)('quill:selection');

	var Range = function Range(index) {
	  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	  _classCallCheck(this, Range);

	  this.index = index;
	  this.length = length;
	};

	var Selection = function () {
	  function Selection(scroll, emitter) {
	    var _this = this;

	    _classCallCheck(this, Selection);

	    this.emitter = emitter;
	    this.scroll = scroll;
	    this.composing = false;
	    this.root = this.scroll.domNode;
	    this.root.addEventListener('compositionstart', function () {
	      _this.composing = true;
	    });
	    this.root.addEventListener('compositionend', function () {
	      _this.composing = false;
	    });
	    this.cursor = _parchment2.default.create('cursor', this);
	    // savedRange is last non-null range
	    this.lastRange = this.savedRange = new Range(0, 0);
	    ['keyup', 'mouseup', 'mouseleave', 'touchend', 'touchleave', 'focus', 'blur'].forEach(function (eventName) {
	      _this.root.addEventListener(eventName, function () {
	        // When range used to be a selection and user click within the selection,
	        // the range now being a cursor has not updated yet without setTimeout
	        setTimeout(_this.update.bind(_this, _emitter4.default.sources.USER), 100);
	      });
	    });
	    this.emitter.on(_emitter4.default.events.EDITOR_CHANGE, function (type, delta) {
	      if (type === _emitter4.default.events.TEXT_CHANGE && delta.length() > 0) {
	        _this.update(_emitter4.default.sources.SILENT);
	      }
	    });
	    this.emitter.on(_emitter4.default.events.SCROLL_BEFORE_UPDATE, function () {
	      var native = _this.getNativeRange();
	      if (native == null) return;
	      if (native.start.node === _this.cursor.textNode) return; // cursor.restore() will handle
	      // TODO unclear if this has negative side effects
	      _this.emitter.once(_emitter4.default.events.SCROLL_UPDATE, function () {
	        try {
	          _this.setNativeRange(native.start.node, native.start.offset, native.end.node, native.end.offset);
	        } catch (ignored) {}
	      });
	    });
	    this.update(_emitter4.default.sources.SILENT);
	  }

	  _createClass(Selection, [{
	    key: 'focus',
	    value: function focus() {
	      if (this.hasFocus()) return;
	      var bodyTop = document.body.scrollTop;
	      this.root.focus();
	      document.body.scrollTop = bodyTop;
	      this.setRange(this.savedRange);
	    }
	  }, {
	    key: 'format',
	    value: function format(_format, value) {
	      this.scroll.update();
	      var nativeRange = this.getNativeRange();
	      if (nativeRange == null || !nativeRange.native.collapsed || _parchment2.default.query(_format, _parchment2.default.Scope.BLOCK)) return;
	      if (nativeRange.start.node !== this.cursor.textNode) {
	        var blot = _parchment2.default.find(nativeRange.start.node, false);
	        if (blot == null) return;
	        // TODO Give blot ability to not split
	        if (blot instanceof _parchment2.default.Leaf) {
	          var after = blot.split(nativeRange.start.offset);
	          blot.parent.insertBefore(this.cursor, after);
	        } else {
	          blot.insertBefore(this.cursor, nativeRange.start.node); // Should never happen
	        }
	        this.cursor.attach();
	      }
	      this.cursor.format(_format, value);
	      this.scroll.optimize();
	      this.setNativeRange(this.cursor.textNode, this.cursor.textNode.data.length);
	      this.update();
	    }
	  }, {
	    key: 'getBounds',
	    value: function getBounds(index) {
	      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	      var scrollLength = this.scroll.length();
	      index = Math.min(index, scrollLength - 1);
	      length = Math.min(index + length, scrollLength - 1) - index;
	      var bounds = void 0,
	          node = void 0,
	          _scroll$leaf = this.scroll.leaf(index),
	          _scroll$leaf2 = _slicedToArray(_scroll$leaf, 2),
	          leaf = _scroll$leaf2[0],
	          offset = _scroll$leaf2[1];
	      if (leaf == null) return null;

	      var _leaf$position = leaf.position(offset, true);

	      var _leaf$position2 = _slicedToArray(_leaf$position, 2);

	      node = _leaf$position2[0];
	      offset = _leaf$position2[1];

	      var range = document.createRange();
	      if (length > 0) {
	        range.setStart(node, offset);

	        var _scroll$leaf3 = this.scroll.leaf(index + length);

	        var _scroll$leaf4 = _slicedToArray(_scroll$leaf3, 2);

	        leaf = _scroll$leaf4[0];
	        offset = _scroll$leaf4[1];

	        if (leaf == null) return null;

	        var _leaf$position3 = leaf.position(offset, true);

	        var _leaf$position4 = _slicedToArray(_leaf$position3, 2);

	        node = _leaf$position4[0];
	        offset = _leaf$position4[1];

	        range.setEnd(node, offset);
	        bounds = range.getBoundingClientRect();
	      } else {
	        var side = 'left';
	        var rect = void 0;
	        if (node instanceof Text) {
	          if (offset < node.data.length) {
	            range.setStart(node, offset);
	            range.setEnd(node, offset + 1);
	          } else {
	            range.setStart(node, offset - 1);
	            range.setEnd(node, offset);
	            side = 'right';
	          }
	          rect = range.getBoundingClientRect();
	        } else {
	          rect = leaf.domNode.getBoundingClientRect();
	          if (offset > 0) side = 'right';
	        }
	        bounds = {
	          height: rect.height,
	          left: rect[side],
	          width: 0,
	          top: rect.top
	        };
	      }
	      var containerBounds = this.root.parentNode.getBoundingClientRect();
	      return {
	        left: bounds.left - containerBounds.left,
	        right: bounds.left + bounds.width - containerBounds.left,
	        top: bounds.top - containerBounds.top,
	        bottom: bounds.top + bounds.height - containerBounds.top,
	        height: bounds.height,
	        width: bounds.width
	      };
	    }
	  }, {
	    key: 'getNativeRange',
	    value: function getNativeRange() {
	      var selection = document.getSelection();
	      if (selection == null || selection.rangeCount <= 0) return null;
	      var nativeRange = selection.getRangeAt(0);
	      if (nativeRange == null) return null;
	      if (!contains(this.root, nativeRange.startContainer) || !nativeRange.collapsed && !contains(this.root, nativeRange.endContainer)) {
	        return null;
	      }
	      var range = {
	        start: { node: nativeRange.startContainer, offset: nativeRange.startOffset },
	        end: { node: nativeRange.endContainer, offset: nativeRange.endOffset },
	        native: nativeRange
	      };
	      [range.start, range.end].forEach(function (position) {
	        var node = position.node,
	            offset = position.offset;
	        while (!(node instanceof Text) && node.childNodes.length > 0) {
	          if (node.childNodes.length > offset) {
	            node = node.childNodes[offset];
	            offset = 0;
	          } else if (node.childNodes.length === offset) {
	            node = node.lastChild;
	            offset = node instanceof Text ? node.data.length : node.childNodes.length + 1;
	          } else {
	            break;
	          }
	        }
	        position.node = node, position.offset = offset;
	      });
	      debug.info('getNativeRange', range);
	      return range;
	    }
	  }, {
	    key: 'getRange',
	    value: function getRange() {
	      var _this2 = this;

	      var range = this.getNativeRange();
	      if (range == null) return [null, null];
	      var positions = [[range.start.node, range.start.offset]];
	      if (!range.native.collapsed) {
	        positions.push([range.end.node, range.end.offset]);
	      }
	      var indexes = positions.map(function (position) {
	        var _position = _slicedToArray(position, 2),
	            node = _position[0],
	            offset = _position[1];

	        var blot = _parchment2.default.find(node, true);
	        var index = blot.offset(_this2.scroll);
	        if (offset === 0) {
	          return index;
	        } else if (blot instanceof _parchment2.default.Container) {
	          return index + blot.length();
	        } else {
	          return index + blot.index(node, offset);
	        }
	      });
	      var start = Math.min.apply(Math, _toConsumableArray(indexes)),
	          end = Math.max.apply(Math, _toConsumableArray(indexes));
	      return [new Range(start, end - start), range];
	    }
	  }, {
	    key: 'hasFocus',
	    value: function hasFocus() {
	      return document.activeElement === this.root;
	    }
	  }, {
	    key: 'scrollIntoView',
	    value: function scrollIntoView() {
	      var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.lastRange;

	      if (range == null) return;
	      var bounds = this.getBounds(range.index, range.length);
	      if (bounds == null) return;
	      if (this.root.offsetHeight < bounds.bottom) {
	        var _scroll$line = this.scroll.line(Math.min(range.index + range.length, this.scroll.length() - 1)),
	            _scroll$line2 = _slicedToArray(_scroll$line, 1),
	            line = _scroll$line2[0];

	        this.root.scrollTop = line.domNode.offsetTop + line.domNode.offsetHeight - this.root.offsetHeight;
	      } else if (bounds.top < 0) {
	        var _scroll$line3 = this.scroll.line(Math.min(range.index, this.scroll.length() - 1)),
	            _scroll$line4 = _slicedToArray(_scroll$line3, 1),
	            _line = _scroll$line4[0];

	        this.root.scrollTop = _line.domNode.offsetTop;
	      }
	    }
	  }, {
	    key: 'setNativeRange',
	    value: function setNativeRange(startNode, startOffset) {
	      var endNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : startNode;
	      var endOffset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : startOffset;
	      var force = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

	      debug.info('setNativeRange', startNode, startOffset, endNode, endOffset);
	      if (startNode != null && (this.root.parentNode == null || startNode.parentNode == null || endNode.parentNode == null)) {
	        return;
	      }
	      var selection = document.getSelection();
	      if (selection == null) return;
	      if (startNode != null) {
	        if (!this.hasFocus()) this.root.focus();
	        var nativeRange = this.getNativeRange();
	        if (nativeRange == null || force || startNode !== nativeRange.start.node || startOffset !== nativeRange.start.offset || endNode !== nativeRange.end.node || endOffset !== nativeRange.end.offset) {
	          var range = document.createRange();
	          range.setStart(startNode, startOffset);
	          range.setEnd(endNode, endOffset);
	          selection.removeAllRanges();
	          selection.addRange(range);
	        }
	      } else {
	        selection.removeAllRanges();
	        this.root.blur();
	        document.body.focus(); // root.blur() not enough on IE11+Travis+SauceLabs (but not local VMs)
	      }
	    }
	  }, {
	    key: 'setRange',
	    value: function setRange(range) {
	      var _this3 = this;

	      var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	      var source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _emitter4.default.sources.API;

	      if (typeof force === 'string') {
	        source = force;
	        force = false;
	      }
	      debug.info('setRange', range);
	      if (range != null) {
	        (function () {
	          var indexes = range.collapsed ? [range.index] : [range.index, range.index + range.length];
	          var args = [];
	          var scrollLength = _this3.scroll.length();
	          indexes.forEach(function (index, i) {
	            index = Math.min(scrollLength - 1, index);
	            var node = void 0,
	                _scroll$leaf5 = _this3.scroll.leaf(index),
	                _scroll$leaf6 = _slicedToArray(_scroll$leaf5, 2),
	                leaf = _scroll$leaf6[0],
	                offset = _scroll$leaf6[1];
	            var _leaf$position5 = leaf.position(offset, i !== 0);

	            var _leaf$position6 = _slicedToArray(_leaf$position5, 2);

	            node = _leaf$position6[0];
	            offset = _leaf$position6[1];

	            args.push(node, offset);
	          });
	          if (args.length < 2) {
	            args = args.concat(args);
	          }
	          _this3.setNativeRange.apply(_this3, _toConsumableArray(args).concat([force]));
	        })();
	      } else {
	        this.setNativeRange(null);
	      }
	      this.update(source);
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _emitter4.default.sources.USER;

	      var nativeRange = void 0,
	          oldRange = this.lastRange;

	      var _getRange = this.getRange();

	      var _getRange2 = _slicedToArray(_getRange, 2);

	      this.lastRange = _getRange2[0];
	      nativeRange = _getRange2[1];

	      if (this.lastRange != null) {
	        this.savedRange = this.lastRange;
	      }
	      if (!(0, _deepEqual2.default)(oldRange, this.lastRange)) {
	        var _emitter;

	        if (!this.composing && nativeRange != null && nativeRange.native.collapsed && nativeRange.start.node !== this.cursor.textNode) {
	          this.cursor.restore();
	        }
	        var args = [_emitter4.default.events.SELECTION_CHANGE, (0, _clone2.default)(this.lastRange), (0, _clone2.default)(oldRange), source];
	        (_emitter = this.emitter).emit.apply(_emitter, [_emitter4.default.events.EDITOR_CHANGE].concat(args));
	        if (source !== _emitter4.default.sources.SILENT) {
	          var _emitter2;

	          (_emitter2 = this.emitter).emit.apply(_emitter2, args);
	        }
	      }
	    }
	  }]);

	  return Selection;
	}();

	function contains(parent, descendant) {
	  try {
	    // Firefox inserts inaccessible nodes around video elements
	    descendant.parentNode;
	  } catch (e) {
	    return false;
	  }
	  // IE11 has bug with Text nodes
	  // https://connect.microsoft.com/IE/feedback/details/780874/node-contains-is-incorrect
	  if (descendant instanceof Text) {
	    descendant = descendant.parentNode;
	  }
	  return parent.contains(descendant);
	}

	exports.Range = Range;
	exports.default = Selection;

/***/ },
/* 45 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Theme = function () {
	  function Theme(quill, options) {
	    _classCallCheck(this, Theme);

	    this.quill = quill;
	    this.options = options;
	    this.modules = {};
	  }

	  _createClass(Theme, [{
	    key: 'init',
	    value: function init() {
	      var _this = this;

	      Object.keys(this.options.modules).forEach(function (name) {
	        if (_this.modules[name] == null) {
	          _this.addModule(name);
	        }
	      });
	    }
	  }, {
	    key: 'addModule',
	    value: function addModule(name) {
	      var moduleClass = this.quill.constructor.import('modules/' + name);
	      this.modules[name] = new moduleClass(this.quill, this.options.modules[name] || {});
	      return this.modules[name];
	    }
	  }]);

	  return Theme;
	}();

	Theme.DEFAULTS = {
	  modules: {}
	};
	Theme.themes = {
	  'default': Theme
	};

	exports.default = Theme;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _block = __webpack_require__(29);

	var _block2 = _interopRequireDefault(_block);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Container = function (_Parchment$Container) {
	  _inherits(Container, _Parchment$Container);

	  function Container() {
	    _classCallCheck(this, Container);

	    return _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).apply(this, arguments));
	  }

	  return Container;
	}(_parchment2.default.Container);

	Container.allowedChildren = [_block2.default, _block.BlockEmbed, Container];

	exports.default = Container;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _emitter = __webpack_require__(36);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _block = __webpack_require__(29);

	var _block2 = _interopRequireDefault(_block);

	var _break = __webpack_require__(31);

	var _break2 = _interopRequireDefault(_break);

	var _container = __webpack_require__(46);

	var _container2 = _interopRequireDefault(_container);

	var _code = __webpack_require__(28);

	var _code2 = _interopRequireDefault(_code);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function isLine(blot) {
	  return blot instanceof _block2.default || blot instanceof _block.BlockEmbed;
	}

	var Scroll = function (_Parchment$Scroll) {
	  _inherits(Scroll, _Parchment$Scroll);

	  function Scroll(domNode, config) {
	    _classCallCheck(this, Scroll);

	    var _this = _possibleConstructorReturn(this, (Scroll.__proto__ || Object.getPrototypeOf(Scroll)).call(this, domNode));

	    _this.emitter = config.emitter;
	    if (Array.isArray(config.whitelist)) {
	      _this.whitelist = config.whitelist.reduce(function (whitelist, format) {
	        whitelist[format] = true;
	        return whitelist;
	      }, {});
	    }
	    _this.optimize();
	    _this.enable();
	    return _this;
	  }

	  _createClass(Scroll, [{
	    key: 'deleteAt',
	    value: function deleteAt(index, length) {
	      var _line = this.line(index),
	          _line2 = _slicedToArray(_line, 2),
	          first = _line2[0],
	          offset = _line2[1];

	      var _line3 = this.line(index + length),
	          _line4 = _slicedToArray(_line3, 1),
	          last = _line4[0];

	      _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'deleteAt', this).call(this, index, length);
	      if (last != null && first !== last && offset > 0 && !(first instanceof _block.BlockEmbed) && !(last instanceof _block.BlockEmbed)) {
	        if (last instanceof _code2.default) {
	          last.deleteAt(last.length() - 1, 1);
	        }
	        var ref = last.children.head instanceof _break2.default ? null : last.children.head;
	        first.moveChildren(last, ref);
	        first.remove();
	      }
	      this.optimize();
	    }
	  }, {
	    key: 'enable',
	    value: function enable() {
	      var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

	      this.domNode.setAttribute('contenteditable', enabled);
	    }
	  }, {
	    key: 'formatAt',
	    value: function formatAt(index, length, format, value) {
	      if (this.whitelist != null && !this.whitelist[format]) return;
	      _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'formatAt', this).call(this, index, length, format, value);
	      this.optimize();
	    }
	  }, {
	    key: 'insertAt',
	    value: function insertAt(index, value, def) {
	      if (def != null && this.whitelist != null && !this.whitelist[value]) return;
	      if (index >= this.length()) {
	        if (def == null || _parchment2.default.query(value, _parchment2.default.Scope.BLOCK) == null) {
	          var blot = _parchment2.default.create(this.statics.defaultChild);
	          this.appendChild(blot);
	          if (def == null && value.endsWith('\n')) {
	            value = value.slice(0, -1);
	          }
	          blot.insertAt(0, value, def);
	        } else {
	          var embed = _parchment2.default.create(value, def);
	          this.appendChild(embed);
	        }
	      } else {
	        _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'insertAt', this).call(this, index, value, def);
	      }
	      this.optimize();
	    }
	  }, {
	    key: 'insertBefore',
	    value: function insertBefore(blot, ref) {
	      if (blot.statics.scope === _parchment2.default.Scope.INLINE_BLOT) {
	        var wrapper = _parchment2.default.create(this.statics.defaultChild);
	        wrapper.appendChild(blot);
	        blot = wrapper;
	      }
	      _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'insertBefore', this).call(this, blot, ref);
	    }
	  }, {
	    key: 'leaf',
	    value: function leaf(index) {
	      return this.path(index).pop() || [null, -1];
	    }
	  }, {
	    key: 'line',
	    value: function line(index) {
	      if (index === this.length()) {
	        return this.line(index - 1);
	      }
	      return this.descendant(isLine, index);
	    }
	  }, {
	    key: 'lines',
	    value: function lines() {
	      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Number.MAX_VALUE;

	      var getLines = function getLines(blot, index, length) {
	        var lines = [],
	            lengthLeft = length;
	        blot.children.forEachAt(index, length, function (child, index, length) {
	          if (isLine(child)) {
	            lines.push(child);
	          } else if (child instanceof _parchment2.default.Container) {
	            lines = lines.concat(getLines(child, index, lengthLeft));
	          }
	          lengthLeft -= length;
	        });
	        return lines;
	      };
	      return getLines(this, index, length);
	    }
	  }, {
	    key: 'optimize',
	    value: function optimize() {
	      var mutations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	      if (this.batch === true) return;
	      _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'optimize', this).call(this, mutations);
	      if (mutations.length > 0) {
	        this.emitter.emit(_emitter2.default.events.SCROLL_OPTIMIZE, mutations);
	      }
	    }
	  }, {
	    key: 'path',
	    value: function path(index) {
	      return _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'path', this).call(this, index).slice(1); // Exclude self
	    }
	  }, {
	    key: 'update',
	    value: function update(mutations) {
	      if (this.batch === true) return;
	      var source = _emitter2.default.sources.USER;
	      if (typeof mutations === 'string') {
	        source = mutations;
	      }
	      if (!Array.isArray(mutations)) {
	        mutations = this.observer.takeRecords();
	      }
	      if (mutations.length > 0) {
	        this.emitter.emit(_emitter2.default.events.SCROLL_BEFORE_UPDATE, source, mutations);
	      }
	      _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'update', this).call(this, mutations.concat([])); // pass copy
	      if (mutations.length > 0) {
	        this.emitter.emit(_emitter2.default.events.SCROLL_UPDATE, source, mutations);
	      }
	    }
	  }]);

	  return Scroll;
	}(_parchment2.default.Scroll);

	Scroll.blotName = 'scroll';
	Scroll.className = 'ql-editor';
	Scroll.tagName = 'DIV';
	Scroll.defaultChild = 'block';
	Scroll.allowedChildren = [_block2.default, _block.BlockEmbed, _container2.default];

	exports.default = Scroll;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.matchText = exports.matchSpacing = exports.matchNewline = exports.matchBlot = exports.matchAttributor = exports.default = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _quillDelta = __webpack_require__(20);

	var _quillDelta2 = _interopRequireDefault(_quillDelta);

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _quill = __webpack_require__(18);

	var _quill2 = _interopRequireDefault(_quill);

	var _logger = __webpack_require__(38);

	var _logger2 = _interopRequireDefault(_logger);

	var _module = __webpack_require__(43);

	var _module2 = _interopRequireDefault(_module);

	var _align = __webpack_require__(49);

	var _background = __webpack_require__(50);

	var _color = __webpack_require__(51);

	var _direction = __webpack_require__(52);

	var _font = __webpack_require__(53);

	var _size = __webpack_require__(54);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var debug = (0, _logger2.default)('quill:clipboard');

	var CLIPBOARD_CONFIG = [[Node.TEXT_NODE, matchText], ['br', matchBreak], [Node.ELEMENT_NODE, matchNewline], [Node.ELEMENT_NODE, matchBlot], [Node.ELEMENT_NODE, matchSpacing], [Node.ELEMENT_NODE, matchAttributor], [Node.ELEMENT_NODE, matchStyles], ['b', matchAlias.bind(matchAlias, 'bold')], ['i', matchAlias.bind(matchAlias, 'italic')], ['style', matchIgnore]];

	var ATTRIBUTE_ATTRIBUTORS = [_align.AlignAttribute, _direction.DirectionAttribute].reduce(function (memo, attr) {
	  memo[attr.keyName] = attr;
	  return memo;
	}, {});

	var STYLE_ATTRIBUTORS = [_align.AlignStyle, _background.BackgroundStyle, _color.ColorStyle, _direction.DirectionStyle, _font.FontStyle, _size.SizeStyle].reduce(function (memo, attr) {
	  memo[attr.keyName] = attr;
	  return memo;
	}, {});

	var Clipboard = function (_Module) {
	  _inherits(Clipboard, _Module);

	  function Clipboard(quill, options) {
	    _classCallCheck(this, Clipboard);

	    var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this, quill, options));

	    _this.quill.root.addEventListener('paste', _this.onPaste.bind(_this));
	    _this.container = _this.quill.addContainer('ql-clipboard');
	    _this.container.setAttribute('contenteditable', true);
	    _this.container.setAttribute('tabindex', -1);
	    _this.matchers = [];
	    CLIPBOARD_CONFIG.concat(_this.options.matchers).forEach(function (pair) {
	      _this.addMatcher.apply(_this, _toConsumableArray(pair));
	    });
	    return _this;
	  }

	  _createClass(Clipboard, [{
	    key: 'addMatcher',
	    value: function addMatcher(selector, matcher) {
	      this.matchers.push([selector, matcher]);
	    }
	  }, {
	    key: 'convert',
	    value: function convert(html) {
	      var _this2 = this;

	      var DOM_KEY = '__ql-matcher';
	      if (typeof html === 'string') {
	        this.container.innerHTML = html;
	      }
	      var textMatchers = [],
	          elementMatchers = [];
	      this.matchers.forEach(function (pair) {
	        var _pair = _slicedToArray(pair, 2),
	            selector = _pair[0],
	            matcher = _pair[1];

	        switch (selector) {
	          case Node.TEXT_NODE:
	            textMatchers.push(matcher);
	            break;
	          case Node.ELEMENT_NODE:
	            elementMatchers.push(matcher);
	            break;
	          default:
	            [].forEach.call(_this2.container.querySelectorAll(selector), function (node) {
	              // TODO use weakmap
	              node[DOM_KEY] = node[DOM_KEY] || [];
	              node[DOM_KEY].push(matcher);
	            });
	            break;
	        }
	      });
	      var traverse = function traverse(node) {
	        // Post-order
	        if (node.nodeType === node.TEXT_NODE) {
	          return textMatchers.reduce(function (delta, matcher) {
	            return matcher(node, delta);
	          }, new _quillDelta2.default());
	        } else if (node.nodeType === node.ELEMENT_NODE) {
	          return [].reduce.call(node.childNodes || [], function (delta, childNode) {
	            var childrenDelta = traverse(childNode);
	            if (childNode.nodeType === node.ELEMENT_NODE) {
	              childrenDelta = elementMatchers.reduce(function (childrenDelta, matcher) {
	                return matcher(childNode, childrenDelta);
	              }, childrenDelta);
	              childrenDelta = (childNode[DOM_KEY] || []).reduce(function (childrenDelta, matcher) {
	                return matcher(childNode, childrenDelta);
	              }, childrenDelta);
	            }
	            return delta.concat(childrenDelta);
	          }, new _quillDelta2.default());
	        } else {
	          return new _quillDelta2.default();
	        }
	      };
	      var delta = traverse(this.container);
	      // Remove trailing newline
	      if (deltaEndsWith(delta, '\n') && delta.ops[delta.ops.length - 1].attributes == null) {
	        delta = delta.compose(new _quillDelta2.default().retain(delta.length() - 1).delete(1));
	      }
	      debug.log('convert', this.container.innerHTML, delta);
	      this.container.innerHTML = '';
	      return delta;
	    }
	  }, {
	    key: 'dangerouslyPasteHTML',
	    value: function dangerouslyPasteHTML(index, html) {
	      var source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _quill2.default.sources.API;

	      if (typeof index === 'string') {
	        return this.quill.setContents(this.convert(index), html);
	      } else {
	        var paste = this.convert(html);
	        return this.quill.updateContents(new _quillDelta2.default().retain(index).concat(paste), source);
	      }
	    }
	  }, {
	    key: 'onPaste',
	    value: function onPaste(e) {
	      var _this3 = this;

	      if (e.defaultPrevented || !this.quill.isEnabled()) return;
	      var range = this.quill.getSelection();
	      var delta = new _quillDelta2.default().retain(range.index).delete(range.length);
	      var bodyTop = document.body.scrollTop;
	      this.container.focus();
	      setTimeout(function () {
	        _this3.quill.selection.update(_quill2.default.sources.SILENT);
	        delta = delta.concat(_this3.convert());
	        _this3.quill.updateContents(delta, _quill2.default.sources.USER);
	        // range.length contributes to delta.length()
	        _this3.quill.setSelection(delta.length() - range.length, _quill2.default.sources.SILENT);
	        document.body.scrollTop = bodyTop;
	        _this3.quill.selection.scrollIntoView();
	      }, 1);
	    }
	  }]);

	  return Clipboard;
	}(_module2.default);

	Clipboard.DEFAULTS = {
	  matchers: []
	};

	function computeStyle(node) {
	  if (node.nodeType !== Node.ELEMENT_NODE) return {};
	  var DOM_KEY = '__ql-computed-style';
	  return node[DOM_KEY] || (node[DOM_KEY] = window.getComputedStyle(node));
	}

	function deltaEndsWith(delta, text) {
	  var endText = "";
	  for (var i = delta.ops.length - 1; i >= 0 && endText.length < text.length; --i) {
	    var op = delta.ops[i];
	    if (typeof op.insert !== 'string') break;
	    endText = op.insert + endText;
	  }
	  return endText.slice(-1 * text.length) === text;
	}

	function isLine(node) {
	  if (node.childNodes.length === 0) return false; // Exclude embed blocks
	  var style = computeStyle(node);
	  return ['block', 'list-item'].indexOf(style.display) > -1;
	}

	function matchAlias(format, node, delta) {
	  return delta.compose(new _quillDelta2.default().retain(delta.length(), _defineProperty({}, format, true)));
	}

	function matchAttributor(node, delta) {
	  var attributes = _parchment2.default.Attributor.Attribute.keys(node);
	  var classes = _parchment2.default.Attributor.Class.keys(node);
	  var styles = _parchment2.default.Attributor.Style.keys(node);
	  var formats = {};
	  attributes.concat(classes).concat(styles).forEach(function (name) {
	    var attr = _parchment2.default.query(name, _parchment2.default.Scope.ATTRIBUTE);
	    if (attr != null) {
	      formats[attr.attrName] = attr.value(node);
	      if (formats[attr.attrName]) return;
	    }
	    if (ATTRIBUTE_ATTRIBUTORS[name] != null) {
	      attr = ATTRIBUTE_ATTRIBUTORS[name];
	      formats[attr.attrName] = attr.value(node);
	    }
	    if (STYLE_ATTRIBUTORS[name] != null) {
	      attr = STYLE_ATTRIBUTORS[name];
	      formats[attr.attrName] = attr.value(node);
	    }
	  });
	  if (Object.keys(formats).length > 0) {
	    delta = delta.compose(new _quillDelta2.default().retain(delta.length(), formats));
	  }
	  return delta;
	}

	function matchBlot(node, delta) {
	  var match = _parchment2.default.query(node);
	  if (match == null) return delta;
	  if (match.prototype instanceof _parchment2.default.Embed) {
	    var embed = {};
	    var value = match.value(node);
	    if (value != null) {
	      embed[match.blotName] = value;
	      delta = new _quillDelta2.default().insert(embed, match.formats(node));
	    }
	  } else if (typeof match.formats === 'function') {
	    var formats = _defineProperty({}, match.blotName, match.formats(node));
	    delta = delta.compose(new _quillDelta2.default().retain(delta.length(), formats));
	  }
	  return delta;
	}

	function matchBreak(node, delta) {
	  if (!deltaEndsWith(delta, '\n')) {
	    delta.insert('\n');
	  }
	  return delta;
	}

	function matchIgnore() {
	  return new _quillDelta2.default();
	}

	function matchNewline(node, delta) {
	  if (isLine(node) && !deltaEndsWith(delta, '\n')) {
	    delta.insert('\n');
	  }
	  return delta;
	}

	function matchSpacing(node, delta) {
	  if (isLine(node) && node.nextElementSibling != null && !deltaEndsWith(delta, '\n\n')) {
	    var nodeHeight = node.offsetHeight + parseFloat(computeStyle(node).marginTop) + parseFloat(computeStyle(node).marginBottom);
	    if (node.nextElementSibling.offsetTop > node.offsetTop + nodeHeight * 1.5) {
	      delta.insert('\n');
	    }
	  }
	  return delta;
	}

	function matchStyles(node, delta) {
	  var formats = {};
	  var style = node.style || {};
	  if (style.fontWeight && computeStyle(node).fontWeight === 'bold') {
	    formats.bold = true;
	  }
	  if (Object.keys(formats).length > 0) {
	    delta = delta.compose(new _quillDelta2.default().retain(delta.length(), formats));
	  }
	  if (parseFloat(style.textIndent || 0) > 0) {
	    // Could be 0.5in
	    delta = new _quillDelta2.default().insert('\t').concat(delta);
	  }
	  return delta;
	}

	function matchText(node, delta) {
	  var text = node.data;
	  // Word represents empty line with <o:p>&nbsp;</o:p>
	  if (node.parentNode.tagName === 'O:P') {
	    return delta.insert(text.trim());
	  }
	  if (!computeStyle(node.parentNode).whiteSpace.startsWith('pre')) {
	    // eslint-disable-next-line func-style
	    var replacer = function replacer(collapse, match) {
	      match = match.replace(/[^\u00a0]/g, ''); // \u00a0 is nbsp;
	      return match.length < 1 && collapse ? ' ' : match;
	    };
	    text = text.replace(/\r\n/g, ' ').replace(/\n/g, ' ');
	    text = text.replace(/\s\s+/g, replacer.bind(replacer, true)); // collapse whitespace
	    if (node.previousSibling == null && isLine(node.parentNode) || node.previousSibling != null && isLine(node.previousSibling)) {
	      text = text.replace(/^\s+/, replacer.bind(replacer, false));
	    }
	    if (node.nextSibling == null && isLine(node.parentNode) || node.nextSibling != null && isLine(node.nextSibling)) {
	      text = text.replace(/\s+$/, replacer.bind(replacer, false));
	    }
	  }
	  return delta.insert(text);
	}

	exports.default = Clipboard;
	exports.matchAttributor = matchAttributor;
	exports.matchBlot = matchBlot;
	exports.matchNewline = matchNewline;
	exports.matchSpacing = matchSpacing;
	exports.matchText = matchText;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.AlignStyle = exports.AlignClass = exports.AlignAttribute = undefined;

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var config = {
	  scope: _parchment2.default.Scope.BLOCK,
	  whitelist: ['right', 'center', 'justify']
	};

	var AlignAttribute = new _parchment2.default.Attributor.Attribute('align', 'align', config);
	var AlignClass = new _parchment2.default.Attributor.Class('align', 'ql-align', config);
	var AlignStyle = new _parchment2.default.Attributor.Style('align', 'text-align', config);

	exports.AlignAttribute = AlignAttribute;
	exports.AlignClass = AlignClass;
	exports.AlignStyle = AlignStyle;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.BackgroundStyle = exports.BackgroundClass = undefined;

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _color = __webpack_require__(51);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var BackgroundClass = new _parchment2.default.Attributor.Class('background', 'ql-bg', {
	  scope: _parchment2.default.Scope.INLINE
	});
	var BackgroundStyle = new _color.ColorAttributor('background', 'background-color', {
	  scope: _parchment2.default.Scope.INLINE
	});

	exports.BackgroundClass = BackgroundClass;
	exports.BackgroundStyle = BackgroundStyle;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ColorStyle = exports.ColorClass = exports.ColorAttributor = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ColorAttributor = function (_Parchment$Attributor) {
	  _inherits(ColorAttributor, _Parchment$Attributor);

	  function ColorAttributor() {
	    _classCallCheck(this, ColorAttributor);

	    return _possibleConstructorReturn(this, (ColorAttributor.__proto__ || Object.getPrototypeOf(ColorAttributor)).apply(this, arguments));
	  }

	  _createClass(ColorAttributor, [{
	    key: 'value',
	    value: function value(domNode) {
	      var value = _get(ColorAttributor.prototype.__proto__ || Object.getPrototypeOf(ColorAttributor.prototype), 'value', this).call(this, domNode);
	      if (!value.startsWith('rgb(')) return value;
	      value = value.replace(/^[^\d]+/, '').replace(/[^\d]+$/, '');
	      return '#' + value.split(',').map(function (component) {
	        return ('00' + parseInt(component).toString(16)).slice(-2);
	      }).join('');
	    }
	  }]);

	  return ColorAttributor;
	}(_parchment2.default.Attributor.Style);

	var ColorClass = new _parchment2.default.Attributor.Class('color', 'ql-color', {
	  scope: _parchment2.default.Scope.INLINE
	});
	var ColorStyle = new ColorAttributor('color', 'color', {
	  scope: _parchment2.default.Scope.INLINE
	});

	exports.ColorAttributor = ColorAttributor;
	exports.ColorClass = ColorClass;
	exports.ColorStyle = ColorStyle;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.DirectionStyle = exports.DirectionClass = exports.DirectionAttribute = undefined;

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var config = {
	  scope: _parchment2.default.Scope.BLOCK,
	  whitelist: ['rtl']
	};

	var DirectionAttribute = new _parchment2.default.Attributor.Attribute('direction', 'dir', config);
	var DirectionClass = new _parchment2.default.Attributor.Class('direction', 'ql-direction', config);
	var DirectionStyle = new _parchment2.default.Attributor.Style('direction', 'direction', config);

	exports.DirectionAttribute = DirectionAttribute;
	exports.DirectionClass = DirectionClass;
	exports.DirectionStyle = DirectionStyle;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.FontClass = exports.FontStyle = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var config = {
	  scope: _parchment2.default.Scope.INLINE,
	  whitelist: ['serif', 'monospace']
	};

	var FontClass = new _parchment2.default.Attributor.Class('font', 'ql-font', config);

	var FontStyleAttributor = function (_Parchment$Attributor) {
	  _inherits(FontStyleAttributor, _Parchment$Attributor);

	  function FontStyleAttributor() {
	    _classCallCheck(this, FontStyleAttributor);

	    return _possibleConstructorReturn(this, (FontStyleAttributor.__proto__ || Object.getPrototypeOf(FontStyleAttributor)).apply(this, arguments));
	  }

	  _createClass(FontStyleAttributor, [{
	    key: 'value',
	    value: function value(node) {
	      return _get(FontStyleAttributor.prototype.__proto__ || Object.getPrototypeOf(FontStyleAttributor.prototype), 'value', this).call(this, node).replace(/["']/g, '');
	    }
	  }]);

	  return FontStyleAttributor;
	}(_parchment2.default.Attributor.Style);

	var FontStyle = new FontStyleAttributor('font', 'font-family', config);

	exports.FontStyle = FontStyle;
	exports.FontClass = FontClass;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.SizeStyle = exports.SizeClass = undefined;

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var SizeClass = new _parchment2.default.Attributor.Class('size', 'ql-size', {
	  scope: _parchment2.default.Scope.INLINE,
	  whitelist: ['small', 'large', 'huge']
	});
	var SizeStyle = new _parchment2.default.Attributor.Style('size', 'font-size', {
	  scope: _parchment2.default.Scope.INLINE,
	  whitelist: ['10px', '18px', '32px']
	});

	exports.SizeClass = SizeClass;
	exports.SizeStyle = SizeStyle;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getLastChangeIndex = exports.default = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _quill = __webpack_require__(18);

	var _quill2 = _interopRequireDefault(_quill);

	var _module = __webpack_require__(43);

	var _module2 = _interopRequireDefault(_module);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var History = function (_Module) {
	  _inherits(History, _Module);

	  function History(quill, options) {
	    _classCallCheck(this, History);

	    var _this = _possibleConstructorReturn(this, (History.__proto__ || Object.getPrototypeOf(History)).call(this, quill, options));

	    _this.lastRecorded = 0;
	    _this.ignoreChange = false;
	    _this.clear();
	    _this.quill.on(_quill2.default.events.EDITOR_CHANGE, function (eventName, delta, oldDelta, source) {
	      if (eventName !== _quill2.default.events.TEXT_CHANGE || _this.ignoreChange) return;
	      if (!_this.options.userOnly || source === _quill2.default.sources.USER) {
	        _this.record(delta, oldDelta);
	      } else {
	        _this.transform(delta);
	      }
	    });
	    _this.quill.keyboard.addBinding({ key: 'Z', shortKey: true }, _this.undo.bind(_this));
	    _this.quill.keyboard.addBinding({ key: 'Z', shortKey: true, shiftKey: true }, _this.redo.bind(_this));
	    if (/Win/i.test(navigator.platform)) {
	      _this.quill.keyboard.addBinding({ key: 'Y', shortKey: true }, _this.redo.bind(_this));
	    }
	    return _this;
	  }

	  _createClass(History, [{
	    key: 'change',
	    value: function change(source, dest) {
	      if (this.stack[source].length === 0) return;
	      var delta = this.stack[source].pop();
	      this.lastRecorded = 0;
	      this.ignoreChange = true;
	      this.quill.updateContents(delta[source], _quill2.default.sources.USER);
	      this.ignoreChange = false;
	      var index = getLastChangeIndex(delta[source]);
	      this.quill.setSelection(index);
	      this.quill.selection.scrollIntoView();
	      this.stack[dest].push(delta);
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.stack = { undo: [], redo: [] };
	    }
	  }, {
	    key: 'record',
	    value: function record(changeDelta, oldDelta) {
	      if (changeDelta.ops.length === 0) return;
	      this.stack.redo = [];
	      var undoDelta = this.quill.getContents().diff(oldDelta);
	      var timestamp = Date.now();
	      if (this.lastRecorded + this.options.delay > timestamp && this.stack.undo.length > 0) {
	        var delta = this.stack.undo.pop();
	        undoDelta = undoDelta.compose(delta.undo);
	        changeDelta = delta.redo.compose(changeDelta);
	      } else {
	        this.lastRecorded = timestamp;
	      }
	      this.stack.undo.push({
	        redo: changeDelta,
	        undo: undoDelta
	      });
	      if (this.stack.undo.length > this.options.maxStack) {
	        this.stack.undo.shift();
	      }
	    }
	  }, {
	    key: 'redo',
	    value: function redo() {
	      this.change('redo', 'undo');
	    }
	  }, {
	    key: 'transform',
	    value: function transform(delta) {
	      this.stack.undo.forEach(function (change) {
	        change.undo = delta.transform(change.undo, true);
	        change.redo = delta.transform(change.redo, true);
	      });
	      this.stack.redo.forEach(function (change) {
	        change.undo = delta.transform(change.undo, true);
	        change.redo = delta.transform(change.redo, true);
	      });
	    }
	  }, {
	    key: 'undo',
	    value: function undo() {
	      this.change('undo', 'redo');
	    }
	  }]);

	  return History;
	}(_module2.default);

	History.DEFAULTS = {
	  delay: 1000,
	  maxStack: 100,
	  userOnly: false
	};

	function endsWithNewlineChange(delta) {
	  var lastOp = delta.ops[delta.ops.length - 1];
	  if (lastOp == null) return false;
	  if (lastOp.insert != null) {
	    return typeof lastOp.insert === 'string' && lastOp.insert.endsWith('\n');
	  }
	  if (lastOp.attributes != null) {
	    return Object.keys(lastOp.attributes).some(function (attr) {
	      return _parchment2.default.query(attr, _parchment2.default.Scope.BLOCK) != null;
	    });
	  }
	  return false;
	}

	function getLastChangeIndex(delta) {
	  var deleteLength = delta.reduce(function (length, op) {
	    length += op.delete || 0;
	    return length;
	  }, 0);
	  var changeIndex = delta.length() - deleteLength;
	  if (endsWithNewlineChange(delta)) {
	    changeIndex -= 1;
	  }
	  return changeIndex;
	}

	exports.default = History;
	exports.getLastChangeIndex = getLastChangeIndex;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _clone = __webpack_require__(39);

	var _clone2 = _interopRequireDefault(_clone);

	var _deepEqual = __webpack_require__(40);

	var _deepEqual2 = _interopRequireDefault(_deepEqual);

	var _extend = __webpack_require__(30);

	var _extend2 = _interopRequireDefault(_extend);

	var _op = __webpack_require__(26);

	var _op2 = _interopRequireDefault(_op);

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _quill = __webpack_require__(18);

	var _quill2 = _interopRequireDefault(_quill);

	var _logger = __webpack_require__(38);

	var _logger2 = _interopRequireDefault(_logger);

	var _module = __webpack_require__(43);

	var _module2 = _interopRequireDefault(_module);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var debug = (0, _logger2.default)('quill:keyboard');

	var SHORTKEY = /Mac/i.test(navigator.platform) ? 'metaKey' : 'ctrlKey';

	var Keyboard = function (_Module) {
	  _inherits(Keyboard, _Module);

	  _createClass(Keyboard, null, [{
	    key: 'match',
	    value: function match(evt, binding) {
	      binding = normalize(binding);
	      if (!!binding.shortKey !== evt[SHORTKEY] && binding.shortKey !== null) return false;
	      if (['altKey', 'ctrlKey', 'metaKey', 'shiftKey'].some(function (key) {
	        return key != SHORTKEY && !!binding[key] !== evt[key] && binding[key] !== null;
	      })) {
	        return false;
	      }
	      return binding.key === (evt.which || evt.keyCode);
	    }
	  }]);

	  function Keyboard(quill, options) {
	    _classCallCheck(this, Keyboard);

	    var _this = _possibleConstructorReturn(this, (Keyboard.__proto__ || Object.getPrototypeOf(Keyboard)).call(this, quill, options));

	    _this.bindings = {};
	    Object.keys(_this.options.bindings).forEach(function (name) {
	      if (_this.options.bindings[name]) {
	        _this.addBinding(_this.options.bindings[name]);
	      }
	    });
	    _this.addBinding({ key: Keyboard.keys.ENTER, shiftKey: null }, handleEnter);
	    _this.addBinding({ key: Keyboard.keys.ENTER, metaKey: null, ctrlKey: null, altKey: null }, function () {});
	    _this.addBinding({ key: Keyboard.keys.BACKSPACE }, { collapsed: true, prefix: /^.?$/ }, handleBackspace);
	    _this.addBinding({ key: Keyboard.keys.DELETE }, { collapsed: true, suffix: /^$/ }, handleDelete);
	    _this.addBinding({ key: Keyboard.keys.BACKSPACE }, { collapsed: false }, handleDeleteRange);
	    _this.addBinding({ key: Keyboard.keys.DELETE }, { collapsed: false }, handleDeleteRange);
	    if (/Trident/i.test(navigator.userAgent)) {
	      _this.addBinding({ key: Keyboard.keys.BACKSPACE, shortKey: true }, handleBackspace);
	      _this.addBinding({ key: Keyboard.keys.DELETE, shortKey: true }, handleDelete);
	    }
	    _this.listen();
	    return _this;
	  }

	  _createClass(Keyboard, [{
	    key: 'addBinding',
	    value: function addBinding(key) {
	      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      var handler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	      var binding = normalize(key);
	      if (binding == null || binding.key == null) {
	        return debug.warn('Attempted to add invalid keyboard binding', binding);
	      }
	      if (typeof context === 'function') {
	        context = { handler: context };
	      }
	      if (typeof handler === 'function') {
	        handler = { handler: handler };
	      }
	      binding = (0, _extend2.default)(binding, context, handler);
	      this.bindings[binding.key] = this.bindings[binding.key] || [];
	      this.bindings[binding.key].push(binding);
	    }
	  }, {
	    key: 'listen',
	    value: function listen() {
	      var _this2 = this;

	      this.quill.root.addEventListener('keydown', function (evt) {
	        if (evt.defaultPrevented) return;
	        var which = evt.which || evt.keyCode;
	        var bindings = (_this2.bindings[which] || []).filter(function (binding) {
	          return Keyboard.match(evt, binding);
	        });
	        if (bindings.length === 0) return;
	        var range = _this2.quill.getSelection();
	        if (range == null || !_this2.quill.hasFocus()) return;

	        var _quill$scroll$line = _this2.quill.scroll.line(range.index),
	            _quill$scroll$line2 = _slicedToArray(_quill$scroll$line, 2),
	            line = _quill$scroll$line2[0],
	            offset = _quill$scroll$line2[1];

	        var _quill$scroll$leaf = _this2.quill.scroll.leaf(range.index),
	            _quill$scroll$leaf2 = _slicedToArray(_quill$scroll$leaf, 2),
	            leafStart = _quill$scroll$leaf2[0],
	            offsetStart = _quill$scroll$leaf2[1];

	        var _ref = range.length === 0 ? [leafStart, offsetStart] : _this2.quill.scroll.leaf(range.index + range.length),
	            _ref2 = _slicedToArray(_ref, 2),
	            leafEnd = _ref2[0],
	            offsetEnd = _ref2[1];

	        var prefixText = leafStart instanceof _parchment2.default.Text ? leafStart.value().slice(0, offsetStart) : '';
	        var suffixText = leafEnd instanceof _parchment2.default.Text ? leafEnd.value().slice(offsetEnd) : '';
	        var curContext = {
	          collapsed: range.length === 0,
	          empty: range.length === 0 && line.length() <= 1,
	          format: _this2.quill.getFormat(range),
	          offset: offset,
	          prefix: prefixText,
	          suffix: suffixText
	        };
	        var prevented = bindings.some(function (binding) {
	          if (binding.collapsed != null && binding.collapsed !== curContext.collapsed) return false;
	          if (binding.empty != null && binding.empty !== curContext.empty) return false;
	          if (binding.offset != null && binding.offset !== curContext.offset) return false;
	          if (Array.isArray(binding.format)) {
	            // any format is present
	            if (binding.format.every(function (name) {
	              return curContext.format[name] == null;
	            })) {
	              return false;
	            }
	          } else if (_typeof(binding.format) === 'object') {
	            // all formats must match
	            if (!Object.keys(binding.format).every(function (name) {
	              if (binding.format[name] === true) return curContext.format[name] != null;
	              if (binding.format[name] === false) return curContext.format[name] == null;
	              return (0, _deepEqual2.default)(binding.format[name], curContext.format[name]);
	            })) {
	              return false;
	            }
	          }
	          if (binding.prefix != null && !binding.prefix.test(curContext.prefix)) return false;
	          if (binding.suffix != null && !binding.suffix.test(curContext.suffix)) return false;
	          return binding.handler.call(_this2, range, curContext) !== true;
	        });
	        if (prevented) {
	          evt.preventDefault();
	        }
	      });
	    }
	  }]);

	  return Keyboard;
	}(_module2.default);

	Keyboard.keys = {
	  BACKSPACE: 8,
	  TAB: 9,
	  ENTER: 13,
	  ESCAPE: 27,
	  LEFT: 37,
	  UP: 38,
	  RIGHT: 39,
	  DOWN: 40,
	  DELETE: 46
	};

	Keyboard.DEFAULTS = {
	  bindings: {
	    'bold': makeFormatHandler('bold'),
	    'italic': makeFormatHandler('italic'),
	    'underline': makeFormatHandler('underline'),
	    'indent': {
	      // highlight tab or tab at beginning of list, indent or blockquote
	      key: Keyboard.keys.TAB,
	      format: ['blockquote', 'indent', 'list'],
	      handler: function handler(range, context) {
	        if (context.collapsed && context.offset !== 0) return true;
	        this.quill.format('indent', '+1', _quill2.default.sources.USER);
	      }
	    },
	    'outdent': {
	      key: Keyboard.keys.TAB,
	      shiftKey: true,
	      format: ['blockquote', 'indent', 'list'],
	      // highlight tab or tab at beginning of list, indent or blockquote
	      handler: function handler(range, context) {
	        if (context.collapsed && context.offset !== 0) return true;
	        this.quill.format('indent', '-1', _quill2.default.sources.USER);
	      }
	    },
	    'outdent backspace': {
	      key: Keyboard.keys.BACKSPACE,
	      collapsed: true,
	      format: ['blockquote', 'indent', 'list'],
	      offset: 0,
	      handler: function handler(range, context) {
	        if (context.format.indent != null) {
	          this.quill.format('indent', '-1', _quill2.default.sources.USER);
	        } else if (context.format.blockquote != null) {
	          this.quill.format('blockquote', false, _quill2.default.sources.USER);
	        } else if (context.format.list != null) {
	          this.quill.format('list', false, _quill2.default.sources.USER);
	        }
	      }
	    },
	    'indent code-block': makeCodeBlockHandler(true),
	    'outdent code-block': makeCodeBlockHandler(false),
	    'remove tab': {
	      key: Keyboard.keys.TAB,
	      shiftKey: true,
	      collapsed: true,
	      prefix: /\t$/,
	      handler: function handler(range) {
	        this.quill.deleteText(range.index - 1, 1, _quill2.default.sources.USER);
	      }
	    },
	    'tab': {
	      key: Keyboard.keys.TAB,
	      handler: function handler(range, context) {
	        if (!context.collapsed) {
	          this.quill.scroll.deleteAt(range.index, range.length);
	        }
	        this.quill.insertText(range.index, '\t', _quill2.default.sources.USER);
	        this.quill.setSelection(range.index + 1, _quill2.default.sources.SILENT);
	      }
	    },
	    'list empty enter': {
	      key: Keyboard.keys.ENTER,
	      collapsed: true,
	      format: ['list'],
	      empty: true,
	      handler: function handler(range, context) {
	        this.quill.format('list', false, _quill2.default.sources.USER);
	        if (context.format.indent) {
	          this.quill.format('indent', false, _quill2.default.sources.USER);
	        }
	      }
	    },
	    'header enter': {
	      key: Keyboard.keys.ENTER,
	      collapsed: true,
	      format: ['header'],
	      suffix: /^$/,
	      handler: function handler(range) {
	        this.quill.scroll.insertAt(range.index, '\n');
	        this.quill.formatText(range.index + 1, 1, 'header', false, _quill2.default.sources.USER);
	        this.quill.setSelection(range.index + 1, _quill2.default.sources.SILENT);
	        this.quill.selection.scrollIntoView();
	      }
	    },
	    'list autofill': {
	      key: ' ',
	      collapsed: true,
	      format: { list: false },
	      prefix: /^(1\.|-)$/,
	      handler: function handler(range, context) {
	        var length = context.prefix.length;
	        this.quill.scroll.deleteAt(range.index - length, length);
	        this.quill.formatLine(range.index - length, 1, 'list', length === 1 ? 'bullet' : 'ordered', _quill2.default.sources.USER);
	        this.quill.setSelection(range.index - length, _quill2.default.sources.SILENT);
	      }
	    }
	  }
	};

	function handleBackspace(range, context) {
	  if (range.index === 0) return;

	  var _quill$scroll$line3 = this.quill.scroll.line(range.index),
	      _quill$scroll$line4 = _slicedToArray(_quill$scroll$line3, 1),
	      line = _quill$scroll$line4[0];

	  var formats = {};
	  if (context.offset === 0) {
	    var curFormats = line.formats();
	    var prevFormats = this.quill.getFormat(range.index - 1, 1);
	    formats = _op2.default.attributes.diff(curFormats, prevFormats) || {};
	  }
	  this.quill.deleteText(range.index - 1, 1, _quill2.default.sources.USER);
	  if (Object.keys(formats).length > 0) {
	    this.quill.formatLine(range.index - 1, 1, formats, _quill2.default.sources.USER);
	  }
	  this.quill.selection.scrollIntoView();
	}

	function handleDelete(range) {
	  if (range.index >= this.quill.getLength() - 1) return;
	  this.quill.deleteText(range.index, 1, _quill2.default.sources.USER);
	}

	function handleDeleteRange(range) {
	  this.quill.deleteText(range, _quill2.default.sources.USER);
	  this.quill.setSelection(range.index, _quill2.default.sources.SILENT);
	  this.quill.selection.scrollIntoView();
	}

	function handleEnter(range, context) {
	  var _this3 = this;

	  if (range.length > 0) {
	    this.quill.scroll.deleteAt(range.index, range.length); // So we do not trigger text-change
	  }
	  var lineFormats = Object.keys(context.format).reduce(function (lineFormats, format) {
	    if (_parchment2.default.query(format, _parchment2.default.Scope.BLOCK) && !Array.isArray(context.format[format])) {
	      lineFormats[format] = context.format[format];
	    }
	    return lineFormats;
	  }, {});
	  this.quill.insertText(range.index, '\n', lineFormats, _quill2.default.sources.USER);
	  this.quill.selection.scrollIntoView();
	  Object.keys(context.format).forEach(function (name) {
	    if (lineFormats[name] != null) return;
	    if (Array.isArray(context.format[name])) return;
	    if (name === 'link') return;
	    _this3.quill.format(name, context.format[name], _quill2.default.sources.USER);
	  });
	}

	function makeCodeBlockHandler(indent) {
	  return {
	    key: Keyboard.keys.TAB,
	    shiftKey: !indent,
	    format: { 'code-block': true },
	    handler: function handler(range) {
	      var CodeBlock = _parchment2.default.query('code-block');
	      var index = range.index,
	          length = range.length;

	      var _quill$scroll$descend = this.quill.scroll.descendant(CodeBlock, index),
	          _quill$scroll$descend2 = _slicedToArray(_quill$scroll$descend, 2),
	          block = _quill$scroll$descend2[0],
	          offset = _quill$scroll$descend2[1];

	      if (block == null) return;
	      var scrollOffset = this.quill.scroll.offset(block);
	      var start = block.newlineIndex(offset, true) + 1;
	      var end = block.newlineIndex(scrollOffset + offset + length);
	      var lines = block.domNode.textContent.slice(start, end).split('\n');
	      offset = 0;
	      lines.forEach(function (line, i) {
	        if (indent) {
	          block.insertAt(start + offset, CodeBlock.TAB);
	          offset += CodeBlock.TAB.length;
	          if (i === 0) {
	            index += CodeBlock.TAB.length;
	          } else {
	            length += CodeBlock.TAB.length;
	          }
	        } else if (line.startsWith(CodeBlock.TAB)) {
	          block.deleteAt(start + offset, CodeBlock.TAB.length);
	          offset -= CodeBlock.TAB.length;
	          if (i === 0) {
	            index -= CodeBlock.TAB.length;
	          } else {
	            length -= CodeBlock.TAB.length;
	          }
	        }
	        offset += line.length + 1;
	      });
	      this.quill.update(_quill2.default.sources.USER);
	      this.quill.setSelection(index, length, _quill2.default.sources.SILENT);
	    }
	  };
	}

	function makeFormatHandler(format) {
	  return {
	    key: format[0].toUpperCase(),
	    shortKey: true,
	    handler: function handler(range, context) {
	      this.quill.format(format, !context.format[format], _quill2.default.sources.USER);
	    }
	  };
	}

	function normalize(binding) {
	  if (typeof binding === 'string' || typeof binding === 'number') {
	    return normalize({ key: binding });
	  }
	  if ((typeof binding === 'undefined' ? 'undefined' : _typeof(binding)) === 'object') {
	    binding = (0, _clone2.default)(binding, false);
	  }
	  if (typeof binding.key === 'string') {
	    if (Keyboard.keys[binding.key.toUpperCase()] != null) {
	      binding.key = Keyboard.keys[binding.key.toUpperCase()];
	    } else if (binding.key.length === 1) {
	      binding.key = binding.key.toUpperCase().charCodeAt(0);
	    } else {
	      return null;
	    }
	  }
	  return binding;
	}

	exports.default = Keyboard;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _core = __webpack_require__(1);

	var _core2 = _interopRequireDefault(_core);

	var _align = __webpack_require__(49);

	var _direction = __webpack_require__(52);

	var _indent = __webpack_require__(58);

	var _blockquote = __webpack_require__(59);

	var _blockquote2 = _interopRequireDefault(_blockquote);

	var _header = __webpack_require__(60);

	var _header2 = _interopRequireDefault(_header);

	var _list = __webpack_require__(61);

	var _list2 = _interopRequireDefault(_list);

	var _background = __webpack_require__(50);

	var _color = __webpack_require__(51);

	var _font = __webpack_require__(53);

	var _size = __webpack_require__(54);

	var _bold = __webpack_require__(62);

	var _bold2 = _interopRequireDefault(_bold);

	var _italic = __webpack_require__(63);

	var _italic2 = _interopRequireDefault(_italic);

	var _link = __webpack_require__(64);

	var _link2 = _interopRequireDefault(_link);

	var _script = __webpack_require__(65);

	var _script2 = _interopRequireDefault(_script);

	var _strike = __webpack_require__(66);

	var _strike2 = _interopRequireDefault(_strike);

	var _underline = __webpack_require__(67);

	var _underline2 = _interopRequireDefault(_underline);

	var _image = __webpack_require__(68);

	var _image2 = _interopRequireDefault(_image);

	var _video = __webpack_require__(69);

	var _video2 = _interopRequireDefault(_video);

	var _code = __webpack_require__(28);

	var _code2 = _interopRequireDefault(_code);

	var _formula = __webpack_require__(70);

	var _formula2 = _interopRequireDefault(_formula);

	var _syntax = __webpack_require__(71);

	var _syntax2 = _interopRequireDefault(_syntax);

	var _toolbar = __webpack_require__(72);

	var _toolbar2 = _interopRequireDefault(_toolbar);

	var _icons = __webpack_require__(73);

	var _icons2 = _interopRequireDefault(_icons);

	var _picker = __webpack_require__(105);

	var _picker2 = _interopRequireDefault(_picker);

	var _colorPicker = __webpack_require__(107);

	var _colorPicker2 = _interopRequireDefault(_colorPicker);

	var _iconPicker = __webpack_require__(108);

	var _iconPicker2 = _interopRequireDefault(_iconPicker);

	var _tooltip = __webpack_require__(109);

	var _tooltip2 = _interopRequireDefault(_tooltip);

	var _bubble = __webpack_require__(110);

	var _bubble2 = _interopRequireDefault(_bubble);

	var _snow = __webpack_require__(112);

	var _snow2 = _interopRequireDefault(_snow);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_core2.default.register({
	  'attributors/attribute/direction': _direction.DirectionAttribute,

	  'attributors/class/align': _align.AlignClass,
	  'attributors/class/background': _background.BackgroundClass,
	  'attributors/class/color': _color.ColorClass,
	  'attributors/class/direction': _direction.DirectionClass,
	  'attributors/class/font': _font.FontClass,
	  'attributors/class/size': _size.SizeClass,

	  'attributors/style/align': _align.AlignStyle,
	  'attributors/style/background': _background.BackgroundStyle,
	  'attributors/style/color': _color.ColorStyle,
	  'attributors/style/direction': _direction.DirectionStyle,
	  'attributors/style/font': _font.FontStyle,
	  'attributors/style/size': _size.SizeStyle
	}, true);

	_core2.default.register({
	  'formats/align': _align.AlignClass,
	  'formats/direction': _direction.DirectionClass,
	  'formats/indent': _indent.IndentClass,

	  'formats/background': _background.BackgroundStyle,
	  'formats/color': _color.ColorStyle,
	  'formats/font': _font.FontClass,
	  'formats/size': _size.SizeClass,

	  'formats/blockquote': _blockquote2.default,
	  'formats/code-block': _code2.default,
	  'formats/header': _header2.default,
	  'formats/list': _list2.default,

	  'formats/bold': _bold2.default,
	  'formats/code': _code.Code,
	  'formats/italic': _italic2.default,
	  'formats/link': _link2.default,
	  'formats/script': _script2.default,
	  'formats/strike': _strike2.default,
	  'formats/underline': _underline2.default,

	  'formats/image': _image2.default,
	  'formats/video': _video2.default,

	  'formats/list/item': _list.ListItem,

	  'modules/formula': _formula2.default,
	  'modules/syntax': _syntax2.default,
	  'modules/toolbar': _toolbar2.default,

	  'themes/bubble': _bubble2.default,
	  'themes/snow': _snow2.default,

	  'ui/icons': _icons2.default,
	  'ui/picker': _picker2.default,
	  'ui/icon-picker': _iconPicker2.default,
	  'ui/color-picker': _colorPicker2.default,
	  'ui/tooltip': _tooltip2.default
	}, true);

	module.exports = _core2.default;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.IndentClass = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var IdentAttributor = function (_Parchment$Attributor) {
	  _inherits(IdentAttributor, _Parchment$Attributor);

	  function IdentAttributor() {
	    _classCallCheck(this, IdentAttributor);

	    return _possibleConstructorReturn(this, (IdentAttributor.__proto__ || Object.getPrototypeOf(IdentAttributor)).apply(this, arguments));
	  }

	  _createClass(IdentAttributor, [{
	    key: 'add',
	    value: function add(node, value) {
	      if (value === '+1' || value === '-1') {
	        var indent = this.value(node) || 0;
	        value = value === '+1' ? indent + 1 : indent - 1;
	      }
	      if (value === 0) {
	        this.remove(node);
	        return true;
	      } else {
	        return _get(IdentAttributor.prototype.__proto__ || Object.getPrototypeOf(IdentAttributor.prototype), 'add', this).call(this, node, value);
	      }
	    }
	  }, {
	    key: 'value',
	    value: function value(node) {
	      return parseInt(_get(IdentAttributor.prototype.__proto__ || Object.getPrototypeOf(IdentAttributor.prototype), 'value', this).call(this, node)) || undefined; // Don't return NaN
	    }
	  }]);

	  return IdentAttributor;
	}(_parchment2.default.Attributor.Class);

	var IndentClass = new IdentAttributor('indent', 'ql-indent', {
	  scope: _parchment2.default.Scope.BLOCK,
	  whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
	});

	exports.IndentClass = IndentClass;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _block = __webpack_require__(29);

	var _block2 = _interopRequireDefault(_block);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Blockquote = function (_Block) {
	  _inherits(Blockquote, _Block);

	  function Blockquote() {
	    _classCallCheck(this, Blockquote);

	    return _possibleConstructorReturn(this, (Blockquote.__proto__ || Object.getPrototypeOf(Blockquote)).apply(this, arguments));
	  }

	  return Blockquote;
	}(_block2.default);

	Blockquote.blotName = 'blockquote';
	Blockquote.tagName = 'blockquote';

	exports.default = Blockquote;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _block = __webpack_require__(29);

	var _block2 = _interopRequireDefault(_block);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Header = function (_Block) {
	  _inherits(Header, _Block);

	  function Header() {
	    _classCallCheck(this, Header);

	    return _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).apply(this, arguments));
	  }

	  _createClass(Header, null, [{
	    key: 'formats',
	    value: function formats(domNode) {
	      return this.tagName.indexOf(domNode.tagName) + 1;
	    }
	  }]);

	  return Header;
	}(_block2.default);

	Header.blotName = 'header';
	Header.tagName = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

	exports.default = Header;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.ListItem = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _block = __webpack_require__(29);

	var _block2 = _interopRequireDefault(_block);

	var _container = __webpack_require__(46);

	var _container2 = _interopRequireDefault(_container);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ListItem = function (_Block) {
	  _inherits(ListItem, _Block);

	  function ListItem() {
	    _classCallCheck(this, ListItem);

	    return _possibleConstructorReturn(this, (ListItem.__proto__ || Object.getPrototypeOf(ListItem)).apply(this, arguments));
	  }

	  _createClass(ListItem, [{
	    key: 'format',
	    value: function format(name, value) {
	      if (name === List.blotName && !value) {
	        this.replaceWith(_parchment2.default.create(this.statics.scope));
	      } else {
	        _get(ListItem.prototype.__proto__ || Object.getPrototypeOf(ListItem.prototype), 'format', this).call(this, name, value);
	      }
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      if (this.prev == null && this.next == null) {
	        this.parent.remove();
	      } else {
	        _get(ListItem.prototype.__proto__ || Object.getPrototypeOf(ListItem.prototype), 'remove', this).call(this);
	      }
	    }
	  }, {
	    key: 'replaceWith',
	    value: function replaceWith(name, value) {
	      this.parent.isolate(this.offset(this.parent), this.length());
	      if (name === this.parent.statics.blotName) {
	        this.parent.replaceWith(name, value);
	        return this;
	      } else {
	        this.parent.unwrap();
	        return _get(ListItem.prototype.__proto__ || Object.getPrototypeOf(ListItem.prototype), 'replaceWith', this).call(this, name, value);
	      }
	    }
	  }], [{
	    key: 'formats',
	    value: function formats(domNode) {
	      return domNode.tagName === this.tagName ? undefined : _get(ListItem.__proto__ || Object.getPrototypeOf(ListItem), 'formats', this).call(this, domNode);
	    }
	  }]);

	  return ListItem;
	}(_block2.default);

	ListItem.blotName = 'list-item';
	ListItem.tagName = 'LI';

	var List = function (_Container) {
	  _inherits(List, _Container);

	  function List() {
	    _classCallCheck(this, List);

	    return _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).apply(this, arguments));
	  }

	  _createClass(List, [{
	    key: 'format',
	    value: function format(name, value) {
	      if (this.children.length > 0) {
	        this.children.tail.format(name, value);
	      }
	    }
	  }, {
	    key: 'formats',
	    value: function formats() {
	      // We don't inherit from FormatBlot
	      return _defineProperty({}, this.statics.blotName, this.statics.formats(this.domNode));
	    }
	  }, {
	    key: 'insertBefore',
	    value: function insertBefore(blot, ref) {
	      if (blot instanceof ListItem) {
	        _get(List.prototype.__proto__ || Object.getPrototypeOf(List.prototype), 'insertBefore', this).call(this, blot, ref);
	      } else {
	        var index = ref == null ? this.length() : ref.offset(this);
	        var after = this.split(index);
	        after.parent.insertBefore(blot, after);
	      }
	    }
	  }, {
	    key: 'optimize',
	    value: function optimize() {
	      _get(List.prototype.__proto__ || Object.getPrototypeOf(List.prototype), 'optimize', this).call(this);
	      var next = this.next;
	      if (next != null && next.prev === this && next.statics.blotName === this.statics.blotName && next.domNode.tagName === this.domNode.tagName) {
	        next.moveChildren(this);
	        next.remove();
	      }
	    }
	  }, {
	    key: 'replace',
	    value: function replace(target) {
	      if (target.statics.blotName !== this.statics.blotName) {
	        var item = _parchment2.default.create(this.statics.defaultChild);
	        target.moveChildren(item);
	        this.appendChild(item);
	      }
	      _get(List.prototype.__proto__ || Object.getPrototypeOf(List.prototype), 'replace', this).call(this, target);
	    }
	  }], [{
	    key: 'create',
	    value: function create(value) {
	      if (value === 'ordered') {
	        value = 'OL';
	      } else if (value === 'bullet') {
	        value = 'UL';
	      }
	      return _get(List.__proto__ || Object.getPrototypeOf(List), 'create', this).call(this, value);
	    }
	  }, {
	    key: 'formats',
	    value: function formats(domNode) {
	      if (domNode.tagName === 'OL') return 'ordered';
	      if (domNode.tagName === 'UL') return 'bullet';
	      return undefined;
	    }
	  }]);

	  return List;
	}(_container2.default);

	List.blotName = 'list';
	List.scope = _parchment2.default.Scope.BLOCK_BLOT;
	List.tagName = ['OL', 'UL'];
	List.defaultChild = 'list-item';
	List.allowedChildren = [ListItem];

	exports.ListItem = ListItem;
	exports.default = List;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _inline = __webpack_require__(33);

	var _inline2 = _interopRequireDefault(_inline);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Bold = function (_Inline) {
	  _inherits(Bold, _Inline);

	  function Bold() {
	    _classCallCheck(this, Bold);

	    return _possibleConstructorReturn(this, (Bold.__proto__ || Object.getPrototypeOf(Bold)).apply(this, arguments));
	  }

	  _createClass(Bold, [{
	    key: 'optimize',
	    value: function optimize() {
	      _get(Bold.prototype.__proto__ || Object.getPrototypeOf(Bold.prototype), 'optimize', this).call(this);
	      if (this.domNode.tagName !== this.statics.tagName[0]) {
	        this.replaceWith(this.statics.blotName);
	      }
	    }
	  }], [{
	    key: 'create',
	    value: function create() {
	      return _get(Bold.__proto__ || Object.getPrototypeOf(Bold), 'create', this).call(this);
	    }
	  }, {
	    key: 'formats',
	    value: function formats() {
	      return true;
	    }
	  }]);

	  return Bold;
	}(_inline2.default);

	Bold.blotName = 'bold';
	Bold.tagName = ['STRONG', 'B'];

	exports.default = Bold;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _bold = __webpack_require__(62);

	var _bold2 = _interopRequireDefault(_bold);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Italic = function (_Bold) {
	  _inherits(Italic, _Bold);

	  function Italic() {
	    _classCallCheck(this, Italic);

	    return _possibleConstructorReturn(this, (Italic.__proto__ || Object.getPrototypeOf(Italic)).apply(this, arguments));
	  }

	  return Italic;
	}(_bold2.default);

	Italic.blotName = 'italic';
	Italic.tagName = ['EM', 'I'];

	exports.default = Italic;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.sanitize = exports.default = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _inline = __webpack_require__(33);

	var _inline2 = _interopRequireDefault(_inline);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Link = function (_Inline) {
	  _inherits(Link, _Inline);

	  function Link() {
	    _classCallCheck(this, Link);

	    return _possibleConstructorReturn(this, (Link.__proto__ || Object.getPrototypeOf(Link)).apply(this, arguments));
	  }

	  _createClass(Link, [{
	    key: 'format',
	    value: function format(name, value) {
	      if (name !== this.statics.blotName || !value) return _get(Link.prototype.__proto__ || Object.getPrototypeOf(Link.prototype), 'format', this).call(this, name, value);
	      value = this.constructor.sanitize(value);
	      this.domNode.setAttribute('href', value);
	    }
	  }], [{
	    key: 'create',
	    value: function create(value) {
	      var node = _get(Link.__proto__ || Object.getPrototypeOf(Link), 'create', this).call(this, value);
	      value = this.sanitize(value);
	      node.setAttribute('href', value);
	      node.setAttribute('target', '_blank');
	      return node;
	    }
	  }, {
	    key: 'formats',
	    value: function formats(domNode) {
	      return domNode.getAttribute('href');
	    }
	  }, {
	    key: 'sanitize',
	    value: function sanitize(url) {
	      return _sanitize(url, ['http', 'https', 'mailto']) ? url : this.SANITIZED_URL;
	    }
	  }]);

	  return Link;
	}(_inline2.default);

	Link.blotName = 'link';
	Link.tagName = 'A';
	Link.SANITIZED_URL = 'about:blank';

	function _sanitize(url, protocols) {
	  var anchor = document.createElement('a');
	  anchor.href = url;
	  var protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
	  return protocols.indexOf(protocol) > -1;
	}

	exports.default = Link;
	exports.sanitize = _sanitize;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _inline = __webpack_require__(33);

	var _inline2 = _interopRequireDefault(_inline);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Script = function (_Inline) {
	  _inherits(Script, _Inline);

	  function Script() {
	    _classCallCheck(this, Script);

	    return _possibleConstructorReturn(this, (Script.__proto__ || Object.getPrototypeOf(Script)).apply(this, arguments));
	  }

	  _createClass(Script, null, [{
	    key: 'create',
	    value: function create(value) {
	      if (value === 'super') {
	        return document.createElement('sup');
	      } else if (value === 'sub') {
	        return document.createElement('sub');
	      } else {
	        return _get(Script.__proto__ || Object.getPrototypeOf(Script), 'create', this).call(this, value);
	      }
	    }
	  }, {
	    key: 'formats',
	    value: function formats(domNode) {
	      if (domNode.tagName === 'SUB') return 'sub';
	      if (domNode.tagName === 'SUP') return 'super';
	      return undefined;
	    }
	  }]);

	  return Script;
	}(_inline2.default);

	Script.blotName = 'script';
	Script.tagName = ['SUB', 'SUP'];

	exports.default = Script;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _inline = __webpack_require__(33);

	var _inline2 = _interopRequireDefault(_inline);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Strike = function (_Inline) {
	  _inherits(Strike, _Inline);

	  function Strike() {
	    _classCallCheck(this, Strike);

	    return _possibleConstructorReturn(this, (Strike.__proto__ || Object.getPrototypeOf(Strike)).apply(this, arguments));
	  }

	  return Strike;
	}(_inline2.default);

	Strike.blotName = 'strike';
	Strike.tagName = 'S';

	exports.default = Strike;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _inline = __webpack_require__(33);

	var _inline2 = _interopRequireDefault(_inline);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Underline = function (_Inline) {
	  _inherits(Underline, _Inline);

	  function Underline() {
	    _classCallCheck(this, Underline);

	    return _possibleConstructorReturn(this, (Underline.__proto__ || Object.getPrototypeOf(Underline)).apply(this, arguments));
	  }

	  return Underline;
	}(_inline2.default);

	Underline.blotName = 'underline';
	Underline.tagName = 'U';

	exports.default = Underline;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _embed = __webpack_require__(32);

	var _embed2 = _interopRequireDefault(_embed);

	var _link = __webpack_require__(64);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ATTRIBUTES = ['alt', 'height', 'width'];

	var Image = function (_Embed) {
	  _inherits(Image, _Embed);

	  function Image() {
	    _classCallCheck(this, Image);

	    return _possibleConstructorReturn(this, (Image.__proto__ || Object.getPrototypeOf(Image)).apply(this, arguments));
	  }

	  _createClass(Image, [{
	    key: 'format',
	    value: function format(name, value) {
	      if (ATTRIBUTES.indexOf(name) > -1) {
	        if (value) {
	          this.domNode.setAttribute(name, value);
	        } else {
	          this.domNode.removeAttribute(name);
	        }
	      } else {
	        _get(Image.prototype.__proto__ || Object.getPrototypeOf(Image.prototype), 'format', this).call(this, name, value);
	      }
	    }
	  }], [{
	    key: 'create',
	    value: function create(value) {
	      var node = _get(Image.__proto__ || Object.getPrototypeOf(Image), 'create', this).call(this, value);
	      if (typeof value === 'string') {
	        node.setAttribute('src', this.sanitize(value));
	      }
	      return node;
	    }
	  }, {
	    key: 'formats',
	    value: function formats(domNode) {
	      return ATTRIBUTES.reduce(function (formats, attribute) {
	        if (domNode.hasAttribute(attribute)) {
	          formats[attribute] = domNode.getAttribute(attribute);
	        }
	        return formats;
	      }, {});
	    }
	  }, {
	    key: 'match',
	    value: function match(url) {
	      return (/\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url)
	      );
	    }
	  }, {
	    key: 'sanitize',
	    value: function sanitize(url) {
	      return (0, _link.sanitize)(url, ['http', 'https', 'data']) ? url : '//:0';
	    }
	  }, {
	    key: 'value',
	    value: function value(domNode) {
	      return domNode.getAttribute('src');
	    }
	  }]);

	  return Image;
	}(_embed2.default);

	Image.blotName = 'image';
	Image.tagName = 'IMG';

	exports.default = Image;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _block = __webpack_require__(29);

	var _link = __webpack_require__(64);

	var _link2 = _interopRequireDefault(_link);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ATTRIBUTES = ['height', 'width'];

	var Video = function (_BlockEmbed) {
	  _inherits(Video, _BlockEmbed);

	  function Video() {
	    _classCallCheck(this, Video);

	    return _possibleConstructorReturn(this, (Video.__proto__ || Object.getPrototypeOf(Video)).apply(this, arguments));
	  }

	  _createClass(Video, [{
	    key: 'format',
	    value: function format(name, value) {
	      if (ATTRIBUTES.indexOf(name) > -1) {
	        if (value) {
	          this.domNode.setAttribute(name, value);
	        } else {
	          this.domNode.removeAttribute(name);
	        }
	      } else {
	        _get(Video.prototype.__proto__ || Object.getPrototypeOf(Video.prototype), 'format', this).call(this, name, value);
	      }
	    }
	  }], [{
	    key: 'create',
	    value: function create(value) {
	      var node = _get(Video.__proto__ || Object.getPrototypeOf(Video), 'create', this).call(this, value);
	      node.setAttribute('frameborder', '0');
	      node.setAttribute('allowfullscreen', true);
	      node.setAttribute('src', this.sanitize(value));
	      return node;
	    }
	  }, {
	    key: 'formats',
	    value: function formats(domNode) {
	      return ATTRIBUTES.reduce(function (formats, attribute) {
	        if (domNode.hasAttribute(attribute)) {
	          formats[attribute] = domNode.getAttribute(attribute);
	        }
	        return formats;
	      }, {});
	    }
	  }, {
	    key: 'sanitize',
	    value: function sanitize(url) {
	      return _link2.default.sanitize(url);
	    }
	  }, {
	    key: 'value',
	    value: function value(domNode) {
	      return domNode.getAttribute('src');
	    }
	  }]);

	  return Video;
	}(_block.BlockEmbed);

	Video.blotName = 'video';
	Video.className = 'ql-video';
	Video.tagName = 'IFRAME';

	exports.default = Video;

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.FormulaBlot = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _embed = __webpack_require__(32);

	var _embed2 = _interopRequireDefault(_embed);

	var _quill = __webpack_require__(18);

	var _quill2 = _interopRequireDefault(_quill);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FormulaBlot = function (_Embed) {
	  _inherits(FormulaBlot, _Embed);

	  function FormulaBlot() {
	    _classCallCheck(this, FormulaBlot);

	    return _possibleConstructorReturn(this, (FormulaBlot.__proto__ || Object.getPrototypeOf(FormulaBlot)).apply(this, arguments));
	  }

	  _createClass(FormulaBlot, [{
	    key: 'index',
	    value: function index() {
	      return 1;
	    }
	  }], [{
	    key: 'create',
	    value: function create(value) {
	      var node = _get(FormulaBlot.__proto__ || Object.getPrototypeOf(FormulaBlot), 'create', this).call(this, value);
	      if (typeof value === 'string') {
	        window.katex.render(value, node);
	        node.setAttribute('data-value', value);
	      }
	      node.setAttribute('contenteditable', false);
	      return node;
	    }
	  }, {
	    key: 'value',
	    value: function value(domNode) {
	      return domNode.getAttribute('data-value');
	    }
	  }]);

	  return FormulaBlot;
	}(_embed2.default);

	FormulaBlot.blotName = 'formula';
	FormulaBlot.className = 'ql-formula';
	FormulaBlot.tagName = 'SPAN';

	function Formula() {
	  if (window.katex == null) {
	    throw new Error('Formula module requires KaTeX.');
	  }
	  _quill2.default.register(FormulaBlot, true);
	}

	exports.FormulaBlot = FormulaBlot;
	exports.default = Formula;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.CodeToken = exports.CodeBlock = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _quill = __webpack_require__(18);

	var _quill2 = _interopRequireDefault(_quill);

	var _module = __webpack_require__(43);

	var _module2 = _interopRequireDefault(_module);

	var _code = __webpack_require__(28);

	var _code2 = _interopRequireDefault(_code);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SyntaxCodeBlock = function (_CodeBlock) {
	  _inherits(SyntaxCodeBlock, _CodeBlock);

	  function SyntaxCodeBlock() {
	    _classCallCheck(this, SyntaxCodeBlock);

	    return _possibleConstructorReturn(this, (SyntaxCodeBlock.__proto__ || Object.getPrototypeOf(SyntaxCodeBlock)).apply(this, arguments));
	  }

	  _createClass(SyntaxCodeBlock, [{
	    key: 'replaceWith',
	    value: function replaceWith(block) {
	      this.domNode.textContent = this.domNode.textContent;
	      this.attach();
	      _get(SyntaxCodeBlock.prototype.__proto__ || Object.getPrototypeOf(SyntaxCodeBlock.prototype), 'replaceWith', this).call(this, block);
	    }
	  }, {
	    key: 'highlight',
	    value: function highlight(_highlight) {
	      if (this.cachedHTML !== this.domNode.innerHTML) {
	        var text = this.domNode.textContent;
	        if (text.trim().length > 0 || this.cachedHTML == null) {
	          this.domNode.innerHTML = _highlight(text);
	          this.attach();
	        }
	        this.cachedHTML = this.domNode.innerHTML;
	      }
	    }
	  }]);

	  return SyntaxCodeBlock;
	}(_code2.default);

	SyntaxCodeBlock.className = 'ql-syntax';

	var CodeToken = new _parchment2.default.Attributor.Class('token', 'hljs', {
	  scope: _parchment2.default.Scope.INLINE
	});

	var Syntax = function (_Module) {
	  _inherits(Syntax, _Module);

	  function Syntax(quill, options) {
	    _classCallCheck(this, Syntax);

	    var _this2 = _possibleConstructorReturn(this, (Syntax.__proto__ || Object.getPrototypeOf(Syntax)).call(this, quill, options));

	    if (typeof _this2.options.highlight !== 'function') {
	      throw new Error('Syntax module requires highlight.js. Please include the library on the page before Quill.');
	    }
	    _quill2.default.register(CodeToken, true);
	    _quill2.default.register(SyntaxCodeBlock, true);
	    var timer = null;
	    _this2.quill.on(_quill2.default.events.SCROLL_OPTIMIZE, function () {
	      if (timer != null) return;
	      timer = setTimeout(function () {
	        _this2.highlight();
	        timer = null;
	      }, 100);
	    });
	    _this2.highlight();
	    return _this2;
	  }

	  _createClass(Syntax, [{
	    key: 'highlight',
	    value: function highlight() {
	      var _this3 = this;

	      if (this.quill.selection.composing) return;
	      var range = this.quill.getSelection();
	      this.quill.scroll.descendants(SyntaxCodeBlock).forEach(function (code) {
	        code.highlight(_this3.options.highlight);
	      });
	      this.quill.update(_quill2.default.sources.SILENT);
	      if (range != null) {
	        this.quill.setSelection(range, _quill2.default.sources.SILENT);
	      }
	    }
	  }]);

	  return Syntax;
	}(_module2.default);

	Syntax.DEFAULTS = {
	  highlight: function () {
	    if (window.hljs == null) return null;
	    return function (text) {
	      var result = window.hljs.highlightAuto(text);
	      return result.value;
	    };
	  }()
	};

	exports.CodeBlock = SyntaxCodeBlock;
	exports.CodeToken = CodeToken;
	exports.default = Syntax;

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.addControls = exports.default = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _quillDelta = __webpack_require__(20);

	var _quillDelta2 = _interopRequireDefault(_quillDelta);

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _quill = __webpack_require__(18);

	var _quill2 = _interopRequireDefault(_quill);

	var _logger = __webpack_require__(38);

	var _logger2 = _interopRequireDefault(_logger);

	var _module = __webpack_require__(43);

	var _module2 = _interopRequireDefault(_module);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var debug = (0, _logger2.default)('quill:toolbar');

	var Toolbar = function (_Module) {
	  _inherits(Toolbar, _Module);

	  function Toolbar(quill, options) {
	    _classCallCheck(this, Toolbar);

	    var _this = _possibleConstructorReturn(this, (Toolbar.__proto__ || Object.getPrototypeOf(Toolbar)).call(this, quill, options));

	    if (Array.isArray(_this.options.container)) {
	      var container = document.createElement('div');
	      addControls(container, _this.options.container);
	      quill.container.parentNode.insertBefore(container, quill.container);
	      _this.container = container;
	    } else if (typeof _this.options.container === 'string') {
	      _this.container = document.querySelector(_this.options.container);
	    } else {
	      _this.container = _this.options.container;
	    }
	    if (!(_this.container instanceof HTMLElement)) {
	      var _ret;

	      return _ret = debug.error('Container required for toolbar', _this.options), _possibleConstructorReturn(_this, _ret);
	    }
	    _this.container.classList.add('ql-toolbar');
	    _this.controls = [];
	    _this.handlers = {};
	    Object.keys(_this.options.handlers).forEach(function (format) {
	      _this.addHandler(format, _this.options.handlers[format]);
	    });
	    [].forEach.call(_this.container.querySelectorAll('button, select'), function (input) {
	      _this.attach(input);
	    });
	    _this.quill.on(_quill2.default.events.EDITOR_CHANGE, function (type, range) {
	      if (type === _quill2.default.events.SELECTION_CHANGE) {
	        _this.update(range);
	      }
	    });
	    _this.quill.on(_quill2.default.events.SCROLL_OPTIMIZE, function () {
	      var _this$quill$selection = _this.quill.selection.getRange(),
	          _this$quill$selection2 = _slicedToArray(_this$quill$selection, 1),
	          range = _this$quill$selection2[0]; // quill.getSelection triggers update


	      _this.update(range);
	    });
	    return _this;
	  }

	  _createClass(Toolbar, [{
	    key: 'addHandler',
	    value: function addHandler(format, handler) {
	      this.handlers[format] = handler;
	    }
	  }, {
	    key: 'attach',
	    value: function attach(input) {
	      var _this2 = this;

	      var format = [].find.call(input.classList, function (className) {
	        return className.indexOf('ql-') === 0;
	      });
	      if (!format) return;
	      format = format.slice('ql-'.length);
	      if (input.tagName === 'BUTTON') {
	        input.setAttribute('type', 'button');
	      }
	      if (this.handlers[format] == null) {
	        if (this.quill.scroll.whitelist != null && this.quill.scroll.whitelist[format] == null) {
	          debug.warn('ignoring attaching to disabled format', format, input);
	          return;
	        }
	        if (_parchment2.default.query(format) == null) {
	          debug.warn('ignoring attaching to nonexistent format', format, input);
	          return;
	        }
	      }
	      var eventName = input.tagName === 'SELECT' ? 'change' : 'click';
	      input.addEventListener(eventName, function (e) {
	        var value = void 0;
	        if (input.tagName === 'SELECT') {
	          if (input.selectedIndex < 0) return;
	          var selected = input.options[input.selectedIndex];
	          if (selected.hasAttribute('selected')) {
	            value = false;
	          } else {
	            value = selected.value || false;
	          }
	        } else {
	          if (input.classList.contains('ql-active')) {
	            value = false;
	          } else {
	            value = input.value || !input.hasAttribute('value');
	          }
	          e.preventDefault();
	        }
	        _this2.quill.focus();

	        var _quill$selection$getR = _this2.quill.selection.getRange(),
	            _quill$selection$getR2 = _slicedToArray(_quill$selection$getR, 1),
	            range = _quill$selection$getR2[0];

	        if (_this2.handlers[format] != null) {
	          _this2.handlers[format].call(_this2, value);
	        } else if (_parchment2.default.query(format).prototype instanceof _parchment2.default.Embed) {
	          value = prompt('Enter ' + format);
	          if (!value) return;
	          _this2.quill.updateContents(new _quillDelta2.default().retain(range.index).delete(range.length).insert(_defineProperty({}, format, value)), _quill2.default.sources.USER);
	        } else {
	          _this2.quill.format(format, value, _quill2.default.sources.USER);
	        }
	        _this2.update(range);
	      });
	      // TODO use weakmap
	      this.controls.push([format, input]);
	    }
	  }, {
	    key: 'update',
	    value: function update(range) {
	      var formats = range == null ? {} : this.quill.getFormat(range);
	      this.controls.forEach(function (pair) {
	        var _pair = _slicedToArray(pair, 2),
	            format = _pair[0],
	            input = _pair[1];

	        if (input.tagName === 'SELECT') {
	          var option = void 0;
	          if (range == null) {
	            option = null;
	          } else if (formats[format] == null) {
	            option = input.querySelector('option[selected]');
	          } else if (!Array.isArray(formats[format])) {
	            var value = formats[format];
	            if (typeof value === 'string') {
	              value = value.replace(/\"/g, '\\"');
	            }
	            option = input.querySelector('option[value="' + value + '"]');
	          }
	          if (option == null) {
	            input.value = ''; // TODO make configurable?
	            input.selectedIndex = -1;
	          } else {
	            option.selected = true;
	          }
	        } else {
	          if (range == null) {
	            input.classList.remove('ql-active');
	          } else if (input.hasAttribute('value')) {
	            // both being null should match (default values)
	            // '1' should match with 1 (headers)
	            var isActive = formats[format] === input.getAttribute('value') || formats[format] != null && formats[format].toString() === input.getAttribute('value') || formats[format] == null && !input.getAttribute('value');
	            input.classList.toggle('ql-active', isActive);
	          } else {
	            input.classList.toggle('ql-active', formats[format] != null);
	          }
	        }
	      });
	    }
	  }]);

	  return Toolbar;
	}(_module2.default);

	Toolbar.DEFAULTS = {};

	function addButton(container, format, value) {
	  var input = document.createElement('button');
	  input.setAttribute('type', 'button');
	  input.classList.add('ql-' + format);
	  if (value != null) {
	    input.value = value;
	  }
	  container.appendChild(input);
	}

	function addControls(container, groups) {
	  if (!Array.isArray(groups[0])) {
	    groups = [groups];
	  }
	  groups.forEach(function (controls) {
	    var group = document.createElement('span');
	    group.classList.add('ql-formats');
	    controls.forEach(function (control) {
	      if (typeof control === 'string') {
	        addButton(group, control);
	      } else {
	        var format = Object.keys(control)[0];
	        var value = control[format];
	        if (Array.isArray(value)) {
	          addSelect(group, format, value);
	        } else {
	          addButton(group, format, value);
	        }
	      }
	    });
	    container.appendChild(group);
	  });
	}

	function addSelect(container, format, values) {
	  var input = document.createElement('select');
	  input.classList.add('ql-' + format);
	  values.forEach(function (value) {
	    var option = document.createElement('option');
	    if (value !== false) {
	      option.setAttribute('value', value);
	    } else {
	      option.setAttribute('selected', 'selected');
	    }
	    input.appendChild(option);
	  });
	  container.appendChild(input);
	}

	Toolbar.DEFAULTS = {
	  container: null,
	  handlers: {
	    clean: function clean() {
	      var _this3 = this;

	      var range = this.quill.getSelection();
	      if (range == null) return;
	      if (range.length == 0) {
	        var formats = this.quill.getFormat();
	        Object.keys(formats).forEach(function (name) {
	          // Clean functionality in existing apps only clean inline formats
	          if (_parchment2.default.query(name, _parchment2.default.Scope.INLINE) != null) {
	            _this3.quill.format(name, false);
	          }
	        });
	      } else {
	        this.quill.removeFormat(range, _quill2.default.sources.USER);
	      }
	    },
	    direction: function direction(value) {
	      var align = this.quill.getFormat()['align'];
	      if (value === 'rtl' && align == null) {
	        this.quill.format('align', 'right', _quill2.default.sources.USER);
	      } else if (!value && align === 'right') {
	        this.quill.format('align', false, _quill2.default.sources.USER);
	      }
	      this.quill.format('direction', value, _quill2.default.sources.USER);
	    },
	    link: function link(value) {
	      if (value === true) {
	        value = prompt('Enter link URL:');
	      }
	      this.quill.format('link', value, _quill2.default.sources.USER);
	    },
	    indent: function indent(value) {
	      var range = this.quill.getSelection();
	      var formats = this.quill.getFormat(range);
	      var indent = parseInt(formats.indent || 0);
	      if (value === '+1' || value === '-1') {
	        var modifier = value === '+1' ? 1 : -1;
	        if (formats.direction === 'rtl') modifier *= -1;
	        this.quill.format('indent', indent + modifier, _quill2.default.sources.USER);
	      }
	    }
	  }
	};

	exports.default = Toolbar;
	exports.addControls = addControls;

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  'align': {
	    '': __webpack_require__(74),
	    'center': __webpack_require__(75),
	    'right': __webpack_require__(76),
	    'justify': __webpack_require__(77)
	  },
	  'background': __webpack_require__(78),
	  'blockquote': __webpack_require__(79),
	  'bold': __webpack_require__(80),
	  'clean': __webpack_require__(81),
	  'code': __webpack_require__(82),
	  'code-block': __webpack_require__(82),
	  'color': __webpack_require__(83),
	  'direction': {
	    '': __webpack_require__(84),
	    'rtl': __webpack_require__(85)
	  },
	  'float': {
	    'center': __webpack_require__(86),
	    'full': __webpack_require__(87),
	    'left': __webpack_require__(88),
	    'right': __webpack_require__(89)
	  },
	  'formula': __webpack_require__(90),
	  'header': {
	    '1': __webpack_require__(91),
	    '2': __webpack_require__(92)
	  },
	  'italic': __webpack_require__(93),
	  'image': __webpack_require__(94),
	  'indent': {
	    '+1': __webpack_require__(95),
	    '-1': __webpack_require__(96)
	  },
	  'link': __webpack_require__(97),
	  'list': {
	    'ordered': __webpack_require__(98),
	    'bullet': __webpack_require__(99)
	  },
	  'script': {
	    'sub': __webpack_require__(100),
	    'super': __webpack_require__(101)
	  },
	  'strike': __webpack_require__(102),
	  'underline': __webpack_require__(103),
	  'video': __webpack_require__(104)
	};

/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=3 x2=13 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=9 y1=4 y2=4></line> </svg>";

/***/ },
/* 75 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=14 x2=4 y1=14 y2=14></line> <line class=ql-stroke x1=12 x2=6 y1=4 y2=4></line> </svg>";

/***/ },
/* 76 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=15 x2=5 y1=14 y2=14></line> <line class=ql-stroke x1=15 x2=9 y1=4 y2=4></line> </svg>";

/***/ },
/* 77 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=15 x2=3 y1=14 y2=14></line> <line class=ql-stroke x1=15 x2=3 y1=4 y2=4></line> </svg>";

/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <g class=\"ql-fill ql-color-label\"> <polygon points=\"6 6.868 6 6 5 6 5 7 5.942 7 6 6.868\"></polygon> <rect height=1 width=1 x=4 y=4></rect> <polygon points=\"6.817 5 6 5 6 6 6.38 6 6.817 5\"></polygon> <rect height=1 width=1 x=2 y=6></rect> <rect height=1 width=1 x=3 y=5></rect> <rect height=1 width=1 x=4 y=7></rect> <polygon points=\"4 11.439 4 11 3 11 3 12 3.755 12 4 11.439\"></polygon> <rect height=1 width=1 x=2 y=12></rect> <rect height=1 width=1 x=2 y=9></rect> <rect height=1 width=1 x=2 y=15></rect> <polygon points=\"4.63 10 4 10 4 11 4.192 11 4.63 10\"></polygon> <rect height=1 width=1 x=3 y=8></rect> <path d=M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z></path> <path d=M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z></path> <path d=M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z></path> <rect height=1 width=1 x=12 y=2></rect> <rect height=1 width=1 x=11 y=3></rect> <path d=M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z></path> <rect height=1 width=1 x=2 y=3></rect> <rect height=1 width=1 x=6 y=2></rect> <rect height=1 width=1 x=3 y=2></rect> <rect height=1 width=1 x=5 y=3></rect> <rect height=1 width=1 x=9 y=2></rect> <rect height=1 width=1 x=15 y=14></rect> <polygon points=\"13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174\"></polygon> <rect height=1 width=1 x=13 y=7></rect> <rect height=1 width=1 x=15 y=5></rect> <rect height=1 width=1 x=14 y=6></rect> <rect height=1 width=1 x=15 y=8></rect> <rect height=1 width=1 x=14 y=9></rect> <path d=M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z></path> <rect height=1 width=1 x=14 y=3></rect> <polygon points=\"12 6.868 12 6 11.62 6 12 6.868\"></polygon> <rect height=1 width=1 x=15 y=2></rect> <rect height=1 width=1 x=12 y=5></rect> <rect height=1 width=1 x=13 y=4></rect> <polygon points=\"12.933 9 13 9 13 8 12.495 8 12.933 9\"></polygon> <rect height=1 width=1 x=9 y=14></rect> <rect height=1 width=1 x=8 y=15></rect> <path d=M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z></path> <rect height=1 width=1 x=5 y=15></rect> <path d=M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z></path> <rect height=1 width=1 x=11 y=15></rect> <path d=M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z></path> <rect height=1 width=1 x=14 y=15></rect> <rect height=1 width=1 x=15 y=11></rect> </g> <polyline class=ql-stroke points=\"5.5 13 9 5 12.5 13\"></polyline> <line class=ql-stroke x1=11.63 x2=6.38 y1=11 y2=11></line> </svg>";

/***/ },
/* 79 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <rect class=\"ql-fill ql-stroke\" height=3 width=3 x=4 y=5></rect> <rect class=\"ql-fill ql-stroke\" height=3 width=3 x=11 y=5></rect> <path class=\"ql-even ql-fill ql-stroke\" d=M7,8c0,4.031-3,5-3,5></path> <path class=\"ql-even ql-fill ql-stroke\" d=M14,8c0,4.031-3,5-3,5></path> </svg>";

/***/ },
/* 80 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-stroke d=M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z></path> <path class=ql-stroke d=M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z></path> </svg>";

/***/ },
/* 81 */
/***/ function(module, exports) {

	module.exports = "<svg class=\"\" viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=5 x2=13 y1=3 y2=3></line> <line class=ql-stroke x1=6 x2=9.35 y1=12 y2=3></line> <line class=ql-stroke x1=11 x2=15 y1=11 y2=15></line> <line class=ql-stroke x1=15 x2=11 y1=11 y2=15></line> <rect class=ql-fill height=1 rx=0.5 ry=0.5 width=7 x=2 y=14></rect> </svg>";

/***/ },
/* 82 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <polyline class=\"ql-even ql-stroke\" points=\"5 7 3 9 5 11\"></polyline> <polyline class=\"ql-even ql-stroke\" points=\"13 7 15 9 13 11\"></polyline> <line class=ql-stroke x1=10 x2=8 y1=5 y2=13></line> </svg>";

/***/ },
/* 83 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=\"ql-color-label ql-stroke ql-transparent\" x1=3 x2=15 y1=15 y2=15></line> <polyline class=ql-stroke points=\"5.5 11 9 3 12.5 11\"></polyline> <line class=ql-stroke x1=11.63 x2=6.38 y1=9 y2=9></line> </svg>";

/***/ },
/* 84 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <polygon class=\"ql-stroke ql-fill\" points=\"3 11 5 9 3 7 3 11\"></polygon> <line class=\"ql-stroke ql-fill\" x1=15 x2=11 y1=4 y2=4></line> <path class=ql-fill d=M11,3a3,3,0,0,0,0,6h1V3H11Z></path> <rect class=ql-fill height=11 width=1 x=11 y=4></rect> <rect class=ql-fill height=11 width=1 x=13 y=4></rect> </svg>";

/***/ },
/* 85 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <polygon class=\"ql-stroke ql-fill\" points=\"15 12 13 10 15 8 15 12\"></polygon> <line class=\"ql-stroke ql-fill\" x1=9 x2=5 y1=4 y2=4></line> <path class=ql-fill d=M5,3A3,3,0,0,0,5,9H6V3H5Z></path> <rect class=ql-fill height=11 width=1 x=5 y=4></rect> <rect class=ql-fill height=11 width=1 x=7 y=4></rect> </svg>";

/***/ },
/* 86 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M14,16H4a1,1,0,0,1,0-2H14A1,1,0,0,1,14,16Z /> <path class=ql-fill d=M14,4H4A1,1,0,0,1,4,2H14A1,1,0,0,1,14,4Z /> <rect class=ql-fill x=3 y=6 width=12 height=6 rx=1 ry=1 /> </svg>";

/***/ },
/* 87 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M13,16H5a1,1,0,0,1,0-2h8A1,1,0,0,1,13,16Z /> <path class=ql-fill d=M13,4H5A1,1,0,0,1,5,2h8A1,1,0,0,1,13,4Z /> <rect class=ql-fill x=2 y=6 width=14 height=6 rx=1 ry=1 /> </svg>";

/***/ },
/* 88 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M15,8H13a1,1,0,0,1,0-2h2A1,1,0,0,1,15,8Z /> <path class=ql-fill d=M15,12H13a1,1,0,0,1,0-2h2A1,1,0,0,1,15,12Z /> <path class=ql-fill d=M15,16H5a1,1,0,0,1,0-2H15A1,1,0,0,1,15,16Z /> <path class=ql-fill d=M15,4H5A1,1,0,0,1,5,2H15A1,1,0,0,1,15,4Z /> <rect class=ql-fill x=2 y=6 width=8 height=6 rx=1 ry=1 /> </svg>";

/***/ },
/* 89 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M5,8H3A1,1,0,0,1,3,6H5A1,1,0,0,1,5,8Z /> <path class=ql-fill d=M5,12H3a1,1,0,0,1,0-2H5A1,1,0,0,1,5,12Z /> <path class=ql-fill d=M13,16H3a1,1,0,0,1,0-2H13A1,1,0,0,1,13,16Z /> <path class=ql-fill d=M13,4H3A1,1,0,0,1,3,2H13A1,1,0,0,1,13,4Z /> <rect class=ql-fill x=8 y=6 width=8 height=6 rx=1 ry=1 transform=\"translate(24 18) rotate(-180)\"/> </svg>";

/***/ },
/* 90 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z></path> <rect class=ql-fill height=1.6 rx=0.8 ry=0.8 width=5 x=5.15 y=6.2></rect> <path class=ql-fill d=M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z></path> </svg>";

/***/ },
/* 91 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=3 y1=4 y2=14></line> <line class=ql-stroke x1=11 x2=11 y1=4 y2=14></line> <line class=ql-stroke x1=11 x2=3 y1=9 y2=9></line> <line class=\"ql-stroke ql-thin\" x1=13.5 x2=15.5 y1=14.5 y2=14.5></line> <path class=ql-fill d=M14.5,15a0.5,0.5,0,0,1-.5-0.5V12.085l-0.276.138A0.5,0.5,0,0,1,13.053,12c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,15,11.5v3A0.5,0.5,0,0,1,14.5,15Z></path> </svg>";

/***/ },
/* 92 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=3 y1=4 y2=14></line> <line class=ql-stroke x1=11 x2=11 y1=4 y2=14></line> <line class=ql-stroke x1=11 x2=3 y1=9 y2=9></line> <path class=\"ql-stroke ql-thin\" d=M15.5,14.5h-2c0-.234,1.85-1.076,1.85-2.234a0.959,0.959,0,0,0-1.85-.109></path> </svg>";

/***/ },
/* 93 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=7 x2=13 y1=4 y2=4></line> <line class=ql-stroke x1=5 x2=11 y1=14 y2=14></line> <line class=ql-stroke x1=8 x2=10 y1=14 y2=4></line> </svg>";

/***/ },
/* 94 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <rect class=ql-stroke height=10 width=12 x=3 y=4></rect> <circle class=ql-fill cx=6 cy=7 r=1></circle> <polyline class=\"ql-even ql-fill\" points=\"5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12\"></polyline> </svg>";

/***/ },
/* 95 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class=\"ql-fill ql-stroke\" points=\"3 7 3 11 5 9 3 7\"></polyline> </svg>";

/***/ },
/* 96 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class=ql-stroke points=\"5 7 5 11 3 9 5 7\"></polyline> </svg>";

/***/ },
/* 97 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=7 x2=11 y1=7 y2=11></line> <path class=\"ql-even ql-stroke\" d=M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z></path> <path class=\"ql-even ql-stroke\" d=M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z></path> </svg>";

/***/ },
/* 98 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=7 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=7 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=7 x2=15 y1=14 y2=14></line> <line class=\"ql-stroke ql-thin\" x1=2.5 x2=4.5 y1=5.5 y2=5.5></line> <path class=ql-fill d=M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z></path> <path class=\"ql-stroke ql-thin\" d=M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156></path> <path class=\"ql-stroke ql-thin\" d=M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109></path> </svg>";

/***/ },
/* 99 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=6 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=6 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=6 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=3 y1=4 y2=4></line> <line class=ql-stroke x1=3 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=3 x2=3 y1=14 y2=14></line> </svg>";

/***/ },
/* 100 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z /> <path class=ql-fill d=M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z /> </svg>";

/***/ },
/* 101 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z /> <path class=ql-fill d=M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z /> </svg>";

/***/ },
/* 102 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=\"ql-stroke ql-thin\" x1=15.5 x2=2.5 y1=8.5 y2=9.5></line> <path class=ql-fill d=M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z></path> <path class=ql-fill d=M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z></path> </svg>";

/***/ },
/* 103 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-stroke d=M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3></path> <rect class=ql-fill height=1 rx=0.5 ry=0.5 width=12 x=3 y=15></rect> </svg>";

/***/ },
/* 104 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <rect class=ql-stroke height=12 width=12 x=3 y=3></rect> <rect class=ql-fill height=12 width=1 x=5 y=3></rect> <rect class=ql-fill height=12 width=1 x=12 y=3></rect> <rect class=ql-fill height=2 width=8 x=5 y=8></rect> <rect class=ql-fill height=1 width=3 x=3 y=5></rect> <rect class=ql-fill height=1 width=3 x=3 y=7></rect> <rect class=ql-fill height=1 width=3 x=3 y=10></rect> <rect class=ql-fill height=1 width=3 x=3 y=12></rect> <rect class=ql-fill height=1 width=3 x=12 y=5></rect> <rect class=ql-fill height=1 width=3 x=12 y=7></rect> <rect class=ql-fill height=1 width=3 x=12 y=10></rect> <rect class=ql-fill height=1 width=3 x=12 y=12></rect> </svg>";

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dropdown = __webpack_require__(106);

	var _dropdown2 = _interopRequireDefault(_dropdown);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Picker = function () {
	  function Picker(select) {
	    var _this = this;

	    _classCallCheck(this, Picker);

	    this.select = select;
	    this.container = document.createElement('span');
	    this.buildPicker();
	    this.select.style.display = 'none';
	    this.select.parentNode.insertBefore(this.container, this.select);
	    this.label.addEventListener('click', function () {
	      _this.container.classList.toggle('ql-expanded');
	    });
	    this.select.addEventListener('change', this.update.bind(this));
	  }

	  _createClass(Picker, [{
	    key: 'buildItem',
	    value: function buildItem(option) {
	      var _this2 = this;

	      var item = document.createElement('span');
	      item.classList.add('ql-picker-item');
	      if (option.hasAttribute('value')) {
	        item.setAttribute('data-value', option.getAttribute('value'));
	      }
	      if (option.textContent) {
	        item.setAttribute('data-label', option.textContent);
	      }
	      item.addEventListener('click', function () {
	        _this2.selectItem(item, true);
	      });
	      return item;
	    }
	  }, {
	    key: 'buildLabel',
	    value: function buildLabel() {
	      var label = document.createElement('span');
	      label.classList.add('ql-picker-label');
	      label.innerHTML = _dropdown2.default;
	      this.container.appendChild(label);
	      return label;
	    }
	  }, {
	    key: 'buildOptions',
	    value: function buildOptions() {
	      var _this3 = this;

	      var options = document.createElement('span');
	      options.classList.add('ql-picker-options');
	      [].slice.call(this.select.options).forEach(function (option) {
	        var item = _this3.buildItem(option);
	        options.appendChild(item);
	        if (option.hasAttribute('selected')) {
	          _this3.selectItem(item);
	        }
	      });
	      this.container.appendChild(options);
	    }
	  }, {
	    key: 'buildPicker',
	    value: function buildPicker() {
	      var _this4 = this;

	      [].slice.call(this.select.attributes).forEach(function (item) {
	        _this4.container.setAttribute(item.name, item.value);
	      });
	      this.container.classList.add('ql-picker');
	      this.label = this.buildLabel();
	      this.buildOptions();
	    }
	  }, {
	    key: 'close',
	    value: function close() {
	      this.container.classList.remove('ql-expanded');
	    }
	  }, {
	    key: 'selectItem',
	    value: function selectItem(item) {
	      var trigger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	      var selected = this.container.querySelector('.ql-selected');
	      if (item === selected) return;
	      if (selected != null) {
	        selected.classList.remove('ql-selected');
	      }
	      if (item != null) {
	        item.classList.add('ql-selected');
	        this.select.selectedIndex = [].indexOf.call(item.parentNode.children, item);
	        if (item.hasAttribute('data-value')) {
	          this.label.setAttribute('data-value', item.getAttribute('data-value'));
	        } else {
	          this.label.removeAttribute('data-value');
	        }
	        if (item.hasAttribute('data-label')) {
	          this.label.setAttribute('data-label', item.getAttribute('data-label'));
	        } else {
	          this.label.removeAttribute('data-label');
	        }
	        if (trigger) {
	          if (typeof Event === 'function') {
	            this.select.dispatchEvent(new Event('change'));
	          } else if ((typeof Event === 'undefined' ? 'undefined' : _typeof(Event)) === 'object') {
	            // IE11
	            var event = document.createEvent('Event');
	            event.initEvent('change', true, true);
	            this.select.dispatchEvent(event);
	          }
	          this.close();
	        }
	      } else {
	        this.label.removeAttribute('data-value');
	        this.label.removeAttribute('data-label');
	      }
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var option = void 0;
	      if (this.select.selectedIndex > -1) {
	        var item = this.container.querySelector('.ql-picker-options').children[this.select.selectedIndex];
	        option = this.select.options[this.select.selectedIndex];
	        this.selectItem(item);
	      } else {
	        this.selectItem(null);
	      }
	      var isActive = option != null && option !== this.select.querySelector('option[selected]');
	      this.label.classList.toggle('ql-active', isActive);
	    }
	  }]);

	  return Picker;
	}();

	exports.default = Picker;

/***/ },
/* 106 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <polygon class=ql-stroke points=\"7 11 9 13 11 11 7 11\"></polygon> <polygon class=ql-stroke points=\"7 7 9 5 11 7 7 7\"></polygon> </svg>";

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _picker = __webpack_require__(105);

	var _picker2 = _interopRequireDefault(_picker);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ColorPicker = function (_Picker) {
	  _inherits(ColorPicker, _Picker);

	  function ColorPicker(select, label) {
	    _classCallCheck(this, ColorPicker);

	    var _this = _possibleConstructorReturn(this, (ColorPicker.__proto__ || Object.getPrototypeOf(ColorPicker)).call(this, select));

	    _this.label.innerHTML = label;
	    _this.container.classList.add('ql-color-picker');
	    [].slice.call(_this.container.querySelectorAll('.ql-picker-item'), 0, 7).forEach(function (item) {
	      item.classList.add('ql-primary');
	    });
	    return _this;
	  }

	  _createClass(ColorPicker, [{
	    key: 'buildItem',
	    value: function buildItem(option) {
	      var item = _get(ColorPicker.prototype.__proto__ || Object.getPrototypeOf(ColorPicker.prototype), 'buildItem', this).call(this, option);
	      item.style.backgroundColor = option.getAttribute('value') || '';
	      return item;
	    }
	  }, {
	    key: 'selectItem',
	    value: function selectItem(item, trigger) {
	      _get(ColorPicker.prototype.__proto__ || Object.getPrototypeOf(ColorPicker.prototype), 'selectItem', this).call(this, item, trigger);
	      var colorLabel = this.label.querySelector('.ql-color-label');
	      var value = item ? item.getAttribute('data-value') || '' : '';
	      if (colorLabel) {
	        if (colorLabel.tagName === 'line') {
	          colorLabel.style.stroke = value;
	        } else {
	          colorLabel.style.fill = value;
	        }
	      }
	    }
	  }]);

	  return ColorPicker;
	}(_picker2.default);

	exports.default = ColorPicker;

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _picker = __webpack_require__(105);

	var _picker2 = _interopRequireDefault(_picker);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var IconPicker = function (_Picker) {
	  _inherits(IconPicker, _Picker);

	  function IconPicker(select, icons) {
	    _classCallCheck(this, IconPicker);

	    var _this = _possibleConstructorReturn(this, (IconPicker.__proto__ || Object.getPrototypeOf(IconPicker)).call(this, select));

	    _this.container.classList.add('ql-icon-picker');
	    [].forEach.call(_this.container.querySelectorAll('.ql-picker-item'), function (item) {
	      item.innerHTML = icons[item.getAttribute('data-value') || ''];
	    });
	    _this.defaultItem = _this.container.querySelector('.ql-selected');
	    _this.selectItem(_this.defaultItem);
	    return _this;
	  }

	  _createClass(IconPicker, [{
	    key: 'selectItem',
	    value: function selectItem(item, trigger) {
	      _get(IconPicker.prototype.__proto__ || Object.getPrototypeOf(IconPicker.prototype), 'selectItem', this).call(this, item, trigger);
	      item = item || this.defaultItem;
	      this.label.innerHTML = item.innerHTML;
	    }
	  }]);

	  return IconPicker;
	}(_picker2.default);

	exports.default = IconPicker;

/***/ },
/* 109 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Tooltip = function () {
	  function Tooltip(quill, boundsContainer) {
	    var _this = this;

	    _classCallCheck(this, Tooltip);

	    this.quill = quill;
	    this.boundsContainer = boundsContainer || document.body;
	    this.root = quill.addContainer('ql-tooltip');
	    this.root.innerHTML = this.constructor.TEMPLATE;
	    var offset = parseInt(window.getComputedStyle(this.root).marginTop);
	    this.quill.root.addEventListener('scroll', function () {
	      _this.root.style.marginTop = -1 * _this.quill.root.scrollTop + offset + 'px';
	      _this.checkBounds();
	    });
	    this.hide();
	  }

	  _createClass(Tooltip, [{
	    key: 'checkBounds',
	    value: function checkBounds() {
	      this.root.classList.toggle('ql-out-top', this.root.offsetTop <= 0);
	      this.root.classList.remove('ql-out-bottom');
	      this.root.classList.toggle('ql-out-bottom', this.root.offsetTop + this.root.offsetHeight >= this.quill.root.offsetHeight);
	    }
	  }, {
	    key: 'hide',
	    value: function hide() {
	      this.root.classList.add('ql-hidden');
	    }
	  }, {
	    key: 'position',
	    value: function position(reference) {
	      var left = reference.left + reference.width / 2 - this.root.offsetWidth / 2;
	      var top = reference.bottom + this.quill.root.scrollTop;
	      this.root.style.left = left + 'px';
	      this.root.style.top = top + 'px';
	      var containerBounds = this.boundsContainer.getBoundingClientRect();
	      var rootBounds = this.root.getBoundingClientRect();
	      var shift = 0;
	      if (rootBounds.right > containerBounds.right) {
	        shift = containerBounds.right - rootBounds.right;
	        this.root.style.left = left + shift + 'px';
	      }
	      if (rootBounds.left < containerBounds.left) {
	        shift = containerBounds.left - rootBounds.left;
	        this.root.style.left = left + shift + 'px';
	      }
	      this.checkBounds();
	      return shift;
	    }
	  }, {
	    key: 'show',
	    value: function show() {
	      this.root.classList.remove('ql-editing');
	      this.root.classList.remove('ql-hidden');
	    }
	  }]);

	  return Tooltip;
	}();

	exports.default = Tooltip;

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.BubbleTooltip = undefined;

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _extend = __webpack_require__(30);

	var _extend2 = _interopRequireDefault(_extend);

	var _emitter = __webpack_require__(36);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _base = __webpack_require__(111);

	var _base2 = _interopRequireDefault(_base);

	var _selection = __webpack_require__(44);

	var _icons = __webpack_require__(73);

	var _icons2 = _interopRequireDefault(_icons);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TOOLBAR_CONFIG = [['bold', 'italic', 'link'], [{ header: 1 }, { header: 2 }, 'blockquote']];

	var BubbleTheme = function (_BaseTheme) {
	  _inherits(BubbleTheme, _BaseTheme);

	  function BubbleTheme(quill, options) {
	    _classCallCheck(this, BubbleTheme);

	    if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
	      options.modules.toolbar.container = TOOLBAR_CONFIG;
	    }

	    var _this = _possibleConstructorReturn(this, (BubbleTheme.__proto__ || Object.getPrototypeOf(BubbleTheme)).call(this, quill, options));

	    _this.quill.container.classList.add('ql-bubble');
	    return _this;
	  }

	  _createClass(BubbleTheme, [{
	    key: 'extendToolbar',
	    value: function extendToolbar(toolbar) {
	      this.tooltip = new BubbleTooltip(this.quill, this.options.bounds);
	      this.tooltip.root.appendChild(toolbar.container);
	      this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')), _icons2.default);
	      this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')), _icons2.default);
	    }
	  }]);

	  return BubbleTheme;
	}(_base2.default);

	BubbleTheme.DEFAULTS = (0, _extend2.default)(true, {}, _base2.default.DEFAULTS, {
	  modules: {
	    toolbar: {
	      handlers: {
	        link: function link(value) {
	          if (!value) {
	            this.quill.format('link', false);
	          } else {
	            this.quill.theme.tooltip.edit();
	          }
	        }
	      }
	    }
	  }
	});

	var BubbleTooltip = function (_BaseTooltip) {
	  _inherits(BubbleTooltip, _BaseTooltip);

	  function BubbleTooltip(quill, bounds) {
	    _classCallCheck(this, BubbleTooltip);

	    var _this2 = _possibleConstructorReturn(this, (BubbleTooltip.__proto__ || Object.getPrototypeOf(BubbleTooltip)).call(this, quill, bounds));

	    _this2.quill.on(_emitter2.default.events.EDITOR_CHANGE, function (type, range) {
	      if (type !== _emitter2.default.events.SELECTION_CHANGE) return;
	      if (range != null && range.length > 0) {
	        _this2.show();
	        // Lock our width so we will expand beyond our offsetParent boundaries
	        _this2.root.style.left = '0px';
	        _this2.root.style.width = '';
	        _this2.root.style.width = _this2.root.offsetWidth + 'px';
	        var lines = _this2.quill.scroll.lines(range.index, range.length);
	        if (lines.length === 1) {
	          _this2.position(_this2.quill.getBounds(range));
	        } else {
	          var lastLine = lines[lines.length - 1];
	          var index = lastLine.offset(_this2.quill.scroll);
	          var length = Math.min(lastLine.length() - 1, range.index + range.length - index);
	          var _bounds = _this2.quill.getBounds(new _selection.Range(index, length));
	          _this2.position(_bounds);
	        }
	      } else if (document.activeElement !== _this2.textbox && _this2.quill.hasFocus()) {
	        _this2.hide();
	      }
	    });
	    return _this2;
	  }

	  _createClass(BubbleTooltip, [{
	    key: 'listen',
	    value: function listen() {
	      var _this3 = this;

	      _get(BubbleTooltip.prototype.__proto__ || Object.getPrototypeOf(BubbleTooltip.prototype), 'listen', this).call(this);
	      this.root.querySelector('.ql-close').addEventListener('click', function () {
	        _this3.root.classList.remove('ql-editing');
	      });
	      this.quill.on(_emitter2.default.events.SCROLL_OPTIMIZE, function () {
	        // Let selection be restored by toolbar handlers before repositioning
	        setTimeout(function () {
	          if (_this3.root.classList.contains('ql-hidden')) return;
	          var range = _this3.quill.getSelection();
	          if (range != null) {
	            _this3.position(_this3.quill.getBounds(range));
	          }
	        }, 1);
	      });
	    }
	  }, {
	    key: 'cancel',
	    value: function cancel() {
	      this.show();
	    }
	  }, {
	    key: 'position',
	    value: function position(reference) {
	      var shift = _get(BubbleTooltip.prototype.__proto__ || Object.getPrototypeOf(BubbleTooltip.prototype), 'position', this).call(this, reference);
	      var arrow = this.root.querySelector('.ql-tooltip-arrow');
	      arrow.style.marginLeft = '';
	      if (shift === 0) return shift;
	      arrow.style.marginLeft = -1 * shift - arrow.offsetWidth / 2 + 'px';
	    }
	  }]);

	  return BubbleTooltip;
	}(_base.BaseTooltip);

	BubbleTooltip.TEMPLATE = ['<span class="ql-tooltip-arrow"></span>', '<div class="ql-tooltip-editor">', '<input type="text" data-formula="e=mc^2" data-link="quilljs.com" data-video="Embed URL">', '<a class="ql-close"></a>', '</div>'].join('');

	exports.BubbleTooltip = BubbleTooltip;
	exports.default = BubbleTheme;

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.BaseTooltip = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _extend = __webpack_require__(30);

	var _extend2 = _interopRequireDefault(_extend);

	var _quillDelta = __webpack_require__(20);

	var _quillDelta2 = _interopRequireDefault(_quillDelta);

	var _emitter = __webpack_require__(36);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _keyboard = __webpack_require__(56);

	var _keyboard2 = _interopRequireDefault(_keyboard);

	var _theme = __webpack_require__(45);

	var _theme2 = _interopRequireDefault(_theme);

	var _colorPicker = __webpack_require__(107);

	var _colorPicker2 = _interopRequireDefault(_colorPicker);

	var _iconPicker = __webpack_require__(108);

	var _iconPicker2 = _interopRequireDefault(_iconPicker);

	var _picker = __webpack_require__(105);

	var _picker2 = _interopRequireDefault(_picker);

	var _tooltip = __webpack_require__(109);

	var _tooltip2 = _interopRequireDefault(_tooltip);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ALIGNS = [false, 'center', 'right', 'justify'];

	var COLORS = ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"];

	var FONTS = [false, 'serif', 'monospace'];

	var HEADERS = ['1', '2', '3', false];

	var SIZES = ['small', false, 'large', 'huge'];

	var BaseTheme = function (_Theme) {
	  _inherits(BaseTheme, _Theme);

	  function BaseTheme(quill, options) {
	    _classCallCheck(this, BaseTheme);

	    var _this = _possibleConstructorReturn(this, (BaseTheme.__proto__ || Object.getPrototypeOf(BaseTheme)).call(this, quill, options));

	    var listener = function listener(e) {
	      if (!document.body.contains(quill.root)) {
	        return document.body.removeEventListener('click', listener);
	      }
	      if (_this.tooltip != null && !_this.tooltip.root.contains(e.target) && document.activeElement !== _this.tooltip.textbox && !_this.quill.hasFocus()) {
	        _this.tooltip.hide();
	      }
	      if (_this.pickers != null) {
	        _this.pickers.forEach(function (picker) {
	          if (!picker.container.contains(e.target)) {
	            picker.close();
	          }
	        });
	      }
	    };
	    document.body.addEventListener('click', listener);
	    return _this;
	  }

	  _createClass(BaseTheme, [{
	    key: 'addModule',
	    value: function addModule(name) {
	      var module = _get(BaseTheme.prototype.__proto__ || Object.getPrototypeOf(BaseTheme.prototype), 'addModule', this).call(this, name);
	      if (name === 'toolbar') {
	        this.extendToolbar(module);
	      }
	      return module;
	    }
	  }, {
	    key: 'buildButtons',
	    value: function buildButtons(buttons, icons) {
	      buttons.forEach(function (button) {
	        var className = button.getAttribute('class') || '';
	        className.split(/\s+/).forEach(function (name) {
	          if (!name.startsWith('ql-')) return;
	          name = name.slice('ql-'.length);
	          if (icons[name] == null) return;
	          if (name === 'direction') {
	            button.innerHTML = icons[name][''] + icons[name]['rtl'];
	          } else if (typeof icons[name] === 'string') {
	            button.innerHTML = icons[name];
	          } else {
	            var value = button.value || '';
	            if (value != null && icons[name][value]) {
	              button.innerHTML = icons[name][value];
	            }
	          }
	        });
	      });
	    }
	  }, {
	    key: 'buildPickers',
	    value: function buildPickers(selects, icons) {
	      var _this2 = this;

	      this.pickers = selects.map(function (select) {
	        if (select.classList.contains('ql-align')) {
	          if (select.querySelector('option') == null) {
	            fillSelect(select, ALIGNS);
	          }
	          return new _iconPicker2.default(select, icons.align);
	        } else if (select.classList.contains('ql-background') || select.classList.contains('ql-color')) {
	          var format = select.classList.contains('ql-background') ? 'background' : 'color';
	          if (select.querySelector('option') == null) {
	            fillSelect(select, COLORS, format === 'background' ? '#ffffff' : '#000000');
	          }
	          return new _colorPicker2.default(select, icons[format]);
	        } else {
	          if (select.querySelector('option') == null) {
	            if (select.classList.contains('ql-font')) {
	              fillSelect(select, FONTS);
	            } else if (select.classList.contains('ql-header')) {
	              fillSelect(select, HEADERS);
	            } else if (select.classList.contains('ql-size')) {
	              fillSelect(select, SIZES);
	            }
	          }
	          return new _picker2.default(select);
	        }
	      });
	      var update = function update() {
	        _this2.pickers.forEach(function (picker) {
	          picker.update();
	        });
	      };
	      this.quill.on(_emitter2.default.events.SELECTION_CHANGE, update).on(_emitter2.default.events.SCROLL_OPTIMIZE, update);
	    }
	  }]);

	  return BaseTheme;
	}(_theme2.default);

	BaseTheme.DEFAULTS = (0, _extend2.default)(true, {}, _theme2.default.DEFAULTS, {
	  modules: {
	    toolbar: {
	      handlers: {
	        formula: function formula() {
	          this.quill.theme.tooltip.edit('formula');
	        },
	        image: function image() {
	          var _this3 = this;

	          var fileInput = this.container.querySelector('input.ql-image[type=file]');
	          if (fileInput == null) {
	            fileInput = document.createElement('input');
	            fileInput.setAttribute('type', 'file');
	            fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon, image/svg+xml');
	            fileInput.classList.add('ql-image');
	            fileInput.addEventListener('change', function () {
	              if (fileInput.files != null && fileInput.files[0] != null) {
	                var reader = new FileReader();
	                reader.onload = function (e) {
	                  var range = _this3.quill.getSelection(true);
	                  _this3.quill.updateContents(new _quillDelta2.default().retain(range.index).delete(range.length).insert({ image: e.target.result }), _emitter2.default.sources.USER);
	                  fileInput.value = "";
	                };
	                reader.readAsDataURL(fileInput.files[0]);
	              }
	            });
	            this.container.appendChild(fileInput);
	          }
	          fileInput.click();
	        },
	        video: function video() {
	          this.quill.theme.tooltip.edit('video');
	        }
	      }
	    }
	  }
	});

	var BaseTooltip = function (_Tooltip) {
	  _inherits(BaseTooltip, _Tooltip);

	  function BaseTooltip(quill, boundsContainer) {
	    _classCallCheck(this, BaseTooltip);

	    var _this4 = _possibleConstructorReturn(this, (BaseTooltip.__proto__ || Object.getPrototypeOf(BaseTooltip)).call(this, quill, boundsContainer));

	    _this4.textbox = _this4.root.querySelector('input[type="text"]');
	    _this4.listen();
	    return _this4;
	  }

	  _createClass(BaseTooltip, [{
	    key: 'listen',
	    value: function listen() {
	      var _this5 = this;

	      this.textbox.addEventListener('keydown', function (event) {
	        if (_keyboard2.default.match(event, 'enter')) {
	          _this5.save();
	          event.preventDefault();
	        } else if (_keyboard2.default.match(event, 'escape')) {
	          _this5.cancel();
	          event.preventDefault();
	        }
	      });
	    }
	  }, {
	    key: 'cancel',
	    value: function cancel() {
	      this.hide();
	    }
	  }, {
	    key: 'edit',
	    value: function edit() {
	      var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'link';
	      var preview = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	      this.root.classList.remove('ql-hidden');
	      this.root.classList.add('ql-editing');
	      if (preview != null) {
	        this.textbox.value = preview;
	      } else if (mode !== this.root.getAttribute('data-mode')) {
	        this.textbox.value = '';
	      }
	      this.position(this.quill.getBounds(this.quill.selection.savedRange));
	      this.textbox.select();
	      this.textbox.setAttribute('placeholder', this.textbox.getAttribute('data-' + mode) || '');
	      this.root.setAttribute('data-mode', mode);
	    }
	  }, {
	    key: 'restoreFocus',
	    value: function restoreFocus() {
	      var scrollTop = this.quill.root.scrollTop;
	      this.quill.focus();
	      this.quill.root.scrollTop = scrollTop;
	    }
	  }, {
	    key: 'save',
	    value: function save() {
	      var value = this.textbox.value;
	      switch (this.root.getAttribute('data-mode')) {
	        case 'link':
	          {
	            var scrollTop = this.quill.root.scrollTop;
	            if (this.linkRange) {
	              this.quill.formatText(this.linkRange, 'link', value, _emitter2.default.sources.USER);
	              delete this.linkRange;
	            } else {
	              this.restoreFocus();
	              this.quill.format('link', value, _emitter2.default.sources.USER);
	            }
	            this.quill.root.scrollTop = scrollTop;
	            break;
	          }
	        case 'video':
	          {
	            var match = value.match(/^(https?):\/\/(www\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) || value.match(/^(https?):\/\/(www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
	            if (match) {
	              value = match[1] + '://www.youtube.com/embed/' + match[3] + '?showinfo=0';
	            } else if (match = value.match(/^(https?):\/\/(www\.)?vimeo\.com\/(\d+)/)) {
	              // eslint-disable-line no-cond-assign
	              value = match[1] + '://player.vimeo.com/video/' + match[3] + '/';
	            }
	          } // eslint-disable-next-line no-fallthrough
	        case 'formula':
	          {
	            var range = this.quill.getSelection(true);
	            var index = range.index + range.length;
	            if (range != null) {
	              this.quill.insertEmbed(index, this.root.getAttribute('data-mode'), value, _emitter2.default.sources.USER);
	              if (this.root.getAttribute('data-mode') === 'formula') {
	                this.quill.insertText(index + 1, ' ', _emitter2.default.sources.USER);
	              }
	              this.quill.setSelection(index + 2, _emitter2.default.sources.USER);
	            }
	            break;
	          }
	        default:
	      }
	      this.textbox.value = '';
	      this.hide();
	    }
	  }]);

	  return BaseTooltip;
	}(_tooltip2.default);

	function fillSelect(select, values) {
	  var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	  values.forEach(function (value) {
	    var option = document.createElement('option');
	    if (value === defaultValue) {
	      option.setAttribute('selected', 'selected');
	    } else {
	      option.setAttribute('value', value);
	    }
	    select.appendChild(option);
	  });
	}

	exports.BaseTooltip = BaseTooltip;
	exports.default = BaseTheme;

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _extend = __webpack_require__(30);

	var _extend2 = _interopRequireDefault(_extend);

	var _emitter = __webpack_require__(36);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _base = __webpack_require__(111);

	var _base2 = _interopRequireDefault(_base);

	var _link = __webpack_require__(64);

	var _link2 = _interopRequireDefault(_link);

	var _selection = __webpack_require__(44);

	var _icons = __webpack_require__(73);

	var _icons2 = _interopRequireDefault(_icons);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TOOLBAR_CONFIG = [[{ header: ['1', '2', '3', false] }], ['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']];

	var SnowTheme = function (_BaseTheme) {
	  _inherits(SnowTheme, _BaseTheme);

	  function SnowTheme(quill, options) {
	    _classCallCheck(this, SnowTheme);

	    if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
	      options.modules.toolbar.container = TOOLBAR_CONFIG;
	    }

	    var _this = _possibleConstructorReturn(this, (SnowTheme.__proto__ || Object.getPrototypeOf(SnowTheme)).call(this, quill, options));

	    _this.quill.container.classList.add('ql-snow');
	    return _this;
	  }

	  _createClass(SnowTheme, [{
	    key: 'extendToolbar',
	    value: function extendToolbar(toolbar) {
	      toolbar.container.classList.add('ql-snow');
	      this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')), _icons2.default);
	      this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')), _icons2.default);
	      this.tooltip = new SnowTooltip(this.quill, this.options.bounds);
	      if (toolbar.container.querySelector('.ql-link')) {
	        this.quill.keyboard.addBinding({ key: 'K', shortKey: true }, function (range, context) {
	          toolbar.handlers['link'].call(toolbar, !context.format.link);
	        });
	      }
	    }
	  }]);

	  return SnowTheme;
	}(_base2.default);

	SnowTheme.DEFAULTS = (0, _extend2.default)(true, {}, _base2.default.DEFAULTS, {
	  modules: {
	    toolbar: {
	      handlers: {
	        link: function link(value) {
	          if (value) {
	            var range = this.quill.getSelection();
	            if (range == null || range.length == 0) return;
	            var preview = this.quill.getText(range);
	            if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf('mailto:') !== 0) {
	              preview = 'mailto:' + preview;
	            }
	            var tooltip = this.quill.theme.tooltip;
	            tooltip.edit('link', preview);
	          } else {
	            this.quill.format('link', false);
	          }
	        }
	      }
	    }
	  }
	});

	var SnowTooltip = function (_BaseTooltip) {
	  _inherits(SnowTooltip, _BaseTooltip);

	  function SnowTooltip(quill, bounds) {
	    _classCallCheck(this, SnowTooltip);

	    var _this2 = _possibleConstructorReturn(this, (SnowTooltip.__proto__ || Object.getPrototypeOf(SnowTooltip)).call(this, quill, bounds));

	    _this2.preview = _this2.root.querySelector('a.ql-preview');
	    return _this2;
	  }

	  _createClass(SnowTooltip, [{
	    key: 'listen',
	    value: function listen() {
	      var _this3 = this;

	      _get(SnowTooltip.prototype.__proto__ || Object.getPrototypeOf(SnowTooltip.prototype), 'listen', this).call(this);
	      this.root.querySelector('a.ql-action').addEventListener('click', function (event) {
	        if (_this3.root.classList.contains('ql-editing')) {
	          _this3.save();
	        } else {
	          _this3.edit('link', _this3.preview.textContent);
	        }
	        event.preventDefault();
	      });
	      this.root.querySelector('a.ql-remove').addEventListener('click', function (event) {
	        if (_this3.linkRange != null) {
	          _this3.restoreFocus();
	          _this3.quill.formatText(_this3.linkRange, 'link', false, _emitter2.default.sources.USER);
	          delete _this3.linkRange;
	        }
	        event.preventDefault();
	        _this3.hide();
	      });
	      this.quill.on(_emitter2.default.events.SELECTION_CHANGE, function (range) {
	        if (range == null) return;
	        if (range.length === 0) {
	          var _quill$scroll$descend = _this3.quill.scroll.descendant(_link2.default, range.index),
	              _quill$scroll$descend2 = _slicedToArray(_quill$scroll$descend, 2),
	              link = _quill$scroll$descend2[0],
	              offset = _quill$scroll$descend2[1];

	          if (link != null) {
	            _this3.linkRange = new _selection.Range(range.index - offset, link.length());
	            var preview = _link2.default.formats(link.domNode);
	            _this3.preview.textContent = preview;
	            _this3.preview.setAttribute('href', preview);
	            _this3.show();
	            _this3.position(_this3.quill.getBounds(_this3.linkRange));
	            return;
	          }
	        } else {
	          delete _this3.linkRange;
	        }
	        _this3.hide();
	      });
	    }
	  }, {
	    key: 'show',
	    value: function show() {
	      _get(SnowTooltip.prototype.__proto__ || Object.getPrototypeOf(SnowTooltip.prototype), 'show', this).call(this);
	      this.root.removeAttribute('data-mode');
	    }
	  }]);

	  return SnowTooltip;
	}(_base.BaseTooltip);

	SnowTooltip.TEMPLATE = ['<a class="ql-preview" target="_blank" href="about:blank"></a>', '<input type="text" data-formula="e=mc^2" data-link="quilljs.com" data-video="Embed URL">', '<a class="ql-action"></a>', '<a class="ql-remove"></a>'].join('');

	exports.default = SnowTheme;

/***/ }
/******/ ])
});
;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10).Buffer))

/***/ },
/* 48 */
/***/ function(module, exports) {

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


/***/ },
/* 49 */
/***/ function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
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

exports.isBuffer = __webpack_require__(49);

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
exports.inherits = __webpack_require__(48);

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8), __webpack_require__(46)))

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

const EventEmitter = __webpack_require__(3);

class Element extends EventEmitter {
  constructor(node) {
    super();

    this.node = node;
  }

  getAttribute(name) {
    return this.node.getAttribute(name);
  }
  setAttribute(name, value) {
    const v = this.node.setAttribute(name, value);

    this.emit('change', {
      type: 'attribute',
      name: name,
      value: value
    });

    return v;
  }

  getStyle(name) {
    return this.node.style[name];
  }
  getStyles(names) {
    return names.reduce((a, n) => {
      a[n] = this.getStyle(n);
      return a;
    }, {});
  }
  setStyle(name, value) {
    this.node.style[name] = value;

    this.emit('change', {
      type: 'style',
      name: name,
      value: value
    });
  }
  setHtml(html) {
    this.node.innerHTML = html;

    this.emit('change', {
      type: 'html',
      value: html
    });
  }
  getHtml() {
    return this.node.innerHTML;
  }
  getTag() {
    return this.node.tagName.toLowerCase();
  }

  remove() {
    this.node.parentNode.removeChild(this.node);

    this.emit('change', {
      type: 'remove'
    });
  }

  // call to work with real node
  withNode(fn) {
    fn(this.node);
    this.emit('change', {
      type: 'custom'
    });
  }
}

module.exports = Element;



/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

const Element = __webpack_require__(51);
const EventEmmiter = __webpack_require__(3);

class Frame extends EventEmmiter {
  constructor(options) {
    super();
    this.prefix = options.prefix;
    this.current = {};
    this.node = document.createElement('iframe');
    this.node.className = this.prefix;

    this.node.addEventListener('load', this._onLoad.bind(this));
    this.node.srcdoc = options.code;
  }

  getNode() {
    return this.node;
  }

  getHtml() {
    const doc = this.node.contentDocument;
    if (!doc) {
      return '';
    }
    const root = doc.documentElement;
    if (!root) {
      return '';
    }

    const st = doc.getElementById('editro-frame-style');
    if (st) {
      st.parentNode.removeChild(st);
    }
    const html = root.outerHTML; 
    this._addServiceNodes();

    return '<!doctype html>\n' + html;
  }

  setHtml(code) {
    this.node.srcdoc = code;
  }

  selectByQuery(query) {
    const doc = this.node.contentDocument;
    if (doc) {
      const el = doc.querySelector(query);
      if (el) {
        this._select(el);
      }
    }
  }

  _onLoad() {
    const { contentDocument } = this.node;
    const body = contentDocument.body;

    this._addServiceNodes();

    // remove if few selected, select first
    const current = body.querySelectorAll('[editro-current]');
    if (current.length) {
      [].slice.call(current, 1).forEach(n => n.removeAttribute('editro-current'));
      this._select(current[0], true);
    } else {
      this.emit('deselected');
    }

    body.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      this._select(e.target);
    }, true);

    this.emit('load', {
      html: this.getHtml()
    });
  }

  _select(node, silenced) {
    if (this.current.el) {
      this.current.node.removeAttribute('editro-current');
      this.current.el.emit('deattached');
      this.current.el.removeAllListeners('change');
    }

    this.current.node = node;
    node.setAttribute('editro-current', '');
    const el = new Element(node);
    this.current.el = el;

    el.on('change', () => {
      this.emit('change', {
        element: el,
        html: this.getHtml()
      });
    });

    this.emit('selected', el);
    if (!silenced) {
      this.emit('change', {
        html: this.getHtml()
      });
    }
  }

  _onMutate(e) {
    this.emit('change', {
      html: this.getHtml()
    });
  }

  _addServiceNodes() {
    const doc = this.node.contentDocument;
    let st = doc.getElementById('editro-frame-style');
    if (!st) {
      st = doc.createElement('style');
      st.id = 'editro-frame-style';
      st.innerHTML = `
        * {
          cursor: pointer;
        }
        [editro-current] {
          outline-color: #5020e2;
          outline-offset: 4px;
          outline-style: dashed;
          outline-width: 4px;
        }
      `;
      doc.head.appendChild(st);
    }
  }
}


module.exports = Frame;


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

const { elem, elems, is } = __webpack_require__(1);

/*
 * Toolbox class. Represent panel with tools.
 */
class Toolbox {
  constructor(editro) {
    this.element = null;

    this.node = document.createElement('div');
    this.node.className = 'EditroToolbox';
    this.node.innerHTML = `
      <div class="EditroToolbox-placeholder">
        Click on element to select
      </div>
    `;

    editro.on('selected',
      () => this.node.querySelector('.EditroToolbox-placeholder').style.display = 'none');
    editro.on('deselected',
      () => this.node.querySelector('.EditroToolbox-placeholder').style.display = 'block');
  }

  getNode() {
    return this.node;
  }

  addControl(paneName, node) {
    const pane = this._getPane(paneName);
    pane.appendChild(node);
  }
}


module.exports = Toolbox;


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Component__);



/**
 * config = {type: 'delete', text: 'Delete'}
 */
module.exports = class ActionButtonComponent extends __WEBPACK_IMPORTED_MODULE_0__Component___default.a {
  template() {
    return `<button class="EditroAction EditroAction--${this.config.type}">
              <span class="EditroAction-text">
                ${this.config.text}
              </span>
            </button>`;
  }

  watch() {
    this.addListener(this.el.firstChild, 'click', () => this.emit('change'));
  }
}


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__BaseCompositeComponent__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__BaseCompositeComponent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__BaseCompositeComponent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__SelectComponent__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__SelectComponent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__SelectComponent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ColorComponent__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ColorComponent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__ColorComponent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ColorPlaceholderComponent__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ImageComponent__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ImageComponent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__ImageComponent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__utils__);









const visibleIf = isVisible => isVisible ? 'flex' : 'none';


class BackgroundColorComponent extends __WEBPACK_IMPORTED_MODULE_1__BaseCompositeComponent___default.a {
  getSubComponentsFactories() {
    return [
      {
        component: () => new __WEBPACK_IMPORTED_MODULE_3__ColorComponent___default.a(this.value.color1, {
          label: this.config.i18n('Main background color')
        }),
        onChange: color => {
          this.value.color1 = color;
        }
      },
      {
        component: () => new __WEBPACK_IMPORTED_MODULE_4__ColorPlaceholderComponent__["default"](null, {
          label: this.config.i18n('Second background color')
        }),
        onChange: () => {
          this.value.hasGradient = true;
        }
      },
      {
        component: () => new __WEBPACK_IMPORTED_MODULE_3__ColorComponent___default.a(this.value.color2, {
          label: this.config.i18n('Second background color')
        }),
        onChange: color => {
          this.value.color2 = color;
        }
      },
      {
        component: () => new __WEBPACK_IMPORTED_MODULE_2__SelectComponent___default.a(this.value.gradientDirection, {
          choices: ['to right', 'to right bottom', 'to bottom', 'to left bottom'].map(grad => [grad, this.config.i18n(grad)]),
          label: this.config.i18n('Gradient direction')
        }),
        onChange: gradientDirection => {
          this.value.gradientDirection = gradientDirection;
        }
      }
    ];
  }

  render() {
    super.render();

    const toggler = this.el.children[1];
    const color2 = this.el.children[2];
    const gradient = this.el.children[3];
    const toggle = () => {
      toggler.style.display = visibleIf(!this.value.hasGradient);
      color2.style.display = visibleIf(this.value.hasGradient);
      gradient.style.display = visibleIf(this.value.hasGradient);
    };

    toggle(this.value.hasGradient);
    this.on('change', toggle);
  }
}


class BackgroundImageComponent extends __WEBPACK_IMPORTED_MODULE_1__BaseCompositeComponent___default.a {
  getSubComponentsFactories() {
    return [
      {
        component: () => new __WEBPACK_IMPORTED_MODULE_5__ImageComponent___default.a(this.value.backgroundImage, {
          label: this.config.i18n('Background image'),
          upload: this.config.upload
        }),
        onChange: image => {
          this.value.backgroundImage = image;
        }
      },
      {
        component: () => new __WEBPACK_IMPORTED_MODULE_2__SelectComponent___default.a(this.value.backgroundSize, {
          choices: ['auto', 'cover', 'contain'].map(bgSize => [bgSize, this.config.i18n(bgSize)]),
          label: this.config.i18n('Background size')
        }),
        onChange: backgroundSize => {
          this.value.backgroundSize = backgroundSize;
        }
      },
      {
        component: () => new __WEBPACK_IMPORTED_MODULE_2__SelectComponent___default.a(this.value.backgroundPosition, {
          choices: [
            ['0 0', this.config.i18n('Top left corner')],
            ['100% 0', this.config.i18n('Top right corner')],
            ['0 100%', this.config.i18n('Bottom left corner')],
            ['100% 100%', this.config.i18n('Bottom right corner')],
            ['50% 50%', this.config.i18n('Center')]
          ],
          label: this.config.i18n('Background position')
        }),
        onChange: backgroundPosition => {
          this.value.backgroundPosition = backgroundPosition;
        }
      }
    ];
  }

  render() {
    super.render();

    const size = this.el.children[1];
    const position = this.el.children[2];
    const toggle = () => {
      size.style.display = visibleIf(this.value.backgroundImage);
      position.style.display = visibleIf(this.value.backgroundImage);
    };

    toggle(this.value.backgroundImage);
    this.on('change', toggle);
  }
}


module.exports = class BackgroundComponent extends __WEBPACK_IMPORTED_MODULE_0__Component___default.a {
  render() {
    this.el = document.createDocumentFragment();
    ([
      new BackgroundColorComponent(this.value, {
        i18n: this.config.i18n
      }),
      new BackgroundImageComponent(this.value, {
        i18n: this.config.i18n,
        upload: this.config.upload
      })
    ]).forEach(component => {
      component.on('change', value => {
        this.emit('change', value);
      });

      this.el.appendChild(component.el);
    });
  }
};


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BaseCompositeComponent__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BaseCompositeComponent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__BaseCompositeComponent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__InputComponent__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__InputComponent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__InputComponent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ColorComponent__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ColorComponent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__ColorComponent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__TogglerComponent__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__utils__);







module.exports = class BorderComponent extends __WEBPACK_IMPORTED_MODULE_0__BaseCompositeComponent___default.a {
  getSubComponentsFactories() {
    const subComponents = [
      {
        component: () => new __WEBPACK_IMPORTED_MODULE_1__InputComponent___default.a(this.value.oneValue[0], {
          type: 'number',
          unit: 'px',
          label: this.config.i18n('Border width'),
          class: 'EditroToggler-less'
        }),
        onChange: value => {
          this.value.oneValue[0] = value;
        }
      },
      {
        component: () => new __WEBPACK_IMPORTED_MODULE_2__ColorComponent___default.a(this.value.oneValue[1], {
          label: this.config.i18n('Border color'),
          class: 'EditroToggler-less'
        }),
        onChange: value => {
          this.value.oneValue[1] = value;
        }
      }
    ];

    ['Top', 'Right', 'Bottom', 'Left'].forEach((side, i) => {
      subComponents.push({
        component: () => new __WEBPACK_IMPORTED_MODULE_1__InputComponent___default.a(this.value.components[i][0], {
          type: 'number',
          unit: 'px',
          label: this.config.i18n(`${side} border width`),
          class: 'EditroToggler-more'
        }),
        onChange: value => {
          this.value.components[i][0] = value;
        }
      });
      subComponents.push({
        component: () => new __WEBPACK_IMPORTED_MODULE_2__ColorComponent___default.a(this.value.components[i][1], {
          label: this.config.i18n(`${side} border color`),
          class: 'EditroToggler-more'
        }),
        onChange: value => {
          this.value.components[i][1] = value;
        }
      });
    });

    subComponents.push({
      component: () => new __WEBPACK_IMPORTED_MODULE_3__TogglerComponent__["default"](this.value.showComponents, {
        label: this.config.i18n('expand')
      }),
      onChange: value => {
        this.value.showComponents = value;
        this.toggle();
      }
    });

    return subComponents;
  }

  render() {
    super.render();

    const newEl = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__utils__["createDocumentFragment"])('<div class="EditroToggler EditroToggler--full"></div>');
    this.toggler = newEl.firstChild;
    this.toggler.appendChild(this.el);
    this.el = newEl;

    this.toggle();
  }

  toggle() {
    this.toggler.setAttribute('collapsed', String(!this.value.showComponents));

    const el = i => this.toggler.children[i].querySelector('input') || document.createElement('input');

    if (this.value.showComponents) {
      el(2).value = el(4).value = el(6).value = el(8).value = el(0).value;
      el(3).value = el(5).value = el(7).value = el(9).value = el(1).value;
    } else {
      el(0).value = el(2).value;
      el(1).value = el(3).value;
    }

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__utils__["emitDomEvent"])(this.toggler.querySelectorAll('input'), 'change');
  }
};


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BaseCompositeComponent__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BaseCompositeComponent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__BaseCompositeComponent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__InputComponent__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__InputComponent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__InputComponent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__TogglerComponent__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__utils__);






module.exports = class BorderRadiusComponent extends __WEBPACK_IMPORTED_MODULE_0__BaseCompositeComponent___default.a {
  getSubComponentsFactories() {
    const subComponents = [
      {
        component: () => new __WEBPACK_IMPORTED_MODULE_1__InputComponent___default.a(this.value.oneValue, {
          type: 'number',
          unit: 'px',
          label: this.config.i18n('Border radius'),
          class: 'EditroToggler-less'
        }),
        onChange: value => {
          this.value.oneValue = value;
        }
      }
    ];

    ['Top right', 'Bottom right', 'Bottom left', 'Top left'].forEach((corner, i) => {
      subComponents.push({
        component: () => new __WEBPACK_IMPORTED_MODULE_1__InputComponent___default.a(this.value.components[i], {
          type: 'number',
          unit: 'px',
          label: this.config.i18n(`${corner} border radius`),
          class: 'EditroToggler-more'
        }),
        onChange: value => {
          this.value.components[i] = value;
        }
      });
    });

    subComponents.push({
      component: () => new __WEBPACK_IMPORTED_MODULE_2__TogglerComponent__["default"](this.value.showComponents, {
        label: this.config.i18n('expand')
      }),
      onChange: value => {
        this.value.showComponents = value;
        this.toggle();
      }
    });

    return subComponents;
  }

  render() {
    super.render();

    const newEl = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils__["createDocumentFragment"])('<div class="EditroToggler EditroToggler--full"></div>');
    this.toggler = newEl.firstChild;
    this.toggler.appendChild(this.el);
    this.el = newEl;

    this.toggle();
  }

  toggle() {
    this.toggler.setAttribute('collapsed', String(!this.value.showComponents));

    const element = i => this.toggler.children[i].querySelector('input') || document.createElement('input');

    if (this.value.showComponents) {
      element(1).value = element(2).value = element(3).value = element(4).value = element(0).value;
    } else {
      element(0).value = element(1).value;
    }

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils__["emitDomEvent"])(this.toggler.querySelectorAll('input'), 'change');
  }
}


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Component__);



module.exports = class ContentComponent extends __WEBPACK_IMPORTED_MODULE_0__Component___default.a {
  template() {
    return `<div class="EditroTextContent">
              ${this.value.disabled ? `
                <div class="EditroTextContent-preview">
                  ${this.value.content}
                  <div class="EditroTextContent-previewLabel">${this.config.i18n('click to undlock and edit')}</div>
                </div>
              ` : `
                <div class="EditroTextContent-editable" contenteditable>
                  ${this.value.content}
                </div>
              `}
            </div>`;
  }

  watch() {
    const onChange = e => {
      this.value.content = e.target.innerHTML;
      this.emit('change', this.value);
    };
    this.addListener(this.el.querySelector('[contenteditable]'), 'keyup', onChange);
    this.addListener(this.el.querySelector('[contenteditable]'), 'change', onChange);
  }
}


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

const BaseCompositeComponent = __webpack_require__(2);
const InputComponent = __webpack_require__(6);
const ColorComponent = __webpack_require__(5);
const SelectComponent = __webpack_require__(4);


class FontComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    return [
      {
        component: () => new ColorComponent(this.value.color, {
          label: this.config.i18n('Text color')
        }),
        onChange: color => {
          this.value.color = color;
        }
      },
      {
        component: () => new InputComponent(this.value.fontSize, {
          type: 'number',
          unit: 'px',
          label: this.config.i18n('Font size')
        }),
        onChange: fontSize => {
          this.value.fontSize = fontSize;
        }
      },
      {
        component: () => new InputComponent(this.value.lineHeight, {
          type: 'number',
          unit: 'px',
          label: this.config.i18n('Line height')
        }),
        onChange: lineHeight => {
          this.value.lineHeight = lineHeight;
        }
      },
      {
        component: () => new SelectComponent(this.value.textAlign, {
          choices: ['left', 'center', 'right'].map(ta => [ta, this.config.i18n(ta)]),
          label: this.config.i18n('Text align')
        }),
        onChange: textAlign => {
          this.value.textAlign = textAlign;
        }
      },
      {
        component: () => new SelectComponent(this.value.fontWeight, {
          choices: ['normal', 'light', 'bold'].map(ta => [ta, this.config.i18n(ta)]),
          label: this.config.i18n('Font weight')
        }),
        onChange: fontWeight => {
          this.value.fontWeight = fontWeight;
        }
      },
      {
        component: () => new SelectComponent(this.value.fontStyle, {
          choices: ['normal', 'italic'].map(ta => [ta, this.config.i18n(ta)]),
          label: this.config.i18n('Font style')
        }),
        onChange: fontStyle => {
          this.value.fontStyle = fontStyle;
        }
      }
    ];
  }
}

module.exports = FontComponent;


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Component__);



function uid() {
  const id = uid.id = (uid.id ? uid.id + 1 : 1);

  return id;
}


/**
 * config = {items: [{value: 'bold', icon: 'fwb'}], position: 'right'}
 */
module.exports = class IconRadioGroupComponent extends __WEBPACK_IMPORTED_MODULE_0__Component___default.a {
  template() {
    const name = `radio-group-${uid()}`;

    return `<div class="EditroBtnGroup EditroControl">    
      ${this.config.items.map(({ value, icon }) => `<label class="EditroBtnGroup-item">
        <input class="EditroBtnGroup-input" 
               type="radio" 
               name="${name}" 
               value="${value}" 
               ${this.value === value ? 'checked' : ''} />
        <span class="EditroBtnGroup-itemWrapper">
          <span class="EditroIcon EditroIcon--${icon}"></span>
        </span>
      </label>`).join('')}
    </div>`;
  }

  watch() {
    this.addListener(this.el.firstChild, 'change', e => {
      this.emit('change', e.target.value);
    });
  }
}


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BaseCompositeComponent__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BaseCompositeComponent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__BaseCompositeComponent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SelectComponent__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SelectComponent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__SelectComponent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__TBLRComponent__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__TBLRComponent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__TBLRComponent__);





module.exports = class PositionComponent extends __WEBPACK_IMPORTED_MODULE_0__BaseCompositeComponent___default.a {
  getSubComponentsFactories() {
    return [
      {
        component: () => new __WEBPACK_IMPORTED_MODULE_1__SelectComponent___default.a(this.value.position, {
          choices: [
            ['static', 'static'],
            ['relative', 'relative'],
            ['absolute', 'absolute'],
            ['fixed', 'fixed']
          ],
          label: this.config.i18n('Type of positioning')
        }),
        onChange: position => {
          this.value.position = position;
        }
      },
      {
        component: () => new __WEBPACK_IMPORTED_MODULE_2__TBLRComponent___default.a(this.value, {
          arrowDirection: 'in',
          shapes: {
            inner: 'real',
            outer: 'real'
          },
          label: this.config.i18n('Offset relative to the container')
        }),
        onChange: value => {
          this.value.top = value.top;
          this.value.bottom = value.bottom;
          this.value.left = value.left;
          this.value.right = value.right;
        }
      }
    ];
  }
};


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BaseCompositeComponent__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BaseCompositeComponent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__BaseCompositeComponent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SelectComponent__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SelectComponent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__SelectComponent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__WidthHeightComponent__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__WidthHeightComponent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__WidthHeightComponent__);





module.exports = class SizeComponent extends __WEBPACK_IMPORTED_MODULE_0__BaseCompositeComponent___default.a {
  getSubComponentsFactories() {
    return [
      {
        component: () => new __WEBPACK_IMPORTED_MODULE_2__WidthHeightComponent___default.a(this.value, {
          label: this.config.i18n('Dimensions')
        }),
        onChange: value => {
          this.value.width = value.width;
          this.value.height = value.height;
        }
      },
      {
        component: () => new __WEBPACK_IMPORTED_MODULE_1__SelectComponent___default.a(this.value.float, {
          choices: ['none', 'left', 'right'].map(item => [item, this.config.i18n(item)]),
          label: this.config.i18n('Floating')
        }),
        onChange: float => {
          this.value.float = float;
        }
      }
    ];
  }
}


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {


const tabs = __webpack_require__(40);
const panes = __webpack_require__(39);
const wysiwyg = __webpack_require__(33);
const tags = __webpack_require__(42);
const factory = __webpack_require__(20);

module.exports = function() {
  const Editro = factory();
  // add tags
  Object.keys(tags).forEach(g => Editro.defineHelper('tags', g, tags[g]));

  __webpack_require__(38)(Editro);
  __webpack_require__(37)(Editro);
  __webpack_require__(36)(Editro);
  tabs(Editro);
  panes(Editro);
  __webpack_require__(34)(Editro);
  __webpack_require__(35)(Editro);
  __webpack_require__(21)(Editro);
  __webpack_require__(41)(Editro);
  wysiwyg(Editro);
  __webpack_require__(23)(Editro);
  __webpack_require__(32)(Editro);
  __webpack_require__(28)(Editro);
  __webpack_require__(24)(Editro);
  __webpack_require__(25)(Editro);
  __webpack_require__(29)(Editro);
  __webpack_require__(31)(Editro);
  __webpack_require__(30)(Editro);
  __webpack_require__(27)(Editro);
  __webpack_require__(26)(Editro);

  Editro.defineOption('notificationTimeout', 3000);
  Editro.defineExtension('showNotification', function({ type, title, text, timeout }) {
    const t = type || 'Info';
    const node = document.createElement('div');
    const prefix = this.getOption('prefix') + 'Notification';
    node.className = prefix + ' ' + prefix + '--' + t.toLowerCase();
    node.innerHTML = `
      <h3 class="${prefix}-Title">${title || ''}</h3>
      <div class="${prefix}-Text">${text || ''}</div>
    `;

    this.getNode().appendChild(node);

    setTimeout(() => {
      node.classList.add(prefix + '--hidden');
      setTimeout(() => this.getNode().removeChild(node), 1000);
    }, timeout || this.getOption('notificationTimeout'));
  });
  Editro.defineExtension('i18n', a => a);

  // add instruments
  Editro.defineInitHook(e => {
    const currentSelected = document.createElement('div');
    currentSelected.className = 'EditroInstruments-item';
    currentSelected.style.minWidth = '50px';
    currentSelected.style.display = 'inline-block';
    const I = Editro.type.Instrument;
    let currentEl = null;
    e.on('selected', el => currentEl = el);

    e.addInstrument({
      getNode: () => currentSelected,
      getGroup: () => 'element'
    });
    e.on('selected', el => currentSelected.innerHTML = `
      <div class="EditroInstruments-icon" style="text-transform: uppercase;">${el.getTag()}</div>
    `);

    e.addInstrument(new I(e, {
      icon: __webpack_require__(19),
      title: 'Backward',
      onClick: () => e.backward(),
      group: 'history'
    }));
    e.addInstrument(new I(e, {
      icon: __webpack_require__(17),
      title: 'Forward',
      onClick: () => e.forward(),
      group: 'history'
    }));


    e.addInstrument(new I(e, {
      icon: __webpack_require__(16),
      title: 'Remove',
      onClick: () => currentEl && currentEl.remove(),
      group: 'element'
    }));
    e.addInstrument(new I(e, {
      icon: __webpack_require__(18),
      title: 'Toolbox',
      onClick: () => e.emit('toggle-right-panel'),
      group: 'panels'
    }));
    e.addInstrument(new I(e, {
      icon: __webpack_require__(15),
      title: 'Fullscreen',
      onClick: () => e.setOption('fullScreen', !e.getOption('fullScreen')),
      group: 'panels'
    }));
  });

  // frame return &amp;
  Editro.defineHelper('codePostprocessor', 'amp', str => str.replace(/&amp;/g, '&'));

  const req = __webpack_require__(22);
  req.keys().forEach(c => {
    const name = c.slice(2, -3);
    const cls = req(c);
    Editro.defineHelper('type', name, cls);
  });

  return Editro;
};


/***/ }
/******/ ])
});
;