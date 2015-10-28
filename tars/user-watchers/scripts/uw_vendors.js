'use strict';

/**
 * Watcher for vendors Js files files
 */
module.exports = function () {
  return tars.packages.chokidar.watch('src/scripts/vendors/**/*.js', {
    ignored: '',
    persistent: true,
    ignoreInitial: true
  }).on('all', function (event, path) {
    tars.helpers.watcherLog(event, path);
    tars.packages.gulp.start('scripts:ut_move-vendors');
  });
};
