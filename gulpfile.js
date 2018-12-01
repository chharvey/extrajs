const gulp  = require('gulp')
const typedoc    = require('gulp-typedoc')
const typescript = require('gulp-typescript')
// require('typedoc')    // DO NOT REMOVE … peerDependency of `gulp-typedoc`
// require('typescript') // DO NOT REMOVE … peerDependency of `gulp-typescript`

const tsconfig      = require('./tsconfig.json')
const typedocconfig = require('./config/typedoc.json')

function dist() {
  return gulp.src('./src/class/*.class.ts')
    .pipe(typescript(tsconfig.compilerOptions))
    .pipe(gulp.dest('./dist/class/'))
}

function test_out() {
	return gulp.src('./test/src/{,*.}test.ts')
		.pipe(typescript(tsconfig.compilerOptions))
		.pipe(gulp.dest('./test/out/'))
}

async function test_run() {
		await Promise.all([
			require('./test/out/Object-typeOf.test.js')    .default,
			require('./test/out/Object-is.test.js')        .default,
			require('./test/out/Number-typeOf.test.js')    .default,
			require('./test/out/Number-assertType.test.js').default,
			require('./test/out/Math-mod.test.js')         .default,
			require('./test/out/Math-clamp.test.js')       .default,
			require('./test/out/Math-mean.test.js')        .default,
			require('./test/out/Math-interpolate.test.js') .default,
			require('./test/out/Date-format.test.js')      .default,
			require('./test/out/String-stringify.test.js') .default,
			require('./test/out/Array-contains.test.js')   .default,
		])
		console.info('All tests ran successfully!')
}

const test = gulp.series(test_out, test_run)

function docs() {
  return gulp.src('./src/**/*.ts')
    .pipe(typedoc(typedocconfig))
}

const build = gulp.parallel(
	gulp.series(
		gulp.parallel(
			dist,
			test_out
		),
		test_run
	),
	docs
)

module.exports = {
	dist,
	test_out,
	test_run,
	test,
	docs,
	build,
}
