var gulp = require('gulp'), 
    sass = require('gulp-ruby-sass'), 
    minifyCss = require('gulp-minify-css'), 
    sourcemaps = require('gulp-sourcemaps'), 
    autoprefixer = require('gulp-autoprefixer'), 
    rename = require('gulp-rename'), 
    to5 = require('gulp-6to5'), 
    uglify = require('gulp-uglify'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    browserSync = require('browser-sync'),
    filter = require('gulp-filter');

var paths = {
    src: {
      js: 'assets/js/**/*.js',
      scss: 'assets/scss/sass/**/*.scss',
      html: 'views/**/*.html'        
    },
    dest: {
      js: 'public/js',
      scss: 'public/css',
      html: 'public'      
    }
};

gulp.task('clean', function (cb) {
  del('public', cb);
});

gulp.task('scss', function () {
  return sass(paths.src.scss.replace(/\*\*\/\*.scss/, ''))
    .on('error', function (err) {
      console.error('Error', err.message);
    })
    .pipe(autoprefixer('last 2 versions'))
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.dest.scss))
    .pipe(filter('**/*.css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('lint', function () {
  return gulp.src(paths.src.js)
  .pipe(jshint({ esnext: true }))
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'));
});

gulp.task('js', ['lint'], function () {
  return gulp.src(paths.src.js)
    .pipe(sourcemaps.init())
    .pipe(to5())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dest.js))
    .pipe(browserSync.reload({stream:true}));

});

gulp.task('html', function () {
  return gulp.src('./views/**.html')
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('compile-resources', ['clean'], function () {
  return gulp.start('scss', 'js', 'html');
});

gulp.task('watch', function () {
  for(var key in paths.src) {
    gulp.watch(paths.src[key], [key]);
  }
});

gulp.task('default', [ 'compile-resources', 'watch' ], function () {
  return browserSync({
    server: {
      baseDir: ['./public']
    }
  });
});