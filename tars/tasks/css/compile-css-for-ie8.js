'use strict';

var gulp = tars.packages.gulp;
var gutil = tars.packages.gutil;
var concat = tars.packages.concat;
var stylus = tars.packages.stylus;
var plumber = tars.packages.plumber;
var autoprefixer = tars.packages.autoprefixer;
tars.packages.promisePolyfill.polyfill();
var postcss = tars.packages.postcss;
var replace = tars.packages.replace;
var plumber = tars.packages.plumber;
var notifier = tars.helpers.notifier;
var browserSync = tars.packages.browserSync;

var postcssProcessors = tars.config.postcss;
var stylusFolderPath = './markup/' + tars.config.fs.staticFolderName + '/stylus';
var stylusFilesToConcatinate = [
        stylusFolderPath + '/normalize.styl',
        stylusFolderPath + '/libraries/**/*.styl',
        stylusFolderPath + '/libraries/**/*.css',
        stylusFolderPath + '/mixins.styl',
        stylusFolderPath + '/sprites-stylus/sprite_96.styl',
        stylusFolderPath + '/sprites-stylus/sprite-png-ie.styl'
    ];
var patterns = [];
var processors = [];

if (postcssProcessors && postcssProcessors.length) {
    postcssProcessors.forEach(function (processor) {
        processors.push(require(processor.name)(processor.options));
    });
}

processors.push(autoprefixer({browsers: ['ie 8']}));

if (tars.config.useSVG) {
    stylusFilesToConcatinate.push(
        stylusFolderPath + '/sprites-stylus/svg-fallback-sprite.styl'
    );
}

stylusFilesToConcatinate.push(
    stylusFolderPath + '/fonts.styl',
    stylusFolderPath + '/vars.styl',
    stylusFolderPath + '/GUI.styl',
    stylusFolderPath + '/common.styl',
    stylusFolderPath + '/plugins/**/*.styl',
    stylusFolderPath + '/plugins/**/*.css',
    './markup/modules/*/*.styl',
    './markup/modules/*/ie/ie8.styl',
    stylusFolderPath + '/etc/**/*.styl',
    '!./**/_*.styl',
    '!./**/_*.css'
);

patterns.push(
    {
        match: '%=staticPrefixForCss=%',
        replacement: tars.config.staticPrefixForCss()
    }
);

/**
 * Stylus compilation for ie8
 */
module.exports = function () {

    return gulp.task('css:compile-css-for-ie8', function (cb) {
        if (tars.flags.ie8 || tars.flags.ie) {
            return gulp.src(stylusFilesToConcatinate, { base: process.cwd() })
                .pipe(plumber({
                    errorHandler: function (error) {
                        notifier.error('An error occurred while compiling css for IE8.', error);
                        this.emit('end');
                    }
                }))
                .pipe(concat('main_ie8' + tars.options.build.hash + '.styl'))
                .pipe(replace({
                    patterns: patterns,
                    usePrefix: false
                }))
                .pipe(stylus({
                    'resolve url': true,
                    'include css': true
                }))
                .pipe(postcss(processors))
                .pipe(gulp.dest('./dev/' + tars.config.fs.staticFolderName + '/css/'))
                .pipe(browserSync.reload({ stream: true }))
                .pipe(
                    notifier.success('Styl-files for IE8 have been compiled')
                );
        } else {
            gutil.log('!Stylies for IE8 are not used!');
            cb(null);
        }
    });
};
