'use strict';

/**
 * Watcher for images for sprite (svg)
 */
module.exports = function () {

  if (tars.config.useSVG) {
    return tars.packages.chokidar.watch('src/images/_png-sprites/**/*.png', {
      ignored: '',
      persistent: true,
      ignoreInitial: true
    }).on('all', function (event, path) {
      tars.helpers.watcherLog(event, path);
      tars.packages.gulp.start('imgages:ut_make-png-sprites');
    });
  } else {
    return;
  }
};
