/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Element2 = __webpack_require__(19);

var _Element3 = _interopRequireDefault(_Element2);

var _index = __webpack_require__(1);

var _WindowProperties = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLElement = function (_Element) {
  _inherits(HTMLElement, _Element);

  function HTMLElement() {
    var tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, HTMLElement);

    var _this = _possibleConstructorReturn(this, (HTMLElement.__proto__ || Object.getPrototypeOf(HTMLElement)).call(this));

    _this.className = '';
    _this.childern = [];
    _this.style = {
      width: _WindowProperties.innerWidth + 'px',
      height: _WindowProperties.innerHeight + 'px'
    };
    _this.insertBefore = _index.noop;
    _this.innerHTML = '';

    _this.tagName = tagName.toUpperCase();
    return _this;
  }

  _createClass(HTMLElement, [{
    key: 'setAttribute',
    value: function setAttribute(name, value) {
      this[name] = value;
    }
  }, {
    key: 'getAttribute',
    value: function getAttribute(name) {
      return this[name];
    }
  }, {
    key: 'getBoundingClientRect',
    value: function getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: _WindowProperties.innerWidth,
        height: _WindowProperties.innerHeight
      };
    }
  }, {
    key: 'focus',
    value: function focus() {}
  }, {
    key: 'clientWidth',
    get: function get() {
      var ret = parseInt(this.style.fontSize, 10) * this.innerHTML.length;

      return Number.isNaN(ret) ? 0 : ret;
    }
  }, {
    key: 'clientHeight',
    get: function get() {
      var ret = parseInt(this.style.fontSize, 10);

      return Number.isNaN(ret) ? 0 : ret;
    }
  }]);

  return HTMLElement;
}(_Element3.default);

exports.default = HTMLElement;
module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noop = noop;
function noop() {}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
    screenWidth = _wx$getSystemInfoSync.screenWidth,
    screenHeight = _wx$getSystemInfoSync.screenHeight,
    devicePixelRatio = _wx$getSystemInfoSync.devicePixelRatio;

var innerWidth = exports.innerWidth = screenWidth;
var innerHeight = exports.innerHeight = screenHeight;
exports.devicePixelRatio = devicePixelRatio;
var screen = exports.screen = {
  width: screenWidth,
  height: screenHeight,
  availWidth: innerWidth,
  availHeight: innerHeight,
  availLeft: 0,
  availTop: 0
};

var performance = exports.performance = {
  now: Date.now
};

var ontouchstart = exports.ontouchstart = null;
var ontouchmove = exports.ontouchmove = null;
var ontouchend = exports.ontouchend = null;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Canvas;

var _WindowProperties = __webpack_require__(2);

var hasModifiedCanvasPrototype = false; // import HTMLCanvasElement from './HTMLCanvasElement'

var hasInit2DContextConstructor = false;
var hasInitWebGLContextConstructor = false;

function Canvas() {
  var canvas = wx.createCanvas();

  canvas.type = 'canvas';

  // canvas.__proto__.__proto__.__proto__ = new HTMLCanvasElement()

  var _getContext = canvas.getContext;

  canvas.getBoundingClientRect = function () {
    var ret = {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
    return ret;
  };

  canvas.style = {
    top: '0px',
    left: '0px',
    width: _WindowProperties.innerWidth + 'px',
    height: _WindowProperties.innerHeight + 'px'
  };

  canvas.addEventListener = function (type, listener) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    // console.log('canvas.addEventListener', type);
    document.addEventListener(type, listener, options);
  };

  canvas.removeEventListener = function (type, listener) {
    // console.log('canvas.removeEventListener', type);
    document.removeEventListener(type, listener);
  };

  canvas.dispatchEvent = function () {
    var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    console.log('canvas.dispatchEvent', event.type, event);
    // nothing to do
  };

  Object.defineProperty(canvas, 'clientWidth', {
    enumerable: true,
    get: function get() {
      return _WindowProperties.innerWidth;
    }
  });

  Object.defineProperty(canvas, 'clientHeight', {
    enumerable: true,
    get: function get() {
      return _WindowProperties.innerHeight;
    }
  });

  return canvas;
}
module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _HTMLElement2 = __webpack_require__(0);

var _HTMLElement3 = _interopRequireDefault(_HTMLElement2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLMediaElement = function (_HTMLElement) {
  _inherits(HTMLMediaElement, _HTMLElement);

  function HTMLMediaElement(type) {
    _classCallCheck(this, HTMLMediaElement);

    return _possibleConstructorReturn(this, (HTMLMediaElement.__proto__ || Object.getPrototypeOf(HTMLMediaElement)).call(this, type));
  }

  _createClass(HTMLMediaElement, [{
    key: 'addTextTrack',
    value: function addTextTrack() {}
  }, {
    key: 'captureStream',
    value: function captureStream() {}
  }, {
    key: 'fastSeek',
    value: function fastSeek() {}
  }, {
    key: 'load',
    value: function load() {}
  }, {
    key: 'pause',
    value: function pause() {}
  }, {
    key: 'play',
    value: function play() {}
  }]);

  return HTMLMediaElement;
}(_HTMLElement3.default);

exports.default = HTMLMediaElement;
module.exports = exports['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelAnimationFrame = exports.requestAnimationFrame = exports.clearInterval = exports.clearTimeout = exports.setInterval = exports.setTimeout = exports.canvas = exports.location = exports.localStorage = exports.DeviceMotionEvent = exports.MouseEvent = exports.TouchEvent = exports.WebGLRenderingContext = exports.HTMLVideoElement = exports.HTMLAudioElement = exports.HTMLMediaElement = exports.HTMLCanvasElement = exports.HTMLImageElement = exports.HTMLElement = exports.FileReader = exports.Audio = exports.ImageBitmap = exports.Image = exports.WebSocket = exports.XMLHttpRequest = exports.navigator = undefined;

var _index = __webpack_require__(6);

Object.defineProperty(exports, 'TouchEvent', {
  enumerable: true,
  get: function get() {
    return _index.TouchEvent;
  }
});
Object.defineProperty(exports, 'MouseEvent', {
  enumerable: true,
  get: function get() {
    return _index.MouseEvent;
  }
});
Object.defineProperty(exports, 'DeviceMotionEvent', {
  enumerable: true,
  get: function get() {
    return _index.DeviceMotionEvent;
  }
});

var _WindowProperties = __webpack_require__(2);

Object.keys(_WindowProperties).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _WindowProperties[key];
    }
  });
});

var _Canvas = __webpack_require__(3);

var _Canvas2 = _interopRequireDefault(_Canvas);

var _navigator2 = __webpack_require__(16);

var _navigator3 = _interopRequireDefault(_navigator2);

var _XMLHttpRequest2 = __webpack_require__(17);

var _XMLHttpRequest3 = _interopRequireDefault(_XMLHttpRequest2);

var _WebSocket2 = __webpack_require__(18);

var _WebSocket3 = _interopRequireDefault(_WebSocket2);

var _Image2 = __webpack_require__(8);

var _Image3 = _interopRequireDefault(_Image2);

var _ImageBitmap2 = __webpack_require__(21);

var _ImageBitmap3 = _interopRequireDefault(_ImageBitmap2);

var _Audio2 = __webpack_require__(10);

var _Audio3 = _interopRequireDefault(_Audio2);

var _FileReader2 = __webpack_require__(22);

var _FileReader3 = _interopRequireDefault(_FileReader2);

var _HTMLElement2 = __webpack_require__(0);

var _HTMLElement3 = _interopRequireDefault(_HTMLElement2);

var _HTMLImageElement2 = __webpack_require__(9);

var _HTMLImageElement3 = _interopRequireDefault(_HTMLImageElement2);

var _HTMLCanvasElement2 = __webpack_require__(23);

var _HTMLCanvasElement3 = _interopRequireDefault(_HTMLCanvasElement2);

var _HTMLMediaElement2 = __webpack_require__(4);

var _HTMLMediaElement3 = _interopRequireDefault(_HTMLMediaElement2);

var _HTMLAudioElement2 = __webpack_require__(11);

var _HTMLAudioElement3 = _interopRequireDefault(_HTMLAudioElement2);

var _HTMLVideoElement2 = __webpack_require__(12);

var _HTMLVideoElement3 = _interopRequireDefault(_HTMLVideoElement2);

var _WebGLRenderingContext2 = __webpack_require__(24);

var _WebGLRenderingContext3 = _interopRequireDefault(_WebGLRenderingContext2);

var _localStorage2 = __webpack_require__(25);

var _localStorage3 = _interopRequireDefault(_localStorage2);

var _location2 = __webpack_require__(26);

var _location3 = _interopRequireDefault(_location2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.navigator = _navigator3.default;
exports.XMLHttpRequest = _XMLHttpRequest3.default;
exports.WebSocket = _WebSocket3.default;
exports.Image = _Image3.default;
exports.ImageBitmap = _ImageBitmap3.default;
exports.Audio = _Audio3.default;
exports.FileReader = _FileReader3.default;
exports.HTMLElement = _HTMLElement3.default;
exports.HTMLImageElement = _HTMLImageElement3.default;
exports.HTMLCanvasElement = _HTMLCanvasElement3.default;
exports.HTMLMediaElement = _HTMLMediaElement3.default;
exports.HTMLAudioElement = _HTMLAudioElement3.default;
exports.HTMLVideoElement = _HTMLVideoElement3.default;
exports.WebGLRenderingContext = _WebGLRenderingContext3.default;
exports.localStorage = _localStorage3.default;
exports.location = _location3.default;


// 暴露全局的 canvas
GameGlobal.screencanvas = GameGlobal.screencanvas || new _Canvas2.default();
var canvas = GameGlobal.screencanvas;

exports.canvas = canvas;
exports.setTimeout = setTimeout;
exports.setInterval = setInterval;
exports.clearTimeout = clearTimeout;
exports.clearInterval = clearInterval;
exports.requestAnimationFrame = requestAnimationFrame;
exports.cancelAnimationFrame = cancelAnimationFrame;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MouseEvent = exports.TouchEvent = undefined;

var _TouchEvent2 = __webpack_require__(14);

var _TouchEvent3 = _interopRequireDefault(_TouchEvent2);

var _MouseEvent2 = __webpack_require__(15);

var _MouseEvent3 = _interopRequireDefault(_MouseEvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.TouchEvent = _TouchEvent3.default;
exports.MouseEvent = _MouseEvent3.default;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _events = new WeakMap();

var EventTarget = function () {
  function EventTarget() {
    _classCallCheck(this, EventTarget);

    _events.set(this, {});
  }

  _createClass(EventTarget, [{
    key: "addEventListener",
    value: function addEventListener(type, listener) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var events = _events.get(this);

      if (!events) {
        events = {};
        _events.set(this, events);
      }
      if (!events[type]) {
        events[type] = [];
      }
      events[type].push(listener);

      if (options.capture) {
        // console.warn('EventTarget.addEventListener: options.capture is not implemented.')
      }
      if (options.once) {
        // console.warn('EventTarget.addEventListener: options.once is not implemented.')
      }
      if (options.passive) {
        // console.warn('EventTarget.addEventListener: options.passive is not implemented.')
      }
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, listener) {
      var events = _events.get(this);

      if (events) {
        var listeners = events[type];

        if (listeners && listeners.length > 0) {
          for (var i = listeners.length; i--; i > 0) {
            if (listeners[i] === listener) {
              listeners.splice(i, 1);
              break;
            }
          }
        }
      }
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var listeners = _events.get(this)[event.type];

      if (listeners) {
        for (var i = 0; i < listeners.length; i++) {
          listeners[i](event);
        }
      }
    }
  }]);

  return EventTarget;
}();

exports.default = EventTarget;
module.exports = exports["default"];

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var image = wx.createImage();

    // image.__proto__.__proto__.__proto__ = new HTMLImageElement();

    return image;
};

var _HTMLImageElement = __webpack_require__(9);

var _HTMLImageElement2 = _interopRequireDefault(_HTMLImageElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;
module.exports = exports['default'];

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HTMLElement = __webpack_require__(0);

var _HTMLElement2 = _interopRequireDefault(_HTMLElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var imageConstructor = wx.createImage().constructor;

// imageConstructor.__proto__.__proto__ = new HTMLElement();

// import HTMLElement from './HTMLElement';

// export default class HTMLImageElement extends HTMLElement
// {
//     constructor(){
//         super('img')
//     }
// };

exports.default = imageConstructor;
module.exports = exports['default'];

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _HTMLAudioElement2 = __webpack_require__(11);

var _HTMLAudioElement3 = _interopRequireDefault(_HTMLAudioElement2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HAVE_NOTHING = 0;
var HAVE_METADATA = 1;
var HAVE_CURRENT_DATA = 2;
var HAVE_FUTURE_DATA = 3;
var HAVE_ENOUGH_DATA = 4;

var SN_SEED = 1;

var _innerAudioContextMap = {};

var Audio = function (_HTMLAudioElement) {
  _inherits(Audio, _HTMLAudioElement);

  function Audio(url) {
    _classCallCheck(this, Audio);

    var _this = _possibleConstructorReturn(this, (Audio.__proto__ || Object.getPrototypeOf(Audio)).call(this));

    _this._$sn = SN_SEED++;

    _this.HAVE_NOTHING = HAVE_NOTHING;
    _this.HAVE_METADATA = HAVE_METADATA;
    _this.HAVE_CURRENT_DATA = HAVE_CURRENT_DATA;
    _this.HAVE_FUTURE_DATA = HAVE_FUTURE_DATA;
    _this.HAVE_ENOUGH_DATA = HAVE_ENOUGH_DATA;

    _this.readyState = HAVE_NOTHING;

    var innerAudioContext = wx.createInnerAudioContext();

    _innerAudioContextMap[_this._$sn] = innerAudioContext;

    _this._canplayEvents = ['load', 'loadend', 'canplay', 'canplaythrough', 'loadedmetadata'];

    innerAudioContext.onCanplay(function () {
      _this._loaded = true;
      _this.readyState = _this.HAVE_CURRENT_DATA;
      _this._canplayEvents.forEach(function (type) {
        _this.dispatchEvent({ type: type });
      });
    });
    innerAudioContext.onPlay(function () {
      _this._paused = _innerAudioContextMap[_this._$sn].paused;
      _this.dispatchEvent({ type: 'play' });
    });
    innerAudioContext.onPause(function () {
      _this._paused = _innerAudioContextMap[_this._$sn].paused;
      _this.dispatchEvent({ type: 'pause' });
    });
    innerAudioContext.onEnded(function () {
      _this._paused = _innerAudioContextMap[_this._$sn].paused;
      if (_innerAudioContextMap[_this._$sn].loop === false) {
        _this.dispatchEvent({ type: 'ended' });
      }
      _this.readyState = HAVE_ENOUGH_DATA;
    });
    innerAudioContext.onError(function () {
      _this._paused = _innerAudioContextMap[_this._$sn].paused;
      _this.dispatchEvent({ type: 'error' });
    });

    if (url) {
      _this.src = url;
    } else {
      _this._src = '';
    }

    _this._loop = innerAudioContext.loop;
    _this._autoplay = innerAudioContext.autoplay;
    _this._paused = innerAudioContext.paused;
    _this._volume = innerAudioContext.volume;
    _this._muted = false;
    return _this;
  }

  _createClass(Audio, [{
    key: 'addEventListener',
    value: function addEventListener(type, listener) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _get(Audio.prototype.__proto__ || Object.getPrototypeOf(Audio.prototype), 'addEventListener', this).call(this, type, listener, options);

      type = String(type).toLowerCase();

      if (this._loaded && this._canplayEvents.indexOf(type) !== -1) {
        this.dispatchEvent({ type: type });
      }
    }
  }, {
    key: 'load',
    value: function load() {
      // console.warn('HTMLAudioElement.load() is not implemented.')
      // weixin doesn't need call load() manually
    }
  }, {
    key: 'play',
    value: function play() {
      _innerAudioContextMap[this._$sn].play();
    }
  }, {
    key: 'resume',
    value: function resume() {
      _innerAudioContextMap[this._$sn].resume();
    }
  }, {
    key: 'pause',
    value: function pause() {
      _innerAudioContextMap[this._$sn].pause();
    }
  }, {
    key: 'stop',
    value: function stop() {
      _innerAudioContextMap[this._$sn].stop();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      _innerAudioContextMap[this._$sn].destroy();
    }
  }, {
    key: 'canPlayType',
    value: function canPlayType() {
      var mediaType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (typeof mediaType !== 'string') {
        return '';
      }

      if (mediaType.indexOf('audio/mpeg') > -1 || mediaType.indexOf('audio/mp4')) {
        return 'probably';
      }
      return '';
    }
  }, {
    key: 'cloneNode',
    value: function cloneNode() {
      var newAudio = new Audio();
      newAudio.loop = this.loop;
      newAudio.autoplay = this.autoplay;
      newAudio.src = this.src;
      return newAudio;
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return _innerAudioContextMap[this._$sn].currentTime;
    },
    set: function set(value) {
      _innerAudioContextMap[this._$sn].seek(value);
    }
  }, {
    key: 'duration',
    get: function get() {
      return _innerAudioContextMap[this._$sn].duration;
    }
  }, {
    key: 'src',
    get: function get() {
      return this._src;
    },
    set: function set(value) {
      this._src = value;
      this._loaded = false;
      this.readyState = this.HAVE_NOTHING;

      var innerAudioContext = _innerAudioContextMap[this._$sn];

      innerAudioContext.src = value;
    }
  }, {
    key: 'loop',
    get: function get() {
      return this._loop;
    },
    set: function set(value) {
      this._loop = value;
      _innerAudioContextMap[this._$sn].loop = value;
    }
  }, {
    key: 'autoplay',
    get: function get() {
      return this.autoplay;
    },
    set: function set(value) {
      this._autoplay = value;
      _innerAudioContextMap[this._$sn].autoplay = value;
    }
  }, {
    key: 'paused',
    get: function get() {
      return this._paused;
    }
  }, {
    key: 'volume',
    get: function get() {
      return this._volume;
    },
    set: function set(value) {
      this._volume = value;
      if (!this._muted) {
        _innerAudioContextMap[this._$sn].volume = value;
      }
    }
  }, {
    key: 'muted',
    get: function get() {
      return this._muted;
    },
    set: function set(value) {
      this._muted = value;
      if (value) {
        _innerAudioContextMap[this._$sn].volume = 0;
      } else {
        _innerAudioContextMap[this._$sn].volume = this._volume;
      }
    }
  }]);

  return Audio;
}(_HTMLAudioElement3.default);

exports.default = Audio;
module.exports = exports['default'];

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _HTMLMediaElement2 = __webpack_require__(4);

var _HTMLMediaElement3 = _interopRequireDefault(_HTMLMediaElement2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLAudioElement = function (_HTMLMediaElement) {
  _inherits(HTMLAudioElement, _HTMLMediaElement);

  function HTMLAudioElement() {
    _classCallCheck(this, HTMLAudioElement);

    return _possibleConstructorReturn(this, (HTMLAudioElement.__proto__ || Object.getPrototypeOf(HTMLAudioElement)).call(this, 'audio'));
  }

  return HTMLAudioElement;
}(_HTMLMediaElement3.default);

exports.default = HTMLAudioElement;
module.exports = exports['default'];

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _HTMLMediaElement2 = __webpack_require__(4);

var _HTMLMediaElement3 = _interopRequireDefault(_HTMLMediaElement2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLVideoElement = function (_HTMLMediaElement) {
    _inherits(HTMLVideoElement, _HTMLMediaElement);

    function HTMLVideoElement() {
        _classCallCheck(this, HTMLVideoElement);

        return _possibleConstructorReturn(this, (HTMLVideoElement.__proto__ || Object.getPrototypeOf(HTMLVideoElement)).call(this, 'video'));
    }

    return HTMLVideoElement;
}(_HTMLMediaElement3.default);

exports.default = HTMLVideoElement;
;
module.exports = exports['default'];

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _window2 = __webpack_require__(5);

var _window = _interopRequireWildcard(_window2);

var _document = __webpack_require__(27);

var _document2 = _interopRequireDefault(_document);

var _HTMLElement = __webpack_require__(0);

var _HTMLElement2 = _interopRequireDefault(_HTMLElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var global = GameGlobal;

function inject() {
  _window.document = _document2.default;

  _window.addEventListener = function (type, listener) {
    _window.document.addEventListener(type, listener);
  };
  _window.removeEventListener = function (type, listener) {
    _window.document.removeEventListener(type, listener);
  };
  _window.dispatchEvent = function () {
    var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    console.log('window.dispatchEvent', event.type, event);
    // nothing to do
  };

  var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
      platform = _wx$getSystemInfoSync.platform;

  // 开发者工具无法重定义 window


  if (typeof __devtoolssubcontext === 'undefined' && platform === 'devtools') {
    for (var key in _window) {
      var descriptor = Object.getOwnPropertyDescriptor(global, key);

      if (!descriptor || descriptor.configurable === true) {
        Object.defineProperty(window, key, {
          value: _window[key]
        });
      }
    }

    for (var _key in _window.document) {
      var _descriptor = Object.getOwnPropertyDescriptor(global.document, _key);

      if (!_descriptor || _descriptor.configurable === true) {
        Object.defineProperty(global.document, _key, {
          value: _window.document[_key]
        });
      }
    }
    window.parent = window;
  } else {
    for (var _key2 in _window) {
      global[_key2] = _window[_key2];
    }
    global.window = _window;
    window = global;
    window.top = window.parent = window;
  }
}

if (!GameGlobal.__isAdapterInjected) {
  GameGlobal.__isAdapterInjected = true;
  inject();
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _index = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TouchEvent = function TouchEvent(type) {
  _classCallCheck(this, TouchEvent);

  this.touches = [];
  this.targetTouches = [];
  this.changedTouches = [];
  this.preventDefault = _index.noop;
  this.stopPropagation = _index.noop;

  this.type = type;
  this.target = window.canvas;
  this.currentTarget = window.canvas;
};

exports.default = TouchEvent;


function touchEventHandlerFactory(type) {
  return function (event) {
    var touchEvent = new TouchEvent(type);

    touchEvent.touches = event.touches;
    touchEvent.targetTouches = Array.prototype.slice.call(event.touches);
    touchEvent.changedTouches = event.changedTouches;
    touchEvent.timeStamp = event.timeStamp;
    document.dispatchEvent(touchEvent);
  };
}

wx.onTouchStart(touchEventHandlerFactory('touchstart'));
wx.onTouchMove(touchEventHandlerFactory('touchmove'));
wx.onTouchEnd(touchEventHandlerFactory('touchend'));
wx.onTouchCancel(touchEventHandlerFactory('touchcancel'));
module.exports = exports['default'];

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MouseEvent = function MouseEvent() {
    _classCallCheck(this, MouseEvent);
};

exports.default = MouseEvent;
module.exports = exports["default"];

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(1);

// TODO 需要 wx.getSystemInfo 获取更详细信息
var systemInfo = wx.getSystemInfoSync();
console.log(systemInfo);

var system = systemInfo.system;
var platform = systemInfo.platform;
var language = systemInfo.language;
var wechatVersioin = systemInfo.version;

var android = system.toLowerCase().indexOf('android') !== -1;

var uaDesc = android ? 'Android; CPU ' + system : 'iPhone; CPU iPhone OS ' + system + ' like Mac OS X';
var ua = 'Mozilla/5.0 (' + uaDesc + ') AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 MicroMessenger/' + wechatVersioin + ' MiniGame NetType/WIFI Language/' + language;

var navigator = {
  platform: platform,
  language: language,
  appVersion: '5.0 (' + uaDesc + ') AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  userAgent: ua,
  onLine: true, // TODO 用 wx.getNetworkStateChange 和 wx.onNetworkStateChange 来返回真实的状态

  // TODO 用 wx.getLocation 来封装 geolocation
  geolocation: {
    getCurrentPosition: _index.noop,
    watchPosition: _index.noop,
    clearWatch: _index.noop
  }
};

if (wx.onNetworkStatusChange) {
  wx.onNetworkStatusChange(function (event) {
    navigator.onLine = event.isConnected;
  });
}

exports.default = navigator;
module.exports = exports['default'];

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _EventTarget2 = __webpack_require__(7);

var _EventTarget3 = _interopRequireDefault(_EventTarget2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _url = new WeakMap();
var _method = new WeakMap();
var _requestHeader = new WeakMap();
var _responseHeader = new WeakMap();
var _requestTask = new WeakMap();

function _triggerEvent(type) {
  if (typeof this['on' + type] === 'function') {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    this['on' + type].apply(this, args);
  }
}

function _changeReadyState(readyState) {
  this.readyState = readyState;
  _triggerEvent.call(this, 'readystatechange');
}

var XMLHttpRequest = (_temp = _class = function (_EventTarget) {
  _inherits(XMLHttpRequest, _EventTarget);

  // TODO 没法模拟 HEADERS_RECEIVED 和 LOADING 两个状态
  function XMLHttpRequest() {
    _classCallCheck(this, XMLHttpRequest);

    var _this2 = _possibleConstructorReturn(this, (XMLHttpRequest.__proto__ || Object.getPrototypeOf(XMLHttpRequest)).call(this));

    _this2.onabort = null;
    _this2.onerror = null;
    _this2.onload = null;
    _this2.onloadstart = null;
    _this2.onprogress = null;
    _this2.ontimeout = null;
    _this2.onloadend = null;
    _this2.onreadystatechange = null;
    _this2.readyState = 0;
    _this2.response = null;
    _this2.responseText = null;
    _this2.responseType = '';
    _this2.responseXML = null;
    _this2.status = 0;
    _this2.statusText = '';
    _this2.upload = {};
    _this2.withCredentials = false;


    _requestHeader.set(_this2, {
      'content-type': 'application/x-www-form-urlencoded'
    });
    _responseHeader.set(_this2, {});
    return _this2;
  }

  /*
   * TODO 这一批事件应该是在 XMLHttpRequestEventTarget.prototype 上面的
   */


  _createClass(XMLHttpRequest, [{
    key: 'abort',
    value: function abort() {
      var myRequestTask = _requestTask.get(this);

      if (myRequestTask) {
        myRequestTask.abort();
      }
    }
  }, {
    key: 'getAllResponseHeaders',
    value: function getAllResponseHeaders() {
      var responseHeader = _responseHeader.get(this);

      return Object.keys(responseHeader).map(function (header) {
        return header + ': ' + responseHeader[header];
      }).join('\n');
    }
  }, {
    key: 'getResponseHeader',
    value: function getResponseHeader(header) {
      return _responseHeader.get(this)[header];
    }
  }, {
    key: 'open',
    value: function open(method, url /* async, user, password 这几个参数在小程序内不支持*/) {
      _method.set(this, method);
      _url.set(this, url);
      _changeReadyState.call(this, XMLHttpRequest.OPENED);
    }
  }, {
    key: 'overrideMimeType',
    value: function overrideMimeType() {}
  }, {
    key: 'send',
    value: function send() {
      var _this3 = this;

      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (this.readyState !== XMLHttpRequest.OPENED) {
        throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
      } else {
        wx.request({
          data: data,
          url: _url.get(this),
          method: _method.get(this),
          header: _requestHeader.get(this),
          dataType: 'other',
          responseType: this.responseType === 'arraybuffer' ? 'arraybuffer' : 'text',
          success: function success(_ref) {
            var data = _ref.data,
                statusCode = _ref.statusCode,
                header = _ref.header;

            _this3.status = statusCode;
            _responseHeader.set(_this3, header);
            _triggerEvent.call(_this3, 'loadstart');
            _changeReadyState.call(_this3, XMLHttpRequest.HEADERS_RECEIVED);
            _changeReadyState.call(_this3, XMLHttpRequest.LOADING);

            switch (_this3.responseType) {
              case 'json':
                _this3.responseText = data;
                try {
                  _this3.response = JSON.parse(data);
                } catch (e) {
                  _this3.response = null;
                }
                break;
              case '':
              case 'text':
                _this3.responseText = _this3.response = data;
                break;
              case 'arraybuffer':
                _this3.response = data;
                _this3.responseText = '';
                var bytes = new Uint8Array(data);
                var len = bytes.byteLength;

                for (var i = 0; i < len; i++) {
                  _this3.responseText += String.fromCharCode(bytes[i]);
                }
                break;
              default:
                _this3.response = null;
            }
            _changeReadyState.call(_this3, XMLHttpRequest.DONE);
            _triggerEvent.call(_this3, 'load');
            _triggerEvent.call(_this3, 'loadend');
          },
          fail: function fail(_ref2) {
            var errMsg = _ref2.errMsg;

            // TODO 规范错误
            if (errMsg.indexOf('abort') !== -1) {
              _triggerEvent.call(_this3, 'abort');
            } else if (errMsg.indexOf('timeout') !== -1) {
              _triggerEvent.call(_this3, 'timeout');
            } else {
              _triggerEvent.call(_this3, 'error', errMsg);
            }
            _triggerEvent.call(_this3, 'loadend');
          }
        });
      }
    }
  }, {
    key: 'setRequestHeader',
    value: function setRequestHeader(header, value) {
      var myHeader = _requestHeader.get(this);

      myHeader[header] = value;
      _requestHeader.set(this, myHeader);
    }
  }, {
    key: 'addEventListener',
    value: function addEventListener(type, listener) {
      if (typeof listener === 'function') {
        var _this = this;
        var event = { target: _this };
        this['on' + type] = function (event) {
          listener.call(_this, event);
        };
      }
    }
  }]);

  return XMLHttpRequest;
}(_EventTarget3.default), _class.UNSEND = 0, _class.OPENED = 1, _class.HEADERS_RECEIVED = 2, _class.LOADING = 3, _class.DONE = 4, _temp);
exports.default = XMLHttpRequest;
module.exports = exports['default'];

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _socketTask = new WeakMap();

var WebSocket = (_temp = _class = function () {
  // TODO 更新 binaryType
  // The connection is in the process of closing.
  // The connection is not yet open.
  function WebSocket(url) {
    var _this = this;

    var protocols = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, WebSocket);

    this.binaryType = '';
    this.bufferedAmount = 0;
    this.extensions = '';
    this.onclose = null;
    this.onerror = null;
    this.onmessage = null;
    this.onopen = null;
    this.protocol = '';
    this.readyState = 3;

    if (typeof url !== 'string' || !/(^ws:\/\/)|(^wss:\/\/)/.test(url)) {
      throw new TypeError('Failed to construct \'WebSocket\': The URL \'' + url + '\' is invalid');
    }

    this.url = url;
    this.readyState = WebSocket.CONNECTING;

    var socketTask = wx.connectSocket({
      url: url,
      protocols: Array.isArray(protocols) ? protocols : [protocols],
      tcpNoDelay: true
    });

    _socketTask.set(this, socketTask);

    socketTask.onClose(function (res) {
      _this.readyState = WebSocket.CLOSED;
      if (typeof _this.onclose === 'function') {
        _this.onclose(res);
      }
    });

    socketTask.onMessage(function (res) {
      if (typeof _this.onmessage === 'function') {
        _this.onmessage(res);
      }
    });

    socketTask.onOpen(function () {
      _this.readyState = WebSocket.OPEN;
      if (typeof _this.onopen === 'function') {
        _this.onopen();
      }
    });

    socketTask.onError(function (res) {
      if (typeof _this.onerror === 'function') {
        _this.onerror(new Error(res.errMsg));
      }
    });

    return this;
  } // TODO 小程序内目前获取不到，实际上需要根据服务器选择的 sub-protocol 返回
  // TODO 更新 bufferedAmount
  // The connection is closed or couldn't be opened.

  // The connection is open and ready to communicate.


  _createClass(WebSocket, [{
    key: 'close',
    value: function close(code, reason) {
      this.readyState = WebSocket.CLOSING;
      var socketTask = _socketTask.get(this);

      socketTask.close({
        code: code,
        reason: reason
      });
    }
  }, {
    key: 'send',
    value: function send(data) {
      if (typeof data !== 'string' && !(data instanceof ArrayBuffer)) {
        throw new TypeError('Failed to send message: The data ' + data + ' is invalid');
      }

      var socketTask = _socketTask.get(this);

      socketTask.send({
        data: data
      });
    }
  }]);

  return WebSocket;
}(), _class.CONNECTING = 0, _class.OPEN = 1, _class.CLOSING = 2, _class.CLOSED = 3, _temp);
exports.default = WebSocket;
module.exports = exports['default'];

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _Node2 = __webpack_require__(20);

var _Node3 = _interopRequireDefault(_Node2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = function (_Node) {
  _inherits(Element, _Node);

  function Element() {
    _classCallCheck(this, Element);

    var _this = _possibleConstructorReturn(this, (Element.__proto__ || Object.getPrototypeOf(Element)).call(this));

    _this.className = '';
    _this.children = [];
    return _this;
  }

  return Element;
}(_Node3.default);

exports.default = Element;
module.exports = exports['default'];

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventTarget2 = __webpack_require__(7);

var _EventTarget3 = _interopRequireDefault(_EventTarget2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Node = function (_EventTarget) {
  _inherits(Node, _EventTarget);

  function Node() {
    _classCallCheck(this, Node);

    var _this = _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this));

    _this.childNodes = [];
    return _this;
  }

  _createClass(Node, [{
    key: 'appendChild',
    value: function appendChild(node) {
      this.childNodes.push(node);
      // if (node instanceof Node) {
      //   this.childNodes.push(node)
      // } else {
      //   throw new TypeError('Failed to executed \'appendChild\' on \'Node\': parameter 1 is not of type \'Node\'.')
      // }
    }
  }, {
    key: 'cloneNode',
    value: function cloneNode() {
      var copyNode = Object.create(this);

      Object.assign(copyNode, this);
      return copyNode;
    }
  }, {
    key: 'removeChild',
    value: function removeChild(node) {
      var index = this.childNodes.findIndex(function (child) {
        return child === node;
      });

      if (index > -1) {
        return this.childNodes.splice(index, 1);
      }
      return null;
    }
  }]);

  return Node;
}(_EventTarget3.default);

exports.default = Node;
module.exports = exports['default'];

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageBitmap = function ImageBitmap() {
    // TODO

    _classCallCheck(this, ImageBitmap);
};

exports.default = ImageBitmap;
module.exports = exports["default"];

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * TODO 使用 wx.readFile 来封装 FileReader
 */
var FileReader = function () {
  function FileReader() {
    _classCallCheck(this, FileReader);
  }

  _createClass(FileReader, [{
    key: "construct",
    value: function construct() {}
  }]);

  return FileReader;
}();

exports.default = FileReader;
module.exports = exports["default"];

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Canvas = __webpack_require__(3);

var _Canvas2 = _interopRequireDefault(_Canvas);

var _HTMLElement = __webpack_require__(0);

var _HTMLElement2 = _interopRequireDefault(_HTMLElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import HTMLElement from './HTMLElement';

// export default class HTMLCanvasElement extends HTMLElement
// {
//     constructor(){
//         super('canvas')
//     }
// };

GameGlobal.screencanvas = GameGlobal.screencanvas || new _Canvas2.default();
var canvas = GameGlobal.screencanvas;

var canvasConstructor = canvas.constructor;

// canvasConstructor.__proto__.__proto__ = new HTMLElement();

exports.default = canvasConstructor;
module.exports = exports['default'];

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebGLRenderingContext = function WebGLRenderingContext() {
    // TODO

    _classCallCheck(this, WebGLRenderingContext);
};

exports.default = WebGLRenderingContext;
module.exports = exports["default"];

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var localStorage = {
  get length() {
    var _wx$getStorageInfoSyn = wx.getStorageInfoSync(),
        keys = _wx$getStorageInfoSyn.keys;

    return keys.length;
  },

  key: function key(n) {
    var _wx$getStorageInfoSyn2 = wx.getStorageInfoSync(),
        keys = _wx$getStorageInfoSyn2.keys;

    return keys[n];
  },
  getItem: function getItem(key) {
    return wx.getStorageSync(key);
  },
  setItem: function setItem(key, value) {
    return wx.setStorageSync(key, value);
  },
  removeItem: function removeItem(key) {
    wx.removeStorageSync(key);
  },
  clear: function clear() {
    wx.clearStorageSync();
  }
};

exports.default = localStorage;
module.exports = exports["default"];

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var location = {
  href: 'game.js',
  reload: function reload() {}
};

exports.default = location;
module.exports = exports['default'];

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _window = __webpack_require__(5);

var window = _interopRequireWildcard(_window);

var _HTMLElement = __webpack_require__(0);

var _HTMLElement2 = _interopRequireDefault(_HTMLElement);

var _HTMLVideoElement = __webpack_require__(12);

var _HTMLVideoElement2 = _interopRequireDefault(_HTMLVideoElement);

var _Image = __webpack_require__(8);

var _Image2 = _interopRequireDefault(_Image);

var _Audio = __webpack_require__(10);

var _Audio2 = _interopRequireDefault(_Audio);

var _Canvas = __webpack_require__(3);

var _Canvas2 = _interopRequireDefault(_Canvas);

__webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var events = {};

var document = {
  readyState: 'complete',
  visibilityState: 'visible',
  documentElement: window,
  hidden: false,
  style: {},
  location: window.location,
  ontouchstart: null,
  ontouchmove: null,
  ontouchend: null,

  head: new _HTMLElement2.default('head'),
  body: new _HTMLElement2.default('body'),

  createElement: function createElement(tagName) {
    if (tagName === 'canvas') {
      return new _Canvas2.default();
    } else if (tagName === 'audio') {
      return new _Audio2.default();
    } else if (tagName === 'img') {
      return new _Image2.default();
    } else if (tagName === 'video') {
      return new _HTMLVideoElement2.default();
    }

    return new _HTMLElement2.default(tagName);
  },
  createElementNS: function createElementNS(nameSpace, tagName) {
    return this.createElement(tagName);
  },
  getElementById: function getElementById(id) {
    if (id === window.canvas.id) {
      return window.canvas;
    }
    return null;
  },
  getElementsByTagName: function getElementsByTagName(tagName) {
    if (tagName === 'head') {
      return [document.head];
    } else if (tagName === 'body') {
      return [document.body];
    } else if (tagName === 'canvas') {
      return [window.canvas];
    }
    return [];
  },
  getElementsByName: function getElementsByName(tagName) {
    if (tagName === 'head') {
      return [document.head];
    } else if (tagName === 'body') {
      return [document.body];
    } else if (tagName === 'canvas') {
      return [window.canvas];
    }
    return [];
  },
  querySelector: function querySelector(query) {
    if (query === 'head') {
      return document.head;
    } else if (query === 'body') {
      return document.body;
    } else if (query === 'canvas') {
      return window.canvas;
    } else if (query === '#' + window.canvas.id) {
      return window.canvas;
    }
    return null;
  },
  querySelectorAll: function querySelectorAll(query) {
    if (query === 'head') {
      return [document.head];
    } else if (query === 'body') {
      return [document.body];
    } else if (query === 'canvas') {
      return [window.canvas];
    }
    return [];
  },
  addEventListener: function addEventListener(type, listener) {
    if (!events[type]) {
      events[type] = [];
    }
    events[type].push(listener);
  },
  removeEventListener: function removeEventListener(type, listener) {
    var listeners = events[type];

    if (listeners && listeners.length > 0) {
      for (var i = listeners.length; i--; i > 0) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1);
          break;
        }
      }
    }
  },
  dispatchEvent: function dispatchEvent(event) {
    var listeners = events[event.type];

    if (listeners) {
      for (var i = 0; i < listeners.length; i++) {
        listeners[i](event);
      }
    }
  }
};

exports.default = document;
module.exports = exports['default'];

/***/ })
/******/ ]);