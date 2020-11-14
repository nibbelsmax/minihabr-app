const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const config = require("./config");
const routes = require("./routes");

// eslint-disable-next-line node/no-unpublished-require
const staticAsset = require("static-asset");
const router = require("./routes/comment");

//database
mongoose.Promise = global.Promise;
mongoose.set("debug", config.IS_PRODUCTION);

mongoose.connection
  .on("error", (error) => console.log(error))
  .on("close", () => console.log("Database connection close"))
  .once("open", () => {
    const info = mongoose.connections[0];
    console.log(`Connected to ${info.host}: ${info.port}/${info.name}`);
    //require('./mocks')();
  });

mongoose.connect(config.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//express
const app = express();

//Сессии
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUnitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

//sets and uses
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(staticAsset(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/javascripts",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);

//routes
app.use("/", routes.archive);
app.use("/api/auth", routes.auth);
app.use("/post", routes.post);
app.use("/comment", routes.comment);

//catch 404 error
app.use((req, res, next) => {
  const err = new Error("Not Found 404");
  err.status = 404;
  next(err);
});

//error handler
app.use((error, req, res) => {
  res.status(error.status || 500);
  res.render("error", {
    message: error.message,
    error: !config.IS_PRODUCTION ? error : {},
    title: "Ooops....",
  });
});

app.listen(config.PORT, () =>
  console.log(`Server is running on port ${config.PORT}`)
);
