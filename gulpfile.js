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
var jslint = require('gulp-jslint');
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

gulp.task('jslint', function() {
    return gulp.src(['./src/js/*.js'])
        .pipe(jslint({
            browser: true,
            todo: true,
            devel: true,
            white: true,
            reporter: 'default',
            errorsOnly: false
        }))
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

gulp.task('default', ['jslint', 'minify-scripts', 'minify-styles']);

gulp.task('dev', [
    'minify-scripts', 'minify-styles', 'server', 'livereload', 'watch']);
