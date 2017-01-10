define("common/ui/Validate", ["plugin/jquery", "common/ui/ErrorTip", "common/ui/Follow"], function(a, b, c) {
    a("plugin/jquery");
    a("common/ui/ErrorTip");
    $.fn.validate=function(a, b) {
        return $(this).each(function() {
            $(this).data("validate", new d($(this), a, b))
        }
        )
    }
    , $.fn.selectRange=function(a, b) {
        var c=$(this).get(0);
        if(c.createTextRange) {
            var d=c.createTextRange();
            d.collapse(!0), d.moveEnd("character", b), d.moveStart("character", a), d.select()
        }
        else c.focus(), c.setSelectionRange(a, b);
        return $(this)
    }
    , $.fn.isProp=function(a) {
        var b=$(this).prop(a)||$(this).attr(a);
        return b||"string"==typeof b?!0:!1
    }
    , $.dbc2sbc=function(a) {
        var b, c, d="";
        for(b=0;
        b<a.length; b++)c="a.charCodeAt(b)," d+="c">=65281&&65373>=c?String.fromCharCode(a.charCodeAt(b)-65248):12288==c?String.fromCharCode(a.charCodeAt(b)-12288+32):a.charAt(b);
        return d
    }
    , $.getType=function(a) {
        var b=a.getAttribute("type"), c=b||a.type||"";
        if(c=c.toLowerCase().replace(/\W+$/, ""), b&&b!=c&&$('<input type="'+c+'">').attr("type")==c)try {
            a.type=c
        }
        catch(d) {
        }
        return c.replace(/_/g, "")
    }
    , $.getLength=function(a, b) {
        if("password"==a.type)return b?b:a.value.length;
        var c=a.getAttribute("lang"), d=$.trim(a.value);
        if(!c)return b?b:d.length;
        if(""==d)return 0;
        var e=1, f=1;
        if(/zh/i.test(c)?f=.5:/en/i.test(c)&&(e=2), b) {
            var g=0, h=b;
            return $.each(d.split(""), function(a, c) {
                g>=b||(g+=/[\x00-\xff]/.test(c)?f:e, g>=b&&(h=a+1))
            }
            ), h
        }
        var i=d.replace(/[\x00-\xff]/g, "").length, j=d.length-i;
        return Math.ceil(j*f)+Math.ceil(i*e)
    }
    , $.validate=function() {
        return {
            reg: {
                idname:"^[a-zA-Z]{1}([0-9a-zA-Z_-]){5,19}$", email:"^[a-z0-9._%-]+@([a-z0-9-]+\\.)+[a-z]{2,4}$", number:"^\\-?\\d+(\\.\\d+)?$", url:"^(http|https)\\:\\/\\/[a-z0-9\\-\\.]+\\.[a-z]{2,3}(:[a-z0-9]*)?\\/?([a-z0-9\\-\\._\\:\\?\\,\\'\\/\\\\\\+&%\\$#\\=~])*$", tel:"^1\\d{10}$", zipcode:"^\\d{6}$", date:"^\\d{4}\\-(0\\d|1[0-2])\\-([0-2]\\d|3[0-1])$", time:"^[0-2]\\d\\:[0-5]\\d$", hour:"^[0-2]\\d\\:00$", minute:"^[0-2]\\d\\:[0-5]\\d$", "date-range":"^\\d{4}(\\-\\d{2}){2}\\s至\\s\\d{4}(\\-\\d{2}){2}$", "month-range":"^\\d{4}\\-\\d{2}\\s至\\s\\d{4}\\-\\d{2}$"
            }
            , prompt:function(a, b, c) {
                var d= {
                    name:$.extend( {
                    }
                    , {
                        idname:"ID", email:"邮箱", tel:"手机号码", url:"网址", zipcode:"邮编", password:"密码", number:"数值", range:"数值", date:"日期", year:"年份", month:"月份", hour:"小时", minute:"分钟", time:"时间", datetime:"日期时间", "date-range":"日期范围", "month-range":"月份范围"
                    }
                    , $.validate.name|| {
                    }
                    ), ignore: {
                        radio:"请选择一个选项", checkbox:"如果要继续，请选中此框", select:"请选择列表中的一项", "select-one":"请选择列表中的一项", empty:"请填写此字段"
                    }
                    , unmatch: {
                        pattern:"内容格式不符合要求", multiple:"某项内容格式不符合要求"
                    }
                    , out: {
                        min:"值偏小", max:"值偏大", step:"值不符合要求"
                    }
                    , overflow: {
                        minlength:"内容长度偏小", maxlength:"内容长度偏大"
                    }
                }
                ;
                if(a) {
                    var e="", f=b.id, g="", h=a.error;
                    b&&(g=b.getAttribute("type")||b.type||"", g=$.trim(g), "select-one"==g&&(g="select")), c=c|| {
                    }
                    ;
                    var i=c.prompt||c;
                    f&&$.isArray(c)&&$.each(c, function(a, b) {
                        b.id==f&&(i=b.prompt)
                    }
                    );
                    var j=d.name[g]||function() {
                        if(c.label&&f&&!/checkbox|radio/.test(g)) {
                            var a="";
                            return $("label[for="+f+"]").each(function() {
                                var b=$(this).clone();
                                b.children().remove(), labelText=b.html(), labelText.length>a.length&&(a=labelText)
                            }
                            ), a.length>=2?a:void 0
                        }
                    }
                    ();
                    switch(a.type) {
                        case"ignore":e=i.ignore, e||(e=g&&j?"select"!=g?j+"不能为空":d.ignore[g]="您尚未选择"+j:d.ignore[h], e=e||d.ignore.empty);
                        break;
                        case"unmatch":if(!(e=i.unmatch)) {
                            if("idname"==g) {
                                var k=b.value;
                                e=k.length<6||k.length>20?"ID须为6-20个字符":null==k.match(/^[a-zA-Z] {
                                    1
                                }
                                /g)?"ID须已字母开头":"ID须字母，数字，下划线，及减号组成"
                            }
                            else e=g&&j?j+"格式不符合要求":d.unmatch[h]||d.unmatch.pattern;
                            e=e||d.ignore.empty
                        }
                        break;
                        case"out":if(e=i.out&&i.out[h], !e)if(g&&j) {
                            var l=b.getAttribute("min"), m=b.getAttribute("max"), n=1*b.getAttribute("step")||1;
                            "month-range"==g&&(l=l.slice(0, 7), m=m.slice(0, 7));
                            var o="必须要大于或等于"+l, p="必须要小于或等于"+m;
                            "min"==h?(e=j+o, "-range"==g.slice(-6)&&(e="起始日期"+o)):"max"==h?(e=j+"必须要小于或等于"+m, "-range"==g.slice(-6)&&(e="结束日期"+p)):"min-max"==h?e="起始日期"+o+"，结束日期"+p:"step"==h&&(e="number"==g||"range"==g?"请输入有效的值。两个最接近的有效值是"+function() {
                                l=1*l, m=1*m;
                                for(var a=1*$.trim(b.value), c=l, d=l;
                                d+=n;
                                m>d)if(a>d&&d+n>a) {
                                    c=d;
                                    break
                                }
                                return[c, c+n].join("和")
                            }
                            ():"请选择有效的值。"+j+"间隔是"+n)
                        }
                        else e=d.out[h];
                        e=e||d.out.step;
                        break;
                        case"overflow":if(e=i.overflow&&i.overflow[h], !e) {
                            var q=b.getAttribute("minlength"), r=b.maxlength||b.getAttribute("maxlength"), s=b.getAttribute("lang"), t="";
                            /zh/i.test(s)?t="个汉字(2字母=1汉字)":/en/i.test(s)&&(t="个字符(1汉字=2字符)"), "minlength"==h?e="内容长度不能小于"+q+t:"maxlength"==h&&(e="内容长度不能大于"+r.replace(/\D/g, "")+t)
                        }
                        e=e||d.overflow[h]
                    }
                    return $.isFunction(e)&&(e=e.call(b, $(b))), e
                }
            }
            , isIgnore:function(a) {
                if(!a||a.disabled)return!1;
                var b=$.getType(a), c=$(a), d=a.value;
                if(c.isProp("required")) {
                    if("radio"==b) {
                        var e, f=self;
                        a.name&&(e=c.parents("form")).length&&(f=e.find("input[type='radio'][name='"+a.name+"']"));
                        var g=!1;
                        return f.each(function() {
                            0==g&&$(this).isProp("checked")&&(g=!0)
                        }
                        ), 0==g? {
                            type:"ignore", error:"radio"
                        }
                        :!1
                    }
                    if("checkbox"==b)return 0==c.isProp("checked")? {
                        type:"ignore", error:"checkbox"
                    }
                    :!1;
                    if(/select/.test(b)&&""==d)return {
                        type:"ignore", error:"select"
                    }
                    ;
                    if("password"!=b&&(d=$.trim(d)), ""==d)return history.pushState&&(a.value=""), {
                        type:"ignore", error:"empty"
                    }
                }
                return!1
            }
            , isUnmatch:function(a, b, c) {
                if(!a||a.disabled)return!1;
                var d=$(a), e=a.value, f=e, g=$.getType(a);
                if(/^radio|checkbox|select$/i.test(g))return!1;
                if("password"!=g&&(f=$.trim(e)), 0==/^text|textarea|password$/i.test(g)&&(f=$.dbc2sbc(f)), $.validate.focusable!==!1&&0!==$.validate.focusable&&f!=e&&(a.value=f), ""==f)return!1;
                if(b=b||function() {
                    return d.attr("pattern")
                }
                ()||function() {
                    return g&&$.map(g.split("|"), function(a) {
                        var b=$.validate.reg[a];
                        return b?b:void 0
                    }
                    ).join("|")
                }
                (), !b)return!1;
                var h=d.isProp("multiple"), i=new RegExp(b, c||"i");
                if(h&&0==/^number|range$/i.test(g)) {
                    var j=!0;
                    if($.each(f.split(","), function(a, b) {
                        b=$.trim(b), j&&!i.test(b)&&(j=!1)
                    }
                    ), j=!1)return {
                        type:"unmatch", error:"multiple"
                    }
                }
                else if(0==i.test(f))return {
                    type:"unmatch", error:"pattern"
                }
                ;
                return!1
            }
            , isOut:function(a) {
                if(!a||a.disabled||/^radio|checkbox|select$/i.test(a.type))return!1;
                var b=$(a), c=b.attr("min"), d=b.attr("max"), e=Number($(a).attr("step"))||1, f=$.getType(a), g=a.value;
                if("-range"!=f.slice(-6)) {
                    if(("0"==g||Number(g)==g)&&(g=1*g), c&&c>g)return {
                        type:"out", error:"min"
                    }
                    ;
                    if(d&&g>d)return {
                        type:"out", error:"max"
                    }
                    ;
                    if(("number"==f||"range"==f)&&e&&c&&!/^\d+$/.test(Math.abs(g-c)/e))return {
                        type:"out", error:"step"
                    }
                    ;
                    if(("hour"==f||"minute"==f||"time"==f)&&c&&e) {
                        var h=g.split(":")[1], i=c.split(":")[1];
                        if("hour"==f&&(h!=i||(g.split(":")[0]-c.split(":")[0])%e!=0))return {
                            type:"out", error:"step"
                        }
                        ;
                        if((h-i)%e!==0)return {
                            type:"out", error:"step"
                        }
                    }
                }
                else {
                    var j=g.split(" "), k=[];
                    if("month-range"==f&&(c=c&&c.slice(0, 7), d=d&&d.slice(0, 7)), 3==j.length&&(c&&j[0]<c&&k.push("min"), d&&j[2]="">d&&k.push("max"), k.length))return {
                        type:"out", error:k.join("-")
                    }
                }
                return!1
            }
            , isOverflow:function(a) {
                if(!a||a.disabled||/^radio|checkbox|select$/i.test(a.type))return!1;
                var b=$(a), c=b.attr("minlength"), d=a.maxlength||b.attr("maxlength"), e=a.value;
                if(""==e)return!1;
                var f=$.getLength(a);
                return c&&c>f? {
                    type:"overflow", error:"minlength"
                }
                :d&&(d=d.replace(/\D/g, ""))&&f>d? {
                    type:"overflow", error:"maxlength"
                }
                :!1
            }
            , isError:function(a) {
                if(!a||a.disabled)return!1;
                var b=a.getAttribute("type")||a.type, c=a.tagName.toLowerCase();
                return 1==/^button|submit|reset|file|image$/.test(b)||"button"==c?!1:$.validate.isIgnore(a)||$.validate.isUnmatch(a)||$.validate.isOut(a)||$.validate.isOverflow(a)||!1
            }
            , isAllPass:function(a, b) {
                if(!a)return!0;
                a=$(a), a.is("form")&&(a=a.find(":input"));
                var c=!0;
                return a.each(function() {
                    var a=this, d=a.getAttribute("type")||a.type, e=a.getAttribute("pattern");
                    if(!e&&d&&(e=$.validate.reg[d])&&a.setAttribute("pattern", e), 0!=c&&!a.disabled&&"submit"!=d&&"reset"!=d&&"file"!=d&&"image"!=d) {
                        var f=$.validate.isError(a);
                        f&&($.validate.errorTip(a, $.validate.prompt(f, a, b)), c=!1)
                    }
                }
                ), c
            }
            , count:function(a) {
                if(!a)return this;
                var b;
                a.get?b=a.get(0):(b=a, a=$(a));
                var c=b.tagName.toLowerCase();
                if("input"!=c&&"textarea"!=c)return this;
                var d=a.attr("minlength")||0, e=b.maxlength||a.attr("maxlength");
                if(!d&&!e)return this;
                e=e.replace(/\D/g, "");
                var f, g, h="ui_", i=h+c, j=i+"_x", k=i+"_count";
                if(a.hasClass(i))return this;
                if(0==a.parent("."+j).length)return this;
                var l=b.id;
                l||(l="id"+(Math.random()+"").replace(/\D/g, ""), b.id=l), f=a.parent().find("."+k), 0==f.length?(f=$('<label for="'+l+'" class="ui_'+c+'_count">                       <span>'+d+"</span>/<span>"+e+"</span>                   </label>"), a.parent().append(f)):f.attr("for", l), g=f.find("span").eq(0);
                var m=function() {
                    var a=$.getLength(b);
                    g.html(a), a>e?g.addClass("red"):g.removeClass("red")
                }
                , n="countBind";
                return a.data(n)||("oninput"in document.createElement("div")?a.bind("input", function() {
                    m()
                }
                ):b.attachEvent("onpropertychange", function(a) {
                    a&&"value"==a.propertyName&&m()
                }
                ), a.data(n, !0)), m(), this
            }
            , errorTip:function(a, b) {
                var c=$.validate.getTarget(a);
                if(0==c.length)return this;
                var d=function() {
                    if(c.errorTip(b, {
                        onShow:function(a) {
                            var b=.5*(a.width()-c.width());
                            0>b?a.css("margin-left", .5*(a.width()-c.width())):a.css("margin-left", 0), $.validate.focusable===!1?a.addClass("none"):a.removeClass("none")
                        }
                        , onHide:function() {
                            if(c.parents("form").data("immediate")) {
                                var a=$.validate.el.control.data("customValidate"), b=a&&a($.validate.el.control);
                                ($.validate.isError($.validate.el.control.get(0))||"string"==typeof b&&b.length)&&$.validate.el.target.addClass("error")
                            }
                        }
                    }
                    ), $.validate.focusable!==!1&&0!==$.validate.focusable) {
                        $.validate.focusable=null;
                        var a=$.validate.el.control, d=a.get(0), e=d.getAttribute("type")||d.type;
                        if(e)if(-1!=b.indexOf("内容长度")&&-1!=b.indexOf("大")) {
                            var f=a.val(), g=f.length, h=a.attr("lang"), i=1, j=1;
                            /zh/i.test(h)?j=.5:/en/i.test(h)&&(i=2);
                            var k=d.maxlength||a.attr("maxlength").replace(/\D/g, "");
                            g&&k&&a.selectRange($.getLength(d, k), g)
                        }
                        else a.select()
                    }
                }
                ;
                $.validate.el= {
                    control:$(a), target:c
                }
                ;
                var e=c.get(0).getBoundingClientRect();
                return e.top<=50?$("html, body").animate( {
                    scrollTop:$(window).scrollTop()-(50-e.top)
                }
                , 200, d):e.bottom>$(window).height()?$("html, body").animate( {
                    scrollTop:$(window).scrollTop()+e.top-50
                }
                , 200, d):d(), this
            }
            , getTarget:function(a) {
                var b=a;
                if(!a)return $();
                if(a.get?b=a.get(0):a=$(a), 0!=a.length) {
                    var c=a, d=b.getAttribute("type")||b.type, e=b.id, f=b.tagName.toLowerCase();
                    return"radio"==d?c=a.parent().find("label.ui_radio[for="+e+"]"):"checkbox"==d?c=a.parent().find("label.ui_checkbox[for="+e+"]"):"select"==d||"select"==f?c=a.next(".ui_select"):"range"==d?c=a.prev(".ui_range"):"hidden"==d?a.data("target")&&a.data("target").size&&(c=a.data("target")):"textarea"==d||"textarea"==f?a.nextAll(".ui_textarea").length?c=a.nextAll(".ui_textarea").eq(0):!document.querySelector&&a.parent(".ui_textarea").length&&(c=a.parent(".ui_textarea")):"input"==f&&(a.nextAll(".ui_input").length?c=a.nextAll(".ui_input").eq(0):!document.querySelector&&a.parent(".ui_input").length&&(c=a.parent(".ui_input"))), c
                }
            }
        }
    }
    ();
    var d=function(a, b, c) {
        a.eq||(a=$()), b=b||$.noop, a.attr("novalidate", "novalidate");
        var d= {
            multiple:!0, immediate:!0, label:!1, validate:[], onError:$.noop, onSuccess:$.noop
        }
        , e=$.extend( {
        }
        , d, c|| {
        }
        );
        a.find(":disabled").each(function() {
            /^image|submit$/i.test(this.type)&&$(this).removeAttr("disabled")
        }
        );
        var f=this;
        return a.bind("submit", function(a) {
            return a.preventDefault(), f.isAllPass()&&$.isFunction(b)&&b.call(this), !1
        }
        ), this.el= {
            form:a
        }
        , this.callback= {
            error:e.onError, success:e.onSuccess
        }
        , this.data=e.validate, this.boo= {
            multiple:e.multiple, immediate:e.immediate, label:e.label
        }
        , this.count(), this
    }
    ;
    return d.prototype.count=function() {
        var a=this.el.form;
        a.find(".ui_input_x > input, .ui_textarea_x > textarea").each(function() {
            var a=$(this), b=a.attr("maxlength");
            if(b)try {
                a.attr("maxlength", "_"+b+"_")
            }
            catch(c) {
                a.removeAttr("maxlength")[0].maxlength=b
            }
            $.validate.count(a)
        }
        )
    }
    , d.prototype.immediate=function() {
        var a=this, b=this.el.form;
        return b.data("immediate")?this:(b.find(":input").each(function() {
            var b=this, c=$(this), d=b.type, e=b.getAttribute("type");
            b.disabled||"button"==d||"submit"==d||"reset"==d||"file"==d||"image"==d||("radio"==d||"checkbox"==d?c.on("click", function() {
                if(0!=a.boo.immediate) {
                    var b=a.isPass($(this));
                    b&&a.isError($(this), !1)
                }
            }
            ):/select/.test(d)||/range|date|time|hour|minute|hidden/.test(e)?c.on("change", function() {
                if(0!=a.boo.immediate) {
                    var b=a.isPass($(this));
                    b&&a.isError($(this), !1)
                }
            }
            ):(c.on( {
                focus:function(b) {
                    a.boo.immediate&&setTimeout(function() {
                        $.validate.focusable=0;
                        var b=a.isPass(c);
                        b&&a.isError(c, !1)
                    }
                    , 20)
                }
                , input:function(b) {
                    if(0!=a.boo.immediate) {
                        if(void 0!=document.msHidden&&""==this.value&&!this.lastvalue&&$(this).attr("placeholder"))return void(this.lastvalue=this.value);
                        $.validate.focusable=!1;
                        var c=a.isPass($(this));
                        c&&(a.isError($(this), !1), window.errorTip&&errorTip.hide()), this.lastvalue=this.value
                    }
                }
            }
            ), "oninput"in document.createElement("div")==0&&b.attachEvent("onpropertychange", function(c) {
                if(c&&"value"==c.propertyName&&a.boo.immediate) {
                    $.validate.focusable=!1;
                    var d=a.isPass($(b));
                    d&&a.isError($(b), !1), $.validate.focusable=!0
                }
            }
            )))
        }
        ), b.data("immediate", !0), this)
    }
    , d.prototype.isError=function(a, b) {
        if(!a||!a.get||!a.length)return this;
        var c=a.get(0), d=b;
        if("undefined"==typeof b&&0==a.is(":disabled")) {
            var e=a.data("customValidate");
            d=$.validate.isError(c)||e&&e(a)
        }
        var f=$.validate.getTarget(a);
        return d?f.addClass("error"):"radio"==c.type&&c.name?this.el.form.find("input[type=radio][name="+c.name+"]").each(function() {
            $.validate.getTarget($(this)).removeClass("error")
        }
        ):f.removeClass("error"), d
    }
    , d.prototype.isPass=function(a) {
        if(!a||!a.get||!a.length)return this;
        var b=a.get(0), c=b.id, d=this.boo.label, e= {
            label:d
        }
        ;
        c&&this.data&&this.data.length&&$.each(this.data, function(a, b) {
            b.id==c&&("undefined"!=typeof b.label&&(b.label=d), e=b)
        }
        );
        var f=$.validate.isAllPass(a, e);
        if(1==f&&e&&e.method) {
            var g=e.method.call(b, a);
            "string"==typeof g&&""!==g&&(this.errorTip(a, g), f=!1), a.data("customValidate", e.method)
        }
        return this.callback[f?"success":"error"].call(this, a), f
    }
    , d.prototype.isAllPass=function() {
        var a=this, b=this.el.form, c=!0;
        return $.validate.focusable=!0, b.find(":input").each(function() {
            if(1==c&&0==a.isPass($(this))&&(c=!1), a.boo.multiple) {
                var d=this;
                b.data("immediate")||$.each(a.data, function(a, b) {
                    b.id==d.id&&b.method&&$(d).data("customValidate", b.method)
                }
                ), a.isError($(this))
            }
        }
        ), !b.data("immediate")&&a.boo.immediate&&a.immediate(), c
    }
    , d.prototype.errorTip=function(a, b) {
        return $.validate.errorTip(a, b), this
    }
    , d
});
