'use strict';

var gulp = tars.packages.gulp;
var tarsConfig = tars.config;
var gutil = tars.packages.gutil;
var imagemin = tars.packages.imagemin;
var changed = tars.packages.changed;
var plumber = tars.packages.plumber;
var notifier = tars.helpers.notifier;
var staticFolderName = tars.config.fs.staticFolderName;
var imagesFolderName = tars.config.fs.imagesFolderName;

/**
 * Minify png and jpg images
 */
module.exports = function () {
  return gulp.task('images:ut_minify-images', function (cb) {
    return gulp.src([
      './dev/img/**/*.{png, jpg, jpeg, gif}',
      '!./dev/img/svg-sprite.svg',
      '!./dev/img/svg-icons/**/*.svg'
    ])
      .pipe(plumber({
        errorHandler: function (error) {
          notifier.error('An error occurred while minifying raster images.', error);
        }
      }))
      .pipe(changed('img'))
      .pipe(imagemin())
      .pipe(gulp.dest(tars.options.build.path + '/img/'))
      .pipe(
        notifier.success('Rastered images\'ve been minified')
      );
  });
};
