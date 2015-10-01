'use strict';

// This is example of task function

var gulp = tars.packages.gulp;
var stylus = tars.packages.stylus;
var autoprefixer = tars.packages.autoprefixer;
var postcss = tars.packages.postcss;
var tarsConfig = tars.config;
var notify = tars.packages.notify;
var notifier = tars.helpers.notifier;
// Include browserSync, if you need to reload browser
var browserSync = tars.packages.browserSync;

// require('./ path to task file, which have to be done before current task');
// require('./required-task-name');

var lost = require('lost');
var rupture = require('rupture');
var typographic = require('typographic');

// var postcssProcessors = tars.config.postcss;
var processors = [autoprefixer({browsers: tars.config.autoprefixerConfig}), lost()];


/**
 * Task description
 */
module.exports = function () {

  return gulp.task('stylus:compile', /*['required-task-name'],*/ function (cb) {
    return gulp.src('./src/assets/styles/main.styl')
      .pipe(stylus({
        use: [rupture(), typographic()]
      }))
      .on('error', notify.onError(function (error) {
        return '\nAn error occurred while compiling css.\nLook in the console for details.\n' + error;
      }))
      .pipe(postcss(processors))
      .on('error', notify.onError(function (error) {
        return '\nAn error occurred while postprocessing css.\nLook in the console for details.\n' + error;
      }))
      .pipe(gulp.dest('./dev/css/'))

      // If you need to reload browser, uncomment the row below
      .pipe(browserSync.reload({stream:true}))
      .pipe(
        // You can change text of success message
        notifier('Stylus-files\'ve been compiled')
        // if you need notify after each file will be processed, you have to use
        // notifier('Example task is finished', false)
      );

    // You can return callback, if you can't return pipe
    // cb(null);
  });
};
