// Modules
const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass')(require('sass'));
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');

//Path
const path = {
  build: {
    html:   "./dist",
    css:    "./dist/css",
    js:     "./dist/js",
    fonts:  "./dist/fonts",
    icons:  "./dist/icons",
    image:  "./dist/image"
  },
  src: {
    html:   "./src/*.html",
    scss:   "./src/+(sass|scss)/*.+(scss|sass)",
    js:     "./src/js/**/*.js",
    fonts:  "./src/fonts/**/*",
    icons:  "./src/icons/**/*",
    image:  "./src/image/**/*"
  },
  watch: {
    html:   "./src/**/*.html",
    scss:   "./src/sass/**/*.+(scss|sass|css)",
    js:     "./src/js/**/*.js",
    fonts:  "./src/fonts/**/*",
    icons:  "./src/icons/**/*",
    image:  "./src/image/**/*"
  },
  buildFolder: "./dist",
  srcFolder: "./src",
};

//Tasks
gulp.task("removeAll", (done) => {
  del.sync(path.buildFolder);
  done();
});

gulp.task("serverOn", () => {
  browserSync.init({
    server: {
      baseDir: path.buildFolder
    },
    notify: true,
    port: 3000
  });
});

gulp.task("serverReload", (done) => {
  browserSync.reload();
  done();
});

gulp.task("copyHtml", () => {
  return gulp.src(path.src.html)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(path.build.html))
    .pipe(browserSync.stream());
});

gulp.task("copyCss", () => {
  return gulp.src(path.src.scss)
    .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(rename({
      dirname: "",
      basename: "style",
      prefix: "",
      suffix: ".min",
      extname: ".css"
    }))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS({ compatibility: 'ie8' }))

    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream());
});

gulp.task("copyScripts", () => {
  return gulp.src(path.src.js)
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
});

gulp.task("copyFonts", () => {
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .pipe(browserSync.stream());
});

gulp.task("copyIcons", () => {
  return gulp.src(path.src.icons)
    .pipe(gulp.dest(path.build.icons))
    .pipe(browserSync.stream());
});

gulp.task("copyImage", () => {
  return gulp.src(path.src.image)
    .pipe(imagemin())
    .pipe(gulp.dest(path.build.image))
    .pipe(browserSync.stream());
});


//main scripts gulp
const main = gulp.series("removeAll", "copyHtml", "copyCss", "copyScripts", "copyFonts", "copyIcons", "copyImage");
const dev = gulp.series(main, gulp.parallel(watcher, "serverOn"));


gulp.task('default', dev);

// watcher
function watcher() {
  gulp.watch(path.watch.html, gulp.series("copyHtml"));
  gulp.watch(path.watch.scss, gulp.series("copyCss"));
  gulp.watch(path.watch.js, gulp.series("copyScripts"));
  gulp.watch(path.watch.fonts, gulp.series("copyFonts"));
  gulp.watch(path.watch.icons, gulp.series("copyIcons"));
  gulp.watch(path.watch.image, gulp.series("copyImage"));
}

