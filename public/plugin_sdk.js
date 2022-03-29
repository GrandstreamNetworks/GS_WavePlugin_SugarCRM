(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.pluginSDK = factory());
}(this, (function () { 'use strict';

    var action = {
      //通话相关
      makeP2PAudioCall: "makeP2PAudioCall",
      makeP2PVideoCall: "makeP2PVideoCall",
      recvP2PIncomingCall: "recvP2PIncomingCall",
      answerP2PCall: "answerP2PCall",
      hangupP2PCall: "hangupP2PCall",
      rejectP2PCall: "rejectP2PCall",
      P2PCallCanceled: 'P2PCallCanceled',
      initP2PCall: 'initP2PCall',
      //日志模块
      logError: "logError",
      logLog: "logLog",
      logInfo: "logInfo",
      logWarn: "logWarn",
      //配置相关
      getUserConfig: "getUserConfig",
      addUserConfig: "addUserConfig",
      setPluginSignature: 'setPluginSignature',
      //窗口相关
      initPluginWindow: "initPluginWindow",
      hidePluginWin: "hidePluginWin",
      setDefaultWindow: "setDefaultWindow",
      //监听事件
      addPluginEventLister: 'addPluginEventLister',
      //显示插件通知消息
      showNotificationMsg: 'showNotificationMsg',
      //隐藏插件通知
      hideNotificationMsg: 'hideNotificationMsg'
    };

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var _global = createCommonjsModule(function (module) {
    // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
    var global = module.exports = typeof window != 'undefined' && window.Math == Math
      ? window : typeof self != 'undefined' && self.Math == Math ? self
      // eslint-disable-next-line no-new-func
      : Function('return this')();
    if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
    });

    var _core = createCommonjsModule(function (module) {
    var core = module.exports = { version: '2.6.12' };
    if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
    });
    var _core_1 = _core.version;

    var _isObject = function (it) {
      return typeof it === 'object' ? it !== null : typeof it === 'function';
    };

    var _anObject = function (it) {
      if (!_isObject(it)) throw TypeError(it + ' is not an object!');
      return it;
    };

    var _fails = function (exec) {
      try {
        return !!exec();
      } catch (e) {
        return true;
      }
    };

    // Thank's IE8 for his funny defineProperty
    var _descriptors = !_fails(function () {
      return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
    });

    var document = _global.document;
    // typeof document.createElement is 'object' in old IE
    var is = _isObject(document) && _isObject(document.createElement);
    var _domCreate = function (it) {
      return is ? document.createElement(it) : {};
    };

    var _ie8DomDefine = !_descriptors && !_fails(function () {
      return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
    });

    // 7.1.1 ToPrimitive(input [, PreferredType])

    // instead of the ES6 spec version, we didn't implement @@toPrimitive case
    // and the second argument - flag - preferred type is a string
    var _toPrimitive = function (it, S) {
      if (!_isObject(it)) return it;
      var fn, val;
      if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
      if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
      if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
      throw TypeError("Can't convert object to primitive value");
    };

    var dP = Object.defineProperty;

    var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
      _anObject(O);
      P = _toPrimitive(P, true);
      _anObject(Attributes);
      if (_ie8DomDefine) try {
        return dP(O, P, Attributes);
      } catch (e) { /* empty */ }
      if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
      if ('value' in Attributes) O[P] = Attributes.value;
      return O;
    };

    var _objectDp = {
    	f: f
    };

    var _propertyDesc = function (bitmap, value) {
      return {
        enumerable: !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable: !(bitmap & 4),
        value: value
      };
    };

    var _hide = _descriptors ? function (object, key, value) {
      return _objectDp.f(object, key, _propertyDesc(1, value));
    } : function (object, key, value) {
      object[key] = value;
      return object;
    };

    var hasOwnProperty = {}.hasOwnProperty;
    var _has = function (it, key) {
      return hasOwnProperty.call(it, key);
    };

    var id = 0;
    var px = Math.random();
    var _uid = function (key) {
      return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
    };

    var _shared = createCommonjsModule(function (module) {
    var SHARED = '__core-js_shared__';
    var store = _global[SHARED] || (_global[SHARED] = {});

    (module.exports = function (key, value) {
      return store[key] || (store[key] = value !== undefined ? value : {});
    })('versions', []).push({
      version: _core.version,
      mode:  'global',
      copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
    });
    });

    var _functionToString = _shared('native-function-to-string', Function.toString);

    var _redefine = createCommonjsModule(function (module) {
    var SRC = _uid('src');

    var TO_STRING = 'toString';
    var TPL = ('' + _functionToString).split(TO_STRING);

    _core.inspectSource = function (it) {
      return _functionToString.call(it);
    };

    (module.exports = function (O, key, val, safe) {
      var isFunction = typeof val == 'function';
      if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
      if (O[key] === val) return;
      if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
      if (O === _global) {
        O[key] = val;
      } else if (!safe) {
        delete O[key];
        _hide(O, key, val);
      } else if (O[key]) {
        O[key] = val;
      } else {
        _hide(O, key, val);
      }
    // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
    })(Function.prototype, TO_STRING, function toString() {
      return typeof this == 'function' && this[SRC] || _functionToString.call(this);
    });
    });

    var _aFunction = function (it) {
      if (typeof it != 'function') throw TypeError(it + ' is not a function!');
      return it;
    };

    // optional / simple context binding

    var _ctx = function (fn, that, length) {
      _aFunction(fn);
      if (that === undefined) return fn;
      switch (length) {
        case 1: return function (a) {
          return fn.call(that, a);
        };
        case 2: return function (a, b) {
          return fn.call(that, a, b);
        };
        case 3: return function (a, b, c) {
          return fn.call(that, a, b, c);
        };
      }
      return function (/* ...args */) {
        return fn.apply(that, arguments);
      };
    };

    var PROTOTYPE = 'prototype';

    var $export = function (type, name, source) {
      var IS_FORCED = type & $export.F;
      var IS_GLOBAL = type & $export.G;
      var IS_STATIC = type & $export.S;
      var IS_PROTO = type & $export.P;
      var IS_BIND = type & $export.B;
      var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
      var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
      var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
      var key, own, out, exp;
      if (IS_GLOBAL) source = name;
      for (key in source) {
        // contains in native
        own = !IS_FORCED && target && target[key] !== undefined;
        // export native or passed
        out = (own ? target : source)[key];
        // bind timers to global for call from export context
        exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
        // extend global
        if (target) _redefine(target, key, out, type & $export.U);
        // export
        if (exports[key] != out) _hide(exports, key, exp);
        if (IS_PROTO && expProto[key] != out) expProto[key] = out;
      }
    };
    _global.core = _core;
    // type bitmap
    $export.F = 1;   // forced
    $export.G = 2;   // global
    $export.S = 4;   // static
    $export.P = 8;   // proto
    $export.B = 16;  // bind
    $export.W = 32;  // wrap
    $export.U = 64;  // safe
    $export.R = 128; // real proto method for `library`
    var _export = $export;

    var toString = {}.toString;

    var _cof = function (it) {
      return toString.call(it).slice(8, -1);
    };

    // fallback for non-array-like ES3 and non-enumerable old V8 strings

    // eslint-disable-next-line no-prototype-builtins
    var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
      return _cof(it) == 'String' ? it.split('') : Object(it);
    };

    // 7.2.1 RequireObjectCoercible(argument)
    var _defined = function (it) {
      if (it == undefined) throw TypeError("Can't call method on  " + it);
      return it;
    };

    // 7.1.13 ToObject(argument)

    var _toObject = function (it) {
      return Object(_defined(it));
    };

    // 7.1.4 ToInteger
    var ceil = Math.ceil;
    var floor = Math.floor;
    var _toInteger = function (it) {
      return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
    };

    // 7.1.15 ToLength

    var min = Math.min;
    var _toLength = function (it) {
      return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
    };

    // 7.2.2 IsArray(argument)

    var _isArray = Array.isArray || function isArray(arg) {
      return _cof(arg) == 'Array';
    };

    var _wks = createCommonjsModule(function (module) {
    var store = _shared('wks');

    var Symbol = _global.Symbol;
    var USE_SYMBOL = typeof Symbol == 'function';

    var $exports = module.exports = function (name) {
      return store[name] || (store[name] =
        USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
    };

    $exports.store = store;
    });

    var SPECIES = _wks('species');

    var _arraySpeciesConstructor = function (original) {
      var C;
      if (_isArray(original)) {
        C = original.constructor;
        // cross-realm fallback
        if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
        if (_isObject(C)) {
          C = C[SPECIES];
          if (C === null) C = undefined;
        }
      } return C === undefined ? Array : C;
    };

    // 9.4.2.3 ArraySpeciesCreate(originalArray, length)


    var _arraySpeciesCreate = function (original, length) {
      return new (_arraySpeciesConstructor(original))(length);
    };

    // 0 -> Array#forEach
    // 1 -> Array#map
    // 2 -> Array#filter
    // 3 -> Array#some
    // 4 -> Array#every
    // 5 -> Array#find
    // 6 -> Array#findIndex





    var _arrayMethods = function (TYPE, $create) {
      var IS_MAP = TYPE == 1;
      var IS_FILTER = TYPE == 2;
      var IS_SOME = TYPE == 3;
      var IS_EVERY = TYPE == 4;
      var IS_FIND_INDEX = TYPE == 6;
      var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
      var create = $create || _arraySpeciesCreate;
      return function ($this, callbackfn, that) {
        var O = _toObject($this);
        var self = _iobject(O);
        var f = _ctx(callbackfn, that, 3);
        var length = _toLength(self.length);
        var index = 0;
        var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
        var val, res;
        for (;length > index; index++) if (NO_HOLES || index in self) {
          val = self[index];
          res = f(val, index, O);
          if (TYPE) {
            if (IS_MAP) result[index] = res;   // map
            else if (res) switch (TYPE) {
              case 3: return true;             // some
              case 5: return val;              // find
              case 6: return index;            // findIndex
              case 2: result.push(val);        // filter
            } else if (IS_EVERY) return false; // every
          }
        }
        return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
      };
    };

    var _strictMethod = function (method, arg) {
      return !!method && _fails(function () {
        // eslint-disable-next-line no-useless-call
        arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
      });
    };

    var $map = _arrayMethods(1);

    _export(_export.P + _export.F * !_strictMethod([].map, true), 'Array', {
      // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
      map: function map(callbackfn /* , thisArg */) {
        return $map(this, callbackfn, arguments[1]);
      }
    });

    // to indexed object, toObject with fallback for non-array-like ES3 strings


    var _toIobject = function (it) {
      return _iobject(_defined(it));
    };

    var max = Math.max;
    var min$1 = Math.min;
    var _toAbsoluteIndex = function (index, length) {
      index = _toInteger(index);
      return index < 0 ? max(index + length, 0) : min$1(index, length);
    };

    // false -> Array#indexOf
    // true  -> Array#includes



    var _arrayIncludes = function (IS_INCLUDES) {
      return function ($this, el, fromIndex) {
        var O = _toIobject($this);
        var length = _toLength(O.length);
        var index = _toAbsoluteIndex(fromIndex, length);
        var value;
        // Array#includes uses SameValueZero equality algorithm
        // eslint-disable-next-line no-self-compare
        if (IS_INCLUDES && el != el) while (length > index) {
          value = O[index++];
          // eslint-disable-next-line no-self-compare
          if (value != value) return true;
        // Array#indexOf ignores holes, Array#includes - not
        } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
          if (O[index] === el) return IS_INCLUDES || index || 0;
        } return !IS_INCLUDES && -1;
      };
    };

    var $indexOf = _arrayIncludes(false);
    var $native = [].indexOf;
    var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

    _export(_export.P + _export.F * (NEGATIVE_ZERO || !_strictMethod($native)), 'Array', {
      // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
      indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
        return NEGATIVE_ZERO
          // convert -0 to +0
          ? $native.apply(this, arguments) || 0
          : $indexOf(this, searchElement, arguments[1]);
      }
    });

    /*
     * 用于监听事件定义
     *
     */
    function Event() {
      /* 开发给使用者的注册事件 */
      this.handlers = {
        onError: [],
        // 发生错误时的通知事件
        recvMessage: [] //收到消息时的通知事件

      };
    }

    Event.prototype.on = function (eventName, handle) {
      if (typeof handle === 'function') {
        if (!this.handlers.hasOwnProperty(eventName)) {
          this.handlers[eventName] = [];
        }

        this.handlers[eventName].push(handle);
      } else {
        throw new Error('Provided parameter is not a function');
      }
    }; //请慎用


    Event.prototype.once = function (eventName, handle) {
      var _this = this;

      var wrapFunc = function wrapFunc() {
        //创建一个wrapFanc函数实现单次调用后停止监听
        handle.apply(void 0, arguments); //执行wrapFunc

        _this.off(eventName, wrapFunc); //后停止监听事件

      };

      this.on(eventName, wrapFunc); //注册监听wrapFunc事件
    };

    Event.prototype.trigger = function (eventName) {
      for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      if (!this.handlers.hasOwnProperty(eventName)) return; //事件队列依次执行

      this.handlers[eventName].map(function (handle) {
        handle.apply(void 0, params);
      });
    };

    Event.prototype.off = function (eventName, handle) {
      if (!this.handlers.hasOwnProperty(eventName)) return;

      if (typeof handle === 'undefined') {
        this.handlers[eventName] = [];
        return;
      }

      var index = this.handlers[eventName].indexOf(handle);

      if (index !== -1) {
        this.handlers[eventName].splice(index, 1);
      }
    };

    var event = {}; //实例化Event

    var eventInstance = undefined;

    event.getEventInstance = function () {
      if (!eventInstance) {
        eventInstance = new Event();
      }

      return eventInstance;
    };

    /*
    用于定义前端事件监听
     */
    var pluginEvent = {}; //通话相关
    //接收p2p语音通话消息

    pluginEvent.onRecvP2PIncomingCall = "onRecvP2PIncomingCall"; //接听音频通话

    pluginEvent.onAnswerP2PCall = "onAnswerP2PCall"; //挂断通话

    pluginEvent.onHangupP2PCall = "onHangupP2PCall"; //拒接音频通话

    pluginEvent.onRejectP2PCall = "onRejectP2PCall"; //取消来电

    pluginEvent.onP2PCallCanceled = 'onP2PCallCanceled'; //wave发起呼叫

    pluginEvent.onInitP2PCall = 'onInitP2PCall'; //窗口相关
    //窗口初始化成功

    pluginEvent.onInitPluginWindowOk = 'onInitPluginWindowOk';

    // 7.2.9 SameValue(x, y)
    var _sameValue = Object.is || function is(x, y) {
      // eslint-disable-next-line no-self-compare
      return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
    };

    // getting tag from 19.1.3.6 Object.prototype.toString()

    var TAG = _wks('toStringTag');
    // ES3 wrong here
    var ARG = _cof(function () { return arguments; }()) == 'Arguments';

    // fallback for IE11 Script Access Denied error
    var tryGet = function (it, key) {
      try {
        return it[key];
      } catch (e) { /* empty */ }
    };

    var _classof = function (it) {
      var O, T, B;
      return it === undefined ? 'Undefined' : it === null ? 'Null'
        // @@toStringTag case
        : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
        // builtinTag case
        : ARG ? _cof(O)
        // ES3 arguments fallback
        : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
    };

    var builtinExec = RegExp.prototype.exec;

     // `RegExpExec` abstract operation
    // https://tc39.github.io/ecma262/#sec-regexpexec
    var _regexpExecAbstract = function (R, S) {
      var exec = R.exec;
      if (typeof exec === 'function') {
        var result = exec.call(R, S);
        if (typeof result !== 'object') {
          throw new TypeError('RegExp exec method returned something other than an Object or null');
        }
        return result;
      }
      if (_classof(R) !== 'RegExp') {
        throw new TypeError('RegExp#exec called on incompatible receiver');
      }
      return builtinExec.call(R, S);
    };

    // 21.2.5.3 get RegExp.prototype.flags

    var _flags = function () {
      var that = _anObject(this);
      var result = '';
      if (that.global) result += 'g';
      if (that.ignoreCase) result += 'i';
      if (that.multiline) result += 'm';
      if (that.unicode) result += 'u';
      if (that.sticky) result += 'y';
      return result;
    };

    var nativeExec = RegExp.prototype.exec;
    // This always refers to the native implementation, because the
    // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
    // which loads this file before patching the method.
    var nativeReplace = String.prototype.replace;

    var patchedExec = nativeExec;

    var LAST_INDEX = 'lastIndex';

    var UPDATES_LAST_INDEX_WRONG = (function () {
      var re1 = /a/,
          re2 = /b*/g;
      nativeExec.call(re1, 'a');
      nativeExec.call(re2, 'a');
      return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
    })();

    // nonparticipating capturing group, copied from es5-shim's String#split patch.
    var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

    var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

    if (PATCH) {
      patchedExec = function exec(str) {
        var re = this;
        var lastIndex, reCopy, match, i;

        if (NPCG_INCLUDED) {
          reCopy = new RegExp('^' + re.source + '$(?!\\s)', _flags.call(re));
        }
        if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

        match = nativeExec.call(re, str);

        if (UPDATES_LAST_INDEX_WRONG && match) {
          re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
        }
        if (NPCG_INCLUDED && match && match.length > 1) {
          // Fix browsers whose `exec` methods don't consistently return `undefined`
          // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
          // eslint-disable-next-line no-loop-func
          nativeReplace.call(match[0], reCopy, function () {
            for (i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undefined) match[i] = undefined;
            }
          });
        }

        return match;
      };
    }

    var _regexpExec = patchedExec;

    _export({
      target: 'RegExp',
      proto: true,
      forced: _regexpExec !== /./.exec
    }, {
      exec: _regexpExec
    });

    var SPECIES$1 = _wks('species');

    var REPLACE_SUPPORTS_NAMED_GROUPS = !_fails(function () {
      // #replace needs built-in support for named groups.
      // #match works fine because it just return the exec results, even if it has
      // a "grops" property.
      var re = /./;
      re.exec = function () {
        var result = [];
        result.groups = { a: '7' };
        return result;
      };
      return ''.replace(re, '$<a>') !== '7';
    });

    var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
      // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
      var re = /(?:)/;
      var originalExec = re.exec;
      re.exec = function () { return originalExec.apply(this, arguments); };
      var result = 'ab'.split(re);
      return result.length === 2 && result[0] === 'a' && result[1] === 'b';
    })();

    var _fixReWks = function (KEY, length, exec) {
      var SYMBOL = _wks(KEY);

      var DELEGATES_TO_SYMBOL = !_fails(function () {
        // String methods call symbol-named RegEp methods
        var O = {};
        O[SYMBOL] = function () { return 7; };
        return ''[KEY](O) != 7;
      });

      var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !_fails(function () {
        // Symbol-named RegExp methods call .exec
        var execCalled = false;
        var re = /a/;
        re.exec = function () { execCalled = true; return null; };
        if (KEY === 'split') {
          // RegExp[@@split] doesn't call the regex's exec method, but first creates
          // a new one. We need to return the patched regex when creating the new one.
          re.constructor = {};
          re.constructor[SPECIES$1] = function () { return re; };
        }
        re[SYMBOL]('');
        return !execCalled;
      }) : undefined;

      if (
        !DELEGATES_TO_SYMBOL ||
        !DELEGATES_TO_EXEC ||
        (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
        (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
      ) {
        var nativeRegExpMethod = /./[SYMBOL];
        var fns = exec(
          _defined,
          SYMBOL,
          ''[KEY],
          function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
            if (regexp.exec === _regexpExec) {
              if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
                // The native String method already delegates to @@method (this
                // polyfilled function), leasing to infinite recursion.
                // We avoid it by directly calling the native @@method method.
                return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
              }
              return { done: true, value: nativeMethod.call(str, regexp, arg2) };
            }
            return { done: false };
          }
        );
        var strfn = fns[0];
        var rxfn = fns[1];

        _redefine(String.prototype, KEY, strfn);
        _hide(RegExp.prototype, SYMBOL, length == 2
          // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
          // 21.2.5.11 RegExp.prototype[@@split](string, limit)
          ? function (string, arg) { return rxfn.call(string, this, arg); }
          // 21.2.5.6 RegExp.prototype[@@match](string)
          // 21.2.5.9 RegExp.prototype[@@search](string)
          : function (string) { return rxfn.call(string, this); }
        );
      }
    };

    // @@search logic
    _fixReWks('search', 1, function (defined, SEARCH, $search, maybeCallNative) {
      return [
        // `String.prototype.search` method
        // https://tc39.github.io/ecma262/#sec-string.prototype.search
        function search(regexp) {
          var O = defined(this);
          var fn = regexp == undefined ? undefined : regexp[SEARCH];
          return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
        },
        // `RegExp.prototype[@@search]` method
        // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
        function (regexp) {
          var res = maybeCallNative($search, regexp, this);
          if (res.done) return res.value;
          var rx = _anObject(regexp);
          var S = String(this);
          var previousLastIndex = rx.lastIndex;
          if (!_sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
          var result = _regexpExecAbstract(rx, S);
          if (!_sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
          return result === null ? -1 : result.index;
        }
      ];
    });

    //id
    var nLogNum = 1; //日志序列号
    //debug:1, log:2, info:3, warn:4, error:5

    function setLogLevel(level) {
      return level.toLowerCase() === "error" ? 5 : level.toLowerCase() === "warn" ? 4 : level.toLowerCase() === "info" ? 3 : level.toLowerCase() === "log" ? 2 : 1;
    }

    var nLogLevel = setLogLevel("log");

    function webrtc_log_debug(s_msg) {
      if (nLogLevel <= 1) {
        if (nLogNum > 100000) {
          nLogNum = 1;
        }

        var logtime = "[" + nLogNum++ + "]";
        window.console.debug(logtime + " " + s_msg);
      }
    }

    function webrtc_log_log(s_msg) {
      if (nLogLevel <= 2) {
        if (nLogNum > 100000) {
          nLogNum = 1;
        }

        var logtime = "[" + nLogNum++ + "]";
        window.console.log(logtime + " " + s_msg);
      }
    }

    function webrtc_log_info(s_msg) {
      if (nLogLevel <= 3) {
        if (nLogNum > 100000) {
          nLogNum = 1;
        }

        var logtime = "[" + nLogNum++ + "]";
        window.console.info(logtime + " " + s_msg);
      }
    }

    function webrtc_log_warn(s_msg) {
      if (nLogLevel <= 4) {
        if (nLogNum > 100000) {
          nLogNum = 1;
        }

        var logtime = "[" + nLogNum++ + "]";
        window.console.warn(logtime + " " + s_msg);
      }
    }

    function webrtc_log_error(s_msg) {
      if (nLogLevel <= 5) {
        if (nLogNum > 100000) {
          nLogNum = 1;
        }

        var logtime = "[" + nLogNum++ + "]";
        window.console.error(logtime + " " + s_msg);
      }
    }
    /**
     * 提供一个日志调用对象，按模块名打印，模块名为空，按原先方式打印日志
     * 实例化示例：<打印方法msg参数允许为undefined>
     * var log = new Log.WebrtcLogger(sMoudleName);
     * new Log.WebrtcLogger().warn("rrrrr");
     * log.info(msg);/log.warn();/log.error();
     */
    //


    var Logger = function Logger(sMoudleName) {
      var sMoudleName = sMoudleName;

      function wrapMsg(sMsg) {
        //若sMsg为undefined，则内容也为undefined
        //			if(sMsg == undefined){
        //				sMsg = "";
        //			}
        if (sMoudleName == undefined || sMoudleName == "") {
          sMsg = sMsg;
        } else {
          sMsg = "[" + sMoudleName + "] " + sMsg;
        }

        return sMsg;
      } //开放给外部调用的日志打印方法


      this.debug = function (sLogMsg) {
        var sNewLogMsg = wrapMsg(sLogMsg);
        webrtc_log_debug(sNewLogMsg);
      };

      this.log = function (sLogMsg) {
        var sNewLogMsg = wrapMsg(sLogMsg);
        webrtc_log_log(sNewLogMsg);
      };

      this.info = function (sLogMsg) {
        var sNewLogMsg = wrapMsg(sLogMsg);
        webrtc_log_info(sNewLogMsg);
      };

      this.warn = function (sLogMsg) {
        var sNewLogMsg = wrapMsg(sLogMsg);
        webrtc_log_warn(sNewLogMsg);
      };

      this.error = function (sLogMsg) {
        var sNewLogMsg = wrapMsg(sLogMsg);
        webrtc_log_error(sNewLogMsg);
      };
    };
    /**
     * 兼容debug模式
     * @param sMoudleName
     */


    var log = {};

    if (window.debug) {
      log.debug = window.debug('pluginSDK:DEBUG');
      log.log = window.debug('pluginSDK:INFO');
      log.info = window.debug('pluginSDK:INFO');
      log.warn = window.debug('pluginSDK:WARN');
      log.error = window.debug('pluginSDK:ERROR');
    } else {
      var logger = new Logger("pluginSDK");

      log.debug = function (msg) {
        return logger.debug(msg);
      };

      log.log = function (msg) {
        return logger.log(msg);
      };

      log.info = function (msg) {
        return logger.info(msg);
      };

      log.warn = function (msg) {
        return logger.warn(msg);
      };

      log.error = function (msg) {
        return logger.error(msg);
      };
    }

    /**
     *  错误码
     **/
    var errorCode = {
      FAIL: -1,
      //失败
      SUCCESS: 0,
      CALLNUMBER_EMPTY: 1,
      //呼叫号码为空
      LOG_MESSAGE_EMPTY: 2,
      //日志内容为空
      USER_CONFIG_EMPTY: 3 //用户配置信息为空

    };

    var common = {};

    common.getPluginId = function () {
      var _window$location$sear = window.location.search,
          search = _window$location$sear === void 0 ? '' : _window$location$sear;
      var query = new URLSearchParams(search);

      if (query) {
        var pluginId = query.get('pluginId');
        return pluginId;
      }

      return '';
    };

    var _require = require('electron'),
        ipcRenderer = _require.ipcRenderer;
    var electronEvent = {};
    var pluginWinInfo = {};
    /**
     *@param {action: '操作',data:'json格式'}
     */

    electronEvent.postMsgToWave = function (action, data) {
      if (action && data) {
        data.action = action;
        data.pluginId = pluginWinInfo.pluginId;
        ipcRenderer.send('plugin-window-message', 'pluginWindow', data);
      }
    };
    /**
     * 收到主进程的监听事件
     */


    ipcRenderer.on('postMessage2pluginWindow', function (event$1, data) {
      console.log('recv data from wave:' + JSON.stringify(data));

      if (data.action === action.initPluginWindow) {
        //初始化插件
        pluginWinInfo.pluginId = data.pluginId; // pluginWinInfo.pluginWin = data.pluginWindow;

        pluginWinInfo.userConfig = data.userConfig; //用户配置信息

        var initData = {
          //pluginId: data.pluginId,
          userConfig: data.userConfig,
          pluginPath: data.pluginPath
        };
        event.getEventInstance().trigger(pluginEvent.onInitPluginWindowOk, initData);
      } else if (data.action === action.recvP2PIncomingCall) {
        //收到来电
        var callMsg = {
          callType: data.callType,
          callNum: data.callNum
        };
        event.getEventInstance().trigger(pluginEvent.onRecvP2PIncomingCall, callMsg);
      } else if (data.action === action.answerP2PCall) {
        var _callMsg = {
          callType: data.callType,
          callNum: data.callNum
        };
        event.getEventInstance().trigger(pluginEvent.onAnswerP2PCall, _callMsg);
      } else if (data.action === action.hangupP2PCall) {
        var _callMsg2 = {
          callType: data.callType,
          callNum: data.callNum,
          callStartTimeStamp: data.callStartTimeStamp,
          callEndTimeStamp: data.callEndTimeStamp,
          callDirection: data.callDirection
        };
        event.getEventInstance().trigger(pluginEvent.onHangupP2PCall, _callMsg2);
      } else if (data.action === action.rejectP2PCall) {
        var _callMsg3 = {
          callType: data.callType,
          callNum: data.callNum
        };
        event.getEventInstance().trigger(pluginEvent.onRejectP2PCall, _callMsg3);
      } else if (data.action === action.P2PCallCanceled) {
        var _callMsg4 = {
          callNum: data.callNum
        };
        event.getEventInstance().trigger(pluginEvent.onP2PCallCanceled, _callMsg4);
      } else if (data.action === action.initP2PCall) {
        var _callMsg5 = {
          callNum: data.callNum,
          callType: data.callType
        };
        event.getEventInstance().trigger(pluginEvent.onInitP2PCall, _callMsg5);
      }
    });

    electronEvent.getPluginInfo = function () {
      return JSON.parse(JSON.stringify(pluginWinInfo));
    };
    /**
     * 修改配置
     * @param data {pluginId: '插件id', userConfig:'用户配置'}
     */


    electronEvent.updatePluginConfig = function (data) {
      if (data.userConfig !== undefined) {
        pluginWinInfo.userConfig = data.userConfig;
      }

      if (data.pluginId) {
        pluginWinInfo.pluginId = data.pluginId;
      }
    };
    /**
     * 初始话pluginId
     */


    electronEvent.initPluginId = function () {
      var pluginId = common.getPluginId();

      if (pluginId) {
        pluginWinInfo.pluginId = pluginId;
      }
    };
    /**
     * 加载js时从url中获取pluginId;
     */


    electronEvent.initPluginId();

    /*
    将插件绑定的事件传递给wave
     */
    var bindEvent = {};

    bindEvent.on = function (eventName, handle) {
      var data = {
        eventName: eventName
      };
      event.getEventInstance().on(eventName, handle);
      electronEvent.postMsgToWave(action.addPluginEventLister, data);
    };

    bindEvent.off = function (eventName, handle) {
      event.getEventInstance().off(eventName, handle);
    };

    bindEvent.once = function (eventName, handle) {
      event.getEventInstance().once(eventName, handle);
    };

    /*
    通话相关
     */
    var calls = {};
    /**
     * 音频通话
     * @param data {callNumber:'呼叫号码'}
     * @param callback
     */

    calls.makeP2PAudioCall = function (data, callback) {
      if (!data || !data.callNumber) {
        callback({
          errorCode: errorCode.CALLNUMBER_EMPTY
        });
        return false;
      }

      var jsonBody = {
        callNumber: data.callNumber
      };
      electronEvent.postMsgToWave(action.makeP2PAudioCall, jsonBody);
      callback({
        errorCode: errorCode.SUCCESS
      });
    };
    /**
     * 视频通话
     * @param data {callNumber:'呼叫号码'}
     * @param callback
     */


    calls.makeP2PVideoCall = function (data, callback) {
      if (!data || !data.callNumber) {
        callback({
          errorCode: errorCode.CALLNUMBER_EMPTY
        });
        return false;
      }

      var jsonBody = {
        callNumber: data.callNumber
      };
      electronEvent.postMsgToWave(action.makeP2PVideoCall, jsonBody);
      callback({
        errorCode: errorCode.SUCCESS
      });
    };

    /*
    日志模块
     */
    var logger$1 = {};
    /**
     * log 打印
     * @param data
     */

    logger$1.log = function (data) {
      if (!data) {
        callback({
          errorCode: errorCode.LOG_MESSAGE_EMPTY
        });
        return false;
      }

      var jsonBody = {
        message: data
      };
      electronEvent.postMsgToWave(action.logLog, jsonBody);
    };
    /**
     * info日志 打印
     * @param data
     */


    logger$1.info = function (data) {
      console.log('recv message from plugin:' + data);

      if (!data) {
        callback({
          errorCode: errorCode.LOG_MESSAGE_EMPTY
        });
        return false;
      }

      var jsonBody = {
        message: data
      };
      electronEvent.postMsgToWave(action.logInfo, jsonBody);
    };
    /**
     * warn日志 打印
     * @param data
     */


    logger$1.warn = function (data) {
      if (!data) {
        callback({
          errorCode: errorCode.LOG_MESSAGE_EMPTY
        });
        return false;
      }

      var jsonBody = {
        message: data
      };
      electronEvent.postMsgToWave(action.logWarn, jsonBody);
    };
    /**
     * warn日志 打印
     * @param data
     */


    logger$1.error = function (data) {
      if (!data) {
        callback({
          errorCode: errorCode.LOG_MESSAGE_EMPTY
        });
        return false;
      }

      var jsonBody = {
        message: data
      };
      electronEvent.postMsgToWave(action.logError, jsonBody);
    };

    /*
    用户配置信息存取
     */
    var userConfig = {};
    /**
     * 存用户信息
     * @param data {config:'配置信息'(json)}
     */

    userConfig.addUserConfig = function (data, callback) {
      if (!data || !data.userConfig) {
        callback({
          errorCode: errorCode.USER_CONFIG_EMPTY
        });
        return false;
      }

      var message = {
        userConfig: data.userConfig
      }; //更新内存中的配置

      electronEvent.updatePluginConfig(data);
      electronEvent.postMsgToWave(action.addUserConfig, message);
      callback({
        errorCode: errorCode.SUCCESS
      });
    };
    /**
     * 取用户信息
     * @param data {config:'配置信息'(json)}
     */


    userConfig.getUserConfig = function (callback) {
      // electronEvent.postMsgToWave(action.getUserConfig, message)
      var pluginInfo = electronEvent.getPluginInfo();

      if (pluginInfo.userConfig) {
        callback({
          errorCode: errorCode.SUCCESS,
          data: pluginInfo.userConfig
        });
        return false;
      } else {
        var pluginInfoJson = sessionStorage.getItem('plugin_info');

        if (pluginInfoJson) {
          try {
            var pluginInfoObject = JSON.parse(pluginInfoJson);

            if (pluginInfoObject && pluginInfoObject.userConfig) {
              callback({
                errorCode: errorCode.SUCCESS,
                data: pluginInfo.userConfig
              });
              return false;
            }
          } catch (e) {
            console.log('plugin parse json error');
          }
        }
      }

      callback({
        errorCode: errorCode.FAIL
      });
    };
    /**
     * 设置插件签名
     * @param data {signature:'签名字符串'}
     */


    userConfig.setPluginSignature = function (data) {
      if (!data || !data.signature) {
        console.error('plugin signature empty');
        return;
      }

      var message = {
        signature: data.signature
      };
      electronEvent.postMsgToWave(action.setPluginSignature, message);
    };

    /*
    窗口相关
     */
    var pluginWin = {};
    /**
     * 插件窗口隐藏
     */

    pluginWin.hideWindow = function () {
      electronEvent.postMsgToWave(action.hidePluginWin, {});
    };
    /**
     * 使用默认窗口并显示
     * @param data {width:'宽度',height:'高度',
     * winX:'窗口相对于屏幕左侧的偏移量(如果使用了Y,此必选)',winY:'窗口相对于屏幕顶端的偏移量(如果使用了X,此必选)',
     * center:'是否居中（与X,Y互斥）',show:'是否显示'}
     */


    pluginWin.setDefaultWindow = function (data) {
      electronEvent.postMsgToWave(action.setDefaultWindow, data);
    };
    /**
     * 使用Wave通知窗口并显示
     * @param data {notificationBody:'通知消息内容体(html节点)'}
     *
     */


    pluginWin.showNotificationWindow = function (data) {
      if (!data && !data.notificationBody) {
        return;
      }

      electronEvent.postMsgToWave(action.showNotificationMsg, data);
    };
    /**
     * 隐藏插件通知
     */


    pluginWin.hideNotificationWindow = function () {
      electronEvent.postMsgToWave(action.hideNotificationMsg, {});
    };

    /*
    * 暴露给上层的接口
    */
    var pluginSDK = {};
    pluginSDK.call = {};
    /**
     * 音频通话
     * @param data {callNumber:'呼叫号码'(String)}
     * @param callback
     */

    pluginSDK.call.makeP2PAudioCall = function (data, callback) {
      calls.makeP2PAudioCall(data, callback);
    };
    /**
     * 视频通话
     * @param data {callNumber:'呼叫号码'(String)}
     * @param callback
     */


    pluginSDK.call.makeP2PVideoCall = function (data, callback) {
      calls.makeP2PVideoCall(data, callback);
    };

    pluginSDK.log = {};
    /**
     * 打印错误日志
     * @param message:'日志'(String)
     */

    pluginSDK.log.error = function (message) {
      logger$1.error(message);
    };
    /**
     * 打印LOG日志
     * @param message:'日志'(String)
     */


    pluginSDK.log.log = function (message) {
      logger$1.log(message);
    };
    /**
     * 打印INFO日志
     * @param message:'日志'(String)
     */


    pluginSDK.log.info = function (message) {
      logger$1.info(message);
    };
    /**
     * 打印warn日志
     * @param message:'日志'(String)
     */


    pluginSDK.log.warn = function (message) {
      logger$1.warn(message);
    };
    /**
     * 关闭窗口
     */


    pluginSDK.hideWindow = function () {
      pluginWin.hideWindow();
    };
    /**
     * 使用默认窗口并显示
     * @param data {width:'宽度(int)',height:'高度(int)',
     * winX:'窗口相对于屏幕左侧的偏移量(如果使用了Y,此必选)(int)',winY:'窗口相对于屏幕顶端的偏移量(如果使用了X,此必选)(int)',
     * center:'是否居中true/false（与X,Y互斥）', show:'是否显示true/fase'}
     */


    pluginSDK.setDefaultWindow = function (data) {
      pluginWin.setDefaultWindow(data);
    };
    /**
     * 复用wave通知窗口并显示
     * @param data {notificationBody:'通知消息内容体(html节点)'}
     */


    pluginSDK.displayNotification = function (data) {
      pluginWin.showNotificationWindow(data);
    };
    /**
     * 隐藏插件通知窗口
     * @param data
     */


    pluginSDK.hideNotification = function () {
      pluginWin.hideNotificationWindow();
    };

    pluginSDK.userConfig = {};
    /**
     * 获取用户信息
     * @param callback
     */

    pluginSDK.userConfig.getUserConfig = function (callback) {
      userConfig.getUserConfig(callback);
    };
    /**
     * 存用户信息
     * @param data {userConfig:'配置信息'(json)}
     */


    pluginSDK.userConfig.addUserConfig = function (data, callback) {
      userConfig.addUserConfig(data, callback);
    };
    /**
     * 设置插件签名
     * @param data {signature:'签名字符串'}
     */


    pluginSDK.setPluginSignature = function (data) {
      userConfig.setPluginSignature(data);
    };
    /**
     * 事件绑定接口
     * imSDK.eventEmitter.on(eventName, handle)
     * 事件触发接口
     * imSDK.eventEmitter.trigger(eventName, data)
     * 事件解绑接口
     * imSDK.eventEmitter.off(eventName)
     * @param eventName: onError, recvMessage
     *   handle: callback function
     *   data: 传递给handle的数据
     * @param method: on, trigger, off, once
     *   绑定: imSDK.eventEmitter.on("onError", (obj) => {})
     *   触发: imSDK.eventEmitter.trigger("onError", obj),
     *   解绑: imSDK.eventEmitter.off("onError")
     */


    pluginSDK.eventEmitter = bindEvent;

    return pluginSDK;

})));
