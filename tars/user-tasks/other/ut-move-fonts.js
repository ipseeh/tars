'use strict';

var gulp = tars.packages.gulp;
var cache = tars.packages.cache;
var plumber = tars.packages.plumber;
var notifier = tars.helpers.notifier;
var browserSync = tars.packages.browserSync;

/**
 * Move fonts-files to dev directory
 */
module.exports = function () {
  return gulp.task('other:ut_move-fonts', function () {
    return gulp.src('./src/fonts/**/*.*')
      .pipe(plumber({
        errorHandler: function (error) {
          notifier.error('An error occurred while moving fonts.', error);
        }
      }))
      .pipe(cache('fonts'))
      .pipe(gulp.dest('./dev/fonts/'))
      .pipe(browserSync.reload({stream: true}))
      .pipe(notifier.success('Example task has been finished'));
  });
};
