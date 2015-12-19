'use strict';

var gulp = tars.packages.gulp;
var concat = tars.packages.concat;
var streamCombiner = tars.packages.streamCombiner;
var uglify = tars.packages.uglify;
var plumber = tars.packages.plumber;
var gulpif = tars.packages.gulpif;
var rename = tars.packages.rename;
var babel = tars.packages.babel;
var stripDebug = tars.packages.stripDebug;
var sourcemaps = tars.packages.sourcemaps;
var notifier = tars.helpers.notifier;
var browserSync = tars.packages.browserSync;
var cwd = process.cwd();
var path = require('path');

var staticFolderName = tars.config.fs.staticFolderName;
var destFolder = './dev/js';
var destFolderMin = tars.options.build.path + '/js/';
var compressJs = tars.flags.release || tars.flags.min;
var generateSourceMaps = tars.config.sourcemaps.js.active && !tars.flags.release;
var sourceMapsDest = tars.config.sourcemaps.js.inline ? '' : '.';
var jsPaths = [
  '!./src/modules/**/data/data.js',
  tars.config.jsPathsToConcatBeforeModulesJs,
  './src/modules/*/*.js',
  './src/scripts/app.js',
  tars.config.jsPathsToConcatAfterModulesJs,
  '!./src/scripts/plugins/**/*.js',
  '!./src/scripts/vendors/**/*.js'
];

jsPaths = [].concat.apply([], jsPaths);


/**
 * Stream of base processing with JavaScript.
 * ------------------------------------------
 * There are:
 *  - concat js files;
 *  - add hash like a suffix of filename;
 *  - write header in the start of main file;
 *  - write footer in the end of main file;
 *  - write source map;
 *  - write main file at fs.
 */
function base() {
  return streamCombiner(
    gulpif(tars.config.useBabel, babel({
      babelrc: path.resolve(cwd + '/.babelrc')
    })),
    concat({cwd: cwd, path: 'app.js'}),
    rename({ suffix: tars.options.build.hash }),
    gulpif(generateSourceMaps, sourcemaps.write(sourceMapsDest)),
    gulp.dest(destFolder)
  );
}

/**
 * Stream of minimized with JavaScript.
 * ------------------------------------
 * There are:
 *  - removing `condole.log()` and `debug`;
 *  - uglified code;
 *  - add '.min' suffix for main file;
 *  - write source maps;
 *  - write main file at fs.
 */
function compress() {
  return streamCombiner(
    gulpif(tars.config.removeConsoleLog, stripDebug()),
    uglify({ mangle: false }),
    rename({ suffix: '.min' }),
    gulpif(generateSourceMaps, sourcemaps.write(sourceMapsDest)),
    gulp.dest(destFolderMin)
  );
}

module.exports = function () {
  /**
   * Task for processing with JavaScript files.
   * ------------------------------------------
   * There are:
   *  - call lint task;
   *  - prevent pipe breaking;
   *  - creation of stream;
   *  - init source maps;
   *  - base processing;
   *  - compress code;
   *  - notify about end of task;
   *  - reloading browser's page.
   */
  return gulp.task('scripts:ut_processing', ['scripts:ut_check'], function () {
    return gulp.src(jsPaths, { base: cwd })
      .pipe(plumber({
        errorHandler: function (error) {
          notifier.error('An error occurred while processing js-files.', error);
        }
      }))
      .pipe(gulpif(generateSourceMaps, sourcemaps.init()))
      .pipe(base())
      .pipe(gulpif(compressJs, compress(destFolder)))
      .pipe(notifier.success('JavaScript has been processed'))
      .pipe(browserSync.reload({ stream: true }));
  });
};
