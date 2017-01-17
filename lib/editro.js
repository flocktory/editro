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
/******/ 	return __webpack_require__(__webpack_require__.s = 60);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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


/**
 * Creates a debounced function that delays invoking f until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param {Function} f function to debounce
 * @param {Number} wait the number of milliseconds to delay
 * @returns {Function} new debounced function
 */
module.exports.debounce = function debounce(f, wait) {
  let id = null;

  return (...args) => {
    if (id) {
      clearTimeout(id);
    }
    id = setTimeout(() => f(...args), wait);
  };
};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

const EventEmitter = __webpack_require__(4);
const { createDocumentFragment } = __webpack_require__(0);


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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

const Component = __webpack_require__(1);


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
/***/ function(module, exports, __webpack_require__) {

const Component = __webpack_require__(1);

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
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

const debounce = __webpack_require__(0).debounce;
const Component = __webpack_require__(1);


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

    const collectColor = debounce(() => {
      const value = pairToColor({
        color: color.value,
        opacity: opacity.value
      });

      color.style.opacity = opacity.value / 100;
      text.value = value;
      this.emit('change', value);
    }, 100);

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

const Component = __webpack_require__(1);


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

const Component = __webpack_require__(1);


module.exports = class TogglerComponent extends Component {
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


/***/ },
/* 8 */
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

var util = __webpack_require__(56);
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

const Component = __webpack_require__(1);


module.exports = class ColorPlaceholderComponent extends Component {
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


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

const Component = __webpack_require__(1);


module.exports = class ImageComponent extends Component {
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
                <img class="EditroSrcPreview" src="${this.config.current || ''}"/>
              </div>
            </div>`;
  }

  watch() {
    const fileInput = this.el.querySelector('input');
    const preview = this.el.querySelector('.EditroSrcPreview');

    this.addListener(fileInput, 'change', () => {
      const file = fileInput.files[0];

      this.config.upload([file]).then(url => {
        preview.setAttribute('src', url);
        this.emit('change', url);
      });
    });
  }
}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

const Component = __webpack_require__(1);
const {toArray} = __webpack_require__(0);


/**
 * config = {arrowDirection: 'in', shapes: {inner: 'real', outer: 'imag'}}
 */
module.exports = class TBLRComponent extends Component {
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
    toArray(this.el.querySelectorAll('input')).forEach(input => {
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

const Component = __webpack_require__(1);
const {toArray} = __webpack_require__(0);


module.exports = class WidthHeightComponent extends Component {
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
    toArray(this.el.querySelectorAll('input')).forEach(input => {
      const onChange = () => {
        this.value[input.getAttribute('target-name')] = input.value;
        this.emit('change', this.value);
      };
      this.addListener(input, 'keyup', onChange);
    });
  }
}


/***/ },
/* 13 */
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

const Component = __webpack_require__(1);


/**
 * config = {type: 'delete', text: 'Delete'}
 */
module.exports = class ActionButtonComponent extends Component {
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

const Component = __webpack_require__(1);
const BaseCompositeComponent = __webpack_require__(2);
const SelectComponent = __webpack_require__(3);
const ColorComponent = __webpack_require__(5);
const ColorPlaceholderComponent = __webpack_require__(9);
const ImageComponent = __webpack_require__(10);
const { createDocumentFragment } = __webpack_require__(0);


const visibleIf = isVisible => isVisible ? 'flex' : 'none';


class BackgroundColorComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    return [
      {
        component: () => new ColorComponent(this.value.color1, {
          label: this.config.i18n('Main background color')
        }),
        onChange: color => {
          this.value.color1 = color;
        }
      },
      {
        component: () => new ColorPlaceholderComponent(null, {
          label: this.config.i18n('Second background color')
        }),
        onChange: () => {
          this.value.hasGradient = true;
        }
      },
      {
        component: () => new ColorComponent(this.value.color2, {
          label: this.config.i18n('Second background color')
        }),
        onChange: color => {
          this.value.color2 = color;
        }
      },
      {
        component: () => new SelectComponent(this.value.gradientDirection, {
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


class BackgroundImageComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    return [
      {
        component: () => new ImageComponent(this.value.backgroundImage, {
          label: this.config.i18n('Background image'),
          upload: this.config.upload,
          current: this.value.backgroundImage
        }),
        onChange: image => {
          this.value.backgroundImage = image;
        }
      },
      {
        component: () => new SelectComponent(this.value.backgroundSize, {
          choices: ['auto', 'cover', 'contain'].map(bgSize => [bgSize, this.config.i18n(bgSize)]),
          label: this.config.i18n('Background size')
        }),
        onChange: backgroundSize => {
          this.value.backgroundSize = backgroundSize;
        }
      },
      {
        component: () => new SelectComponent(this.value.backgroundPosition, {
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


module.exports = class BackgroundComponent extends Component {
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

const BaseCompositeComponent = __webpack_require__(2);
const InputComponent = __webpack_require__(6);
const ColorComponent = __webpack_require__(5);
const TogglerComponent = __webpack_require__(7);
const { createDocumentFragment, emitDomEvent } = __webpack_require__(0);


module.exports = class BorderComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    const subComponents = [
      {
        component: () => new InputComponent(this.value.oneValue[0], {
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
        component: () => new ColorComponent(this.value.oneValue[1], {
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
        component: () => new InputComponent(this.value.components[i][0], {
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
        component: () => new ColorComponent(this.value.components[i][1], {
          label: this.config.i18n(`${side} border color`),
          class: 'EditroToggler-more'
        }),
        onChange: value => {
          this.value.components[i][1] = value;
        }
      });
    });

    subComponents.push({
      component: () => new TogglerComponent(this.value.showComponents, {
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

    const newEl = createDocumentFragment('<div class="EditroToggler EditroToggler--full"></div>');
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

    emitDomEvent(this.toggler.querySelectorAll('input'), 'change');
  }
};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

const BaseCompositeComponent = __webpack_require__(2);
const InputComponent = __webpack_require__(6);
const TogglerComponent = __webpack_require__(7);
const { createDocumentFragment, emitDomEvent } = __webpack_require__(0);


module.exports = class BorderRadiusComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    const subComponents = [
      {
        component: () => new InputComponent(this.value.oneValue, {
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
        component: () => new InputComponent(this.value.components[i], {
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
      component: () => new TogglerComponent(this.value.showComponents, {
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

    const newEl = createDocumentFragment('<div class="EditroToggler EditroToggler--full"></div>');
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

    emitDomEvent(this.toggler.querySelectorAll('input'), 'change');
  }
}


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

const Component = __webpack_require__(1);


module.exports = class ContentComponent extends Component {
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

const BaseCompositeComponent = __webpack_require__(2);
const InputComponent = __webpack_require__(6);
const ColorComponent = __webpack_require__(5);
const SelectComponent = __webpack_require__(3);


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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

const Component = __webpack_require__(1);


function uid() {
  const id = uid.id = (uid.id ? uid.id + 1 : 1);

  return id;
}


/**
 * config = {items: [{value: 'bold', icon: 'fwb'}], position: 'right'}
 */
module.exports = class IconRadioGroupComponent extends Component {
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
/* 21 */
/***/ function(module, exports, __webpack_require__) {

const BaseCompositeComponent = __webpack_require__(2);
const SelectComponent = __webpack_require__(3);
const TBLRComponent = __webpack_require__(11);


module.exports = class PositionComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    return [
      {
        component: () => new SelectComponent(this.value.position, {
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
        component: () => new TBLRComponent(this.value, {
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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

const BaseCompositeComponent = __webpack_require__(2);
const SelectComponent = __webpack_require__(3);
const WidthHeightComponent = __webpack_require__(12);


module.exports = class SizeComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    return [
      {
        component: () => new WidthHeightComponent(this.value, {
          label: this.config.i18n('Dimensions')
        }),
        onChange: value => {
          this.value.width = value.width;
          this.value.height = value.height;
        }
      },
      {
        component: () => new SelectComponent(this.value.float, {
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
/* 23 */
/***/ function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNDExIDU0MWwtMzU1IDM1NSAzNTUgMzU1IDE0NC0xNDRxMjktMzEgNzAtMTQgMzkgMTcgMzkgNTl2NDQ4cTAgMjYtMTkgNDV0LTQ1IDE5aC00NDhxLTQyIDAtNTktNDAtMTctMzkgMTQtNjlsMTQ0LTE0NC0zNTUtMzU1LTM1NSAzNTUgMTQ0IDE0NHEzMSAzMCAxNCA2OS0xNyA0MC01OSA0MGgtNDQ4cS0yNiAwLTQ1LTE5dC0xOS00NXYtNDQ4cTAtNDIgNDAtNTkgMzktMTcgNjkgMTRsMTQ0IDE0NCAzNTUtMzU1LTM1NS0zNTUtMTQ0IDE0NHEtMTkgMTktNDUgMTktMTIgMC0yNC01LTQwLTE3LTQwLTU5di00NDhxMC0yNiAxOS00NXQ0NS0xOWg0NDhxNDIgMCA1OSA0MCAxNyAzOS0xNCA2OWwtMTQ0IDE0NCAzNTUgMzU1IDM1NS0zNTUtMTQ0LTE0NHEtMzEtMzAtMTQtNjkgMTctNDAgNTktNDBoNDQ4cTI2IDAgNDUgMTl0MTkgNDV2NDQ4cTAgNDItMzkgNTktMTMgNS0yNSA1LTI2IDAtNDUtMTl6Ii8+PC9zdmc+"

/***/ },
/* 24 */
/***/ function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNDQwIDg5M3EwLTE2MS04Ny0yOTVsLTc1NCA3NTNxMTM3IDg5IDI5NyA4OSAxMTEgMCAyMTEuNS00My41dDE3My41LTExNi41IDExNi0xNzQuNSA0My0yMTIuNXptLTk5OSAyOTlsNzU1LTc1NHEtMTM1LTkxLTMwMC05MS0xNDggMC0yNzMgNzN0LTE5OCAxOTktNzMgMjc0cTAgMTYyIDg5IDI5OXptMTIyMy0yOTlxMCAxNTctNjEgMzAwdC0xNjMuNSAyNDYtMjQ1IDE2NC0yOTguNSA2MS0yOTguNS02MS0yNDUtMTY0LTE2My41LTI0Ni02MS0zMDAgNjEtMjk5LjUgMTYzLjUtMjQ1LjUgMjQ1LTE2NCAyOTguNS02MSAyOTguNSA2MSAyNDUgMTY0IDE2My41IDI0NS41IDYxIDI5OS41eiIvPjwvc3ZnPg=="

/***/ },
/* 25 */
/***/ function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNjY0IDI1NnY0NDhxMCAyNi0xOSA0NXQtNDUgMTloLTQ0OHEtNDIgMC01OS00MC0xNy0zOSAxNC02OWwxMzgtMTM4cS0xNDgtMTM3LTM0OS0xMzctMTA0IDAtMTk4LjUgNDAuNXQtMTYzLjUgMTA5LjUtMTA5LjUgMTYzLjUtNDAuNSAxOTguNSA0MC41IDE5OC41IDEwOS41IDE2My41IDE2My41IDEwOS41IDE5OC41IDQwLjVxMTE5IDAgMjI1LTUydDE3OS0xNDdxNy0xMCAyMy0xMiAxNCAwIDI1IDlsMTM3IDEzOHE5IDggOS41IDIwLjV0LTcuNSAyMi41cS0xMDkgMTMyLTI2NCAyMDQuNXQtMzI3IDcyLjVxLTE1NiAwLTI5OC02MXQtMjQ1LTE2NC0xNjQtMjQ1LTYxLTI5OCA2MS0yOTggMTY0LTI0NSAyNDUtMTY0IDI5OC02MXExNDcgMCAyODQuNSA1NS41dDI0NC41IDE1Ni41bDEzMC0xMjlxMjktMzEgNzAtMTQgMzkgMTcgMzkgNTl6Ii8+PC9zdmc+"

/***/ },
/* 26 */
/***/ function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik00ODAgMTQwOHYxMjhoLTM1MnYtMTI4aDM1MnptMzUyLTEyOHEyNiAwIDQ1IDE5dDE5IDQ1djI1NnEwIDI2LTE5IDQ1dC00NSAxOWgtMjU2cS0yNiAwLTQ1LTE5dC0xOS00NXYtMjU2cTAtMjYgMTktNDV0NDUtMTloMjU2em0xNjAtMzg0djEyOGgtODY0di0xMjhoODY0em0tNjQwLTUxMnYxMjhoLTIyNHYtMTI4aDIyNHptMTMxMiAxMDI0djEyOGgtNzM2di0xMjhoNzM2em0tOTYwLTExNTJxMjYgMCA0NSAxOXQxOSA0NXYyNTZxMCAyNi0xOSA0NXQtNDUgMTloLTI1NnEtMjYgMC00NS0xOXQtMTktNDV2LTI1NnEwLTI2IDE5LTQ1dDQ1LTE5aDI1NnptNjQwIDUxMnEyNiAwIDQ1IDE5dDE5IDQ1djI1NnEwIDI2LTE5IDQ1dC00NSAxOWgtMjU2cS0yNiAwLTQ1LTE5dC0xOS00NXYtMjU2cTAtMjYgMTktNDV0NDUtMTloMjU2em0zMjAgMTI4djEyOGgtMjI0di0xMjhoMjI0em0wLTUxMnYxMjhoLTg2NHYtMTI4aDg2NHoiLz48L3N2Zz4="

/***/ },
/* 27 */
/***/ function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNjY0IDg5NnEwIDE1Ni02MSAyOTh0LTE2NCAyNDUtMjQ1IDE2NC0yOTggNjFxLTE3MiAwLTMyNy03Mi41dC0yNjQtMjA0LjVxLTctMTAtNi41LTIyLjV0OC41LTIwLjVsMTM3LTEzOHExMC05IDI1LTkgMTYgMiAyMyAxMiA3MyA5NSAxNzkgMTQ3dDIyNSA1MnExMDQgMCAxOTguNS00MC41dDE2My41LTEwOS41IDEwOS41LTE2My41IDQwLjUtMTk4LjUtNDAuNS0xOTguNS0xMDkuNS0xNjMuNS0xNjMuNS0xMDkuNS0xOTguNS00MC41cS05OCAwLTE4OCAzNS41dC0xNjAgMTAxLjVsMTM3IDEzOHEzMSAzMCAxNCA2OS0xNyA0MC01OSA0MGgtNDQ4cS0yNiAwLTQ1LTE5dC0xOS00NXYtNDQ4cTAtNDIgNDAtNTkgMzktMTcgNjkgMTRsMTMwIDEyOXExMDctMTAxIDI0NC41LTE1Ni41dDI4NC41LTU1LjVxMTU2IDAgMjk4IDYxdDI0NSAxNjQgMTY0IDI0NSA2MSAyOTh6Ii8+PC9zdmc+"

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

/*
 * Main class. Response for whole editor.
 * Provide static methods for extendind.
 *
 *
 */

const EventEmmiter = __webpack_require__(4);
const assert = __webpack_require__(8);
const Frame = __webpack_require__(58);
const Toolbox = __webpack_require__(59);

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

module.exports = Editro;


/***/ },
/* 29 */
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
/* 30 */
/***/ function(module, exports, __webpack_require__) {

var map = {
	"./ActionButtonComponent": 14,
	"./ActionButtonComponent.js": 14,
	"./BackgroundComponent": 15,
	"./BackgroundComponent.js": 15,
	"./BaseCompositeComponent": 2,
	"./BaseCompositeComponent.js": 2,
	"./BorderComponent": 16,
	"./BorderComponent.js": 16,
	"./BorderRadiusComponent": 17,
	"./BorderRadiusComponent.js": 17,
	"./ColorComponent": 5,
	"./ColorComponent.js": 5,
	"./ColorPlaceholderComponent": 9,
	"./ColorPlaceholderComponent.js": 9,
	"./Component": 1,
	"./Component.js": 1,
	"./ContentComponent": 18,
	"./ContentComponent.js": 18,
	"./FontComponent": 19,
	"./FontComponent.js": 19,
	"./IconRadioGroupComponent": 20,
	"./IconRadioGroupComponent.js": 20,
	"./ImageComponent": 10,
	"./ImageComponent.js": 10,
	"./InputComponent": 6,
	"./InputComponent.js": 6,
	"./PositionComponent": 21,
	"./PositionComponent.js": 21,
	"./SelectComponent": 3,
	"./SelectComponent.js": 3,
	"./SizeComponent": 22,
	"./SizeComponent.js": 22,
	"./TBLRComponent": 11,
	"./TBLRComponent.js": 11,
	"./TogglerComponent": 7,
	"./TogglerComponent.js": 7,
	"./WidthHeightComponent": 12,
	"./WidthHeightComponent.js": 12
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
webpackContext.id = 30;


/***/ },
/* 31 */
/***/ function(module, exports) {

module.exports = function(Editro) {
  const GRADIENT_RX = /linear-gradient\(([\s\w]+),\s*(#[\d\w]{3,6}|rgba?\([\s\d,]+\))\s*0%\s*,\s*(#[\d\w]{3,6}|rgba?\([\s\d,]+\))\s*100%\s*\)/i;
  const { tags, type: { Controller, BackgroundComponent } } = Editro;
  const enabledTags = [];

  enabledTags.push(
    ...tags.input,
    ...tags.list,
    ...tags.definition,
    ...tags.block,
    ...tags.headers,
    ...tags.content,
    ...tags.form,
    'a'
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
      } else {
        el.setStyle('backgroundImage', 'none'); // Avoid conflicts with backgroundColor if an element is set backgroundImage
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

      const gradientMatch = GRADIENT_RX.exec(computedStyle.backgroundImage || '');
      if (gradientMatch) {
        hasGradient = true;
        gradientDirection = gradientMatch[1].trim();
        color1 = gradientMatch[2].trim();
        color2 = gradientMatch[3].trim();
      }

      const urlMatch = /url\("?([^\)]+)"?\)/i.exec(computedStyle.backgroundImage || '');
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
/* 32 */
/***/ function(module, exports, __webpack_require__) {

const { combination, num, px } = __webpack_require__(0);

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
/* 33 */
/***/ function(module, exports, __webpack_require__) {

const { combination, num, px } = __webpack_require__(0);

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
/* 34 */
/***/ function(module, exports, __webpack_require__) {

const { px } = __webpack_require__(0);

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
/* 35 */
/***/ function(module, exports, __webpack_require__) {

const { createDocumentFragment } = __webpack_require__(0);

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
/* 36 */
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
/* 37 */
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
/* 38 */
/***/ function(module, exports, __webpack_require__) {

const { num, px } = __webpack_require__(0);
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
/* 39 */
/***/ function(module, exports, __webpack_require__) {

const { px } = __webpack_require__(0);

module.exports = function(Editro) {
  const { type: { Controller, SizeComponent } } = Editro;

  class Size extends Controller {
    constructor(editro) {
      super(editro);
      this.editro = editro;
    }

    onElementSelected(el) {
      this.el = el;
      this.toggle(true);

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
/* 40 */
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
        upload: this.editro.upload.bind(this.editro),
        current: el.getAttribute('src')
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
/* 41 */
/***/ function(module, exports) {

const hasOnlyTags = (html, tags) => {
  const search = /<(\w+)\/?>|<(\w+)\s/gim;

  for (let match = search.exec(html); match; match = search.exec(html)) {
    if (tags.indexOf(match[1] || match[2]) === -1) {
      return false;
    }
  }

  return true;
};

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
      this.node.innerHTML = '<h3 class="EditroController-title">Content</h3>';
      this.temp = document.createElement('div');
      this.temp.className = 'EditroWysiwyg-content';
      this.temp.setAttribute('contenteditable', true);
      this.temp.style.display = 'inline-block';
      this.temp.style.width = '100%';
      this.temp.innerHTML = el.getHtml();
      this.node.appendChild(this.temp);

      const onUpdate = () => el.setHtml(this.temp.innerHTML);

      this.temp.addEventListener('keyup', onUpdate);
      this.temp.addEventListener('change', onUpdate);
    }

    _canEdit(el) {
      const fake = document.createElement('div');
      fake.innerHTML = el.getHtml();
      if (!hasOnlyTags(fake.innerHTML, [...tags.inline, ...tags.headers, ...tags.list, ...tags.content])) {
        return false;
      }
      // allow: list header content inline
      const banned = [
        ...tags.input,
        ...tags.definition,
        ...tags.form,
        ...tags.embedded,
      ];
      return !banned.includes(el.getTag()) && !fake.querySelector(banned.join(' '));
    }
  }

  Editro.defineHelper('controllers', 'Wysiwyg', Wysiwyg);
};


/***/ },
/* 42 */
/***/ function(module, exports) {

module.exports = function(Editro) {
  Editro.defineOption('fullScreen', false, (editro, val) => {
    editro.getNode().classList.toggle('Editro--fullScreen', val);
  });
};


/***/ },
/* 43 */
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

const EventEmitter = __webpack_require__(4);
const { debounce } = __webpack_require__(0);

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
    editro._h = editro[key]
    editro[key].push(code);
    editro.on('change', debounce(e => editro[key].push(e.html), 300));
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
/* 44 */
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
/* 45 */
/***/ function(module, exports) {

const sre = /<(input|textarea)[^>]+(autofocus)/gmi;

module.exports = function(Editro) {
  Editro.defineHelper('codePreprocessor', 'autofocus', module.exports.pre);
  Editro.defineHelper('codePostprocessor', 'autofocus', module.exports.post);
};

module.exports.pre = function pre(code) {
  return code.replace(sre, '$&-editro');
};

module.exports.post = function post(code) {
  return code.replace(/autofocus-editro/gmi, 'autofocus');
};


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

/*
 * Visual pane.
 * Can be slided from left, right, up, bottom or floated.
 * Save size. Listen to toggle-${position}-panel event
 *
 * Options:
 * position - String, required, one of left|right|bottom|top
 * fixed - Boolean, should have fixed size?
 * size - String, size if fixed, ex: 200px
 */

const assert = __webpack_require__(8);

const positions = ['left', 'right', 'top', 'bottom'];

class Panel {
  constructor(editro, opts) {
    assert(positions.includes(opts.position),
      'Panel position should be in ' + positions.join(', '));

    this.editro = editro;
    this.position = opts.position;
    this.getKey = k => `panel:${this.position}:${k}`;

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
      this._restoreState();
    }

    this.node.lastChild.appendChild(opts.child);
    this.node.querySelector('.EditroPanel-move')
      .addEventListener('mousedown', this._startResize.bind(this));

    editro.on(`toggle-${this.position}-panel`, () => this._toggle());
  }

  getNode() {
    return this.node;
  }

  _toggle() {
    this._setHidden(!this._getHidden());
    this._saveState();
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
      this._saveState();
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
  _setHidden(hidden) {
    this.node.dataset.hidden = hidden ? 'yes' : 'no';
  }
  _getHidden(hidden) {
    return this.node.dataset.hidden == 'yes';
  }
  _restoreState() {
    this._setContentSize(this.editro.getStorageItem(this.getKey('size')) || 300);
    this._setHidden(this.editro.getStorageItem(this.getKey('hidden') || false));
  }
  _saveState() {
    this.editro.setStorageItem(this.getKey('size'), this._getContentSize());
    this.editro.setStorageItem(this.getKey('hidden'), this._getHidden());
  }
}

module.exports = function(Editro) {
  Editro.defineHelper('type', 'Panel', Panel);
};


/***/ },
/* 47 */
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
/* 48 */
/***/ function(module, exports, __webpack_require__) {

const assert = __webpack_require__(8);

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
/* 49 */
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
/* 50 */
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
/* 51 */
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
/* 52 */
/***/ function(module, exports, __webpack_require__) {

/*
 Copyright (C) 2013 Sencha Inc.
 Copyright (C) 2012 Sencha Inc.
 Copyright (C) 2011 Sencha Inc.

 Author: Ariya Hidayat.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/*jslint continue: true, indent: 4 */
/*global exports:true, module:true, window:true */

(function () {

    'use strict';

    function cssbeautify(style, opt) {

        var options, index = 0, length = style.length, blocks, formatted = '',
            ch, ch2, str, state, State, depth, quote, comment,
            openbracesuffix = true,
            autosemicolon = false,
            trimRight;

        options = arguments.length > 1 ? opt : {};
        if (typeof options.indent === 'undefined') {
            options.indent = '    ';
        }
        if (typeof options.openbrace === 'string') {
            openbracesuffix = (options.openbrace === 'end-of-line');
        }
        if (typeof options.autosemicolon === 'boolean') {
            autosemicolon = options.autosemicolon;
        }

        function isWhitespace(c) {
            return (c === ' ') || (c === '\n') || (c === '\t') || (c === '\r') || (c === '\f');
        }

        function isQuote(c) {
            return (c === '\'') || (c === '"');
        }

        // FIXME: handle Unicode characters
        function isName(c) {
            return (ch >= 'a' && ch <= 'z') ||
                (ch >= 'A' && ch <= 'Z') ||
                (ch >= '0' && ch <= '9') ||
                '-_*.:#[]'.indexOf(c) >= 0;
        }

        function appendIndent() {
            var i;
            for (i = depth; i > 0; i -= 1) {
                formatted += options.indent;
            }
        }

        function openBlock() {
            formatted = trimRight(formatted);
            if (openbracesuffix) {
                formatted += ' {';
            } else {
                formatted += '\n';
                appendIndent();
                formatted += '{';
            }
            if (ch2 !== '\n') {
                formatted += '\n';
            }
            depth += 1;
        }

        function closeBlock() {
            var last;
            depth -= 1;
            formatted = trimRight(formatted);

            if (formatted.length > 0 && autosemicolon) {
                last = formatted.charAt(formatted.length - 1);
                if (last !== ';' && last !== '{') {
                    formatted += ';';
                }
            }

            formatted += '\n';
            appendIndent();
            formatted += '}';
            blocks.push(formatted);
            formatted = '';
        }

        if (String.prototype.trimRight) {
            trimRight = function (s) {
                return s.trimRight();
            };
        } else {
            // old Internet Explorer
            trimRight = function (s) {
                return s.replace(/\s+$/, '');
            };
        }

        State = {
            Start: 0,
            AtRule: 1,
            Block: 2,
            Selector: 3,
            Ruleset: 4,
            Property: 5,
            Separator: 6,
            Expression: 7,
            URL: 8
        };

        depth = 0;
        state = State.Start;
        comment = false;
        blocks = [];

        // We want to deal with LF (\n) only
        style = style.replace(/\r\n/g, '\n');

        while (index < length) {
            ch = style.charAt(index);
            ch2 = style.charAt(index + 1);
            index += 1;

            // Inside a string literal?
            if (isQuote(quote)) {
                formatted += ch;
                if (ch === quote) {
                    quote = null;
                }
                if (ch === '\\' && ch2 === quote) {
                    // Don't treat escaped character as the closing quote
                    formatted += ch2;
                    index += 1;
                }
                continue;
            }

            // Starting a string literal?
            if (isQuote(ch)) {
                formatted += ch;
                quote = ch;
                continue;
            }

            // Comment
            if (comment) {
                formatted += ch;
                if (ch === '*' && ch2 === '/') {
                    comment = false;
                    formatted += ch2;
                    index += 1;
                }
                continue;
            }
            if (ch === '/' && ch2 === '*') {
                comment = true;
                formatted += ch;
                formatted += ch2;
                index += 1;
                continue;
            }

            if (state === State.Start) {

                if (blocks.length === 0) {
                    if (isWhitespace(ch) && formatted.length === 0) {
                        continue;
                    }
                }

                // Copy white spaces and control characters
                if (ch <= ' ' || ch.charCodeAt(0) >= 128) {
                    state = State.Start;
                    formatted += ch;
                    continue;
                }

                // Selector or at-rule
                if (isName(ch) || (ch === '@')) {

                    // Clear trailing whitespaces and linefeeds.
                    str = trimRight(formatted);

                    if (str.length === 0) {
                        // If we have empty string after removing all the trailing
                        // spaces, that means we are right after a block.
                        // Ensure a blank line as the separator.
                        if (blocks.length > 0) {
                            formatted = '\n\n';
                        }
                    } else {
                        // After finishing a ruleset or directive statement,
                        // there should be one blank line.
                        if (str.charAt(str.length - 1) === '}' ||
                                str.charAt(str.length - 1) === ';') {

                            formatted = str + '\n\n';
                        } else {
                            // After block comment, keep all the linefeeds but
                            // start from the first column (remove whitespaces prefix).
                            while (true) {
                                ch2 = formatted.charAt(formatted.length - 1);
                                if (ch2 !== ' ' && ch2.charCodeAt(0) !== 9) {
                                    break;
                                }
                                formatted = formatted.substr(0, formatted.length - 1);
                            }
                        }
                    }
                    formatted += ch;
                    state = (ch === '@') ? State.AtRule : State.Selector;
                    continue;
                }
            }

            if (state === State.AtRule) {

                // ';' terminates a statement.
                if (ch === ';') {
                    formatted += ch;
                    state = State.Start;
                    continue;
                }

                // '{' starts a block
                if (ch === '{') {
                    str = trimRight(formatted);
                    openBlock();
                    state = (str === '@font-face') ? State.Ruleset : State.Block;
                    continue;
                }

                formatted += ch;
                continue;
            }

            if (state === State.Block) {

                // Selector
                if (isName(ch)) {

                    // Clear trailing whitespaces and linefeeds.
                    str = trimRight(formatted);

                    if (str.length === 0) {
                        // If we have empty string after removing all the trailing
                        // spaces, that means we are right after a block.
                        // Ensure a blank line as the separator.
                        if (blocks.length > 0) {
                            formatted = '\n\n';
                        }
                    } else {
                        // Insert blank line if necessary.
                        if (str.charAt(str.length - 1) === '}') {
                            formatted = str + '\n\n';
                        } else {
                            // After block comment, keep all the linefeeds but
                            // start from the first column (remove whitespaces prefix).
                            while (true) {
                                ch2 = formatted.charAt(formatted.length - 1);
                                if (ch2 !== ' ' && ch2.charCodeAt(0) !== 9) {
                                    break;
                                }
                                formatted = formatted.substr(0, formatted.length - 1);
                            }
                        }
                    }

                    appendIndent();
                    formatted += ch;
                    state = State.Selector;
                    continue;
                }

                // '}' resets the state.
                if (ch === '}') {
                    closeBlock();
                    state = State.Start;
                    continue;
                }

                formatted += ch;
                continue;
            }

            if (state === State.Selector) {

                // '{' starts the ruleset.
                if (ch === '{') {
                    openBlock();
                    state = State.Ruleset;
                    continue;
                }

                // '}' resets the state.
                if (ch === '}') {
                    closeBlock();
                    state = State.Start;
                    continue;
                }

                formatted += ch;
                continue;
            }

            if (state === State.Ruleset) {

                // '}' finishes the ruleset.
                if (ch === '}') {
                    closeBlock();
                    state = State.Start;
                    if (depth > 0) {
                        state = State.Block;
                    }
                    continue;
                }

                // Make sure there is no blank line or trailing spaces inbetween
                if (ch === '\n') {
                    formatted = trimRight(formatted);
                    formatted += '\n';
                    continue;
                }

                // property name
                if (!isWhitespace(ch)) {
                    formatted = trimRight(formatted);
                    formatted += '\n';
                    appendIndent();
                    formatted += ch;
                    state = State.Property;
                    continue;
                }
                formatted += ch;
                continue;
            }

            if (state === State.Property) {

                // ':' concludes the property.
                if (ch === ':') {
                    formatted = trimRight(formatted);
                    formatted += ': ';
                    state = State.Expression;
                    if (isWhitespace(ch2)) {
                        state = State.Separator;
                    }
                    continue;
                }

                // '}' finishes the ruleset.
                if (ch === '}') {
                    closeBlock();
                    state = State.Start;
                    if (depth > 0) {
                        state = State.Block;
                    }
                    continue;
                }

                formatted += ch;
                continue;
            }

            if (state === State.Separator) {

                // Non-whitespace starts the expression.
                if (!isWhitespace(ch)) {
                    formatted += ch;
                    state = State.Expression;
                    continue;
                }

                // Anticipate string literal.
                if (isQuote(ch2)) {
                    state = State.Expression;
                }

                continue;
            }

            if (state === State.Expression) {

                // '}' finishes the ruleset.
                if (ch === '}') {
                    closeBlock();
                    state = State.Start;
                    if (depth > 0) {
                        state = State.Block;
                    }
                    continue;
                }

                // ';' completes the declaration.
                if (ch === ';') {
                    formatted = trimRight(formatted);
                    formatted += ';\n';
                    state = State.Ruleset;
                    continue;
                }

                formatted += ch;

                if (ch === '(') {
                    if (formatted.charAt(formatted.length - 2) === 'l' &&
                            formatted.charAt(formatted.length - 3) === 'r' &&
                            formatted.charAt(formatted.length - 4) === 'u') {

                        // URL starts with '(' and closes with ')'.
                        state = State.URL;
                        continue;
                    }
                }

                continue;
            }

            if (state === State.URL) {


                // ')' finishes the URL (only if it is not escaped).
                if (ch === ')' && formatted.charAt(formatted.length - 1 !== '\\')) {
                    formatted += ch;
                    state = State.Expression;
                    continue;
                }
            }

            // The default action is to copy the character (to prevent
            // infinite loop).
            formatted += ch;
        }

        formatted = blocks.join('') + formatted;

        return formatted;
    }

    if (true) {
        // Node.js module.
        module.exports = exports = cssbeautify;
    } else if (typeof window === 'object') {
        // Browser loading.
        window.cssbeautify = cssbeautify;
    }

}());


/***/ },
/* 53 */
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
/* 54 */
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
/* 55 */
/***/ function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ },
/* 56 */
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

exports.isBuffer = __webpack_require__(55);

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
exports.inherits = __webpack_require__(54);

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13), __webpack_require__(53)))

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

const { toKebabCase } = __webpack_require__(0);
const EventEmitter = __webpack_require__(4);
const cssbeautify = __webpack_require__(52);


class Element extends EventEmitter {
  constructor(node) {
    super();

    this.node = node;
  }

  getAttribute(name) {
    return this.node.getAttribute(name);
  }
  hasAttribute(name) {
    const attr = this.getAttribute(name);
    return attr === '' || !!attr;
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
  removeAttribute(name) {
    return this.node.removeAttribute(name);
  }

  getStyle(name) {
    return window.getComputedStyle(this.node)[name];
  }
  getStyles(names) {
    return names.reduce((a, n) => {
      a[n] = this.getStyle(n);
      return a;
    }, {});
  }
  setStyle(name, value) {
    const target = this.node;
    // clear style
    target.style[name] = '';
    target.style.removeProperty(name);

    const st = this._getStyleTag();

    // add data attribute (used in selector)
    let identy = target.dataset.editroStyle;
    if (!identy) {
      identy = target.tagName.toLowerCase() +
        Math.floor(Math.random() * 100000);
      target.dataset.editroStyle = identy;
    }

    const selectorText = `[data-editro-style="${identy}"]`;
    const rule = [].find.call(st.rules, a => a.selectorText === selectorText);
    if (rule) {
      rule.style.setProperty(toKebabCase(name), value, 'important');
    } else {
      const cssValue = value.endsWith('!important') ? value : (value + ' !important');
      const cssProp = name.replace(/[A-Z]/, a => '-' + a.toLowerCase());
      st.insertRule(`${selectorText} { ${cssProp}: ${cssValue};}`, st.rules.length);
    }
    const allCssText = [].reduce.call(st.rules, (t, r) => t + '\n\n' + r.cssText,'');
    st.ownerNode.innerHTML = this._formatCss(allCssText);

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

  // TODO move to frame
  _getStyleTag() {
    const cd = this.node.getRootNode();
    let st = cd.getElementById('editro-perm-style');
    if (!st) {
      st = cd.createElement('style');
      st.id = 'editro-perm-style';
      cd.head.appendChild(st);
    }
    return [].find.call(cd.styleSheets, s => s.ownerNode === st);
  }
  _formatCss(css) {
    const bcss = '\n' + cssbeautify(css, {
      indent: '  ',
      autosemicolon: true
    }) + '\n';

    return bcss.split(/^/gmi).join('    ');
  }
}

module.exports = Element;



/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

const Element = __webpack_require__(57);
const EventEmmiter = __webpack_require__(4);
const { debounce } = __webpack_require__(0);

class Frame extends EventEmmiter {
  constructor(options) {
    super();
    this.prefix = options.prefix;
    this.current = {};
    this.node = document.createElement('iframe');
    this.node.className = 'EditroFrame';
    this.node.setAttribute('sandbox', 'allow-same-origin allow-scripts');

    this.node.addEventListener('load', this._onLoad.bind(this));
    this.node.srcdoc = options.code;

    this._emitChange = debounce(() =>
      this.emit('change', {
        html: this.getHtml()
      }),
      1
    );
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
      if (this.current.node === node) {
        return;
      }

      this.current.node.removeAttribute('editro-current');
      this.current.el.emit('deattached');
      this.current.el.removeAllListeners('change');
    }

    this.current.node = node;
    node.setAttribute('editro-current', '');
    const el = new Element(node);
    this.current.el = el;

    el.on('change', this._emitChange);

    this.emit('selected', el);
    if (!silenced) {
      this._emitChange();
    }
  }

  _onMutate() {
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
        @-webkit-keyframes pulsate {
          50% {
            outline-color: #0022df;
          }
          75% {
            outline-color: transparent;
          }
          100% {
            outline-color: #0022df;
          }
        }
        [editro-current] {
          outline-color: #0022df;
          outline-offset: 0px;
          outline-style: dotted;
          outline-width: 1px;
          animation: pulsate 1s infinite;
        }
      `;
      doc.head.appendChild(st);
    }
  }
}


module.exports = Frame;


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

const { elem, elems, is } = __webpack_require__(0);

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
/* 60 */
/***/ function(module, exports, __webpack_require__) {


const tabs = __webpack_require__(49);
const panes = __webpack_require__(48);
const wysiwyg = __webpack_require__(41);
const tags = __webpack_require__(51);
const Editro = __webpack_require__(28);

// add tags
Object.keys(tags).forEach(g => Editro.defineHelper('tags', g, tags[g]));

const components = [
  'ActionButtonComponent',
  'BackgroundComponent',
  'BaseCompositeComponent',
  'BorderComponent',
  'BorderRadiusComponent',
  'ColorComponent',
  'ColorPlaceholderComponent',
  'Component',
  'ContentComponent',
  'FontComponent',
  'IconRadioGroupComponent',
  'ImageComponent',
  'InputComponent',
  'PositionComponent',
  'SelectComponent',
  'SizeComponent',
  'TBLRComponent',
  'TogglerComponent',
  'WidthHeightComponent'
];

components.forEach(c => {
  const C = __webpack_require__(30)("./" + c);
  Editro.defineHelper('type', c, C);
});

__webpack_require__(47)(Editro);
__webpack_require__(46)(Editro);
__webpack_require__(44)(Editro);
tabs(Editro);
panes(Editro);
__webpack_require__(42)(Editro);
__webpack_require__(43)(Editro);
__webpack_require__(29)(Editro);
__webpack_require__(45)(Editro);
__webpack_require__(50)(Editro);
wysiwyg(Editro);
__webpack_require__(31)(Editro);
__webpack_require__(40)(Editro);
__webpack_require__(36)(Editro);
__webpack_require__(32)(Editro);
__webpack_require__(33)(Editro);
__webpack_require__(37)(Editro);
__webpack_require__(39)(Editro);
__webpack_require__(38)(Editro);
__webpack_require__(35)(Editro);
__webpack_require__(34)(Editro);

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
    icon: __webpack_require__(27),
    title: 'Backward',
    onClick: () => e.backward(),
    group: 'history'
  }));
  e.addInstrument(new I(e, {
    icon: __webpack_require__(25),
    title: 'Forward',
    onClick: () => e.forward(),
    group: 'history'
  }));


  e.addInstrument(new I(e, {
    icon: __webpack_require__(24),
    title: 'Remove',
    onClick: () => currentEl && currentEl.remove(),
    group: 'element'
  }));
  e.addInstrument(new I(e, {
    icon: __webpack_require__(26),
    title: 'Toolbox',
    onClick: () => e.emit('toggle-right-panel'),
    group: 'panels'
  }));

  if (e.getOption('withFullscreen')) {
    e.addInstrument(new I(e, {
      icon: __webpack_require__(23),
      title: 'Fullscreen',
      onClick: () => e.setOption('fullScreen', !e.getOption('fullScreen')),
      group: 'panels'
    }));
  }
});

// frame return &amp;
Editro.defineHelper('codePostprocessor', 'amp', str => str.replace(/&amp;/g, '&'));


module.exports = Editro;


/***/ }
/******/ ])
});
;