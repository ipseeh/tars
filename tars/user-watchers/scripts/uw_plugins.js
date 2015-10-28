'use strict';

/**
 * Watcher for plugins Js files files
 */
module.exports = function () {
  return tars.packages.chokidar.watch('src/scripts/plugins/**/*.js', {
    ignored: '',
    persistent: true,
    ignoreInitial: true
  }).on('all', function (event, path) {
    tars.helpers.watcherLog(event, path);
    tars.packages.gulp.start('scripts:ut_plugins');
  });
};
