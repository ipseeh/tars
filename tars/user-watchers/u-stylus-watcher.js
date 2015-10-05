'use strict';

/**
 * Watcher for stylus-files
 */
module.exports = function () {
  return tars.packages.chokidar.watch('src/assets/styles/**/*.styl', {
    ignored: '',
    persistent: true,
    ignoreInitial: true
  }).on('all', function (event, path) {
    tars.helpers.watcherLog(event, path);
    tars.packages.gulp.start('stylus:compile');
  });
};
