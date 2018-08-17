const gulp  = require('gulp')
const jsdoc = require('gulp-jsdoc3')
const typedoc    = require('gulp-typedoc')
const typescript = require('gulp-typescript')
// require('typedoc')    // DO NOT REMOVE … peerDependency of `gulp-typedoc`
// require('typescript') // DO NOT REMOVE … peerDependency of `gulp-typescript`

const tsconfig      = require('./config/tsconfig.json')
const typedocconfig = require('./config/typedoc.json')

gulp.task('compile', async function () {
  return gulp.src('./src/class/*.class.ts')
    .pipe(typescript(tsconfig.compilerOptions))
    .pipe(gulp.dest('./dist/class/'))
})

gulp.task('docs', async function () {
  return gulp.src('./src/class/*.class.ts')
    .pipe(typedoc(typedocconfig))
})

gulp.task('docs:api', function () {
  return gulp.src(['README.md', './index.js', 'src/{Object,Number,Date,String,Array}.class.js'], {read: false})
    .pipe(jsdoc(require('./config-jsdoc.json')))
})

gulp.task('build', ['docs:api'])
