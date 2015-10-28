'use strict';

/**
 * Watcher for images for sprite (svg)
 */
module.exports = function () {

  if (tars.config.useSVG) {
    return tars.packages.chokidar.watch('src/images/_svg-sprite/**/*.svg', {
      ignored: '',
      persistent: true,
      ignoreInitial: true
    }).on('all', function (event, path) {
      tars.helpers.watcherLog(event, path);
      tars.packages.gulp.start('images:ut_make-svg-sprite');
    });
  } else {
    return;
  }
};
