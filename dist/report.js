(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.ROReport = factory());
}(this, function () { 'use strict';

  // Copyright Joyent, Inc. and other Node contributors.
  var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
  };
  function stringifyPrimitive(v) {
    switch (typeof v) {
      case 'string':
        return v;

      case 'boolean':
        return v ? 'true' : 'false';

      case 'number':
        return isFinite(v) ? v : '';

      default:
        return '';
    }
  }

  function stringify (obj, sep, eq, name) {
    sep = sep || '&';
    eq = eq || '=';
    if (obj === null) {
      obj = undefined;
    }

    if (typeof obj === 'object') {
      return map(objectKeys(obj), function(k) {
        var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
        if (isArray(obj[k])) {
          return map(obj[k], function(v) {
            return ks + encodeURIComponent(stringifyPrimitive(v));
          }).join(sep);
        } else {
          return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
        }
      }).join(sep);

    }

    if (!name) return '';
    return encodeURIComponent(stringifyPrimitive(name)) + eq +
           encodeURIComponent(stringifyPrimitive(obj));
  }
  function map (xs, f) {
    if (xs.map) return xs.map(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
      res.push(f(xs[i], i));
    }
    return res;
  }

  var objectKeys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
  };

  var alphabet = 'abcdefghijklmnopqrstuvwxyz';
  function get(key) {
      if (window.localStorage) {
          return localStorage.getItem(key);
      }
      else {
          var match = document.cookie.match(new RegExp("(?:^|;\\s)" + key + "=(.*?)(?:;\\s|$)"));
          return match && match.length >= 2 ? match[1] : '';
      }
  }
  function set(key, value, expire) {
      // 这里为什么需要try..catch..
      if (window.localStorage)
          try {
              expire ? localStorage.setItem(key, value) : sessionStorage.setItem(key, value);
          }
          catch (h) { }
      else {
          var d = window.location.host, f = { "com.cn": 1, "js.cn": 1, "net.cn": 1, "gov.cn": 1, "com.hk": 1, "co.nz": 1 }, g = d.split(".");
          2 < g.length && (d = (f[g.slice(-2).join(".")] ? g.slice(-3) : g.slice(-2)).join("."));
          document.cookie =
              key + "=" + value + ";path=/;domain=" + d + (expire ? ";expires=" + expire : "");
      }
  }
  function randomString(len, src) {
      if (src === void 0) { src = alphabet; }
      var result = '';
      for (var i = 0; i < len; i++) {
          result += src[Math.floor(Math.random() * src.length)];
      }
      return result;
  }
  var ROReport = /** @class */ (function () {
      function ROReport() {
          /** 配置 */
          this.options = {
              reportUser: false,
              reportDevice: false,
              reportDeviceOn: 'manual',
          };
          /** 用户数据 */
          this.userContext = {};
          /** 设备信息 */
          this.deviceInfo = {};
      }
      ROReport.prototype.init = function () {
          var userContext = this.userContext;
          userContext.anonymousId = get('ro_report_anonymous_id');
          userContext.id = get('ro_report_user_id');
          if (!userContext.anonymousId && !userContext.id) {
              var anonymousId = randomString(5) + (new Date()).valueOf();
              set('ro_report_anonymous_id', anonymousId, "Sun, 18 Jan 2038 00:00:00 GMT;");
              userContext.anonymousId = anonymousId;
          }
          if (this.options.reportDevice) {
              this.setDeviceInfo('width', '' + window.innerWidth);
          }
      };
      /** 补充用户信息 */
      ROReport.prototype.setUserContext = function (userContext) {
          var keys = Object.keys(userContext);
          for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              this.userContext[key] = userContext[key];
          }
      };
      /** 记录设备信息 */
      ROReport.prototype.setDeviceInfo = function (key, value) {
          this.deviceInfo[key] = value;
      };
      /**
       * 数据上报
       */
      ROReport.prototype.report = function (data) {
          if (!this.options.url) {
              return;
          }
          data.uid = this.options.reportUser && this.userContext.id ? this.userContext.id : this.userContext.anonymousId;
          var img = new Image();
          img.src = this.options.url + '?' + stringify(data);
      };
      /**
       * 上报设备信息
       */
      ROReport.prototype.reportDevice = function () {
          this.report(this.deviceInfo);
      };
      /**
       * 针对lib-flexible fontSize
       */
      ROReport.prototype.installLibFlexibleFontSizeReport = function () {
          var self = this;
          var rem = null;
          var lib = {
              flexible: {
                  rem: null,
              },
          };
          Object.defineProperty(lib.flexible, 'rem', {
              get: function () {
                  return rem;
              },
              set: function (val) {
                  self.setDeviceInfo('fontSize', val);
                  rem = val;
              },
          });
          window.lib = lib;
      };
      return ROReport;
  }());

  return ROReport;

}));
