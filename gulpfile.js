const gulp  = require('gulp')
const typedoc    = require('gulp-typedoc')
// require('typedoc')    // DO NOT REMOVE … peerDependency of `gulp-typedoc`

const tsconfig      = require('./tsconfig.json')

const build = gulp.parallel(
)

module.exports = {
	build,
}
