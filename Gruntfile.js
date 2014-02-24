require("shelljs/global");

var fs = require("fs"), path = require("path");

fs.existsSync = fs.existsSync || path.existsSync;

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            build: [ "./dist/" ]
        },
        watch: {
            files: [ "./src/core.js", "./src/sdf.js" ],
            tasks: "default"
        },
        uglify: {
            grunt_beautify: {
                options: {
                    beautify: {
                        width: 80,
                        beautify: true
                    },
                    mangle: false,
                    compress: false,
                    preserveComments: "all"
                },
                files: {
                    "Gruntfile.js": [ "Gruntfile.js" ]
                }
            },
            //格式化源代码
            js_beautify: {
                options: {
                    beautify: {
                        width: 80,
                        beautify: true
                    },
                    mangle: false,
                    compress: false,
                    preserveComments: "all"
                },
                files: {
                    "./src/core.js": [ "./src/core.js" ],
                    "./src/sdf.js": [ "./src/sdf.js" ]
                }
            },
            //源代码格式化后做个备份
            backup_beautify: {
                options: {
                    beautify: {
                        width: 80,
                        beautify: true
                    },
                    mangle: false,
                    compress: false,
                    preserveComments: "all"
                },
                files: {
                    "./dist/core-debug.js": [ "./src/core.js" ],
                    "./dist/sdf-debug.js": [ "./src/sdf.js" ]
                }
            },
            min: {
                files: {
                    "./dist/calendar.min.js": [ "./src/sdf.js", "./src/core.js" ]
                }
            }
        },
        jshint: {
            all: [ "Gruntfile.js", "./src/core.js", "./src/sdf.js" ]
        },
        //合并备份的js
        concat: {
            options: {
                separator: "\r\n;"
            },
            calendar: {
                src: [ "./dist/sdf-debug.js", "./dist/core-debug.js" ],
                dest: "./dist/calendar-debug.js"
            }
        }
    });
    grunt.registerTask("copyCss", "copy css", function() {
        cp("-f", "./src/calendar.css", "./dist/calendar.css");
        cp("-f", "./examples/calendar.png", "./dist/calendar.png");
    });
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.registerTask("default", [ "clean", "uglify", "concat", "copyCss" ]);
};