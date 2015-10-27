var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var fileinclude = require('gulp-file-include');
var htmlreplace = require('gulp-html-replace');
var watch = require('gulp-watch');

var JS = {
    core : ['js/core/core.js', 'js/core/class.js'],
    core_min : 'core.min.js'
};

var HtmlReplace = htmlreplace({
    js_core : '../js/dist/'+JS.core_min
});

gulp.task('core', function(){
    return gulp.src(JS.core).pipe(uglify())
        .pipe(concat(JS.core_min))
        .pipe(gulp.dest('./js/dist'));
});

gulp.task('html_dev', function(){
    return gulp.src(['./dev/*.html'])
        .pipe(fileinclude({
            prefix: '@@'
        })).pipe(gulp.dest('./build'));
});

gulp.task('htmltest', function(){
    return gulp.src(['dev/empty.html'])
        .pipe(fileinclude({
            prefix: '@@'
        })).pipe(HtmlReplace)
        .pipe(gulp.dest('./page'));
});

gulp.task('watch_dev', function(){
    gulp.watch('./dev/*.html', function(param){
        console.log(JSON.stringify(param));

        var path = param.path;
        if(!path) throw 'no path -->'+param.type;

        gulp.src(path)
            .pipe(fileinclude({
                prefix: '@@'
            })).pipe(gulp.dest('./build'));
    });
});


gulp.task('dev', ['html_dev', 'watch_dev']);

