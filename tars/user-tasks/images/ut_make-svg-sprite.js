'use strict';

var gulp = tars.packages.gulp;
var tarsConfig = tars.config;
var gulpif = tars.packages.gulpif;
var svgspritesheet = tars.packages.svgspritesheet;
var imagemin = tars.packages.imagemin;
var svg2png = tars.packages.svg2png;
var gutil = tars.packages.gutil;
var plumber = tars.packages.plumber;
var notifier = tars.helpers.notifier;
var browserSync = tars.packages.browserSync;

var staticFolderName = tars.config.fs.staticFolderName;
var imagesFolderName = tars.config.fs.imagesFolderName;

module.exports = function () {
  return gulp.task('images:ut_make-svg-sprite', function (cb) {
    if (tars.config.useSVG) {
      return gulp.src('./src/images/_svg-sprite/*.svg')
        .pipe(plumber({
          errorHandler: function (error) {
            notifier.error('An error occurred while making fallback for svg.', error);
            this.emit('end');
          }
        }))
        .pipe(imagemin({
          svgoPlugins: [
            {cleanupIDs:      false},
            {removeViewBox:   false},
            {convertPathData: false},
            {mergePaths:      false}
          ],
          use: []
        }))
        .pipe(svgspritesheet({
          cssPathNoSvg: '%c%svg-sprite.png',
          cssPathSvg: '%c%svg-sprite.svg',
          padding: 10,
          positioning: 'packed',
          templateDest: './src/styles/sprites/svg-sprite.styl',
          templateSrc: './tars/user-tasks/generators/svg-sprite.hbs'
        }))
        .pipe(gulp.dest('./dev/img/svg-sprite.svg'))
        .pipe(gulpif(tars.flags.ie8 || tars.flags.ie, svg2png()))
        .pipe(gulpif(tars.flags.ie8 || tars.flags.ie, gulp.dest('./dev/img/svg-sprite.png')))
        .pipe(browserSync.reload({stream: true}))
        .pipe(notifier.success('Stylus for svg-sprite is ready'));
    } else {
      gutil.log('!SVG is not used!');
      cb(null);
    }
  });
};
