define("common/ui/Loading", ["plugin/jquery"], function($sanitize, dataAndEvents, deepDataAndEvents) {
  $sanitize("plugin/jquery");
  /** @type {string} */
  var cls = "ui_loading";
  /** @type {string} */
  var type = "ui_loading_icon";
  /** @type {string} */
  var e = "ui_button";
  /** @type {string} */
  var className = "ui_button_loading";
  /** @type {string} */
  var delimiter = "_";
  /**
   * @return {?}
   */
  $.fn.isLoading = function() {
    var self = $(this).eq(0);
    if (0 == self.hasClass(e)) {
      var revisionCheckbox = self.find("." + type);
      return revisionCheckbox.length && revisionCheckbox.is(":visible") ? true : false;
    }
    return self.hasClass(className);
  };
  /**
   * @param {EventTarget} options
   * @return {?}
   */
  $.fn.loading = function(options) {
    return $(this).each(function() {
      var $el = $(this);
      if (0 == $el.hasClass(e)) {
        $el.data("loading", new Modal($el, options));
      } else {
        $el.addClass(className);
      }
    });
  };
  /**
   * @param {number} start
   * @return {?}
   */
  $.fn.unloading = function(start) {
    var i = start || 0;
    return "number" != typeof start && (i = 200), "undefined" == typeof start && (start = i), $(this).each(function(dataAndEvents, video) {
      var $el = $(this);
      if ($el.hasClass(e)) {
        return void $el.removeClass(className);
      }
      if ("function" == typeof history.pushState) {
        if (i > 0) {
          var top = $el.height();
          $el.css("min-height");
          $el.css({
            height : "auto",
            webkitTransition : "none",
            transition : "none",
            overflow : "hidden"
          });
          var height = $el.height();
          $el.height(top);
          $el.removeClass(cls + delimiter + "animation");
          video.offsetWidth = video.offsetWidth;
          if (start !== false) {
            $el.addClass(cls + delimiter + "animation");
          }
          $el.css({
            webkitTransition : "height " + i + "ms",
            transition : "height " + i + "ms"
          });
          $el.height(height);
        } else {
          $el.css({
            webkitTransition : "none",
            transition : "none"
          });
          $el.height("auto").removeClass(cls);
        }
      } else {
        $el.height("auto");
      }
    });
  };
  /**
   * @param {string} m3
   * @param {Object} conf
   * @return {?}
   */
  var Modal = function(m3, conf) {
    var customOptions = {
      primary : false,
      small : false,
      create : false
    };
    var options = $.extend({}, customOptions, conf || {});
    /** @type {string} */
    var c = m3;
    /** @type {null} */
    var n = null;
    /** @type {null} */
    var image = null;
    return this._create = function() {
      var el = this.el.container;
      n = el.find("." + cls);
      image = el.find("." + type);
      if (1 == options.create && 0 == n.size()) {
        el.append(n = $("<div></div>").addClass(cls));
      } else {
        if (0 == options.create) {
          n = el;
        }
      }
      if (0 == image.size()) {
        image = (options.small ? $("<s></s>") : $("<i></i>")).addClass(type);
        n.empty().addClass(cls).append(image);
        if (options.primary) {
          n.addClass(cls + delimiter + "primary");
        }
      }
      this.el.loading = n;
      this.el.icon = image;
    }, this.el = {
      container : c,
      loading : n,
      icon : image
    }, this.show(), this;
  };
  return Modal.prototype.show = function() {
    var obj = this.el;
    return obj.loading && obj.icon || this._create(), obj.loading.show(), this.display = true, this;
  }, Modal.prototype.hide = function() {
    var me = this.el;
    var container = me.container;
    var clone = me.loading;
    return clone && (container.get(0) != clone.get(0) ? clone.hide() : container.find("." + type).length && (clone.empty(), this.el.icon = null)), this.display = false, this;
  }, Modal.prototype.remove = function() {
    var self = this.el;
    var c = self.container;
    var list = self.loading;
    var icon = self.icon;
    return list && (icon && (c.get(0) == list.get(0) ? (list.removeClass(cls), icon.remove()) : list.remove(), this.el.loading = null, this.el.icon = null)), this.display = false, this;
  }, Modal.prototype.end = function(tag) {
    var me = this.el;
    var container = me.container;
    return container && (container.unloading(tag), 0 == container.find("." + type).length && (this.el.icon = null)), this.display = false, this;
  }, Modal;
});
