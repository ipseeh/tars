'use strict';

var gulp = tars.packages.gulp;
var plumber = tars.packages.plumber;
var notifier = tars.helpers.notifier;

/**
 * Move fonts-files to dev directory
 */
module.exports = function () {
  return gulp.task('other:ut_move-misc', function () {
    return gulp.src('./src/misc/**/*.*')
      .pipe(plumber({
        errorHandler: function (error) {
          notifier.error('An error occurred while moving misc files.', error);
        }
      }))
      .pipe(gulp.dest(tars.options.build.path))
      .pipe(notifier.success('Misc files has been moved'));
  });
};
