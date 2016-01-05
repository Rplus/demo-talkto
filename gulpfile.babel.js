'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';
import svgstore from 'gulp-svgstore';
import jade from 'gulp-jade';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import data from 'gulp-data';
import del from 'del';
import fs from 'fs';

let reload = browserSync.reload;

let appPath = {
  srcDir: 'app/',
  distDir: '_dist/'
};

let info = JSON.parse(fs.readFileSync('./app/manifest.webapp', 'utf8'));

gulp.task('html', () => {
  gulp.src(appPath.srcDir + '*.jade', {base: appPath.srcDir})
    .pipe(plumber())
    .pipe(data(info))
    .pipe(jade())
    .pipe(gulp.dest(appPath.distDir));
});

gulp.task('css', () => {
  gulp.src(appPath.srcDir + '**/*.scss', {base: appPath.srcDir})
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      require('postcss-assets')({
        loadPaths: ['images']
      }),
      // require('cssnext')(),
      require('autoprefixer')(),
      require('css-mqpacker'),
      require('csswring')()
    ]))
    .pipe(gulp.dest(appPath.distDir));
});

gulp.task('js', () => {
});

gulp.task('image', () => {
  gulp.src([
    appPath.srcDir + 'images/**/*.*',
    `!${appPath.srcDir}images/svg-icon/*.*`
    ], {base: appPath.srcDir})
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(appPath.distDir));
});

let svgOptions = [
  { removeTitle: true },
  { removeUselessStrokeAndFill: true }
];

gulp.task('svg-icon', () => {
  gulp.src(`${appPath.srcDir}images/svg-icon/*.*`)
    .pipe(imagemin({
      svgoPlugins: svgOptions
    }))
    .pipe(rename({prefix: 'icon-'}))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('svg-icon.svg'))
    .pipe(gulp.dest(appPath.distDir + 'images'));
});

gulp.task('team-icon', () => {
  gulp.src(`${appPath.srcDir}images/team/**.*`)
    .pipe(imagemin({
      svgoPlugins: svgOptions
    }))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('team-icon.svg'))
    .pipe(gulp.dest(appPath.distDir + 'images'));
});

gulp.task('icons', ['svg-icon', 'team-icon']);

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
