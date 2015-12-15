var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var fileinclude = require('gulp-file-include');
var htmlreplace = require('gulp-html-replace');
var watch = require('gulp-watch');

var JS = {
    core : [
        'js/core/core.js',
        'js/core/class.js',
        'js/core/util.js',
        'js/core/request.js',
        'js/comp/base.js',
        'js/comp/form.js',
        'js/comp/myfav.js',
        'js/comp/mycoupon.js',
        'js/comp/mysys.js',
        'js/comp/mycount.js'
    ],
    core_min : 'core.min.js'
    //'class' : ['js/class/BasePage.js'],
    //'class_min' : 'class.min.js'

};

var HtmlReplace = {
    js_core : '../../js/dist/'+JS.core_min
};

var F = {
    each : function(list, callback){
        for(var i= 0,len=list.length; i<len; i++){
            (function(i){
                callback(list[i], i, len);
            })(i);

        }
    },
    devHtmlByDir : function(dir){
        gulp.src(['./dev/'+dir+'/*.html'])
            .pipe(fileinclude({
                prefix: '@@'
            })).pipe(gulp.dest('./build/'+dir));
    },
    devWatchHtmlByDir : function(dir){
        gulp.watch('./dev/'+dir+'/*.html', function(param){
            console.log(JSON.stringify(param));

            var path = param.path;
            if(!path) throw 'no path -->'+param.type;

            gulp.src(path)
                .pipe(fileinclude({
                    prefix: '@@'
                })).pipe(gulp.dest('./build/'+dir));
        });
    },
    pubHtmlByDir : function(dir){
        gulp.src(['./dev/'+dir+'/*.html'])
            .pipe(fileinclude({
                prefix: '@@'
            }))
            .pipe(htmlreplace(HtmlReplace))
            .pipe(gulp.dest('./page/'+dir));
    }
};

gulp.task('core', function(){
    return gulp.src(JS.core)
        .pipe(uglify())
        .pipe(concat(JS.core_min))
        .pipe(gulp.dest('./js/dist'));
});

var dirList = ['mybiz', 'mycount', 'myfav', 'mysys', 'mycoupon'];

gulp.task('html_dev', function(){

    F.each(dirList, F.devHtmlByDir);
});

gulp.task('htmltest', function(){
    F.each(dirList, F.pubHtmlByDir);

});

gulp.task('watch_dev', function(){
    F.each(dirList, F.devWatchHtmlByDir);

    gulp.watch('./inc/*', function(){
        F.each(dirList, F.devHtmlByDir);
    });
});


gulp.task('dev', ['html_dev', 'watch_dev']);

gulp.task('pub', ['core', 'htmltest']);