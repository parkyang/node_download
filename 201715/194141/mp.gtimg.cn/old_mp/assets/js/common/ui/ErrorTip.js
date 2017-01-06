define("common/ui/ErrorTip",["plugin/jquery","common/ui/Follow"],function(a,b,c){a("plugin/jquery"),a("common/ui/Follow");var d="ui_tips",e=d+"_";$.fn.errorTip=function(a,b){var c={unique:!0,align:"center",onShow:$.noop,onHide:$.noop},f=$.extend({},c,b||{});return $.isFunction(a)&&(a=a()),"string"!=typeof a?this:$(this).each(function(b,c){if(!(1==f.unique&&b>0)){var g,h,i,j=$(this);if(1==f.unique&&window.errorTip)g=errorTip.data("trigger",j);else if(0==f.unique&&j.data("errorTip"))g=j.data("errorTip");else{g=$('<div class="'+e+"x "+e+'error"></div>').html('<span class="'+e+'before"></span><i class="'+e+'after"></i>'),$(document.body).append(g.append(h).append(i)),1==f.unique?window.errorTip=g.data("trigger",j):j.data("errorTip",g);var k=function(){"none"!=g.css("display")&&(g.hide(),f.onHide.call((g.data("trigger")||j).removeClass("error"),g))};$(document).bind({keydown:function(a){16!=a.keyCode&&17!=a.keyCode&&k()},mousedown:function(a){var b=document.activeElement,c=g.data("trigger"),d=a.target;b&&c&&b==d&&b==c.get(0)&&0==c.data("focus")||k()}}),$(window).bind({resize:k})}g.show(),h=g.find("span"),i=g.find("i"),h.html(a);var l=0;"left"==f.align?l=-.5*h.width()+parseInt(h.css("padding-left"))||0:"right"==f.align?l=.5*h.width()-parseInt(h.css("padding-right"))||0:"number"==typeof f.align&&(l=f.align),i.css({left:l}),g.follow(j,{align:f.align,position:"5-7",edgeAdjust:!1});var m=1*g.css("zIndex")||19,n=m;$("body").children().each(function(){var a;0==$(this).hasClass(d)&&(a=1*$(this).css("zIndex"))&&(n=Math.max(a,n))}),n>m&&g.css("zIndex",n+1),f.onShow.call(j.addClass("error valided"),g)}})};var f=function(a,b,c){return a.errorTip(b,c),this.el={trigger:a},this.cl=d,this};return f});