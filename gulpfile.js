const gulp  = require('gulp')
const typedoc    = require('gulp-typedoc')
const typescript = require('gulp-typescript')
// require('typedoc')    // DO NOT REMOVE … peerDependency of `gulp-typedoc`
// require('typescript') // DO NOT REMOVE … peerDependency of `gulp-typescript`

const tsconfig      = require('./config/tsconfig.json')
const typedocconfig = require('./config/typedoc.json')

gulp.task('test', async function () {
	;[
		{ filename: './test/Object-typeOf.test.js', subject: 'xjs.Object.typeOf' },
		{ filename: './test/Object-is.test.js'    , subject: 'xjs.Object.is' },
	].forEach((t) => {
		if (require(t.filename)) console.log(`All tests for \`${t.subject}\` ran successfully!`)
		else throw Error(`Some test for \`${t.subject}\` has failed!`)
	})
})

gulp.task('docs', async function () {
  return gulp.src('./src/**/*.ts')
    .pipe(typedoc(typedocconfig))
})

gulp.task('dist', async function () {
  return gulp.src('./src/class/*.class.ts')
    .pipe(typescript(tsconfig.compilerOptions))
    .pipe(gulp.dest('./dist/class/'))
})

gulp.task('build', ['test', 'docs', 'dist'])
