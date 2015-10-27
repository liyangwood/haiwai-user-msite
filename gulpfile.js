var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');

var JS = {
    core : ['js/core/core.js', 'js/core/class.js']
};

gulp.task('core', function(){
    return gulp.src(JS.core).pipe(uglify())
        .pipe(concat('core.min.js'))
        .pipe(gulp.dest('js/dist'));
});