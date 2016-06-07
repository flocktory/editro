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
/******/ 	__webpack_require__.p = "/static/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.default = function () {
	  for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
	    params[_key] = arguments[_key];
	  }

	  return new (Function.prototype.bind.apply(Editro, [null].concat(params)))();
	};

	__webpack_require__(1);

	var _Toolbox = __webpack_require__(17);

	var _Toolbox2 = _interopRequireDefault(_Toolbox);

	var _History = __webpack_require__(20);

	var _History2 = _interopRequireDefault(_History);

	var _editro = __webpack_require__(21);

	var _editro2 = _interopRequireDefault(_editro);

	var _default = __webpack_require__(22);

	var _default2 = _interopRequireDefault(_default);

	var _library = __webpack_require__(23);

	var _utils = __webpack_require__(19);

	var _i18n = __webpack_require__(58);

	var _i18n2 = _interopRequireDefault(_i18n);

	var _events = __webpack_require__(18);

	var _events2 = _interopRequireDefault(_events);

	var _nav = __webpack_require__(59);

	var nav = _interopRequireWildcard(_nav);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable new-cap */


	var EDITED_ATTR = 'current-edited-element';
	var stopPropagation = function stopPropagation(e) {
	  return e.stopPropagation();
	};

	var Editro = function (_EventEmitter) {
	  _inherits(Editro, _EventEmitter);

	  function Editro(root) {
	    var html = arguments.length <= 1 || arguments[1] === undefined ? _default2.default : arguments[1];
	    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    _classCallCheck(this, Editro);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Editro).call(this));

	    _initialiseProps.call(_this);

	    _this.options = options;
	    _this.root = root;
	    _this.i18n = (0, _i18n2.default)(options.i18n);
	    _this.elem = (0, _utils.elementSearch)(_this.root, 'Editro');

	    var rootComputedStyle = window.getComputedStyle(root);
	    if (!rootComputedStyle || rootComputedStyle.position === 'static') {
	      _this.root.style.position = 'relative';
	    }
	    _this.root.innerHTML = _editro2.default;

	    _this.preview = _this.elem('preview');

	    // Create history
	    _this.history = new _History2.default(_this.preview, function (html) {
	      _this.preview.srcdoc = html;
	      _this.emit('change', _this.sanitize(html));
	    });

	    // Build navigation elements
	    var navigation = options.nav ? options.nav.map(function (a) {
	      return a;
	    }) : []; // copy
	    navigation.unshift(nav.forward(_this.history));
	    navigation.unshift(nav.backward(_this.history));
	    _this.nav = navigation.map(function (n) {
	      var o = n(_this);
	      _this.elem('nav').appendChild(o.node);
	      return o;
	    });

	    _this.preview.addEventListener('load', _this.onPreviewLoad);

	    var enrichedHtml = _this.enrich(html);
	    _this.history.push(enrichedHtml);
	    _this.preview.srcdoc = enrichedHtml;

	    return _this;
	  }

	  // Public API. SHould not be changed. Should be binded to this


	  // return raw html string from preview, string contains additional data,
	  // should be sanitized before output

	  // end public API

	  _createClass(Editro, [{
	    key: 'setTarget',
	    value: function setTarget(target) {
	      if (this.toolbox) {
	        this.toolbox.destroy();
	      }
	      this.toolbox = this.createToolbox(target);
	    }
	  }, {
	    key: 'createToolbox',
	    value: function createToolbox(target) {
	      return new _Toolbox2.default(target, {
	        controllers: _library.controllers.concat(this.options.controllers || []),
	        root: this.elem('toolbox'),
	        i18n: this.i18n
	      });
	    }

	    /**
	     * Add usefull data to html (styles, attributs, etc)
	     * @param {String} html clean html
	     * @returns {String} html with additional data
	     */

	  }, {
	    key: 'sanitize',


	    /**
	     * Clean html from work data (styles, attrs, etc)
	     * @param {String} html html with data
	     * @returns {String} html clean html
	     */
	    value: function sanitize(html) {
	      return html.replace(/editro-body/gmi, '').replace(/\s*<!--EDITRO START-->[^]*<!--EDITRO END-->\s*/gmi, '');
	    }
	  }]);

	  return Editro;
	}(_events2.default);

	var _initialiseProps = function _initialiseProps() {
	  var _this2 = this;

	  this.destroy = function () {
	    _this2.elem('preview').removeEventListener('click', stopPropagation);
	    var editroElement = _this2.root.querySelector('.Editro');
	    _this2.root.removeChild(editroElement);
	    _this2.history.destroy();
	    _this2.nav.forEach(function (n) {
	      return n.destroy && n.destroy();
	    });
	  };

	  this.getHtml = function () {
	    return _this2.preview.contentDocument.documentElement ? '<!doctype html>\n' + _this2.preview.contentDocument.documentElement.outerHTML : '';
	  };

	  this.setHtml = function (html) {
	    if (_this2.sanitize(_this2.getHtml()) !== html) {
	      _this2.emit('change', html);
	      var enrichedHtml = _this2.enrich(html);
	      _this2.history.push(enrichedHtml);
	      _this2.preview.srcdoc = enrichedHtml;
	    }
	  };

	  this.onPreviewLoad = function () {
	    var contentDocument = _this2.preview.contentDocument;

	    var body = contentDocument.body;
	    if (_this2.toolbox) {
	      _this2.toolbox.destroy();
	    }
	    var selected = contentDocument.querySelector('[' + EDITED_ATTR + ']');
	    if (selected) {
	      _this2.toolbox = _this2.createToolbox(selected);
	    }
	    // Create toolbox when element selected
	    (0, _utils.click)(body, function (e) {
	      e.preventDefault();
	      [].forEach.call(body.querySelectorAll('[' + EDITED_ATTR + ']'), function (el) {
	        return el.removeAttribute(EDITED_ATTR);
	      });
	      e.target.setAttribute(EDITED_ATTR, EDITED_ATTR);
	      _this2.setTarget(e.target);
	    });

	    observeMutation(body, _this2.onPreviewMutated);
	    (0, _utils.click)(_this2.elem('preview'), stopPropagation);
	  };

	  this.onPreviewMutated = function () {
	    var html = _this2.getHtml();
	    _this2.history.push(html);
	    _this2.emit('change', _this2.sanitize(html));
	    if (!_this2.preview.contentDocument.body.querySelector('[' + EDITED_ATTR + ']')) {
	      _this2.toolbox.destroy();
	      _this2.toolbox = null;
	    }
	  };

	  this.enrich = function (html) {
	    var re = /<head[^>]*>/gmi;
	    // if no head present
	    var headPos = html.search(re);
	    if (headPos === -1) {
	      html = html.substring(0, headPos) + '<head></head>' + html.substring(headPos);
	    }
	    var additionalData = '\n      <head>\n      <!--EDITRO START-->\n      <style id="editro-style">\n        * {\n          cursor: pointer;\n        }\n        [' + EDITED_ATTR + '] {\n           outline: auto 5px -webkit-focus-ring-color;\n        }\n      </style>\n      <!--EDITRO END-->';

	    return html.split(re).join(additionalData);
	  };
	};

	/**
	 * Subscribe to element mutation
	 * @param {Element} element
	 * @param {Function} onMutate
	 */
	function observeMutation(element, onMutate) {
	  var observer = new window.MutationObserver(function () {
	    onMutate();
	  });
	  var config = { attributes: true, childList: true, characterData: true, subtree: true };
	  observer.observe(element, config);
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(16)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./editro.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./editro.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "@charset \"UTF-8\";\n.Editro {\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  font-family: Helvetica, Arial, sans-serif; }\n  .Editro,\n  .Editro *,\n  .Editro *:before,\n  .Editro *:after {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box; }\n  .Editro-wrapper {\n    position: relative;\n    height: 100%; }\n  .Editro-code {\n    display: none; }\n  .Editro-code[is-opened] {\n    position: relative;\n    display: block;\n    min-height: 50%; }\n  .Editro-previewWrapper {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 440px;\n    height: 100%;\n    background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==\"); }\n  .Editro-preview {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    border: none;\n    background: none; }\n  .Editro-nav {\n    position: absolute;\n    left: 0;\n    bottom: 0;\n    z-index: 1;\n    font-size: 16px;\n    font-weight: bold; }\n    .Editro-nav .EditroButton + .EditroButton {\n      margin-left: -1px; }\n  .Editro-reset {\n    display: none; }\n  .Editro-panel {\n    position: absolute;\n    top: 0;\n    right: 0;\n    width: 440px;\n    height: 100%;\n    background: white;\n    box-shadow: -4px 0 10px 0px rgba(20, 20, 20, 0.2); }\n\n.EditroButton {\n  background: linear-gradient(to bottom, #f8f8f8 0%, #f0f0f0 100%);\n  border: 1px solid #ccc;\n  cursor: pointer;\n  outline: none;\n  padding: 2px 6px; }\n  .EditroButton-wrapper {\n    display: block;\n    padding: 3px 7px;\n    background: transparent;\n    transition: background 0.3s; }\n  .EditroButton:active .EditroButton-wrapper {\n    background: #e2e2e2; }\n  .EditroButton[disabled] .EditroIcon {\n    opacity: 0.2; }\n\n.EditroPanelPlaceholder {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background: #fafafa;\n  align-items: center; }\n  .EditroPanelPlaceholder-text {\n    width: 100%;\n    text-align: center;\n    font-size: 24px;\n    line-height: 2;\n    font-weight: 100;\n    color: #ccc; }\n\n.EditroPanel {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  overflow-y: scroll;\n  background: white;\n  font-size: 0; }\n  .EditroPanel-section {\n    display: inline-block;\n    width: 100%;\n    padding: 20px; }\n    .EditroPanel-section + .EditroPanel-section {\n      border-top: 1px solid #ddd; }\n\n.EditroForm {\n  display: inline-block;\n  width: 100%;\n  vertical-align: top;\n  margin-bottom: 30px; }\n  .EditroForm:last-child {\n    margin-bottom: 0; }\n  .EditroForm--controls-separated .EditroControl + .EditroControl {\n    margin-top: 10px; }\n  .EditroForm-title {\n    margin-bottom: 10px;\n    font-size: 13px;\n    text-transform: uppercase;\n    color: #bbb; }\n  .EditroForm-controls + .EditroForm-controls {\n    margin-top: 10px; }\n\n.EditroField {\n  display: flex; }\n  .EditroField + .EditroField {\n    margin-top: 10px; }\n  .EditroField-label {\n    width: 40%;\n    margin-right: 20px;\n    white-space: nowrap; }\n    .EditroField-label:before {\n      content: '';\n      display: inline-block;\n      width: 0;\n      height: 27px;\n      vertical-align: middle; }\n  .EditroField--controlOnly .EditroField-label {\n    display: none; }\n  .EditroField-labelWrapper {\n    display: inline-block;\n    vertical-align: middle;\n    white-space: normal;\n    font-size: 13px;\n    line-height: 1; }\n  .EditroField-control {\n    width: 60%; }\n    .EditroField-control--inline {\n      display: flex; }\n  .EditroField--controlOnly .EditroField-control {\n    width: 100%; }\n  .EditroField-controlLabel {\n    display: inline-block;\n    vertical-align: middle;\n    margin-left: 5px;\n    font-size: 12px; }\n\n.EditroAction {\n  display: inline-block;\n  vertical-align: top;\n  height: 34px;\n  border: 1px solid #ccc;\n  border-radius: 2px;\n  background: linear-gradient(to bottom, #f8f8f8 0%, #f0f0f0 100%);\n  outline: none;\n  font-size: 0; }\n  .EditroAction-text {\n    display: inline-block;\n    padding: 0 20px;\n    text-align: left;\n    line-height: 34px;\n    font-size: 14px; }\n  .EditroAction-choice {\n    vertical-align: top;\n    height: 32px;\n    padding: 0 7px;\n    background: none;\n    border: none;\n    border-left: 1px solid #ccc;\n    cursor: pointer;\n    outline: none; }\n    .EditroAction-choice:hover {\n      background: rgba(0, 0, 0, 0.1); }\n  .EditroAction--delete {\n    width: auto;\n    margin-right: 0;\n    float: right;\n    border-color: #a0252b;\n    background: linear-gradient(to bottom, #e4353e 0%, #d9333b 100%);\n    color: white;\n    cursor: pointer; }\n\n.EditroTextContent {\n  position: relative;\n  padding: 5px 8px;\n  border: 1px solid #ccc;\n  border-radius: 2px;\n  background: linear-gradient(to bottom, #f8f8f8 0%, #f0f0f0 100%);\n  font-size: 12px;\n  outline: none;\n  line-height: 1.4; }\n  .EditroTextContent-preview {\n    color: #ccc; }\n  .EditroTextContent-previewLabel {\n    position: absolute;\n    bottom: 2px;\n    right: 2px;\n    color: #999;\n    font-size: 11px;\n    line-height: 1; }\n  .EditroTextContent-editable {\n    outline: none; }\n\n.EditroToggler[collapsed=false] .EditroToggler-less, .EditroToggler-less[collapsed=false] {\n  display: none; }\n\n.EditroToggler[collapsed=true] .EditroToggler-more, .EditroToggler-more[collapsed=true] {\n  display: none; }\n\n.EditroBtnGroup {\n  display: inline-block;\n  vertical-align: top;\n  overflow: hidden;\n  font-size: 0;\n  border: 1px solid #ccc;\n  border-radius: 2px;\n  background: linear-gradient(to bottom, #f8f8f8 0%, #f0f0f0 100%); }\n  .EditroBtnGroup-item {\n    display: inline-block;\n    vertical-align: top;\n    cursor: pointer; }\n  .EditroBtnGroup-input {\n    display: none; }\n  .EditroBtnGroup-itemWrapper {\n    display: inline-block;\n    padding: 5px 8px;\n    text-align: center;\n    overflow: hidden; }\n  .EditroBtnGroup-input:checked + .EditroBtnGroup-itemWrapper {\n    background: #e2e2e2;\n    box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.1); }\n\n.EditroColor {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  width: 43px;\n  height: 27px;\n  border: 1px solid #ccc;\n  border-radius: 2px;\n  background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==\"); }\n  .EditroColor:hover {\n    z-index: 100; }\n  .EditroColor-colorWrapper {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    cursor: pointer;\n    overflow: hidden;\n    border-radius: 2px; }\n  .EditroColor-color {\n    margin: -10px 0 0 -10px;\n    width: 100px;\n    height: 100px;\n    background: none;\n    border: none;\n    outline: none; }\n  .EditroColor-placeholder {\n    line-height: 22px;\n    height: 27px;\n    text-align: center;\n    margin: -1px;\n    border: 1px solid #ccc;\n    border-style: dashed;\n    border-radius: 2px;\n    background: white;\n    cursor: pointer; }\n    .EditroColor-placeholder:before {\n      content: '+';\n      font-size: 18px;\n      color: #999;\n      font-weight: lighter; }\n  .EditroColor-panel {\n    position: absolute;\n    top: 100%;\n    left: 0;\n    display: none;\n    margin-top: -3px;\n    width: 130px;\n    padding: 10px;\n    background: linear-gradient(to bottom, #f8f8f8 0%, #f0f0f0 100%);\n    border: 1px solid #ccc; }\n  .EditroColor:hover .EditroColor-panel {\n    display: block; }\n  .EditroColor-opacity.EditroRange {\n    margin: 10px 0 5px 2px;\n    width: 102px; }\n\n.EditroSelect {\n  position: relative;\n  vertical-align: top; }\n  .EditroSelect:after {\n    content: '\\25BE';\n    position: absolute;\n    top: 0;\n    right: 4px;\n    line-height: 27px;\n    color: #aaa;\n    font-size: 11px; }\n  .EditroSelect-select {\n    width: 100%;\n    height: 27px;\n    padding: 0 15px 0 5px;\n    border: 1px solid #ccc;\n    border-radius: 2px;\n    -moz-appearance: none;\n    -webkit-appearance: none;\n    background: linear-gradient(to bottom, #f8f8f8 0%, #f0f0f0 100%);\n    outline: none;\n    font-size: 12px; }\n\n.EditroInputWrapper {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  height: 27px;\n  border: 1px solid #ccc;\n  border-radius: 2px;\n  background: linear-gradient(to bottom, #f8f8f8 0%, #f0f0f0 100%); }\n  .EditroInputWrapper[unit] {\n    padding-right: 14px; }\n  .EditroInputWrapper[unit]:after {\n    content: attr(unit);\n    position: absolute;\n    top: 0;\n    right: 3px;\n    line-height: 26px;\n    display: inline;\n    font-size: 12px;\n    color: #999; }\n  .EditroInputWrapper--small {\n    width: 60px; }\n  .EditroInputWrapper--medium {\n    width: 180px; }\n  .EditroInputWrapper--full {\n    width: 100%; }\n\n.EditroInput {\n  width: 100%;\n  height: 25px;\n  padding: 0 5px;\n  font-size: 12px;\n  outline: none;\n  background: none;\n  border: none; }\n\n.EditroSize {\n  display: flex;\n  align-items: center;\n  vertical-align: top;\n  white-space: nowrap;\n  font-size: 0; }\n  .EditroSize-input {\n    position: relative;\n    width: 100%; }\n    .EditroSize-input .EditroInput {\n      width: 100%; }\n  .EditroSize-separator {\n    min-width: 30px;\n    text-align: center;\n    font-size: 14px;\n    color: #999; }\n\n.EditroFourInputs {\n  position: relative;\n  vertical-align: top;\n  background: white; }\n  .EditroFourInputs-outer, .EditroFourInputs-inner {\n    border: 2px solid #999;\n    border-radius: 2px;\n    background: rgba(0, 0, 0, 0.05); }\n    .EditroFourInputs-outer[shape=imag], .EditroFourInputs-inner[shape=imag] {\n      border-style: dashed;\n      background: none; }\n  .EditroFourInputs-outer {\n    width: 100%;\n    height: 120px; }\n  .EditroFourInputs-inner {\n    position: absolute;\n    top: 40px;\n    bottom: 40px;\n    left: 55px;\n    right: 55px; }\n  .EditroFourInputs-arrow {\n    position: absolute; }\n    .EditroFourInputs-arrow:before {\n      content: '';\n      position: absolute;\n      width: 7px;\n      height: 13px;\n      background: url(" + __webpack_require__(4) + ") 0 0/7px no-repeat; }\n    .EditroFourInputs-arrow--top {\n      top: 1px;\n      left: 50%;\n      height: 39px;\n      border-left: 2px solid #999; }\n    .EditroFourInputs-arrow--bottom {\n      bottom: 1px;\n      left: 50%;\n      height: 39px;\n      border-left: 2px solid #999; }\n    .EditroFourInputs-arrow--right {\n      right: 1px;\n      top: 50%;\n      width: 54px;\n      border-top: 2px solid #999; }\n    .EditroFourInputs-arrow--left {\n      left: 1px;\n      top: 50%;\n      width: 54px;\n      border-top: 2px solid #999; }\n  .EditroFourInputs[arrow-direction=out] .EditroFourInputs-arrow--top:before {\n    top: -3px;\n    left: -4px;\n    transform: rotate(-90deg); }\n  .EditroFourInputs[arrow-direction=out] .EditroFourInputs-arrow--bottom:before {\n    bottom: -3px;\n    left: -5.5px;\n    transform: rotate(90deg); }\n  .EditroFourInputs[arrow-direction=out] .EditroFourInputs-arrow--right:before {\n    top: -7px;\n    right: 0; }\n  .EditroFourInputs[arrow-direction=out] .EditroFourInputs-arrow--left:before {\n    top: -8px;\n    left: 0;\n    transform: rotate(180deg); }\n  .EditroFourInputs[arrow-direction=in] .EditroFourInputs-arrow--top:before {\n    bottom: -3px;\n    left: -5px;\n    transform: rotate(90deg); }\n  .EditroFourInputs[arrow-direction=in] .EditroFourInputs-arrow--bottom:before {\n    top: -3px;\n    left: -4px;\n    transform: rotate(-90deg); }\n  .EditroFourInputs[arrow-direction=in] .EditroFourInputs-arrow--right:before {\n    top: -8px;\n    left: 0;\n    transform: rotate(180deg); }\n  .EditroFourInputs[arrow-direction=in] .EditroFourInputs-arrow--left:before {\n    top: -7px;\n    right: 0; }\n  .EditroFourInputs-input {\n    position: absolute;\n    width: 32px;\n    height: 16px;\n    padding-bottom: 1px;\n    text-align: center;\n    border: none;\n    outline: none;\n    background: #aaa;\n    border-radius: 2px;\n    font-size: 10px;\n    color: white; }\n    .EditroFourInputs-input::-webkit-input-placeholder {\n      color: #eee; }\n    .EditroFourInputs-input::-moz-placeholder {\n      color: #eee; }\n    .EditroFourInputs-input::-webkit-outer-spin-button, .EditroFourInputs-input::-webkit-inner-spin-button {\n      -webkit-appearance: none;\n      margin: 0; }\n    .EditroFourInputs-input--top {\n      top: 20px;\n      left: 50%;\n      margin-left: -16px; }\n    .EditroFourInputs-input--bottom {\n      bottom: 20px;\n      left: 50%;\n      margin-left: -16px; }\n    .EditroFourInputs-input--right {\n      right: 27.5px;\n      top: 50%;\n      margin-top: -8px; }\n    .EditroFourInputs-input--left {\n      left: 27.5px;\n      top: 50%;\n      margin-top: -8px; }\n  .EditroFourInputs[arrow-direction=in] .EditroFourInputs-input--top {\n    margin-top: -12px; }\n  .EditroFourInputs[arrow-direction=in] .EditroFourInputs-input--bottom {\n    margin-bottom: -12px; }\n  .EditroFourInputs[arrow-direction=in] .EditroFourInputs-input--right {\n    margin-right: -20px; }\n  .EditroFourInputs[arrow-direction=in] .EditroFourInputs-input--left {\n    margin-left: -20px; }\n  .EditroFourInputs[arrow-direction=out] .EditroFourInputs-input--top {\n    margin-top: -2px; }\n  .EditroFourInputs[arrow-direction=out] .EditroFourInputs-input--bottom {\n    margin-bottom: -2px; }\n  .EditroFourInputs[arrow-direction=out] .EditroFourInputs-input--right {\n    margin-right: -10px; }\n  .EditroFourInputs[arrow-direction=out] .EditroFourInputs-input--left {\n    margin-left: -10px; }\n\n.EditroRange {\n  -webkit-appearance: none;\n  width: 100%; }\n  .EditroRange:focus {\n    outline: none; }\n  .EditroRange::-webkit-slider-runnable-track {\n    width: 100%;\n    height: 0;\n    cursor: pointer;\n    border-top: 1px solid #777;\n    box-shadow: none; }\n  .EditroRange::-webkit-slider-thumb {\n    border: 1px solid #777;\n    height: 11px;\n    width: 11px;\n    margin-top: -6px;\n    cursor: pointer;\n    background: white;\n    border-radius: 100%;\n    -webkit-appearance: none; }\n  .EditroRange::-moz-range-track {\n    width: 100%;\n    height: 0;\n    cursor: pointer;\n    border-top: 1px solid #777;\n    box-shadow: none; }\n  .EditroRange::-moz-range-thumb {\n    border: 1px solid #777;\n    height: 11px;\n    width: 11px;\n    margin-top: -6px;\n    cursor: pointer;\n    background: white;\n    border-radius: 100%;\n    -webkit-appearance: none; }\n\n.EditroFileInput {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  width: 43px;\n  height: 27px;\n  text-align: center;\n  padding: 5px 10px;\n  border: 1px solid #ccc;\n  border-radius: 2px;\n  background: linear-gradient(to bottom, #f8f8f8 0%, #f0f0f0 100%);\n  cursor: pointer;\n  overflow: hidden; }\n  .EditroFileInput-control {\n    position: absolute;\n    top: 0;\n    left: 0;\n    display: block;\n    width: 100px;\n    height: 100%;\n    opacity: 0;\n    cursor: pointer; }\n\n.EditroBool {\n  position: relative;\n  display: inline-block;\n  vertical-align: middle;\n  width: 30px;\n  height: 15px;\n  border: 1px solid #ccc;\n  border-radius: 15px;\n  background: #ddd;\n  cursor: pointer; }\n  .EditroBool:before {\n    content: '';\n    position: absolute;\n    top: 0;\n    width: 13px;\n    height: 13px;\n    border: 1px solid #ccc;\n    border-radius: 100px;\n    background: linear-gradient(to bottom, #f8f8f8 0%, #f0f0f0 100%);\n    transition: left 0.05s; }\n  .EditroBool[state=true]:before {\n    left: 15px; }\n  .EditroBool[state=false]:before {\n    left: 0; }\n\n.EditroIcon {\n  display: inline-block;\n  vertical-align: middle;\n  width: 15px;\n  height: 15px;\n  line-height: 14px;\n  text-align: center;\n  background: 50% 50% / contain no-repeat; }\n  .EditroIcon--reset {\n    background-image: url(" + __webpack_require__(5) + "); }\n  .EditroIcon--f {\n    background-image: url(" + __webpack_require__(6) + "); }\n  .EditroIcon--b {\n    background-image: url(" + __webpack_require__(6) + ");\n    transform: rotate(180deg); }\n  .EditroIcon--tal {\n    background-image: url(" + __webpack_require__(7) + "); }\n  .EditroIcon--tac {\n    background-image: url(" + __webpack_require__(8) + "); }\n  .EditroIcon--tar {\n    background-image: url(" + __webpack_require__(9) + "); }\n  .EditroIcon--fln {\n    background-image: url(" + __webpack_require__(10) + ");\n    background-size: 20px; }\n  .EditroIcon--fll {\n    background-image: url(" + __webpack_require__(11) + ");\n    background-size: 20px; }\n  .EditroIcon--flr {\n    background-image: url(" + __webpack_require__(12) + ");\n    background-size: 20px; }\n  .EditroIcon--lh {\n    margin-right: 2px; }\n  .EditroIcon--lh:before {\n    content: '\\2195';\n    line-height: 27px;\n    font-size: 16px; }\n  .EditroIcon--fz {\n    line-height: 27px;\n    margin-right: 5px; }\n    .EditroIcon--fz:before {\n      content: 'T';\n      font-size: 9px; }\n    .EditroIcon--fz:after {\n      content: 'T';\n      font-size: 15px; }\n  .EditroIcon--fwn:before, .EditroIcon--fwb:before, .EditroIcon--fsi:before, .EditroIcon--fwbfsi:before {\n    content: 'T';\n    font-size: 9px; }\n  .EditroIcon--fwn:after, .EditroIcon--fwb:after, .EditroIcon--fsi:after, .EditroIcon--fwbfsi:after {\n    content: 'T';\n    font-size: 15px; }\n  .EditroIcon--fwn {\n    font-size: 14px;\n    font-weight: lighter; }\n  .EditroIcon--fwb {\n    font-size: 14px;\n    font-weight: bold; }\n  .EditroIcon--fsi {\n    font-size: 14px;\n    font-weight: lighter;\n    font-style: italic; }\n  .EditroIcon--fwbfsi {\n    font-size: 14px;\n    font-weight: bold;\n    font-style: italic; }\n  .EditroIcon--vab, .EditroIcon--vasub, .EditroIcon--vasup {\n    font-size: 15px; }\n    .EditroIcon--vab:before, .EditroIcon--vasub:before, .EditroIcon--vasup:before {\n      content: 'T'; }\n    .EditroIcon--vab:after, .EditroIcon--vasub:after, .EditroIcon--vasup:after {\n      content: '1'; }\n  .EditroIcon--vasub:after {\n    font-size: 10px;\n    vertical-align: sub; }\n  .EditroIcon--vasup {\n    position: relative;\n    top: -2px; }\n    .EditroIcon--vasup:after {\n      font-size: 10px;\n      vertical-align: super; }\n  .EditroIcon--bd, .EditroIcon--bdn, .EditroIcon--bdcustom, .EditroIcon--bdt, .EditroIcon--bdr, .EditroIcon--bdb, .EditroIcon--bdl {\n    border: 1px dotted #999;\n    border-radius: 1px; }\n  .EditroIcon--bd {\n    border: 2px solid #999; }\n  .EditroIcon--bdcustom:before {\n    content: '?';\n    font-size: 12px;\n    color: #999; }\n  .EditroIcon--bdt {\n    margin-top: 6px;\n    border-top: 2px solid #999; }\n  .EditroIcon--bdr {\n    margin-top: 6px;\n    border-right: 2px solid #999; }\n  .EditroIcon--bdb {\n    margin-top: 6px;\n    border-bottom: 2px solid #999; }\n  .EditroIcon--bdl {\n    margin-top: 6px;\n    border-left: 2px solid #999; }\n  .EditroIcon--solid, .EditroIcon--dashed, .EditroIcon--dotted {\n    width: 20px;\n    height: 8px;\n    margin-top: 7px;\n    border-top: 2px #999; }\n  .EditroIcon--solid {\n    border-top-style: solid; }\n  .EditroIcon--dashed {\n    border-top-style: dashed; }\n  .EditroIcon--dotted {\n    border-top-style: dotted; }\n  .EditroIcon--ib, .EditroIcon--ia, .EditroIcon--ab, .EditroIcon--aa {\n    width: 20px;\n    height: 20px;\n    position: relative; }\n    .EditroIcon--ib:before, .EditroIcon--ia:before, .EditroIcon--ab:before, .EditroIcon--aa:before {\n      content: '';\n      position: absolute;\n      left: 5px;\n      display: block;\n      width: 10px;\n      height: 10px;\n      background: url(" + __webpack_require__(13) + ") 50% 50%/100% no-repeat; }\n    .EditroIcon--ib:after, .EditroIcon--ia:after, .EditroIcon--ab:after, .EditroIcon--aa:after {\n      content: '';\n      display: block;\n      border: 2px solid;\n      border-radius: 2px; }\n  .EditroIcon--ib:before {\n    top: 0px; }\n  .EditroIcon--ib:after {\n    height: 10px;\n    margin-top: 10px;\n    border-bottom: none; }\n  .EditroIcon--ia:before {\n    bottom: 0; }\n  .EditroIcon--ia:after {\n    height: 10px;\n    margin-bottom: 10px;\n    border-top: none; }\n  .EditroIcon--ab:before {\n    top: 2px; }\n  .EditroIcon--ab:after {\n    height: 20px; }\n  .EditroIcon--aa:before {\n    bottom: 2px; }\n  .EditroIcon--aa:after {\n    height: 20px; }\n  .EditroIcon--expand:before {\n    content: '\\21A7';\n    font-size: 18px; }\n  .EditroIcon--collapse:before {\n    content: '\\21A5';\n    font-size: 18px; }\n  .EditroIcon--resize:before {\n    content: '\\2194';\n    font-size: 18px; }\n  .EditroIcon--close:before {\n    content: '\\D7';\n    font-size: 24px;\n    line-height: 13px; }\n  .EditroIcon--fullScreen:before {\n    content: '\\21F1';\n    font-size: 18px; }\n  .EditroIcon--fullScreenOut:before {\n    content: '\\21F2';\n    font-size: 18px; }\n  .EditroIcon--upload {\n    background: url(" + __webpack_require__(14) + ") 50% 50%/cover no-repeat; }\n  .EditroIcon--bgsn, .EditroIcon--bgscov, .EditroIcon--bgscon, .EditroIcon--bgptl, .EditroIcon--bgptr, .EditroIcon--bgpbl, .EditroIcon--bgpbr, .EditroIcon--bgpc {\n    box-shadow: inset 0 0 4px #888; }\n  .EditroIcon--bgsn {\n    background: url(" + __webpack_require__(15) + ") 50% 50%/8px no-repeat; }\n  .EditroIcon--bgscov {\n    background: url(" + __webpack_require__(15) + ") 50% 50%/cover no-repeat; }\n  .EditroIcon--bgscon {\n    background: url(" + __webpack_require__(15) + ") 50% 50%/contain no-repeat; }\n  .EditroIcon--bgptl {\n    background: url(" + __webpack_require__(15) + ") 0 0/8px no-repeat; }\n  .EditroIcon--bgptr {\n    background: url(" + __webpack_require__(15) + ") 100% 0/8px no-repeat; }\n  .EditroIcon--bgpbl {\n    background: url(" + __webpack_require__(15) + ") 0 100%/8px no-repeat; }\n  .EditroIcon--bgpbr {\n    background: url(" + __webpack_require__(15) + ") 100% 100%/8px no-repeat; }\n  .EditroIcon--bgpc {\n    background: url(" + __webpack_require__(15) + ") 50% 50%/8px no-repeat; }\n  .EditroIcon--gradr, .EditroIcon--gradbr, .EditroIcon--gradb, .EditroIcon--gradbl {\n    box-shadow: inset 0 0 3px #888; }\n  .EditroIcon--gradr {\n    background: linear-gradient(to right, transparent 20%, rgba(0, 0, 0, 0.6) 100%); }\n  .EditroIcon--gradbr {\n    background: linear-gradient(to bottom right, transparent 20%, rgba(0, 0, 0, 0.6) 100%); }\n  .EditroIcon--gradb {\n    background: linear-gradient(to bottom, transparent 20%, rgba(0, 0, 0, 0.6) 100%); }\n  .EditroIcon--gradbl {\n    background: linear-gradient(to bottom left, transparent 20%, rgba(0, 0, 0, 0.6) 100%); }\n", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSI3cHgiIGhlaWdodD0iMTNweCIgdmlld0JveD0iMCAwIDcgMTMiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxwYXRoIHN0cm9rZT0iIzk5OTk5OSIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMCwwIEw2LDYgTDAsMTMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgLz4KPC9nPgo8L3N2Zz4K"

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iMzJweCIgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMzIgMzIiIHdpZHRoPSIzMnB4IiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48cGF0aCBkPSJNMjgsMTZjLTEuMjE5LDAtMS43OTcsMC44NTktMiwxLjc2NkMyNS4yNjksMjEuMDMsMjIuMTY3LDI2LDE2LDI2Yy01LjUyMywwLTEwLTQuNDc4LTEwLTEwUzEwLjQ3Nyw2LDE2LDYgIGMyLjI0LDAsNC4yOTUsMC43NTMsNS45NiwySDIwYy0xLjEwNCwwLTIsMC44OTYtMiwyczAuODk2LDIsMiwyaDZjMS4xMDQsMCwyLTAuODk2LDItMlY0YzAtMS4xMDQtMC44OTYtMi0yLTJzLTIsMC44OTYtMiwydjAuNTE4ICBDMjEuNzMzLDIuOTMyLDE4Ljk3NywyLDE2LDJDOC4yNjgsMiwyLDguMjY4LDIsMTZzNi4yNjgsMTQsMTQsMTRjOS45NzksMCwxNC05LjUsMTQtMTEuODc1QzMwLDE2LjY3MiwyOC45MzgsMTYsMjgsMTZ6Ii8+PC9zdmc+"

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8IURPQ1RZUEUgc3ZnICBQVUJMSUMgJy0vL1czQy8vRFREIFNWRyAxLjEvL0VOJyAgJ2h0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCc+CjxzdmcgaGVpZ2h0PSI1MTJweCIgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHBhdGggZD0iTTQwNS4yLDIzMi45TDEyNi44LDY3LjJjLTMuNC0yLTYuOS0zLjItMTAuOS0zLjJjLTEwLjksMC0xOS44LDktMTkuOCwyMEg5NnYzNDRoMC4xYzAsMTEsOC45LDIwLDE5LjgsMjAgIGM0LjEsMCw3LjUtMS40LDExLjItMy40bDI3OC4xLTE2NS41YzYuNi01LjUsMTAuOC0xMy44LDEwLjgtMjMuMUM0MTYsMjQ2LjcsNDExLjgsMjM4LjUsNDA1LjIsMjMyLjl6Ii8+Cjwvc3ZnPgo="

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE3Ljk4NiwxNi4wMDFjMCwwLjI3NC0wLjIyMywwLjQ5OS0wLjUsMC40OTlIMC41Yy0wLjI3NSwwLTAuNS0wLjIyNS0wLjUtMC40OTkgIFYxNGMwLTAuMjc1LDAuMjI1LTAuNSwwLjUtMC41aDE2Ljk4NmMwLjI3NywwLDAuNSwwLjIyNSwwLjUsMC41VjE2LjAwMXogTTIxLjk4Niw4YzAtMC4yNzUtMC4yMjMtMC41LTAuNS0wLjVIMC41ICBDMC4yMjUsNy41LDAsNy43MjUsMCw4djIuMDAxQzAsMTAuMjc1LDAuMjI1LDEwLjUsMC41LDEwLjVoMjAuOTg2YzAuMjc3LDAsMC41LTAuMjI1LDAuNS0wLjQ5OVY4eiBNMTMuOTg2LDIgIGMwLTAuMjc1LTAuMjIzLTAuNS0wLjUtMC41SDAuNUMwLjIyNSwxLjUsMCwxLjcyNSwwLDJ2Mi4wMDFDMCw0LjI3NSwwLjIyNSw0LjUsMC41LDQuNWgxMi45ODZjMC4yNzcsMCwwLjUtMC4yMjUsMC41LTAuNDk5VjJ6ICAgTTI0LDIwYzAtMC4yNzUtMC4yMjUtMC41LTAuNS0wLjVoLTIzQzAuMjI1LDE5LjUsMCwxOS43MjUsMCwyMHYyLjAwMUMwLDIyLjI3NSwwLjIyNSwyMi41LDAuNSwyMi41aDIzICBjMC4yNzUsMCwwLjUtMC4yMjUsMC41LTAuNDk5VjIweiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+"

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTQsMTRjMC0wLjI3NSwwLjIyNS0wLjUsMC41LTAuNWgxNWMwLjI3NSwwLDAuNSwwLjIyNSwwLjUsMC41djIuMDAxICBjMCwwLjI3NC0wLjIyNSwwLjQ5OS0wLjUsMC40OTloLTE1Yy0wLjI3NSwwLTAuNS0wLjIyNS0wLjUtMC40OTlWMTR6IE0wLDEwLjAwMUMwLDEwLjI3NSwwLjIyNSwxMC41LDAuNSwxMC41aDIzICBjMC4yNzUsMCwwLjUtMC4yMjUsMC41LTAuNDk5VjhjMC0wLjI3NS0wLjIyNS0wLjUtMC41LTAuNWgtMjNDMC4yMjUsNy41LDAsNy43MjUsMCw4VjEwLjAwMXogTTQsNC4wMDFDNCw0LjI3NSw0LjIyNSw0LjUsNC41LDQuNSAgaDE1YzAuMjc1LDAsMC41LTAuMjI1LDAuNS0wLjQ5OVYyYzAtMC4yNzUtMC4yMjUtMC41LTAuNS0wLjVoLTE1QzQuMjI1LDEuNSw0LDEuNzI1LDQsMlY0LjAwMXogTTAsMjIuMDAxICBDMCwyMi4yNzUsMC4yMjUsMjIuNSwwLjUsMjIuNWgyM2MwLjI3NSwwLDAuNS0wLjIyNSwwLjUtMC40OTlWMjBjMC0wLjI3NS0wLjIyNS0wLjUtMC41LTAuNWgtMjNDMC4yMjUsMTkuNSwwLDE5LjcyNSwwLDIwVjIyLjAwMXoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg=="

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTYuMDE0LDE0YzAtMC4yNzQsMC4yMjMtMC41LDAuNS0wLjVIMjMuNWMwLjI3NSwwLDAuNSwwLjIyNSwwLjUsMC41djIuMDAxICBjMCwwLjI3NC0wLjIyNSwwLjQ5OS0wLjUsMC40OTlINi41MTRjLTAuMjc3LDAtMC41LTAuMjI1LTAuNS0wLjQ5OVYxNHogTTIuMDE0LDEwLjAwMWMwLDAuMjc0LDAuMjIzLDAuNDk5LDAuNSwwLjQ5OUgyMy41ICBjMC4yNzUsMCwwLjUtMC4yMjUsMC41LTAuNDk5VjhjMC0wLjI3NC0wLjIyNS0wLjUtMC41LTAuNUgyLjUxNGMtMC4yNzcsMC0wLjUsMC4yMjUtMC41LDAuNVYxMC4wMDF6IE0xMC4wMTQsNC4wMDEgIGMwLDAuMjc0LDAuMjIzLDAuNDk5LDAuNSwwLjQ5OUgyMy41YzAuMjc1LDAsMC41LTAuMjI1LDAuNS0wLjQ5OVYyYzAtMC4yNzQtMC4yMjUtMC41LTAuNS0wLjVIMTAuNTE0Yy0wLjI3NywwLTAuNSwwLjIyNS0wLjUsMC41ICBWNC4wMDF6IE0wLDIyLjAwMUMwLDIyLjI3NSwwLjIyNSwyMi41LDAuNSwyMi41SDIzLjVjMC4yNzUsMCwwLjUtMC4yMjUsMC41LTAuNDk5VjIwYzAtMC4yNzQtMC4yMjUtMC41LTAuNS0wLjVIMC41ICBDMC4yMjUsMTkuNSwwLDE5LjcyNSwwLDIwVjIyLjAwMXoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg=="

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAe1BMVEUAAABEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBEREAFBQUGBgYBAQEAAAAAAAAAAAABAQEFBQUGBgYAAAAPDw4LCwoKCgkCAgIAAAABAQEAAAACAgIBAQEAAAAAAAACAgIEBAQEBAMBAQEAAACi073iAAAAJXRSTlMAAQIDBAUGBwgJCgsMDg+wsa2scaipra1vSGJhWVjHyTxwHVRVY0B/ewAAAt1JREFUeNrtm21zojAUhSUQDCShtmvrLsq+Wav//xcugiDjNL1ZkpvozM0n55KZcwQ895nELBb3NhLGWBKhNoz0PCLUBmsZ5zxLgtfGazzPc54Er43XlkKIZRK8Nl4TRVGIJHhtGKyUUpYseG28JpVSkgWvXa9prdXNfIVfG59NqXSlb+brqsKuLZLh3ZCtu/D6Scouv42ifToR9LPeQMJFIWUEfc57A1kuijKC/jLn6fkdSHkuRHh9JkRroHsReH6TjUH0y0LkWfcp5TyCvpSF6HVZmkXQbxOxuNx3lkbQbxNRDj3ppjWF0a+0Kg098Wm1Wj09v0zHs5/at6knbepJ+nA4fBxP03H88FNbT++JMulXaPqDgU970sQbmv7FAKRfoen3BkB9/bqejte3zWbz5qf23Uo/ApOM2RRZX+qo+sSExITEhA/BhD+s+j8iE9ZW/QeRCbdW/Q+RCXdW/deZCc3PsLHq/5bvpJkJzc+wN2Du/z87T5a/CTWDCXoD5nnb7p649eQv518NfD6v7p4Jnv7VgGFe3b0TePqjga9zAk9/MADkBCIT9gagnEBkws7AEcoJRCZsgKyfGkBhwgbIeignnJmwAbIeyglnJmyArIdywpkJd0DWQznhzIRQ1kM54cyEUNZDOeHMhFDWQznhiQnn54QnJpyfE56YcH5OeGLC+TnhiQnn5wQxITEhMaEnJjTvCfwKw4TQmjQ6E0Jr4uhMCK3TozMhtE6DyIS/rfYJaJ2Q9o5p7xiRCb3W5jCh15q6073De9DH+e/A+P8B+Puj7V13m9cW9x9N/7S2Y0I0/daAFROi6Z/WdkyI89+B8/hDe8e0d0xMSExITEhMSEz4IPq7Zjp227qut/9d++vw/b3wz95hndALf+0d1gm98N/eYZ3QC3/uHdYJvTDxOzEhMSEx4WMzoQpy7s7MhKHOHZb3ee4y9rnT6OduY587jnzuOva580jn7v8BLC3Y85aLgJAAAAAASUVORK5CYII="

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAflBMVEUAAABEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBEREAFBQUGBgYBAQEAAAAAAAAAAAABAQEFBQUGBgYAAAAAAAAAAAAAAAAAAAACAgIKCgkLCwoAAAACAgIKCgkLCwoAAAAAAAAEBAQEBAMBAQEAAAAvmR5+AAAAJnRSTlMAAQIDBAUGBwgJCgsMDg+wsa2scaipra1vOVTFWFlhYjpVXV7IOLxFPMAAAAMQSURBVHja7ZvtcuIgFIbNB5GEkNrdqFu2rdVUq/d/g2ujSRhWhAgH0hn45ZxkeE8IvjzDCbPZ1FoUx3HkIda15Lt5iHWppQihNHIe66+hLMtQ5DzWX5tjjOeR81h/Ded5jiPnsa7FBSGkiJ3H+mukLEsSO48N1yilpXB/CR/r301R0ooK99Oqgo7Nom5ukHN27vWjJL7+N/Lz2/Ggn14SiBDOCfGgj9AlgTTDeeFBf56h5HsOJCjD2L1+jPE5gXYioEzwRif6RY6ztP2VIORBn5AcX3TjJPWgf3bE/DruceJB/+yIpFuThKXJjX5Fy0KyJj4tFoun5198e7YT+83nRGVrEj0cDl/HE9+OX3ZiNT8mpUy/AtPvEri5JnG5gelfE1DpV2D6lwSU+nRZ8225Wq/XKzuxP1r6Hpik9ybP+oR61Q9MGJgwMOGEmFBrrX8BZEKtdYUBMqHWWscAmVBrrWWATKi11jPjOalgwr/ydf2SwNDva9/e3jebzfvbK9/42McIJmTyZ2gT2A4xGCZk8jFs+90NMRgmZPJ32PbbDDHrTHg88Qn8f3/bbzPE9Dm11mPCE5/AjfvbfhthTmj9d2s9JuQTuHV/2+8OkAm5BG720T7XFpAJVV7fjisDZEKV16t8wpgJVV6v8gljJlR5vconjJlQ9PqxPmHMhKLXj/UJYyYUvV7sQ+UTxkwoer3Yh8on7DBhI+/DDRM28j7cMOEdr3fDhHe83g0T3vF6lU9oxuwxod01OTBhYMIHmFB/77YewYSf8v1/0ScYY9td0zS7LePbjdh+BBOqxhWcCVXjCs6EqvcKzoSqeQXJhFr7//uwTxhqx6F2DMiEjmpnciZ0VDsrJ1o7nIK+lW8HXgye30qdmhmMv5XaOZs9Xju2UrtnpvuEpt8OMIN9QivfDuxD7TjUjgMTBiYMTBiYMDDhT9aX1/9NYx8OmdB4nxBCf9Q+IYT+qba4T/hQbGlxn/Ch2CowYWDCwIQ/hglLJ+fu5Ezo6txhMc1zl77PnXo/d+v73LHnc9e+z517Onf/D6hoJthGWCPEAAAAAElFTkSuQmCC"

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAilBMVEUAAABEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBEREAFBQUGBgYBAQEAAAAAAAAAAAABAQEFBQUGBgYAAAAAAAALCwoKCgkCAgIAAAAPDw4BAQEAAAAAAAACAgIKCgkLCwoAAAAAAAAJCQgAAAAAAAAEBAQEBAMBAQEAAAD6boIHAAAAKnRSTlMAAQIDBAUGBwgJCgsMDg+wsa2scaipra1vdGJhWVhG4uRUVV1eOOV4OTrDZZSQAAADL0lEQVR42u2bfXfaIBTGzQuRBBJjRLPZbqutXTt13//rLb4kYoQFlAv2HPjLXjh9rgk+/MINo9GjtSAMw8BBrG3RvjmItanFCKE4sB7r+lCSJCiwHuv6xhjjcWA91vXhNE1xYD3WtjAjhGSh9VjXRyilJLQeO/fleU574yl8rLs3Gc2LvDc+Lwro2Cho5wZpsrOvH0Th6beRNnfHgX58TCBAOCXEgT5CxwTiBKeZA/1xgqL9HIhQgrF9/RDjJoHDREBJzxut6GcpTuLDpwghB/qEpPioG0axA/3GEdPTdQ8jB/qNI5J2TeotTXb0i5xmkjVxUpblZFrxbWomNuNzymVrUr7ZbLa7v3zbbc3EGH9NqEy/ANNvExCuSVxuYPqnBIb0CzD9YwKD+vmc8W2+qOt6YSb2TUnfAZN03uRYn+RO9T0Teib0TPjVmfC7ChPMAJmwUlmTGCATViprIgNkwkplTWZqTHjTvKpUmICpMeFyuXx6/sG35ydx7Oc5p0MCv+RM8ALChIvz/9gnsFvIr1MFwoTzEZ/AblvL71MFwoSMT6CJ1fJ5UmkwoTpr8gnsY/WATzA1JlRnXS6BaW9OCH2CATLhpDcnhD7BAJmw7M0JoU8wQCYsr7z+ctwhgTkgE5ZXXn85TuYTxphwcuX1l+MkPmGOCadXXn85TuwTBpmwuvL6y3FCnzDJhENeL/QJk0w44PVCnzDKhP/3eqFPADAh0/EJCCZkOj4BwYRMxycgmJDp+IScCW9aE6VeL/UJanafyA4T6nu9YSbU9nrTTKjr9caZUNfrb2TCW/Z6jTLh6txe39br9dtr++f7gNe/yGsHv60w4RDPgzPh0PMEOBMOPc+AM+HQ8xQkE85Uagcffp/Q14597RiQCfVjhplQP0YftHb4CPpG3h34vOP7G6lTr+64/kZq56s7asdGaverO2rHRt4dWN1ROzby7sC7rx372rGvHXsm9EzomdAz4VfWV3t34JbYH4tMKIwxi0wojDGLTCiMKe4Tgumr7hOC6YPuE3om9EzomdAsE1Ir5+7kTGjr3GH2mOcuXZ87dX7u1vW5Y8fnrl2fO3d07v4fuuIxeszgK2EAAAAASUVORK5CYII="

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0ibmV3Ij48Zz48Y2lyY2xlIGN4PSIyNTYiIGN5PSIyNTYiIHI9IjI1My40NCIvPjxwYXRoIGQ9Ik0yODkuODYsMzUzLjRjMCw5Ljg1My03Ljk4NywxNy44NC0xNy44NCwxNy44NEgyNDAuN2MtOS44NTMsMC0xNy44NC03Ljk4Ny0xNy44NC0xNy44NFYxNTguMDggICAgYzAtOS44NTMsNy45ODctMTcuODQsMTcuODQtMTcuODRoMzEuMzJjOS44NTMsMCwxNy44NCw3Ljk4NywxNy44NCwxNy44NFYzNTMuNHoiIHN0eWxlPSJmaWxsOiNGRkZGRkY7Ii8+PHBhdGggZD0iTTM3MS44NiwyNzEuNGMwLDkuODUzLTcuOTg3LDE3Ljg0LTE3Ljg0LDE3Ljg0SDE1OC43Yy05Ljg1MywwLTE3Ljg0LTcuOTg3LTE3Ljg0LTE3Ljg0di0zMS4zMiAgICBjMC05Ljg1Myw3Ljk4Ny0xNy44NCwxNy44NC0xNy44NGgxOTUuMzJjOS44NTMsMCwxNy44NCw3Ljk4NywxNy44NCwxNy44NFYyNzEuNHoiIHN0eWxlPSJmaWxsOiNGRkZGRkY7Ii8+PC9nPjwvZz48ZyBpZD0iTGF5ZXJfMSIvPjwvc3ZnPg=="

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiB3aWR0aD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0OHY0OGgtNDh6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTE4IDMyaDEydi0xMmg4bC0xNC0xNC0xNCAxNGg4em0tOCA0aDI4djRoLTI4eiIvPjwvc3ZnPg=="

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MCA2MS4xMzQ3NzcsIDIwMTAvMDIvMTItMTc6MzI6MDAgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgTWFjaW50b3NoIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM5RjQwQTY1RkQ5MDExRTU4MkU0QTlBQTI3RTBBN0ZDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM5RjQwQTY2RkQ5MDExRTU4MkU0QTlBQTI3RTBBN0ZDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzlGNDBBNjNGRDkwMTFFNTgyRTRBOUFBMjdFMEE3RkMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzlGNDBBNjRGRDkwMTFFNTgyRTRBOUFBMjdFMEE3RkMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAmQWRvYmUAZMAAAAABAwAVBAMGCg0AAAdcAAAJRgAAC9AAAA/F/9sAhAACAgICAgICAgICAwICAgMEAwICAwQFBAQEBAQFBgUFBQUFBQYGBwcIBwcGCQkKCgkJDAwMDAwMDAwMDAwMDAwMAQMDAwUEBQkGBgkNCwkLDQ8ODg4ODw8MDAwMDA8PDAwMDAwMDwwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wgARCABLADgDAREAAhEBAxEB/8QAywAAAgIDAQEAAAAAAAAAAAAABAYFBwADCAIJAQACAwEBAAAAAAAAAAAAAAACBAADBQEGEAABBAIBAwQCAwAAAAAAAAACAAEDBBEFEhAhEyAiFAYxQSMVBxEAAQMCAwUGBQQDAAAAAAAAAQACAxESITEEQVGhIjJhcZFCEwUQgcEjM7FSchRDUyQSAAEDBAMAAAAAAAAAAAAAAAAwESEgQAExQQIiEwEAAgICAQQCAwEBAQAAAAABABEhMUFRYRBxgZGhscHR8fAg4f/aAAwDAQACEQMRAAABVupR1ZbKL1omJvq2wgIhTChyCxlLab0hoce+oxb7UTM6dKOyNDti5exeuNocNeww7QpQOOIV18ondDxq5cl2m9ZMm7POhy62uSpZba1PYGZT8+9litNJR2pOIZ6oTkYYMdBpbqxEjyuwGwvmezX762kx3ySAHNkGCTtjv9W+Zf5V9Iimu0LDixdtbCq15XuYlbltypVdTFIJaSyUdBeOsK6sS6rWQ+RLdzn/2gAIAQEAAQUClc1/Knc2E9nUEwm8o5kRc/GJxTNHDEapNTfefbaejs09PYevbqRR2gnrhHB8wuI7CaI/q2yH++2W3px0YpMWam6+I8u/lsDJFIvjRQqf3STfXvtO3g2Wuk1d748huNchYs8btmu8H+e1NVKRYYPuD1LOzpbJqxCVeeIZXhV6dzkgtnGpvsGyeESc3NgVbJw2vfLZ1F6KNxcU7oO7lnFOYxazIUdjXbm7Yt2p9ZuG3n1qnBYLUFXCTIPVVqF3fV2i1t3ZfYrewv3NncuPIUpLBZrs+Z8c5Mcu2e2TxyLHOPGf/9oACAECAAEFAnNeRc3WXXJclyUiclI/tiIhIu6d8JnRMuKsD7RHLsiDKEMJ3XPPRpowUUnNubLmi/IC+bTus9quWE48oW7yjlAOGIMpoB6MsdyTTC/qfupIRFuRC8Fp3bzZTdOSmDmMddhEIWFM3obq3X//2gAIAQMAAQUCwsLivG6x0b8syZlCKxlSMmZfvHSH8YwpOuHXidCyxlSAvG6aND3Yl+keMM6JRHxRllxPCeTry7MnB/WJu68aKFePCfphRlxd5EUrun9D9X6//9oACAECAgY/AkoUgkgeluLV+uT1g1Syn//aAAgBAwIGPwJFyVt3kWX/2gAIAQEBBj8Cw3KtUS51GjqccgvyP/lbgg+OS9hycFgU81yBTKbaK28F2xoWk0Wts/qsY6eb1OkkdAU2nv0um1UYBY8YOGGAwToHG6KQHxG1XDAtwtU1cDY6g+SEcdGhjfEr1Y5D6lKLTP1rBMNRC7T0eK47MD3L3KeTQNjnhkcIXPocaWhwTJaVz4omNh5hQitforPRaC7AuTWgc2xAzNpvPamnTXVqLLeq7sWlfr5JDy/ikFC3von6aXOCl3zTRGWknpA2omSlezsUT48XNOP1CqY7ZaWtirvUutnlYfcI3ERad2FG/ubVXHlG8rVTN1cbWkjLmc6gpkF6Z+4zJr8ipHN5ZADUFOY9wpXarsKNwBGSFCnQf3Z7HChZ6jqU8Vie8rl8UyTbkSrG4kmjVc6KuFbW4mioRTvWK/VZKgcWiuSDx5CtMwaY6703h8sTfO0Z17EYPd/b4mTRDnheAXMHeFT27VWf7NJqeto2OaR1NOwq+TVxY42txwVA+74Vz3hMnc37fS+mYG8Juuj/AOR0HJB6edBlU71Wahd/ic3lsrnaNgO5AOOWxY/A9PGi8nFO/HxXk4rycU/o4rZxX//aAAgBAQMBPyEQNrRn3Id26zcpWW1UHvBw8DRYPPdSvbZH4ma0z5gyHKfqY04gzi9RGrt2s43iCjVlgNSXulupRA+BZticnE1OjccY+Li8bFk5PMthR5htK6Qu+Df7g8xpO6sTHxLG/W5F7kFjCC+lCsNGuIjWRVa5f3HsWCiEhsrBYdPRLDF1oedSw9xFx4Ylb7dIODWGbiwXBMY01ZszmAVku9h/cwvMVtvePjVeO8cHVp1sYXWN2EvdxmVOzTwQB2d+0b6QLcAHmfWQOiaDyytN3TPGbJbGip39Q0i7ZCHxFYwgmlXM0cBPxAolxp4qi3bnJO0xKHNoBGkwwj/L4squDclfagz8TJp8ArHzM/lxL4NbgLBeJzrhbGZsLRiUoJGSNrg92OJUIRTbuzWVmxmFst3BevofIe25lxnY6LLq/iBFHwmIsvdka0tLieqVoRyYs463LOhG0XzvL/xH1ZbB4wscgYvJLcuQv38wbYpxLK92VPEb/L9z6iPqSXBLI84+s6n7sj//2gAIAQIDAT8hg9fStloIhKRiEe6QE2SYLjw6zJcS4ZU64bjkDuDFerQRkHENtYUVG4FwQ5DPYIBgiDqSjGMpamIgQRupVRMKQqzGsMu4RhKLmCIm6hph4n5IH68ML6FHfqw0vXNzVf7BJX/nxNI69P/aAAgBAwMBPyHeHeUlRGrqOYPRDPnQZjHAWAegTQS2bMiGIFseqV7ihUUMxVqMH2w0VKhmGMIbmIXBuJ6nKmeiQ7LuJG0CAJVehGXiGGM1UBXcvhZ36CM7qWuIBUS+lR9BGbTn0//aAAwDAQACEQMRAAAQpIZ3MjmwOafKvtTAdTsJPTXMfl5f5XhAXZF//9oACAEBAwE/EK1TOTVg/wAwoSL2uCaClzgtVONx0wQL3kAqJGRqBlImku8rkTkZcaFat3CHy6tFBSzbFGWDtWFEg4c0i18jajuOEhxNF4nyqh4l9dVcyYrx1bXEZesLVsEdKB7RJ1aDBrDhlXTlFVKoEgmUoKXOzbhKNTqSETgZYqLDbGNdjIVpQW3RuXLaa8iwtRQsANOIxhtFqoSDTR7JRgxKiJsfcJW1/Bjw1kHuVllBK+Dd3cbptXyACo03CsJJkJXnoJWbmdwqo6qF6bZZzmFpFzpKdcAXyIAsjgO8rMOQ9q8TWKvaTXDMWq8QKrkYknukmdegWqHRmM8rsl2BTRS35WiKnpgS1TQAdzC59skhRchim/MtUqmoYtUNTdfvEQZ0o6cDOfGIuRwd82WtbvgjaoxBdiAbWO31gC3eiJptMz3WDsxdKx1Crruyatii00ZTh+KqV+6EtdCtXdXUoAqersIVdZ96CIdJt0bwAKbVjPUXoxtxNrEANSy+gbG1r8RmE0SoteAiFuVVWvxmbppNFqXiYmhpstX3vEW9dTQkghAbgxpUSoClQG6QWirmZljbVLQZbN7OkO2yIu2o+vzSz2giOCLTvb+YoNVaS+PEGZsq7VdbibMmkygUVd2wq2CB3lOKzZ+a1qstKli/s4FbGxVpXUDLoZdWwULAtGBdQDgotf2wAislru5uOrXY6/aZNZ/gx3iobOH/AAK5nzHFfpP8a/5P/h18TgdzlvzP/9oACAECAwE/EKC2I3GbC/E2R/MqwqTOKx13E1sGsMQdgWhjecuvqd4BMo97/cCJ2TcQgVyQ26H0Yjq4nw1x7zB+otXg5JoIoBdQXdy+tlE0FcMWFU3eqn3Plp8XqAxzf4gRbBEYVYS7h8XbLXUGviPu9M1wQcLXPgLj2aeSFhYmSBuB3HuXdkxlv2JQ4ljMNzzMpOJW6M7dSgww0RgR5ixUuEceY9zjQvDxXn2zzLJLabA/D/JLXZ1pXlC4OT+IeoO8SlaVHZAXUuy5Mnv17dzy/m9XzRWoLvXN58L7Th3WJkAjTUvU71NJ1D0Gj0//2gAIAQMDAT8Q2kEogSgLhkAJjnKA0CYx5IV1UU5wzaMiw/uMzR5eIAvHpAwb5gKfeWgEDS3nzv8AiFBMBBc9kN7JRr2QVCs+IEuhCY3fEPhHZ/k0dKx8wuKPsh3UHHMVedV+IsdnqNtOV31CtI0iiGYAd8MPu98nHvCCaMxDU1bBuL8EuoUY85rMuQNy2JLqLDcOIIoNRNxxBdj3W5hdPMNK6rY8ee6/65aEwJi/RyQ7RhwxbsQvzfvmYgL4TCd/CbNTCLAnL0bzlqUubIbR3xP/2Q=="

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _events = __webpack_require__(18);

	var _events2 = _interopRequireDefault(_events);

	var _utils = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var basicGroup = 'basic';
	var actionsGroup = 'actions';

	var Toolbox = function (_EventEmitter) {
	  _inherits(Toolbox, _EventEmitter);

	  /**
	   * Toolbox constructor
	   * @param {Element} el current edited DOM node
	   * @param {Object} options
	   * @param {Array} optionsi.controllers list of controllers to use
	   * @param {Element} options.root element to render toobox in
	   * @param {Function} options.i18n translation function, return localized string by key
	   * @returns {undefined}
	   */

	  function Toolbox(el, _ref) {
	    var controllers = _ref.controllers;
	    var root = _ref.root;
	    var i18n = _ref.i18n;

	    _classCallCheck(this, Toolbox);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Toolbox).call(this));

	    _this.i18n = i18n;
	    _this.root = root;
	    _this.controllers = _this.getControllers(el, controllers);
	    _this.controllers.forEach(function (controller) {
	      return controller.on && controller.on('select-element', function (el) {
	        return _this.emit('select-element', el);
	      });
	    });
	    _this.render();
	    return _this;
	  }

	  _createClass(Toolbox, [{
	    key: 'getControllers',
	    value: function getControllers(el, controllers) {
	      var _this2 = this;

	      return controllers.filter(function (Controller) {
	        return Controller.test(el);
	      }).map(function (Controller) {
	        return Controller.create(el, { i18n: _this2.i18n });
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var panel = (0, _utils.createDocumentFragment)('<section class="EditroPanel"></section>');

	      // Render groups
	      this.getControllerGroups(this.controllers).forEach(function (_ref2) {
	        var _ref3 = _slicedToArray(_ref2, 2);

	        var groupName = _ref3[0];
	        var controllers = _ref3[1];

	        var group = (0, _utils.createDocumentFragment)('<div class="EditroPanel-section"></div>');

	        // Render components in group
	        controllers.forEach(function (controller) {
	          if (!controller.node) {
	            return;
	          }

	          var form = (0, _utils.createDocumentFragment)(groupName === actionsGroup ? '<span editoro-controls></span>' : '<article class="EditroForm">\n          <div class="EditroForm-title">' + controller.title + '</div>\n          <div class="EditroForm-controls" editoro-controls></div>\n        </article>');

	          form.querySelector('[editoro-controls]').appendChild(controller.node);
	          group.firstChild.appendChild(form);
	        });

	        panel.firstChild.appendChild(group);
	      });

	      this.root.appendChild(panel);
	    }
	  }, {
	    key: 'getControllerGroups',
	    value: function getControllerGroups(controllers) {
	      var controllerGroups = {};

	      controllers.forEach(function (controller) {
	        var group = controller.group || basicGroup;

	        controllerGroups[group] = controllerGroups[group] || [];
	        controllerGroups[group].push(controller);
	      });

	      // Basic group at the end of list
	      return Object.getOwnPropertyNames(controllerGroups).map(function (key) {
	        return [key, controllerGroups[key]];
	      }).sort(function (itemLeft, itemRight) {
	        return itemLeft[0] === actionsGroup && itemRight[0] !== actionsGroup ? 0 : itemLeft[0] === basicGroup && itemRight[0] !== basicGroup ? 1 : 0;
	      });
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      this.controllers.forEach(function (controller) {
	        return controller.destroy();
	      });
	      this.root.innerHTML = '';
	    }
	  }]);

	  return Toolbox;
	}(_events2.default);

	exports.default = Toolbox;

/***/ },
/* 18 */
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
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
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
/* 19 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.toArray = toArray;
	exports.createDocumentFragment = createDocumentFragment;
	exports.elementSearch = elementSearch;
	exports.click = click;
	exports.toggleAttr = toggleAttr;
	exports.num = num;
	exports.px = px;
	exports.emitDomEvent = emitDomEvent;
	/**
	 * Module with general helper functions
	 */

	function toArray(pseudoArray) {
	  return Array.prototype.slice.call(pseudoArray || []);
	}

	function createDocumentFragment(html) {
	  try {
	    return document.createRange().createContextualFragment(html);
	  } catch (e) {
	    var _ret = function () {
	      var div = document.createElement('div');
	      div.innerHTML = html;

	      var fragment = document.createDocumentFragment();
	      toArray(div.children).forEach(function (child) {
	        return fragment.appendChild(child);
	      });

	      return {
	        v: fragment
	      };
	    }();

	    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	  }
	}

	/**
	 * Create an element search function
	 * @param {Element} root block node
	 * @param {String} blockName
	 * @returns {Function} search function `search(elementName)`
	 */
	function elementSearch(root, blockName) {
	  return function (name) {
	    return root.querySelector('.' + blockName + '-' + name);
	  };
	}

	/**
	 * Add click handler to element
	 * @param {Element} el
	 * @param {Function} handler
	 */
	function click(el, handler) {
	  el.addEventListener('click', handler);
	}

	/**
	 * Toggle Attribute
	 * @param {Element} el
	 * @param {String} attrName
	 */
	function toggleAttr(el, attrName) {
	  if (el.hasAttribute(attrName)) {
	    el.removeAttribute(attrName);
	  } else {
	    el.setAttribute(attrName, '');
	  }
	}

	function num(valueStr) {
	  var defaultValue = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	  return valueStr === '' ? defaultValue : parseInt(valueStr, 10);
	}

	function px(value) {
	  var defaultValue = arguments.length <= 1 || arguments[1] === undefined ? 'auto' : arguments[1];

	  return value || value === 0 ? value + 'px' : defaultValue;
	}

	function emitDomEvent(elements, eventName) {
	  var eventInstance = document.createEvent('Event');
	  eventInstance.initEvent(eventName, true, true);
	  toArray(elements).forEach(function (element) {
	    return element.dispatchEvent(eventInstance);
	  });
	}

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var History = function () {
	  function History($iframe, onChange) {
	    var _this = this;

	    var size = arguments.length <= 2 || arguments[2] === undefined ? 100 : arguments[2];

	    _classCallCheck(this, History);

	    this.push = function (data) {
	      _this._pointer++;
	      _this._history.length = _this._pointer + 1; // Remove tail if we move back and push
	      _this._history[_this._pointer] = data;
	      // Shorten by size
	      while (_this._history.length > _this._size) {
	        _this._history.shift();
	        _this._pointer--;
	      }
	    };

	    this.forward = function () {
	      if (_this._pointer < _this._history.length - 1) {
	        _this._pointer++;
	        _this._onChange.call(null, _this._history[_this._pointer]);
	      }
	    };

	    this.backward = function () {
	      if (_this._pointer > 0) {
	        _this._pointer--;
	        _this._onChange.call(null, _this._history[_this._pointer]);
	      }
	    };

	    this._$iframe = $iframe;
	    this._onChange = onChange;
	    this._size = size;
	    this._history = [];
	    this._pointer = -1;
	    this._handler = this._onKeyDown.bind(this);

	    // TODO add handler if already loaded
	    $iframe.addEventListener('load', function () {
	      $iframe.contentDocument.addEventListener('keydown', _this._handler);
	    });
	    window.document.addEventListener('keydown', this._handler);
	  }

	  _createClass(History, [{
	    key: 'destroy',
	    value: function destroy() {
	      this._$iframe.contentDocument && this._$iframe.contentDocument.removeEventListener('keydown', this._handler);
	      window.document.removeEventListener('keydown', this._handler);
	    }
	  }, {
	    key: '_onKeyDown',
	    value: function _onKeyDown(e) {
	      if (e.keyCode === 90 && e.metaKey) {
	        if (e.shiftKey) {
	          this.forward();
	        } else {
	          this.backward();
	        }
	      }
	    }
	  }]);

	  return History;
	}();

	exports.default = History;

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = "<section class=\"Editro\">\n  <div class=\"Editro-wrapper\">\n    <section class=\"Editro-previewWrapper\">\n      <iframe class=\"Editro-preview\" frameborder=\"0\"></iframe>\n      <div class=\"Editro-nav\">\n      </div>\n    </section>\n\n    <aside class=\"Editro-panel\">\n      <section class=\"EditroPanelPlaceholder\">\n        <div class=\"EditroPanelPlaceholder-text\">\n          Click on element to select\n        </div>\n      </section>\n\n      <div editro-toolbox class=\"Editro-toolbox\"></div>\n    </aside>\n  </div>\n</section>\n\n\n\n\n";

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = "<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 3.2//EN\">\n\n<html>\n<head>\n  <title>\n  </title>\n</head>\n\n<body>\n  <div>\n    <h1>Hello world!</h1>\n  </div>\n</body>\n</html>\n";

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.controllers = undefined;

	var _FontController = __webpack_require__(24);

	var _FontController2 = _interopRequireDefault(_FontController);

	var _PaddingController = __webpack_require__(33);

	var _PaddingController2 = _interopRequireDefault(_PaddingController);

	var _MarginController = __webpack_require__(36);

	var _MarginController2 = _interopRequireDefault(_MarginController);

	var _PositionController = __webpack_require__(37);

	var _PositionController2 = _interopRequireDefault(_PositionController);

	var _SizeController = __webpack_require__(39);

	var _SizeController2 = _interopRequireDefault(_SizeController);

	var _SrcController = __webpack_require__(42);

	var _SrcController2 = _interopRequireDefault(_SrcController);

	var _BackgroundController = __webpack_require__(44);

	var _BackgroundController2 = _interopRequireDefault(_BackgroundController);

	var _ContentController = __webpack_require__(47);

	var _ContentController2 = _interopRequireDefault(_ContentController);

	var _BorderController = __webpack_require__(49);

	var _BorderController2 = _interopRequireDefault(_BorderController);

	var _BorderRadiusController = __webpack_require__(52);

	var _BorderRadiusController2 = _interopRequireDefault(_BorderRadiusController);

	var _HrefController = __webpack_require__(54);

	var _HrefController2 = _interopRequireDefault(_HrefController);

	var _FontFamilyController = __webpack_require__(55);

	var _FontFamilyController2 = _interopRequireDefault(_FontFamilyController);

	var _DeleteController = __webpack_require__(56);

	var _DeleteController2 = _interopRequireDefault(_DeleteController);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var controllers = exports.controllers = [_DeleteController2.default, _ContentController2.default, _SrcController2.default, _HrefController2.default, _FontController2.default, _FontFamilyController2.default, _BackgroundController2.default, _BorderController2.default, _BorderRadiusController2.default, _SizeController2.default, _MarginController2.default, _PaddingController2.default, _PositionController2.default];

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Controller2 = __webpack_require__(25);

	var _Controller3 = _interopRequireDefault(_Controller2);

	var _FontComponent = __webpack_require__(26);

	var _FontComponent2 = _interopRequireDefault(_FontComponent);

	var _tags = __webpack_require__(32);

	var _utils = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FontController = function (_Controller) {
	  _inherits(FontController, _Controller);

	  function FontController() {
	    _classCallCheck(this, FontController);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(FontController).apply(this, arguments));
	  }

	  _createClass(FontController, [{
	    key: 'createComponent',
	    value: function createComponent(value) {
	      return new _FontComponent2.default(value, {
	        i18n: this.i18n
	      });
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      var computedStyle = window.getComputedStyle(this.el);

	      return {
	        color: computedStyle.color,
	        textAlign: computedStyle.textAlign,
	        fontWeight: computedStyle.fontWeight,
	        fontStyle: computedStyle.fontStyle,
	        fontSize: computedStyle.fontSize,
	        lineHeight: computedStyle.lineHeight
	      };
	    }
	  }, {
	    key: 'set',
	    value: function set(_ref) {
	      var textAlign = _ref.textAlign;
	      var fontWeight = _ref.fontWeight;
	      var fontStyle = _ref.fontStyle;
	      var fontSize = _ref.fontSize;
	      var lineHeight = _ref.lineHeight;
	      var color = _ref.color;

	      this.el.style.color = color;
	      this.el.style.textAlign = textAlign;
	      this.el.style.fontWeight = fontWeight;
	      this.el.style.fontStyle = fontStyle;
	      this.el.style.lineHeight = (0, _utils.px)(lineHeight);
	      this.el.style.fontSize = (0, _utils.px)(fontSize);
	    }
	  }, {
	    key: 'normalize',
	    value: function normalize(value) {
	      var normalizedValue = Object.assign({}, value);

	      normalizedValue.fontSize = parseFloat(normalizedValue.fontSize);
	      normalizedValue.lineHeight = parseFloat(normalizedValue.lineHeight);
	      if (['left', 'center', 'right'].indexOf(normalizedValue.textAlign) === -1) {
	        normalizedValue.textAlign = 'left';
	      }

	      return normalizedValue;
	    }
	  }, {
	    key: 'title',
	    get: function get() {
	      return 'Font';
	    }
	  }], [{
	    key: 'test',
	    value: function test(el) {
	      var tags = [];

	      tags.push.apply(tags, _toConsumableArray(_tags.inputTags).concat(_toConsumableArray(_tags.inlineTags), _toConsumableArray(_tags.listTags), _toConsumableArray(_tags.definitionTags), _toConsumableArray(_tags.blockTags), _toConsumableArray(_tags.headersTags), _toConsumableArray(_tags.contentTags), _toConsumableArray(_tags.formTags)));

	      return tags.indexOf(el.tagName.toLowerCase()) !== -1;
	    }
	  }]);

	  return FontController;
	}(_Controller3.default);

	exports.default = FontController;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _events = __webpack_require__(18);

	var _events2 = _interopRequireDefault(_events);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Controller must be a class or an object with two static methods (`test` & `create`)
	 *   `test` returns true, if element could be customized via controller
	 *   `create` returns instance of controller with next properties:
	 *     `node` — dom node of controller component, required
	 *     `destroy` — destroy callback, required
	 *     `group` — name of group in toolbox, optional
	 *     `title` — title in toolbox, optional
	 */

	var Controller = function (_EventEmitter) {
	  _inherits(Controller, _EventEmitter);

	  _createClass(Controller, null, [{
	    key: 'test',
	    value: function test(el) {
	      return false;
	    }
	  }, {
	    key: 'create',
	    value: function create() {
	      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
	        params[_key] = arguments[_key];
	      }

	      return new (Function.prototype.bind.apply(this, [null].concat(params)))();
	    }
	  }]);

	  function Controller(el, _ref) {
	    var i18n = _ref.i18n;

	    _classCallCheck(this, Controller);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Controller).call(this));

	    _this.i18n = i18n;
	    _this.el = el;
	    _this.component = _this.createComponent(_this.normalize(_this.get()));
	    _this.component.on('change', function (newValue) {
	      _this.set(_this.normalize(newValue));
	      _this.emit('change');
	    });
	    return _this;
	  }

	  _createClass(Controller, [{
	    key: 'createComponent',
	    value: function createComponent(value) {}
	  }, {
	    key: 'get',
	    value: function get() {}
	  }, {
	    key: 'set',
	    value: function set() {}
	  }, {
	    key: 'normalize',
	    value: function normalize(value) {
	      return value;
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      this.component.destroy();
	    }
	  }, {
	    key: 'node',
	    get: function get() {
	      return this.component.el;
	    }
	  }, {
	    key: 'group',
	    get: function get() {
	      return 'basic';
	    }
	  }]);

	  return Controller;
	}(_events2.default);

	exports.default = Controller;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _BaseCompositeComponent = __webpack_require__(27);

	var _BaseCompositeComponent2 = _interopRequireDefault(_BaseCompositeComponent);

	var _InputComponent = __webpack_require__(29);

	var _InputComponent2 = _interopRequireDefault(_InputComponent);

	var _ColorComponent = __webpack_require__(30);

	var _ColorComponent2 = _interopRequireDefault(_ColorComponent);

	var _SelectComponent = __webpack_require__(31);

	var _SelectComponent2 = _interopRequireDefault(_SelectComponent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FontComponent = function (_BaseCompositeCompone) {
	  _inherits(FontComponent, _BaseCompositeCompone);

	  function FontComponent() {
	    _classCallCheck(this, FontComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(FontComponent).apply(this, arguments));
	  }

	  _createClass(FontComponent, [{
	    key: 'getSubComponentsFactories',
	    value: function getSubComponentsFactories() {
	      var _this2 = this;

	      return [{
	        component: function component() {
	          return new _ColorComponent2.default(_this2.value.color, {
	            label: _this2.config.i18n('Text color')
	          });
	        },
	        onChange: function onChange(color) {
	          _this2.value.color = color;
	        }
	      }, {
	        component: function component() {
	          return new _InputComponent2.default(_this2.value.fontSize, {
	            type: 'number',
	            unit: 'px',
	            label: _this2.config.i18n('Font size')
	          });
	        },
	        onChange: function onChange(fontSize) {
	          _this2.value.fontSize = fontSize;
	        }
	      }, {
	        component: function component() {
	          return new _InputComponent2.default(_this2.value.lineHeight, {
	            type: 'number',
	            unit: 'px',
	            label: _this2.config.i18n('Line height')
	          });
	        },
	        onChange: function onChange(lineHeight) {
	          _this2.value.lineHeight = lineHeight;
	        }
	      }, {
	        component: function component() {
	          return new _SelectComponent2.default(_this2.value.textAlign, {
	            choices: ['left', 'center', 'right'].map(function (ta) {
	              return [ta, _this2.config.i18n(ta)];
	            }),
	            label: _this2.config.i18n('Text align')
	          });
	        },
	        onChange: function onChange(textAlign) {
	          _this2.value.textAlign = textAlign;
	        }
	      }, {
	        component: function component() {
	          return new _SelectComponent2.default(_this2.value.fontWeight, {
	            choices: ['normal', 'light', 'bold'].map(function (ta) {
	              return [ta, _this2.config.i18n(ta)];
	            }),
	            label: _this2.config.i18n('Font weight')
	          });
	        },
	        onChange: function onChange(fontWeight) {
	          _this2.value.fontWeight = fontWeight;
	        }
	      }, {
	        component: function component() {
	          return new _SelectComponent2.default(_this2.value.fontStyle, {
	            choices: ['normal', 'italic'].map(function (ta) {
	              return [ta, _this2.config.i18n(ta)];
	            }),
	            label: _this2.config.i18n('Font style')
	          });
	        },
	        onChange: function onChange(fontStyle) {
	          _this2.value.fontStyle = fontStyle;
	        }
	      }];
	    }
	  }]);

	  return FontComponent;
	}(_BaseCompositeComponent2.default);

	exports.default = FontComponent;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Component2 = __webpack_require__(28);

	var _Component3 = _interopRequireDefault(_Component2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BaseCompositeComponent = function (_Component) {
	  _inherits(BaseCompositeComponent, _Component);

	  function BaseCompositeComponent() {
	    _classCallCheck(this, BaseCompositeComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(BaseCompositeComponent).apply(this, arguments));
	  }

	  _createClass(BaseCompositeComponent, [{
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      this.el = document.createDocumentFragment();

	      this.components = this.getSubComponentsFactories().map(function (_ref) {
	        var component = _ref.component;
	        var onChange = _ref.onChange;

	        var componentInstance = component();

	        componentInstance.on('change', function (data) {
	          onChange(data);
	          _this2.emit('change', _this2.value);
	        });

	        _this2.el.appendChild(componentInstance.el);

	        return componentInstance;
	      });
	    }

	    /**
	     * @returns {Array} {component: () => new Component(...), onChange: () => {}}
	     */

	  }, {
	    key: 'getSubComponentsFactories',
	    value: function getSubComponentsFactories() {
	      return [];
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      this.components.forEach(function (component) {
	        return component.destroy();
	      });
	    }
	  }]);

	  return BaseCompositeComponent;
	}(_Component3.default);

	exports.default = BaseCompositeComponent;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _events = __webpack_require__(18);

	var _events2 = _interopRequireDefault(_events);

	var _utils = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Component = function (_EventEmitter) {
	  _inherits(Component, _EventEmitter);

	  function Component(initialValue) {
	    var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, Component);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Component).call(this));

	    _this.value = initialValue;
	    _this.config = config;
	    _this._listeners = [];
	    _this.on('change', function (newValue) {
	      _this.value = newValue;
	    });
	    _this.render();
	    return _this;
	  }

	  _createClass(Component, [{
	    key: 'template',
	    value: function template() {
	      return '';
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.el = (0, _utils.createDocumentFragment)(this.template());
	      if (this.config.class) {
	        this.el.firstChild.classList.add(this.config.class);
	      }
	      this.watch();
	    }
	  }, {
	    key: 'watch',
	    value: function watch() {}
	  }, {
	    key: 'addListener',
	    value: function addListener(element, event, listener) {
	      if (!element) {
	        return;
	      }

	      element.addEventListener(event, listener);
	      this._listeners.push({ element: element, event: event, listener: listener });
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      this._listeners.forEach(function (_ref) {
	        var element = _ref.element;
	        var event = _ref.event;
	        var listener = _ref.listener;
	        return element.removeEventListener(event, listener);
	      });
	    }
	  }]);

	  return Component;
	}(_events2.default);

	exports.default = Component;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Component2 = __webpack_require__(28);

	var _Component3 = _interopRequireDefault(_Component2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * config = {type: 'number', unit: 'px'}
	 */

	var InputComponent = function (_Component) {
	  _inherits(InputComponent, _Component);

	  function InputComponent() {
	    _classCallCheck(this, InputComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(InputComponent).apply(this, arguments));
	  }

	  _createClass(InputComponent, [{
	    key: 'template',
	    value: function template() {
	      return '<div class="EditroField ' + (!this.config.label ? 'EditroField--controlOnly' : '') + '">\n              <div class="EditroField-label">\n                <div class="EditroField-labelWrapper">\n                  ' + this.config.label + '\n                </div>\n              </div>\n              <div class="EditroField-control">\n                <div class="EditroInputWrapper EditroInputWrapper--full EditroControl"\n                  ' + (this.config.unit ? 'unit="' + this.config.unit + '"' : '') + '>\n                  <input type="' + (this.config.type || 'text') + '" \n                         class="EditroInput" \n                         value="' + this.value + '"/>\n                </div>\n              </div>\n            </div>';
	    }
	  }, {
	    key: 'watch',
	    value: function watch() {
	      var _this2 = this;

	      var input = this.el.querySelector('input');
	      var onChanged = function onChanged(e) {
	        _this2.emit('change', e.target.value);
	      };

	      this.addListener(input, 'change', onChanged);
	      this.addListener(input, 'keyup', onChanged);
	    }
	  }]);

	  return InputComponent;
	}(_Component3.default);

	exports.default = InputComponent;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Component2 = __webpack_require__(28);

	var _Component3 = _interopRequireDefault(_Component2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function parseShortColor(color) {
	  var match = /^#([0-9A-F])([0-9A-F])([0-9A-F])$/i.exec(color);
	  if (!match) {
	    return null;
	  }

	  return {
	    components: [0, 1, 2].map(function (i) {
	      var v = parseInt(match[i + 1], 16);

	      return v * 16 + v;
	    }),
	    opacity: 1
	  };
	}

	function parseLongColor(color) {
	  var match = /^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i.exec(color);
	  if (!match) {
	    return null;
	  }

	  return {
	    components: [0, 1, 2].map(function (i) {
	      return parseInt(match[i + 1], 16);
	    }),
	    opacity: 1
	  };
	}

	function parseRgbColor(color) {
	  var match = /^rgb\(([\d\s]+),([\d\s]+),([\d\s]+)\)$/i.exec(color);
	  if (!match) {
	    return null;
	  }

	  return {
	    components: [0, 1, 2].map(function (i) {
	      return parseInt(match[i + 1], 10);
	    }),
	    opacity: 1
	  };
	}

	function parseRgbaColor(color) {
	  var match = /^rgba\(([\d\s]+),([\d\s]+),([\d\s]+),([\s\d.]+)\)$/i.exec(color);
	  if (!match) {
	    return null;
	  }

	  return {
	    components: [0, 1, 2].map(function (i) {
	      return parseInt(match[i + 1], 10);
	    }),
	    opacity: parseFloat(match[4])
	  };
	}

	function colorToPair(color) {
	  var components = [255, 255, 255];
	  var opacity = 1;

	  var match = parseShortColor(color) || parseLongColor(color) || parseRgbColor(color) || parseRgbaColor(color);
	  if (match) {
	    components = match.components;
	    opacity = parseInt(match.opacity * 100, 10);
	  }

	  var formatHex = function formatHex(num) {
	    var hex = num.toString(16);

	    return hex.length === 1 ? '0' + hex : hex;
	  };

	  return {
	    color: '#' + formatHex(components[0]) + formatHex(components[1]) + formatHex(components[2]),
	    opacity: opacity
	  };
	}

	function pairToColor(_ref) {
	  var color = _ref.color;
	  var opacity = _ref.opacity;

	  var _parseLongColor = parseLongColor(color);

	  var components = _parseLongColor.components;


	  return 'rgba(' + components[0] + ', ' + components[1] + ', ' + components[2] + ', ' + opacity / 100 + ')';
	}

	var ColorComponent = function (_Component) {
	  _inherits(ColorComponent, _Component);

	  function ColorComponent() {
	    _classCallCheck(this, ColorComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ColorComponent).apply(this, arguments));
	  }

	  _createClass(ColorComponent, [{
	    key: 'template',
	    value: function template() {
	      var _colorToPair = colorToPair(this.value);

	      var color = _colorToPair.color;
	      var opacity = _colorToPair.opacity;


	      return '<div class="EditroField">\n              <div class="EditroField-label">\n                <div class="EditroField-labelWrapper">\n                  ' + this.config.label + '\n                </div>\n              </div>\n              <div class="EditroField-control EditroField-control--inline">\n                <div class="EditroColor EditroControl">\n                  <div class="EditroColor-colorWrapper">\n                    <input class="EditroColor-color" type="color" value="' + color + '" style="opacity: ' + opacity / 100 + '" />\n                  </div>\n                  <div class="EditroColor-panel">\n                    <input class="EditroColor-opacity EditroRange" type="range" value="' + opacity + '" min="0" max="100">\n                  </div>\n                </div>\n                <div class="EditroInputWrapper EditroInputWrapper--full EditroControl">\n                  <input type="text" class="EditroInput" value="' + color + '" />\n                </div>\n              </div>\n            </div>';
	    }
	  }, {
	    key: 'watch',
	    value: function watch() {
	      var _this2 = this;

	      var color = this.el.querySelector('input[type=color]');
	      var opacity = this.el.querySelector('input[type=range]');
	      var text = this.el.querySelector('input[type=text]');

	      var collectColor = function collectColor() {
	        var value = pairToColor({
	          color: color.value,
	          opacity: opacity.value
	        });

	        color.style.opacity = opacity.value / 100;
	        text.value = value;
	        _this2.emit('change', value);
	      };

	      this.addListener(color, 'change', collectColor);
	      this.addListener(opacity, 'change', collectColor);

	      var onTextChanged = function onTextChanged() {
	        var newValues = colorToPair(text.value);

	        color.value = newValues.color;
	        opacity.opacity = newValues.opacity;

	        color.style.opacity = opacity.value / 100;
	        _this2.emit('change', pairToColor(newValues));
	      };
	      this.addListener(text, 'keyup', onTextChanged);
	      this.addListener(text, 'change', onTextChanged);
	    }
	  }]);

	  return ColorComponent;
	}(_Component3.default);

	exports.default = ColorComponent;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Component2 = __webpack_require__(28);

	var _Component3 = _interopRequireDefault(_Component2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * config = {choices: [[key, value]]}
	 */

	var SelectComponent = function (_Component) {
	  _inherits(SelectComponent, _Component);

	  function SelectComponent() {
	    _classCallCheck(this, SelectComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(SelectComponent).apply(this, arguments));
	  }

	  _createClass(SelectComponent, [{
	    key: 'template',
	    value: function template() {
	      var _this2 = this;

	      return '<div class="EditroField">\n              <div class="EditroField-label">\n                <div class="EditroField-labelWrapper">\n                  ' + this.config.label + '\n                </div>\n              </div>\n              <div class="EditroField-control">\n                <div class="EditroSelect EditroControl">\n                  <select class="EditroSelect-select">\n                    <option value=""></option>\n                    ' + (this.config.choices || []).map(function (_ref) {
	        var _ref2 = _slicedToArray(_ref, 2);

	        var key = _ref2[0];
	        var value = _ref2[1];
	        return '<option value=\'' + key + '\' ' + (key === _this2.value ? 'selected' : '') + '>' + value + '</option>';
	      }) + '\n                  </select>\n                </div>\n              </div>\n            </div>';
	    }
	  }, {
	    key: 'watch',
	    value: function watch() {
	      var _this3 = this;

	      this.addListener(this.el.querySelector('select'), 'change', function (e) {
	        _this3.emit('change', e.target.value);
	      });
	    }
	  }]);

	  return SelectComponent;
	}(_Component3.default);

	exports.default = SelectComponent;

/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	                          value: true
	});
	var inputTags = exports.inputTags = ['button', 'textarea', 'select', 'input'];

	var inlineTags = exports.inlineTags = ['span', 'a', 'b', 'i', 'strike', 'strong', 'sub', 'em', 'sup', 'small', 's', 'u', 'font', 'del'];

	var listTags = exports.listTags = ['ul', 'li', 'ol'];

	var definitionTags = exports.definitionTags = ['dt', 'dd', 'dl'];

	var blockTags = exports.blockTags = ['body', 'section', 'article', 'aside', 'center', 'header', 'footer', 'nav', 'figure', 'figcaption', 'div'];

	var headersTags = exports.headersTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

	var contentTags = exports.contentTags = ['p', 'address', 'blockquote', 'cite', 'code', 'pre'];

	var formTags = exports.formTags = ['form', 'caption', 'fieldset', 'legend', 'label', 'td', 'th'];

	var embeddedTags = exports.embeddedTags = ['img', 'object'];

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _BaseTBLRController2 = __webpack_require__(34);

	var _BaseTBLRController3 = _interopRequireDefault(_BaseTBLRController2);

	var _TBLRComponent = __webpack_require__(35);

	var _TBLRComponent2 = _interopRequireDefault(_TBLRComponent);

	var _tags = __webpack_require__(32);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var PaddingController = function (_BaseTBLRController) {
	  _inherits(PaddingController, _BaseTBLRController);

	  function PaddingController() {
	    _classCallCheck(this, PaddingController);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(PaddingController).apply(this, arguments));
	  }

	  _createClass(PaddingController, [{
	    key: 'createComponent',
	    value: function createComponent(value) {
	      return new _TBLRComponent2.default(value, {
	        arrowDirection: 'in',
	        shapes: {
	          inner: 'imag',
	          outer: 'real'
	        },
	        label: this.i18n('Space between borders and content')
	      });
	    }
	  }, {
	    key: 'stylesPrefix',
	    get: function get() {
	      return 'padding';
	    }
	  }, {
	    key: 'title',
	    get: function get() {
	      return 'Padding';
	    }
	  }], [{
	    key: 'test',
	    value: function test(el) {
	      var tags = [];

	      tags.push.apply(tags, _toConsumableArray(_tags.inputTags).concat(_toConsumableArray(_tags.listTags), _toConsumableArray(_tags.definitionTags), _toConsumableArray(_tags.blockTags), _toConsumableArray(_tags.headersTags), _toConsumableArray(_tags.contentTags), _toConsumableArray(_tags.formTags)));

	      return tags.indexOf(el.tagName.toLowerCase()) !== -1;
	    }
	  }]);

	  return PaddingController;
	}(_BaseTBLRController3.default);

	exports.default = PaddingController;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Controller2 = __webpack_require__(25);

	var _Controller3 = _interopRequireDefault(_Controller2);

	var _tags = __webpack_require__(32);

	var _utils = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var directions = ['top', 'bottom', 'left', 'right'];

	function getStyleName(prefix, direction) {
	  return prefix ? prefix + direction[0].toUpperCase() + direction.slice(1) : direction;
	}

	var BaseTBLRController = function (_Controller) {
	  _inherits(BaseTBLRController, _Controller);

	  function BaseTBLRController() {
	    _classCallCheck(this, BaseTBLRController);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(BaseTBLRController).apply(this, arguments));
	  }

	  _createClass(BaseTBLRController, [{
	    key: 'get',
	    value: function get() {
	      var _this2 = this;

	      var computedStyle = window.getComputedStyle(this.el);
	      var value = {};

	      directions.forEach(function (direction) {
	        value[direction] = computedStyle[getStyleName(_this2.stylesPrefix, direction)];
	      });

	      return value;
	    }
	  }, {
	    key: 'set',
	    value: function set(value) {
	      var _this3 = this;

	      directions.forEach(function (direction) {
	        _this3.el.style[getStyleName(_this3.stylesPrefix, direction)] = (0, _utils.px)(value[direction]);
	      });
	    }
	  }, {
	    key: 'normalize',
	    value: function normalize(value) {
	      var result = Object.assign({}, value);

	      directions.forEach(function (direction) {
	        result[direction] = (0, _utils.num)(result[direction]);
	      });

	      return result;
	    }
	  }], [{
	    key: 'test',
	    value: function test(el) {
	      var tags = [];

	      tags.push.apply(tags, _toConsumableArray(_tags.inputTags).concat(_toConsumableArray(_tags.listTags), _toConsumableArray(_tags.definitionTags), _toConsumableArray(_tags.blockTags), _toConsumableArray(_tags.headersTags), _toConsumableArray(_tags.contentTags), _toConsumableArray(_tags.formTags), _toConsumableArray(_tags.embeddedTags)));

	      return tags.indexOf(el.tagName.toLowerCase()) !== -1;
	    }
	  }]);

	  return BaseTBLRController;
	}(_Controller3.default);

	exports.default = BaseTBLRController;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Component2 = __webpack_require__(28);

	var _Component3 = _interopRequireDefault(_Component2);

	var _utils = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * config = {arrowDirection: 'in', shapes: {inner: 'real', outer: 'imag'}}
	 */

	var TBLRComponent = function (_Component) {
	  _inherits(TBLRComponent, _Component);

	  function TBLRComponent() {
	    _classCallCheck(this, TBLRComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(TBLRComponent).apply(this, arguments));
	  }

	  _createClass(TBLRComponent, [{
	    key: 'template',
	    value: function template() {
	      return '<div class="EditroField">\n              <div class="EditroField-label">\n                <div class="EditroField-labelWrapper">\n                  ' + this.config.label + '\n                </div>\n              </div>\n              <div class="EditroField-control">\n                <div class="EditroSelect EditroControl">\n                  <div class="EditroFourInputs EditroControl" arrow-direction="' + this.config.arrowDirection + '">\n                    <div class="EditroFourInputs-outer" shape="' + this.config.shapes.outer + '"></div>\n                    <div class="EditroFourInputs-inner" shape="' + this.config.shapes.inner + '"></div>\n                    <div class="EditroFourInputs-arrow EditroFourInputs-arrow--top"></div>\n                    <div class="EditroFourInputs-arrow EditroFourInputs-arrow--bottom"></div>\n                    <div class="EditroFourInputs-arrow EditroFourInputs-arrow--right"></div>\n                    <div class="EditroFourInputs-arrow EditroFourInputs-arrow--left"></div>\n                    <input class="EditroFourInputs-input EditroFourInputs-input--top" type="number" placeholder="auto" \n                           value="' + this.value.top + '" target-name="top" />\n                    <input class="EditroFourInputs-input EditroFourInputs-input--bottom" type="number" placeholder="auto" \n                           value="' + this.value.bottom + '" target-name="bottom" />\n                    <input class="EditroFourInputs-input EditroFourInputs-input--right" type="number" placeholder="auto" \n                           value="' + this.value.right + '" target-name="right" />\n                    <input class="EditroFourInputs-input EditroFourInputs-input--left" type="number" placeholder="auto" \n                           value="' + this.value.left + '" target-name="left" />\n                  </div>\n                </div>\n              </div>\n            </div>';
	    }
	  }, {
	    key: 'watch',
	    value: function watch() {
	      var _this2 = this;

	      (0, _utils.toArray)(this.el.querySelectorAll('input')).forEach(function (input) {
	        var onChange = function onChange() {
	          _this2.value[input.getAttribute('target-name')] = input.value;
	          _this2.emit('change', _this2.value);
	        };
	        _this2.addListener(input, 'keyup', onChange);
	        _this2.addListener(input, 'change', onChange);
	      });
	    }
	  }]);

	  return TBLRComponent;
	}(_Component3.default);

	exports.default = TBLRComponent;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _BaseTBLRController2 = __webpack_require__(34);

	var _BaseTBLRController3 = _interopRequireDefault(_BaseTBLRController2);

	var _TBLRComponent = __webpack_require__(35);

	var _TBLRComponent2 = _interopRequireDefault(_TBLRComponent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var MarginController = function (_BaseTBLRController) {
	  _inherits(MarginController, _BaseTBLRController);

	  function MarginController() {
	    _classCallCheck(this, MarginController);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(MarginController).apply(this, arguments));
	  }

	  _createClass(MarginController, [{
	    key: 'createComponent',
	    value: function createComponent(value) {
	      return new _TBLRComponent2.default(value, {
	        arrowDirection: 'out',
	        shapes: {
	          inner: 'real',
	          outer: 'imag'
	        },
	        label: this.i18n('Space between element and others')
	      });
	    }
	  }, {
	    key: 'stylesPrefix',
	    get: function get() {
	      return 'margin';
	    }
	  }, {
	    key: 'title',
	    get: function get() {
	      return 'Margin';
	    }
	  }]);

	  return MarginController;
	}(_BaseTBLRController3.default);

	exports.default = MarginController;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _BaseTBLRController2 = __webpack_require__(34);

	var _BaseTBLRController3 = _interopRequireDefault(_BaseTBLRController2);

	var _PositionComponent = __webpack_require__(38);

	var _PositionComponent2 = _interopRequireDefault(_PositionComponent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var PositionController = function (_BaseTBLRController) {
	  _inherits(PositionController, _BaseTBLRController);

	  function PositionController() {
	    _classCallCheck(this, PositionController);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(PositionController).apply(this, arguments));
	  }

	  _createClass(PositionController, [{
	    key: 'createComponent',
	    value: function createComponent(value) {
	      return new _PositionComponent2.default(value, {
	        i18n: this.i18n
	      });
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      var computedStyle = window.getComputedStyle(this.el);
	      var value = _get(Object.getPrototypeOf(PositionController.prototype), 'get', this).call(this);

	      value.position = computedStyle.position;

	      return value;
	    }
	  }, {
	    key: 'set',
	    value: function set(value) {
	      _get(Object.getPrototypeOf(PositionController.prototype), 'set', this).call(this, value);

	      this.el.style.position = value.position;
	    }
	  }, {
	    key: 'normalize',
	    value: function normalize(value) {
	      var normalizedValue = _get(Object.getPrototypeOf(PositionController.prototype), 'normalize', this).call(this, value);

	      if (['static', 'relative', 'absolute', 'fixed'].indexOf(normalizedValue.position) === -1) {
	        normalizedValue.position = 'static';
	      }

	      return normalizedValue;
	    }
	  }, {
	    key: 'title',
	    get: function get() {
	      return 'Position';
	    }
	  }]);

	  return PositionController;
	}(_BaseTBLRController3.default);

	exports.default = PositionController;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _BaseCompositeComponent = __webpack_require__(27);

	var _BaseCompositeComponent2 = _interopRequireDefault(_BaseCompositeComponent);

	var _SelectComponent = __webpack_require__(31);

	var _SelectComponent2 = _interopRequireDefault(_SelectComponent);

	var _TBLRComponent = __webpack_require__(35);

	var _TBLRComponent2 = _interopRequireDefault(_TBLRComponent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var PositionComponent = function (_BaseCompositeCompone) {
	  _inherits(PositionComponent, _BaseCompositeCompone);

	  function PositionComponent() {
	    _classCallCheck(this, PositionComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(PositionComponent).apply(this, arguments));
	  }

	  _createClass(PositionComponent, [{
	    key: 'getSubComponentsFactories',
	    value: function getSubComponentsFactories() {
	      var _this2 = this;

	      return [{
	        component: function component() {
	          return new _SelectComponent2.default(_this2.value.position, {
	            choices: [['static', 'static'], ['relative', 'relative'], ['absolute', 'absolute'], ['fixed', 'fixed']],
	            label: _this2.config.i18n('Type of positioning')
	          });
	        },
	        onChange: function onChange(position) {
	          _this2.value.position = position;
	        }
	      }, {
	        component: function component() {
	          return new _TBLRComponent2.default(_this2.value, {
	            arrowDirection: 'in',
	            shapes: {
	              inner: 'real',
	              outer: 'real'
	            },
	            label: _this2.config.i18n('Offset relative to the container')
	          });
	        },
	        onChange: function onChange(value) {
	          _this2.value.top = value.top;
	          _this2.value.bottom = value.bottom;
	          _this2.value.left = value.left;
	          _this2.value.right = value.right;
	        }
	      }];
	    }
	  }]);

	  return PositionComponent;
	}(_BaseCompositeComponent2.default);

	exports.default = PositionComponent;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Controller2 = __webpack_require__(25);

	var _Controller3 = _interopRequireDefault(_Controller2);

	var _SizeComponent = __webpack_require__(40);

	var _SizeComponent2 = _interopRequireDefault(_SizeComponent);

	var _tags = __webpack_require__(32);

	var _utils = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SizeController = function (_Controller) {
	  _inherits(SizeController, _Controller);

	  function SizeController() {
	    _classCallCheck(this, SizeController);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(SizeController).apply(this, arguments));
	  }

	  _createClass(SizeController, [{
	    key: 'createComponent',
	    value: function createComponent(value) {
	      return new _SizeComponent2.default(value, {
	        i18n: this.i18n
	      });
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      var computedStyle = window.getComputedStyle(this.el);

	      return {
	        width: computedStyle.width,
	        height: computedStyle.height,
	        float: computedStyle.float
	      };
	    }
	  }, {
	    key: 'set',
	    value: function set(_ref) {
	      var width = _ref.width;
	      var height = _ref.height;
	      var float = _ref.float;

	      this.el.style.width = (0, _utils.px)(width);
	      this.el.style.height = (0, _utils.px)(height);
	      this.el.style.float = float;
	    }
	  }, {
	    key: 'normalize',
	    value: function normalize(value) {
	      var normalizedValue = Object.assign({}, value);

	      normalizedValue.width = (0, _utils.num)(normalizedValue.width);
	      normalizedValue.height = (0, _utils.num)(normalizedValue.height);
	      if (['left', 'none', 'right'].indexOf(normalizedValue.float) === -1) {
	        normalizedValue.float = 'none';
	      }

	      return normalizedValue;
	    }
	  }, {
	    key: 'title',
	    get: function get() {
	      return this.i18n('size');
	    }
	  }], [{
	    key: 'test',
	    value: function test(el) {
	      var tags = [];

	      tags.push.apply(tags, _toConsumableArray(_tags.inputTags).concat(_toConsumableArray(_tags.listTags), _toConsumableArray(_tags.definitionTags), _toConsumableArray(_tags.blockTags), _toConsumableArray(_tags.headersTags), _toConsumableArray(_tags.contentTags), _toConsumableArray(_tags.formTags), _toConsumableArray(_tags.embeddedTags)));

	      return tags.indexOf(el.tagName.toLowerCase()) !== -1;
	    }
	  }]);

	  return SizeController;
	}(_Controller3.default);

	exports.default = SizeController;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _BaseCompositeComponent = __webpack_require__(27);

	var _BaseCompositeComponent2 = _interopRequireDefault(_BaseCompositeComponent);

	var _SelectComponent = __webpack_require__(31);

	var _SelectComponent2 = _interopRequireDefault(_SelectComponent);

	var _WidthHeightComponent = __webpack_require__(41);

	var _WidthHeightComponent2 = _interopRequireDefault(_WidthHeightComponent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var PositionComponent = function (_BaseCompositeCompone) {
	  _inherits(PositionComponent, _BaseCompositeCompone);

	  function PositionComponent() {
	    _classCallCheck(this, PositionComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(PositionComponent).apply(this, arguments));
	  }

	  _createClass(PositionComponent, [{
	    key: 'getSubComponentsFactories',
	    value: function getSubComponentsFactories() {
	      var _this2 = this;

	      return [{
	        component: function component() {
	          return new _WidthHeightComponent2.default(_this2.value, {
	            label: _this2.config.i18n('Dimensions')
	          });
	        },
	        onChange: function onChange(value) {
	          _this2.value.width = value.width;
	          _this2.value.height = value.height;
	        }
	      }, {
	        component: function component() {
	          return new _SelectComponent2.default(_this2.value.float, {
	            choices: ['none', 'left', 'right'].map(function (item) {
	              return [item, _this2.config.i18n(item)];
	            }),
	            label: _this2.config.i18n('Floating')
	          });
	        },
	        onChange: function onChange(float) {
	          _this2.value.float = float;
	        }
	      }];
	    }
	  }]);

	  return PositionComponent;
	}(_BaseCompositeComponent2.default);

	exports.default = PositionComponent;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Component2 = __webpack_require__(28);

	var _Component3 = _interopRequireDefault(_Component2);

	var _utils = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var WidthHeightComponent = function (_Component) {
	  _inherits(WidthHeightComponent, _Component);

	  function WidthHeightComponent() {
	    _classCallCheck(this, WidthHeightComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(WidthHeightComponent).apply(this, arguments));
	  }

	  _createClass(WidthHeightComponent, [{
	    key: 'template',
	    value: function template() {
	      return '<div class="EditroField">\n              <div class="EditroField-label">\n                <div class="EditroField-labelWrapper">\n                  ' + this.config.label + '\n                </div>\n              </div>\n              <div class="EditroField-control">\n                <div class="EditroSize EditroControl">\n                  <div class="EditroSize-input">\n                    <div class="EditroInputWrapper" unit="px">\n                      <input type="number" class="EditroInput" placeholder="auto" \n                             value="' + this.value.width + '" target-name="width" />\n                    </div>\n                  </div>\n                  <div class="EditroSize-separator">&times;</div>\n                  <div class="EditroSize-input">\n                    <div class="EditroInputWrapper" unit="px">\n                      <input type="number" class="EditroInput" placeholder="auto" \n                             value="' + this.value.height + '" target-name="height" />\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>';
	    }
	  }, {
	    key: 'watch',
	    value: function watch() {
	      var _this2 = this;

	      (0, _utils.toArray)(this.el.querySelectorAll('input')).forEach(function (input) {
	        var onChange = function onChange() {
	          _this2.value[input.getAttribute('target-name')] = input.value;
	          _this2.emit('change', _this2.value);
	        };
	        _this2.addListener(input, 'keyup', onChange);
	      });
	    }
	  }]);

	  return WidthHeightComponent;
	}(_Component3.default);

	exports.default = WidthHeightComponent;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Controller2 = __webpack_require__(25);

	var _Controller3 = _interopRequireDefault(_Controller2);

	var _ImageComponent = __webpack_require__(43);

	var _ImageComponent2 = _interopRequireDefault(_ImageComponent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SrcController = function (_Controller) {
	  _inherits(SrcController, _Controller);

	  function SrcController() {
	    _classCallCheck(this, SrcController);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(SrcController).apply(this, arguments));
	  }

	  _createClass(SrcController, [{
	    key: 'createComponent',
	    value: function createComponent(value) {
	      return new _ImageComponent2.default(value, {
	        label: this.i18n('Upload new image')
	      });
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      return this.el.getAttribute('src');
	    }
	  }, {
	    key: 'set',
	    value: function set(value) {
	      this.el.setAttribute('src', value);
	    }
	  }, {
	    key: 'group',
	    get: function get() {
	      return 'priority';
	    }
	  }, {
	    key: 'title',
	    get: function get() {
	      return 'Image';
	    }
	  }], [{
	    key: 'test',
	    value: function test(el) {
	      return el.tagName.toLowerCase() === 'img';
	    }
	  }]);

	  return SrcController;
	}(_Controller3.default);

	exports.default = SrcController;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Component2 = __webpack_require__(28);

	var _Component3 = _interopRequireDefault(_Component2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ImageComponent = function (_Component) {
	  _inherits(ImageComponent, _Component);

	  function ImageComponent() {
	    _classCallCheck(this, ImageComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ImageComponent).apply(this, arguments));
	  }

	  _createClass(ImageComponent, [{
	    key: 'template',
	    value: function template() {
	      return '<div class="EditroField">\n              <div class="EditroField-label">\n                <div class="EditroField-labelWrapper">\n                  ' + this.config.label + '\n                </div>\n              </div>\n              <div class="EditroField-control EditroField-control--inline">\n                <div class="EditroFileInput">\n                  <div class="EditroIcon EditroIcon--upload"></div>\n                  <input class="EditroFileInput-control" type="file" />\n                </div>\n              </div>\n            </div>';
	    }
	  }, {
	    key: 'watch',
	    value: function watch() {
	      var _this2 = this;

	      var fileInput = this.el.querySelector('input');

	      this.addListener(fileInput, 'change', function (e) {
	        var file = fileInput.files[0];
	        var reader = new FileReader();

	        // Setup model when file is read
	        _this2.addListener(reader, 'load', function () {
	          _this2.emit('change', reader.result);
	        }, false);

	        // Read file
	        if (file) {
	          reader.readAsDataURL(file);
	        }
	      });
	    }
	  }]);

	  return ImageComponent;
	}(_Component3.default);

	exports.default = ImageComponent;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Controller2 = __webpack_require__(25);

	var _Controller3 = _interopRequireDefault(_Controller2);

	var _BackgroundComponent = __webpack_require__(45);

	var _BackgroundComponent2 = _interopRequireDefault(_BackgroundComponent);

	var _tags = __webpack_require__(32);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BackgroundController = function (_Controller) {
	  _inherits(BackgroundController, _Controller);

	  function BackgroundController() {
	    _classCallCheck(this, BackgroundController);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(BackgroundController).apply(this, arguments));
	  }

	  _createClass(BackgroundController, [{
	    key: 'createComponent',
	    value: function createComponent(value) {
	      return new _BackgroundComponent2.default(value, {
	        i18n: this.i18n
	      });
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      var computedStyle = window.getComputedStyle(this.el);

	      var color1 = computedStyle.backgroundColor;
	      var hasGradient = false;
	      var color2 = void 0;
	      var backgroundImage = void 0;
	      var gradientDirection = void 0;

	      var gradientMatch = /linear-gradient\(([\s\w]+),\s*(#[\d\w]{3,6}|rgba?\([\s\d,]+\))\s*0%\s*,\s*(#[\d\w]{3,6}|rgba?\([\s\d,]+\))\s*100%\s*\)/i.exec(computedStyle.backgroundImage || '');
	      if (gradientMatch) {
	        hasGradient = true;
	        gradientDirection = gradientMatch[1].trim();
	        color1 = gradientMatch[2].trim();
	        color2 = gradientMatch[3].trim();
	      }

	      var urlMatch = /url\(([^\)]+)\)/i.exec(computedStyle.backgroundImage || '');
	      if (urlMatch) {
	        backgroundImage = urlMatch[1];
	      }

	      return {
	        color1: color1,
	        hasGradient: hasGradient,
	        color2: color2,
	        gradientDirection: gradientDirection,
	        backgroundImage: backgroundImage,
	        backgroundSize: computedStyle.backgroundSize,
	        backgroundPosition: computedStyle.backgroundPosition
	      };
	    }
	  }, {
	    key: 'set',
	    value: function set(value) {
	      var backgroundImages = [];

	      if (value.backgroundImage) {
	        backgroundImages.push('url(' + value.backgroundImage + ')');
	      }

	      if (!value.hasGradient) {
	        this.el.style.backgroundColor = value.color1;
	      } else {
	        backgroundImages.push('linear-gradient(' + value.gradientDirection + ', ' + value.color1 + ' 0%, ' + value.color2 + ' 100%)');
	      }

	      if (backgroundImages.length) {
	        this.el.style.backgroundImage = backgroundImages.join(', ');
	      }

	      this.el.style.backgroundSize = value.backgroundSize;
	      this.el.style.backgroundPosition = value.backgroundPosition;
	      this.el.style.backgroundRepeat = 'no-repeat';
	    }
	  }, {
	    key: 'title',
	    get: function get() {
	      return 'Background';
	    }
	  }], [{
	    key: 'test',
	    value: function test(el) {
	      var tags = [];

	      tags.push.apply(tags, _toConsumableArray(_tags.inputTags).concat(_toConsumableArray(_tags.listTags), _toConsumableArray(_tags.definitionTags), _toConsumableArray(_tags.blockTags), _toConsumableArray(_tags.headersTags), _toConsumableArray(_tags.contentTags), _toConsumableArray(_tags.formTags)));

	      return tags.indexOf(el.tagName.toLowerCase()) !== -1;
	    }
	  }]);

	  return BackgroundController;
	}(_Controller3.default);

	exports.default = BackgroundController;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _Component2 = __webpack_require__(28);

	var _Component3 = _interopRequireDefault(_Component2);

	var _BaseCompositeComponent = __webpack_require__(27);

	var _BaseCompositeComponent2 = _interopRequireDefault(_BaseCompositeComponent);

	var _SelectComponent = __webpack_require__(31);

	var _SelectComponent2 = _interopRequireDefault(_SelectComponent);

	var _ColorComponent = __webpack_require__(30);

	var _ColorComponent2 = _interopRequireDefault(_ColorComponent);

	var _ColorPlaceholderComponent = __webpack_require__(46);

	var _ColorPlaceholderComponent2 = _interopRequireDefault(_ColorPlaceholderComponent);

	var _ImageComponent = __webpack_require__(43);

	var _ImageComponent2 = _interopRequireDefault(_ImageComponent);

	var _utils = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var visibleIf = function visibleIf(isVisible) {
	  return isVisible ? 'flex' : 'none';
	};

	var BackgroundColorComponent = function (_BaseCompositeCompone) {
	  _inherits(BackgroundColorComponent, _BaseCompositeCompone);

	  function BackgroundColorComponent() {
	    _classCallCheck(this, BackgroundColorComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(BackgroundColorComponent).apply(this, arguments));
	  }

	  _createClass(BackgroundColorComponent, [{
	    key: 'getSubComponentsFactories',
	    value: function getSubComponentsFactories() {
	      var _this2 = this;

	      return [{
	        component: function component() {
	          return new _ColorComponent2.default(_this2.value.color1, {
	            label: _this2.config.i18n('Main background color')
	          });
	        },
	        onChange: function onChange(color) {
	          _this2.value.color1 = color;
	        }
	      }, {
	        component: function component() {
	          return new _ColorPlaceholderComponent2.default(null, {
	            label: _this2.config.i18n('Second background color')
	          });
	        },
	        onChange: function onChange() {
	          _this2.value.hasGradient = true;
	        }
	      }, {
	        component: function component() {
	          return new _ColorComponent2.default(_this2.value.color2, {
	            label: _this2.config.i18n('Second background color')
	          });
	        },
	        onChange: function onChange(color) {
	          _this2.value.color2 = color;
	        }
	      }, {
	        component: function component() {
	          return new _SelectComponent2.default(_this2.value.gradientDirection, {
	            choices: ['to right', 'to right bottom', 'to bottom', 'to left bottom'].map(function (grad) {
	              return [grad, _this2.config.i18n(grad)];
	            }),
	            label: _this2.config.i18n('Gradient direction')
	          });
	        },
	        onChange: function onChange(gradientDirection) {
	          _this2.value.gradientDirection = gradientDirection;
	        }
	      }];
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this3 = this;

	      _get(Object.getPrototypeOf(BackgroundColorComponent.prototype), 'render', this).call(this);

	      var toggler = this.el.children[1];
	      var color2 = this.el.children[2];
	      var gradient = this.el.children[3];
	      var toggle = function toggle() {
	        toggler.style.display = visibleIf(!_this3.value.hasGradient);
	        color2.style.display = visibleIf(_this3.value.hasGradient);
	        gradient.style.display = visibleIf(_this3.value.hasGradient);
	      };

	      toggle(this.value.hasGradient);
	      this.on('change', toggle);
	    }
	  }]);

	  return BackgroundColorComponent;
	}(_BaseCompositeComponent2.default);

	var BackgroundImageComponent = function (_BaseCompositeCompone2) {
	  _inherits(BackgroundImageComponent, _BaseCompositeCompone2);

	  function BackgroundImageComponent() {
	    _classCallCheck(this, BackgroundImageComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(BackgroundImageComponent).apply(this, arguments));
	  }

	  _createClass(BackgroundImageComponent, [{
	    key: 'getSubComponentsFactories',
	    value: function getSubComponentsFactories() {
	      var _this5 = this;

	      return [{
	        component: function component() {
	          return new _ImageComponent2.default(_this5.value.backgroundImage, {
	            label: _this5.config.i18n('Background image')
	          });
	        },
	        onChange: function onChange(image) {
	          _this5.value.backgroundImage = image;
	        }
	      }, {
	        component: function component() {
	          return new _SelectComponent2.default(_this5.value.backgroundSize, {
	            choices: ['auto', 'cover', 'contain'].map(function (bgSize) {
	              return [bgSize, _this5.config.i18n(bgSize)];
	            }),
	            label: _this5.config.i18n('Background size')
	          });
	        },
	        onChange: function onChange(backgroundSize) {
	          _this5.value.backgroundSize = backgroundSize;
	        }
	      }, {
	        component: function component() {
	          return new _SelectComponent2.default(_this5.value.backgroundPosition, {
	            choices: [['0 0', _this5.config.i18n('Top left corner')], ['100% 0', _this5.config.i18n('Top right corner')], ['0 100%', _this5.config.i18n('Bottom left corner')], ['100% 100%', _this5.config.i18n('Bottom right corner')], ['50% 50%', _this5.config.i18n('Center')]],
	            label: _this5.config.i18n('Background position')
	          });
	        },
	        onChange: function onChange(backgroundPosition) {
	          _this5.value.backgroundPosition = backgroundPosition;
	        }
	      }];
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this6 = this;

	      _get(Object.getPrototypeOf(BackgroundImageComponent.prototype), 'render', this).call(this);

	      var size = this.el.children[1];
	      var position = this.el.children[2];
	      var toggle = function toggle() {
	        size.style.display = visibleIf(_this6.value.backgroundImage);
	        position.style.display = visibleIf(_this6.value.backgroundImage);
	      };

	      toggle(this.value.backgroundImage);
	      this.on('change', toggle);
	    }
	  }]);

	  return BackgroundImageComponent;
	}(_BaseCompositeComponent2.default);

	var BackgroundComponent = function (_Component) {
	  _inherits(BackgroundComponent, _Component);

	  function BackgroundComponent() {
	    _classCallCheck(this, BackgroundComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(BackgroundComponent).apply(this, arguments));
	  }

	  _createClass(BackgroundComponent, [{
	    key: 'render',
	    value: function render() {
	      var _this8 = this;

	      this.el = document.createDocumentFragment();
	      [new BackgroundColorComponent(this.value, {
	        i18n: this.config.i18n
	      }), new BackgroundImageComponent(this.value, {
	        i18n: this.config.i18n
	      })].forEach(function (component) {
	        component.on('change', function (value) {
	          _this8.emit('change', value);
	        });

	        _this8.el.appendChild(component.el);
	      });
	    }
	  }]);

	  return BackgroundComponent;
	}(_Component3.default);

	exports.default = BackgroundComponent;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Component2 = __webpack_require__(28);

	var _Component3 = _interopRequireDefault(_Component2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ColorPlaceholderComponent = function (_Component) {
	  _inherits(ColorPlaceholderComponent, _Component);

	  function ColorPlaceholderComponent() {
	    _classCallCheck(this, ColorPlaceholderComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ColorPlaceholderComponent).apply(this, arguments));
	  }

	  _createClass(ColorPlaceholderComponent, [{
	    key: 'template',
	    value: function template() {
	      return '<div class="EditroField">\n              <div class="EditroField-label">\n                <div class="EditroField-labelWrapper">\n                  ' + this.config.label + '\n                </div>\n              </div>\n              <div class="EditroField-control">\n                <div class="EditroColor EditroControl">\n                  <div class="EditroColor-placeholder" color-placeholder></div>\n                </div>\n              </div>\n            </div>';
	    }
	  }, {
	    key: 'watch',
	    value: function watch() {
	      var _this2 = this;

	      this.addListener(this.el.querySelector('[color-placeholder]'), 'click', function () {
	        return _this2.emit('change');
	      });
	    }
	  }]);

	  return ColorPlaceholderComponent;
	}(_Component3.default);

	exports.default = ColorPlaceholderComponent;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Controller2 = __webpack_require__(25);

	var _Controller3 = _interopRequireDefault(_Controller2);

	var _ContentComponent = __webpack_require__(48);

	var _ContentComponent2 = _interopRequireDefault(_ContentComponent);

	var _tags = __webpack_require__(32);

	var _utils = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var allowedContentEditableTags = [];
	allowedContentEditableTags.push.apply(allowedContentEditableTags, _toConsumableArray(_tags.inlineTags).concat(_toConsumableArray(_tags.headersTags), _toConsumableArray(_tags.listTags), _toConsumableArray(_tags.contentTags)));

	var hasOnlyTags = function hasOnlyTags(html, tags) {
	  var search = /<(\w+)\/?>|<(\w+)\s/gim;

	  for (var match = search.exec(html); match; match = search.exec(html)) {
	    if (tags.indexOf(match[1] || match[2]) === -1) {
	      return false;
	    }
	  }

	  return true;
	};

	var clearTags = function clearTags(html, allowedTags) {
	  function clear(node) {
	    (0, _utils.toArray)(node.children).forEach(function (child) {
	      if (allowedTags.indexOf(child.tagName.toLowerCase()) === -1) {
	        var placeholder = document.createElement('span');
	        placeholder.innerHTML = '<&hellip;>';
	        node.replaceChild(placeholder, child);
	      } else if (child.children) {
	        clear(child);
	      }
	    });

	    return node;
	  }

	  var root = document.createElement('div');
	  root.innerHTML = html;

	  return clear(root).innerHTML;
	};

	var ContentController = function (_Controller) {
	  _inherits(ContentController, _Controller);

	  function ContentController() {
	    _classCallCheck(this, ContentController);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ContentController).apply(this, arguments));
	  }

	  _createClass(ContentController, [{
	    key: 'createComponent',
	    value: function createComponent(value) {
	      return new _ContentComponent2.default(value, {
	        i18n: this.i18n
	      });
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      var disabled = !hasOnlyTags(this.el.innerHTML, allowedContentEditableTags);
	      var content = disabled ? clearTags(this.el.innerHTML, allowedContentEditableTags) : this.el.innerHTML;

	      return {
	        content: content,
	        disabled: disabled
	      };
	    }
	  }, {
	    key: 'set',
	    value: function set(value) {
	      if (!value.disabled) {
	        this.el.innerHTML = value.content;
	      }
	    }
	  }, {
	    key: 'group',
	    get: function get() {
	      return 'priority';
	    }
	  }, {
	    key: 'title',
	    get: function get() {
	      return 'Text content';
	    }
	  }], [{
	    key: 'test',
	    value: function test(el) {
	      return el.textContent.trim() && hasOnlyTags(el.innerHTML, allowedContentEditableTags);
	    }
	  }]);

	  return ContentController;
	}(_Controller3.default);

	exports.default = ContentController;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Component2 = __webpack_require__(28);

	var _Component3 = _interopRequireDefault(_Component2);

	var _utils = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ContentComponent = function (_Component) {
	  _inherits(ContentComponent, _Component);

	  function ContentComponent() {
	    _classCallCheck(this, ContentComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ContentComponent).apply(this, arguments));
	  }

	  _createClass(ContentComponent, [{
	    key: 'template',
	    value: function template() {
	      return '<div class="EditroTextContent">\n              ' + (this.value.disabled ? '\n                <div class="EditroTextContent-preview">\n                  ' + this.value.content + '\n                  <div class="EditroTextContent-previewLabel">' + this.config.i18n('click to undlock and edit') + '</div>\n                </div>\n              ' : '\n                <div class="EditroTextContent-editable" contenteditable>\n                  ' + this.value.content + '\n                </div>\n              ') + '\n            </div>';
	    }
	  }, {
	    key: 'watch',
	    value: function watch() {
	      var _this2 = this;

	      var onChange = function onChange(e) {
	        _this2.value.content = e.target.innerHTML;
	        _this2.emit('change', _this2.value);
	      };
	      this.addListener(this.el.querySelector('[contenteditable]'), 'keyup', onChange);
	      this.addListener(this.el.querySelector('[contenteditable]'), 'change', onChange);
	    }
	  }]);

	  return ContentComponent;
	}(_Component3.default);

	exports.default = ContentComponent;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Controller2 = __webpack_require__(25);

	var _Controller3 = _interopRequireDefault(_Controller2);

	var _BorderComponent = __webpack_require__(50);

	var _BorderComponent2 = _interopRequireDefault(_BorderComponent);

	var _tags = __webpack_require__(32);

	var _utils = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BorderController = function (_Controller) {
	  _inherits(BorderController, _Controller);

	  function BorderController() {
	    _classCallCheck(this, BorderController);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(BorderController).apply(this, arguments));
	  }

	  _createClass(BorderController, [{
	    key: 'createComponent',
	    value: function createComponent(value) {
	      return new _BorderComponent2.default(value, {
	        i18n: this.i18n
	      });
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      var computedStyle = window.getComputedStyle(this.el);
	      var components = ['Top', 'Right', 'Bottom', 'Left'].map(function (position) {
	        return ['Width', 'Color'].map(function (prop, i) {
	          return i ? computedStyle['border' + position + prop] : (0, _utils.num)(computedStyle['border' + position + prop]);
	        });
	      });
	      var showComponents = components.reduce(function (condition, rad, i) {
	        return condition || (i ? components[i][0] !== components[i - 1][0] || components[i][1] !== components[i - 1][1] : false);
	      }, false);

	      return {
	        oneValue: components[0].slice(),
	        showComponents: showComponents,
	        components: components
	      };
	    }
	  }, {
	    key: 'set',
	    value: function set(value) {
	      var _this2 = this;

	      if (value.showComponents) {
	        ['Top', 'Right', 'Bottom', 'Left'].forEach(function (position, i) {
	          return ['Width', 'Color'].forEach(function (prop, j) {
	            _this2.el.style['border' + position + prop] = {
	              0: (0, _utils.px)(value.components[i][j]),
	              1: value.components[i][j]
	            }[j];
	          });
	        });
	      } else {
	        this.el.style.borderWidth = (0, _utils.px)(value.oneValue[0]);
	        this.el.style.borderColor = value.oneValue[1];
	      }
	      this.el.style.borderStyle = 'solid';
	    }
	  }, {
	    key: 'title',
	    get: function get() {
	      return 'Borders';
	    }
	  }], [{
	    key: 'test',
	    value: function test(el) {
	      var tags = [];

	      tags.push.apply(tags, _toConsumableArray(_tags.inputTags).concat(_toConsumableArray(_tags.listTags), _toConsumableArray(_tags.definitionTags), _toConsumableArray(_tags.blockTags), _toConsumableArray(_tags.headersTags), _toConsumableArray(_tags.contentTags), _toConsumableArray(_tags.formTags)));

	      return tags.indexOf(el.tagName.toLowerCase()) !== -1;
	    }
	  }]);

	  return BorderController;
	}(_Controller3.default);

	exports.default = BorderController;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _BaseCompositeComponent = __webpack_require__(27);

	var _BaseCompositeComponent2 = _interopRequireDefault(_BaseCompositeComponent);

	var _InputComponent = __webpack_require__(29);

	var _InputComponent2 = _interopRequireDefault(_InputComponent);

	var _ColorComponent = __webpack_require__(30);

	var _ColorComponent2 = _interopRequireDefault(_ColorComponent);

	var _TogglerComponent = __webpack_require__(51);

	var _TogglerComponent2 = _interopRequireDefault(_TogglerComponent);

	var _utils = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BorderComponent = function (_BaseCompositeCompone) {
	  _inherits(BorderComponent, _BaseCompositeCompone);

	  function BorderComponent() {
	    _classCallCheck(this, BorderComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(BorderComponent).apply(this, arguments));
	  }

	  _createClass(BorderComponent, [{
	    key: 'getSubComponentsFactories',
	    value: function getSubComponentsFactories() {
	      var _this2 = this;

	      var subComponents = [{
	        component: function component() {
	          return new _InputComponent2.default(_this2.value.oneValue[0], {
	            type: 'number',
	            unit: 'px',
	            label: _this2.config.i18n('Border width'),
	            class: 'EditroToggler-less'
	          });
	        },
	        onChange: function onChange(value) {
	          _this2.value.oneValue[0] = value;
	        }
	      }, {
	        component: function component() {
	          return new _ColorComponent2.default(_this2.value.oneValue[1], {
	            label: _this2.config.i18n('Border color'),
	            class: 'EditroToggler-less'
	          });
	        },
	        onChange: function onChange(value) {
	          _this2.value.oneValue[1] = value;
	        }
	      }];

	      ['Top', 'Right', 'Bottom', 'Left'].forEach(function (side, i) {
	        subComponents.push({
	          component: function component() {
	            return new _InputComponent2.default(_this2.value.components[i][0], {
	              type: 'number',
	              unit: 'px',
	              label: _this2.config.i18n(side + ' border width'),
	              class: 'EditroToggler-more'
	            });
	          },
	          onChange: function onChange(value) {
	            _this2.value.components[i][0] = value;
	          }
	        });
	        subComponents.push({
	          component: function component() {
	            return new _ColorComponent2.default(_this2.value.components[i][1], {
	              label: _this2.config.i18n(side + ' border color'),
	              class: 'EditroToggler-more'
	            });
	          },
	          onChange: function onChange(value) {
	            _this2.value.components[i][1] = value;
	          }
	        });
	      });

	      subComponents.push({
	        component: function component() {
	          return new _TogglerComponent2.default(_this2.value.showComponents, {
	            label: _this2.config.i18n('expand')
	          });
	        },
	        onChange: function onChange(value) {
	          _this2.value.showComponents = value;
	          _this2.toggle();
	        }
	      });

	      return subComponents;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      _get(Object.getPrototypeOf(BorderComponent.prototype), 'render', this).call(this);

	      var newEl = (0, _utils.createDocumentFragment)('<div class="EditroToggler EditroToggler--full"></div>');
	      this.toggler = newEl.firstChild;
	      this.toggler.appendChild(this.el);
	      this.el = newEl;

	      this.toggle();
	    }
	  }, {
	    key: 'toggle',
	    value: function toggle() {
	      var _this3 = this;

	      this.toggler.setAttribute('collapsed', String(!this.value.showComponents));

	      var el = function el(i) {
	        return _this3.toggler.children[i].querySelector('input') || document.createElement('input');
	      };

	      if (this.value.showComponents) {
	        el(2).value = el(4).value = el(6).value = el(8).value = el(0).value;
	        el(3).value = el(5).value = el(7).value = el(9).value = el(1).value;
	      } else {
	        el(0).value = el(2).value;
	        el(1).value = el(3).value;
	      }

	      (0, _utils.emitDomEvent)(this.toggler.querySelectorAll('input'), 'change');
	    }
	  }]);

	  return BorderComponent;
	}(_BaseCompositeComponent2.default);

	exports.default = BorderComponent;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Component2 = __webpack_require__(28);

	var _Component3 = _interopRequireDefault(_Component2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TogglerComponent = function (_Component) {
	  _inherits(TogglerComponent, _Component);

	  function TogglerComponent() {
	    _classCallCheck(this, TogglerComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(TogglerComponent).apply(this, arguments));
	  }

	  _createClass(TogglerComponent, [{
	    key: 'template',
	    value: function template() {
	      return '<div class="EditroField">\n              <div class="EditroField-label">\n                <div class="EditroField-labelWrapper"></div>\n              </div>\n              <div class="EditroField-control">\n                <div class="EditroBool" editro-toggler state="' + this.value + '"></div>\n                <div class="EditroField-controlLabel">\n                  ' + this.config.label + '\n                </div>\n              </div>\n            </div>';
	    }
	  }, {
	    key: 'watch',
	    value: function watch() {
	      var _this2 = this;

	      this.addListener(this.el.querySelector('[editro-toggler]'), 'click', function (e) {
	        e.target.setAttribute('state', !_this2.value);
	        _this2.emit('change', !_this2.value);
	      });
	    }
	  }]);

	  return TogglerComponent;
	}(_Component3.default);

	exports.default = TogglerComponent;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Controller2 = __webpack_require__(25);

	var _Controller3 = _interopRequireDefault(_Controller2);

	var _BorderRadiusComponent = __webpack_require__(53);

	var _BorderRadiusComponent2 = _interopRequireDefault(_BorderRadiusComponent);

	var _tags = __webpack_require__(32);

	var _utils = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BorderRadiusController = function (_Controller) {
	  _inherits(BorderRadiusController, _Controller);

	  function BorderRadiusController() {
	    _classCallCheck(this, BorderRadiusController);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(BorderRadiusController).apply(this, arguments));
	  }

	  _createClass(BorderRadiusController, [{
	    key: 'createComponent',
	    value: function createComponent(value) {
	      return new _BorderRadiusComponent2.default(value, {
	        i18n: this.i18n
	      });
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      var computedStyle = window.getComputedStyle(this.el);
	      var components = ['TopRight', 'BottomRight', 'BottomLeft', 'TopLeft'].map(function (position) {
	        return (0, _utils.num)(computedStyle['border' + position + 'Radius']);
	      });
	      var showComponents = components.reduce(function (condition, rad, i) {
	        return condition || (i ? components[i] !== components[i - 1] : false);
	      }, false);

	      return {
	        oneValue: components[0],
	        showComponents: showComponents,
	        components: components
	      };
	    }
	  }, {
	    key: 'set',
	    value: function set(value) {
	      var _this2 = this;

	      if (value.showComponents) {
	        ['TopRight', 'BottomRight', 'BottomLeft', 'TopLeft'].forEach(function (position, i) {
	          _this2.el.style['border' + position + 'Radius'] = (0, _utils.px)(value.components[i]);
	        });
	      } else {
	        this.el.style.borderRadius = (0, _utils.px)(value.oneValue);
	      }
	    }
	  }, {
	    key: 'title',
	    get: function get() {
	      return 'Border radius';
	    }
	  }], [{
	    key: 'test',
	    value: function test(el) {
	      var tags = [];

	      tags.push.apply(tags, _toConsumableArray(_tags.inputTags).concat(_toConsumableArray(_tags.listTags), _toConsumableArray(_tags.definitionTags), _toConsumableArray(_tags.blockTags), _toConsumableArray(_tags.headersTags), _toConsumableArray(_tags.contentTags), _toConsumableArray(_tags.formTags)));

	      return tags.indexOf(el.tagName.toLowerCase()) !== -1;
	    }
	  }]);

	  return BorderRadiusController;
	}(_Controller3.default);

	exports.default = BorderRadiusController;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _BaseCompositeComponent = __webpack_require__(27);

	var _BaseCompositeComponent2 = _interopRequireDefault(_BaseCompositeComponent);

	var _InputComponent = __webpack_require__(29);

	var _InputComponent2 = _interopRequireDefault(_InputComponent);

	var _TogglerComponent = __webpack_require__(51);

	var _TogglerComponent2 = _interopRequireDefault(_TogglerComponent);

	var _utils = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BorderRadiusComponent = function (_BaseCompositeCompone) {
	  _inherits(BorderRadiusComponent, _BaseCompositeCompone);

	  function BorderRadiusComponent() {
	    _classCallCheck(this, BorderRadiusComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(BorderRadiusComponent).apply(this, arguments));
	  }

	  _createClass(BorderRadiusComponent, [{
	    key: 'getSubComponentsFactories',
	    value: function getSubComponentsFactories() {
	      var _this2 = this;

	      var subComponents = [{
	        component: function component() {
	          return new _InputComponent2.default(_this2.value.oneValue, {
	            type: 'number',
	            unit: 'px',
	            label: _this2.config.i18n('Border radius'),
	            class: 'EditroToggler-less'
	          });
	        },
	        onChange: function onChange(value) {
	          _this2.value.oneValue = value;
	        }
	      }];

	      ['Top right', 'Bottom right', 'Bottom left', 'Top left'].forEach(function (corner, i) {
	        subComponents.push({
	          component: function component() {
	            return new _InputComponent2.default(_this2.value.components[i], {
	              type: 'number',
	              unit: 'px',
	              label: _this2.config.i18n(corner + ' border radius'),
	              class: 'EditroToggler-more'
	            });
	          },
	          onChange: function onChange(value) {
	            _this2.value.components[i] = value;
	          }
	        });
	      });

	      subComponents.push({
	        component: function component() {
	          return new _TogglerComponent2.default(_this2.value.showComponents, {
	            label: _this2.config.i18n('expand')
	          });
	        },
	        onChange: function onChange(value) {
	          _this2.value.showComponents = value;
	          _this2.toggle();
	        }
	      });

	      return subComponents;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      _get(Object.getPrototypeOf(BorderRadiusComponent.prototype), 'render', this).call(this);

	      var newEl = (0, _utils.createDocumentFragment)('<div class="EditroToggler EditroToggler--full"></div>');
	      this.toggler = newEl.firstChild;
	      this.toggler.appendChild(this.el);
	      this.el = newEl;

	      this.toggle();
	    }
	  }, {
	    key: 'toggle',
	    value: function toggle() {
	      var _this3 = this;

	      this.toggler.setAttribute('collapsed', String(!this.value.showComponents));

	      var element = function element(i) {
	        return _this3.toggler.children[i].querySelector('input') || document.createElement('input');
	      };

	      if (this.value.showComponents) {
	        element(1).value = element(2).value = element(3).value = element(4).value = element(0).value;
	      } else {
	        element(0).value = element(1).value;
	      }

	      (0, _utils.emitDomEvent)(this.toggler.querySelectorAll('input'), 'change');
	    }
	  }]);

	  return BorderRadiusComponent;
	}(_BaseCompositeComponent2.default);

	exports.default = BorderRadiusComponent;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Controller2 = __webpack_require__(25);

	var _Controller3 = _interopRequireDefault(_Controller2);

	var _InputComponent = __webpack_require__(29);

	var _InputComponent2 = _interopRequireDefault(_InputComponent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var HrefController = function (_Controller) {
	  _inherits(HrefController, _Controller);

	  function HrefController() {
	    _classCallCheck(this, HrefController);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(HrefController).apply(this, arguments));
	  }

	  _createClass(HrefController, [{
	    key: 'createComponent',
	    value: function createComponent(value) {
	      return new _InputComponent2.default(value);
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      return this.el.getAttribute('href');
	    }
	  }, {
	    key: 'set',
	    value: function set(value) {
	      this.el.setAttribute('href', value);
	    }
	  }, {
	    key: 'group',
	    get: function get() {
	      return 'priority';
	    }
	  }, {
	    key: 'title',
	    get: function get() {
	      return 'Link address';
	    }
	  }], [{
	    key: 'test',
	    value: function test(el) {
	      return el.tagName.toLowerCase() === 'a';
	    }
	  }]);

	  return HrefController;
	}(_Controller3.default);

	exports.default = HrefController;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Controller2 = __webpack_require__(25);

	var _Controller3 = _interopRequireDefault(_Controller2);

	var _SelectComponent = __webpack_require__(31);

	var _SelectComponent2 = _interopRequireDefault(_SelectComponent);

	var _tags = __webpack_require__(32);

	var _utils = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FontFamilyController = function (_Controller) {
	  _inherits(FontFamilyController, _Controller);

	  function FontFamilyController() {
	    _classCallCheck(this, FontFamilyController);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(FontFamilyController).apply(this, arguments));
	  }

	  _createClass(FontFamilyController, [{
	    key: 'getSource',
	    value: function getSource(fontFamily) {
	      var font = this.fonts.find(function (item) {
	        return item.fontFamily === fontFamily;
	      });

	      return font && font.source;
	    }
	  }, {
	    key: 'createComponent',
	    value: function createComponent(value) {
	      return new _SelectComponent2.default(value, {
	        choices: this.fonts.map(function (font) {
	          return [font.fontFamily, font.fontFamily];
	        }),
	        label: this.i18n('Standard fonts')
	      });
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      return window.getComputedStyle(this.el).fontFamily;
	    }
	  }, {
	    key: 'set',
	    value: function set(value) {
	      this.el.style.fontFamily = value;

	      var source = this.getSource(value);
	      var linkToSource = this.el.querySelector('link[role=font-family]');

	      if (source) {
	        if (linkToSource) {
	          linkToSource.setAttribute('href', source);
	        } else {
	          var link = (0, _utils.createDocumentFragment)('<link rel="stylesheet" href="' + source + '" role="font-family" />');
	          this.el.appendChild(link);
	        }
	      } else if (linkToSource) {
	        this.el.removeChild(linkToSource);
	      }
	    }
	  }, {
	    key: 'fonts',
	    get: function get() {
	      return [{
	        fontFamily: 'Helvetica, Arial, sans-serif'
	      }, {
	        fontFamily: 'Verdana, sans-serif'
	      }, {
	        fontFamily: 'Tahoma, sans-serif'
	      }, {
	        fontFamily: '"Times new roman", serif'
	      }, {
	        fontFamily: 'Georgia, serif'
	      }, {
	        fontFamily: '"Open Sans", sans-serif',
	        source: 'https://fonts.googleapis.com/css?family=Open+Sans:400,700&subset=latin,cyrillic'
	      }, {
	        fontFamily: '"Open Sans Condensed", sans-serif',
	        source: 'https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,700&subset=latin,cyrillic'
	      }, {
	        fontFamily: 'Roboto, sans-serif',
	        source: 'https://fonts.googleapis.com/css?family=Roboto:400,700&subset=latin,cyrillic'
	      }, {
	        fontFamily: '"Roboto Condensed", sans-serif',
	        source: 'https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700&subset=latin,cyrillic'
	      }, {
	        fontFamily: '"Roboto Slab", serif',
	        source: 'https://fonts.googleapis.com/css?family=Roboto+Slab:400,700&subset=latin,cyrillic'
	      }, {
	        fontFamily: 'Lora, serif',
	        source: 'https://fonts.googleapis.com/css?family=Lora:400,700&subset=latin,cyrillic'
	      }, {
	        fontFamily: '"PT Sans", sans-serif',
	        source: 'https://fonts.googleapis.com/css?family=PT+Sans:400,700&subset=latin,cyrillic'
	      }, {
	        fontFamily: 'Lobster, cursive',
	        source: 'https://fonts.googleapis.com/css?family=Lobster&subset=latin,cyrillic'
	      }];
	    }
	  }, {
	    key: 'title',
	    get: function get() {
	      return 'Font family';
	    }
	  }], [{
	    key: 'test',
	    value: function test(el) {
	      var tags = [];

	      tags.push.apply(tags, _toConsumableArray(_tags.inputTags).concat(_toConsumableArray(_tags.listTags), _toConsumableArray(_tags.definitionTags), _toConsumableArray(_tags.blockTags), _toConsumableArray(_tags.headersTags), _toConsumableArray(_tags.contentTags), _toConsumableArray(_tags.formTags)));

	      return tags.indexOf(el.tagName.toLowerCase()) !== -1;
	    }
	  }]);

	  return FontFamilyController;
	}(_Controller3.default);

	exports.default = FontFamilyController;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Controller2 = __webpack_require__(25);

	var _Controller3 = _interopRequireDefault(_Controller2);

	var _ActionButtonComponent = __webpack_require__(57);

	var _ActionButtonComponent2 = _interopRequireDefault(_ActionButtonComponent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var DeleteController = function (_Controller) {
	  _inherits(DeleteController, _Controller);

	  function DeleteController() {
	    _classCallCheck(this, DeleteController);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(DeleteController).apply(this, arguments));
	  }

	  _createClass(DeleteController, [{
	    key: 'createComponent',
	    value: function createComponent() {
	      return new _ActionButtonComponent2.default(null, {
	        type: 'delete',
	        text: 'Delete'
	      });
	    }
	  }, {
	    key: 'set',
	    value: function set(value) {
	      this.el.parentNode.removeChild(this.el);
	      this.emit('select-element');
	    }
	  }, {
	    key: 'group',
	    get: function get() {
	      return 'actions';
	    }
	  }], [{
	    key: 'test',
	    value: function test(el) {
	      return el.tagName.toLowerCase() !== 'body';
	    }
	  }]);

	  return DeleteController;
	}(_Controller3.default);

	exports.default = DeleteController;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Component2 = __webpack_require__(28);

	var _Component3 = _interopRequireDefault(_Component2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * config = {type: 'delete', text: 'Delete'}
	 */

	var ActionButtonComponent = function (_Component) {
	  _inherits(ActionButtonComponent, _Component);

	  function ActionButtonComponent() {
	    _classCallCheck(this, ActionButtonComponent);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ActionButtonComponent).apply(this, arguments));
	  }

	  _createClass(ActionButtonComponent, [{
	    key: 'template',
	    value: function template() {
	      return '<button class="EditroAction EditroAction--' + this.config.type + '">\n              <span class="EditroAction-text">\n                ' + this.config.text + '\n              </span>\n            </button>';
	    }
	  }, {
	    key: 'watch',
	    value: function watch() {
	      var _this2 = this;

	      this.addListener(this.el.firstChild, 'click', function () {
	        return _this2.emit('change');
	      });
	    }
	  }]);

	  return ActionButtonComponent;
	}(_Component3.default);

	exports.default = ActionButtonComponent;

/***/ },
/* 58 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = i18n;
	var translations = {
	  size: 'Size',

	  key1: 'Key 1 translation'
	};

	function i18n(redefine) {
	  var translate = function translate(k) {
	    return translations[k] || k;
	  };
	  return redefine ? function (k) {
	    return redefine(k) || translate(k);
	  } : translate;
	}

/***/ },
/* 59 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.forward = forward;
	exports.backward = backward;
	function forward(history) {
	  return makeHistoryNav('&#x25b6;', history.forward);
	}
	function backward(history) {
	  return makeHistoryNav('&#9664;', history.backward);
	}

	/**
	 * Create history element (backward or forward)
	 * @param {String} text
	 * @param {Function} onClick click handler
	 * @returns {Object} {node}
	 */
	function makeHistoryNav(text, onClick) {
	  return function () {
	    var node = window.document.createElement('button');
	    node.classList.add('EditroButton');

	    node.innerHTML = text;

	    node.addEventListener('click', onClick);

	    return {
	      node: node
	    };
	  };
	}

/***/ }
/******/ ])
});
;