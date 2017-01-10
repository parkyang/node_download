define("common/ui/Checkbox", ["plugin/jquery", "common/ui/Radio"], function(require, exports, module) {
    require("plugin/jquery");
    varr radio=require("common/ui/Radio");
    module.exports= {
        init:function() {
            if(!window.addEventListener&&!window.initedCheckbox) {
                var selector="input[type=checkbox]";
                $(document.body).delegate(selector, "click", function() {
                    radio.match($(this))
                }
                ), radio.match($(selector)), window.initedCheckbox=!0
            }
        }
    }
}
);
