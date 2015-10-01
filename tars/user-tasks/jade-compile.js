'use strict';

// This is example of task function

var gulp = tars.packages.gulp;
var jade = tars.packages.jade;
var tarsConfig = tars.config;
var notify = tars.packages.notify;
var notifier = tars.helpers.notifier;
// Include browserSync, if you need to reload browser
var browserSync = tars.packages.browserSync;

// require('./ path to task file, which have to be done before current task');
// require('./required-task-name');

/**
 * Task description
 */
module.exports = function () {

  return gulp.task('jade:compile', /*['required-task-name'],*/ function (cb) {
    return gulp.src('./src/views/*.jade')
      // Do stuff here
      .on('error', notify.onError(function (error) {
        return '\nAn error occurred while compiling jade.\nLook in the console for details.\n' + error;
      }))
      .pipe(jade({ pretty: true }))
      .pipe(gulp.dest('dev'))

      // If you need to reload browser, uncomment the row below
      .pipe(browserSync.reload({stream:true}))
      .pipe(
        // You can change text of success message
        notifier('Jade-files\'ve been compiled')
        // if you need notify after each file will be processed, you have to use
        // notifier('Example task is finished', false)
      );

    // You can return callback, if you can't return pipe
    // cb(null);
  });
};
