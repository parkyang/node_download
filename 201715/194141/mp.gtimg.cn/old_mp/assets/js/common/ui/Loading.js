define("common/ui/Loading",["plugin/jquery"],function(a,b,c){a("plugin/jquery");var d="ui_loading",e="ui_loading_icon",f="ui_button",g="ui_button_loading",h="_";$.fn.isLoading=function(){var a=$(this).eq(0);if(0==a.hasClass(f)){var b=a.find("."+e);return b.length&&b.is(":visible")?!0:!1}return a.hasClass(g)},$.fn.loading=function(a){return $(this).each(function(){var b=$(this);0==b.hasClass(f)?b.data("loading",new i(b,a)):b.addClass(g)})},$.fn.unloading=function(a){var b=a||0;return"number"!=typeof a&&(b=200),"undefined"==typeof a&&(a=b),$(this).each(function(c,e){var i=$(this);if(i.hasClass(f))return void i.removeClass(g);if("function"==typeof history.pushState)if(b>0){var j=i.height();i.css("min-height");i.css({height:"auto",webkitTransition:"none",transition:"none",overflow:"hidden"});var k=i.height();i.height(j),i.removeClass(d+h+"animation"),e.offsetWidth=e.offsetWidth,a!==!1&&i.addClass(d+h+"animation"),i.css({webkitTransition:"height "+b+"ms",transition:"height "+b+"ms"}),i.height(k)}else i.css({webkitTransition:"none",transition:"none"}),i.height("auto").removeClass(d);else i.height("auto")})};var i=function(a,b){var c={primary:!1,small:!1,create:!1},f=$.extend({},c,b||{}),g=a,i=null,j=null;return this._create=function(){var a=this.el.container;i=a.find("."+d),j=a.find("."+e),1==f.create&&0==i.size()?a.append(i=$("<div></div>").addClass(d)):0==f.create&&(i=a),0==j.size()&&(j=(f.small?$("<s></s>"):$("<i></i>")).addClass(e),i.empty().addClass(d).append(j),f.primary&&i.addClass(d+h+"primary")),this.el.loading=i,this.el.icon=j},this.el={container:g,loading:i,icon:j},this.show(),this};return i.prototype.show=function(){var a=this.el;return a.loading&&a.icon||this._create(),a.loading.show(),this.display=!0,this},i.prototype.hide=function(){var a=this.el,b=a.container,c=a.loading;return c&&(b.get(0)!=c.get(0)?c.hide():b.find("."+e).length&&(c.empty(),this.el.icon=null)),this.display=!1,this},i.prototype.remove=function(){var a=this.el,b=a.container,c=a.loading,e=a.icon;return c&&e&&(b.get(0)==c.get(0)?(c.removeClass(d),e.remove()):c.remove(),this.el.loading=null,this.el.icon=null),this.display=!1,this},i.prototype.end=function(a){var b=this.el,c=b.container;return c&&(c.unloading(a),0==c.find("."+e).length&&(this.el.icon=null)),this.display=!1,this},i});