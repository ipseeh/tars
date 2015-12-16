'use strict';

/**
 * Watcher for font files
 */
module.exports = function () {
  return tars.packages.chokidar.watch('src/fonts/**/*.{eot,woff,ttf,svg}', {
    ignored: '',
    persistent: true,
    ignoreInitial: true
  }).on('all', function (event, path) {
    tars.helpers.watcherLog(event, path);
    tars.packages.gulp.start('other:ut_move-fonts');
  });
};
