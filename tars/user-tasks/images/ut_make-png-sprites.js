'use strict';

var gulp = tars.packages.gulp;
var spritesmith = tars.packages.spritesmith;
var plumber = tars.packages.plumber;
var notifier = tars.helpers.notifier;
var browserSync = tars.packages.browserSync;

var staticFolderName = tars.config.fs.staticFolderName;
var imagesFolderName = tars.config.fs.imagesFolderName;
var dpi = tars.config.useImagesForDisplayWithDpi;

/**
 * Make sprite and stylus for this sprite
 */
module.exports = function () {
  return gulp.task('imgages:ut_make-png-sprites', function () {
    var spriteData = [];
    var dpiLength = dpi.length;
    var dpi192 = false;
    var dpi288 = false;
    var dpi384 = false;
    var i = 0;

    for (i = 0; i < dpiLength; i++) {
      if (dpi[i] === 192) {
        dpi192 = true;
      } else if (dpi[i] === 288) {
        dpi288 = true;
      } else if (dpi[i] === 384) {
        dpi384 = true;
      }
    }

    for (i = 0; i < dpiLength; i++) {
      spriteData.push(gulp.src('./src/images/_png-sprites/' + dpi[i] + 'dpi/*.png')
        .pipe(plumber({
          errorHandler: function (error) {
            notifier.error('An error occurred while making png-sprite.', error);
            this.emit('end');
          }
        }))
        .pipe(spritesmith({
          imgName: 'sprite_' + dpi[i] + '.png',
          cssName: 'png-sprites.styl',
          Algorithms: 'binary-tree',
          cssOpts: {
            dpi192: dpi192,
            dpi288: dpi288,
            dpi384: dpi384
          },
          padding: (i + 1) * 4,
          cssTemplate: './tars/user-tasks/generators/png-sprites.hbs'
        }))
      );

      spriteData[i].img.pipe(gulp.dest('./dev/img/png-sprites/'))
        .pipe(notifier.success('Sprite img with dpi = ' + dpi[i] + ' is ready'));
    }

    return spriteData[0].css.pipe(gulp.dest('./src/styles/sprites/'))
      .pipe(browserSync.reload({stream: true}))
      .pipe(notifier.success('Stylus for sprites is ready'));
  });
};
