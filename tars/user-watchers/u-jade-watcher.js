'use strict';

/**
 * Watcher for jade-files
 */
module.exports = function () {
  return tars.packages.chokidar.watch('./src/views/**/*.{jade,html,txt,md}', {
    ignored: '/^_/',
    persistent: true,
    ignoreInitial: true
  }).on('all', function (event, path) {
    tars.helpers.watcherLog(event, path);
    tars.packages.gulp.start('jade:compile');
  });
};
