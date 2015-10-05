'use strict';

var gulp = tars.packages.gulp;
var cache = tars.packages.cache;
var tarsConfig = tars.config;
var notify = tars.packages.notify;
var notifier = tars.helpers.notifier;
var browserSync = tars.packages.browserSync;

/**
 * Move fonts-files to dev directory
 */
module.exports = function () {
  return gulp.task('move:fonts', function (cb) {
    return gulp.src('./src/fonts/**/*.*')
      .pipe(cache('fonts'))
      .on('error', notify.onError(function (error) {
        return '\nAn error occurred while moving fonts.\nLook in the console for details.\n' + error;
      }))
      .pipe(gulp.dest('./dev/fonts'))
      .pipe(browserSync.reload({stream:true}))
      .pipe(notifier('Fonts\'ve been moved'));
  });
};
