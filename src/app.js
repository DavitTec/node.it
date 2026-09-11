var createError = require("http-errors");
const express = require("express");
const path = require("path");
const config = require("./config");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users"); // test but not active
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const app = express();

// Serve root public/ under /public, matching the views' asset paths
// (and the static build's dist/public/, stage/public/ layout).
app.use("/public", express.static(path.join(__dirname, "..", "public")));

// CSS/JS sources are served directly from src/ in the live app — no build
// step needed here. The static build (generate-static.js) copies the same
// src/css, src/js into dist/css, dist/js instead, since there's no server
// there to serve them from.
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));

// View engine setup
// Set up EJS as the view engine
console.log("Views directory:", path.join(__dirname, "views"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger("dev"));

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter); // test but not active

// Custom 404 handler
app.use((req, res, next) => {
  next(createError(404)); // use for error.ejs
  //res.status(404).send("Error 404 Not Found"); // use for basic text
});

// Error handler (for non-404 errors)
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = config.mode !== "production" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error", {
    title: "Error",
    status: err.status || 500,
    message: err.message,
    error: err, // Pass the full error object
    debug: config.server.debug, // Pass DEBUG as a boolean
  });
});

module.exports = app;
