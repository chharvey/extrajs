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
		.pipe(gulp.dest('./test/out/'))
})

gulp.task('test-run', async function () {
		await Promise.all([
			require('./test/out/Object-typeOf.test.js')    .default,
			require('./test/out/Object-is.test.js')        .default,
			require('./test/out/Number-typeOf.test.js')    .default,
			require('./test/out/Number-assertType.test.js').default,
			require('./test/out/Math-mod.test.js')         .default,
			require('./test/out/Math-clamp.test.js')       .default,
			require('./test/out/Math-average.test.js')     .default,
			require('./test/out/Math-mean.test.js')        .default,
			require('./test/out/Date-format.test.js')      .default,
			require('./test/out/String-stringify.test.js') .default,
			require('./test/out/Array-contains.test.js')   .default,
		])
		console.info('All tests ran successfully!')
})

gulp.task('test', ['test-out', 'test-run'])

gulp.task('docs', async function () {
  return gulp.src('./src/**/*.ts')
    .pipe(typedoc(typedocconfig))
})

gulp.task('build', ['dist', 'test', 'docs'])
