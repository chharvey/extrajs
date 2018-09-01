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

gulp.task('test-out', async function () {
	return gulp.src(['./test/src/{,*.}test.ts'])
		.pipe(typescript(tsconfig.compilerOptions))
		.pipe(gulp.dest('./test/build/'))
})

gulp.task('test', ['test-out'], async function () {
	try {
		await Promise.all([
			require('./test/build/Object-typeOf.test.js'),
			require('./test/build/Object-is.test.js'),
			require('./test/build/Number-typeOf.test.js'),
			require('./test/build/Number-assertType.test.js'),
			require('./test/build/Math-mod.test.js'),
			require('./test/build/Math-clamp.test.js'),
			require('./test/build/Math-average.test.js'),
			require('./test/build/Math-mean.test.js'),
			require('./test/build/Date-format.test.js'),
			require('./test/build/String-stringify.test.js'),
			require('./test/build/Array-contains.test.js'),
		])
		console.info('All tests ran successfully!')
	} catch (e) {
		console.error(e)
	}
})

gulp.task('docs', async function () {
  return gulp.src('./src/**/*.ts')
    .pipe(typedoc(typedocconfig))
})

gulp.task('build', ['dist', 'test', 'docs'])
