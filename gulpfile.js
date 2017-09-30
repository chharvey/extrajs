const gulp  = require('gulp')
const jsdoc = require('gulp-jsdoc3')

gulp.task('doc', function () {
  return gulp.src(['./index.js', 'src/{Object,Number,Array,Date}.class.js'], {read: false})
    .pipe(jsdoc(require('./jsdoc-config.json')))
})

gulp.task('build', ['doc'])
