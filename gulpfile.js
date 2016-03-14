process.on('uncaughtException', console.log)

var chalk                  = require('chalk'),
    concat                 = require('gulp-concat'),
    execSync               = require('child_process').execSync,
    fs                     = require('fs'),
    gulp                   = require('gulp'),
    gutil                  = require('gulp-util'),
    livereload             = require('gulp-livereload'),
    mkdirp                 = require('mkdirp'),
    nano                   = require('gulp-cssnano'),
    nodemon                = require('nodemon'),
    path                   = require('path'),
    postcss                = require('gulp-postcss'),
    postcssAutoprefixer    = require('autoprefixer'),
    postcssDiscardComments = require('postcss-discard-comments'),
    postcssFonts           = require('postcss-font-magician'),
    postcssMixins          = require('postcss-mixins'),
    postcssNested          = require('postcss-nested'),
    postcssVars            = require('postcss-simple-vars'),
    sourcemaps             = require('gulp-sourcemaps'),
    webpack                = require('webpack-stream')

var env = {
  'NODE_ENV': 'development'
}

gulp.task('clean', function(done) {
  execSync('rm -rf public')
  done()
})

gulp.task('copy', function() {
  gulp.src(['./assets/**/*'])
    .pipe(gulp.dest(path.join(process.cwd(), './public/')))
})

gulp.task('generate-app-icons', function(done) {
  mkdirp.sync(path.join(__dirname, '/public/icons'));

  var icons = fs.readFileSync(path.join(__dirname, './assets/icons/fontello.svg'), 'utf8');

  icons = icons.split('svg11.dtd">');
  icons = icons[1];
  icons = icons.split('<svg');

  var output = '<svg class="hidden"' + icons[1];

  fs.writeFileSync(path.join(__dirname, './public/icons/fontello.svg'), output, 'utf8');
  done();
})

gulp.task('postcss', function() {
  //flush cache of the global vars js
  delete require.cache[require.resolve('./styles/base/variables')];
  return gulp.src([
    './styles/base/base.css',
    './styles/blocks/**/xs.css',
    './styles/blocks/**/sm.css',
    './styles/blocks/**/md.css',
    './styles/blocks/**/lg.css',
  ])
  .pipe(sourcemaps.init())
  .pipe(postcss([
    postcssMixins({ mixinsDir:path.join(__dirname,'/styles/blocks/mixins/') }),
    postcssVars({ variables: require('./styles/base/variables') }),
    postcssFonts({
      hosted: './assets/fonts'
    }),
    postcssNested,
    postcssAutoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
    postcssDiscardComments
  ]))
  .pipe(concat('app.css'))
  .pipe(nano())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./public/css'))
})

gulp.task('vendor-styles', function() {

  return gulp.src([
    './bower_components/bootstrap/dist/css/bootstrap.css',
    './bower_components/font-awesome/css/font-awesome.min.css'
  ])
  .pipe(concat('vendor.css'))
  .pipe(nano())
  .pipe(gulp.dest('./public/css'))

})

gulp.task('watch', function () {

  nodemon({
    env: env,
    ext: 'hbs',
    ignore: ['*.css', '*.styl'],
    //nodeArgs: ['--debug'],
    script: 'index.js',
    watch: ['views/partials']
  })
  .on('start', function() {

    livereload.listen()

    gulp.watch(path.join(__dirname, './assets/**/*'),             ['copy-assets'])
    gulp.watch(path.join(__dirname, './styles/blocks/**/*.css'),  ['postcss'])
    gulp.watch(path.join(__dirname, './styles/blocks/**/*.js'),   ['postcss']) //with postcss is possible to have js files to watch
    gulp.watch(path.join(__dirname, './public/**/*.css'),         livereload.changed)
    gulp.watch(path.join(__dirname, './public/**/*.js'),          livereload.changed)
    gulp.watch(path.join(__dirname, './app/**/*.js'),             ['webpack'])
    gulp.watch(path.join(__dirname, './views/**/*.hbs'),          livereload.reload)
    gulp.watch(path.join(__dirname, './views/helpers/*.js'),      livereload.reload)

  })
  //.on('change', ['lint'])
  .on('restart', function () {

    var files = arguments[0]

    files.forEach( function(file) {
      file = file.replace(process.cwd(), '') // Just show relative file path.

      console.log('File changed:', chalk.yellow(file))
    })

  })

})

gulp.task('webpack', function() {

  gulp.src([])
  .pipe(webpack(require('./webpack.config')))
  .pipe(gulp.dest('./public/js/'))

})

gulp.task('b', ['build'])
gulp.task('build', ['copy', 'styles', 'webpack'])

gulp.task('styles', ['vendor-styles', 'postcss'])
gulp.task('w', ['build', 'watch'])
