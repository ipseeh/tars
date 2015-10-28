'use strict';

var gulp = tars.packages.gulp;
var spritesmith = tars.packages.spritesmith;
var plumber = tars.packages.plumber;
var notifier = tars.helpers.notifier;

var staticFolderName = tars.config.fs.staticFolderName;
var imagesFolderName = tars.config.fs.imagesFolderName;
var dpi = tars.config.useImagesForDisplayWithDpi;

/**
 * Make sprite and stylus for this sprite
 */
module.exports = function () {

    return gulp.task('css:make-sprite', function () {

        var spriteData = [];
        var dpiLength = dpi.length;
        var dpi192 = false;
        var dpi288 = false;
        var dpi384 = false;
        var i = 0;

        for (i = 0; i < dpiLength; i++) {
            if (dpi[i] == 192) {
                dpi192 = true;
            } else if (dpi[i] === 288) {
                dpi288 = true;
            } else if (dpi[i] === 384) {
                dpi384 = true;
            }
        }

        for (i = 0; i < dpiLength; i++) {
            spriteData.push(gulp.src('./markup/' + staticFolderName + '/' + imagesFolderName + '/sprite/' + dpi[i] + 'dpi/*.png')
                .pipe(plumber({
                    errorHandler: function (error) {
                        notifier.error('An error occurred while making png-sprite.', error);
                        this.emit('end');
                    }
                }))
                .pipe(
                    spritesmith(
                        {
                            imgName: 'sprite.png',
                            cssName: 'sprite_' + dpi[i] + '.styl',
                            Algorithms: 'diagonal',
                            cssOpts: {
                                dpi192: dpi192,
                                dpi288: dpi288,
                                dpi384: dpi384
                            },
                            padding: (i + 1) * 4,
                            cssTemplate: './markup/' + staticFolderName + '/stylus/sprite-generator-templates/stylus.sprite.mustache'
                        }
                    )
                )
            );

            spriteData[i].img.pipe(gulp.dest('./dev/' + staticFolderName + '/' + imagesFolderName + '/png-sprite/' + dpi[i] + 'dpi/'))
                .pipe(
                    notifier.success('Sprite img with dpi = ' + dpi[i] + ' is ready')
                );
        }

        return spriteData[0].css.pipe(gulp.dest('./markup/' + staticFolderName + '/stylus/sprites-stylus/'))
                .pipe(
                    notifier.success('Stylus for sprites is ready')
                );
    });
};