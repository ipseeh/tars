'use strict';

var gulp = tars.packages.gulp;
var tarsConfig = tars.config;
var concat = tars.packages.concat;
var uglify = tars.packages.uglify;
var plumber = tars.packages.plumber;
var notifier = tars.helpers.notifier;
var browserSync = tars.packages.browserSync;

/**
 * Combine and minify js-plugins
 */
module.exports = function () {
  return gulp.task('scripts:ut_plugins', function (cb) {
    return gulp.src('./src/scripts/plugins/**/*.js')
      .pipe(plumber({
        errorHandler: function (error) {
          notifier.error('An error occurred while js-plugins.', error);
        }
      }))
      .pipe(concat('plugins.min.js'))
      .pipe(uglify({ mangle: false }))
      .pipe(gulp.dest('./dev/js/'))
      .pipe(browserSync.reload({stream:true}))
      .pipe(notifier.success('Js-plugins has ben processed'));
  });
};
