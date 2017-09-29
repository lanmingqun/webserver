/**
 * Created by Administrator on 2017/9/28.
 */
var fs = require("fs");
var url = require("url");
var path = require("path");

var gulp = require("gulp");
var server = require("gulp-webserver");

gulp.task("server", function () {
    gulp.src("./")
        .pipe(server({
            port: "8090",
            host: "localhost",
            livereload: true,
            directoryListing: {
                path: './',
                enable: true
            },
            middleware: function (req, res, next) {
                var urlObj = url.parse(req.url, true);
                var mockDataFile = path.join(__dirname, urlObj.search.split("?")[1] + ".json");
                fs.exists(mockDataFile, function (exists) {
                    if (!exists) {
                        var data = {
                            isSuccess: false,
                            error: "can not find this file: " + urlObj.search.split("?")[1] + ".json"
                        };
                        res.writeHead(404, {"Content-Type": "text/json;charset=UTF-8"});
                        res.end(JSON.stringify(data));
                    } else {
                        fs.readFile(mockDataFile, function (err, data) {
                            if (err) return console.error(err);
                            var data = {
                                isSuccess: true,
                                error: "",
                                data: data.toString()
                            };
                            res.writeHead(200, {
                                "Content-Type": "text/json;charset=UTF-8",
                                "Access-Control-Allow-Origin": "http://localhost:63342"
                            });
                            res.end(JSON.stringify(data));
                        });
                    }
                });
            }
        }))
});