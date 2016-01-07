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
import yaml from 'js-yaml';
import gulpSharp from 'gulp-sharp';
import gulpFilter from 'gulp-filter';
import fs from 'fs';

let reload = browserSync.reload;

let appPath = {
  srcDir: 'app/',
  distDir: '_dist/'
};

let svgOptions = [
  { removeTitle: true },
  { removeUselessStrokeAndFill: true }
];

let info = JSON.parse(fs.readFileSync('./app/manifest.webapp', 'utf8'));
info.programs = yaml.safeLoad(fs.readFileSync(appPath.srcDir + 'talk_data.yml', 'utf8'));

gulp.task('html', () => {
  gulp.src([
    appPath.srcDir + '*.jade',
    appPath.srcDir + '/talk/*.jade'
  ], {base: appPath.srcDir})
    .pipe(plumber())
    .pipe(data(info))
    .pipe(jade())
    .pipe(gulp.dest(appPath.distDir));
});

gulp.task('clean', () => {
  del([appPath.distDir]);
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
      require('lost')(),
      // require('cssnext')(),
      require('autoprefixer')(),
      require('css-mqpacker')({
        sort: true
      }),
      require('csswring')()
    ]))
    .pipe(gulp.dest(appPath.distDir));
});

gulp.task('js', () => {
});

gulp.task('image', () => {
  let filter = gulpFilter((file) => {
    return /_bg\.jpg$/.test(file.path);
  }, {restore: true});

  gulp.src([
    appPath.srcDir + 'images/{slider,logo}/*.*'
  ], {base: appPath.srcDir})
    .pipe(imagemin({
      svgoPlugins: svgOptions,
      progressive: true
    }))
    .pipe(gulp.dest(appPath.distDir))
    .pipe(filter)
    .pipe(gulpSharp({
      resize: [200],
      progressive: true
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace(/_bg/, '_thumb');
    }))
    .pipe(gulp.dest(appPath.distDir));
});

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

gulp.task('images', ['image', 'svg-icon', 'team-icon']);

gulp.task('build', ['hmtl', 'css', 'js', 'images'], () => {
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
    server: appPath.distDir
  });
});

gulp.task('dev', ['server'], () => {
  gulp.watch([appPath.srcDir + '*.js'], ['js', reload]);
  gulp.watch([appPath.srcDir + '**/*.scss'], ['css', reload]);
  gulp.watch([appPath.srcDir + '**/*.jade'], ['html', reload]);
});

gulp.task('clean', del.bind(null, [appPath.distDir]));

gulp.task('default', ['clean', 'build']);
