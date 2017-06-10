const argv = require('minimist')(process.argv.slice(2))

const gulp = require('gulp')
const sass = require('gulp-sass')
const base64 = require('gulp-base64')
const inline_base64 = require('gulp-inline-base64')


  const resetCSS = require('node-reset-scss').includePath
const autoprefixer = require('gulp-autoprefixer');




//our CSS pre-processor
gulp.task('sass', function() {

  gulp.src('./src/scss/main.scss')

  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
  }))

  /*.pipe(base64({
    baseDir: '',
    extensions: ['svg', 'png', /\.jpg#datauri$/i],
    debug: true
  }))*/

  .pipe(inline_base64({
    baseDir: "app/",
    maxSize: 14 * 1024,
    debug: true
  }))


  .pipe(sass({
    outputStyle: argv.production ? 'compressed' : undefined,
    includePaths: [resetCSS]
  }).on('error', sass.logError))

  .pipe(gulp.dest('./app'))
})

//the development task
gulp.task('watch', ['sass'], function(cb) {
    //watch SASS
    gulp.watch('src/scss/*.scss', ['sass'])
  })
  /*
  //the distribution bundle task
  gulp.task('bundle', ['sass'], function() {
    var bundler = browserify(entry, { transform: babelify })
          .bundle()
    return bundler
      .pipe(source('index.js'))
      .pipe(streamify(uglify()))
      .pipe(rename(outfile))
      .pipe(gulp.dest('./app'))
  })*/
