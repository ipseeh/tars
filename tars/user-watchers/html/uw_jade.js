'use strict';

var filesToWatch = ['src/pages/**/*.jade','src/modules/**/*.jade'];

/**
 * Watcher for templates-files of modules and pages
 */
module.exports = function () {
  return tars.packages.chokidar.watch(filesToWatch, {
    ignored: '',
    persistent: true,
    ignoreInitial: true
  }).on('all', function (event, path) {
    tars.helpers.watcherLog(event, path);
    tars.packages.gulp.start('html:ut_compile-to-html');
  });
};
