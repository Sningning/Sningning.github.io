var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');

// 压缩 public 目录 css
gulp.task('minify-css', function() {
    return gulp.src('./public/**/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('./public'));
    done();
});

// 压缩 public 目录 html
gulp.task('minify-html', function() {
    return gulp.src('./public/**/*.html')
		.pipe(htmlclean())
        .pipe(htmlmin({
			removeComments: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        }))
		.pipe(gulp.dest('./public'));
	done();
});

// 压缩 public/js 目录 js
gulp.task('minify-js', function() {
    return gulp.src('./public/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public'));
    done();
});

// 执行 gulp 命令时执行的任务
// gulp 4.0 适用的方式
gulp.task('build', gulp.parallel('minify-html', 'minify-css', 'minify-js')), function () {
    console.log("----------gulp Finished----------");
    // Do something after a, b, and c are finished.
};