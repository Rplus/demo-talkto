'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import jade from 'gulp-jade';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import del from 'del';

let reload = browserSync.reload;

let appPath = {
  srcDir: 'app/',
  distDir: '_dist/'
};

gulp.task('html', () => {
  gulp.src(appPath.srcDir + '*.jade', {base: appPath.srcDir})
    .pipe(plumber({
      errorHandler: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(jade())
    .pipe(gulp.dest(appPath.distDir));
});

gulp.task('css', () => {
  gulp.src(appPath.srcDir + '**/*.css', {base: appPath.srcDir})
    .pipe(plumber({
      errorHandler: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(postcss([
      require('postcss-assets')({
        loadPaths: ['images']
      }),
      require('cssnext')(),
      require('autoprefixer')(),
      require('css-mqpacker'),
      require('csswring')()
    ]))
    .pipe(gulp.dest(appPath.distDir));
});

gulp.task('js', () => {
});

gulp.task('build', ['hmtl', 'css', 'js', 'image'], () => {
});

gulp.task('deploy', () => {
});

gulp.task('server', () => {
  browserSync({
    open: 'external',
    browser: 'google-chrome',
    notify: false,
    ghostMode: {
      clicks: false,
      scroll: false,
      forms: false
    },
    scrollThrottle: 500,
    startPath: appPath.distDir,
    server: ''
  });
});

gulp.task('dev', ['server'], () => {
  gulp.watch([appPath.srcDir + '*.js'], ['js', reload]);
  gulp.watch([appPath.srcDir + '**/*.{css, scss}'], ['css', reload]);
  gulp.watch([appPath.srcDir + '**/*.jade'], ['html', reload]);
});

gulp.task('clean', del.bind(null, [appPath.distDir]));

gulp.task('default', ['clean', 'build']);
