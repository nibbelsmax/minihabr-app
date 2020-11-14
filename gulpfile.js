/* eslint-disable node/no-unpublished-require */

const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const nodemon = require("gulp-nodemon");

/* eslint-enable node/no-unpublished-require */

gulp.task("scss", () => {
  return gulp
    .src("dev/scss/**/*.scss")
    .pipe(sass())
    .pipe(
      autoprefixer(["last 15 version", "> 1%", "ie 8", "ie 7"], {
        cascade: true,
      })
    )
    .pipe(cssnano())
    .pipe(gulp.dest("public/stylesheets"));
});

gulp.task("scripts", () => {
  return (
    gulp
      .src([
        "dev/js/**/*.js",
        "node_modules/medium-editor/dist/js/medium-editor.min.js",
      ])
      .pipe(concat("scripts.js"))
      //.pipe(uglify())
      .pipe(gulp.dest("public/javascripts"))
  );
});

gulp.task(
  "default",
  gulp.series("scss", "scripts", () => {
    gulp.watch("dev/scss/**/*.scss", gulp.series("scss"));
    gulp.watch("dev/js/**/*.js", gulp.series("scripts"));

    return nodemon({
      script: "app.js",
    });
  })
);
