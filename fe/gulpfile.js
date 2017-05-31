/**
 * @Author: yanhaowei
 * @Date:   2017-05-28T12:14:50+08:00
 * @Last modified by:   yanhaowei
 * @Last modified time: 2017-05-29T08:47:11+08:00
 */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var fn = {
    sass: function(from, to) {
        gulp.src(from).pipe($.sourcemaps.init()).pipe($.sass({outputStyle: 'compressed'}).on('error', $.sass.logError)).pipe($.minifyCss()).pipe($.rename({suffix: '.min'})).pipe($.sourcemaps.write('./maps')).pipe(gulp.dest(to))
    },
    sass_dir: {
        form: './src/sass/*.scss',
        to: './dist/css'
    },
    js: function(from, to, name) {
        gulp.src(from).pipe($.sourcemaps.init()).pipe($.concat(name)).pipe($.uglify()).pipe($.sourcemaps.write('./maps')).pipe(gulp.dest(to));
    },
    js_dir: {
        from: [
            './src/js/vendor/*.js','./src/js/main.js', './src/js/blocks/*.js'
        ],
        to: './dist/js'
    },
    html: function(from, to) {
        gulp.src(from).pipe($.fileInclude({prefix: '@@', basepath: './src/html/blocks/'})).pipe(gulp.dest(to))
    },
    html_dir: {
        from: './src/html/*.html',
        to: './dist/html'
    }
}
//sass处理
gulp.task('sass', function() {
    return fn.sass(fn.sass_dir.form, fn.sass_dir.to);
});
gulp.task('watch-sass', function() {
    return $.watch('./src/sass/**/*.scss', function() {
        console.log('sass-------------------------change');
        fn.sass(fn.sass_dir.form, fn.sass_dir.to);
    });
})
//js 处理
gulp.task('js', function() {
    return fn.js(fn.js_dir.from, fn.js_dir.to, 'main.min.js');
})
gulp.task('watch-js', function() {
    return $.watch(fn.js_dir.from, function() {
        console.log('js-------------------------change');
        fn.js(fn.js_dir.from, fn.js_dir.to, 'main.min.js');
    })
})
//js-lib
gulp.task('lib',function(){
    return gulp.src('./src/lib/*').pipe(gulp.dest('./dist/lib'))
})
gulp.task('watch-lib',function(){
    return $.watch('./src/lib/**/*',function(){
        gulp.src('./src/lib/**/*').pipe(gulp.dest('./dist/lib'))
    })
})
//html
gulp.task('html', function() {
     return fn.html(fn.html_dir.from, fn.html_dir.to);
})
gulp.task('watch-html', function() {
    return $.watch('./src/html/**/*.html', function() {
        console.log('html-------------------------change');
        fn.html(fn.html_dir.from, fn.html_dir.to);
    })
});

//clean
gulp.task('clean', function(cb) {
    return gulp.src('./dist/').pipe($.clean());
})

//构建
gulp.task('creat',['clean','html','sass','js','lib']);
gulp.task('build',function(){
    runSequence('clean',
        ['html','sass','js','lib']);
});
gulp.task('watch',function(){
    runSequence('browser-sync',['watch-html','watch-sass','watch-js','watch-lib'])
});
//浏览器刷新
gulp.task('browser-sync', function () {
    browserSync.init({
        // proxy:'local.dev',
        // port: 80,
        server: {
            baseDir: "./",
            directory: true
        },
        open: false,
        notify: false,
        files: ['./dist/**/*']
    });
});
gulp.task('default',function(){
    console.log('gulp build=====>重新生成dist文件\ngulp watch=====>监听文件实时更新')
})
