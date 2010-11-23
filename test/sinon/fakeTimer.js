/*jslint indent: 2, eqeqeq: false, plusplus: false, evil: true, onevar: false, browser: true*/
/*global sinon, module, require*/
/**
 * Fake timer API
 * setTimeout
 * setInterval
 * clearTimeout
 * clearInterval
 * tick
 * reset
 * Date
 *
 * Inspired by jsUnitMockTimeOut from JsUnit
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010 Christian Johansen
 */
if (typeof sinon == "undefined") {
  this.sinon = {};
}

sinon.clock = (function () {
  var id = 0;

  function addTimer(args, recurring) {
    if (args.length === 0) {
      throw new Error("Function requires at least 1 parameter");
    }

    var toId = id++;
    var delay = args[1] || 0;

    if (!this.timeouts) {
      this.timeouts = {};
    }

    this.timeouts[toId] = {
      id: toId,
      func: args[0],
      callAt: this.now + delay
    };

    if (recurring === true) {
      this.timeouts[toId].interval = delay;
    }

    return toId;
  }

  function timersInRange(timeouts, from, to) {
    var timers = [], timer;

    for (var prop in timeouts) {
      if (timeouts.hasOwnProperty(prop)) {
        timer = timeouts[prop];

        if (timer.callAt >= from && timer.callAt <= to) {
          timers.push(timer);
        }
      }
    }

    return timers;
  }

  function callbacksInRange(timeouts, from, to) {
    var found, timer, tmp, i, l, timers = [], timeoutsCopy = {};

    for (var prop in timeouts) {
      timeoutsCopy[prop] = timeouts[prop];
    }

    while (timeoutsCopy && found !== 0) {
      found = 0;
      tmp = timersInRange(timeoutsCopy, from, to);

      for (i = 0, l = tmp.length; i < l; i++) {
        timer = tmp[i];

        // Push a copy onto the call stack
        timers.push({
          func: timer.func,
          callAt: timer.callAt,
          interval: timer.interval,
          id: timer.id
        });

        if (typeof timer.interval == "number") {
          found += 1;
          timer.callAt += timer.interval;
        } else {
          delete timeoutsCopy[timer.id];
        }
      }
    }

    return timers;
  }

  function parseTime(str) {
    if (!str) {
      return 0;
    }

    var strings = str.split(":");
    var l = strings.length, i = l;
    var ms = 0, parsed;

    if (l > 3 || !/^(\d\d:){0,2}\d\d?$/.test(str)) {
      throw new Error("tick only understands numbers and 'h:m:s'");
    }

    while (i--) {
      parsed = parseInt(strings[i], 10);

      if (parsed >= 60) {
        throw new Error("Invalid time " + str);
      }

      ms += parsed * Math.pow(60, (l - i - 1));
    }

    return ms * 1000;
  }

  function createObject(object) {
    var newObject;

    if (Object.create) {
      newObject = Object.create(object);
    } else {
      var F = function () {};
      F.prototype = object;
      newObject = new F();
    }

    newObject.Date.clock = newObject;
    return newObject;
  }

  return {
    now: 0,

    create: function create(now) {
      var clock = createObject(this);

      if (typeof now == "number") {
        this.now = now;
      }

      return clock;
    },

    setTimeout: function setTimeout(callback, timeout) {
      return addTimer.call(this, arguments, false);
    },

    clearTimeout: function clearTimeout(id) {
      if (!this.timeouts) {
        this.timeouts = [];
      }

      delete this.timeouts[id];
    },

    setInterval: function setInterval(callback, timeout) {
      return addTimer.call(this, arguments, true);
    },

    clearInterval: function clearInterval(id) {
      this.clearTimeout(id);
    },

    tick: function tick(ms) {
      ms = typeof ms == "number" ? ms : parseTime(ms);
      var tickFrom = this.now, tickTo = this.now + ms;

      var timers = callbacksInRange(this.timeouts, tickFrom, tickTo).sort(function (a, b) {
        return a.callAt < b.callAt ? -1 : (a.callAt > b.callAt ? 1 : 0);
      });

      for (i = 0, l = timers.length; i < l; i++) {
        timer = timers[i];

        if (!this.timeouts[timer.id]) {
          continue;
        }

        this.now = timer.callAt;

        try {
          if (typeof timer.func == "function") {
            timer.func.call(null);
          } else {
            eval(timer.func);
          }
        } catch (e) {}
      }

      timers = null;
      this.now = tickTo;
    },

    reset: function reset() {
      this.timeouts = {};
    },

    Date: (function () {
      var NativeDate = Date;

      function ClockDate(year, month, date, hour, minute, second, ms) {
        // Defensive and verbose to avoid potential harm in passing
        // explicit undefined when user does not pass argument
        switch (arguments.length) {
        case 0:
          return new NativeDate(ClockDate.clock.now);
        case 1:
          return new NativeDate(year);
        case 2:
          return new NativeDate(year, month);
        case 3:
          return new NativeDate(year, month, date);
        case 4:
          return new NativeDate(year, month, date, hour);
        case 5:
          return new NativeDate(year, month, date, hour, minute);
        case 6:
          return new NativeDate(year, month, date, hour, minute, second);
        default:
          return new NativeDate(year, month, date, hour, minute, second, ms);
        }
      }

      if (NativeDate.now) {
        ClockDate.now = function now() {
          return ClockDate.clock.now;
        };
      }

      if (NativeDate.toSource) {
        ClockDate.toSource = function toSource() {
          return NativeDate.toSource();
        };
      }

      ClockDate.toString = function toString() {
        return NativeDate.toString();
      };

      ClockDate.prototype = NativeDate.prototype;
      ClockDate.parse = NativeDate.parse;
      ClockDate.UTC = NativeDate.UTC;

      return ClockDate;
    }())
  };
}());

sinon.timers = {
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  Date: Date
};

sinon.useFakeTimers = (function () {
  var global = this;
  var methods = ["Date", "setTimeout", "setInterval", "clearTimeout", "clearInterval"];

  function restore() {
    var method;

    for (var i = 0, l = this.methods.length; i < l; i++) {
      method = this.methods[i];
      global[method] = this["_" + method];
    }
  }

  function stubGlobal(method, clock) {
    clock["_" + method] = global[method];

    global[method] = function () {
      return clock[method].apply(clock, arguments);
    };

    global[method].clock = clock;
  }

  return function useFakeTimers(now) {
    var clock = sinon.clock.create(now);
    clock.restore = restore;
    clock.methods = Array.prototype.slice.call(arguments,
                                               typeof now == "number" ? 1 : 0);

    if (clock.methods.length === 0) {
      clock.methods = methods;
    }

    for (var i = 0, l = clock.methods.length; i < l; i++) {
      stubGlobal(clock.methods[i], clock);
    }

    return clock;
  };
}());

if (typeof module == "object" && typeof require == "function") {
  module.exports = sinon;
}