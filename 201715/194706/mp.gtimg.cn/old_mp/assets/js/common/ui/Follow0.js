define("common/ui/Follow", ["plugin/jquery"], function($sanitize, dataAndEvents, deepDataAndEvents) {
  $sanitize("plugin/jquery");
  /**
   * @param {Object} pointer
   * @param {Object} opts
   * @return {?}
   */
  $.fn.follow = function(pointer, opts) {
    var args = {
      offsets : {
        x : 0,
        y : 0
      },
      position : "4-1",
      edgeAdjust : true
    };
    var params = $.extend({}, args, opts || {});
    return $(this).each(function() {
      var modal = $(this);
      if (0 != pointer.length) {
        var chars;
        var n;
        var base;
        var i;
        var h;
        /** @type {number} */
        var j = 0;
        /** @type {number} */
        var x = 0;
        var t = modal.data("height");
        var w = modal.data("width");
        var y = $(window).scrollTop();
        var l = $(window).scrollLeft();
        /** @type {number} */
        var a = parseInt(params.offsets.x, 10) || 0;
        /** @type {number} */
        var name = parseInt(params.offsets.y, 10) || 0;
        this.cacheData;
        if (!t) {
          t = modal.outerHeight();
        }
        if (!w) {
          w = modal.outerWidth();
        }
        chars = pointer.offset();
        j = pointer.outerHeight();
        x = pointer.outerWidth();
        n = chars.left;
        base = chars.top;
        var key;
        /** @type {Array} */
        var which = ["4-1", "1-4", "5-7", "2-3", "2-1", "6-8", "3-4", "4-3", "8-6", "1-2", "7-5", "3-2"];
        var value = params.position;
        /** @type {boolean} */
        var u = false;
        $.each(which, function(dataAndEvents, item) {
          return item === value ? void(u = true) : void 0;
        });
        if (!u) {
          /** @type {string} */
          value = args.position;
        }
        /**
         * @param {?} position
         * @return {?}
         */
        var init = function(position) {
          /** @type {string} */
          var result = "bottom";
          switch(position) {
            case "1-4":
            ;
            case "5-7":
            ;
            case "2-3":
              /** @type {string} */
              result = "top";
              break;
            case "2-1":
            ;
            case "6-8":
            ;
            case "3-4":
              /** @type {string} */
              result = "right";
              break;
            case "1-2":
            ;
            case "8-6":
            ;
            case "4-3":
              /** @type {string} */
              result = "left";
              break;
            case "4-1":
            ;
            case "7-5":
            ;
            case "3-2":
              /** @type {string} */
              result = "bottom";
          }
          return result;
        };
        /**
         * @param {string} r
         * @return {?}
         */
        var cb = function(r) {
          return "5-7" === r || ("6-8" === r || ("8-6" === r || "7-5" === r)) ? true : false;
        };
        /**
         * @param {string} keepData
         * @return {?}
         */
        var check = function(keepData) {
          /** @type {number} */
          var ms = 0;
          /** @type {number} */
          var order = 0;
          if ("right" === keepData) {
            if (order = n + x + w + a, order > $(window).width()) {
              return false;
            }
          } else {
            if ("bottom" === keepData) {
              if (ms = base + j + t + name, ms > y + $(window).height()) {
                return false;
              }
            } else {
              if ("top" === keepData) {
                if (ms = t + name, ms > base - y) {
                  return false;
                }
              } else {
                if ("left" === keepData && (order = w + a, order > n)) {
                  return false;
                }
              }
            }
          }
          return true;
        };
        key = init(value);
        if (params.edgeAdjust) {
          if (check(key)) {
            !function() {
              if (!cb(value)) {
                var name;
                var testMaxBounds = {
                  top : {
                    right : "2-3",
                    left : "1-4"
                  },
                  right : {
                    top : "2-1",
                    bottom : "3-4"
                  },
                  bottom : {
                    right : "3-2",
                    left : "4-1"
                  },
                  left : {
                    top : "1-2",
                    bottom : "4-3"
                  }
                };
                var object = testMaxBounds[key];
                if (object) {
                  for (name in object) {
                    if (!check(name)) {
                      value = object[name];
                    }
                  }
                }
              }
            }();
          } else {
            !function() {
              if (cb(value)) {
                var result = {
                  "5-7" : "7-5",
                  "7-5" : "5-7",
                  "6-8" : "8-6",
                  "8-6" : "6-8"
                };
                value = result[value];
              } else {
                var layout = {
                  top : {
                    left : "3-2",
                    right : "4-1"
                  },
                  right : {
                    bottom : "1-2",
                    top : "4-3"
                  },
                  bottom : {
                    left : "2-3",
                    right : "1-4"
                  },
                  left : {
                    bottom : "2-1",
                    top : "3-4"
                  }
                };
                var prop = layout[key];
                /** @type {Array} */
                var configList = [];
                for (name in prop) {
                  configList.push(name);
                }
                value = check(configList[0]) || !check(configList[1]) ? prop[configList[0]] : prop[configList[1]];
              }
            }();
          }
        }
        var direction = init(value);
        var load = value.split("-")[0];
        switch(direction) {
          case "top":
            /** @type {number} */
            h = base - t;
            i = "1" == load ? n : "5" === load ? n - (w - x) / 2 : n - (w - x);
            break;
          case "right":
            i = n + x;
            h = "2" == load ? base : "6" === load ? base - (t - j) / 2 : base - (t - j);
            break;
          case "bottom":
            h = base + j;
            i = "4" == load ? n : "7" === load ? n - (w - x) / 2 : n - (w - x);
            break;
          case "left":
            /** @type {number} */
            i = n - w;
            h = "2" == load ? base : "6" === load ? base - (w - x) / 2 : base - (t - j);
        }
        if (params.edgeAdjust && cb(value)) {
          var r = $(window).width();
          var scrollY = $(window).height();
          if ("7-5" == value || "5-7" == value) {
            if (0.5 * r > i - l) {
              if (0 > i - l) {
                i = l;
              }
            } else {
              if (i - l + w > r) {
                /** @type {number} */
                i = r + l - w;
              }
            }
          } else {
            if (0.5 * scrollY > h - y) {
              if (0 > h - y) {
                h = y;
              }
            } else {
              if (h - y + t > scrollY) {
                /** @type {number} */
                h = scrollY + y - t;
              }
            }
          }
        }
        if ("top" == direction || "left" == direction) {
          i -= a;
          h -= name;
        } else {
          i += a;
          h += name;
        }
        modal.css({
          position : "absolute",
          left : Math.round(i),
          top : Math.round(h)
        }).attr("data-align", value);
      }
    });
  };
  /**
   * @param {Object} c
   * @param {Object} self
   * @param {Object} cb
   * @return {undefined}
   */
  var f = function(c, self, cb) {
    self.follow(c, cb);
  };
  return f.prototype.hide = function() {
    target.remove();
  }, f;
});
