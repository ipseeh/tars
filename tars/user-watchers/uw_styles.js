'use strict';

var watcherLog = tars.helpers.watcherLog;

/**
 * Watcher for common scss(less or stylus)-files and scss(less or stylus)-files of plugins
 */
module.exports = function () {
  return tars.packages.chokidar.watch([
    'src/styles/**/*.styl',
    'src/modules/**/*.styl'
  ], {
    ignored: ['src/modules/**/ie8.styl'],
    persistent: true,
    ignoreInitial: true
  }).on('all', function (event, path) {
    watcherLog(event, path);
    tars.packages.gulp.start('styles:ut_compile-to-css');

    if (tars.flags.ie8 || tars.flags.ie) {
      tars.packages.gulp.start('css:compile-css-for-ie8');
    }
  });
};
