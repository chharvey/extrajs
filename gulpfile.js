const gulp  = require('gulp')
const typedoc    = require('gulp-typedoc')
const typescript = require('gulp-typescript')
// require('typedoc')    // DO NOT REMOVE … peerDependency of `gulp-typedoc`
// require('typescript') // DO NOT REMOVE … peerDependency of `gulp-typescript`

const tsconfig      = require('./config/tsconfig.json')
const typedocconfig = require('./config/typedoc.json')

gulp.task('dist', async function () {
  return gulp.src('./src/class/*.class.ts')
    .pipe(typescript(tsconfig.compilerOptions))
    .pipe(gulp.dest('./dist/class/'))
})

gulp.task('test', async function () {
	try {
		await Promise.all([
			require('./test/Object-typeOf.test.js'),
			require('./test/Object-is.test.js'),
			require('./test/Number-typeOf.test.js'),
			require('./test/Date-format.test.js'),
			require('./test/String-stringify.test.js'),
		])
		console.log('All tests ran successfully!')
	} catch (e) {
		console.error(e)
	}
})

gulp.task('docs', async function () {
  return gulp.src('./src/**/*.ts')
    .pipe(typedoc(typedocconfig))
})

gulp.task('build', ['dist', 'test', 'docs'])
