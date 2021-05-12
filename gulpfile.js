const gulp  = require('gulp')
const mocha      = require('gulp-mocha')
const typedoc    = require('gulp-typedoc')
// require('typedoc')    // DO NOT REMOVE … peerDependency of `gulp-typedoc`

const tsconfig      = require('./tsconfig.json')

function test() {
	return gulp.src('./test/*.ts')
		.pipe(mocha({
			require: 'ts-node/register',
		}))
}

function docs() {
  return gulp.src('./src/**/*.ts')
    .pipe(typedoc(tsconfig.typedocOptions))
}

const build = gulp.parallel(
	test,
	docs,
)

module.exports = {
	test,
	docs,
	build,
}
