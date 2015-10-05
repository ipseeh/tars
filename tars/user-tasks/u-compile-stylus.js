'use strict';

var gulp = tars.packages.gulp;
var stylus = tars.packages.stylus;
var autoprefixer = tars.packages.autoprefixer;
var postcss = tars.packages.postcss;
var tarsConfig = tars.config;
var notify = tars.packages.notify;
var notifier = tars.helpers.notifier;
var browserSync = tars.packages.browserSync;

var lost = require('lost');
var rupture = require('rupture');
var typographic = require('typographic');

// var postcssProcessors = tars.config.postcss;
var processors = [autoprefixer({browsers: tars.config.autoprefixerConfig}), lost()];


/**
 * Compile stylus-files
 */
module.exports = function () {
  return gulp.task('compile:stylus', function (cb) {
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
      .pipe(browserSync.reload({stream:true}))
      .pipe(notifier('Stylus-files\'ve been compiled'));
  });
};
