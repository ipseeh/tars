'use strict';

var gulp = tars.packages.gulp;
var gulpif = tars.packages.gulpif;
var concat = tars.packages.concat;
var stylus = tars.packages.stylus;
var plumber = tars.packages.plumber;
var autoprefixer = tars.packages.autoprefixer;
tars.packages.promisePolyfill.polyfill();
var postcss = tars.packages.postcss;
var addsrc = tars.packages.addsrc;
var replace = tars.packages.replace;
var sourcemaps = tars.packages.sourcemaps;
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
        stylusFolderPath + '/sprites-stylus/sprite-png.styl'
    ];
var patterns = [];
var processors = [];
var processorsIE9 = [];
var generateSourceMaps = tars.config.sourcemaps.css.active && !tars.flags.release && !tars.flags.min;
var sourceMapsDest = tars.config.sourcemaps.css.inline ? '' : '.';

if (postcssProcessors && postcssProcessors.length) {
    postcssProcessors.forEach(function (processor) {
        processors.push(require(processor.name)(processor.options));
        processorsIE9.push(require(processor.name)(processor.options));
    });
}

processorsIE9.push(autoprefixer({browsers: ['ie 9']}));

if (tars.config.autoprefixerConfig) {
    processors.push(
        autoprefixer({browsers: tars.config.autoprefixerConfig})
    );
}

if (tars.config.useSVG) {
    stylusFilesToConcatinate.push(
        stylusFolderPath + '/sprites-stylus/svg-sprite.styl'
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
 * Stylus compilation
 */
module.exports = function () {

    return gulp.task('css:compile-css', function () {

        var helperStream = gulp.src(stylusFilesToConcatinate, { base: process.cwd() });
        var mainStream = helperStream.pipe(addsrc.append(stylusFolderPath + '/etc/**/*.styl'));
        var ie9Stream = helperStream.pipe(
                                addsrc.append([
                                        './markup/modules/*/ie/ie9.styl',
                                        stylusFolderPath + '/etc/**/*.styl'
                                    ])
                            );

        if (tars.flags.ie9 || tars.flags.ie) {
            ie9Stream
                .pipe(plumber({
                    errorHandler: function (error) {
                        notifier.error('An error occurred while compiling css for IE9.', error);
                        this.emit('end');
                    }
                }))
                .pipe(concat('main_ie9' + tars.options.build.hash + '.styl'))
                .pipe(replace({
                    patterns: patterns,
                    usePrefix: false
                }))
                .pipe(stylus({
                    'resolve url': true,
                    'include css': true
                }))
                .pipe(postcss(processorsIE9))
                .pipe(gulp.dest('./dev/' + tars.config.fs.staticFolderName + '/css/'))
                .pipe(browserSync.reload({ stream: true }))
                .pipe(
                    notifier.success('Stylus-files for IE9 have been compiled')
                );
        }

        return mainStream
                .pipe(plumber({
                    errorHandler: function (error) {
                        notifier.error('An error occurred while compiling css.', error);
                        this.emit('end');
                    }
                }))
                .pipe(gulpif(generateSourceMaps, sourcemaps.init()))
                .pipe(concat('main' + tars.options.build.hash + '.styl'))
                .pipe(replace({
                    patterns: patterns,
                    usePrefix: false
                }))
                .pipe(stylus({
                    'resolve url': true,
                    'include css': true
                }))
                .pipe(postcss(processors))
                .pipe(gulpif(generateSourceMaps, sourcemaps.write(sourceMapsDest)))
                .pipe(gulp.dest('./dev/' + tars.config.fs.staticFolderName + '/css/'))
                .pipe(browserSync.reload({ stream: true }))
                .pipe(
                    notifier.success('Stylus-files\'ve been compiled')
                );
    });
};
