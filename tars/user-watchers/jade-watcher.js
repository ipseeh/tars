'use strict';

var gulp = require('gulp');
var gutil = tars.packages.gutil;
var chokidar = tars.packages.chokidar;
var watcherLog = tars.helpers.watcherLog;

/**
 * This is an example of watcher
 */
module.exports = function () {
    return chokidar.watch('./src/views/**/*.{jade,html,txt,md}', {
        ignored: '/^_/',
        persistent: true,
        ignoreInitial: true
    }).on('all', function (event, path) {
        watcherLog(event, path);
        // You could start many tasks
        gulp.start('jade:compile');
    });
};
