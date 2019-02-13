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

async function test_run_Array() {
	await Promise.all([
		require('./test/out/Array-isSubarrayOf.test.js'             ).default,
		require('./test/out/Array-isSuperarrayOf.test.js'           ).default,
		require('./test/out/Array-isConsecutiveSubarrayOf.test.js'  ).default,
		require('./test/out/Array-isConsecutiveSuperarrayOf.test.js').default,
		require('./test/out/Array-densify.test.js'                  ).default,
		require('./test/out/Array-fillHoles.test.js'                ).default,
	])
	console.info('All _Array_ tests ran successfully!')
}

async function test_run_Date() {
	await Promise.all([
		require('./test/out/Date-format.test.js').default,
	])
	console.info('All _Date_ tests ran successfully!')
}

async function test_run_Math() {
	await Promise.all([
		require('./test/out/Math-mod.test.js')        .default,
		require('./test/out/Math-clamp.test.js')      .default,
		require('./test/out/Math-mean.test.js')       .default,
		require('./test/out/Math-interpolate.test.js').default,
	])
	console.info('All _Math_ tests ran successfully!')
}

async function test_run_Number() {
	await Promise.all([
		require('./test/out/Number-typeOf.test.js'    ).default,
		require('./test/out/Number-assertType.test.js').default,
	])
	console.info('All _Number_ tests ran successfully!')
}

async function test_run_Object() {
	await Promise.all([
		require('./test/out/Object-typeOf.test.js').default,
		require('./test/out/Object-is.test.js')    .default,
	])
	console.info('All _Object_ tests ran successfully!')
}

async function test_run_Promise() {
	await Promise.all([
		require('./test/out/Promise-any.test.js').default,
	])
	console.info('All _Promise_ tests ran successfully!')
}

async function test_run_Set() {
	await Promise.all([
		require('./test/out/Set-isSubsetOf.test.js'  ).default,
		require('./test/out/Set-isSupersetOf.test.js').default,
	])
	console.info('All _Set_ tests ran successfully!')
}

async function test_run_String() {
	await Promise.all([
		require('./test/out/String-stringify.test.js').default,
	])
	console.info('All _String_ tests ran successfully!')
}

const test_run = gulp.series(
	gulp.parallel(
		test_run_Array,
		test_run_Date,
		test_run_Number,
		test_run_Math,
		test_run_Object,
		test_run_Promise,
		test_run_Set,
		test_run_String,
	), async function test_run0() {
		console.info('All tests ran successfully!')
	}
)

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
	test_run_Array,
	test_run_Date,
	test_run_Math,
	test_run_Number,
	test_run_Object,
	test_run_Promise,
	test_run_Set,
	test_run_String,
	test_run,
	test,
	docs,
	build,
}
