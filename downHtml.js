"use strict";
var fs = require('fs');
var http = require('http');
var path = require('path');
var r_url = require('url');

var dirCache = {};//缓存减少判断
function makedir (pathStr, callback) {
    if (dirCache[pathStr] == 1) {
        callback();
    } else {
        fs.exists(pathStr, function (exists) {
            if (exists == true) {
                dirCache[pathStr] == 1;
                callback();
            } else {
                makedir(path.dirname(pathStr), function () {
                    fs.mkdir(pathStr, function () {
                        dirCache[pathStr] == 1;
                        callback();
                    })
                });
            }
        })
    }
};

var reg = /url\(['"]?.*?(\1)\)/g
var reg2 = /url\s*\((['"]?)(((?!(data:image|about:blank)).)*?)(\1)\)/
var isDownMap = {};
var ix = 0,iy=0;
var downImgFromCss = function (URL) {
    http.get(URL, function(res) {
        //console.log(path.resolve(process.cwd(), 'index.min.css'))
        //res.pipe(fs.createWriteStream(path.resolve(process.cwd(), 'index.min.css')));
        var body = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            var match = body.match(reg);
            for (var i = 0, len = match?match.length:0; i < len; i++){
                var m = match[i].match(reg2);
                if (m && m[2]) {
                    var url = m[2];
                    let imgUrl = r_url.resolve(URL, url);
                    if (!isDownMap[imgUrl]) {
                        var uo = r_url.parse(imgUrl);
                        let filepath = CWD + '/' + uo.hostname + uo.pathname;
                        makedir(path.dirname(filepath), function () {
                            http.get(imgUrl, function (res) {
                                res.pipe(fs.createWriteStream(filepath));
                            });
                        })
                        isDownMap[imgUrl] = 1;
                    }
                }
            }
        });
    });
}

var URLS = process.argv[2].split(',');
var t = new Date();
var urlReg = /(data:image|about:blank)+/;
function minW(num){
  return (num>9?'':'0')+num;
}
var str = [t.getFullYear(),t.getMonth()+1,t.getDay(),'/',minW(t.getHours()),minW(t.getMinutes()),minW(t.getSeconds())].join('');
var CWD = process.cwd()+'/'+str;
//下载资源
URLS.forEach(function (URL) {
    var uo = r_url.parse(URL);
    var filepath;
    if (uo.pathname == '/' || uo.pathname == '') {
        filepath = CWD + '/' + uo.hostname + '/index.html';
    } else {
        filepath = CWD + '/' + uo.hostname + uo.pathname;
    }
    (!uo.hostname||urlReg.test(URL))||makedir(path.dirname(filepath), function () {
        http.get(URL, function (res) {
            if (URL.indexOf('.css') != -1 || (res.headers["content-type"] && res.headers["content-type"].indexOf('text/css')!= -1)) {
                console.log('down images form css file:' + URL + '.');
                downImgFromCss(URL);
            }
            res.pipe(fs.createWriteStream(filepath));
        })
    });
});
