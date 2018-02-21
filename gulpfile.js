const gulp  = require('gulp')
const jsdoc = require('gulp-jsdoc3')

gulp.task('docs:api', function () {
  return gulp.src(['README.md', './index.js', 'src/{Object,Number,Date,String,Array}.class.js'], {read: false})
    .pipe(jsdoc(require('./config-jsdoc.json')))
})

gulp.task('build', ['docs:api'])
