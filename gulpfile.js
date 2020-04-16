const gulp  = require('gulp')
const mocha      = require('gulp-mocha')
const typedoc    = require('gulp-typedoc')
const typescript = require('gulp-typescript')
// require('typedoc')    // DO NOT REMOVE … peerDependency of `gulp-typedoc`
// require('typescript') // DO NOT REMOVE … peerDependency of `gulp-typescript`

const tsconfig      = require('./tsconfig.json')

function dist() {
  return gulp.src('./src/class/*.class.ts')
    .pipe(typescript(tsconfig.compilerOptions))
    .pipe(gulp.dest('./dist/class/'))
}

function testmocha() {
	return gulp.src('./test/*.ts')
		.pipe(mocha({
			require: 'ts-node/register',
		}))
}

function test_out() {
	return gulp.src('./test/src/{,*.}test.ts')
		.pipe(typescript(tsconfig.compilerOptions))
		.pipe(gulp.dest('./test/out/'))
}

async function test_run_Date() {
	await Promise.all([
		require('./test/out/Date-format.test.js').default,
	])
	console.info('All _Date_ tests ran successfully!')
}

async function test_run_Number() {
	await Promise.all([
		require('./test/out/Number-typeOf.test.js'    ).default,
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

async function test_run_String() {
	await Promise.all([
		require('./test/out/String-stringify.test.js').default,
	])
	console.info('All _String_ tests ran successfully!')
}

const test_run = gulp.series(
	gulp.parallel(
		test_run_Date,
		test_run_Number,
		test_run_Object,
		test_run_Promise,
		test_run_String,
	), async function test_run0() {
		console.info('All tests ran successfully!')
	}
)

const test = gulp.series(test_out, test_run)

function docs() {
  return gulp.src('./src/**/*.ts')
    .pipe(typedoc(tsconfig.typedocOptions))
}

const build = gulp.parallel(
	gulp.series(
		gulp.parallel(
			dist,
			test_out
		),
		test_run
	),
	testmocha,
	docs
)

module.exports = {
	dist,
	testmocha,
	test_out,
	test_run_Date,
	test_run_Number,
	test_run_Object,
	test_run_Promise,
	test_run_String,
	test_run,
	test,
	docs,
	build,
}
