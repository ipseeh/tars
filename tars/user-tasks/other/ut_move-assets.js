'use strict';

var gulp = tars.packages.gulp;
var tarsConfig = tars.config;
var gulpif = tars.packages.gulpif;
var cache = tars.packages.cache;
var rename = tars.packages.rename;
var path = require('path');
var plumber = tars.packages.plumber;
var notifier = tars.helpers.notifier;
var browserSync = tars.packages.browserSync;

/**
 * Move files from assets modules of modules
 */
module.exports = function () {
  return gulp.task('other:ut_move-assets', function (cb) {
    return gulp.src('./src/modules/**/assets/**/*.{jpg,jpeg,png,gif,svg}')
      .pipe(plumber({
        errorHandler: function (error) {
          notifier.error('An error occurred while moving assets.', error);
        }
      }))
      .pipe(cache('assets'))
      .pipe(rename(function (filepath) {
        filepath.dirname = filepath.dirname.split(path.sep)[0];
      }))
      .pipe(gulp.dest('./dev/img/assets/'))
      .pipe(browserSync.reload({ stream: true }))
      .pipe(
        notifier.success('Assets\'ve been moved')
      );
  });
};
