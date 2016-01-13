process.on('uncaughtException', console.log)

var chalk            = require('chalk'),
    concat           = require('gulp-concat'),
    execSync         = require('child_process').execSync,
    fs               = require('fs'),
    gulp             = require('gulp'),
    gutil            = require('gulp-util'),
    livereload       = require('gulp-livereload'),
    mkdirp           = require('mkdirp'),
    mocha            = require('gulp-mocha'),
    path             = require('path'),
    sequence         = require('run-sequence'),
    size             = require('gulp-size'),
    to5              = require('gulp-babel');

gulp.task('clean', function(done) {
  execSync('rm -rf public');
  done();
});

gulp.task('copy', function() {
  gulp.src(['./assets/**/*'])
    .pipe(gulp.dest(path.join(process.cwd(), './public/')))
});

gulp.task('watch-handlebars', function() {
  return gulp.src('**/*.hbs', { read: false })
    .pipe(livereload())
});

gulp.task('build-browser', ['build-browser-flexstrap', 'build-browser-jquery']);

gulp.task('build-browser-flexstrap', function() {

  gulp.src([
    './bower_components/flexstrap/src/index.js',
    './bower_components/flexstrap/src/components/base/component.js',
    './bower_components/flexstrap/src/components/navigation/index.js'
  ])
  .pipe(to5())
  .pipe(concat('flexstrap.js'))
  .pipe(gulp.dest('./public/js'));

})

gulp.task('build-browser-jquery', function() {
  gulp.src(['./bower_components/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('generate-app-icons', function(done) {
  mkdirp.sync(path.join(__dirname, '/public/icons'));

  var icons = fs.readFileSync(path.join(__dirname, './assets/icons/fontello.svg'), 'utf8');

  icons = icons.split('svg11.dtd">');
  icons = icons[1];
  icons = icons.split('<svg');

  var output = '<svg class="hidden"' + icons[1];

  fs.writeFileSync(path.join(__dirname, './public/icons/fontello.svg'), output, 'utf8');
  done();
});

require('paradigm-gulp-stylus')({
  dest: './public/css/app.css',
  gulp: gulp,
  imports: [
    'nib',
    path.join(__dirname, './bower_components/flexstrap/src/grid/_definitions.styl'),
    path.join(__dirname, './styles/base/_definitions.styl')
  ],
  paths: [
    __dirname + '/bower_components/flexstrap/src/components',
    __dirname + '/bower_components/flexstrap/src'
  ],
  src: [
    './bower_components/normalize.css/normalize.css',
    './bower_components/flexstrap/src/icons/animation.css',
    './assets/icons/fontello.css',
    './bower_components/flexstrap/src/index.styl',
    // READD AFTER SPLASH PAGE
    // './styles/partials/**/base.styl',
    // './styles/partials/**/xs.styl',
    // './styles/partials/**/sm.styl',
    // './styles/partials/**/md.styl',
    // './styles/partials/**/lg.styl',
    // './styles/partials/**/xl.styl',
    './styles/base/site.styl',
    './styles/components/hero/xs.styl',
    './styles/components/hero/sm.styl',
    './styles/components/hero/md.styl',
    './styles/components/hero/lg.styl',
    './styles/components/hero/xl.styl'
    // READD AFTER SPLASH PAGE
    // './styles/components/**/xs.styl',
    // './styles/components/**/sm.styl',
    // './styles/components/**/md.styl',
    // './styles/components/**/lg.styl',
    // './styles/components/**/xl.styl'
  ]
});

require('paradigm-gulp-watch')({
  gulp: gulp,
  livereload: livereload
});

gulp.task('build', function(done) {
  sequence(['copy', 'build-browser', 'styles'], done);
});

gulp.task('styles', ['stylus']);
gulp.task('w', ['watch']);
