var fs = require('fs');
var packageJson = JSON.parse(fs.readFileSync('./package.json'));
var version = packageJson.version;
var copyright = [
    '/**',
    ' * ZumuJS - <%= version %>',
    ' * https://github.com/selcher/zumu',
    ' *',
    ' * Released under the MIT License',
    ' * http://opensource.org/licenses/MIT',
    ' */\n'
].join('\n');

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var connect = require('gulp-connect');
var watch = require('gulp-watch');

gulp.task('minify-scripts', function() {
    gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(header(copyright, { version: version }))
        .pipe(gulp.dest('dist'))
});

gulp.task('minify-styles', function() {
    gulp.src('./src/css/*.css')
        .pipe(minifycss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(header(copyright, { version: version }))
        .pipe(gulp.dest('dist'))
});

gulp.task('lint', function() {
    return gulp.src(['./src/js/*.js'])
        .pipe(eslint({
            useEslintrc: true
        }))
        .pipe(eslint.format())
        .on('error', function(error) {
            console.error(String(error));
        });
});

gulp.task('server', function() {
    connect.server({
        port: 8080,
        livereload: true
    });
});

gulp.task('livereload', function() {
    gulp.src(['src/css/*.css', 'src/js/*.js'])
        .pipe(watch(['src/css/*.css', 'src/js/*.js']))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch('src/css/*.css', ['minify-styles']);
    gulp.watch('src/js/*.js', ['minify-scripts']);
});

gulp.task('default', ['lint', 'minify-scripts', 'minify-styles']);

gulp.task('dev', [
    'lint', 'minify-scripts', 'minify-styles',
    'server', 'livereload', 'watch']);
