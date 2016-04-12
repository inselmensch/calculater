var gulp = require('gulp');
var gutil = require('gulp-util');
var stylus = require('gulp-stylus');
var pixrem = require('gulp-pixrem');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect');
var jade = require('gulp-jade');
var gulpData = require('gulp-data');
var runSequence = require('run-sequence');

var fs = require('fs');

var packageData = require('./package.json');
var generatedBuildName = false;
var buildNameLength = 5;
var paths = {
	css: __dirname + '/public/assets/css/',
	js: __dirname + '/public/assets/js/'
}

var genBuildName = function(){
	var salad = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var letters = salad.split('');
	var newName = '';

	while(newName.length < buildNameLength)
	{
		newName += letters[Math.round(Math.random()*letters.length)-1];
	}

	packageData.buildName = newName;

	fs.writeFileSync('./package.json',JSON.stringify(packageData,null,"\t"));
	return true;
};

gulp.task('readPackage',function(){
	fs.readFile(__dirname + '/package.json', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}

		packageData = JSON.parse(data);
	});
});

gulp.task('build',function(){
	// delete current build files
		var publicJsPath = __dirname + '/public/assets/js/';
		var jsFilesList = fs.readdirSync(publicJsPath);
		var publicCssPath = __dirname + '/public/assets/css/';
		var cssFilesList = fs.readdirSync(publicCssPath);

		for(i in jsFilesList) {
			if(!fs.statSync(publicJsPath + jsFilesList[i]).isFile()) continue;
			if(jsFilesList[i].match(/^(core\..*)$/gmi)) {
				console.log("delete",jsFilesList[i]);
				fs.unlinkSync(publicJsPath + jsFilesList[i]);
			}
		}

		for(i in cssFilesList) {
			if(!fs.statSync(publicCssPath + cssFilesList[i]).isFile()) continue;
			if(cssFilesList[i].match(/^(styles\..*)$/gmi)) {
				console.log("delete",cssFilesList[i]);
				fs.unlinkSync(publicCssPath + cssFilesList[i]);
			}
		}

	// generate new build
		genBuildName();

	// build files
		runSequence('css','images','js','templates','reconnect');
});

gulp.task('server',function(){
	connect.server({
		root: __dirname+'/public/',
		host: '0.0.0.0',
		port: 1111,
		livereload: true
	});
});

gulp.task('css',function() {
	// render all styles
		gulp.src(__dirname + '/_source/stylus/_project.styl')
			.pipe(stylus({
				'include css': true,
				compress: false
			}))
			.pipe(autoprefixer('last 10 versions'))
			.pipe(pixrem())
			.pipe(concat('styles.' + packageData.buildName + '.css'))
			.pipe(gulp.dest(__dirname+'/public/assets/css/'))
			.pipe(minifyCss())
			.pipe(concat('styles.' + packageData.buildName + '.min.css'))
			.pipe(gulp.dest(__dirname+'/public/assets/css/'));
});

gulp.task('js', function() {
	gulp.src([
			__dirname + '/_source/js/**/*.js'
		])
		.pipe(concat('core.' + packageData.buildName + '.js'))
		.pipe(gulp.dest(__dirname + '/public/assets/js/'))
		.pipe(uglify())
		.pipe(concat('core.' + packageData.buildName + '.min.js'))
		.pipe(gulp.dest(__dirname + '/public/assets/js'));
});

gulp.task('templates',['readPackage','tpls-jade']);

gulp.task('tpls-jade', function() {
	gulp.src([
			__dirname + '/_source/jade/**/*.jade',
			'!' + __dirname + '/_source/jade/**/{_*,_*/**}.jade'
		])
		.pipe(gulpData(function(file){
			packageData.stylecss = 'styles.' + packageData.buildName;
			packageData.corejs = 'core.' + packageData.buildName;
			return packageData;
		}))
		.pipe(jade({
			pretty: true
		}))
		.on('error',gutil.log)
		.pipe(gulp.dest(__dirname + '/public/'));
});

gulp.task('images', function() {
	gulp.src(__dirname + '/_source/images/**/*')
		.pipe(gulp.dest(__dirname + '/public/assets/images/'));
});

gulp.task('multimedia', function() {
	gulp.src(__dirname + '/_source/media/**/*')
		.pipe(gulp.dest(__dirname + '/public/assets/media/'));
});

gulp.task('reconnect',function(){
	gulp.src(__dirname + '/public/*.html')
	    .pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch(__dirname + '/_source/stylus/**/*', ['css','reconnect']);
	gulp.watch(__dirname + '/_source/images/**/*', ['images','reconnect']);
	gulp.watch(__dirname + '/_source/media/**/*', ['multimedia','reconnect']);
	gulp.watch(__dirname + '/_source/js/**/*', ['js','reconnect']);
	gulp.watch(__dirname + '/_source/jade/**/*.jade', ['templates','reconnect']);
	gulp.watch(__dirname + '/_source/jade/modules/**/*.styl', ['css','reconnect']);
	gulp.watch(__dirname + '/package.json',['templates','reconnect']);
});

gulp.task('default', ['templates','images','multimedia','css','js','watch','server']);