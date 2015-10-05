'use strict';

var gulp = tars.packages.gulp;
var jade = tars.packages.jade;
var tarsConfig = tars.config;
var notify = tars.packages.notify;
var notifier = tars.helpers.notifier;
var browserSync = tars.packages.browserSync;

/**
 * Compile jade-files
 */
module.exports = function () {
  return gulp.task('compile:jade', function (cb) {
    return gulp.src('./src/views/*.jade')
      .on('error', notify.onError(function (error) {
        return '\nAn error occurred while compiling jade.\nLook in the console for details.\n' + error;
      }))
      .pipe(jade({ pretty: true }))
      .pipe(gulp.dest('dev'))
      .pipe(browserSync.reload({stream:true}))
      .pipe(notifier('Jade-files\'ve been compiled'));
  });
};
