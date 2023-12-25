var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const morgan = require("morgan"); // For logging HTTP requests
const bodyParser = require("body-parser");
require("dotenv").config();
const errorHandler = require("errorhandler");

require("dotenv").config();

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const username = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;
const dataname = process.env.DB_DATABASE_NAME;

// Connect to the database
mongoose
  .connect(
    ` mongodb+srv://${username}:${password}@${dataname}.jpcevue.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: " lolo poop jay",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://madhvi123:aayush1234@aashu-num.jpcevue.mongodb.net/?retryWrites=true&w=majority`,
      ttl: 14 * 24 * 60 * 60, // session TTL (optional)
    }),
  })
);
// midelwares
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const PORT =process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
