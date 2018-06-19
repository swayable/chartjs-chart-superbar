var browserify = require('browserify'),
  concat = require('gulp-concat'),
  eslint = require('gulp-eslint'),
  gulp = require('gulp'),
  insert = require('gulp-insert'),
  package = require('./package.json'),
  path = require('path'),
  replace = require('gulp-replace'),
  source = require('vinyl-source-stream');
  streamify = require('gulp-streamify'),
  uglify = require('gulp-uglify');

var srcDir = './src/';
var srcFiles = srcDir + '**.js';
var buildDir = './';
var docsDir = './docs/';

var header = "/*!\n\
 * chartjs-bar-plus\n\
 * Version: {{ version }}\n\
 * Released under the MIT license\n\
 */\n";

gulp.task('build', buildTask);

function buildTask() {
  var nonBundled = browserify('./src/index.js')
    .ignore('chart.js')
    .bundle()
    .pipe(source('barplus.js'))
    .pipe(insert.prepend(header))
    .pipe(streamify(replace('{{ version }}', package.version)))
    .pipe(gulp.dest(buildDir))
    .pipe(gulp.dest(docsDir))
    .pipe(streamify(uglify()))
    .pipe(streamify(concat('barplus.min.js')))
    .pipe(gulp.dest(buildDir));

  return nonBundled;

}
