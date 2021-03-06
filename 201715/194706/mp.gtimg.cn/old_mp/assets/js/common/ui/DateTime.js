define("common/ui/DateTime", ["plugin/jquery", "common/ui/Follow"], function(a, b, c) {
    a("plugin/jquery");
    var d = (a("common/ui/Follow"),
    "ui_date_")
      , e = "ui_range_"
      , f = "ui_day_"
      , g = "ui_year_"
      , h = "ui_month_"
      , i = "ui_hour_"
      , j = "ui_minute_"
      , k = "selected"
      , l = "active"
      , m = /\-|\//g;
    String.prototype.toDate = function() {
        var a, b, c, d = this.split(m);
        return a = 1 * d[0],
        b = d[1] || 1,
        c = d[2] || 1,
        a ? new Date(a,b - 1,c) : new Date
    }
    ,
    Date.prototype.toArray = function() {
        var a = this.getFullYear()
          , b = this.getMonth() + 1
          , c = this.getDate();
        return 10 > b && (b = "0" + b),
        10 > c && (c = "0" + c),
        [a, b, c]
    }
    ;
    var n = function(a, b) {
        if (!a || !a.length)
            return this;
        var c = {
            value: "",
            type: "auto",
            min: "auto",
            max: "auto",
            trigger: ["change"],
            onShow: $.noop,
            onHide: $.noop
        }
          , e = $.extend({}, c, b || {})
          , f = null ;
        if (a.get(0).type ? (f = a,
        a = f.parent()) : f = a.find("input"),
        0 == f.length)
            return this;
        f.prop("readonly", !0),
        f.parent().hover(function() {
            $(this).addClass("hover")
        }, function() {
            $(this).removeClass("hover")
        });
        var g = e.type;
        "auto" == g && (g = f.attr("type") || "date");
        var h = f.attr("id");
        h || (h = g + (Math.random() + "").replace("0.", ""),
        f.attr("id", h)),
        $('<label for="' + h + '"></label>').addClass(d + "arrow").insertAfter(f);
        var i = f.val();
        switch ("" == i && e.value && (f.val(e.value),
        i = e.value),
        g) {
        case "date":
        case "year":
        case "month":
            var j = i.toDate()
              , l = j.toArray();
            "" == i && ("date" == g ? f.val(l.join("-")) : "year" == g ? f.val(l[0]) : "month" == g && f.val(l.slice(0, 2).join("-"))),
            this[k] = l;
            break;
        case "time":
        case "hour":
        case "minute":
            var m = i.split(":")
              , n = m[0]
              , o = m[1];
            "" != i && 24 > n && n > 0 ? (o > 0 && 60 > o && "hour" != g ? 1 == o.length && (o = "0" + o) : o = "00",
            1 == n.length && (n = "0" + n)) : (n = "00",
            o = "00"),
            f.val([n, o].join(":")),
            this[k] = [n, o];
            break;
        case "date-range":
        case "month-range":
            var p = new Date
              , q = new Date
              , r = i.split(" ");
            if ("" != i && 1 == r.length) {
                var s = r[0].toDate();
                s.getTime() > p.getTime() ? q = s : p = s
            } else
                p = r[0].toDate(),
                q = r[r.length - 1].toDate();
            var t = p.toArray()
              , u = q.toArray();
            "date-range" == g ? f.val(t.join("-") + " 至 " + u.join("-")) : f.val(t.slice(0, 2).join("-") + " 至 " + u.slice(0, 2).join("-")),
            this[k] = [t, u]
        }
        var v = this
          , w = $("<div></div>").addClass(d + "container").delegate("a", "click", function() {
            var a = 0
              , b = 0
              , c = 0
              , d = 0;
            switch (w.attr("data-type")) {
            case "date":
                if (/prev|next/.test(this.className)) {
                    b = $(this).attr("data-month"),
                    v[k][1] = 1 * b;
                    var e = v._monthDay(v[k])
                      , f = v[k][2]
                      , g = w.data("dayOverflow")
                      , h = function() {
                        return 0 > b - 1 ? e[11] : b > e.length ? e[0] : e[b - 1]
                    }();
                    g ? v[k][2] = Math.min(g, h) : v[k][2] > h && (v[k][2] = h,
                    w.data("dayOverflow", f)),
                    v[k] = v[k].join("-").toDate().toArray(),
                    v.date(),
                    w.find("." + k).get(0).href && v.val()
                } else
                    /item/.test(this.className) ? (c = this.innerHTML,
                    /\D/.test(c) ? v[k] = (new Date).toArray() : (10 > c && (c = "0" + c),
                    v[k][2] = c),
                    v.val(),
                    v.hide(),
                    w.removeData("dayOverflow")) : "month" == $(this).attr("data-type") && v.month();
                break;
            case "date-range":
                if (/prev|next/.test(this.className)) {
                    b = 1 * $(this).attr("data-month");
                    var i = v.el.container.data("date") || v[k][0];
                    v.el.container.data("date", new Date(i[0],b - 1,i[2] || 1).toArray()),
                    v["date-range"]()
                } else if (/item/.test(this.className)) {
                    a = $(this).attr("data-year"),
                    b = $(this).attr("data-month"),
                    c = this.innerHTML,
                    10 > b && (b = "0" + b),
                    10 > c && (c = "0" + c);
                    var j = v[k];
                    j[0].join() == j[1].join() ? a + b + c > j[0].join("") ? j[1] = [a, b, c] : j[0] = [a, b, c] : j = [[a, b, c], [a, b, c]],
                    v[k] = j,
                    v["date-range"]()
                } else if (/button/.test(this.className)) {
                    var l = $(this).attr("data-type");
                    "ensure" == l ? (v.val(),
                    v._rangeSelected = v[k],
                    v.hide()) : "cancel" == l && (v._rangeSelected && (v[k] = v._rangeSelected),
                    v.hide())
                }
                break;
            case "month-range":
                if (/prev|next/.test(this.className)) {
                    a = 1 * $(this).attr("data-year");
                    var i = v.el.container.data("date") || v[k][0];
                    v.el.container.data("date", new Date(a,i[1],1).toArray()),
                    v["month-range"]()
                } else if (/item/.test(this.className)) {
                    a = $(this).attr("data-year"),
                    b = $(this).attr("data-value"),
                    c = "01";
                    var j = v[k];
                    j[0].join() == j[1].join() ? a + b + c > j[0].join("") ? j[1] = [a, b, c] : j[0] = [a, b, c] : j = [[a, b, c], [a, b, c]],
                    v[k] = j,
                    v["month-range"]()
                } else if (/button/.test(this.className)) {
                    var l = $(this).attr("data-type");
                    "ensure" == l ? (v.val(),
                    v._rangeSelected = v[k],
                    v.hide()) : "cancel" == l && (v._rangeSelected && (v[k] = v._rangeSelected),
                    v.hide())
                }
                break;
            case "month":
                if (/prev|next/.test(this.className))
                    a = $(this).attr("data-year"),
                    v[k][0] = 1 * a,
                    v.month(),
                    w.find("." + k).get(0).href && v.val();
                else if (/item/.test(this.className)) {
                    var m = $(this).attr("data-value");
                    if (m)
                        v[k][1] = m;
                    else {
                        var n = (new Date).toArray();
                        v[k][0] = n[0],
                        v[k][1] = n[1]
                    }
                    v.val(),
                    "month" == v.type ? v.hide() : v.date()
                } else
                    "year" == $(this).attr("data-type") && v.year();
                break;
            case "year":
                /prev|next/.test(this.className) ? (a = $(this).attr("data-year"),
                v[k][0] = 1 * a,
                v.year(),
                w.find("." + k).get(0).href && v.val()) : /item/.test(this.className) && ("今年" == this.innerHTML ? v[k][0] = (new Date).getFullYear() : v[k][0] = 1 * this.innerHTML,
                v.val(),
                "year" == v.type ? v.hide() : v.month());
                break;
            case "minute":
                /prev|next/.test(this.className) ? (d = $(this).attr("data-hour"),
                1 == d.length && (d = "0" + d),
                v[k][0] = d,
                v.minute(),
                w.find("." + k).attr("href") && v.val()) : /item/.test(this.className) ? (v[k] = this.innerHTML.split(":"),
                v.val(),
                v.hide()) : "hour" == $(this).attr("data-type") && v.hour();
                break;
            case "hour":
                /item/.test(this.className) && (v[k][0] = this.innerHTML.split(":")[0],
                v.val(),
                "hour" == v.type ? v.hide() : v.minute())
            }
        });
        return this.el = {},
        this.el.container = w,
        this.el.trigger = a,
        this.el.input = f,
        this.type = g,
        this.max = e.max,
        this.min = e.min,
        this.callback = {
            show: e.onShow,
            hide: e.onHide,
            trigger: e.trigger
        },
        a.click($.proxy(function(a) {
            this.display ? this.hide() : this.show(),
            a.preventDefault()
        }, this)),
        $(document).mouseup($.proxy(function(b) {
            var c = b && b.target
              , d = this.el.container.get(0);
            c && a.get(0) != c && 0 == a.get(0).contains(c) && d != c && 0 == d.contains(c) && this.hide()
        }, this)),
        this.svg = window.addEventListener ? '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><path d="M85.876,100.5l49.537-50.526c4.089-4.215,4.089-11.049,0-15.262 c-4.089-4.218-10.719-4.218-14.808,0L63.586,92.868c-4.089,4.215-4.089,11.049,0,15.264l57.018,58.156 c4.089,4.215,10.719,4.215,14.808,0c4.089-4.215,4.089-11.049,0-15.262L85.876,100.5z"/></svg>' : "",
        this
    };
    return n.prototype.format = function() {
        var a = this.type
          , b = this.el.input.val();
        if ("" == b)
            return this;
        switch (a) {
        case "date":
        case "year":
        case "month":
            var c = b.toDate()
              , d = c.toArray();
            this[k] = d;
            break;
        case "time":
        case "hour":
        case "minute":
            var e = b.split(":")
              , f = e[0]
              , g = e[1];
            2 == e.length && (g > 0 && 60 > g && "hour" != a ? 1 == g.length && (g = "0" + g) : g = "00",
            1 == f.length && (f = "0" + f),
            this.el.input.val([f, g].join(":")),
            this[k] = [f, g]);
            break;
        case "date-range":
        case "month-range":
            var h = new Date
              , i = new Date
              , j = b.split(" ");
            3 == j.length && (h = j[0].toDate(),
            i = j[j.length - 1].toDate(),
            this[k] = [h.toArray(), i.toArray()])
        }
        return this
    }
    ,
    n.prototype.val = function() {
        var a = this.el.input
          , b = this[k]
          , c = a.val();
        switch (this.type) {
        case "date":
            a.val(b.join("-"));
            break;
        case "month":
            a.val(b.slice(0, 2).join("-"));
            break;
        case "year":
            a.val(b[0]);
            break;
        case "date-range":
            a.val(b[0].join("-") + " 至 " + b[1].join("-"));
            break;
        case "month-range":
            a.val(b[0].slice(0, 2).join("-") + " 至 " + b[1].slice(0, 2).join("-"));
            break;
        case "time":
        case "minute":
            a.val(b.join(":"));
            break;
        case "hour":
            a.val(b[0] + ":00")
        }
        return a.val() != c && ($.isArray(this.callback.trigger) ? $.each(this.callback.trigger, function(b, c) {
            a.trigger(c)
        }) : a.trigger(this.callback.trigger)),
        this
    }
    ,
    n.prototype._calendar = function(a) {
        var b = ""
          , c = a
          , e = this.el.input
          , g = this.type
          , h = e.attr("min") || this.min
          , i = e.attr("max") || this.max
          , j = $.map([h, i], function(a, b) {
            return "string" == typeof a && 1 == /^\d{8}$/.test(a.replace(m, "")) ? a = a.toDate() : "object" == typeof a && a.getTime || (a = b ? new Date(9999,0,1) : new Date(0,0,1)),
            a
        });
        h = j[0],
        i = j[1];
        var l = ["日", "一", "二", "三", "四", "五", "六"]
          , n = this._monthDay(c)
          , o = c.join("-").toDate();
        b = b + '<div class="' + f + 'x">' + function() {
            var a = "";
            return $.each(l, function(b, c) {
                a = a + '<span class="' + f + 'item">' + c + "</span>"
            }),
            a
        }() + "</div>";
        var p = c.join("-").toDate()
          , q = 0;
        p.setDate(1),
        2 == p.getDate() && p.setDate(0),
        q = p.getDay();
        var r = p.getMonth() - 1;
        0 > r && (r = 11);
        var s = 'data-year="' + c[0] + '" data-month="' + (p.getMonth() + 1) + '"';
        return b = b + '<div class="' + d + 'body">' + function() {
            for (var a = "", b = "", e = 0; 6 > e; e++) {
                a = a + '<div class="' + d + 'tr">';
                for (var f = 0; 7 > f; f++)
                    if (b = d + "item col" + f,
                    "date" == g)
                        if (0 == e && q > f)
                            a = a + '<span class="' + b + '">' + (n[r] - q + f + 1) + "</span>";
                        else {
                            var j = 7 * e + f - q + 1;
                            if (j <= n[p.getMonth()]) {
                                var l = new Date(c[0],p.getMonth(),j);
                                o.getDate() == j && (b = b + " " + k),
                                a = l >= h && i >= l ? a + '<a href="javascript:;" ' + s + ' class="' + b + '">' + j + "</a>" : a + '<span class="' + b + '">' + j + "</span>"
                            } else
                                a = a + '<span class="' + b + '">' + (j - n[p.getMonth()]) + "</span>"
                        }
                    else if ("date-range" == g)
                        if (0 == e && q > f)
                            a = a + '<span class="' + b + '">&nbsp;</span>';
                        else {
                            var j = 7 * e + f - q + 1;
                            if (j <= n[p.getMonth()]) {
                                var l = new Date(c[0],p.getMonth(),j)
                                  , m = this[k][0].join("-").toDate()
                                  , t = this[k][1].join("-").toDate()
                                  , u = l.getTime()
                                  , v = m.getTime()
                                  , w = t.getTime();
                                u >= v && w >= u && (b = b + " " + k,
                                u == v && (b = b + " " + d + "begin"),
                                u == w && (b = b + " " + d + "end"),
                                1 == j ? b = b + " " + d + "first" : j == n[p.getMonth()] && (b = b + " " + d + "last")),
                                a = l >= h && i >= l ? a + '<a href="javascript:;" ' + s + ' class="' + b + '">' + j + "</a>" : a + '<span class="' + b + '">' + j + "</span>"
                            } else
                                a = a + '<span class="' + b + '">&nbsp;</span>'
                        }
                a += "</div>"
            }
            return a
        }
        .call(this) + "</div>",
        {
            monthDay: n,
            html: b,
            min: h,
            max: i
        }
    }
    ,
    n.prototype._monthDay = function(a) {
        var b = a;
        0 == $.isArray(a) && (b = a.toArray());
        var c = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return (b[0] % 4 == 0 && b[0] % 100 != 0 || b[0] % 400 == 0) && (c[1] = 29),
        c
    }
    ,
    n.prototype._datePrevMonth = function(a) {
        var b = a;
        0 == $.isArray(a) && (b = a.toArray());
        var c = 1 * b[1]
          , d = this._monthDay(b);
        return 1 == c ? [b[0] - 1, 12, b[2]].join("-").toDate() : d[c - 2] < b[2] ? [b[0], c - 1, d[c - 2]].join("-").toDate() : [b[0], c - 1, b[2]].join("-").toDate()
    }
    ,
    n.prototype._dateNextMonth = function(a) {
        var b = a;
        0 == $.isArray(a) && (b = a.toArray());
        var c = 1 * b[1]
          , d = this._monthDay(b);
        return 12 == c ? [b[0] + 1, 1, b[2]].join("-").toDate() : d[c] < b[2] ? [b[0], c + 1, d[c]].join("-").toDate() : [b[0], c + 1, b[2]].join("-").toDate()
    }
    ,
    n.prototype.date = function() {
        var a = this[k]
          , b = (a.join("-").toDate(),
        a[1] - 1);
        nextMonth = 1 * a[1] + 1;
        var c = this._calendar(a)
          , e = '<div class="' + d + 'x">';
        e = e + '<div class="' + d + 'head">';
        var f = this._datePrevMonth(a)
          , g = f.getMonth()
          , h = f.getFullYear();
        e = new Date(h,g,c.monthDay[g]) >= c.min && f <= c.max ? e + '<a href="javascript:" class="' + d + 'prev" data-month="' + b + '">' + this.svg + "</a>" : e + '<span class="' + d + 'prev">' + this.svg + "</span>";
        var i = this._dateNextMonth(a)
          , j = i.getMonth()
          , l = i.getFullYear();
        return e = i >= c.min && new Date(l,j,1) <= c.max ? e + '<a href="javascript:" class="' + d + 'next" data-month="' + nextMonth + '">' + this.svg + "</a>" : e + '<span class="' + d + 'next">' + this.svg + "</span>",
        e = e + '<a href="javascript:" class="' + d + 'switch" data-type="month">' + a.slice(0, 2).join("-") + "</a>		</div>",
        e += c.html,
        e = new Date >= c.min && new Date <= c.max ? e + '<a href="javascript:" class="' + d + "item " + d + 'now">今天</a>' : e + '<span class="' + d + "item " + d + 'now">今天</span>',
        e += "</div>",
        this.el.container.attr("data-type", "date").html(e),
        this
    }
    ,
    n.prototype["date-range"] = function() {
        var a = this[k]
          , b = this.el.container.data("date") || a[0];
        this.el.container.data("date", b);
        var c = b[1] - 1
          , f = 1 * b[1] + 1
          , g = this._calendar(b)
          , h = '<div class="' + e + 'x">';
        h = h + '<div class="' + d + 'head">			<div class="' + d + 'half">';
        var i = new Date(b[0],c,b[2]);
        h = i >= g.min && i <= g.max ? h + '<a href="javascript:" class="' + d + 'prev" data-month="' + c + '">' + this.svg + "</a>" : h + '<span class="' + d + 'prev">' + this.svg + "</span>",
        h = h + '<span class="' + d + 'switch">' + new Date(b[0],c,b[2]).toArray().slice(0, 2).join("-") + '</span>		</div>		<div class="' + d + 'half">';
        var j = new Date(b[0],b[1],1)
          , l = new Date(b[0],f,b[2]);
        return h = l > g.min - 1 && l <= g.max ? h + '<a href="javascript:" class="' + d + 'next" data-month="' + f + '">' + this.svg + "</a>" : h + '<span class="' + d + 'next">' + this.svg + "</span>",
        h = h + '<span class="' + d + 'switch">' + j.toArray().slice(0, 2).join("-") + "</span>		</div>",
        h += "</div>",
        h = h + '<div class="' + e + 'body"><div class="' + d + 'half">' + g.html + '</div><div class="' + d + 'half">' + this._calendar(j.toArray()).html + "</div></div>",
        h = h + '<div class="' + e + 'footer"><a href="javascript:;" class="ui_button ui_button_primary" data-type="ensure">确定</a><a href="javascript:;" class="ui_button" data-type="cancel">取消</a></div>',
        h += "</div>",
        this.el.container.attr("data-type", "date-range").html(h),
        this
    }
    ,
    n.prototype._month = function(a) {
        var b = this.el.input
          , c = b.attr("min") || this.min
          , e = b.attr("max") || this.max
          , f = $.map([c, e], function(a, b) {
            return a = "object" == typeof a && a.getTime ? a.toArray().slice(0, 2).join("") : "string" == typeof a && 0 == /\D/.test(a.replace(m, "")) ? a.replace(m, "").slice(0, 6) : b ? "999912" : "000000"
        });
        c = f[0],
        e = f[1];
        var g = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"]
          , i = 1 * a[0]
          , j = this.type
          , l = '<div class="' + h + 'body">' + function() {
            for (var b = "", f = "", h = "", l = 1; 12 >= l; l += 1) {
                if (h = 10 > l ? "0" + l : l + "",
                f = d + "item",
                "month" == j)
                    l == a[1] && (f = f + " " + k);
                else if ("month-range" == j) {
                    var m = this[k][0].slice(0, 2).join("")
                      , n = this[k][1].slice(0, 2).join("")
                      , o = i + h;
                    o >= m && n >= o && (f = f + " " + k)
                }
                b = i + h >= c && e >= i + h ? b + '<a href="javascript:" class="' + f + '" data-year="' + i + '" data-value="' + h + '">' + g[l - 1] + "月</a>" : b + '<span class="' + f + '" data-value="' + h + '">' + g[l - 1] + "月</span>"
            }
            return b
        }
        .call(this) + "</div>";
        return {
            html: l,
            min: c,
            max: e
        }
    }
    ,
    n.prototype.month = function() {
        var a = this[k]
          , b = this._month(a)
          , c = b.min
          , e = b.max
          , f = '<div class="' + h + 'x">'
          , g = 1 * a[0];
        f = f + '<div class="' + d + 'head">',
        f = g - 1 >= Math.floor(c / 100) && g - 1 <= Math.floor(e / 100) ? f + '<a href="javascript:" class="' + d + 'prev" data-year="' + (g - 1) + '">' + this.svg + "</a>" : f + '<span class="' + d + 'prev">' + this.svg + "</span>",
        f = g + 1 >= Math.floor(c / 100) && g + 1 <= Math.floor(e / 100) ? f + '<a href="javascript:" class="' + d + 'next" data-year="' + (g + 1) + '">' + this.svg + "</a>" : f + '<span class="' + d + 'next">' + this.svg + "</span>",
        f = f + '<a href="javascript:" class="' + d + 'switch" data-type="year">' + g + "</a>		</div>",
        f += b.html;
        var i = (new Date).toArray().slice(0, 2).join("");
        return f = i >= c && e >= i ? f + '<a href="javascript:" class="' + d + "item " + d + 'now">今月</a>' : f + '<span class="' + d + "item " + d + 'now">今月</span>',
        f += "</div>",
        this.el.container.attr("data-type", "month").html(f),
        this
    }
    ,
    n.prototype["month-range"] = function() {
        var a = this[k]
          , b = this.el.container.data("date") || a[0];
        this.el.container.data("date", b);
        var c = 1 * b[0] - 1
          , f = 1 * b[0] + 1
          , g = this._month(b)
          , h = g.max.slice(0, 4)
          , i = g.min.slice(0, 4)
          , j = '<div class="' + e + 'x">';
        return j = j + '<div class="' + d + 'head">			<div class="' + d + 'half">',
        j = c >= i && h >= c ? j + '<a href="javascript:" class="' + d + 'prev" data-year="' + c + '">' + this.svg + "</a>" : j + '<span class="' + d + 'prev">' + this.svg + "</span>",
        j = j + '<span class="' + d + 'switch">' + b[0] + '</span>		</div>		<div class="' + d + 'half">',
        j = f >= i && h > f ? j + '<a href="javascript:" class="' + d + 'next" data-year="' + f + '">' + this.svg + "</a>" : j + '<span class="' + d + 'next">' + this.svg + "</span>",
        j = j + '<span class="' + d + 'switch">' + f + "</span>		</div>",
        j += "</div>",
        j = j + '<div class="' + e + 'body"><div class="' + d + 'half">' + g.html + '</div><div class="' + d + 'half">' + this._month([f, b[1], b[2]]).html + "</div></div>",
        j = j + '<div class="' + e + 'footer"><a href="javascript:;" class="ui_button ui_button_primary" data-type="ensure">确定</a><a href="javascript:;" class="ui_button" data-type="cancel">取消</a></div>',
        j += "</div>",
        this.el.container.attr("data-type", "month-range").html(j),
        this
    }
    ,
    n.prototype.year = function() {
        var a = this[k]
          , b = this.el.input
          , c = b.attr("min") || this.min
          , e = b.attr("max") || this.max;
        c = "object" == typeof c && c.getFullYear ? c.getFullYear() : "string" == typeof c && 0 == /\D/.test(c.replace(m, "")) ? c.toDate().getFullYear() : 0,
        e = "object" == typeof e && e.getFullYear ? e.getFullYear() : "string" == typeof e && 0 == /\D/.test(e.replace(m, "")) ? e.toDate().getFullYear() : 9999;
        var f = '<div class="' + g + 'x">'
          , h = a[0];
        f = f + '<div class="' + d + 'head">',
        f = h - 12 >= c && e >= h - 12 ? f + '<a href="javascript:" class="' + d + 'prev" data-year="' + (h - 12) + '">' + this.svg + "</a>" : f + '<span class="' + d + 'prev">' + this.svg + "</span>",
        f = h + 12 >= c && e >= h + 12 ? f + '<a href="javascript:" class="' + d + 'next" data-year="' + (h + 12) + '">' + this.svg + "</a>" : f + '<span class="' + d + 'next">' + this.svg + "</span>",
        f = f + '<span class="' + d + 'switch">' + [h - 6, h + 5].join("-") + "</span></div>",
        f = f + '<div class="' + g + 'body">' + function() {
            for (var a = "", b = "", f = h - 6; h + 6 > f; f += 1)
                b = d + "item",
                f == h && (b = b + " " + k),
                a = f >= c && e >= f ? a + '<a href="javascript:" class="' + b + '">' + f + "</a>" : a + '<span class="' + b + '">' + f + "</span>";
            return a
        }() + "</div>";
        var i = (new Date).getFullYear();
        return f = i >= c && e >= i ? f + '<a href="javascript:" class="' + d + "item " + d + 'now">今年</a>' : f + '<span class="' + d + "item " + d + 'now">今年</span>',
        f += "</div>",
        f += "</div>",
        this.el.container.attr("data-type", "year").html(f),
        this
    }
    ,
    n.prototype.hour = function() {
        var a = this[k]
          , b = this.el.input
          , c = 1 * b.attr("step");
        c = "hour" != this.type || !c || 1 > c ? 1 : Math.round(c);
        var e = (b.attr("min") || this.min.toString()).split(":")[0]
          , f = (b.attr("max") || this.max.toString()).split(":")[0];
        e = /\D/.test(e) ? 0 : 1 * e,
        f = /\D/.test(f) ? 24 : 1 * f;
        var g = '<div class="' + i + 'x">';
        return g = g + '<div class="' + i + 'body">' + function() {
            for (var b = "", g = "", h = "", i = 0; 24 > i; i += c)
                g = i + "",
                1 == g.length && (g = "0" + g),
                h = d + "item",
                g == a[0] && (h = h + " " + k),
                b = g >= e && f >= g ? b + '<a href="javascript:" class="' + h + '">' + g + ":00</a>" : b + '<span class="' + h + '">' + g + ":00</span>";
            return b
        }() + "</div>",
        g += "</div>",
        this.el.container.attr("data-type", "hour").html(g),
        this
    }
    ,
    n.prototype.minute = function() {
        var a = this[k]
          , b = this.el.input
          , c = 1 * b.attr("step") || 5
          , e = b.attr("min") || this.min + ""
          , f = b.attr("max") || this.max + "";
        e = "auto" == e || /\D/.test(e.replace(":", "")) || 2 != e.split(":").length ? 0 : 1 * e.replace(":", ""),
        f = "auto" == f || /\D/.test(f.replace(":", "")) || 2 != f.split(":").length ? 2359 : 1 * f.replace(":", "");
        var g = '<div class="' + j + 'x">'
          , h = 1 * a[0];
        return g = g + '<div class="' + d + 'head">',
        g = h <= Math.floor(e / 100) ? g + '<span class="' + d + 'prev">' + this.svg + "</span>" : g + '<a href="javascript:" class="' + d + 'prev" data-hour="' + (h - 1) + '">' + this.svg + "</a>",
        g = h >= Math.floor(f / 100) ? g + '<span class="' + d + 'next">' + this.svg + "</span>" : g + '<a href="javascript:" class="' + d + 'next" data-hour="' + (h + 1) + '">' + this.svg + "</a>",
        g = g + '<a href="javascript:" class="' + d + 'switch" data-type="hour">' + a[0] + ":00</a></div>",
        g = g + '<div class="' + j + 'body">' + function() {
            for (var b = "", g = "", h = "", i = 0; 60 > i; i += c)
                g = i + "",
                1 == g.length && (g = "0" + g),
                h = d + "item",
                1 * (a[0] + g) >= e && 1 * (a[0] + g) <= f ? (g == a[1] && (h = h + " " + k),
                b = b + '<a href="javascript:" class="' + h + '">' + [a[0], g].join(":") + "</a>") : b = b + '<span class="' + h + '">' + [a[0], g].join(":") + "</span>";
            return b
        }() + "</div>",
        g += "</div>",
        this.el.container.attr("data-type", "minute").html(g),
        this
    }
    ,
    n.prototype.show = function() {
        var a = this.el.container;
        return this.format(),
        "time" == this.type ? this.minute() : "date-range" == this.type ? (this._rangeSelected || (this._rangeSelected = this[k]),
        this["date-range"]()) : "month-range" == this.type ? (this._rangeSelected || (this._rangeSelected = this[k]),
        this["month-range"]()) : this[this.type] ? this[this.type]() : this.date(),
        0 == $.contains($(document.body), a) && $(document.body).append(a),
        a.show().follow(this.el.trigger.addClass(l), {
            position: "4-1"
        }),
        $.isFunction(this.callback.show) && this.callback.show.call(this, this.el.input, a),
        this.display = !0,
        this
    }
    ,
    n.prototype.hide = function() {
        return this.el.container.hide(),
        this.el.trigger.removeClass(l),
        $.isFunction(this.callback.hide) && this.callback.hide.call(this, this.el.input, this.el.container),
        this.display = !1,
        this
    }
    ,
    $.fn.dateTime = function(a) {
        return $(this).each(function() {
            $(this).data("dateTime", new n($(this),a))
        })
    }
    ,
    n
});
