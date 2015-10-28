'use strict';

var gulp = tars.packages.gulp;
var tarsConfig = tars.config;
var csso = tars.packages.csso;
var rename = tars.packages.rename;
var plumber = tars.packages.plumber;
var notifier = tars.helpers.notifier;

/**
 * Compress css-files
 */
module.exports = function () {
  return gulp.task('styles:ut_compress-css', function () {
    return gulp.src(tars.options.build.path + '/css/*.css')
      .pipe(plumber({
        errorHandler: function (error) {
          notifier.error('An error occurred while compressing css.', error);
        }
      }))
      .pipe(csso())
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest(tars.options.build.path + '/css/'))
      .pipe(
        notifier.success('Css\'ve been minified')
      );
  });
};
