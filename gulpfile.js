'use strict';

var del				= require('del'),
	gulp			= require('gulp'),
	should			= require('gulp-if'),
	notify			= require('gulp-notify'),
	rename			= require('gulp-rename'),
	plumber			= require('gulp-plumber'),
	// (S)CSS STUFF
	sass			= require('gulp-ruby-sass'),
	autoprefixer	= require('gulp-autoprefixer'),
	minifycss		= require('gulp-minify-css'),
	cmq				= require('gulp-combine-media-queries'),
	// image stuff
	cache			= require('gulp-cache'),
	imagemin		= require('gulp-imagemin'),
	// js stuff
	jshint			= require('gulp-jshint'),
	stylish			= require('jshint-stylish'),
	uglify			= require('gulp-uglify'),
	// jade stuff
	jade			= require('gulp-jade'),
	// variables
	production = false;

gulp.task('sass', function() {
	gulp.src([ 'src/scss/**/*.scss', 'breakpoint-sass/**/*.scss' ])
		.pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
		.pipe(sass({ loadPath: [process.cwd() + '/bower_components'] }))
		.pipe(should(production, cmq({ log: true })))
		.pipe(should(production, rename({ suffix: '.min' })))
		.pipe(should(production, minifycss()))
		.pipe(gulp.dest('app/'));
});

gulp.task('lint-js', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(jshint())
		.pipe(notify(function (file) {
			if (file.jshint.success) return false;
			var errors = file.jshint.results.map(function (data) {
				if (data.error) return '(' + data.error.line + ') ' + data.error.reason;
			}).join('\n');
			return file.relative + ' (' + file.jshint.results.length + ' errors)\n' + errors;
		}));
});

gulp.task('js', ['lint-js'], function() {
	gulp.src('src/js/**/*.js')
		.pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
		.pipe(should(production, uglify()))
		.pipe(should(production, rename({ suffix: '.min' })))
		.pipe(gulp.dest('app/js/'));
});

gulp.task('templates', function() {
	gulp.src('src/jade/*.jade')
		.pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
		.pipe(jade({
			basedir: './src/jade',
			pretty: true,
			locals: { production: production }
		}))
		.pipe(gulp.dest('app/'));
});

gulp.task('imgs', function() {
	gulp.src('src/imgs/**/*.{svg,png,jpg,jpeg,gif}')
		.pipe(should(production, imagemin({
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('app/imgs'));
});

gulp.task('copy', function() {
	gulp.src('src/emailTemplates/**/*.jade')
		.pipe(gulp.dest('app/emailTemplates'));
});

gulp.task('clean', del.bind(null, ['app/**/*', '!.*']));

gulp.task('watch', function() {
	gulp.watch('src/jade/**/*.jade', ['templates']);
	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch('src/imgs/**/*.{png,jpg,jpeg,gif,svg}', ['imgs']);
	gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch('src/fonts/**/*.{eot,svg,ttf,woff}', ['copy']);
});

gulp.task('default', ['clean'], function() {
	gulp.start('sass', 'copy', 'imgs', 'js', 'templates');
});

gulp.task('prod', function() {
	production = true;
	gulp.start('default');
});