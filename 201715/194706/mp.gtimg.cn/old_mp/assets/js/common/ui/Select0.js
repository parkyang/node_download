define("common/ui/Select", ["plugin/jquery"], function (require, exports, module) {
    require("plugin/jquery"), $.fn.selectMatch = function (options) {
        var type = "select",
            selected = "selected",
            disabled = "disabled",
            active = "active",
            reverse = "reverse",
            def = {
                prefix: "ui_",
                trigger: ["change"]
            }, opt = $.extend({}, def, options || {}),
            className = opt.prefix + type,
            separator = opt.prefix.replace(/[a-z]/gi, ""),
            render = function (elem) {
                var selected_index = 0,
                    html = "";
                return elem.find("option").each(function (index) {
                    var _className = [className + separator + "datalist" + separator + "li", this.className];
                    this[selected] && (selected_index = index, _className.push(selected)), this[disabled] && _className.push(disabled), html = html + '<li class="' + _className.join(" ") +
                        '" data-index=' + index + ">" + this.innerHTML + "</li>"
                }), {
                    index: selected_index,
                    html: html
                }
            };
        return $(this).each(function (index, elem) {
            var data = $(this).hide().data(type);
            data || (data = $("<div></div>").on("click", "a", function () {
                if ($(elem).prop(disabled)) return !1;
                if (data.toggleClass(active), data.hasClass(active)) {
                    var list = data.find("ul"),
                        isReverse = list.offset().top + list.outerHeight() > Math.max($(document.body).height(), $(window).height());
                    data[isReverse ? "addClass" : "removeClass"](reverse);
                    var scrollTop = data.data("scrollTop"),
                        _selected = list.find("." + selected);
                    scrollTop && scrollTop[1] == _selected.attr("data-index") && scrollTop[2] == _selected.text() && (list.scrollTop(scrollTop[0]), data.removeData(
                        "scrollTop"))
                } else data.removeClass(reverse)
            }).on("click", "li", function (index, _elem) {
                var _index = $(this).attr("data-index"),
                    scrollTop = $(this).parent().scrollTop();
                data.removeClass(active), data.data("scrollTop", [scrollTop, _index, $(this).text()]), $(elem).find("option").eq(_index).get(0)[selected] = !0,
                    $(elem).selectMatch(opt), $.each(opt.trigger, function (index, event_item) {
                    $(elem).trigger(event_item, [_elem])
                })
            }), $(this).data(type, data), $(this).after(data), $(document).mouseup(function (e) {
                var target = e.target;
                target && data.hasClass(active) && data.get(0) !== target && 0 == data.get(0).contains(target) && data.removeClass(active).removeClass(reverse)
            }));
            var templ_obj = render($(this)),
                option_item = $(this).find("option").eq(templ_obj.index);
            data.attr("class", elem.className + " " + className).width($(this).outerWidth());
            var text = '<a href="javascript:" class="' + className + separator + 'button"><span class="' + className + separator + 'text">' + option_item.html() +
                '</span><i class="' + className + separator + 'icon"></i></a>',
                list = '<ul class="' + className + separator + 'datalist">' + templ_obj.html + "</ul>";
            data.html(text + list)
        })
    }, module.exports = {
        init: function (elem, options) {
            elem = elem || $("select");
            elem.selectMatch(options)
        }
    }
});
