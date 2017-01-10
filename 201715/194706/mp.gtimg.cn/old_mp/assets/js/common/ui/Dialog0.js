define("common/ui/Dialog", ["common/ui/Loading", "plugin/jquery"], function($sanitize, dataAndEvents, deepDataAndEvents) {
  /** @type {string} */
  var arg = ($sanitize("common/ui/Loading"), "ui_");
  /** @type {string} */
  var prefix = "ui_dialog_";
  /** @type {string} */
  var g = "_";
  /** @type {string} */
  var rem = window.addEventListener ? '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><path d="M116.152,99.999l36.482-36.486c2.881-2.881,2.881-7.54,0-10.42 l-5.215-5.215c-2.871-2.881-7.539-2.881-10.42,0l-36.484,36.484L64.031,47.877c-2.881-2.881-7.549-2.881-10.43,0l-5.205,5.215 c-2.881,2.881-2.881,7.54,0,10.42l36.482,36.486l-36.482,36.482c-2.881,2.881-2.881,7.549,0,10.43l5.205,5.215 c2.881,2.871,7.549,2.871,10.43,0l36.484-36.488L137,152.126c2.881,2.871,7.549,2.871,10.42,0l5.215-5.215 c2.881-2.881,2.881-7.549,0-10.43L116.152,99.999z"/></svg>' :
  "";
  /** @type {boolean} */
  var ismobile = "WebkitAppearance" in document.documentElement.style || "undefined" != typeof document.webkitHidden;
  /**
   * @param {Object} args
   * @return {?}
   */
  var show = function(args) {
    var defaults = {
      title : "",
      content : "",
      width : "auto",
      buttons : [],
      onShow : $.noop,
      onHide : $.noop,
      onRemove : $.noop
    };
    var options = $.extend({}, defaults, args || {});
    var c = {};
    this.el = c;
    this.width = this.width;
    this.callback = {
      show : options.onShow,
      hide : options.onHide,
      remove : options.onRemove
    };
    c.container = window.addEventListener ? $('<dialog class="' + prefix + 'container"></dialog>') : $('<div class="' + prefix + 'container"></div>');
    if (history.pushState) {
      c.container.get(0).addEventListener(ismobile ? "webkitAnimationEnd" : "animationend", function(e) {
        if ("dialog" == e.target.tagName.toLowerCase()) {
          this.classList.remove(prefix + "animation");
        }
      });
    }
    c.dialog = $('<div class="' + arg + 'dialog"></div>').css("width", options.width);
    c.title = $('<div class="' + prefix + 'title"></div>').html(options.title);
    c.close = $('<a href="javascript:" class="' + prefix + 'close"></a>').html(rem).click($.proxy(function(types) {
      this[this.closeMode]();
      types.preventDefault();
    }, this));
    var data = options.content;
    if ($.isFunction(data)) {
      data = data();
    }
    if (data.size) {
      /** @type {string} */
      this.closeMode = "hide";
    } else {
      /** @type {string} */
      this.closeMode = "remove";
    }
    c.body = $('<div class="' + prefix + 'body"></div>')[data.size ? "append" : "html"](data);
    c.footer = $('<div class="' + prefix + 'footer"></div>');
    this.button(options.buttons);
    c.container.append(c.dialog.append(c.close).append(c.title).append(c.body).append(c.footer));
    if (!document.querySelector) {
      c.container.append('<i class="' + prefix + 'after"></i>');
    }
    var set = $("." + prefix + "container");
    return set.size() ? set.eq(0).before(c.container.css({
      zIndex : 1 * set.eq(0).css("z-index") + 1
    })) : (options.container || $(document.body)).append(c.container), this.display = false, options.content && this.show(), this;
  };
  return show.prototype.button = function(selection) {
    var that = this.el;
    var memo = this;
    return that.footer.empty(), $.each(selection, function(type, options) {
      options = options || {};
      var b = type ? options.type || "" : options.type || "primary";
      var _args = type ? options.value || "\u53d6\u6d88" : options.value || "\u786e\u5b9a";
      var CLICK = options.events || {
        /**
         * @return {undefined}
         */
        click : function() {
          memo[memo.closeMode]();
        }
      };
      /** @type {string} */
      var s = arg + "button";
      if (b) {
        /** @type {string} */
        s = s + " " + s + g + b;
      }
      that.footer.append(that["button" + type] = $('<a href="javascript:;" class="' + s + '">' + _args + "</a>").bind(CLICK));
    }), this;
  }, show.prototype.loading = function() {
    var me = this.el;
    return me && (me.container.attr("class", [prefix + "container", prefix + "loading"].join(" ")), me.body.loading(), this.show()), this;
  }, show.prototype.unloading = function(emptyGet) {
    var self = this.el;
    return self && (self.container.removeClass(prefix + "loading"), self.body.unloading(emptyGet)), this;
  }, show.prototype.open = function(options, method) {
    var me = this.el;
    var args = {
      title : "",
      buttons : []
    };
    var params = $.extend({}, args, method || {});
    return me && (options && (me.container.attr("class", [prefix + "container"].join(" ")), me.title.html(params.title), me.body.html(options), this.button(params.buttons).show())), this;
  }, show.prototype.alert = function(completeCallback, opts) {
    var me = this.el;
    var options = {
      title : "",
      type : "remind",
      buttons : [{}]
    };
    var config = $.extend({}, options, opts || {});
    return config.buttons[0].type || ("remind" == config.type || (config.buttons[0].type = config.type)), me && (completeCallback && (me.container.attr("class", [prefix + "container", prefix + "alert"].join(" ")), me.dialog.width("auto"), me.title.html(config.title), me.body.html('<div class="' + prefix + config.type + '">' + completeCallback + "</div>"), this.button(config.buttons).show())), this;
  }, show.prototype.confirm = function(verbose, opts) {
    var me = this.el;
    var options = {
      title : "",
      type : "warning",
      buttons : [{
        type : "warning"
      }, {}]
    };
    var config = $.extend({}, options, opts || {});
    return config.buttons.length && (!config.buttons[0].type && (config.buttons[0].type = "warning")), me && (verbose && (me.container.attr("class", [prefix + "container", prefix + "confirm"].join(" ")), me.dialog.width("auto"), me.title.html(config.title), me.body.html('<div class="' + prefix + config.type + '">' + verbose + "</div>"), this.button(config.buttons).show())), this;
  }, show.prototype.ajax = function(opt, opts) {
    var $rootScope = this;
    /** @type {number} */
    var d = (new Date).getTime();
    var options = {
      dataType : "JSON",
      timeout : 3E4,
      /**
       * @param {?} jqXHR
       * @param {string} textStatus
       * @return {undefined}
       */
      error : function(jqXHR, textStatus) {
        /** @type {string} */
        var subscribePrefix = "<h6>\u5c0a\u656c\u7684\u7528\u6237\uff0c\u5f88\u62b1\u6b49\u60a8\u521a\u624d\u7684\u64cd\u4f5c\u6ca1\u6709\u6210\u529f\uff01</h6>";
        /** @type {string} */
        var eventName = "";
        /** @type {string} */
        eventName = "timeout" == textStatus ? "<p>\u4e3b\u8981\u662f\u7531\u4e8e\u8bf7\u6c42\u65f6\u95f4\u8fc7\u957f\uff0c\u6570\u636e\u6ca1\u80fd\u6210\u529f\u52a0\u8f7d\uff0c\u8fd9\u4e00\u822c\u662f\u7531\u4e8e\u7f51\u901f\u8fc7\u6162\u5bfc\u81f4\uff0c\u60a8\u53ef\u4ee5\u7a0d\u540e\u91cd\u8bd5\uff01</p>" : "parsererror" == textStatus ? "<p>\u539f\u56e0\u662f\u8bf7\u6c42\u7684\u6570\u636e\u542b\u6709\u4e0d\u89c4\u8303\u7684\u5185\u5bb9\u3002\u4e00\u822c\u51fa\u73b0\u8fd9\u6837\u7684\u95ee\u9898\u662f\u5f00\u53d1\u4eba\u5458\u6ca1\u6709\u8003\u8651\u5468\u5168\uff0c\u6b22\u8fce\u5411\u6211\u4eec\u53cd\u9988\u6b64\u95ee\u9898\uff01</p>" :
        "<p>\u4e00\u822c\u662f\u7f51\u7edc\u51fa\u73b0\u4e86\u5f02\u5e38\uff0c\u5982\u65ad\u7f51\uff1b\u6216\u662f\u7f51\u7edc\u4e34\u65f6\u963b\u585e\uff0c\u60a8\u53ef\u4ee5\u7a0d\u540e\u91cd\u8bd5\uff01\u5982\u4f9d\u7136\u53cd\u590d\u51fa\u73b0\u6b64\u95ee\u9898\uff0c\u6b22\u8fce\u5411\u6211\u4eec\u53cd\u9988\uff01</p>";
        $rootScope.alert(subscribePrefix + eventName, {
          type : "warning"
        }).unloading();
      }
    };
    var settings = $.extend({}, options, opt || {});
    if (!settings.url) {
      return this;
    }
    var defaults = {
      title : "",
      /**
       * @param {string} type
       * @return {?}
       */
      content : function(type) {
        return "string" == typeof type ? type : "<i style=\"display:none\">\u770b\u89c1\u6211\u8bf4\u660e\u6ca1\u4f7f\u7528'options.content'\u505aJSON\u89e3\u6790</i>";
      },
      buttons : []
    };
    var data = $.extend({}, defaults, opts || {});
    /** @type {function (string): undefined} */
    var success = settings.success;
    return settings.success = function(path) {
      $rootScope.open(data.content(path), data);
      if ((new Date).getTime() - d < 100) {
        $rootScope.unloading(0);
      } else {
        $rootScope.unloading();
      }
      if ($.isFunction(success)) {
        success.apply(this, arguments);
      }
    }, $rootScope.loading(), setTimeout(function() {
      $.ajax(settings);
    }, 250), this;
  }, show.prototype.scroll = function() {
    var collection = $("." + prefix + "container");
    /** @type {boolean} */
    var b = false;
    if (collection.each(function() {
      if ("block" == $(this).css("display")) {
        /** @type {boolean} */
        b = true;
      }
    }), b) {
      /** @type {number} */
      var top = 17;
      if (1 != this.display) {
        if ("number" == typeof window.innerWidth) {
          /** @type {number} */
          top = window.innerWidth - document.documentElement.clientWidth;
        }
      }
      /** @type {string} */
      document.documentElement.style.overflow = "hidden";
      if (1 != this.display) {
        $(document.body).css("border-right", top + "px solid transparent");
      }
    } else {
      /** @type {string} */
      document.documentElement.style.overflow = "";
      $(document.body).css("border-right", "");
    }
    return this;
  }, show.prototype.show = function() {
    var el = this.el.container;
    return el && (el.css("display", "block"), 1 != this.display && el.addClass(prefix + "animation"), this.scroll(), this.display = true, $.isFunction(this.callback.show) && this.callback.show.call(this, el)), this;
  }, show.prototype.hide = function() {
    var el = this.el.container;
    return el && (el.hide(), this.scroll(), this.display = false, $.isFunction(this.callback.hide) && this.callback.hide.call(this, el)), this;
  }, show.prototype.remove = function(keepData) {
    var div = this.el.container;
    return div && (div.remove(), this.scroll(), this.display = false, $.isFunction(this.callback.remove) && this.callback.remove.call(this, div)), this;
  }, show;
});
