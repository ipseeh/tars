'use strict';

var gulp = tars.packages.gulp;
var tarsConfig = tars.config;
var notify = tars.packages.notify;
var notifier = tars.helpers.notifier;

/**
 * Move misc-files
 */
module.exports = function () {
  return gulp.task('move:misc', function (cb) {
    return gulp.src('./src/misc/**/*.*')
      .on('error', notify.onError(function (error) {
        return '\nAn error occurred while moving misc-files.\nLook in the console for details.\n' + error;
      }))
      .pipe(gulp.dest('./dev/'))
      .pipe(notifier('Misc files\'ve been moved'));
  });
};
