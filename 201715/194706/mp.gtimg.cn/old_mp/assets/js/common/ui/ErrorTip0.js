define("common/ui/ErrorTip", ["plugin/jquery", "common/ui/Follow"], function($sanitize, dataAndEvents, deepDataAndEvents) {
  $sanitize("plugin/jquery");
  $sanitize("common/ui/Follow");
  /** @type {string} */
  var className = "ui_tips";
  /** @type {string} */
  var staggerClassName = className + "_";
  /**
   * @param {Array} html
   * @param {Object} conf
   * @return {?}
   */
  $.fn.errorTip = function(html, conf) {
    var defaults = {
      unique : true,
      align : "center",
      onShow : $.noop,
      onHide : $.noop
    };
    var options = $.extend({}, defaults, conf || {});
    return $.isFunction(html) && (html = html()), "string" != typeof html ? this : $(this).each(function(dataAndEvents, deepDataAndEvents) {
      if (!(1 == options.unique && dataAndEvents > 0)) {
        var self;
        var label;
        var row;
        var player = $(this);
        if (1 == options.unique && window.errorTip) {
          self = errorTip.data("trigger", player);
        } else {
          if (0 == options.unique && player.data("errorTip")) {
            self = player.data("errorTip");
          } else {
            self = $('<div class="' + staggerClassName + "x " + staggerClassName + 'error"></div>').html('<span class="' + staggerClassName + 'before"></span><i class="' + staggerClassName + 'after"></i>');
            $(document.body).append(self.append(label).append(row));
            if (1 == options.unique) {
              window.errorTip = self.data("trigger", player);
            } else {
              player.data("errorTip", self);
            }
            /**
             * @return {undefined}
             */
            var done = function() {
              if ("none" != self.css("display")) {
                self.hide();
                options.onHide.call((self.data("trigger") || player).removeClass("error"), self);
              }
            };
            $(document).bind({
              /**
               * @param {?} e
               * @return {undefined}
               */
              keydown : function(e) {
                if (16 != e.keyCode) {
                  if (17 != e.keyCode) {
                    done();
                  }
                }
              },
              /**
               * @param {Event} event
               * @return {undefined}
               */
              mousedown : function(event) {
                var node = document.activeElement;
                var elm = self.data("trigger");
                var parent = event.target;
                if (!(node && (elm && (node == parent && (node == elm.get(0) && 0 == elm.data("focus")))))) {
                  done();
                }
              }
            });
            $(window).bind({
              /** @type {function (): undefined} */
              resize : done
            });
          }
        }
        self.show();
        label = self.find("span");
        row = self.find("i");
        label.html(html);
        /** @type {number} */
        var l = 0;
        if ("left" == options.align) {
          /** @type {number} */
          l = -0.5 * label.width() + parseInt(label.css("padding-left")) || 0;
        } else {
          if ("right" == options.align) {
            /** @type {number} */
            l = 0.5 * label.width() - parseInt(label.css("padding-right")) || 0;
          } else {
            if ("number" == typeof options.align) {
              /** @type {number} */
              l = options.align;
            }
          }
        }
        row.css({
          left : l
        });
        self.follow(player, {
          align : options.align,
          position : "5-7",
          edgeAdjust : false
        });
        /** @type {number} */
        var i = 1 * self.css("zIndex") || 19;
        /** @type {number} */
        var min = i;
        $("body").children().each(function() {
          var minimumCellWidth;
          if (0 == $(this).hasClass(className)) {
            if (minimumCellWidth = 1 * $(this).css("zIndex")) {
              /** @type {number} */
              min = Math.max(minimumCellWidth, min);
            }
          }
        });
        if (min > i) {
          self.css("zIndex", min + 1);
        }
        options.onShow.call(player.addClass("error valided"), self);
      }
    });
  };
  /**
   * @param {(Object|boolean)} _
   * @param {Array} css
   * @param {Object} conf
   * @return {?}
   */
  var render = function(_, css, conf) {
    return _.errorTip(css, conf), this.el = {
      trigger : _
    }, this.cl = className, this;
  };
  return render;
});
