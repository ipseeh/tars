'use strict';

var gulp = tars.packages.gulp;
var tarsConfig = tars.config;
var cache = tars.packages.cache;
var plumber = tars.packages.plumber;
var notifier = tars.helpers.notifier;

var staticFolderName = tars.config.fs.staticFolderName;

/**
 * Copy vendors Js-files to dev directory
 */
module.exports = function () {
  return gulp.task('scripts:ut_move-vendors', function (cb) {
    gulp.src('./src/scripts/vendors/**/*.js')
      .pipe(plumber({
        errorHandler: function (error) {
          notifier.error('An error occurred while moving vendors js-files.', error);
        }
      }))
      .pipe(cache('vendors'))
      .pipe(gulp.dest('./dev/js/vendors/'))
      .pipe(
        notifier.success('Vendors js files\'s been copied')
      );

    cb(null);
  });
};
