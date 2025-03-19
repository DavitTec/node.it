var createError = require("http-errors");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users"); // test but not active
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// setting congiurations
dotenv.config();

const app = express();

// Serve static files from root public/
app.use(express.static(path.join(__dirname, "..", "public")));

// Fallback for SPA-like behavior (optional)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

// View engine setup
// Set up EJS as the view engine
console.log("Views directory:", path.join(__dirname, "views"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
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
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error", {
    title: "Error",
    status: err.status || 500,
    message: err.message,
    error: err, // Pass the full error object
    debug: process.env.DEBUG === "true", // Pass DEBUG as a boolean
  });
});

module.exports = app;
