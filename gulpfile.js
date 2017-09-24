const gulp = require('gulp')
const gulp_doc = require('gulp-documentation')

gulp.task('doc', function () {
  return gulp.src('./index.js')
    .pipe(gulp_doc('html'))
    .pipe(gulp.dest('./docs/api/'))
})

gulp.task('build', ['doc'])
