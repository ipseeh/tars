'use strict';

var gulp = tars.packages.gulp;
var tarsConfig = tars.config;
var gutil = tars.packages.gutil;
var jade = tars.packages.jade;
var data = tars.packages.data;
var replace = tars.packages.replace;
var through2 = tars.packages.through2;
var path = require('path');
var fs = require('fs');
var plumber = tars.packages.plumber;
var notifier = tars.helpers.notifier;
var browserSync = tars.packages.browserSync;

/**
 * Concat all data for all modules to one file
 * @return {Object} Object with data for modules
 */
function concatModulesData() {
  var dataEntry;
  var readyModulesData;

  try {
    dataEntry = fs.readFileSync('./dev/temp/modulesData.js', 'utf8');
  } catch (er) {
    dataEntry = false;
  }

  if (dataEntry) {
    eval('readyModulesData = {' + dataEntry + '}');
  } else {
    readyModulesData = '{}';
  }

  return readyModulesData;
}

var patterns = [];

// if (!tars.flags.ie8 || !tars.flags.ie) {
//   patterns.push(
//     {
//       match: '<link href="%=staticFolder=%css/main_ie8%=hash=%%=min=%.css" rel="stylesheet" type="text/css">',
//       replacement: ''
//     }
//   );
// }

// if (!tars.flags.ie9 || !tars.flags.ie) {
//   patterns.push(
//     {
//       match: '<link href="%=staticPrefix=%css/main_ie9%=hash=%%=min=%.css" rel="stylesheet" type="text/css">',
//       replacement: ''
//     }
//   );
// }

if (tars.flags.min || tars.flags.release) {
  patterns.push(
    {
      match: '%=min=%',
      replacement: '.min'
    }
  );
} else {
  patterns.push(
    {
      match: '%=min=%',
      replacement: ''
    }
  );
}

if (tars.flags.release) {
  patterns.push(
    {
      match: '%=hash=%',
      replacement: tars.options.build.hash
    }
  );
} else {
  patterns.push(
    {
      match: '%=hash=%',
      replacement: ''
    }
  );
}

patterns.push(
  {
    match: '%h%',
    replacement: tars.config.staticPrefix
  }
);

/**
 * Jade compilation of pages templates.
 * Templates with _ prefix won't be compiled
 */
module.exports = function () {

  return gulp.task('html:ut_compile-to-html', function (cb) {

    var modulesData, error;

    try {
      modulesData = concatModulesData();
    } catch (er) {
      error = er;
      modulesData = false;
    }

    return gulp.src(['./src/pages/**/*.jade', '!./src/pages/**/_*.jade'])
      .pipe(plumber({
        errorHandler: function (error) {
          notifier.error('An error occurred while compiling jade.', error);
          this.emit('end');
        }
      }))
      .pipe(
        modulesData
          ? jade({ pretty: true, locals: concatModulesData() })
          : through2.obj(
            function () {
              this.emit('error', new Error('An error occurred with data-files!\n' + error));
            }
          )
      )
      .pipe(replace({
        patterns: patterns,
        usePrefix: false
      }))
      .pipe(gulp.dest('./dev/'))
      .pipe(browserSync.reload({ stream: true }))
      .pipe(
        notifier.success('Templates\'ve been compiled')
      );
  });
};
