const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const optipng = require('imagemin-optipng');
const jpegtran = require('imagemin-jpegtran');
const svgo = require('imagemin-svgo');
const gulpWebp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const gulpIf = require('gulp-if');
const stylelint = require('gulp-stylelint');
const babel = require('gulp-babel');
const del = require('del');
const ghPages = require('gh-pages');
const path = require('path');

let isDev = false;

function styles() {
  return gulp.src('source/scss/styles.scss')
    .pipe(plumber())
    .pipe(stylelint({
      reporters: [
        {
          formatter: 'string',
          console: true
        }
      ]
    }))
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions', '> 1%', 'IE 11', 'Firefox ESR'],
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulpIf(isDev, sourcemaps.write('.')))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src('source/js/*.js')
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('main.js'))
    .pipe(uglify({
      toplevel: true
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulpIf(isDev, sourcemaps.write('.')))
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.reload({
      stream: true
    }));
}

function sprite() {
  return gulp.src('source/img/icon-*.svg')
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
};

function html() {
  return gulp.src('source/*.html')
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest('build'))
    .pipe(browserSync.reload({
      stream: true
    }));
};

function copy() {
  return gulp.src([
    'source/img/**',
    'source/fonts/**',
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'));
};

function clean() {
  return del('build');
};

function watch() {
  browserSync.init({
    server: {
      baseDir: 'build/'
    },
    // tunnel: true
  });

  gulp.watch('source/scss/**/*.scss', styles);
  gulp.watch('source/js/**/*.js', scripts);
  gulp.watch('source/img/icon-*.svg', sprite);
  gulp.watch('source/*.html', html);
}

gulp.task('watch', watch);
gulp.task('build', gulp.series(clean,
  gulp.parallel(styles, scripts, copy, sprite),
  html
));

gulp.task('start', gulp.series('build', 'watch'));

function webp() {
  return gulp.src('source/img/**/*.{png,jpg,jpeg}')
    .pipe(gulpWebp({
      quality: 90
    }))
    .pipe(gulp.dest('source/img'));
};
exports.webp = webp;

function images() {
  return gulp.src('source/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      optipng({
        optimizationLevel: 3
      }),
      jpegtran({
        progressive: true
      }),
      svgo()
    ]))
    .pipe(gulp.dest('source/img'));
};
exports.images = images;

function deploy(cb) {
  ghPages.publish(path.join(process.cwd(), './build'), cb);
};
exports.deploy = deploy;