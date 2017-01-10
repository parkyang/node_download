define("common/ui/Radio", ["plugin/jquery"], function($sanitize, dataAndEvents, module) {
  $sanitize("plugin/jquery");
  /** @type {string} */
  var c = "checked";
  /**
   * @return {?}
   */
  $.fn.propMatch = function() {
    if (!window.addEventListener) {
      /**
       * @param {Object} input
       * @return {undefined}
       */
      var render = function(input) {
        input = $(input);
        if (input.prop(c)) {
          input.attr(c, c);
        } else {
          input.removeAttr(c);
        }
        input.parent().addClass("z").toggleClass("i_i");
      };
      if (1 == $(this).length && "radio" == $(this).attr("type")) {
        var quoteNeeded = $(this).attr("name");
        $("input[type=radio][name=" + quoteNeeded + "]").each(function() {
          render(this);
        });
      } else {
        $(this).each(function() {
          render(this);
        });
      }
      return $(this);
    }
  };
  module.exports = {
    /**
     * @param {?} consume
     * @return {undefined}
     */
    match : function(consume) {
      consume.propMatch();
    },
    /**
     * @return {undefined}
     */
    init : function() {
      if (!window.addEventListener && !window.initedRadio) {
        /** @type {string} */
        var selector = "input[type=radio]";
        $(document.body).delegate(selector, "click", function() {
          $(this).propMatch();
        });
        $(selector).propMatch();
        /** @type {boolean} */
        window.initedRadio = true;
      }
    }
  };
});
