var gulp = require('gulp');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var del = require('del');
var concat = require('gulp-concat')
var runSequence = require('run-sequence');



gulp.task('clean', function(){
    del('public/dist');
});

gulp.task('build:client', function(){
    var tsProject = ts.createProject('public/tsconfig.json');
    var tsResult = gulp.src('public/app/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
    return tsResult.js
        .pipe(sourcemaps.write()) 
        .pipe(gulp.dest('public/dist'))
});


gulp.task('build', function(callback){
    runSequence('clean', 'build:client', callback);
});

gulp.task('default', ['build']);