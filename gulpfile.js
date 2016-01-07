var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var fileinclude = require('gulp-file-include');
var htmlreplace = require('gulp-html-replace');
var watch = require('gulp-watch');
var minifyCss = require('gulp-minify-css');

var baseCore = [
    'js/core/core.js',
    'js/core/class.js',
    'js/core/util.js',
    'js/core/request.js'
];

var JS = {
    core : baseCore.concat([
        'js/comp/base.js',
        'js/comp/form.js',
        'js/comp/myfav.js',
        'js/comp/mycoupon.js',
        'js/comp/mysys.js',
        'js/comp/mycount.js',
        'js/comp/mybiz.js',
        'js/comp/createStore.js'
    ]),
    core_min : 'core.min.js',
    css_min : 'style.min.css',

    site_core : baseCore.concat([
        'js/comp/base.js',
        'js/site/couponlist.js',
        'js/site/articlelist.js',
        'js/site/articleDetail.js'
    ]),
    site_min : 'site.min.js',
    site_css_min : 'site.min.css'
};

var HtmlReplace = {
    js_core : '../../js/dist/'+JS.core_min,
    css : '../../css/'+JS.css_min,

    site_core : '../../js/dist/'+JS.site_min,
    site_css : '../../style/'+JS.site_css_min
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
    gulp.src(JS.core)
        .pipe(uglify())
        .pipe(concat(JS.core_min))
        .pipe(gulp.dest('./js/dist'));

    gulp.src(JS.site_core)
        .pipe(uglify())
        .pipe(concat(JS.site_min))
        .pipe(gulp.dest('./js/dist'));
});
gulp.task('css', function(){
    gulp.src(['css/style.css'])
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(concat(JS.css_min))
        .pipe(gulp.dest('css/'));

    gulp.src(['style/site.css'])
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(concat(JS.site_css_min))
        .pipe(gulp.dest('style/'));
});

var dirList = ['mybiz', 'mycount', 'myfav', 'mysys', 'mycoupon', 'site'];

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

gulp.task('pub', ['core', 'css', 'htmltest']);