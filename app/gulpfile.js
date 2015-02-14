var gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
  minifyCss = require('gulp-minify-css'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  del = require('del'),
  jshint = require('gulp-jshint'),
  browserSync = require('browser-sync'),
  filter = require('gulp-filter'),
  browserify = require('browserify'),
  buffer = require('vinyl-buffer'),
  source = require('vinyl-source-stream'),
  replace = require('gulp-replace'),
  readdir = require('readdir'),
  to5ify = require('6to5ify'),
  uglifyify = require('uglifyify');

var paths = require('./config/paths');

gulp.task('clean', function (cb) {
  del('public', cb);
});

gulp.task('scss', function () {
  return sass(paths.removeWildcards(paths.src.scss))
    .on('error', function (err) {
      console.error('Error', err.message);
    })
    .pipe(autoprefixer('last 2 versions'))
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.dest.scss))
    .pipe(filter('**/*.css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('lint', function () {
  return gulp.src(paths.src.js)
    .pipe(jshint({esnext: true}))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('js', ['lint'], function () {
  return readdir.readSync(paths.removeWildcards(paths.src.js), ['*.js']).forEach(function (fileName) {
    browserify(paths.removeWildcards(paths.src.js) + fileName, {debug: true})
      .transform(to5ify)
      .transform(uglifyify)
      .bundle()
      .pipe(source(paths.removeWildcards(paths.dest.js) + fileName))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(replace(/\/\/\# sourceMappingURL\=\.\.\/\.\.\/public/, "//# sourceMappingURL="))
      .pipe(gulp.dest('./'))
      .pipe(browserSync.reload({stream: true}));
  });
});

gulp.task('html', function () {
  return gulp.src('./views/**.html')
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('compile-resources', ['clean'], function () {
  return gulp.start('scss', 'js', 'html');
});

gulp.task('watch', function () {
  for (var key in paths.src) {
    gulp.watch(paths.src[key], [key]);
  }
});

gulp.task('default', ['compile-resources', 'watch'], function () {
  return browserSync({
    server: {
      baseDir: ['./public']
    }
  });
});