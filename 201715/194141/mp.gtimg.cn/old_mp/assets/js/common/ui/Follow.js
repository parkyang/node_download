define("common/ui/Follow",["plugin/jquery"],function(a,b,c){a("plugin/jquery"),$.fn.follow=function(a,b){var c={offsets:{x:0,y:0},position:"4-1",edgeAdjust:!0},d=$.extend({},c,b||{});return $(this).each(function(){var b=$(this);if(0!=a.length){var e,f,g,h,i,j=0,k=0,l=b.data("height"),m=b.data("width"),n=$(window).scrollTop(),o=$(window).scrollLeft(),p=parseInt(d.offsets.x,10)||0,q=parseInt(d.offsets.y,10)||0;this.cacheData;l||(l=b.outerHeight()),m||(m=b.outerWidth()),e=a.offset(),j=a.outerHeight(),k=a.outerWidth(),f=e.left,g=e.top;var r,s=["4-1","1-4","5-7","2-3","2-1","6-8","3-4","4-3","8-6","1-2","7-5","3-2"],t=d.position,u=!1;$.each(s,function(a,b){return b===t?void(u=!0):void 0}),u||(t=c.position);var v=function(a){var b="bottom";switch(a){case"1-4":case"5-7":case"2-3":b="top";break;case"2-1":case"6-8":case"3-4":b="right";break;case"1-2":case"8-6":case"4-3":b="left";break;case"4-1":case"7-5":case"3-2":b="bottom"}return b},w=function(a){return"5-7"===a||"6-8"===a||"8-6"===a||"7-5"===a?!0:!1},x=function(a){var b=0,c=0;if("right"===a){if(c=f+k+m+p,c>$(window).width())return!1}else if("bottom"===a){if(b=g+j+l+q,b>n+$(window).height())return!1}else if("top"===a){if(b=l+q,b>g-n)return!1}else if("left"===a&&(c=m+p,c>f))return!1;return!0};r=v(t),d.edgeAdjust&&(x(r)?!function(){if(!w(t)){var a,b={top:{right:"2-3",left:"1-4"},right:{top:"2-1",bottom:"3-4"},bottom:{right:"3-2",left:"4-1"},left:{top:"1-2",bottom:"4-3"}},c=b[r];if(c)for(a in c)x(a)||(t=c[a])}}():!function(){if(w(t)){var a={"5-7":"7-5","7-5":"5-7","6-8":"8-6","8-6":"6-8"};t=a[t]}else{var b={top:{left:"3-2",right:"4-1"},right:{bottom:"1-2",top:"4-3"},bottom:{left:"2-3",right:"1-4"},left:{bottom:"2-1",top:"3-4"}},c=b[r],d=[];for(name in c)d.push(name);t=x(d[0])||!x(d[1])?c[d[0]]:c[d[1]]}}());var y=v(t),z=t.split("-")[0];switch(y){case"top":i=g-l,h="1"==z?f:"5"===z?f-(m-k)/2:f-(m-k);break;case"right":h=f+k,i="2"==z?g:"6"===z?g-(l-j)/2:g-(l-j);break;case"bottom":i=g+j,h="4"==z?f:"7"===z?f-(m-k)/2:f-(m-k);break;case"left":h=f-m,i="2"==z?g:"6"===z?g-(m-k)/2:g-(l-j)}if(d.edgeAdjust&&w(t)){var A=$(window).width(),B=$(window).height();"7-5"==t||"5-7"==t?.5*A>h-o?0>h-o&&(h=o):h-o+m>A&&(h=A+o-m):.5*B>i-n?0>i-n&&(i=n):i-n+l>B&&(i=B+n-l)}"top"==y||"left"==y?(h-=p,i-=q):(h+=p,i+=q),b.css({position:"absolute",left:Math.round(h),top:Math.round(i)}).attr("data-align",t)}})};var d=function(a,b,c){b.follow(a,c)};return d.prototype.hide=function(){target.remove()},d});