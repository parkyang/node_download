define("common/ui/DateTime", ["plugin/jquery", "common/ui/Follow"], function($sanitize, dataAndEvents, deepDataAndEvents) {
  $sanitize("plugin/jquery");
  /** @type {string} */
  var selector = ($sanitize("common/ui/Follow"), "ui_date_");
  /** @type {string} */
  var val = "ui_range_";
  /** @type {string} */
  var value = "ui_day_";
  /** @type {string} */
  var bad = "ui_year_";
  /** @type {string} */
  var ui_month_ = "ui_month_";
  /** @type {string} */
  var expected = "ui_hour_";
  /** @type {string} */
  var id = "ui_minute_";
  /** @type {string} */
  var k = "selected";
  /** @type {string} */
  var activeClassName = "active";
  /** @type {RegExp} */
  var p = /\-|\//g;
  /**
   * @return {?}
   */
  String.prototype.toDate = function() {
    var time;
    var month;
    var gg;
    /** @type {Array.<string>} */
    var task = this.split(p);
    return time = 1 * task[0], month = task[1] || 1, gg = task[2] || 1, time ? new Date(time, month - 1, gg) : new Date;
  };
  /**
   * @return {?}
   */
  Date.prototype.toArray = function() {
    /** @type {number} */
    var y = this.getFullYear();
    /** @type {number} */
    var regexString = this.getMonth() + 1;
    /** @type {number} */
    var day = this.getDate();
    return 10 > regexString && (regexString = "0" + regexString), 10 > day && (day = "0" + day), [y, regexString, day];
  };
  /**
   * @param {Object} parent
   * @param {Object} values
   * @return {?}
   */
  var update = function(parent, values) {
    if (!parent || !parent.length) {
      return this;
    }
    var opts = {
      value : "",
      type : "auto",
      min : "auto",
      max : "auto",
      trigger : ["change"],
      onShow : $.noop,
      onHide : $.noop
    };
    var options = $.extend({}, opts, values || {});
    /** @type {null} */
    var input = null;
    if (parent.get(0).type ? (input = parent, parent = input.parent()) : input = parent.find("input"), 0 == input.length) {
      return this;
    }
    input.prop("readonly", true);
    input.parent().hover(function() {
      $(this).addClass("hover");
    }, function() {
      $(this).removeClass("hover");
    });
    var type = options.type;
    if ("auto" == type) {
      type = input.attr("type") || "date";
    }
    var index = input.attr("id");
    if (!index) {
      /** @type {string} */
      index = type + (Math.random() + "").replace("0.", "");
      input.attr("id", index);
    }
    $('<label for="' + index + '"></label>').addClass(selector + "arrow").insertAfter(input);
    var val = input.val();
    switch("" == val && (options.value && (input.val(options.value), val = options.value)), type) {
      case "date":
      ;
      case "year":
      ;
      case "month":
        var cursor = val.toDate();
        var v = cursor.toArray();
        if ("" == val) {
          if ("date" == type) {
            input.val(v.join("-"));
          } else {
            if ("year" == type) {
              input.val(v[0]);
            } else {
              if ("month" == type) {
                input.val(v.slice(0, 2).join("-"));
              }
            }
          }
        }
        this[k] = v;
        break;
      case "time":
      ;
      case "hour":
      ;
      case "minute":
        var dirs = val.split(":");
        var h = dirs[0];
        var dir = dirs[1];
        if ("" != val && (24 > h && h > 0)) {
          if (dir > 0 && (60 > dir && "hour" != type)) {
            if (1 == dir.length) {
              /** @type {string} */
              dir = "0" + dir;
            }
          } else {
            /** @type {string} */
            dir = "00";
          }
          if (1 == h.length) {
            /** @type {string} */
            h = "0" + h;
          }
        } else {
          /** @type {string} */
          h = "00";
          /** @type {string} */
          dir = "00";
        }
        input.val([h, dir].join(":"));
        /** @type {Array} */
        this[k] = [h, dir];
        break;
      case "date-range":
      ;
      case "month-range":
        /** @type {Date} */
        var result = new Date;
        /** @type {Date} */
        var x = new Date;
        var codeSegments = val.split(" ");
        if ("" != val && 1 == codeSegments.length) {
          var end = codeSegments[0].toDate();
          if (end.getTime() > result.getTime()) {
            x = end;
          } else {
            result = end;
          }
        } else {
          result = codeSegments[0].toDate();
          x = codeSegments[codeSegments.length - 1].toDate();
        }
        var word = result.toArray();
        var parts = x.toArray();
        if ("date-range" == type) {
          input.val(word.join("-") + " \u81f3 " + parts.join("-"));
        } else {
          input.val(word.slice(0, 2).join("-") + " \u81f3 " + parts.slice(0, 2).join("-"));
        }
        /** @type {Array} */
        this[k] = [word, parts];
    }
    var data = this;
    var element = $("<div></div>").addClass(selector + "container").delegate("a", "click", function() {
      /** @type {number} */
      var x = 0;
      /** @type {number} */
      var index = 0;
      /** @type {number} */
      var y = 0;
      /** @type {number} */
      var closeTag = 0;
      switch(element.attr("data-type")) {
        case "date":
          if (/prev|next/.test(this.className)) {
            index = $(this).attr("data-month");
            /** @type {number} */
            data[k][1] = 1 * index;
            var list = data._monthDay(data[k]);
            var touchHandler = data[k][2];
            var one_vw = element.data("dayOverflow");
            var olen = function() {
              return 0 > index - 1 ? list[11] : index > list.length ? list[0] : list[index - 1];
            }();
            if (one_vw) {
              /** @type {number} */
              data[k][2] = Math.min(one_vw, olen);
            } else {
              if (data[k][2] > olen) {
                data[k][2] = olen;
                element.data("dayOverflow", touchHandler);
              }
            }
            data[k] = data[k].join("-").toDate().toArray();
            data.date();
            if (element.find("." + k).get(0).href) {
              data.val();
            }
          } else {
            if (/item/.test(this.className)) {
              y = this.innerHTML;
              if (/\D/.test(y)) {
                data[k] = (new Date).toArray();
              } else {
                if (10 > y) {
                  /** @type {string} */
                  y = "0" + y;
                }
                data[k][2] = y;
              }
              data.val();
              data.hide();
              element.removeData("dayOverflow");
            } else {
              if ("month" == $(this).attr("data-type")) {
                data.month();
              }
            }
          }
          break;
        case "date-range":
          if (/prev|next/.test(this.className)) {
            /** @type {number} */
            index = 1 * $(this).attr("data-month");
            var deadlineStuff = data.el.container.data("date") || data[k][0];
            data.el.container.data("date", (new Date(deadlineStuff[0], index - 1, deadlineStuff[2] || 1)).toArray());
            data["date-range"]();
          } else {
            if (/item/.test(this.className)) {
              x = $(this).attr("data-year");
              index = $(this).attr("data-month");
              y = this.innerHTML;
              if (10 > index) {
                /** @type {string} */
                index = "0" + index;
              }
              if (10 > y) {
                /** @type {string} */
                y = "0" + y;
              }
              var v = data[k];
              if (v[0].join() == v[1].join()) {
                if (x + index + y > v[0].join("")) {
                  /** @type {Array} */
                  v[1] = [x, index, y];
                } else {
                  /** @type {Array} */
                  v[0] = [x, index, y];
                }
              } else {
                /** @type {Array} */
                v = [[x, index, y], [x, index, y]];
              }
              data[k] = v;
              data["date-range"]();
            } else {
              if (/button/.test(this.className)) {
                var type = $(this).attr("data-type");
                if ("ensure" == type) {
                  data.val();
                  data._rangeSelected = data[k];
                  data.hide();
                } else {
                  if ("cancel" == type) {
                    if (data._rangeSelected) {
                      data[k] = data._rangeSelected;
                    }
                    data.hide();
                  }
                }
              }
            }
          }
          break;
        case "month-range":
          if (/prev|next/.test(this.className)) {
            /** @type {number} */
            x = 1 * $(this).attr("data-year");
            deadlineStuff = data.el.container.data("date") || data[k][0];
            data.el.container.data("date", (new Date(x, deadlineStuff[1], 1)).toArray());
            data["month-range"]();
          } else {
            if (/item/.test(this.className)) {
              x = $(this).attr("data-year");
              index = $(this).attr("data-value");
              /** @type {string} */
              y = "01";
              v = data[k];
              if (v[0].join() == v[1].join()) {
                if (x + index + y > v[0].join("")) {
                  /** @type {Array} */
                  v[1] = [x, index, y];
                } else {
                  /** @type {Array} */
                  v[0] = [x, index, y];
                }
              } else {
                /** @type {Array} */
                v = [[x, index, y], [x, index, y]];
              }
              data[k] = v;
              data["month-range"]();
            } else {
              if (/button/.test(this.className)) {
                type = $(this).attr("data-type");
                if ("ensure" == type) {
                  data.val();
                  data._rangeSelected = data[k];
                  data.hide();
                } else {
                  if ("cancel" == type) {
                    if (data._rangeSelected) {
                      data[k] = data._rangeSelected;
                    }
                    data.hide();
                  }
                }
              }
            }
          }
          break;
        case "month":
          if (/prev|next/.test(this.className)) {
            x = $(this).attr("data-year");
            /** @type {number} */
            data[k][0] = 1 * x;
            data.month();
            if (element.find("." + k).get(0).href) {
              data.val();
            }
          } else {
            if (/item/.test(this.className)) {
              var val = $(this).attr("data-value");
              if (val) {
                data[k][1] = val;
              } else {
                var n = (new Date).toArray();
                data[k][0] = n[0];
                data[k][1] = n[1];
              }
              data.val();
              if ("month" == data.type) {
                data.hide();
              } else {
                data.date();
              }
            } else {
              if ("year" == $(this).attr("data-type")) {
                data.year();
              }
            }
          }
          break;
        case "year":
          if (/prev|next/.test(this.className)) {
            x = $(this).attr("data-year");
            /** @type {number} */
            data[k][0] = 1 * x;
            data.year();
            if (element.find("." + k).get(0).href) {
              data.val();
            }
          } else {
            if (/item/.test(this.className)) {
              if ("\u4eca\u5e74" == this.innerHTML) {
                /** @type {number} */
                data[k][0] = (new Date).getFullYear();
              } else {
                /** @type {number} */
                data[k][0] = 1 * this.innerHTML;
              }
              data.val();
              if ("year" == data.type) {
                data.hide();
              } else {
                data.month();
              }
            }
          }
          break;
        case "minute":
          if (/prev|next/.test(this.className)) {
            closeTag = $(this).attr("data-hour");
            if (1 == closeTag.length) {
              /** @type {string} */
              closeTag = "0" + closeTag;
            }
            data[k][0] = closeTag;
            data.minute();
            if (element.find("." + k).attr("href")) {
              data.val();
            }
          } else {
            if (/item/.test(this.className)) {
              data[k] = this.innerHTML.split(":");
              data.val();
              data.hide();
            } else {
              if ("hour" == $(this).attr("data-type")) {
                data.hour();
              }
            }
          }
          break;
        case "hour":
          if (/item/.test(this.className)) {
            data[k][0] = this.innerHTML.split(":")[0];
            data.val();
            if ("hour" == data.type) {
              data.hide();
            } else {
              data.minute();
            }
          }
        ;
      }
    });
    return this.el = {}, this.el.container = element, this.el.trigger = parent, this.el.input = input, this.type = type, this.max = options.max, this.min = options.min, this.callback = {
      show : options.onShow,
      hide : options.onHide,
      trigger : options.trigger
    }, parent.click($.proxy(function(types) {
      if (this.display) {
        this.hide();
      } else {
        this.show();
      }
      types.preventDefault();
    }, this)), $(document).mouseup($.proxy(function(b) {
      var bup = b && b.target;
      var adown = this.el.container.get(0);
      if (bup) {
        if (parent.get(0) != bup) {
          if (0 == parent.get(0).contains(bup)) {
            if (adown != bup) {
              if (0 == adown.contains(bup)) {
                this.hide();
              }
            }
          }
        }
      }
    }, this)), this.svg = window.addEventListener ? '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><path d="M85.876,100.5l49.537-50.526c4.089-4.215,4.089-11.049,0-15.262 c-4.089-4.218-10.719-4.218-14.808,0L63.586,92.868c-4.089,4.215-4.089,11.049,0,15.264l57.018,58.156 c4.089,4.215,10.719,4.215,14.808,0c4.089-4.215,4.089-11.049,0-15.262L85.876,100.5z"/></svg>' : "", this;
  };
  return update.prototype.format = function() {
    var type = this.type;
    var key = this.el.input.val();
    if ("" == key) {
      return this;
    }
    switch(type) {
      case "date":
      ;
      case "year":
      ;
      case "month":
        var cursor = key.toDate();
        var args = cursor.toArray();
        this[k] = args;
        break;
      case "time":
      ;
      case "hour":
      ;
      case "minute":
        var v = key.split(":");
        var pre = v[0];
        var v2 = v[1];
        if (2 == v.length) {
          if (v2 > 0 && (60 > v2 && "hour" != type)) {
            if (1 == v2.length) {
              /** @type {string} */
              v2 = "0" + v2;
            }
          } else {
            /** @type {string} */
            v2 = "00";
          }
          if (1 == pre.length) {
            /** @type {string} */
            pre = "0" + pre;
          }
          this.el.input.val([pre, v2].join(":"));
          /** @type {Array} */
          this[k] = [pre, v2];
        }
        break;
      case "date-range":
      ;
      case "month-range":
        /** @type {Date} */
        var x = new Date;
        /** @type {Date} */
        var cur = new Date;
        var codeSegments = key.split(" ");
        if (3 == codeSegments.length) {
          x = codeSegments[0].toDate();
          cur = codeSegments[codeSegments.length - 1].toDate();
          /** @type {Array} */
          this[k] = [x.toArray(), cur.toArray()];
        }
      ;
    }
    return this;
  }, update.prototype.val = function() {
    var el = this.el.input;
    var data = this[k];
    var c = el.val();
    switch(this.type) {
      case "date":
        el.val(data.join("-"));
        break;
      case "month":
        el.val(data.slice(0, 2).join("-"));
        break;
      case "year":
        el.val(data[0]);
        break;
      case "date-range":
        el.val(data[0].join("-") + " \u81f3 " + data[1].join("-"));
        break;
      case "month-range":
        el.val(data[0].slice(0, 2).join("-") + " \u81f3 " + data[1].slice(0, 2).join("-"));
        break;
      case "time":
      ;
      case "minute":
        el.val(data.join(":"));
        break;
      case "hour":
        el.val(data[0] + ":00");
    }
    return el.val() != c && ($.isArray(this.callback.trigger) ? $.each(this.callback.trigger, function(dataAndEvents, type) {
      el.trigger(type);
    }) : el.trigger(this.callback.trigger)), this;
  }, update.prototype._calendar = function(o) {
    /** @type {string} */
    var name = "";
    /** @type {Array} */
    var obj = o;
    var el = this.el.input;
    var type = this.type;
    var min = el.attr("min") || this.min;
    var max = el.attr("max") || this.max;
    var minMax = $.map([min, max], function(val, date) {
      return "string" == typeof val && 1 == /^\d{8}$/.test(val.replace(p, "")) ? val = val.toDate() : "object" == typeof val && val.getTime || (val = date ? new Date(9999, 0, 1) : new Date(0, 0, 1)), val;
    });
    min = minMax[0];
    max = minMax[1];
    /** @type {Array} */
    var which = ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d"];
    var keys = this._monthDay(obj);
    var result = obj.join("-").toDate();
    /** @type {string} */
    name = name + '<div class="' + value + 'x">' + function() {
      /** @type {string} */
      var name = "";
      return $.each(which, function(deepDataAndEvents, dataAndEvents) {
        /** @type {string} */
        name = name + '<span class="' + value + 'item">' + dataAndEvents + "</span>";
      }), name;
    }() + "</div>";
    var iterDate = obj.join("-").toDate();
    /** @type {number} */
    var size = 0;
    iterDate.setDate(1);
    if (2 == iterDate.getDate()) {
      iterDate.setDate(0);
    }
    size = iterDate.getDay();
    /** @type {number} */
    var zIndex = iterDate.getMonth() - 1;
    if (0 > zIndex) {
      /** @type {number} */
      zIndex = 11;
    }
    /** @type {string} */
    var results = 'data-year="' + obj[0] + '" data-month="' + (iterDate.getMonth() + 1) + '"';
    return name = name + '<div class="' + selector + 'body">' + function() {
      /** @type {string} */
      var label = "";
      /** @type {string} */
      var str = "";
      /** @type {number} */
      var multiple = 0;
      for (;6 > multiple;multiple++) {
        /** @type {string} */
        label = label + '<div class="' + selector + 'tr">';
        /** @type {number} */
        var i = 0;
        for (;7 > i;i++) {
          if (str = selector + "item col" + i, "date" == type) {
            if (0 == multiple && size > i) {
              /** @type {string} */
              label = label + '<span class="' + str + '">' + (keys[zIndex] - size + i + 1) + "</span>";
            } else {
              /** @type {number} */
              var day = 7 * multiple + i - size + 1;
              if (day <= keys[iterDate.getMonth()]) {
                /** @type {Date} */
                var newDate = new Date(obj[0], iterDate.getMonth(), day);
                if (result.getDate() == day) {
                  /** @type {string} */
                  str = str + " " + k;
                }
                /** @type {string} */
                label = newDate >= min && max >= newDate ? label + '<a href="javascript:;" ' + results + ' class="' + str + '">' + day + "</a>" : label + '<span class="' + str + '">' + day + "</span>";
              } else {
                /** @type {string} */
                label = label + '<span class="' + str + '">' + (day - keys[iterDate.getMonth()]) + "</span>";
              }
            }
          } else {
            if ("date-range" == type) {
              if (0 == multiple && size > i) {
                /** @type {string} */
                label = label + '<span class="' + str + '">&nbsp;</span>';
              } else {
                /** @type {number} */
                day = 7 * multiple + i - size + 1;
                if (day <= keys[iterDate.getMonth()]) {
                  /** @type {Date} */
                  newDate = new Date(obj[0], iterDate.getMonth(), day);
                  var expected = this[k][0].join("-").toDate();
                  var defaultCenturyStart = this[k][1].join("-").toDate();
                  /** @type {number} */
                  var a = newDate.getTime();
                  var b = expected.getTime();
                  var c = defaultCenturyStart.getTime();
                  if (a >= b) {
                    if (c >= a) {
                      /** @type {string} */
                      str = str + " " + k;
                      if (a == b) {
                        /** @type {string} */
                        str = str + " " + selector + "begin";
                      }
                      if (a == c) {
                        /** @type {string} */
                        str = str + " " + selector + "end";
                      }
                      if (1 == day) {
                        /** @type {string} */
                        str = str + " " + selector + "first";
                      } else {
                        if (day == keys[iterDate.getMonth()]) {
                          /** @type {string} */
                          str = str + " " + selector + "last";
                        }
                      }
                    }
                  }
                  /** @type {string} */
                  label = newDate >= min && max >= newDate ? label + '<a href="javascript:;" ' + results + ' class="' + str + '">' + day + "</a>" : label + '<span class="' + str + '">' + day + "</span>";
                } else {
                  /** @type {string} */
                  label = label + '<span class="' + str + '">&nbsp;</span>';
                }
              }
            }
          }
        }
        label += "</div>";
      }
      return label;
    }.call(this) + "</div>", {
      monthDay : keys,
      html : name,
      min : min,
      max : max
    };
  }, update.prototype._monthDay = function(iterable) {
    /** @type {Array} */
    var result = iterable;
    if (0 == $.isArray(iterable)) {
      result = iterable.toArray();
    }
    /** @type {Array} */
    var c = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return(result[0] % 4 == 0 && result[0] % 100 != 0 || result[0] % 400 == 0) && (c[1] = 29), c;
  }, update.prototype._datePrevMonth = function(iterable) {
    /** @type {Array} */
    var iterators = iterable;
    if (0 == $.isArray(iterable)) {
      iterators = iterable.toArray();
    }
    /** @type {number} */
    var started = 1 * iterators[1];
    var arr = this._monthDay(iterators);
    return 1 == started ? [iterators[0] - 1, 12, iterators[2]].join("-").toDate() : arr[started - 2] < iterators[2] ? [iterators[0], started - 1, arr[started - 2]].join("-").toDate() : [iterators[0], started - 1, iterators[2]].join("-").toDate();
  }, update.prototype._dateNextMonth = function(iterable) {
    /** @type {Array} */
    var iterators = iterable;
    if (0 == $.isArray(iterable)) {
      iterators = iterable.toArray();
    }
    /** @type {number} */
    var ct = 1 * iterators[1];
    var arr = this._monthDay(iterators);
    return 12 == ct ? [iterators[0] + 1, 1, iterators[2]].join("-").toDate() : arr[ct] < iterators[2] ? [iterators[0], ct + 1, arr[ct]].join("-").toDate() : [iterators[0], ct + 1, iterators[2]].join("-").toDate();
  }, update.prototype.date = function() {
    var p = this[k];
    /** @type {number} */
    var b = (p.join("-").toDate(), p[1] - 1);
    /** @type {number} */
    nextMonth = 1 * p[1] + 1;
    var options = this._calendar(p);
    /** @type {string} */
    var str = '<div class="' + selector + 'x">';
    /** @type {string} */
    str = str + '<div class="' + selector + 'head">';
    var start = this._datePrevMonth(p);
    var month = start.getMonth();
    var year = start.getFullYear();
    /** @type {string} */
    str = new Date(year, month, options.monthDay[month]) >= options.min && start <= options.max ? str + '<a href="javascript:" class="' + selector + 'prev" data-month="' + b + '">' + this.svg + "</a>" : str + '<span class="' + selector + 'prev">' + this.svg + "</span>";
    var end = this._dateNextMonth(p);
    var M = end.getMonth();
    var s = end.getFullYear();
    return str = end >= options.min && new Date(s, M, 1) <= options.max ? str + '<a href="javascript:" class="' + selector + 'next" data-month="' + nextMonth + '">' + this.svg + "</a>" : str + '<span class="' + selector + 'next">' + this.svg + "</span>", str = str + '<a href="javascript:" class="' + selector + 'switch" data-type="month">' + p.slice(0, 2).join("-") + "</a>\t\t</div>", str += options.html, str = new Date >= options.min && new Date <= options.max ? str + '<a href="javascript:" class="' +
    selector + "item " + selector + 'now">\u4eca\u5929</a>' : str + '<span class="' + selector + "item " + selector + 'now">\u4eca\u5929</span>', str += "</div>", this.el.container.attr("data-type", "date").html(str), this;
  }, update.prototype["date-range"] = function() {
    var cs = this[k];
    var d = this.el.container.data("date") || cs[0];
    this.el.container.data("date", d);
    /** @type {number} */
    var i = d[1] - 1;
    /** @type {number} */
    var month = 1 * d[1] + 1;
    var data = this._calendar(d);
    /** @type {string} */
    var name = '<div class="' + val + 'x">';
    /** @type {string} */
    name = name + '<div class="' + selector + 'head">\t\t\t<div class="' + selector + 'half">';
    /** @type {Date} */
    var pos = new Date(d[0], i, d[2]);
    /** @type {string} */
    name = pos >= data.min && pos <= data.max ? name + '<a href="javascript:" class="' + selector + 'prev" data-month="' + i + '">' + this.svg + "</a>" : name + '<span class="' + selector + 'prev">' + this.svg + "</span>";
    /** @type {string} */
    name = name + '<span class="' + selector + 'switch">' + (new Date(d[0], i, d[2])).toArray().slice(0, 2).join("-") + '</span>\t\t</div>\t\t<div class="' + selector + 'half">';
    /** @type {Date} */
    var x = new Date(d[0], d[1], 1);
    /** @type {Date} */
    var day = new Date(d[0], month, d[2]);
    return name = day > data.min - 1 && day <= data.max ? name + '<a href="javascript:" class="' + selector + 'next" data-month="' + month + '">' + this.svg + "</a>" : name + '<span class="' + selector + 'next">' + this.svg + "</span>", name = name + '<span class="' + selector + 'switch">' + x.toArray().slice(0, 2).join("-") + "</span>\t\t</div>", name += "</div>", name = name + '<div class="' + val + 'body"><div class="' + selector + 'half">' + data.html + '</div><div class="' + selector + 'half">' +
    this._calendar(x.toArray()).html + "</div></div>", name = name + '<div class="' + val + 'footer"><a href="javascript:;" class="ui_button ui_button_primary" data-type="ensure">\u786e\u5b9a</a><a href="javascript:;" class="ui_button" data-type="cancel">\u53d6\u6d88</a></div>', name += "</div>", this.el.container.attr("data-type", "date-range").html(name), this;
  }, update.prototype._month = function(keepActiveItem) {
    var el = this.el.input;
    var min = el.attr("min") || this.min;
    var max = el.attr("max") || this.max;
    var minMax = $.map([min, max], function(arg, dataAndEvents) {
      return arg = "object" == typeof arg && arg.getTime ? arg.toArray().slice(0, 2).join("") : "string" == typeof arg && 0 == /\D/.test(arg.replace(p, "")) ? arg.replace(p, "").slice(0, 6) : dataAndEvents ? "999912" : "000000";
    });
    min = minMax[0];
    max = minMax[1];
    /** @type {Array} */
    var tokens = ["\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341", "\u5341\u4e00", "\u5341\u4e8c"];
    /** @type {number} */
    var val = 1 * keepActiveItem[0];
    var type = this.type;
    /** @type {string} */
    var blockHTML = '<div class="' + ui_month_ + 'body">' + function() {
      /** @type {string} */
      var msg = "";
      /** @type {string} */
      var id = "";
      /** @type {string} */
      var threshold = "";
      /** @type {number} */
      var i = 1;
      for (;12 >= i;i += 1) {
        if (threshold = 10 > i ? "0" + i : i + "", id = selector + "item", "month" == type) {
          if (i == keepActiveItem[1]) {
            /** @type {string} */
            id = id + " " + k;
          }
        } else {
          if ("month-range" == type) {
            var segs = this[k][0].slice(0, 2).join("");
            var hashIndex = this[k][1].slice(0, 2).join("");
            /** @type {string} */
            var file = val + threshold;
            if (file >= segs) {
              if (hashIndex >= file) {
                /** @type {string} */
                id = id + " " + k;
              }
            }
          }
        }
        /** @type {string} */
        msg = val + threshold >= min && max >= val + threshold ? msg + '<a href="javascript:" class="' + id + '" data-year="' + val + '" data-value="' + threshold + '">' + tokens[i - 1] + "\u6708</a>" : msg + '<span class="' + id + '" data-value="' + threshold + '">' + tokens[i - 1] + "\u6708</span>";
      }
      return msg;
    }.call(this) + "</div>";
    return{
      html : blockHTML,
      min : min,
      max : max
    };
  }, update.prototype.month = function() {
    var item = this[k];
    var v = this._month(item);
    var max = v.min;
    var h = v.max;
    /** @type {string} */
    var text = '<div class="' + ui_month_ + 'x">';
    /** @type {number} */
    var g = 1 * item[0];
    /** @type {string} */
    text = text + '<div class="' + selector + 'head">';
    /** @type {string} */
    text = g - 1 >= Math.floor(max / 100) && g - 1 <= Math.floor(h / 100) ? text + '<a href="javascript:" class="' + selector + 'prev" data-year="' + (g - 1) + '">' + this.svg + "</a>" : text + '<span class="' + selector + 'prev">' + this.svg + "</span>";
    /** @type {string} */
    text = g + 1 >= Math.floor(max / 100) && g + 1 <= Math.floor(h / 100) ? text + '<a href="javascript:" class="' + selector + 'next" data-year="' + (g + 1) + '">' + this.svg + "</a>" : text + '<span class="' + selector + 'next">' + this.svg + "</span>";
    /** @type {string} */
    text = text + '<a href="javascript:" class="' + selector + 'switch" data-type="year">' + g + "</a>\t\t</div>";
    text += v.html;
    var l = (new Date).toArray().slice(0, 2).join("");
    return text = l >= max && h >= l ? text + '<a href="javascript:" class="' + selector + "item " + selector + 'now">\u4eca\u6708</a>' : text + '<span class="' + selector + "item " + selector + 'now">\u4eca\u6708</span>', text += "</div>", this.el.container.attr("data-type", "month").html(text), this;
  }, update.prototype["month-range"] = function() {
    var cs = this[k];
    var item = this.el.container.data("date") || cs[0];
    this.el.container.data("date", item);
    /** @type {number} */
    var l = 1 * item[0] - 1;
    /** @type {number} */
    var maxh = 1 * item[0] + 1;
    var values = this._month(item);
    var h = values.max.slice(0, 4);
    var g = values.min.slice(0, 4);
    /** @type {string} */
    var name = '<div class="' + val + 'x">';
    return name = name + '<div class="' + selector + 'head">\t\t\t<div class="' + selector + 'half">', name = l >= g && h >= l ? name + '<a href="javascript:" class="' + selector + 'prev" data-year="' + l + '">' + this.svg + "</a>" : name + '<span class="' + selector + 'prev">' + this.svg + "</span>", name = name + '<span class="' + selector + 'switch">' + item[0] + '</span>\t\t</div>\t\t<div class="' + selector + 'half">', name = maxh >= g && h > maxh ? name + '<a href="javascript:" class="' + selector +
    'next" data-year="' + maxh + '">' + this.svg + "</a>" : name + '<span class="' + selector + 'next">' + this.svg + "</span>", name = name + '<span class="' + selector + 'switch">' + maxh + "</span>\t\t</div>", name += "</div>", name = name + '<div class="' + val + 'body"><div class="' + selector + 'half">' + values.html + '</div><div class="' + selector + 'half">' + this._month([maxh, item[1], item[2]]).html + "</div></div>", name = name + '<div class="' + val + 'footer"><a href="javascript:;" class="ui_button ui_button_primary" data-type="ensure">\u786e\u5b9a</a><a href="javascript:;" class="ui_button" data-type="cancel">\u53d6\u6d88</a></div>',
    name += "</div>", this.el.container.attr("data-type", "month-range").html(name), this;
  }, update.prototype.year = function() {
    var input = this[k];
    var el = this.el.input;
    var val = el.attr("min") || this.min;
    var data = el.attr("max") || this.max;
    val = "object" == typeof val && val.getFullYear ? val.getFullYear() : "string" == typeof val && 0 == /\D/.test(val.replace(p, "")) ? val.toDate().getFullYear() : 0;
    data = "object" == typeof data && data.getFullYear ? data.getFullYear() : "string" == typeof data && 0 == /\D/.test(data.replace(p, "")) ? data.toDate().getFullYear() : 9999;
    /** @type {string} */
    var name = '<div class="' + bad + 'x">';
    var min = input[0];
    /** @type {string} */
    name = name + '<div class="' + selector + 'head">';
    /** @type {string} */
    name = min - 12 >= val && data >= min - 12 ? name + '<a href="javascript:" class="' + selector + 'prev" data-year="' + (min - 12) + '">' + this.svg + "</a>" : name + '<span class="' + selector + 'prev">' + this.svg + "</span>";
    /** @type {string} */
    name = min + 12 >= val && data >= min + 12 ? name + '<a href="javascript:" class="' + selector + 'next" data-year="' + (min + 12) + '">' + this.svg + "</a>" : name + '<span class="' + selector + 'next">' + this.svg + "</span>";
    /** @type {string} */
    name = name + '<span class="' + selector + 'switch">' + [min - 6, min + 5].join("-") + "</span></div>";
    /** @type {string} */
    name = name + '<div class="' + bad + 'body">' + function() {
      /** @type {string} */
      var msg = "";
      /** @type {string} */
      var id = "";
      /** @type {number} */
      var max = min - 6;
      for (;min + 6 > max;max += 1) {
        /** @type {string} */
        id = selector + "item";
        if (max == min) {
          /** @type {string} */
          id = id + " " + k;
        }
        /** @type {string} */
        msg = max >= val && data >= max ? msg + '<a href="javascript:" class="' + id + '">' + max + "</a>" : msg + '<span class="' + id + '">' + max + "</span>";
      }
      return msg;
    }() + "</div>";
    /** @type {number} */
    var max = (new Date).getFullYear();
    return name = max >= val && data >= max ? name + '<a href="javascript:" class="' + selector + "item " + selector + 'now">\u4eca\u5e74</a>' : name + '<span class="' + selector + "item " + selector + 'now">\u4eca\u5e74</span>', name += "</div>", name += "</div>", this.el.container.attr("data-type", "year").html(name), this;
  }, update.prototype.hour = function() {
    var cs = this[k];
    var el = this.el.input;
    /** @type {number} */
    var diff = 1 * el.attr("step");
    /** @type {number} */
    diff = "hour" != this.type || (!diff || 1 > diff) ? 1 : Math.round(diff);
    var g = (el.attr("min") || this.min.toString()).split(":")[0];
    var h = (el.attr("max") || this.max.toString()).split(":")[0];
    /** @type {number} */
    g = /\D/.test(g) ? 0 : 1 * g;
    /** @type {number} */
    h = /\D/.test(h) ? 24 : 1 * h;
    /** @type {string} */
    var label = '<div class="' + expected + 'x">';
    return label = label + '<div class="' + expected + 'body">' + function() {
      /** @type {string} */
      var msg = "";
      /** @type {string} */
      var l = "";
      /** @type {string} */
      var id = "";
      /** @type {number} */
      var i = 0;
      for (;24 > i;i += diff) {
        /** @type {string} */
        l = i + "";
        if (1 == l.length) {
          /** @type {string} */
          l = "0" + l;
        }
        /** @type {string} */
        id = selector + "item";
        if (l == cs[0]) {
          /** @type {string} */
          id = id + " " + k;
        }
        /** @type {string} */
        msg = l >= g && h >= l ? msg + '<a href="javascript:" class="' + id + '">' + l + ":00</a>" : msg + '<span class="' + id + '">' + l + ":00</span>";
      }
      return msg;
    }() + "</div>", label += "</div>", this.el.container.attr("data-type", "hour").html(label), this;
  }, update.prototype.minute = function() {
    var v = this[k];
    var el = this.el.input;
    /** @type {number} */
    var chunk = 1 * el.attr("step") || 5;
    var rest = el.attr("min") || this.min + "";
    var tmp = el.attr("max") || this.max + "";
    /** @type {number} */
    rest = "auto" == rest || (/\D/.test(rest.replace(":", "")) || 2 != rest.split(":").length) ? 0 : 1 * rest.replace(":", "");
    /** @type {number} */
    tmp = "auto" == tmp || (/\D/.test(tmp.replace(":", "")) || 2 != tmp.split(":").length) ? 2359 : 1 * tmp.replace(":", "");
    /** @type {string} */
    var msg = '<div class="' + id + 'x">';
    /** @type {number} */
    var h = 1 * v[0];
    return msg = msg + '<div class="' + selector + 'head">', msg = h <= Math.floor(rest / 100) ? msg + '<span class="' + selector + 'prev">' + this.svg + "</span>" : msg + '<a href="javascript:" class="' + selector + 'prev" data-hour="' + (h - 1) + '">' + this.svg + "</a>", msg = h >= Math.floor(tmp / 100) ? msg + '<span class="' + selector + 'next">' + this.svg + "</span>" : msg + '<a href="javascript:" class="' + selector + 'next" data-hour="' + (h + 1) + '">' + this.svg + "</a>", msg = msg + '<a href="javascript:" class="' +
    selector + 'switch" data-type="hour">' + v[0] + ":00</a></div>", msg = msg + '<div class="' + id + 'body">' + function() {
      /** @type {string} */
      var msg = "";
      /** @type {string} */
      var s = "";
      /** @type {string} */
      var id = "";
      /** @type {number} */
      var d = 0;
      for (;60 > d;d += chunk) {
        /** @type {string} */
        s = d + "";
        if (1 == s.length) {
          /** @type {string} */
          s = "0" + s;
        }
        /** @type {string} */
        id = selector + "item";
        if (1 * (v[0] + s) >= rest && 1 * (v[0] + s) <= tmp) {
          if (s == v[1]) {
            /** @type {string} */
            id = id + " " + k;
          }
          /** @type {string} */
          msg = msg + '<a href="javascript:" class="' + id + '">' + [v[0], s].join(":") + "</a>";
        } else {
          /** @type {string} */
          msg = msg + '<span class="' + id + '">' + [v[0], s].join(":") + "</span>";
        }
      }
      return msg;
    }() + "</div>", msg += "</div>", this.el.container.attr("data-type", "minute").html(msg), this;
  }, update.prototype.show = function() {
    var el = this.el.container;
    return this.format(), "time" == this.type ? this.minute() : "date-range" == this.type ? (this._rangeSelected || (this._rangeSelected = this[k]), this["date-range"]()) : "month-range" == this.type ? (this._rangeSelected || (this._rangeSelected = this[k]), this["month-range"]()) : this[this.type] ? this[this.type]() : this.date(), 0 == $.contains($(document.body), el) && $(document.body).append(el), el.show().follow(this.el.trigger.addClass(activeClassName), {
      position : "4-1"
    }), $.isFunction(this.callback.show) && this.callback.show.call(this, this.el.input, el), this.display = true, this;
  }, update.prototype.hide = function() {
    return this.el.container.hide(), this.el.trigger.removeClass(activeClassName), $.isFunction(this.callback.hide) && this.callback.hide.call(this, this.el.input, this.el.container), this.display = false, this;
  }, $.fn.dateTime = function(options) {
    return $(this).each(function() {
      $(this).data("dateTime", new update($(this), options));
    });
  }, update;
});
