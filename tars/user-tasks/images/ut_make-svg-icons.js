'use strict';

var gulp = tars.packages.gulp;
var plumber = tars.packages.plumber;
var notifier = tars.helpers.notifier;
var browserSync = tars.packages.browserSync;

var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var inject = require('gulp-inject');
var path = require('path');

// require('../html/ut_compile-to-html.js');

/**
 * SVG-icon system
 */
module.exports = function () {
  return gulp.task('images:ut_make-svg-icons', /* ['html:ut_compile-to-html'], */ function () {
    var svgs = gulp
      .src('./src/images/_svg-icons/**/*.svg')
      .pipe(plumber({
        errorHandler: function (error) {
          notifier.error('An error occurred while SVG-icons.', error);
        }
      }))
      .pipe(svgmin(function (file) {
        var prefix = path.basename(file.relative, path.extname(file.relative));
        return {
          plugins: [{
            cleanupIDs: {
              prefix: prefix + '-',
              minify: true
            }
          }]
        };
      }))
      .pipe(svgstore({inlineSvg: true}));
    function fileContents(filePath, file) {
      return file.contents.toString();
    }
    return gulp
      .src('./src/pages/meta/_svg-icons.jade')
      .pipe(inject(svgs, { transform: fileContents }))
      .pipe(gulp.dest('./src/pages/meta'))
      .pipe(browserSync.reload({stream: true}))
      .pipe(notifier.success('SVG-icons task has been finished'));
  });
};
