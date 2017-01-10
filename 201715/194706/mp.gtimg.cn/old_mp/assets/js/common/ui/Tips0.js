define("common/ui/Tips", ["plugin/jquery", "common/ui/Follow"], function(a, b, c) {
    a("plugin/jquery"), a("common/ui/Follow");
    var d="ui_tips", e=d+"_";
    $.fn.tips=function(a) {
        return $(this).each(function() {
            $(this).data("tips", new f($(this), a))
        }
        )
    }
    ;
    var f=function(a, b) {
        var c, f, g= {
            attribute:"title", eventType:"hover", content:"", align:"center", delay:100, onShow:$.noop, onHide:$.noop
        }
        , h=$.extend( {
        }
        , g, b|| {
        }
        ), i=a;
        if(i.hasClass(d)) {
            var j=i.attr("title")||i.attr("data-title");
            return j&&i.attr("data-title", j).removeAttr("title"), window.addEventListener||(c=$('<span class="'+e+'before"></span>').html(j), f=$('<i class="'+e+'after"></i>'), i.prepend(c), i.append(f), c.css("margin-left", c.outerWidth()*-.5), f.css("margin-left", f.outerWidth()*-.5)), void i.data("tips", !0)
        }
        var k, l, m=this, n=function() {
            var a=h.content;
            return a||(a=i.attr(h.attribute), "title"==h.attribute&&(a=a||i.data("title"), a&&i.data("title", a), i.removeAttr("title"))), a
        }
        ;
        return this.el= {
            trigger:i, tips:k
        }
        , this.callback= {
            show:h.onShow, hide:h.onHide
        }
        , this.align=h.align, "hover"==h.eventType?i.hover(function() {
            var a=n();
            l=setTimeout(function() {
                m.show(a)
            }
            , h.delay)
        }
        , function() {
            clearTimeout(l), m.hide()
        }
        ):"click"==h.eventType?(i.click(function() {
            m.show(n())
        }
        ), $(document).mouseup(function(a) {
            var b=a.target, c=i.get(0);
            1==m.display&&c!=b&&0==c.contains(b)&&0==m.el.tips.get(0).contains(b)&&m.hide()
        }
        )):this.show(n()), this
    }
    ;
    return f.prototype.show=function(a) {
        if(!a)return this;
        var b, c, d=this.el.trigger, f=this.el.tips;
        f?(f.show(), b=f.find("span").html(a), c=f.find("i")):(f=$("<div></div>").addClass(e+"x"), b=$('<span class="'+e+'before"></span>').html(a), c=$('<i class="'+e+'after"></i>'), $(document.body).append(f.append(b).append(c)));
        var g=0, h="5-7";
        return"left"==this.align?g=-.5*b.width()+parseInt(b.css("padding-left"))||0:"right"==this.align?g=.5*b.width()-parseInt(b.css("padding-right"))||0:"rotate"==this.align?h="6-8":"number"==typeof this.align&&(g=this.align), f.addClass(e+this.align), "rotate"!=this.align&&c.css( {
            left:g
        }
        ), f.follow(d, {
            offsets: {
                x:g, y:0
            }
            , position:h, edgeAdjust:!1
        }
        ), this.callback.show.call(d, f), this.el.tips=f, this.display=!0, this
    }
    , f.prototype.hide=function() {
        return this.el.tips&&(this.el.tips.hide(), this.callback.hide.call(this.el.trigger, this.el.tips)), this.display=!1, this
    }
    , f.prototype.init=function() {
        window.addEventListener;
        return $("."+d).tips(), $(document).mouseover(function(a) {
            var b=a&&a.target;
            b&&$(b).hasClass(d)&&!$(b).data("tips")&&$(b).tips()
        }
        ), this
    }
    , f
}
);
