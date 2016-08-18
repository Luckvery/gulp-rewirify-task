var path       = require('path');
var gulp       = require('gulp');
var source     = require('vinyl-source-stream');
var browserify = require('browserify');
var collapse   = require('bundle-collapser/plugin');
var wrap       = require('gulp-wrap');
var pack       = require('../package');
var rename     = require('gulp-rename');
var strip      = require('gulp-strip-comments');
var rewireify  = require('rewireify');
var streamify  = require('gulp-streamify');

var getDistPath = function (subdir) {
    return path.join(__dirname, '..', pack.config.build.buildDir, subdir);
};

module.exports = function () {
    return gulp.task("build-functional", function () {
        var rewireifyOptions = {};
        return browserify(pack.main)
            .transform(rewireify, rewireifyOptions)
            .plugin(collapse)
            .bundle()
            .pipe(source(pack.main))
            .pipe(rename(pack.config.build.buildName))
            .pipe(streamify(strip()))
            .pipe(wrap({
                'src': './templateRemoveAmd.js'
            }))
            .pipe(gulp.dest(getDistPath('functional')));
    });
};