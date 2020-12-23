const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const server = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const imagemin = require('gulp-imagemin');
const optipng = require('imagemin-optipng');
const jpegtran = require('imagemin-jpegtran');
const svgo = require('imagemin-svgo');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const uglify = require('gulp-uglify-es').default;
const pipeline = require('readable-stream').pipeline;
const del = require('del');
const ghPages = require('gh-pages');
const path = require('path');

gulp.task("compress", function () {
  return pipeline(
    gulp.src('source/js/*.js'),
    uglify(),
    rename({suffix: ".min"}),
    gulp.dest('build/js')
  );
});

gulp.task("css", function () {
  return gulp.src("source/scss/styles.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(autoprefixer({
			cascade: false,
		}))
    .pipe(csso())
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task("sprite", function () {
  return gulp.src("source/img/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      optipng({optimizationLevel: 3}),
      jpegtran({progressive: true}),
      svgo()
    ]))
    .pipe(gulp.dest("source/img"));
});

function deploy(cb) {
  ghPages.publish(path.join(process.cwd(), "./build"), cb);
}
exports.deploy = deploy;

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img"));
});

gulp.task("server", function () {
  server.init({
    server: "build/"
  });

  gulp.watch("source/scss/**/*.scss", gulp.parallel("css"));
  gulp.watch("source/img/icon-*.svg", gulp.parallel("sprite", "html", "refresh"));
  gulp.watch("source/*.html", gulp.parallel("html", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("copy", function () {
  return gulp.src([
    "source/img/**",
    "source/js/*.min.js"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("build", gulp.series(
  "clean",
  "compress",
  "copy",
  "css",
  "sprite",
  "html"
));

gulp.task("start", gulp.series("build", "server"));