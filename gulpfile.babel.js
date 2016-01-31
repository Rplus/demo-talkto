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
import ghPages from 'gulp-gh-pages';

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

info.allPoints = {};
fs.readdirSync(appPath.srcDir + 'json/points/').forEach((fileName) => {
  info.allPoints[fileName] = JSON.parse(fs.readFileSync(`${appPath.srcDir}json/points/${fileName}`, 'utf8'));
});

info.allPolis = {};
fs.readdirSync(appPath.srcDir + 'json/polis/').forEach((fileName) => {
  info.allPolis[fileName] = JSON.parse(fs.readFileSync(`${appPath.srcDir}json/polis/${fileName}`, 'utf8'));
});

gulp.task('html', () => {
  gulp.src([
    appPath.srcDir + '*.jade',
    appPath.srcDir + '/talk/*.jade'
  ], {base: appPath.srcDir})
    .pipe(plumber({
      errorError: (err) => {
        console.log(err);
        this.emit('end');
      }
    }))
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
      require('postcss-devtools')(),
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

gulp.task('clean:js', () => {
  del([appPath.distDir + 'scripts/*']);
});

gulp.task('js', () => {
  gulp.src(appPath.srcDir + 'scripts/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(appPath.distDir + 'scripts/'));
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
  return gulp.src(appPath.distDir + '**/*')
    .pipe(ghPages());
});

gulp.task('server', () => {
  browserSync({
    open: 'external',
    browser: 'google-chrome',
    notify: false,
    reloadDelay: 200,
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
  gulp.watch([appPath.srcDir + '**/*.js'], ['js', reload]);
  gulp.watch([appPath.srcDir + '**/*.scss'], ['css', reload]);
  gulp.watch([appPath.srcDir + '**/*.jade'], ['html', reload]);
});

gulp.task('clean', del.bind(null, [appPath.distDir]));

gulp.task('default', ['clean', 'build']);
